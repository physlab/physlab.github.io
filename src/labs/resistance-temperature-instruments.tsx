"use client";

import { useEffect, useRef } from "react";
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
import { Figure, Section } from "@/components/lab/lab-shell";
import { Formula } from "@/components/formula";
import deviceScheme from "@/assets/resistance-temperature-device-scheme.png";
import setupPhoto from "@/assets/resistance-temperature-setup-photo.png";
import type { LabDefinition } from "./types";

Chart.register(...registerables);

type Point = { x: number; y: number };

// Температури, для яких заповнюється таблиця; id клітинок: R_30 … R_90
const TEMPS = [30, 40, 50, 60, 70, 80, 90];
const R_IDS = TEMPS.map((t) => `R_${t}`);

function readNumber(id: string): number {
  const el = document.getElementById(id) as HTMLInputElement | null;
  return parseFloat((el?.value ?? "").replace(",", "."));
}

function getPoints(): Point[] {
  const points: Point[] = [];

  // початкова точка (t0, R) також потрапляє на графік
  const t0 = readNumber("t0");
  const r0 = readNumber("R_t0");
  if (!Number.isNaN(t0) && !Number.isNaN(r0)) points.push({ x: t0, y: r0 });

  TEMPS.forEach((t, i) => {
    const r = readNumber(R_IDS[i]);
    if (!Number.isNaN(r)) points.push({ x: t, y: r });
  });
  points.sort((a, b) => a.x - b.x);
  return points;
}

/** Метод найменших квадратів R = a + b·t (a = R0, b = R0·α). */
function fitLine(points: Point[]) {
  const n = points.length;
  if (n < 2) return null;
  const mx = points.reduce((s, p) => s + p.x, 0) / n;
  const my = points.reduce((s, p) => s + p.y, 0) / n;
  const sxx = points.reduce((s, p) => s + (p.x - mx) ** 2, 0);
  if (sxx === 0) return null;
  const sxy = points.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0);
  const slope = sxy / sxx;
  return { slope, intercept: my - slope * mx };
}

/**
 * Графік R(t) на основі даних таблиці: виміряні точки та пряма, продовжена
 * до осі R (t = 0 °C), де вона дає R0; α оцінюється як slope / R0.
 */
function ResistanceChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const summaryRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const chart = new Chart<"line", Point[], number>(canvas, {
      type: "line",
      data: {
        datasets: [
          {
            label: "R(t)",
            data: [],
            borderColor: "transparent",
            backgroundColor: "#667eea",
            pointRadius: 6,
            showLine: false,
          },
          {
            label: "Пряма, продовжена до осі R",
            data: [],
            borderColor: "red",
            backgroundColor: "transparent",
            borderWidth: 2,
            pointRadius: 0,
            showLine: true,
            tension: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: "linear",
            min: 0,
            title: { display: true, text: "Температура t, °C" },
          },
          y: {
            title: { display: true, text: "Опір R, Ом" },
          },
        },
        plugins: { legend: { display: false } },
      },
    });

    const redraw = () => {
      const points = getPoints();
      const fit = fitLine(points);
      let line: Point[] = [];
      let summary = "";

      if (fit) {
        const maxT = Math.max(...points.map((p) => p.x));
        line = [
          { x: 0, y: fit.intercept },
          { x: maxT, y: fit.intercept + fit.slope * maxT },
        ];
        if (fit.intercept > 0) {
          const alpha = fit.slope / fit.intercept;
          summary = `Орієнтовно за побудованою прямою: R₀ ≈ ${fit.intercept.toFixed(2)} Ом, α ≈ ${alpha.toExponential(2)} °C⁻¹`;
        }
      }

      chart.data.datasets[0].data = points;
      chart.data.datasets[1].data = line;
      chart.update();
      if (summaryRef.current) summaryRef.current.textContent = summary;
    };

    const inputs = ["t0", "R_t0", ...R_IDS]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLInputElement => el !== null);

    inputs.forEach((input) => input.addEventListener("input", redraw));
    redraw();

    return () => {
      inputs.forEach((input) => input.removeEventListener("input", redraw));
      chart.destroy();
    };
  }, []);

  return (
    <div>
      <div className="chart-container" style={{ position: "relative", height: 400 }}>
        <canvas ref={canvasRef} />
      </div>
      <p ref={summaryRef} className="text-sm text-muted-foreground mt-2" />
    </div>
  );
}

function Content() {
  return (
    <LabForm sheetName="Температурний коефіцієнт (прилади)">
      <StudentBlock />

      <Section title="Опис установки">
        <p>
          У цій роботі за допомогою пристрою для вивчення залежності опору
          металів від температури потрібно переконатися на досліді, що
          залежність опору металевого провідника від його температури є
          лінійною. Пристрій для вивчення залежності опору металів від
          температури являє собою намотаний на картонний циліндр 1 мідний дріт
          2, кінці якого з'єднані з клемами 3, розташованими на пластмасовій
          панелі 4 пристрою. Панель має отвір 5, призначений для термометра.
          Картонний циліндр із дротом вміщений у скляну пробірку.
        </p>

        <Figure
          src={deviceScheme}
          alt="Схема пристрою для вивчення залежності опору металів від температури"
          className="w-full max-w-md mx-auto"
        />

        <p>
          Для виконання роботи збирають установку, яка складається з
          лабораторного пристрою для вивчення залежності опору металів від
          температури, мультиметра, електроплитки, посудини з водою, термометра
          та лабораторного штатива з муфтою і лапкою. Потім, нагріваючи воду в
          посудині і тим самим збільшуючи температуру досліджуваного мідного
          дроту, вимірюють мультиметром його опір за різних температур.
        </p>

        <Figure
          src={setupPhoto}
          alt="Експериментальна установка"
          className="w-full max-w-md mx-auto"
        />
      </Section>

      <Section title="Підготовка до експерименту">
        <p>
          1. Складіть установку за описом і рисунками вище: закріпіть пристрій
          у лапці штатива, помістіть його в посудину з водою на електроплитці,
          вставте термометр в отвір панелі.
        </p>
        <p>
          2. Переведіть мультиметр у режим вимірювання опору (Ω), оберіть
          відповідну межу вимірювання.
        </p>
      </Section>

      <Section title="Експеримент">
        <p>
          <em>
            Дотримуйтесь інструкції з безпеки. Результати вимірювань відразу
            заносьте до таблиці.
          </em>
        </p>

        <p>
          1. Виміряйте початкову температуру t<sub>0</sub> та опір R мідного
          дроту за цієї температури.
        </p>
        <p>
          <em>Зверніть увагу!</em> Торкатися клем пристрою щупами мультиметра
          слід тільки в момент вимірювання опору.
        </p>
        <p>
          t<sub>0</sub> = <Cell id="t0" /> °C&nbsp;&nbsp;&nbsp; R ={" "}
          <Cell id="R_t0" /> Ом
        </p>

        <p>
          2. Увімкніть електроплитку і, слідкуючи за показами термометра,
          визначте опір дроту через кожні 10 °C в інтервалі від 30 до 90 °C.
          Вимкніть електроплитку.
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h0" text="Температура t, °C">
                Температура t, °C
              </HeaderCell>
              {TEMPS.map((t) => (
                <HeaderCell key={t} id={`h_t${t}`} text={`${t}`}>
                  {t}
                </HeaderCell>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Опір R, Ом</Td>
              {TEMPS.map((t, i) => (
                <Td key={t}>
                  <Cell id={R_IDS[i]} />
                </Td>
              ))}
            </tr>
          </tbody>
        </LabTable>
      </Section>

      <Section title="Фото установки">
        <ImageCanvas
          label="Прикріпіть фото установки"
          height={400}
          minHeight={250}
          maxHeight={700}
          maxImages={6}
        />
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>
          1. За даними таблиці побудуйте графік залежності опору дроту від його
          температури R(t). (Внаслідок похибки вимірювань експериментальні
          точки можуть не лежати на одній очікуваній лінії. У цьому випадку
          графік проводять так, щоб з обох боків від нього була приблизно
          однакова кількість точок. Якщо розташування якоїсь точки значно
          відхиляється від області розташування інших точок, її слід вважати
          промахом і не враховувати під час побудови графіка.) Графік нижче
          будується автоматично за даними з таблиці — порівняйте його зі своїм.
        </p>

        <ResistanceChart />

        <p>
          2. Продовживши графік залежності R(t) до перетину з віссю ординат,
          знайдіть опір R<sub>0</sub> мідного дроту за температури 0 °C.
        </p>
        <p>
          R<sub>0</sub> = <Cell id="R0" /> Ом
        </p>

        <p>
          3. Виберіть на графіку довільну точку та визначте для неї відповідні
          значення опору R і температури t мідного дроту.
        </p>
        <p>
          R = <Cell id="R_point" /> Ом&nbsp;&nbsp;&nbsp; t ={" "}
          <Cell id="t_point" /> °C
        </p>
        <p>
          Скориставшись формулою, визначте середнє значення температурного
          коефіцієнта опору міді:
        </p>
        <Formula math="\alpha_{\text{сер}} = \dfrac{R - R_0}{R_0\, t}" />
        <p>
          α<sub>сер</sub> = <Cell id="alpha_mean" /> °C<sup>−1</sup>
        </p>

        <p>
          4. Оцініть відносну й абсолютну похибки експерименту, порівнявши
          отриманий результат із табличним значенням температурного
          коефіцієнта опору міді:
        </p>
        <Formula math="\varepsilon_{\alpha} = \left| 1 - \dfrac{\alpha_{\text{сер}}}{\alpha_{\text{табл}}} \right|; \qquad \Delta\alpha = \alpha_{\text{сер}} \cdot \varepsilon_{\alpha}" />
        <p>
          α<sub>табл</sub> = <Cell id="alpha_table" /> °C<sup>−1</sup>
          &nbsp;&nbsp;&nbsp; ε<sub>α</sub> = <Cell id="eps_alpha" />
          &nbsp;&nbsp;&nbsp; Δα = <Cell id="d_alpha" /> °C<sup>−1</sup>
        </p>

        <p>
          5. Округліть результати вимірювання температурного коефіцієнта опору
          міді, скориставшись правилами округлення (абсолютну похибку завжди
          округлюють до однієї значущої цифри із завищенням, а результат
          вимірювання — до величини розряду, що залишився в абсолютній
          похибці після округлення), і подайте результати у вигляді:
        </p>
        <Formula math="\alpha = \alpha_{\text{сер}} \pm \Delta\alpha" />
        <p>
          α = <Cell id="alpha_final" /> °C<sup>−1</sup>
        </p>
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          Проаналізуйте експеримент і його результати. За результатами
          експерименту сформулюйте і запишіть висновок, у якому зазначте:
        </p>
        <p>1) яку фізичну величину ви вимірювали;</p>
        <Answer id="v1" rows={4} />
        <p>2) яким є результат вимірювання;</p>
        <Answer id="v2" rows={4} />
        <p>3) у чому причина похибки вимірювання.</p>
        <Answer id="v3" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Продумайте й запишіть перелік необхідного обладнання та план
          проведення експерименту з визначення температури нитки лампи
          розжарювання в робочому стані. Вважайте, що нитка виготовлена із
          вольфраму.
        </p>
        <p>1) Перелік необхідного обладнання:</p>
        <Answer id="c_equipment" rows={3} />
        <p>2) План експерименту:</p>
        <Answer id="c_plan" rows={5} />
        <p>
          3) Запишіть, за якою формулою ви обчислювали б температуру нитки:
        </p>
        <Answer id="c_formula" rows={3} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "resistance-temperature-instruments",
  grade: 9,
  badge: "1.1",
  number: "№ 1",
  title:
    "Дослідження електричного опору кола з напівпровідниковим діодом. Варіант 1 (з приладами)",
  goal: "експериментально довести, що залежність електричного опору металевого провідника від температури є лінійною; визначити температурний коефіцієнт опору міді.",
  equipment:
    "пристрій для вивчення залежності опору металів від температури; мультиметр; електроплитка; посудина з водою; термометр; лабораторний штатив з муфтою і лапкою.",
  sheetName: "Температурний коефіцієнт (прилади)",
  meta: {
    title:
      "Вимірювання температурного коефіцієнта опору металу — лабораторна робота №3, варіант 1",
    description:
      "Дослідіть лінійну залежність опору мідного провідника від температури, побудуйте графік R(t) та визначте температурний коефіцієнт опору міді за допомогою приладів.",
  },
  Content,
};

export default lab;
