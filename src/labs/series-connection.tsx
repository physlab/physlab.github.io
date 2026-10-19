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
import { Section } from "@/components/lab/lab-shell";
import { Formula } from "@/components/formula";
import type { LabDefinition } from "./types";

function Content() {
  return (
    <LabForm sheetName="Послідовне з'єднання провідників">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>
          1. Переконайтеся, що ви знаєте вимоги безпеки під час роботи з
          електричними колами.
        </p>
        <Answer id="v_safety" rows={3} />

        <p>
          2. Накресліть схему електричного кола, яке складається із
          джерела струму, двох резисторів і ключа, з&apos;єднаних
          послідовно.
        </p>
        <ImageCanvas
          label="Прикріпіть фото накресленої схеми"
          height={300}
          minHeight={200}
          maxHeight={500}
          maxImages={2}
        />

        <p>
          3. Складіть і запишіть план проведення експерименту. Якщо
          вагаєтеся, скористайтеся планом, наведеним у розділі
          &quot;Експеримент&quot; нижче.
        </p>
        <Answer id="v_plan" rows={6} />
      </Section>

      <Section title="Експеримент">
        <p>
          <em>
            Дотримуйтесь інструкції з безпеки. Результати вимірювань і
            обчислень, а також окремі висновки відразу заносьте до
            таблиць.
          </em>
        </p>

        <p>
          <strong>Дослід 1.</strong> Порівняння сили струму в різних
          ділянках кола.
        </p>
        <p>1. Складіть електричне коло за накресленою вами схемою.</p>
        <p>
          2. Виміряйте силу струму, увімкнувши амперметр спочатку між
          джерелом струму й першим резистором (I₁), потім між ключем і
          другим резистором (I₂), а потім між ключем і джерелом струму
          (I). Накресліть схеми відповідних електричних кіл.
        </p>
        <ImageCanvas
          label="Прикріпіть фото схем для I1, I2, I"
          height={300}
          minHeight={200}
          maxHeight={500}
          maxImages={3}
        />

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
          У колі, складеному для проведення досліду 1, виміряйте напругу
          спочатку на першому резисторі (U₁), потім на другому (U₂), а
          потім на обох резисторах (U). Накресліть схеми відповідних
          електричних кіл.
        </p>
        <ImageCanvas
          label="Прикріпіть фото схем для U1, U2, U"
          height={300}
          minHeight={200}
          maxHeight={500}
          maxImages={3}
        />

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
  slug: "series-connection",
  grade: 8,
  badge: "7.1",
  number: "№ 7",
  title: "Дослідження електричного кола з послідовним з'єднанням провідників",
  goal:
    "експериментально перевірити, що в разі послідовного з'єднання двох провідників справджуються співвідношення: I = I1 = I2; U = U1 + U2; R = R1 + R2.",
  equipment:
    "джерело струму; вольтметр; амперметр; ключ; два резистори; з'єднувальні проводи.",
  sheetName: "Послідовне з'єднання провідників",
  meta: {
    title:
      "Дослідження електричного кола з послідовним з'єднанням провідників — лабораторна робота №7 (8 клас)",
    description:
      "Перевірте дослідним шляхом співвідношення для сили струму, напруги та опору при послідовному з'єднанні провідників.",
  },
  Content,
};

export default lab;
