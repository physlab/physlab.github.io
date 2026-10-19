"use client";

import { useEffect, useRef, useState } from "react";
import { Chart, registerables } from "chart.js";
import {
  LabForm,
  StudentBlock,
  Answer,
  Cell,
  HeaderCell,
  LabTable,
  Td,
  ImageCanvas,
} from "@/components/lab/lab-form";
import { Section } from "@/components/lab/lab-shell";
import { Formula } from "@/components/formula";
import type { LabDefinition } from "./types";

Chart.register(...registerables);

const STEPS = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const SERIES = [1, 2, 3] as const;
const SERIES_COLORS: Record<number, string> = {
  1: "#4facfe",
  2: "#43e97b",
  3: "#fa709a",
};
const THEORY_COLOR = "#764ba2";
const THEORY_VALUES = STEPS.map((n) => 128 * Math.pow(2, -n));

/**
 * Writes into a Cell's underlying <input> the same way a real keystroke
 * would (via the native value setter + a dispatched "input" event), so
 * the app's own state management picks up the change — simply setting
 * `.value` directly would not trigger React's onChange.
 */
function setCellValue(id: string, value: number) {
  const el = document.getElementById(id) as HTMLInputElement | null;
  if (!el) return;
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  )?.set;
  setter?.call(el, String(value));
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

/**
 * Same coin-flip algorithm as the original script: simulate each coin
 * individually with a 50/50 chance rather than drawing from a binomial
 * distribution directly, so the "clumping" behaves like real coins.
 */
function getRandomHeads(total: number): number {
  let heads = 0;
  for (let i = 0; i < total; i++) {
    if (Math.random() < 0.5) heads++;
  }
  return heads;
}

function CoinFlipSimulator() {
  const [series, setSeries] = useState<number>(1);
  const [step, setStep] = useState(0);
  const [total, setTotal] = useState(128);
  const [heads, setHeads] = useState<number | null>(null);
  const [tails, setTails] = useState<number | null>(null);

  const selectSeries = (s: number) => {
    setSeries(s);
    setStep(0);
    setTotal(128);
    setHeads(null);
    setTails(null);
  };

  const resetSeries = () => {
    setStep(0);
    setTotal(128);
    setHeads(null);
    setTails(null);
  };

  const shake = () => {
    if (step >= 8) return;
    const h = getRandomHeads(total);
    const t = total - h;
    setHeads(h);
    setTails(t);
    setStep((s) => s + 1);
    setTotal(h);
  };

  const copyToTable = () => {
    if (heads === null || tails === null) return;
    setCellValue(`N_s${series}_${step}`, heads);
    setCellValue(`Nd_s${series}_${step}`, tails);
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm font-medium">Симулятор підкидання монет</p>

      <div className="mb-3 flex gap-2">
        {SERIES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => selectSeries(s)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
              series === s
                ? "bg-gradient-accent text-accent-foreground"
                : "border-border text-foreground"
            }`}
          >
            Серія {s}
          </button>
        ))}
      </div>

      <p className="mb-2 text-sm text-muted-foreground">
        Крок n = {step} / 8 &nbsp;•&nbsp; Монет у грі: {total}
      </p>

      <div className="mb-3 flex gap-4">
        <div className="flex-1 rounded-lg bg-background p-3 text-center">
          <div className="text-xs text-muted-foreground">
            Герб (не розпалися, N)
          </div>
          <div className="text-2xl font-bold">{heads ?? "—"}</div>
        </div>
        <div className="flex-1 rounded-lg bg-background p-3 text-center">
          <div className="text-xs text-muted-foreground">
            Цифра (розпалися, N&apos;)
          </div>
          <div className="text-2xl font-bold">{tails ?? "—"}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={shake}
          disabled={step >= 8}
          className="rounded-full bg-gradient-accent px-5 py-2 text-sm font-medium text-accent-foreground disabled:opacity-50"
        >
          Підкинути
        </button>
        <button
          type="button"
          onClick={copyToTable}
          disabled={heads === null}
          className="rounded-full border border-border px-5 py-2 text-sm font-medium disabled:opacity-50"
        >
          → У таблицю (n = {step})
        </button>
        <button
          type="button"
          onClick={resetSeries}
          className="rounded-full border border-border px-5 py-2 text-sm font-medium"
        >
          Скинути серію {series}
        </button>
      </div>
    </div>
  );
}

function getSeriesData(series: number): Array<number | null> {
  return STEPS.map((n) => {
    if (n === 0) return 128;
    const input = document.getElementById(
      `N_s${series}_${n}`,
    ) as HTMLInputElement | null;
    const v = parseFloat(input?.value ?? "");
    return Number.isNaN(v) ? null : v;
  });
}

/**
 * Live chart of N(n) for the three coin-flip series plus the theoretical
 * N = 128·2⁻ⁿ curve, redrawn whenever a table Cell changes.
 */
function DecayChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const chart = new Chart<"line", Array<number | null>, number>(canvas, {
      type: "line",
      data: {
        labels: STEPS,
        datasets: [
          {
            label: "Теоретична N=128·2⁻ⁿ",
            data: THEORY_VALUES,
            borderColor: THEORY_COLOR,
            borderDash: [6, 4],
            backgroundColor: "transparent",
            pointRadius: 3,
          },
          ...SERIES.map((s) => ({
            label: `Серія ${s}`,
            data: [] as Array<number | null>,
            borderColor: SERIES_COLORS[s],
            backgroundColor: "transparent",
            pointRadius: 4,
            spanGaps: true,
          })),
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: "Кількість кидків n" } },
          y: {
            min: 0,
            max: 128,
            title: { display: true, text: "Кількість ядер N" },
          },
        },
      },
    });

    const redraw = () => {
      SERIES.forEach((s, i) => {
        chart.data.datasets[i + 1].data = getSeriesData(s);
      });
      chart.update();
    };

    const inputs = SERIES.flatMap((s) =>
      STEPS.filter((n) => n !== 0).map((n) =>
        document.getElementById(`N_s${s}_${n}`),
      ),
    ).filter((el): el is HTMLInputElement => el !== null);

    inputs.forEach((input) => input.addEventListener("input", redraw));
    redraw();

    return () => {
      inputs.forEach((input) => input.removeEventListener("input", redraw));
      chart.destroy();
    };
  }, []);

  return (
    <div className="chart-container">
      <canvas ref={canvasRef} id="decayChart" width={700} height={400} />
    </div>
  );
}

function SeriesTable({ series }: { series: number }) {
  return (
    <LabTable>
      <thead>
        <tr>
          <HeaderCell id={`h_s${series}_label`} text="Показник">
            Показник
          </HeaderCell>
          {STEPS.map((n) => (
            <HeaderCell key={n} id={`h_s${series}_n${n}`} text={`n = ${n}`}>
              n = {n}
            </HeaderCell>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <Td>N (не розпалися)</Td>
          {STEPS.map((n) =>
            n === 0 ? (
              <Td key={n}>128</Td>
            ) : (
              <Td key={n}>
                <Cell id={`N_s${series}_${n}`} />
              </Td>
            ),
          )}
        </tr>
        <tr>
          <Td>N&apos; (розпалися)</Td>
          {STEPS.map((n) =>
            n === 0 ? (
              <Td key={n}>0</Td>
            ) : (
              <Td key={n}>
                <Cell id={`Nd_s${series}_${n}`} />
              </Td>
            ),
          )}
        </tr>
      </tbody>
    </LabTable>
  );
}

function Content() {
  return (
    <LabForm sheetName="Моделювання радіоактивного розпаду (симуляція)">
      <StudentBlock />

      <Section title="Опис моделі">
        <p>
          Розпад того чи іншого ядра — подія випадкова. Такою самою
          випадковою подією є випадання «герба» або «цифри» після кидка
          монети. У цьому варіанті роботи кидки монет виконує вбудований
          симулятор нижче, за тим самим принципом: кожна «монета»
          незалежно з імовірністю 50% випадає «гербом» (ядро не
          розпалося) або «цифрою» (ядро розпалося).
        </p>
        <p>
          Кожен кидок купи монет відповідатиме періоду піврозпаду T
          <sub>½</sub>, а кількість n кидків — кількості періодів
          піврозпаду, тобто часу спостереження:
        </p>
        <Formula math="t = n \, T_{1/2}" />
      </Section>

      <Section title="Експеримент">
        <p>
          <em>Результати симуляції відразу заносьте до таблиць.</em>
        </p>

        <p>
          Оберіть серію, натисніть <strong>«Підкинути»</strong> — симулятор
          «кине» поточну кількість монет і покаже, скільки випало «гербом»
          (не розпалися) і «цифрою» (розпалися). Натисніть{" "}
          <strong>«→ У таблицю»</strong>, щоб перенести результат у
          відповідну клітинку таблиці для поточного кроку n. Повторюйте,
          доки не залишиться одна монета з «гербом», але не більше ніж 8
          кидків. Потім оберіть наступну серію і повторіть.
        </p>

        <CoinFlipSimulator />

        {SERIES.map((s) => (
          <div key={s}>
            <p>
              <strong>Таблиця {s}. Серія кидків {s}</strong>&nbsp;&nbsp;
              Колір графіка: <Cell id={`color_s${s}`} />
            </p>
            <SeriesTable series={s} />
          </div>
        ))}
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>
          1–2. Графік залежності N(n) для кожної серії та теоретична
          залежність N = 128·2⁻ⁿ будуються автоматично на основі введених
          у таблиці даних:
        </p>
        <Formula math="N = N_0 \cdot 2^{-n}" />

        <DecayChart />

        <p>
          <strong>Таблиця 4. Теоретичний закон розпаду</strong>
        </p>
        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h4_label" text="Показник">
                Показник
              </HeaderCell>
              {STEPS.map((n) => (
                <HeaderCell key={n} id={`h4_n${n}`} text={`n = ${n}`}>
                  n = {n}
                </HeaderCell>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>N = 128·2⁻ⁿ</Td>
              {THEORY_VALUES.map((v, i) => (
                <Td key={i}>{v}</Td>
              ))}
            </tr>
          </tbody>
        </LabTable>

        <p>
          За бажанням можете додатково перемалювати графік на
          міліметровому папері та прикріпити фото:
        </p>
        <ImageCanvas
          label="Прикріпіть фото графіка N(n) з міліметрового паперу (необов'язково)"
          height={400}
          minHeight={250}
          maxHeight={700}
          maxImages={4}
        />
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          За результатами експерименту сформулюйте висновок, у якому
          поясніть, чому побудовані графіки не збігаються. Це є
          закономірністю чи використано недосконалу модель? Чи мають місце
          обидві причини?
        </p>
        <Answer id="v_conclusion" rows={6} />
      </Section>

      <Section title="Творче завдання">
        <p>
          З&apos;ясуйте, як вплине на якість моделі процесу радіоактивного
          розпаду, використаної в роботі, збільшення кількості монет у 3
          рази; зменшення кількості монет у 3 рази. За можливості
          перевірте свої припущення, змінивши початкове число монет у
          симуляторі (поле «Монет у грі» після скидання серії).
        </p>
        <Answer id="v_creative" rows={6} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "coin-decay-model-simulation",
  grade: 11,
  badge: "8.3",
  number: "№ 8",
  title: "Моделювання радіоактивного розпаду. Варіант 3 (симуляція)",
  goal:
    "змоделювавши радіоактивний розпад, перевірити на моделі закон радіоактивного розпаду.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Моделювання радіоактивного розпаду (симуляція)",
  meta: {
    title:
      "Моделювання радіоактивного розпаду (симуляція) — експериментальна робота №8 (11 клас), варіант 3",
    description:
      "Змоделюйте радіоактивний розпад за допомогою вбудованого симулятора підкидання монет і перевірте закон радіоактивного розпаду.",
  },
  Content,
};

export default lab;
