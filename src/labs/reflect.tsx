import {
  LabForm,
  StudentBlock,
  Answer,
  Cell,
  HeaderCell,
  LabTable,
  Td,
} from "@/components/lab/lab-form";
import { Figure, Section, Simulation } from "@/components/lab/lab-shell";
import protractor from "@/assets/reflect-protractor.png";
import room from "@/assets/reflect-room.png";
import type { LabDefinition } from "./types";
import katex from "katex";

const SIM =
  "https://phet.colorado.edu/sims/html/bending-light/latest/bending-light_uk.html";

function Content() {
  return (
    <LabForm sheetName="Дослідження відбивання світла">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>1. Запишіть закони відбивання світла</p>
        <Answer id="qw_1" rows={6} />
      </Section>

      <Section title="Експеримент">
        <p>
          Відкрийте симуляцію відбивання світла за посиланням або скористайтеся
          вставкою:
        </p>
        <Simulation src={SIM} title="Симуляція відбивання світла" />
        <p>
          3. Натисніть кнопку «Початок». Встановіть наступні параметри:
          Середовище 1 — Невідоме А, Середовище 2 — Повітря.
        </p>
        <p>
          4. За допомогою транспортира виміряйте кут падіння та кут відбивання.
        </p>
        <Figure
          src={protractor}
          alt="Вимірювання кутів транспортиром"
          className="w-full max-w-xl"
        />
        <p>
          5. Повторіть дії ще кілька разів, установлюючи джерело світла під
          різними кутами до поверхні відбивання.
        </p>
        <p>Далі розраховуємо й записуємо до таблиці:</p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="№">
                №
              </HeaderCell>
              <HeaderCell id="h2" text="Кут падіння α, градус">
                Кут падіння α, градус
              </HeaderCell>
              <HeaderCell id="h3" text="Кут відбивання β, градус">
                Кут відбивання β, градус
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row}>
                <Td>{row}</Td>
                <Td>
                  <Cell id={`r${row}c2`} />
                </Td>
                <Td>
                  <Cell id={`r${row}c3`} />
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
        <p>
          1) яке співвідношення між кутом падіння світлового променя та кутом
          його відбивання ви встановили;
        </p>
        <Answer id="v1" rows={6} />
        <p>
          2) чи виявилися результати дослідів абсолютно точними, а якщо ні, то в
          чому причини похибки.
        </p>
        <Answer id="v2" rows={6} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Скориставшись рисунком, продумайте та запишіть план проведення
          експерименту з визначення висоти кімнати за допомогою плоского
          дзеркала; зазначте необхідне обладнання. У разі можливості проведіть
          експеримент.
        </p>
        <Figure
          src={room}
          alt="Визначення висоти кімнати за допомогою дзеркала"
          className="w-full max-w-lg"
        />
        <Answer id="tvorche1" rows={6} />
      </Section>

      <Section title="Завдання «із зірочкою»">
        <p>
          Для кожного досліду оцініть відносну похибку експерименту за формулою:
        </p>
        <Formula math="\varepsilon = \left|1 - \dfrac{\alpha}{\beta}\right| \cdot 100\%" />

        <Answer id="problem_star" rows={6} />
      </Section>
    </LabForm>
  );
}

function Formula({ math }: { math: string }) {
  const html = katex.renderToString(math, {
    throwOnError: false,
    displayMode: true,
  });
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

const lab: LabDefinition = {
  slug: "reflect",
  grade: 9,
  badge: "6.3",
  number: "№ 6",
  title:
    "Дослідження відбивання світла за допомогою плоского дзеркала або іншої поверхні відбивання. Варіант 3 (Phet-симуляція)",
  goal: "експериментально перевірити закони відбивання світла.",
  equipment: "комп'ютер або смартфон, комп'ютерна програма для моделювання.",
  sheetName: "Дослідження відбивання світла",
  meta: {
    title: "Дослідження відбивання світла — лабораторна робота №3",
    description:
      "Перевірте закони відбивання світла за допомогою симуляції PhET і заповніть онлайн-бланк лабораторної роботи.",
  },
  Content,
};

export default lab;
