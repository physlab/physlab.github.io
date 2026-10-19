import {
  LabForm,
  StudentBlock,
  Answer,
  Cell,
  HeaderCell,
  LabTable,
  Td,
} from "@/components/lab/lab-form";
import { Figure, Note, Section, Simulation } from "@/components/lab/lab-shell";
import modelSelection from "@/assets/circular-motion-model-selection.png";
import radiusMeasurement from "@/assets/circular-motion-radius-measurement.png";
import periodFormula from "@/assets/circular-motion-period-formula.png";
import frequencyFormula from "@/assets/circular-motion-frequency-formula.png";
import velocityFormula from "@/assets/circular-motion-velocity-formula.png";
import accelerationFormula from "@/assets/circular-motion-acceleration-formula.png";
import type { LabDefinition } from "./types";

const SIM =
  "https://phet.colorado.edu/sims/html/gravity-and-orbits/latest/gravity-and-orbits_uk.html";

function Content() {
  return (
    <LabForm sheetName="Рух по колу">
      <StudentBlock />

      <Section title="Експеримент">
        <Simulation src={SIM} title="Симуляція руху штучного супутника" />

        <Note>
          Суворо дотримуйтесь інструкції з безпеки. Результати вимірювань
          відразу заносьте до таблиці.
        </Note>

        <p>
          1. Відкрийте програму та натисніть кнопку{" "}
          <strong>Масштабувати (To Scale)</strong>
        </p>
        <p>
          2. Оберіть модель <strong>Земля та супутник</strong> (остання у
          списку, див. мал.)
        </p>
        <Figure
          src={modelSelection}
          alt="Вибір моделі"
          className="w-full max-w-lg"
        />

        <p>
          3. Виміряйте радіус траєкторії руху штучного супутника навколо Землі,
          використовуючи інструмент <strong>Мірна стрічка</strong>. Час запишіть
          у метрах. Для визначення центру Землі зручно увімкнути{" "}
          <strong>Сітку</strong>.
        </p>
        <Figure
          src={radiusMeasurement}
          alt="Вимірювання радіуса"
          className="w-full max-w-lg"
        />

        <p>4. Запишіть радіус орбіти до таблиці, перевівши його в метри.</p>
        <Note>
          Зверніть увагу, що вимірювальна стрічка показує значення радіуса в
          кілометрах.
        </Note>

        <p>
          5. Запустіть програму на виконання, почавши відлік зі слова «нуль»,
          коли супутник пройде точку, з якої почав рухатися, рахуємо «один» і
          т.д. Коли тіло пройде п'ятий оберт, зупиняємо імітацію, натиснувши
          відповідну кнопку, й записуємо до таблиці отримане значення у
          секундах.
        </p>
        <Note>
          Зверніть увагу, що лічильник показує значення часу в хвилинах.
        </Note>

        <p>6. Далі розраховуємо й записуємо до таблиці:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>період у секундах</li>
          <li>обертову частоту у 1/c</li>
          <li>лінійну швидкість у м/с</li>
          <li>доцентрове прискорення у м/с²</li>
        </ul>

        <p className="font-semibold">Формули для розрахунку:</p>
        <div className="flex flex-wrap items-start justify-center gap-4">
          <Figure src={periodFormula} alt="Формула періоду" className="w-40" />
          <Figure
            src={frequencyFormula}
            alt="Формула обертової частоти"
            className="w-40"
          />
          <Figure
            src={velocityFormula}
            alt="Формула лінійної швидкості"
            className="w-40"
          />
          <Figure
            src={accelerationFormula}
            alt="Формула доцентрового прискорення"
            className="w-40"
          />
        </div>

        <p>
          7. Повторіть дослід ще двічі, щоразу трохи збільшуючи радіус орбіти.
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="№">
                №
              </HeaderCell>
              <HeaderCell id="h2" text="Радіус кола r, м">
                Радіус кола <i>r</i>, м
              </HeaderCell>
              <HeaderCell id="h3" text="К-ть обертів N">
                К-ть обертів <i>N</i>
              </HeaderCell>
              <HeaderCell id="h4" text="Час руху t, с">
                Час руху <i>t</i>, с
              </HeaderCell>
              <HeaderCell id="h5" text="Період обертання T, с">
                Період обертання <i>T</i>, с
              </HeaderCell>
              <HeaderCell id="h6" text="Обертова частота n, 1/с">
                Обертова частота <i>n</i>, 1/с
              </HeaderCell>
              <HeaderCell id="h7" text="Лінійна швидкість υ, м/с">
                Лінійна швидкість <i>υ</i>, м/с
              </HeaderCell>
              <HeaderCell id="h8" text="Доцентрове прискорення aдц, м/с²">
                Доцентрове прискорення <i>a</i>
                <sub>дц</sub>, м/с<sup>2</sup>
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((row) => (
              <tr key={row}>
                <Td>{row}</Td>
                <Td>
                  <Cell id={`r${row}`} type="number" />
                </Td>
                {row === 1 && (
                  <Td rowSpan={3}>
                    <Cell id="N" type="number" />
                  </Td>
                )}
                <Td>
                  <Cell id={`t${row}`} type="number" />
                </Td>
                <Td>
                  <Cell id={`T${row}`} type="number" />
                </Td>
                <Td>
                  <Cell id={`n${row}`} type="number" />
                </Td>
                <Td>
                  <Cell id={`V${row}`} type="number" />
                </Td>
                <Td>
                  <Cell id={`a${row}`} type="number" />
                </Td>
              </tr>
            ))}
          </tbody>
        </LabTable>
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          Проаналізуйте експеримент і його результати. Сформулюйте висновок, у
          якому зазначте:
        </p>
        <p>1) фізичні величини, які ви визначали;</p>
        <Answer id="visnovok1" rows={6} />
        <p>2) точність проведеного експерименту та причини похибки.</p>
        <Answer id="visnovok2" rows={6} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "circular-motion",
  grade: 10,
  badge: "2",
  number: "№ 2",
  title: "Вивчення руху тіла по колу",
  goal: "визначити характеристики рівномірного руху тіла по колу: період обертання, обертову частоту, лінійну швидкість, доцентрове прискорення й модуль рівнодійної сил, які надають кульці цього прискорення.",
  equipment:
    "комп'ютер або смартфон, комп'ютерна програма для моделювання руху штучного супутника Землі.",
  sheetName: "Рух по колу",
  meta: {
    title: "Вивчення руху тіла по колу — лабораторна робота №2",
    description:
      "Визначте період обертання, обертову частоту, лінійну швидкість і доцентрове прискорення штучного супутника у віртуальній лабораторії.",
  },
  Content,
};

export default lab;
