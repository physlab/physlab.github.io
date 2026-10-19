import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";
import { submitLab } from "@/lib/submit-lab";
import { ImageCanvas } from "./image-canvas";

// Полотно для перетягування фото учнями. Реекспортуємо тут, щоб лабораторні
// роботи підключали його так само, як інші елементи форми — одним імпортом
// з "@/components/lab/lab-form".
export { ImageCanvas } from "./image-canvas";

type LabFormContextValue = {
  values: Record<string, string>;
  setValue: (id: string, value: string) => void;
  registerHeader: (id: string, text: string) => void;
};

const LabFormContext = createContext<LabFormContextValue | null>(null);

const sendEnabled = true;

function useLabForm() {
  const ctx = useContext(LabFormContext);
  if (!ctx)
    throw new Error("Компоненти лабораторної мають бути всередині <LabForm>");
  return ctx;
}

type Status = "idle" | "sending" | "sent" | "error";

/* ------------------------------------------------------------------ */
/*  Допоміжні функції для генерації PDF (портовано з add_lab.js)      */
/* ------------------------------------------------------------------ */

// Кешуємо шрифт у пам'яті модуля, щоб не качати його повторно
// при кожному натисканні кнопки "Скачати PDF" в межах однієї сесії.
let cachedCyrillicFontBase64: string | null = null;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
}

// jsPDF за замовчуванням вміє малювати текст лише шрифтом Helvetica,
// який не має кириличних гліфів. Тут підвантажуємо шрифт PT Sans
// (підтримує кирилицю) і реєструємо його в jsPDF.
async function loadCyrillicFont(pdf: jsPDF): Promise<boolean> {
  try {
    if (!cachedCyrillicFontBase64) {
      const res = await fetch(
        "https://raw.githubusercontent.com/google/fonts/main/ofl/ptsans/PT_Sans-Web-Regular.ttf",
      );
      if (!res.ok) throw new Error("Не вдалося завантажити файл шрифту");
      const buffer = await res.arrayBuffer();
      cachedCyrillicFontBase64 = arrayBufferToBase64(buffer);
    }
    pdf.addFileToVFS("PTSans-Regular.ttf", cachedCyrillicFontBase64);
    pdf.addFont("PTSans-Regular.ttf", "PTSans", "normal");
    return true;
  } catch (e) {
    console.warn(
      "Не вдалося підключити кириличний шрифт до PDF, текст технічної сторінки може бути нечитабельним:",
      e,
    );
    return false;
  }
}

function getBrowserName(): string {
  const ua = navigator.userAgent;
  let match: RegExpMatchArray | null;
  if ((match = ua.match(/Edg\/([\d.]+)/))) return `Edge ${match[1]}`;
  if ((match = ua.match(/OPR\/([\d.]+)/))) return `Opera ${match[1]}`;
  if ((match = ua.match(/Chrome\/([\d.]+)/)) && !ua.includes("Edg"))
    return `Chrome ${match[1]}`;
  if ((match = ua.match(/Firefox\/([\d.]+)/))) return `Firefox ${match[1]}`;
  if ((match = ua.match(/Version\/([\d.]+).*Safari/)))
    return `Safari ${match[1]}`;
  return "Невідомий браузер";
}

// Збирає технічні дані, доступні у браузері клієнта.
// IP-адресу браузер сам не знає — її визначає зовнішній сервіс api.ipify.org.
async function getClientTechInfo(): Promise<Record<string, string>> {
  const now = new Date();

  const info: Record<string, string> = {
    "Дата створення файлу": now.toLocaleDateString("uk-UA"),
    "Час створення файлу": now.toLocaleTimeString("uk-UA"),
    Браузер: getBrowserName(),
    "Операційна система / платформа":
      navigator.platform ||
      (navigator as unknown as { userAgentData?: { platform?: string } })
        .userAgentData?.platform ||
      "н/д",
    "Мова браузера": navigator.language || "н/д",
    "Роздільна здатність екрана": `${screen.width}×${screen.height}px`,
    "Розмір вікна браузера": `${window.innerWidth}×${window.innerHeight}px`,
    "Часовий пояс": Intl.DateTimeFormat().resolvedOptions().timeZone || "н/д",
    "IP-адреса": "не вдалося визначити",
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch("https://api.ipify.org?format=json", {
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await res.json();
    if (data && data.ip) info["IP-адреса"] = data.ip;
  } catch (e) {
    console.warn("Не вдалося визначити IP-адресу:", e);
  }

  return info;
}

// Додає в PDF окрему сторінку з технічною інформацією (справжній текст, а не картинка)
function addTechInfoPage(
  pdf: jsPDF,
  techInfo: Record<string, string>,
  pageWidth: number,
  hasCyrillicFont: boolean,
) {
  pdf.addPage();
  pdf.setFont(hasCyrillicFont ? "PTSans" : "helvetica", "normal");

  let y = 20;
  pdf.setFontSize(13);
  pdf.setTextColor(30, 30, 30);
  pdf.text("Технічна інформація про створення документа", 10, y);
  y += 4;
  pdf.setDrawColor(200, 200, 200);
  pdf.line(10, y, pageWidth - 10, y);
  y += 10;

  pdf.setFontSize(10);
  pdf.setTextColor(70, 70, 70);
  Object.entries(techInfo).forEach(([key, value]) => {
    pdf.text(`${key}: ${value}`, 10, y);
    y += 7;
  });

  y += 3;
  pdf.setFontSize(8);
  pdf.setTextColor(150, 150, 150);
  pdf.text(
    "Дані зібрано автоматично на пристрої користувача під час формування файлу.",
    10,
    y,
  );
}

// Чекає, поки всі <img> на сторінці завантажаться (включно з lazy-loaded),
// інакше html2canvas може встигнути зробити знімок до появи картинки.
async function waitForImages(root: HTMLElement): Promise<void> {
  const images = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    images.map((img) => {
      // Знімаємо lazy-loading, щоб браузер довантажив картинку одразу
      if (img.loading === "lazy") img.loading = "eager";
      // Для картинок з іншого домену проставляємо crossOrigin, інакше
      // навіть з useCORS:true у html2canvas вони можуть не намалюватись.
      try {
        const isCrossOrigin =
          new URL(img.src, window.location.href).origin !==
          window.location.origin;
        if (isCrossOrigin && !img.crossOrigin) {
          img.crossOrigin = "anonymous";
          // Зміна crossOrigin змушує браузер перезавантажити картинку
          const src = img.src;
          img.src = "";
          img.src = src;
        }
      } catch {
        // ігноруємо некоректні URL (наприклад, data: URI)
      }
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.addEventListener("load", () => resolve(), { once: true });
        img.addEventListener("error", () => resolve(), { once: true });
        // На випадок, якщо подія так і не спрацює
        setTimeout(resolve, 5000);
      });
    }),
  );
}


/* ------------------------------------------------------------------ */
/*  Заповнені поля → звичайні блоки, розумне розбиття на сторінки      */
/* ------------------------------------------------------------------ */

const TEXT_LIKE_INPUT_TYPES = new Set([
  "",
  "text",
  "number",
  "email",
  "search",
  "tel",
  "url",
]);

// Властивості, які переносимо з поля на блок, що його замінює,
// щоб у PDF вигляд клітинки/поля лишився таким самим.
const COPIED_STYLE_PROPS = [
  "boxSizing",
  "width",
  "minWidth",
  "maxWidth",
  "marginTop",
  "marginRight",
  "marginBottom",
  "marginLeft",
  "paddingTop",
  "paddingRight",
  "paddingBottom",
  "paddingLeft",
  "borderTopWidth",
  "borderRightWidth",
  "borderBottomWidth",
  "borderLeftWidth",
  "borderTopStyle",
  "borderRightStyle",
  "borderBottomStyle",
  "borderLeftStyle",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomLeftRadius",
  "borderBottomRightRadius",
  "backgroundColor",
  "color",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "fontStyle",
  "lineHeight",
  "letterSpacing",
  "textAlign",
] as const;

/**
 * Замінює в переданому документі (клоні для знімку) усі текстові
 * <input> та <textarea> на <div>, у який вписано значення з живої сторінки.
 * Символи переносу рядків перетворюються на <br>, висота блоку росте
 * разом з текстом — тож нічого не ховається за межами поля.
 */
function replaceFieldsWithDivs(liveRoot: HTMLElement, clonedDoc: Document) {
  const liveFields = Array.from(
    liveRoot.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      "input, textarea",
    ),
  );
  const clonedFields = Array.from(
    clonedDoc.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      "input, textarea",
    ),
  );
  const view = clonedDoc.defaultView;
  if (!view) return;

  liveFields.forEach((liveEl, i) => {
    const clonedEl = clonedFields[i];
    if (!clonedEl) return;
    const isTextarea = liveEl.tagName === "TEXTAREA";
    if (
      !isTextarea &&
      !TEXT_LIKE_INPUT_TYPES.has((liveEl as HTMLInputElement).type ?? "")
    ) {
      return; // checkbox, file, range тощо — не чіпаємо
    }

    const value = liveEl.value ?? "";
    const computed = view.getComputedStyle(clonedEl);
    const originalHeight = clonedEl.getBoundingClientRect().height;

    const div = clonedDoc.createElement("div");
    COPIED_STYLE_PROPS.forEach((prop) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (div.style as any)[prop] = (computed as any)[prop];
    });
    div.style.display = "block";
    div.style.height = "auto";
    // Мінімальна висота = висота поля, щоб порожнє поле лишилось рамкою
    div.style.minHeight = `${originalHeight}px`;
    div.style.whiteSpace = "normal";
    div.style.overflow = "visible";
    div.style.overflowWrap = "anywhere";
    div.style.wordBreak = "break-word";
    div.style.verticalAlign = "top";
    // Переносимо id, щоб не плуталися стилі/селектори
    div.setAttribute("data-pdf-field", clonedEl.id || "");

    const lines = value.replace(/\r\n?/g, "\n").split("\n");
    lines.forEach((line, idx) => {
      if (idx > 0) div.appendChild(clonedDoc.createElement("br"));
      div.appendChild(clonedDoc.createTextNode(line));
    });

    clonedEl.replaceWith(div);
  });
}

type Interval = [number, number];

/**
 * Збирає вертикальні "заборонені" інтервали (у CSS-пікселях від верху
 * документа), всередині яких не можна різати сторінку PDF:
 * кожен рядок тексту, картинки/полотна, рядки таблиць, заголовки
 * (разом з відступом до наступного рядка) та елементи з класом pdf-keep.
 */
function collectUnbreakableIntervals(doc: Document): Interval[] {
  const root = doc.body;
  const docTop = doc.documentElement.getBoundingClientRect().top;
  const result: Interval[] = [];
  const push = (top: number, bottom: number) => {
    if (bottom - top > 0.5) result.push([top - docTop, bottom - docTop]);
  };

  // Рядки тексту
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const range = doc.createRange();
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const parent = (node as Text).parentElement;
    if (!parent) continue;
    const tag = parent.tagName;
    if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") continue;
    if (!(node as Text).data.trim()) continue;
    range.selectNodeContents(node);
    for (const r of Array.from(range.getClientRects())) {
      push(r.top - 1, r.bottom + 1);
    }
  }

  // Неподільні елементи
  root
    .querySelectorAll("img, canvas, svg, tr, .pdf-keep")
    .forEach((el) => {
      const r = el.getBoundingClientRect();
      push(r.top, r.bottom);
    });

  // Заголовки не повинні лишатися самі внизу сторінки
  root.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((el) => {
    const r = el.getBoundingClientRect();
    push(r.top, r.bottom + 28);
  });

  return result.sort((a, b) => a[0] - b[0]);
}

/**
 * Обчислює позиції розрізів: кожна сторінка заповнюється максимально,
 * але розріз завжди припадає на проміжок між блоками/рядками.
 * Усі значення — у CSS-пікселях.
 */
function computePageBreaks(
  intervals: Interval[],
  contentEnd: number,
  pageHeight: number,
): number[] {
  const breaks: number[] = [0];
  let pos = 0;
  while (contentEnd - pos > pageHeight + 0.5) {
    const limit = pos + pageHeight;
    let y = limit;
    // Поки точка розрізу потрапляє всередину неподільного блоку —
    // піднімаємо її над цим блоком.
    for (let guard = 0; guard < 10000; guard++) {
      const hit = intervals.find(([a, b]) => a < y && y < b);
      if (!hit) break;
      y = hit[0] - 1;
    }
    // Якщо блок вищий за сторінку і підходящого місця немає — ріжемо по ліміту
    if (y <= pos + pageHeight * 0.3) y = limit;
    breaks.push(y);
    pos = y;
  }
  breaks.push(contentEnd);
  return breaks;
}

export function LabForm({
  sheetName,
  children,
}: {
  sheetName: string;
  children: ReactNode;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  const headers = useRef<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Оточення, яке потрапляє у знімок PDF (форма + кнопки, без сторонньої обв'язки сторінки)
  const containerRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const setValue = useCallback((id: string, value: string) => {
    setValues((prev) => ({ ...prev, [id]: value }));
    setStatus("idle");
    setMessage(null);
  }, []);

  const registerHeader = useCallback((id: string, text: string) => {
    headers.current[id] = text;
  }, []);

  const ctx = useMemo(
    () => ({ values, setValue, registerHeader }),
    [values, setValue, registerHeader],
  );

  const handleSubmit = async () => {
    const missing: string[] = [];
    if (!values.name?.trim())
      missing.push("Ви не вписали своє прізвище та ім'я");
    if (!values.klas?.trim()) missing.push("Ви не вписали свій клас");
    if (missing.length) {
      setStatus("error");
      setMessage(`${missing.join(". ")}. Заповніть ці поля перед відправкою.`);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setStatus("sending");
    setMessage(null);
    try {
      await submitLab(sheetName, { ...headers.current, ...values });
      setStatus("sent");
      setMessage("Роботу відправлено на перевірку.");
    } catch {
      setStatus("error");
      setMessage("Сталася помилка під час відправлення. Спробуйте ще раз.");
    }
  };

  const generatePDF = async () => {
    // Знімаємо всю сторінку (document.body), а не лише контейнер форми,
    // щоб у PDF потрапила й шапка сторінки, яка рендериться над <LabForm>.
    const element = document.body;
    if (!element) return;

    setPdfLoading(true);
    // Ховаємо кнопки на час знімку, щоб вони не потрапили у PDF
    const prevVisibility = actionsRef.current?.style.visibility;
    if (actionsRef.current) actionsRef.current.style.visibility = "hidden";

    // Елементи керування, які не мають сенсу на надрукованій сторінці
    // (кнопки видалення/зміни розміру фото на ImageCanvas, підказка
    // "перетягніть сюди фото" тощо), позначаються класом pdf-hide — тут
    // вони ховаються лише на час знімку.
    const pdfHideEls = Array.from(
      element.querySelectorAll<HTMLElement>(".pdf-hide"),
    );
    const prevPdfHideVisibility = pdfHideEls.map((el) => el.style.visibility);
    pdfHideEls.forEach((el) => {
      el.style.visibility = "hidden";
    });

    // Таблиці в лабораторних обгорнуті в блок з класом overflow-x-auto —
    // він ховає частину широкої таблиці за горизонтальним скролом.
    // На час знімку для PDF прибираємо це обмеження, щоб уся таблиця
    // потрапила в документ і в PDF не було "прихованої" інформації.
    const scrollWrappers = Array.from(
      element.querySelectorAll<HTMLElement>(".overflow-x-auto"),
    );
    const prevOverflowX = scrollWrappers.map((el) => el.style.overflowX);
    scrollWrappers.forEach((el) => {
      el.style.overflowX = "visible";
    });

    try {
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      // Робимо якісний знімок форми із заповненими даними,
      // паралельно збираємо технічну інформацію про клієнта
      // та підвантажуємо кириличний шрифт для тексту техсторінки
      // Чекаємо, поки браузер довантажить кастомні шрифти та всі картинки —
      // інакше знімок може встигнути зробитись до їх появи.
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
      await waitForImages(element);

      // Лімити розміру canvas у браузерах (особливо iOS Safari ≈ 16.7 млн px):
      // для дуже довгих сторінок зменшуємо масштаб, щоб знімок не обрізався.
      const docWidth = Math.max(
        document.documentElement.scrollWidth,
        document.body.scrollWidth,
      );
      const docHeightEstimate =
        Math.max(
          document.documentElement.scrollHeight,
          document.body.scrollHeight,
        ) * 1.3; // запас: блоки замість полів можуть стати вищими
      const scale = Math.max(
        0.6,
        Math.min(
          1.5,
          16000 / docHeightEstimate,
          Math.sqrt(16_000_000 / (docWidth * docHeightEstimate)),
        ),
      );

      // Проміжки, де дозволено розрізати сторінку (заповнюється в onclone)
      let intervals: Interval[] = [];
      let measuredContentEnd = 0;

      const [canvas, techInfo, hasCyrillicFont] = await Promise.all([
        html2canvas(element, {
          useCORS: true,
          scale,
          // html2canvas-pro сам коректно парсить сучасні CSS-кольори
          // (oklch/oklab тощо) у класичному рендері — foreignObjectRendering
          // тут не потрібен і до того ж ламає відображення картинок.
          foreignObjectRendering: false,
          backgroundColor: "#ffffff",
          imageTimeout: 15000,
          onclone: (clonedDoc: Document) => {
            // 1) input/textarea → div з повним текстом (переноси → <br>)
            replaceFieldsWithDivs(element, clonedDoc);
            // 2) міряємо макет уже після заміни, щоб знати, де можна різати
            intervals = collectUnbreakableIntervals(clonedDoc);
            const docTop = clonedDoc.documentElement.getBoundingClientRect().top;
            const bodyRect = clonedDoc.body.getBoundingClientRect();
            measuredContentEnd = bodyRect.bottom - docTop;
          },
        }),
        getClientTechInfo(),
        loadCyrillicFont(pdf),
      ]);

      // ---- Розбиття на сторінки A4 без розрізання рядків ----
      const pageWidthMm = 210;
      const pageHeightMm = 297;
      const marginYmm = 8; // білі поля зверху й знизу кожної сторінки

      const cssWidth = canvas.width / scale;
      const cssTotal = canvas.height / scale;
      // Прибираємо порожній "хвіст" внизу сторінки (відступи)
      const lastBottom = intervals.reduce((m, [, b]) => Math.max(m, b), 0);
      const contentEnd = Math.min(
        cssTotal,
        Math.max(lastBottom + 24, 1),
        measuredContentEnd || cssTotal,
      );
      const usableMm = pageHeightMm - 2 * marginYmm;
      const pageHeightCss = (usableMm / pageWidthMm) * cssWidth;

      const breaks = computePageBreaks(intervals, contentEnd, pageHeightCss);

      for (let i = 0; i < breaks.length - 1; i++) {
        const srcY = Math.round(breaks[i] * scale);
        const srcH = Math.min(
          canvas.height - srcY,
          Math.round(breaks[i + 1] * scale) - srcY,
        );
        if (srcH <= 0) continue;

        const slice = document.createElement("canvas");
        slice.width = canvas.width;
        slice.height = srcH;
        const sctx = slice.getContext("2d");
        if (!sctx) throw new Error("Не вдалося створити canvas для сторінки");
        sctx.fillStyle = "#ffffff";
        sctx.fillRect(0, 0, slice.width, slice.height);
        sctx.drawImage(
          canvas,
          0,
          srcY,
          canvas.width,
          srcH,
          0,
          0,
          canvas.width,
          srcH,
        );

        if (i > 0) pdf.addPage();
        pdf.addImage(
          slice.toDataURL("image/jpeg", 0.85),
          "JPEG",
          0,
          marginYmm,
          pageWidthMm,
          (srcH / canvas.width) * pageWidthMm,
          undefined,
          "MEDIUM",
        );
      }

      const imgWidth = pageWidthMm;

      // Технічна інформація йде окремою сторінкою в самому кінці файлу
      addTechInfoPage(pdf, techInfo, imgWidth, hasCyrillicFont);

      pdf.save(`${values.klas} ${values.name}.pdf`);
    } catch (error) {
      console.error("Помилка генерації PDF:", error);
      alert(
        "Не вдалося створити файл через обмеження браузера. Відкриваємо друк.",
      );
      window.print();
    } finally {
      if (actionsRef.current)
        actionsRef.current.style.visibility = prevVisibility ?? "visible";
      pdfHideEls.forEach((el, i) => {
        el.style.visibility = prevPdfHideVisibility[i];
      });
      scrollWrappers.forEach((el, i) => {
        el.style.overflowX = prevOverflowX[i];
      });
      setPdfLoading(false);
    }
  };

  return (
    <LabFormContext.Provider value={ctx}>
      <div ref={containerRef}>
        {children}
        <div
          ref={actionsRef}
          className="mt-12 flex flex-col items-center gap-3"
        >
          {message && (
            <p
              className={`text-sm font-medium ${
                status === "error"
                  ? "text-destructive"
                  : "text-accent-foreground"
              }`}
            >
              {message}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={status === "sending" || status === "sent"}
              className="rounded-full bg-gradient-accent px-10 py-3 font-display text-base font-semibold text-accent-foreground shadow-lift transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              hidden={sendEnabled}
            >
              {status === "sending"
                ? "Відправляємо…"
                : status === "sent"
                  ? "Відправлено"
                  : "Відправити"}
            </button>
            <button
              type="button"
              onClick={generatePDF}
              disabled={status === "sending" || status === "sent" || pdfLoading}
              className="rounded-full bg-gradient-accent px-10 py-3 font-display text-base font-semibold text-accent-foreground shadow-lift transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pdfLoading ? "Формуємо PDF…" : "Скачати PDF"}
            </button>
          </div>
        </div>
      </div>
    </LabFormContext.Provider>
  );
}

export function StudentBlock() {
  return (
    <div className="grid gap-4 rounded-2xl border border-border bg-card p-6 shadow-card sm:grid-cols-2">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-foreground">
          Впишіть ваш клас
        </span>
        <TextInput id="klas" placeholder="Клас" />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-semibold text-foreground">
          Впишіть ваше прізвище та ім'я
        </span>
        <TextInput id="name" placeholder="Прізвище, ім'я" />
      </label>
    </div>
  );
}

export function TextInput({
  id,
  placeholder,
  type = "text",
}: {
  id: string;
  placeholder?: string;
  type?: "text" | "number";
}) {
  const { values, setValue } = useLabForm();
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={values[id] ?? ""}
      onChange={(e) => setValue(id, e.target.value)}
      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
    />
  );
}

export function Answer({ id, rows = 4 }: { id: string; rows?: number }) {
  const { values, setValue } = useLabForm();
  return (
    <textarea
      id={id}
      rows={rows}
      value={values[id] ?? ""}
      onChange={(e) => setValue(id, e.target.value)}
      className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
    />
  );
}

/** Клітинка таблиці з полем вводу */
export function Cell({
  id,
  type = "text",
}: {
  id: string;
  type?: "text" | "number";
}) {
  const { values, setValue } = useLabForm();
  return (
    <input
      id={id}
      type={type}
      value={values[id] ?? ""}
      onChange={(e) => setValue(id, e.target.value)}
      className="w-full-50 min-w-16 rounded-md border border-input bg-background px-2 py-1.5 text-center text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
    />
  );
}

/** Заголовок стовпця — його текст також потрапляє у звіт, як у старій версії */
export function HeaderCell({
  id,
  children,
  text,
  ...rest
}: {
  id: string;
  children: ReactNode;
  text: string;
  rowSpan?: number;
  colSpan?: number;
}) {
  const { registerHeader } = useLabForm();
  registerHeader(id, text);
  return (
    <th
      {...rest}
      className="border border-border bg-surface px-3 py-2 text-center text-xs font-semibold text-foreground sm:text-sm"
    >
      {children}
    </th>
  );
}

export function LabTable({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card p-2 shadow-card">
      <table className="w-full border-collapse">{children}</table>
    </div>
  );
}

export function Td({
  children,
  rowSpan,
  colSpan,
}: {
  children?: ReactNode;
  rowSpan?: number;
  colSpan?: number;
}) {
  return (
    <td
      rowSpan={rowSpan}
      colSpan={colSpan}
      className="border border-border px-2 py-1.5 text-center align-middle text-sm text-foreground"
    >
      {children}
    </td>
  );
}
