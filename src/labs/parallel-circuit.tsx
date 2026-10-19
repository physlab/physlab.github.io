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
import ammeterTotal from "@/assets/parallel-circuit-ammeter-total.png";
import ammeterLamp1 from "@/assets/parallel-circuit-ammeter-lamp1.png";
import ammeterLamp2 from "@/assets/parallel-circuit-ammeter-lamp2.png";
import type { LabDefinition } from "./types";

function Content() {
  return (
    <LabForm sheetName="Паралельне з’єднання провідників">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>
          1. Переконайтеся, що ви знаєте вимоги безпеки під час роботи з
          електричними колами.
        </p>

        <p>
          2. Накресліть схему електричного кола, яке складається з двох
          паралельно з’єднаних ламп, що через ключ з’єднані з джерелом
          струму.
        </p>
        <Answer id="v_scheme_main" rows={5} />

        <p>
          3. Складіть і запишіть план проведення експерименту. Якщо
          вагаєтесь, скористайтеся наведеним далі планом.
        </p>
        <Answer id="v_plan" rows={5} />
      </Section>

      <Section title="Експеримент">
        <p>
          <em>
            Дотримуйтесь інструкції з безпеки. Результати вимірювань відразу
            заносьте до таблиці.
          </em>
        </p>

        <p>1. Складіть електричне коло за накресленою вами схемою.</p>

        <p>2. Виміряйте напругу U на лампах.</p>

        <p>
          3. Під’єднавши амперметр до відповідної ділянки кола, виміряйте:
        </p>
        <p>
          — силу струму I, який проходить у нерозгалуженій частині кола
          (рис. 1);
        </p>
        <Figure
          src={ammeterTotal}
          alt="Амперметр підключено в нерозгалуженій частині кола для вимірювання загальної сили струму I"
          className="w-64 mx-auto"
        />

        <p>— силу струму I₁ в лампі 1 (рис. 2);</p>
        <Figure
          src={ammeterLamp1}
          alt="Амперметр підключено послідовно з лампою 1 для вимірювання сили струму I1"
          className="w-64 mx-auto"
        />

        <p>— силу струму I₂ в лампі 2 (рис. 3).</p>
        <Figure
          src={ammeterLamp2}
          alt="Амперметр підключено послідовно з лампою 2 для вимірювання сили струму I2"
          className="w-64 mx-auto"
        />

        <p>4. Накресліть схеми відповідних електричних кіл.</p>
        <Answer id="v_scheme_variants" rows={5} />

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="U, В">
                U, В
              </HeaderCell>
              <HeaderCell id="h2" text="I, А">
                I, А
              </HeaderCell>
              <HeaderCell id="h3" text="I1, А">
                I<sub>1</sub>, А
              </HeaderCell>
              <HeaderCell id="h4" text="I2, А">
                I<sub>2</sub>, А
              </HeaderCell>
              <HeaderCell id="h5" text="R1, Ом">
                R<sub>1</sub>, Ом
              </HeaderCell>
              <HeaderCell id="h6" text="R2, Ом">
                R<sub>2</sub>, Ом
              </HeaderCell>
              <HeaderCell id="h7" text="R, Ом">
                R, Ом
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <Cell id="U_value" />
              </Td>
              <Td>
                <Cell id="I_value" />
              </Td>
              <Td>
                <Cell id="I1_value" />
              </Td>
              <Td>
                <Cell id="I2_value" />
              </Td>
              <Td>
                <Cell id="R1_value" />
              </Td>
              <Td>
                <Cell id="R2_value" />
              </Td>
              <Td>
                <Cell id="R_value" />
              </Td>
            </tr>
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>
          Використавши результати вимірювань, обчисліть опір R₁ нитки
          розжарення лампи 1; опір R₂ нитки розжарення лампи 2; опір R
          ділянки кола, яка містить обидві лампи. Результати обчислень
          занесіть до таблиці.
        </p>
        <Formula math="R_1 = \dfrac{U}{I_1}, \qquad R_2 = \dfrac{U}{I_2}, \qquad R = \dfrac{U}{I}" />
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          Проаналізувавши експеримент і його результати, зробіть висновок, у
          якому зазначте:
        </p>
        <p>
          1) які співвідношення для паралельно з’єднаних провідників ви
          перевіряли та які результати одержали;
        </p>
        <p>2) які чинники могли вплинути на точність одержаних результатів.</p>
        <Answer id="v1" rows={6} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Запишіть план проведення експерименту, за допомогою якого можна
          визначити опір резистора, якщо наявні амперметр, джерело струму,
          резистор відомого опору та з’єднувальні проводи. Проведіть
          відповідний експеримент.
        </p>
        <Answer id="v_creative1" rows={7} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "parallel-circuit",
  grade: 8,
  badge: "8.1",
  number: "№ 8",
  title: "Дослідження електричного кола з паралельним з’єднанням провідників",
  goal:
    "експериментально перевірити, що сила струму в нерозгалуженій частині кола дорівнює сумі сил струмів у відгалуженнях; довести, що загальний опір провідників, з’єднаних паралельно, менший від опору кожного з них.",
  equipment:
    "джерело струму; вольтметр; амперметр; ключ; дві електричні лампи на підставках; з’єднувальні проводи.",
  sheetName: "Паралельне з’єднання провідників",
  meta: {
    title:
      "Дослідження кола з паралельним з’єднанням провідників — лабораторна робота №8 (8 клас)",
    description:
      "Перевірте дослідним шляхом закони паралельного з’єднання провідників: суму сил струмів у відгалуженнях та опір ділянки кола.",
  },
  Content,
};

export default lab;
