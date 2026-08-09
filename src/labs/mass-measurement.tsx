import {
  LabForm,
  StudentBlock,
  Answer,
  Cell,
  HeaderCell,
  LabTable,
  Td,
} from "@/components/lab/lab-form";
import { Section } from "@/components/lab/lab-shell";
import { Formula } from "@/components/formula";
import type { LabDefinition } from "./types";

const ROWS = [
  { id: "body1", label: "Тіло 1" },
  { id: "body2", label: "Тіло 2" },
  { id: "empty_glass", label: "Порожня склянка" },
  { id: "water_glass", label: "Склянка з водою" },
];

function Content() {
  return (
    <LabForm sheetName="Вимірювання мас тіл">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>Прочитайте правила зважування.</p>

        <p>
          <strong>Правила зважування</strong>
        </p>
        <p>1. Зрівноважте терези, поклавши на легшу шальку клаптики паперу.</p>
        <p>2. Покладіть зважуване тіло на шальку терезів.</p>
        <p>
          3. Зрівноважте терези, виймаючи пінцетом важки з футляра та поступово
          додаючи їх на іншу шальку терезів.
        </p>
        <p>
          4. Визначте загальну масу важків на шальці; за допомогою пінцета
          поверніть важки у футляр.
        </p>

        <p>
          <strong>Нагадуємо!</strong> На шальки терезів не можна класти брудні
          тіла, наливати рідини; порошки слід насипати на аркуш, зрівноваживши
          перед цим терези разом з аркушем.
        </p>
      </Section>

      <Section title="Експеримент">
        <p>
          <em>Дотримуйтесь інструкції з безпеки.</em>
        </p>

        <p>
          1. Чітко дотримуючись правил зважування, виміряйте масу: а)
          запропонованих двох тіл; б) порожньої склянки; в) склянки з водою.
        </p>
        <p>2. Результати занесіть до таблиці.</p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Номер досліду">
                Номер досліду
              </HeaderCell>
              <HeaderCell id="h2" text="Зважуване тіло">
                Зважуване тіло
              </HeaderCell>
              <HeaderCell id="h3" text="Набір важків на шальці">
                Набір важків на шальці
              </HeaderCell>
              <HeaderCell id="h4" text="Маса тіла m0, г">
                Маса тіла m<sub>0</sub>, г
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr key={row.id}>
                <Td>{i + 1}</Td>
                <Td>{row.label}</Td>
                <Td>
                  <Cell id={`weights_${row.id}`} />
                </Td>
                <Td>
                  <Cell id={`mass_${row.id}`} />
                </Td>
              </tr>
            ))}
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>
          Визначте масу води в склянці як різницю маси склянки з водою та маси
          порожньої склянки:
        </p>
        <Formula math="m_{\text{води}} = m_{\text{склянки з водою}} - m_{\text{порожньої склянки}}" />
        <p>
          m<sub>води</sub> = <Cell id="water_mass" /> г
        </p>
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>Зробіть висновок, у якому зазначте:</p>

        <p>
          1) яку фізичну величину і за допомогою якого приладу ви вимірювали;
        </p>
        <Answer id="v1" rows={4} />

        <p>2) які чинники вплинули на точність вимірювань;</p>
        <Answer id="v2" rows={4} />

        <p>3) масу якого тіла виміряно з найбільшою точністю.</p>
        <Answer id="v3" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Виміряйте масу монетки. Що необхідно зробити, щоб отримати
          якнайточніший результат?
        </p>
        <p>
          Маса монетки = <Cell id="coin_mass" /> г
        </p>
        <Answer id="v_creative" rows={5} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "mass-measurement",
  grade: 7,
  badge: "4.1",
  number: "№ 4",
  title: "Вимірювання мас тіл",
  goal: "навчитися працювати з важільними терезами та визначати за їхньою допомогою маси тіл.",
  equipment:
    "важільні терези; набір важків; два тіла для зважування; дві однакові склянки: одна порожня, інша — з водою.",
  sheetName: "Вимірювання мас тіл",
  meta: {
    title: "Вимірювання мас тіл — лабораторна робота №4",
    description:
      "Навчіться працювати з важільними терезами та визначати масу тіл, порожньої склянки та склянки з водою.",
  },
  Content,
};

export default lab;
