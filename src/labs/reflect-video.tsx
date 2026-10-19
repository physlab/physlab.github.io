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
import { Formula } from "@/components/formula";
import room from "@/assets/reflect-room.png";
import type { LabDefinition } from "./types";

const EXPERIMENT_VIDEO = "https://www.youtube.com/embed/mBbGVxzk0L0";

function Content() {
  return (
    <LabForm sheetName="Дослідження відбивання світла (відео)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>1. Запишіть закони відбивання світла.</p>
        <Answer id="qw_1" rows={6} />

        <p>
          2. Що називають кутом падіння та кутом відбивання? Відносно чого їх
          вимірюють?
        </p>
        <Answer id="qw_2" rows={4} />
      </Section>

      <Section title="Експеримент">
        <p>
          У цьому варіанті роботи ви не проводите вимірювання самостійно, а
          переглядаєте відео з готовим дослідом. Уважно перегляньте відео
          (за потреби ставте на паузу й переглядайте окремі моменти повторно),
          зафіксуйте кут падіння α та кут відбивання β у кожному досліді й
          запишіть їх до таблиці.
        </p>

        <Simulation src={EXPERIMENT_VIDEO} title="Відеоексперимент: дослідження відбивання світла" />

        <p>
          Зверніть увагу: кути вимірюють між променем і перпендикуляром до
          поверхні дзеркала, проведеним у точці падіння, а не між променем і
          поверхнею дзеркала.
        </p>
        <p>Результати вимірювань запишіть до таблиці (заповніть стільки рядків, скільки дослідів показано у відео).</p>

        <p>
          <strong>Таблиця</strong>
        </p>
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
          alt="Визначення висоти кімнати за допомогою дзеркала: H — висота кімнати, h — висота очей, L і l — відстані від дзеркала"
          className="w-full max-w-sm"
        />
        <Answer id="tvorche1" rows={6} />
      </Section>

      <Section title="Завдання «із зірочкою»">
        <p>
          Для кожного досліду оцініть відносну похибку експерименту за формулою:
        </p>
        <Formula math="\varepsilon = \left|1 - \dfrac{\alpha}{\beta}\right| \cdot 100\%" />

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="hs1" text="№">
                №
              </HeaderCell>
              <HeaderCell id="hs2" text="Відносна похибка ε, %">
                Відносна похибка ε, %
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row}>
                <Td>{row}</Td>
                <Td>
                  <Cell id={`eps${row}`} />
                </Td>
              </tr>
            ))}
          </tbody>
        </LabTable>

        <Answer id="problem_star" rows={6} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "reflect-video",
  grade: 9,
  badge: "6.2",
  number: "№ 6",
  title:
    "Дослідження відбивання світла за допомогою плоского дзеркала або іншої поверхні відбивання. Варіант 2 (за відео)",
  goal: "експериментально перевірити закони відбивання світла.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Дослідження відбивання світла (відео)",
  meta: {
    title:
      "Дослідження відбивання світла (за відео) — лабораторна робота №6, варіант 2",
    description:
      "Перегляньте відео досліду, запишіть кути падіння та відбивання світла до таблиці та перевірте закони відбивання.",
  },
  Content,
};

export default lab;
