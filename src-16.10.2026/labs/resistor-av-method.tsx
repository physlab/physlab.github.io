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
} from "@/components/lab/lab-form";
import { Figure, Section } from "@/components/lab/lab-shell";
import { Formula } from "@/components/formula";
import circuitScheme from "@/assets/resistor-av-method-circuit-scheme.png";
import graphExample from "@/assets/resistor-av-method-graph-example.png";
import type { LabDefinition } from "./types";

Chart.register(...registerables);

const TRIALS = [1, 2, 3];
const U_CELL_IDS = TRIALS.map((n) => `U${n}`);
const I_CELL_IDS = TRIALS.map((n) => `I${n}`);

function getPoints(): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  // Змінюємо 'i' на 'index' у параметрах arrow-функції
  TRIALS.forEach((_, index) => {
    const uInput = document.getElementById(
      U_CELL_IDS[index],
    ) as HTMLInputElement | null;
    const iInput = document.getElementById(
      I_CELL_IDS[index],
    ) as HTMLInputElement | null;
    const u = parseFloat(uInput?.value ?? "");
    const i = parseFloat(iInput?.value ?? ""); // Тепер тут немає конфлікту імен
    if (!Number.isNaN(u) && !Number.isNaN(i)) points.push({ x: u, y: i });
  });
  points.sort((a, b) => a.x - b.x);
  return points;
}

/**
 * Least-squares line through the origin (I = k·U), since the task
 * explicitly requires the fit line to pass through (0, 0) — an ordinary
 * regression wouldn't guarantee that.
 */
function fitThroughOrigin(points: Array<{ x: number; y: number }>) {
  const sumXY = points.reduce((acc, p) => acc + p.x * p.y, 0);
  const sumX2 = points.reduce((acc, p) => acc + p.x * p.x, 0);
  if (sumX2 === 0) return null;
  return sumXY / sumX2; // slope k = 1/R
}

/**
 * Live I(U) chart: scatter of measured points plus a best-fit line
 * forced through the origin, redrawn as the U/I Cells change.
 */
function ResistorIVChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const chart = new Chart<"line", Array<{ x: number; y: number }>, number>(
      canvas,
      {
        type: "line",
        data: {
          datasets: [
            {
              label: "I(U)",
              data: [],
              borderColor: "transparent",
              backgroundColor: "#667eea",
              pointRadius: 6,
              showLine: false,
            },
            {
              label: "Лінія через (0;0)",
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
              title: { display: true, text: "Напруга U, В" },
            },
            y: {
              min: 0,
              title: { display: true, text: "Сила струму I, А" },
            },
          },
          plugins: { legend: { display: false } },
        },
      },
    );

    const redraw = () => {
      const points = getPoints();
      const slope = fitThroughOrigin(points);
      const maxU = points.length ? Math.max(...points.map((p) => p.x)) : 1;
      const line =
        slope !== null
          ? [
              { x: 0, y: 0 },
              { x: maxU, y: slope * maxU },
            ]
          : [];

      chart.data.datasets[0].data = points;
      chart.data.datasets[1].data = line;
      chart.update();
    };

    const inputs = [...U_CELL_IDS, ...I_CELL_IDS]
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
    <div className="chart-container">
      <canvas ref={canvasRef} id="resistorIVChart" width={600} height={400} />
    </div>
  );
}

function Content() {
  return (
    <LabForm sheetName="Опір провідника (А та V)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>1. Перш ніж виконувати роботу, переконайтеся, що ви знаєте:</p>
        <p>1) вимоги безпеки під час роботи з електричними колами;</p>
        <Answer id="v_safety" rows={3} />

        <p>
          2) правила, яких необхідно дотримуватися, здійснюючи вимірювання за
          допомогою амперметра та вольтметра.
        </p>
        <Answer id="v_meter_rules" rows={3} />

        <p>2. Визначте ціну поділки шкал амперметра та вольтметра.</p>
        <p>
          Ціна поділки амперметра = <Cell id="ammeter_division" /> А
        </p>
        <p>
          Ціна поділки вольтметра = <Cell id="voltmeter_division" /> В
        </p>
      </Section>

      <Section title="Експеримент">
        <p>
          <em>
            Дотримуйтесь інструкції з безпеки. Результати вимірювань відразу
            заносьте до таблиці.
          </em>
        </p>

        <p>1. Складіть електричне коло за поданою схемою.</p>

        <Figure
          src={circuitScheme}
          alt="Схема кола: джерело струму, ключ, резистор із паралельно під'єднаним вольтметром, амперметр послідовно, повзунковий реостат"
          className="w-full max-w-md mx-auto"
        />

        <p>2. Розташуйте повзунок реостата на середині обмотки.</p>
        <p>
          3. Замкніть коло і виміряйте напругу на резисторі та силу струму в
          ньому.
        </p>
        <p>
          4. Плавно пересуваючи повзунок реостата, збільште силу струму в
          резисторі. Запишіть покази вольтметра та амперметра.
        </p>
        <p>
          5. Пересуваючи повзунок реостата у протилежний бік, ще двічі виміряйте
          напругу на резисторі та силу струму в ньому.
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Номер досліду">
                Номер досліду
              </HeaderCell>
              <HeaderCell id="h2" text="Напруга U, В">
                Напруга U, В
              </HeaderCell>
              <HeaderCell id="h3" text="Сила струму I, А">
                Сила струму I, А
              </HeaderCell>
              <HeaderCell id="h4" text="Опір R, Ом">
                Опір R, Ом
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {TRIALS.map((n) => (
              <tr key={n}>
                <Td>{n}</Td>
                <Td>
                  <Cell id={`U${n}`} />
                </Td>
                <Td>
                  <Cell id={`I${n}`} />
                </Td>
                <Td>
                  <Cell id={`R${n}`} />
                </Td>
              </tr>
            ))}
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>1. Обчисліть опір резистора для кожного випадку:</p>
        <Formula math="R = \dfrac{U}{I}" />
        <p>2. Результати обчислень занесіть до таблиці.</p>
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          Проаналізувавши експеримент і його результати, зробіть висновок, у
          якому зазначте:
        </p>

        <p>
          1) яку фізичну величину й за допомогою яких приладів ви навчилися
          вимірювати;
        </p>
        <Answer id="v1" rows={4} />

        <p>
          2) чи залежить вимірювана величина від сили струму в резисторі та
          напруги на ньому;
        </p>
        <Answer id="v2" rows={4} />

        <p>3) які чинники вплинули на точність вимірювання.</p>
        <Answer id="v3" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          За отриманими під час експерименту даними побудуйте графік залежності
          сили струму в резисторі від напруги на його кінцях (вольт-амперну
          характеристику резистора). За графіком визначте значення опору
          резистора.
        </p>
        <p>
          <strong>Зверніть увагу:</strong> через похибку вимірювання точки
          можуть не належати одній прямій, що проходить через початок координат
          (U = 0, I = 0). У цьому випадку будуйте графік так, щоб він проходив
          через точку (0; 0) і щоб з обох боків від графіка була приблизно
          однакова кількість експериментальних точок. Для визначення опору
          резистора використайте будь-яку точку отриманого графіка (див. приклад
          на рисунку):
        </p>

        <Figure
          src={graphExample}
          alt="Приклад графіка I(U): пряма, проведена через початок координат і по можливості рівномірно між точками, з позначеною точкою для визначення опору"
          className="w-full max-w-xs mx-auto"
        />

        <ResistorIVChart />

        <p>
          Опір резистора, визначений за графіком: R = <Cell id="R_graph" /> Ом
        </p>
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "resistor-av-method",
  grade: 8,
  badge: "6.1",
  number: "№ 6",
  title: "Вимірювання опору провідника за допомогою амперметра та вольтметра",
  goal: "навчитися визначати опір провідника за допомогою амперметра та вольтметра; переконатися на досліді в тому, що опір провідника не залежить від сили струму в ньому та напруги на його кінцях.",
  equipment:
    "джерело струму; резистор; повзунковий реостат; амперметр; вольтметр; ключ; з'єднувальні проводи.",
  sheetName: "Опір провідника (А та V)",
  meta: {
    title:
      "Вимірювання опору провідника за допомогою амперметра та вольтметра — лабораторна робота №6 (8 клас)",
    description:
      "Визначте опір провідника за допомогою амперметра та вольтметра й побудуйте вольт-амперну характеристику резистора.",
  },
  Content,
};

export default lab;
