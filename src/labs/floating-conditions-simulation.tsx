import {
  LabForm,
  StudentBlock,
  Answer,
  Cell,
  HeaderCell,
  LabTable,
  Td,
} from "@/components/lab/lab-form";
import { Section, Simulation } from "@/components/lab/lab-shell";
import { Formula } from "@/components/formula";
import type { LabDefinition } from "./types";

const SIMULATION_URL =
  "https://phet.colorado.edu/sims/html/buoyancy/latest/buoyancy_all.html";

const TRIALS = [
  { n: 1, label: "Дослід 1 — тіло тоне" },
  { n: 2, label: "Дослід 2 — тіло плаває всередині рідини" },
  { n: 3, label: "Дослід 3 — тіло плаває на поверхні рідини" },
];

function Content() {
  return (
    <LabForm sheetName="Умови плавання тіл (симуляція)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>
          1. Перш ніж виконувати роботу, переконайтеся, що ви знаєте відповіді
          на такі запитання.
        </p>
        <p>1) Які сили діють на тіло, занурене в рідину?</p>
        <Answer id="v_forces" rows={4} />

        <p>
          2) За якою формулою визначають: силу тяжіння; архімедову силу; середню
          густину тіла?
        </p>
        <Answer id="v_formulas" rows={4} />

        <p>3) Якими є умови плавання тіл?</p>
        <Answer id="v_floating_conditions" rows={4} />

        <p>
          2. У цьому варіанті роботи замість пробірки з піском використовується
          об&apos;єкт <strong>Custom</strong> у симуляції PhET{" "}
          <strong>Buoyancy</strong> (екран Explore): у нього можна незалежно
          задавати масу й об&apos;єм, а отже — й густину, замість того щоб
          відсипати пісок. Увімкніть позначки <strong>Show Forces</strong> і{" "}
          <strong>Readouts</strong>.
        </p>

        <Simulation src={SIMULATION_URL} title="PhET: Buoyancy" />
      </Section>

      <Section title="Експеримент">
        <p>
          <em>Результати вимірювань відразу заносьте до таблиці.</em>
        </p>

        <p>
          <strong>Дослід 1.</strong> Задайте об&apos;єкту Custom такі масу і
          об&apos;єм, щоб його густина була помітно більшою за густину рідини
          (за замовчуванням — води, 1 г/см³). Занурте об&apos;єкт у воду й
          переконайтеся, що він тоне (опускається на дно).
        </p>

        <p>
          <strong>Дослід 2.</strong> Підберіть масу й об&apos;єм так, щоб
          густина об&apos;єкта була максимально близькою до густини рідини.
          Занурте об&apos;єкт повністю під воду і обережно відпустіть —
          спробуйте досягти того, щоб він якомога довше залишався зануреним, не
          спливаючи і не тонучи.
        </p>

        <p>
          <strong>Дослід 3.</strong> Зменшіть масу об&apos;єкта (або збільшіть
          об&apos;єм) так, щоб його густина стала меншою за густину рідини.
          Переконайтеся, що після занурення об&apos;єкт спливає й плаває на
          поверхні.
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Номер досліду">
                Номер досліду
              </HeaderCell>
              <HeaderCell id="h2" text="Маса тіла m, г">
                Маса тіла m, г
              </HeaderCell>
              <HeaderCell id="h3" text="Об'єм тіла Vт, см³">
                Об&apos;єм тіла V<sub>т</sub>, см<sup>3</sup>
              </HeaderCell>
              <HeaderCell id="h4" text="Густина тіла ρт, г/см³">
                Густина тіла ρ<sub>т</sub>, г/см<sup>3</sup>
              </HeaderCell>
              <HeaderCell id="h5" text="Густина рідини ρр, г/см³">
                Густина рідини ρ<sub>р</sub>, г/см<sup>3</sup>
              </HeaderCell>
              <HeaderCell id="h6" text="Порівняння ρт і ρр">
                Порівняння ρ<sub>т</sub> і ρ<sub>р</sub>
              </HeaderCell>
              <HeaderCell id="h7" text="Яке явище спостерігається">
                Яке явище спостерігається
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {TRIALS.map((trial, i) => (
              <tr key={trial.n}>
                <Td>{trial.n}</Td>
                <Td>
                  <Cell id={`m${trial.n}`} />
                </Td>
                <Td>
                  <Cell id={`Vt${trial.n}`} />
                </Td>
                <Td>
                  <Cell id={`rho_t${trial.n}`} />
                </Td>
                {i === 0 && (
                  <Td rowSpan={3}>
                    <Cell id="rho_r" />
                  </Td>
                )}
                <Td>
                  <Cell id={`compare${trial.n}`} />
                </Td>
                <Td>
                  <Cell id={`phenomenon${trial.n}`} />
                </Td>
              </tr>
            ))}
          </tbody>
        </LabTable>

        <p>
          <em>
            Примітка: на відміну від реального досліду, у симуляторі «плавання
            всередині рідини» (дослід 2) — нестійкий стан: об&apos;єкт із
            густиною, що точно дорівнює густині рідини, може повільно спливати
            чи тонути через відсутність тертя. Це нормально й теж варто
            зазначити у висновку.
          </em>
        </p>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>1. Для кожного досліду:</p>
        <p>
          1) на аркуші паперу виконайте схематичне креслення, на якому зазначте
          сили, що діють на тіло; опишіть ці сили тут:
        </p>
        <Answer id="v_force_diagrams" rows={5} />

        <p>2) визначте середню густину ρт тіла:</p>
        <Formula math="\rho_{\text{т}} = \dfrac{m}{V_{\text{т}}}" />

        <p>
          2. Занесіть до таблиці результати обчислень, закінчіть її заповнення.
        </p>
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          Проаналізувавши експеримент, зробіть висновок, у якому зазначте
          результати перевірки умов плавання тіл.
        </p>
        <Answer id="v_conclusion" rows={6} />
      </Section>

      <Section title="Творче завдання">
        <p>Запропонуйте два способи визначення середньої густини яйця.</p>
        <p>Спосіб 1:</p>
        <Answer id="v_creative_1" rows={4} />
        <p>Спосіб 2:</p>
        <Answer id="v_creative_2" rows={4} />

        <p>
          Запишіть план проведення кожного досліду. За можливості перевірте
          другий спосіб у симуляції, використавши об&apos;єкт Custom із
          розмірами й густиною, близькими до яйця.
        </p>
        <Answer id="v_creative_plan" rows={6} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "floating-conditions-simulation",
  grade: 7,
  badge: "10.3",
  number: "№ 10",
  title: "Перевірка умов плавання тіла. Варіант 3 (симуляція)",
  goal: "дослідним шляхом перевірити, за якої умови: тіло плаває на поверхні рідини; тіло плаває всередині рідини; тіло тоне в рідині.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Умови плавання тіл (симуляція)",
  meta: {
    title:
      "Перевірка умов плавання тіла (симуляція) — лабораторна робота №10, варіант 3",
    description:
      "Дослідіть умови плавання тіл за допомогою симуляції PhET Buoyancy, порівнюючи густину тіла й густину рідини.",
  },
  Content,
};

export default lab;
