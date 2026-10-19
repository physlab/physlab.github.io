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
import sinksScheme from "@/assets/floating-conditions-sinks.png";
import submergedScheme from "@/assets/floating-conditions-submerged.png";
import surfaceScheme from "@/assets/floating-conditions-surface.png";
import type { LabDefinition } from "./types";

const TRIALS = [
  { n: 1, label: "Дослід 1 — тіло тоне" },
  { n: 2, label: "Дослід 2 — тіло плаває всередині рідини" },
  { n: 3, label: "Дослід 3 — тіло плаває на поверхні рідини" },
];

function Content() {
  return (
    <LabForm sheetName="Умови плавання тіл">
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

        <p>2. Визначте ціну поділки шкали вимірювального циліндра.</p>
        <p>
          Ціна поділки = <Cell id="cylinder_division" /> см³
        </p>

        <p>
          3. Закріпіть пробірку на нитці так, щоб, тримаючи за нитку, можна
          було занурити пробірку у воду, а потім витягти її.
        </p>
        <p>4. Підготуйте терези до роботи.</p>
      </Section>

      <Section title="Дослід 1. Перевірка умови, за якої тіло тоне в рідині">
        <p>
          <em>
            Дотримуйтесь інструкції з безпеки. Результати вимірювань
            відразу заносьте до таблиці.
          </em>
        </p>

        <p>1. Виміряйте об&apos;єм води V₀ у вимірювальному циліндрі.</p>
        <p>2. Наповніть пробірку піском до країв. Закрийте корок.</p>
        <p>
          3. Опустіть пробірку у вимірювальний циліндр. У результаті ваших
          дій пробірка має опинитися на дні (рис. 1).
        </p>

        <Figure
          src={sinksScheme}
          alt="Рис. 1. Пробірка з піском лежить на дні вимірювального циліндра з водою"
          className="w-32 mx-auto"
        />

        <p>
          4. Виміряйте об&apos;єм V води і пробірки; визначте об&apos;єм V
          <sub>п</sub> пробірки: V<sub>п</sub> = V − V₀.
        </p>
        <p>5. Витягніть пробірку, протріть її серветкою.</p>
        <p>
          6. Покладіть пробірку на терези та виміряйте її масу з точністю
          до 0,5 г.
        </p>
      </Section>

      <Section title="Дослід 2. Перевірка умови, за якої тіло плаває всередині рідини">
        <p>
          1. Відсипаючи пісок із пробірки, доможіться того, щоб пробірка
          вільно плавала всередині рідини (рис. 2).
        </p>

        <Figure
          src={submergedScheme}
          alt="Рис. 2. Пробірка з піском вільно плаває всередині рідини, не торкаючись дна"
          className="w-32 mx-auto"
        />

        <p>2. Повторіть дії, описані в п. 5–6 досліду 1.</p>
      </Section>

      <Section title="Дослід 3. Перевірка умови, за якої тіло плаває на поверхні рідини">
        <p>
          1. Відсипте з пробірки ще деяку кількість піску. Переконайтеся, що
          після повного занурення пробірки з піском у рідину пробірка
          спливає на поверхню рідини (рис. 3).
        </p>

        <Figure
          src={surfaceScheme}
          alt="Рис. 3. Пробірка з піском спливає й плаває на поверхні рідини"
          className="w-32 mx-auto"
        />

        <p>2. Повторіть дії, описані в п. 5–6 досліду 1.</p>
      </Section>

      <Section title="Результати вимірювань">
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
          1) виконайте на аркуші паперу схематичне креслення, на якому
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
  slug: "floating-conditions",
  grade: 7,
  badge: "10.1",
  number: "№ 10",
  title: "Перевірка умов плавання тіла",
  goal:
    "дослідним шляхом перевірити, за якої умови: тіло плаває на поверхні рідини; тіло плаває всередині рідини; тіло тоне в рідині.",
  equipment:
    "пробірка (або невелика склянка з-під ліків) з корком; нитка (або дротинка) завдовжки 20–25 см; посудина із сухим піском; вимірювальний циліндр, до половини наповнений водою; терези; паперові серветки.",
  sheetName: "Умови плавання тіл",
  meta: {
    title: "Перевірка умов плавання тіла — лабораторна робота №10",
    description:
      "Дослідіть, за якої умови тіло тоне, плаває всередині рідини або плаває на її поверхні, порівнюючи густину тіла й густину рідини.",
  },
  Content,
};

export default lab;
