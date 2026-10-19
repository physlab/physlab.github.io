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
import { Figure, Section, Simulation } from "@/components/lab/lab-shell";
import deviceScheme from "@/assets/resistance-temperature-device-scheme.png";
import setupPhoto from "@/assets/resistance-temperature-setup-photo.png";
import "katex/dist/katex.min.css";
import katex from "katex";
import "katex/dist/katex.min.css";
import type { LabDefinition } from "./types";

/**
 * Renders a LaTeX string with KaTeX directly (no react-katex wrapper) so
 * there's one less layer to debug if styling/typing issues show up.
 */
function Formula({ math }: { math: string }) {
  const html = katex.renderToString(math, {
    throwOnError: false,
    displayMode: true,
  });
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

Chart.register(...registerables);

const EXPERIMENT_VIDEO = "https://www.youtube.com/embed/lmCepVQOWXU";

// Full temperature axis (0–90 °C, matches treskoef.js) and the six columns
// that are actually filled in via the table (30–80 °C).
const TEMPERATURE_AXIS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
const RESISTANCE_CELL_IDS = ["r2c3", "r2c4", "r2c5", "r2c6", "r2c7", "r2c8"];
// Temperatures actually shown as table columns (subset of TEMPERATURE_AXIS).
const TABLE_TEMPS = [30, 40, 50, 60, 70, 80];
// Index into TEMPERATURE_AXIS for each of the cells above (30 °C..80 °C).
const RESISTANCE_CELL_AXIS_INDEX = [3, 4, 5, 6, 7, 8];

function getResistanceData(): Array<number | null> {
  const data: Array<number | null> = TEMPERATURE_AXIS.map(() => null);
  RESISTANCE_CELL_IDS.forEach((id, i) => {
    const input = document.getElementById(id) as HTMLInputElement | null;
    const value = parseFloat(input?.value ?? "");
    data[RESISTANCE_CELL_AXIS_INDEX[i]] = Number.isNaN(value) ? null : value;
  });
  return data;
}

function linearRegression(x: number[], y: Array<number | null>) {
  const filtered = x.reduce<Array<{ x: number; y: number }>>((acc, curr, i) => {
    const yi = y[i];
    if (yi !== null) acc.push({ x: curr, y: yi });
    return acc;
  }, []);

  const n = filtered.length;
  if (n === 0) return null;

  const sumX = filtered.reduce((acc, p) => acc + p.x, 0);
  const sumY = filtered.reduce((acc, p) => acc + p.y, 0);
  const sumXY = filtered.reduce((acc, p) => acc + p.x * p.y, 0);
  const sumX2 = filtered.reduce((acc, p) => acc + p.x * p.x, 0);

  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return null;

  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

/**
 * Ports `treskoef.js`'s `drawChart()`: a scatter of the measured R(t)
 * points plus a live least-squares regression line through them, redrawn
 * whenever one of the resistance Cells (r2c3..r2c8) changes.
 */
function ResistanceChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const chart = new Chart<"line", Array<number | null>, number>(canvas, {
      type: "line",
      data: {
        labels: TEMPERATURE_AXIS,
        datasets: [
          {
            label: "Опір (Ом)",
            data: [],
            borderColor: "blue",
            fill: false,
            showLine: false,
            pointBackgroundColor: "blue",
            pointRadius: 5,
          },
          {
            label: "Лінія регресії",
            data: [],
            borderColor: "red",
            fill: false,
            tension: 0,
            pointRadius: 0,
            spanGaps: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: { display: true, text: "Температура (°C)" },
          },
          y: {
            title: { display: true, text: "Опір (Ом)" },
            beginAtZero: true,
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const temp = tooltipItem.label;
                const value = tooltipItem.raw as number | null;
                return `Температура: ${temp} °C, Опір: ${value ?? "N/A"} Ом`;
              },
            },
          },
        },
      },
    });

    const redraw = () => {
      const resistanceData = getResistanceData();
      const regression = linearRegression(TEMPERATURE_AXIS, resistanceData);
      const regressionLine = regression
        ? TEMPERATURE_AXIS.map(
            (t) => regression.slope * t + regression.intercept,
          )
        : TEMPERATURE_AXIS.map(() => null);

      chart.data.datasets[0].data = resistanceData;
      chart.data.datasets[1].data = regressionLine;
      chart.update();
    };

    const inputs = RESISTANCE_CELL_IDS.map((id) =>
      document.getElementById(id),
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
      <canvas
        ref={canvasRef}
        id="tempResistanceChart"
        width={600}
        height={400}
      />
    </div>
  );
}

function Content() {
  return (
    <LabForm sheetName="Температурний коефіцієнт">
      <StudentBlock />

      <Section title="Опис установки">
        <p>
          У цій роботі пропонується за допомогою пристрою для вивчення
          залежності опору металів від температури переконатися на досліді, що
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
        <p>Відкрийте відео експерименту:</p>
        <Simulation src={EXPERIMENT_VIDEO} title="Відеоексперимент" />
      </Section>

      <Section title="Експеримент">
        <p>
          Переглядаючи відео, заповнюйте таблицю 1. За необхідності ставте відео
          на паузу, уважно визначайте вимірювані величини.
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Температура t, °C">
                Температура t, °C
              </HeaderCell>
              {TABLE_TEMPS.map((t) => (
                <HeaderCell key={t} id={`h_t${t}`} text={`${t}`}>
                  {t}
                </HeaderCell>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Опір R, Ом</Td>
              {TABLE_TEMPS.map((t, i) => (
                <Td key={t}>
                  <Cell id={RESISTANCE_CELL_IDS[i]} />
                </Td>
              ))}
            </tr>
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>
          1. За даними таблиці побудуйте графік залежності опору дроту від його
          температури – R(t). (Внаслідок похибки вимірювань експериментальні
          точки можуть не лежати на одній очікуваній лінії. У цьому випадку
          графік проводять так, щоб з обох боків від нього була приблизно
          однакова кількість точок. Якщо розташування якої- небудь точки значно
          відхиляється від області розташування інших точок, то її слід вважати
          промахом і не враховувати під час побудови графіка.)
        </p>

        <ResistanceChart />

        <p>
          2. Продовживши графік залежності R(t) до перетину з віссю ординат,
          знайдіть опір R<sub>0</sub> мідного дроту за температури 0 °С.
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

        <p>Скориставшись формулою:</p>
        <Formula math="\alpha_{\text{сер}} = \dfrac{R - R_0}{R_0 \, t}" />
        <p>визначте середнє значення температурного коефіцієнта опору міді.</p>
        <p>
          α<sub>сер</sub> = <Cell id="alpha_ser" /> °C<sup>-1</sup>
        </p>

        <p>
          4. Оцініть відносну й абсолютну похибки експерименту, порівнявши
          отриманий результат із табличним значенням температурного коефіцієнта
          опору міді:
        </p>
        <Formula math="\varepsilon_\alpha = \left| 1 - \dfrac{\alpha_{\text{сер}}}{\alpha_{\text{табл}}} \right|" />
        <Formula math="\Delta\alpha = \alpha_{\text{сер}} \cdot \varepsilon_\alpha" />
        <p>
          ε<sub>α</sub> = <Cell id="eps_alpha" /> %
        </p>
        <p>
          ∆α = <Cell id="delta_alpha" /> °C<sup>-1</sup>
        </p>

        <p>
          5. Округліть результати вимірювання температурного коефіцієнта опору
          міді, скориставшись правилами округлення (абсолютну похибку завжди
          округлюють до однієї значущої цифри із завищенням, а результат
          вимірювання – до величини розряду, що залишився в абсолютній похибці
          після округлення), і подайте результати у вигляді: α = α<sub>сер</sub>{" "}
          ± ∆α
        </p>
        <p>
          <Cell id="result" />
        </p>
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

      <Section title="Аналіз експерименту та його результатів">
        <p>
          Проаналізуйте експеримент і його результати. За результатами
          експерименту сформулюйте і запишіть висновок, у якому зазначте:
        </p>

        <p>1) яку фізичну величину ви вимірювали;</p>
        <Answer id="v1" rows={5} />

        <p>2) яким є результат вимірювання;</p>
        <Answer id="v2" rows={5} />

        <p>3) у чому причина похибки вимірювання.</p>
        <Answer id="v3" rows={5} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "resistance-temperature",
  grade: 9,
  badge: "1",
  number: "№ 3",
  title: "Вимірювання температурного коефіцієнта опору металу",
  goal: "експериментально довести, що залежність електричного опору металевого провідника від температури є лінійною; визначити температурний коефіцієнт опору міді.",
  equipment: "комп'ютер або смартфон, комп'ютерна програма для моделювання.",
  sheetName: "Температурний коефіцієнт",
  meta: {
    title:
      "Вимірювання температурного коефіцієнта опору металу — лабораторна робота",
    description:
      "Дослідіть лінійну залежність опору мідного провідника від температури, побудуйте графік R(t) на основі виміряних значень та визначте температурний коефіцієнт опору міді.",
  },
  Content,
};

export default lab;
