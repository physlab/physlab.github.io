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

const EXPERIMENT_VIDEO = "https://www.youtube.com/embed/1k7e-3j9U6o";

function Content() {
  return (
    <LabForm sheetName="Послідовне з'єднання провідників (відео)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>
          1. Переконайтеся, що ви знаєте вимоги безпеки під час роботи з
          електричними колами.
        </p>
        <Answer id="v_safety" rows={3} />

        <p>
          2. У цьому варіанті роботи ви не збираєте коло самостійно, а
          переглядаєте відео з готовим дослідом. Уважно перегляньте відео
          нижче (за потреби ставте на паузу й переглядайте окремі моменти
          повторно), запишіть подані в ньому дані до таблиць та виконайте
          обчислення.
        </p>
      </Section>

      <Section title="Експеримент">
        <p>
          <em>Переглядаючи відео, заносьте результати вимірювань і обчислень відразу до таблиць.</em>
        </p>

        <p>
          У відео зібрано коло з джерела струму, двох послідовно
          з&apos;єднаних резисторів і ключа. Амперметр по черзі вмикають
          між джерелом і першим резистором (I₁), між ключем і другим
          резистором (I₂), а потім між ключем і джерелом струму (I).
        </p>

        <Simulation src={EXPERIMENT_VIDEO} title="Відеоексперимент" />

        <p>
          <strong>Дослід 1.</strong> Порівняння сили струму в різних
          ділянках кола.
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1_1" text="I1, А">
                I<sub>1</sub>, А
              </HeaderCell>
              <HeaderCell id="h1_2" text="I2, А">
                I<sub>2</sub>, А
              </HeaderCell>
              <HeaderCell id="h1_3" text="I, А">
                I, А
              </HeaderCell>
              <HeaderCell id="h1_4" text="Висновок">
                Висновок
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <Cell id="I1" />
              </Td>
              <Td>
                <Cell id="I2" />
              </Td>
              <Td>
                <Cell id="I" />
              </Td>
              <Td>
                <Cell id="conclusion1" />
              </Td>
            </tr>
          </tbody>
        </LabTable>

        <p>
          <strong>Дослід 2.</strong> Порівняння загальної напруги на
          ділянці кола, яка складається з послідовно з&apos;єднаних
          резисторів, і суми напруг на окремих резисторах.
        </p>
        <p>
          У тому самому колі у відео вольтметр по черзі підключають до
          першого резистора (U₁), другого резистора (U₂), а потім до
          обох резисторів разом (U).
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h2_1" text="U1, В">
                U<sub>1</sub>, В
              </HeaderCell>
              <HeaderCell id="h2_2" text="U2, В">
                U<sub>2</sub>, В
              </HeaderCell>
              <HeaderCell id="h2_3" text="U, В">
                U, В
              </HeaderCell>
              <HeaderCell id="h2_4" text="(U1+U2), В">
                (U<sub>1</sub>+U<sub>2</sub>), В
              </HeaderCell>
              <HeaderCell id="h2_5" text="Висновок">
                Висновок
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <Cell id="U1" />
              </Td>
              <Td>
                <Cell id="U2" />
              </Td>
              <Td>
                <Cell id="U" />
              </Td>
              <Td>
                <Cell id="U1_plus_U2" />
              </Td>
              <Td>
                <Cell id="conclusion2" />
              </Td>
            </tr>
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>
          Використовуючи результати дослідів 1 і 2, обчисліть опір першого
          резистора (R₁), другого резистора (R₂) та опір ділянки кола, яка
          містить обидва резистори (R):
        </p>
        <Formula math="R_1 = \dfrac{U_1}{I_1}; \quad R_2 = \dfrac{U_2}{I_2}; \quad R = \dfrac{U}{I}" />

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h3_1" text="R1, Ом">
                R<sub>1</sub>, Ом
              </HeaderCell>
              <HeaderCell id="h3_2" text="R2, Ом">
                R<sub>2</sub>, Ом
              </HeaderCell>
              <HeaderCell id="h3_3" text="R, Ом">
                R, Ом
              </HeaderCell>
              <HeaderCell id="h3_4" text="(R1+R2), Ом">
                (R<sub>1</sub>+R<sub>2</sub>), Ом
              </HeaderCell>
              <HeaderCell id="h3_5" text="Висновок">
                Висновок
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <Cell id="R1" />
              </Td>
              <Td>
                <Cell id="R2" />
              </Td>
              <Td>
                <Cell id="R" />
              </Td>
              <Td>
                <Cell id="R1_plus_R2" />
              </Td>
              <Td>
                <Cell id="conclusion3" />
              </Td>
            </tr>
          </tbody>
        </LabTable>
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          Проаналізувавши експеримент і його результати, зробіть висновок,
          у якому зазначте:
        </p>

        <p>
          1) які співвідношення для послідовно з&apos;єднаних провідників
          ви перевіряли та які результати одержали;
        </p>
        <Answer id="v1" rows={5} />

        <p>2) які чинники могли вплинути на точність отриманих результатів.</p>
        <Answer id="v2" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Запишіть план проведення експерименту, за допомогою якого можна
          визначити опір резистора, якщо ви маєте вольтметр, джерело
          струму, резистор відомого опору та з&apos;єднувальні проводи
          (без амперметра!).
        </p>
        <Answer id="v_creative_plan" rows={6} />

        <p>Проведіть відповідний експеримент. Наведіть отриманий результат:</p>
        <Answer id="v_creative_result" rows={5} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "series-connection-video",
  grade: 8,
  badge: "7.2",
  number: "№ 7",
  title:
    "Дослідження електричного кола з послідовним з'єднанням провідників. Варіант 2 (за відео)",
  goal:
    "експериментально перевірити, що в разі послідовного з'єднання двох провідників справджуються співвідношення: I = I1 = I2; U = U1 + U2; R = R1 + R2.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Послідовне з'єднання провідників (відео)",
  meta: {
    title:
      "Дослідження послідовного з'єднання провідників (за відео) — лабораторна робота №7 (8 клас), варіант 2",
    description:
      "Перегляньте відео досліду з послідовно з'єднаними резисторами та перевірте співвідношення для сили струму, напруги й опору.",
  },
  Content,
};

export default lab;
