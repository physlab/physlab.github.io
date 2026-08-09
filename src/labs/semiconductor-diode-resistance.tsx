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
import devicePhoto from "@/assets/semiconductor-diode-device-photo.png";
import circuitScheme from "@/assets/semiconductor-diode-circuit-scheme.png";
import tinkercadExample from "@/assets/semiconductor-diode-tinkercad-example.png";
import type { LabDefinition } from "./types";

Chart.register(...registerables);

const POINTS_COUNT = 6;
const U_CELL_IDS = ["u1", "u2", "u3", "u4", "u5", "u6"];
const I_CELL_IDS = ["i1", "i2", "i3", "i4", "i5", "i6"];

function getDiodePoints(): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  for (let k = 0; k < POINTS_COUNT; k++) {
    const uInput = document.getElementById(
      U_CELL_IDS[k],
    ) as HTMLInputElement | null;
    const iInput = document.getElementById(
      I_CELL_IDS[k],
    ) as HTMLInputElement | null;
    const u = parseFloat(uInput?.value ?? "");
    const i = parseFloat(iInput?.value ?? "");
    if (!Number.isNaN(u) && !Number.isNaN(i)) {
      points.push({ x: u, y: i });
    }
  }
  points.sort((a, b) => a.x - b.x);
  return points;
}

/**
 * Live I(U) volt-ampere characteristic of the diode for forward
 * connection, redrawn whenever a voltage/current Cell changes.
 */
function DiodeChart() {
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
              borderColor: "#667eea",
              backgroundColor: "#667eea",
              pointRadius: 5,
              showLine: true,
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: "linear",
              title: { display: true, text: "Напруга U, В" },
            },
            y: {
              beginAtZero: true,
              title: { display: true, text: "Сила прямого струму I, А" },
            },
          },
          plugins: {
            legend: { display: false },
          },
        },
      },
    );

    const redraw = () => {
      chart.data.datasets[0].data = getDiodePoints();
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
      <canvas
        ref={canvasRef}
        id="diodeCurrentVoltageChart"
        width={600}
        height={400}
      />
    </div>
  );
}

function Content() {
  return (
    <LabForm sheetName="Опір кола з діодом">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>
          1. Уважно розгляньте електричне коло для дослідження залежності сили
          прямого струму, який проходить через діод, від поданої на діод напруги
          (рис. 1) та електричну схему цього кола (рис. 2).
        </p>

        <Figure
          src={devicePhoto}
          alt="Електричне коло для дослідження діода: 1 — джерело живлення, 2 — реостат, 3 — ключ, 4 — амперметр, 5 — вольтметр, 6 — діод"
          className="w-full max-w-md mx-auto"
        />

        <Figure
          src={circuitScheme}
          alt="Електрична схема кола з напівпровідниковим діодом"
          className="w-full max-w-sm mx-auto"
        />

        <p>
          2. Перенесіть електричну схему (див. рис. 2) у зошит, поряд із кожним
          елементом поставте відповідну цифру (див. рис. 1).
        </p>

        <p>
          <strong>
            Виконання за допомогою комп&apos;ютерного моделювання.
          </strong>{" "}
          Якщо фізичного обладнання немає під рукою, коло можна зібрати у
          безкоштовному онлайн-симуляторі{" "}
          <a href="https://www.tinkercad.com/" target="_blank" rel="noreferrer">
            Tinkercad Circuits
          </a>
          . Відкрийте розділ Circuits → Create new Circuit, додайте джерело
          живлення (4–6 В), потенціометр (як реостат), амперметр, вольтметр і
          діод, з&apos;єднайте їх за схемою на рис. 2, натисніть Start
          Simulation і знімайте покази приладів, поступово повертаючи ручку
          потенціометра.
        </p>

        <Figure
          src={tinkercadExample}
          alt="Приклад зібраного кола з діодом у Tinkercad Circuits"
          className="w-full max-w-md mx-auto"
        />
      </Section>
      <Section title="Експеримент">
        <p>
          <em>Дотримуйтесь інструкції з безпеки.</em>
        </p>

        <p>1. Складіть електричне коло за схемою на рис. 2.</p>
        <p>
          2. Переміщуючи повзунок реостата, поступово збільшуйте напругу на
          діоді (щоразу приблизно на 0,1 В), почавши з мінімально можливого
          значення. Щоразу знімайте покази приладів і заносьте їх до таблиці.
        </p>
        <p>
          <strong>Зверніть увагу:</strong> щоб діод не вийшов із ладу, сила
          прямого струму не повинна перевищувати 0,3 А.
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h_label" text="Величина">
                &nbsp;
              </HeaderCell>
              {Array.from({ length: POINTS_COUNT }).map((_, i) => (
                <HeaderCell key={i} id={`h_col${i + 1}`} text={`${i + 1}`}>
                  {i + 1}
                </HeaderCell>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Напруга U, В</Td>
              {U_CELL_IDS.map((id) => (
                <Td key={id}>
                  <Cell id={id} />
                </Td>
              ))}
            </tr>
            <tr>
              <Td>
                Сила прямого струму I<sub>пр</sub>, А
              </Td>
              {I_CELL_IDS.map((id) => (
                <Td key={id}>
                  <Cell id={id} />
                </Td>
              ))}
            </tr>
          </tbody>
        </LabTable>

        <p>
          3. Змініть полярність під&apos;єднання джерела живлення, а відповідно,
          і амперметра, та переконайтеся, що в цьому випадку стрілка амперметра
          майже не відхиляється.
        </p>
        <p>Опишіть свої спостереження при зміні полярності:</p>
        <Answer id="v_polarity" rows={4} />
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>
          За результатами експерименту побудуйте графік залежності сили струму,
          що проходить через діод, від поданої на діод напруги для прямого
          ввімкнення діода.
        </p>

        <DiodeChart />
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          Проаналізувавши експеримент і його результати, зробіть висновок, у
          якому зазначте:
        </p>

        <p>1) роботу якого пристрою ви досліджували;</p>
        <Answer id="v1" rows={4} />

        <p>
          2) чи однаково цей пристрій проводить електричний струм в обох
          напрямках;
        </p>
        <Answer id="v2" rows={4} />

        <p>
          3) чи є лінійною залежність сили струму в пристрої від поданої на
          нього напруги.
        </p>
        <Answer id="v3" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Запропонуйте простий пристрій, за допомогою якого можна визначати
          напрямок електричного струму в колі (можна запропонувати декілька
          варіантів).
        </p>
        <Answer id="v_creative" rows={8} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "semiconductor-diode-resistance",
  grade: 9,
  badge: "3",
  number: "№ 3",
  title: "Дослідження електричного опору кола з напівпровідниковим діодом",
  goal: "дослідити особливості роботи напівпровідникового діода в колі постійного струму, переконатися на досліді, що діод переважно пропускає струм тільки в одному напрямку.",
  equipment:
    "напівпровідниковий діод малої потужності на підставці; джерело постійного струму (4–6 В); вольтметр; амперметр; повзунковий реостат (0–15 Ом) із трьома виводами; ключ; з'єднувальні проводи.",
  sheetName: "Опір кола з діодом",
  meta: {
    title:
      "Дослідження електричного опору кола з напівпровідниковим діодом — лабораторна робота №3",
    description:
      "Дослідіть роботу напівпровідникового діода в колі постійного струму та побудуйте вольт-амперну характеристику діода I(U).",
  },
  Content,
};

export default lab;
