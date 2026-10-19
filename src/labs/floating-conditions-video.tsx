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

const EXPERIMENT_VIDEO = "https://www.youtube.com/embed/UCAMJ5QlWkA";

const TRIALS = [
  { n: 1, label: "Дослід 1 — тіло тоне" },
  { n: 2, label: "Дослід 2 — тіло плаває всередині рідини" },
  { n: 3, label: "Дослід 3 — тіло плаває на поверхні рідини" },
];

function Content() {
  return (
    <LabForm sheetName="Умови плавання тіл (відео)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>
          1. Перш ніж виконувати роботу, переконайтеся, що ви знаєте
          відповіді на такі запитання.
        </p>
        <p>1) Які сили діють на тіло, занурене в рідину?</p>
        <Answer id="v_forces" rows={4} />

        <p>
          2) За якою формулою визначають: силу тяжіння; архімедову силу;
          середню густину тіла?
        </p>
        <Answer id="v_formulas" rows={4} />

        <p>3) Якими є умови плавання тіл?</p>
        <Answer id="v_floating_conditions" rows={4} />

        <p>
          2. У цьому варіанті роботи ви не проводите досліди самостійно, а
          переглядаєте відео з готовими дослідами. Уважно перегляньте відео
          нижче (за потреби ставте на паузу й переглядайте окремі моменти
          повторно), запишіть подані в ньому дані до таблиці та виконайте
          обчислення.
        </p>
      </Section>

      <Section title="Експеримент">
        <p>
          <em>Переглядаючи відео, заносьте результати вимірювань відразу до таблиці.</em>
        </p>

        <p>
          У відео пробірку з піском послідовно занурюють у вимірювальний
          циліндр з водою тричі, щоразу з іншою кількістю піску: спочатку
          пробірка тоне (дослід 1), потім, після відсипання частини піску,
          вільно плаває всередині рідини (дослід 2), а після подальшого
          відсипання піску спливає на поверхню (дослід 3). У кожному
          досліді показано об&apos;єм рідини й пробірки та масу пробірки з
          піском.
        </p>

        <Simulation src={EXPERIMENT_VIDEO} title="Відеоексперимент" />

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Номер досліду">
                Номер досліду
              </HeaderCell>
              <HeaderCell id="h2" text="V0, см³">
                V<sub>0</sub>, см<sup>3</sup>
              </HeaderCell>
              <HeaderCell id="h3" text="V, см³">
                V, см<sup>3</sup>
              </HeaderCell>
              <HeaderCell id="h4" text="Vп, см³">
                V<sub>п</sub>, см<sup>3</sup>
              </HeaderCell>
              <HeaderCell id="h5" text="Маса пробірки з піском m, г">
                Маса пробірки з піском m, г
              </HeaderCell>
              <HeaderCell id="h6" text="Густина пробірки ρп, г/см³">
                Густина пробірки ρ<sub>п</sub>, г/см<sup>3</sup>
              </HeaderCell>
              <HeaderCell id="h7" text="Густина рідини ρр, г/см³">
                Густина рідини ρ<sub>р</sub>, г/см<sup>3</sup>
              </HeaderCell>
              <HeaderCell id="h8" text="Порівняння ρп і ρр">
                Порівняння ρ<sub>п</sub> і ρ<sub>р</sub>
              </HeaderCell>
              <HeaderCell id="h9" text="Яке явище спостерігається">
                Яке явище спостерігається
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {TRIALS.map((trial, i) => (
              <tr key={trial.n}>
                <Td>{trial.n}</Td>
                {i === 0 && (
                  <Td rowSpan={3}>
                    <Cell id="V0" />
                  </Td>
                )}
                <Td>
                  <Cell id={`V${trial.n}`} />
                </Td>
                <Td>
                  <Cell id={`Vp${trial.n}`} />
                </Td>
                <Td>
                  <Cell id={`m${trial.n}`} />
                </Td>
                <Td>
                  <Cell id={`rho_p${trial.n}`} />
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
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>1. Для кожного досліду:</p>
        <p>
          1) на аркуші паперу виконайте схематичне креслення, на якому
          зазначте сили, що діють на пробірку; опишіть ці сили тут:
        </p>
        <Answer id="v_force_diagrams" rows={5} />

        <p>2) визначте середню густину ρп пробірки з піском:</p>
        <Formula math="\rho_{\text{п}} = \dfrac{m}{V_{\text{п}}}" />

        <p>2. Занесіть до таблиці результати обчислень, закінчіть її заповнення.</p>
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

        <p>Запишіть план проведення кожного досліду.</p>
        <Answer id="v_creative_plan" rows={6} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "floating-conditions-video",
  grade: 7,
  badge: "10.2",
  number: "№ 10",
  title: "Перевірка умов плавання тіла. Варіант 2 (за відео)",
  goal:
    "дослідним шляхом перевірити, за якої умови: тіло плаває на поверхні рідини; тіло плаває всередині рідини; тіло тоне в рідині.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Умови плавання тіл (відео)",
  meta: {
    title:
      "Перевірка умов плавання тіла (за відео) — лабораторна робота №10, варіант 2",
    description:
      "Перегляньте відео дослідів з пробіркою в рідині та визначте, за якої умови тіло тоне, плаває всередині рідини або на її поверхні.",
  },
  Content,
};

export default lab;
