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

      const [canvas, techInfo, hasCyrillicFont] = await Promise.all([
        html2canvas(element, {
          useCORS: true,
          scale: 1.5,
          // html2canvas-pro сам коректно парсить сучасні CSS-кольори
          // (oklch/oklab тощо) у класичному рендері — foreignObjectRendering
          // тут не потрібен і до того ж ламає відображення картинок.
          foreignObjectRendering: false,
          backgroundColor: "#ffffff",
          imageTimeout: 15000,
          // Клон, який html2canvas будує внутрішньо для рендеру, іноді
          // не підхоплює поточні значення контрольованих React-полів —
          // прописуємо їх вручну.
          onclone: (clonedDoc: Document) => {
            const liveFields = element.querySelectorAll("input, textarea");
            const clonedFields = clonedDoc.querySelectorAll("input, textarea");
            liveFields.forEach((liveEl, i) => {
              const clonedEl = clonedFields[i] as
                HTMLInputElement | HTMLTextAreaElement | undefined;
              if (!clonedEl) return;
              if (liveEl.tagName === "TEXTAREA") {
                clonedEl.textContent = (liveEl as HTMLTextAreaElement).value;
              } else {
                clonedEl.setAttribute(
                  "value",
                  (liveEl as HTMLInputElement).value,
                );
              }
            });
          },
        }),
        getClientTechInfo(),
        loadCyrillicFont(pdf),
      ]);

      // JPEG замість PNG — головна економія на вазі файлу
      const imgData = canvas.toDataURL("image/jpeg", 0.85);

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(
        imgData,
        "JPEG",
        0,
        position,
        imgWidth,
        imgHeight,
        undefined,
        "MEDIUM",
      );
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(
          imgData,
          "JPEG",
          0,
          position,
          imgWidth,
          imgHeight,
          undefined,
          "MEDIUM",
        );
        heightLeft -= pageHeight;
      }

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
