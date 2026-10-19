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
import water from "@/assets/refract-water.png";
import type { LabDefinition } from "./types";

const EXPERIMENT_VIDEO = "https://www.youtube.com/embed/xm2bxCjnQSk";

function Content() {
  return (
    <LabForm sheetName="Дослідження заломлення світла (відео)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>1. Запишіть закони заломлення світла.</p>
        <Answer id="qw_1" rows={6} />

        <p>
          2. Що називають кутом падіння та кутом заломлення? Відносно чого їх
          вимірюють?
        </p>
        <Answer id="qw_2" rows={4} />
      </Section>

      <Section title="Експеримент">
        <p>
          У цьому варіанті роботи ви не проводите вимірювання самостійно, а
          переглядаєте відео з готовим дослідом. Уважно перегляньте відео (за
          потреби ставте на паузу й переглядайте окремі моменти повторно),
          зафіксуйте кут падіння α та кут заломлення γ у кожному досліді й
          запишіть їх до таблиці.
        </p>

        <Simulation
          src={EXPERIMENT_VIDEO}
          title="Відеоексперимент: дослідження заломлення світла"
        />

        <p>
          Зверніть увагу: обидва кути вимірюють між променем і перпендикуляром
          до межі поділу середовищ, проведеним у точці падіння, а не між
          променем і поверхнею.
        </p>
        <p>
          Запишіть кути до таблиці (заповніть стільки рядків, скільки дослідів
          показано у відео).
        </p>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>
          1. Обчисліть значення синусів кутів падіння та кутів заломлення.
          Запишіть отримані значення до таблиці. Для визначення синусів можна
          скористатися{" "}
          <a
            href="https://fin-calc.org.ua/ua/calculator/trigonometric/view/"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-accent underline underline-offset-4"
          >
            калькулятором
          </a>
          .
        </p>
        <p>
          2. Обчисліть відносний показник заломлення <i>n</i>
          <sub>21</sub>, використовуючи формулу:
        </p>
        <Formula math="n_{21} = \dfrac{\sin \alpha}{\sin \gamma}" />

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="№">
                №
              </HeaderCell>
              <HeaderCell id="h2" text="Кут падіння α, градус">
                Кут падіння α, градус
              </HeaderCell>
              <HeaderCell id="h3" text="Кут заломлення γ, градус">
                Кут заломлення γ, градус
              </HeaderCell>
              <HeaderCell id="h4" text="Значення sin α">
                Значення sin α
              </HeaderCell>
              <HeaderCell id="h5" text="Значення sin γ">
                Значення sin γ
              </HeaderCell>
              <HeaderCell id="h6" text="Показник заломлення n21">
                Показник заломлення <i>n</i>
                <sub>21</sub>
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((row) => (
              <tr key={row}>
                <Td>{row}</Td>
                {[2, 3, 4, 5, 6].map((col) => (
                  <Td key={col}>
                    <Cell id={`r${row}c${col}`} />
                  </Td>
                ))}
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
        <p>1) яку фізичну величину ви визначали;</p>
        <Answer id="v1" rows={5} />
        <p>2) який результат отримали;</p>
        <Answer id="v2" rows={5} />
        <p>
          3) чи залежить значення отриманої величини від кута падіння світла;
        </p>
        <Answer id="v3" rows={5} />
        <p>4) у чому причини можливої похибки експерименту.</p>
        <Answer id="v4" rows={5} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Скориставшись рисунком, продумайте та запишіть план проведення
          експерименту з визначення показника заломлення води відносно повітря.
          У разі можливості проведіть експеримент.
        </p>
        <Figure
          src={water}
          alt="Схема досліду з водою"
          className="w-full max-w-lg"
        />
        <Answer id="tvorche1" rows={6} />
      </Section>

      <Section title="Завдання «із зірочкою»">
        <p>
          Для кожного досліду оцініть відносну похибку експерименту за формулою:
        </p>
        <Formula math="\varepsilon = \left|1 - \dfrac{n_{\text{вим}}}{n_{\text{табл}}}\right| \cdot 100\%" />
        <p>
          де n<sub>вим</sub> — отримане під час експерименту значення показника
          заломлення скла; n<sub>табл</sub> — табличне значення показника
          заломлення скла.
        </p>
        <Answer id="problem_star" rows={6} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "refract-video",
  grade: 9,
  badge: "7.2",
  number: "№ 7",
  title: "Дослідження заломлення світла. Варіант 2 (за відео)",
  goal: "визначити показник заломлення скла відносно повітря.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Дослідження заломлення світла (відео)",
  meta: {
    title:
      "Дослідження заломлення світла (за відео) — лабораторна робота №7, варіант 2",
    description:
      "Перегляньте відео досліду, запишіть кути падіння та заломлення світла, обчисліть показник заломлення й заповніть онлайн-звіт.",
  },
  Content,
};

export default lab;
