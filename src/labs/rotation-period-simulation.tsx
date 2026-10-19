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
import { Section, Simulation } from "@/components/lab/lab-shell";
import { Formula } from "@/components/formula";
import type { LabDefinition } from "./types";

const SIMULATION_URL =
  "https://phet.colorado.edu/sims/html/gravity-and-orbits/latest/gravity-and-orbits_all.html?locale=uk";

function Content() {
  return (
    <LabForm sheetName="Період обертання (симуляція)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>Переконайтеся, що ви знаєте відповіді на такі запитання.</p>
        <p>1) Який рух називають рівномірним рухом по колу?</p>
        <Answer id="v_circular_motion_def" rows={3} />

        <p>
          2) За якими формулами обчислюють період рівномірного руху тіла по
          колу, обертову частоту та швидкість руху?
        </p>
        <Answer id="v_formulas" rows={3} />

        <p>
          У цьому варіанті роботи замість тіла на нитці ви досліджуєте{" "}
          <strong>модель планетної системи</strong> в симуляції PhET{" "}
          <strong>«Гравітація та орбіти»</strong> (Gravity and Orbits).
          Планета рухається навколо Сонця орбітою, яка майже є колом, тому її
          рух можна вважати рівномірним рухом по колу. Підготуйте симуляцію:
        </p>
        <p>
          1) оберіть модель «Сонце — планета» (Sun, Planet); за потреби
          скористайтеся іншими моделями для творчого завдання;
        </p>
        <p>
          2) увімкніть показ траєкторії руху (Path) та вимірювальну стрічку
          (Measuring Tape) для визначення радіуса орбіти;
        </p>
        <p>
          3) для вимірювання часу скористайтеся секундоміром (Stopwatch) або
          показами часу в симуляції; якщо їх немає, використайте власний
          секундомір (час у симуляції може вимірюватися в земних добах).
        </p>

        <Simulation src={SIMULATION_URL} title="PhET: Gravity and Orbits" />

        <p>
          <strong>ВАЖЛИВО!!!</strong> Зробіть знімок екрана симуляції з
          обраною моделлю та додайте його через секцію &quot;Знімок
          симуляції&quot;.
        </p>
      </Section>

      <Section title="Експеримент">
        <p>
          <em>Результати вимірювань відразу заносьте до таблиці.</em>
        </p>

        <p>
          1. За допомогою вимірювальної стрічки виміряйте радіус орбіти
          планети R (відстань від Сонця до планети). Запишіть його в метрах
          (за потреби переведіть кілометри в метри).
        </p>
        <p>
          R = <Cell id="R" /> м
        </p>

        <p>
          2. Запустіть симуляцію й виміряйте час t, за який планета здійснює
          N обертів навколо Сонця (оберіть таку кількість обертів, щоб вимір
          був зручним). Якщо час подано в земних добах, переведіть його в
          секунди (1 доба = 86 400 с).
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Кількість обертів N">
                Кількість обертів N
              </HeaderCell>
              <HeaderCell id="h2" text="Час t, с">
                Час t, с
              </HeaderCell>
              <HeaderCell id="h3" text="Період обертання T, с">
                Період обертання T, с
              </HeaderCell>
              <HeaderCell id="h4" text="Обертова частота n, Гц">
                Обертова частота n, Гц
              </HeaderCell>
              <HeaderCell id="h5" text="Швидкість руху v, м/с">
                Швидкість руху v, м/с
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <Cell id="N" />
              </Td>
              <Td>
                <Cell id="t" />
              </Td>
              <Td>
                <Cell id="T" />
              </Td>
              <Td>
                <Cell id="n" />
              </Td>
              <Td>
                <Cell id="v" />
              </Td>
            </tr>
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>
          Визначте період обертання, обертову частоту та швидкість руху
          планети:
        </p>
        <Formula math="T = \frac{t}{N}" />

        <p>
          <Formula math="n = \frac{1}{T}" />
        </p>
        <p>
          <Formula math="v = \frac{2\pi R}{T}" />
        </p>

        <p>Занесіть обчислені значення T, n і v до таблиці.</p>
      </Section>

      <Section title="Знімок симуляції">
        <ImageCanvas
          label="Прикріпіть знімок екрана симуляції"
          height={400}
          minHeight={250}
          maxHeight={700}
          maxImages={6}
        />
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>Проаналізувавши експеримент, зробіть висновок, у якому зазначте:</p>

        <p>1) який рух ви вивчали;</p>
        <Answer id="v1" rows={4} />

        <p>2) значення яких величин визначали;</p>
        <Answer id="v2" rows={4} />

        <p>3) які результати отримали;</p>
        <Answer id="v3" rows={4} />

        <p>4) у чому причина похибки.</p>
        <Answer id="v4" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Продумайте та запишіть план проведення експерименту, мета якого —
          виявити залежність періоду обертання та обертової частоти від
          радіуса орбіти. Для цього скористайтеся різними моделями в симуляції
          (наприклад, «Сонце — планета» та «Земля — Місяць»).
        </p>
        <Answer id="v_plan" rows={6} />

        <p>Проведіть цей експеримент для кількох моделей:</p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h_c1" text="№">
                №
              </HeaderCell>
              <HeaderCell id="h_c2" text="Модель">
                Модель
              </HeaderCell>
              <HeaderCell id="h_c3" text="Радіус орбіти R, м">
                Радіус орбіти R, м
              </HeaderCell>
              <HeaderCell id="h_c4" text="Період обертання T, с">
                Період обертання T, с
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((row) => (
              <tr key={row}>
                <Td>{row}</Td>
                <Td>
                  <Cell id={`cM${row}`} />
                </Td>
                <Td>
                  <Cell id={`cR${row}`} />
                </Td>
                <Td>
                  <Cell id={`cT${row}`} />
                </Td>
              </tr>
            ))}
          </tbody>
        </LabTable>

        <p>Зробіть висновок:</p>
        <Answer id="v_creative_conclusion" rows={5} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "rotation-period-simulation",
  grade: 7,
  badge: "2.3",
  number: "№ 2",
  title:
    "Вимірювання періоду обертання та обертової частоти. Варіант 3 (симуляція)",
  goal: "виміряти період обертання та обертову частоту тіла під час його рівномірного руху по колу.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Період обертання (симуляція)",
  meta: {
    title:
      "Вимірювання періоду обертання та обертової частоти (симуляція) — лабораторна робота №2, варіант 3",
    description:
      "Дослідіть рух планети навколо Сонця в симуляції PhET Gravity and Orbits та визначте період обертання, обертову частоту й швидкість руху.",
  },
  Content,
};

export default lab;
