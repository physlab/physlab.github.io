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

const EXPERIMENT_VIDEO = "https://www.youtube.com/embed/_3H31XQEJYs";

const ROWS = [
  { id: "body1", label: "Тіло 1" },
  { id: "body2", label: "Тіло 2" },
  { id: "empty_glass", label: "Порожня склянка" },
  { id: "water_glass", label: "Склянка з водою" },
];

function Content() {
  return (
    <LabForm sheetName="Вимірювання мас тіл (відео)">
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

        <p>
          У цьому варіанті роботи ви не проводите зважування самостійно, а
          переглядаєте відео з готовим дослідом. Уважно перегляньте відео нижче
          (за потреби ставте на паузу), запишіть подані в ньому дані до таблиці.
        </p>
      </Section>

      <Section title="Експеримент">
        <p>
          У відео показано зважування на важільних терезах: двох тіл, порожньої
          склянки та склянки з водою. Запишіть маси, отримані у відео, до
          таблиці.
        </p>

        <Simulation src={EXPERIMENT_VIDEO} title="Відеоексперимент" />

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
          Якщо у вас удома є важільні або кухонні терези — виміряйте масу
          монетки. Якщо ні — опишіть письмово, як саме ви б це зробили.
        </p>
        <p>Що необхідно зробити, щоб отримати якнайточніший результат?</p>
        <p>
          Маса монетки (якщо вимірювали) = <Cell id="coin_mass" /> г
        </p>
        <Answer id="v_creative" rows={5} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "mass-measurement-video",
  grade: 7,
  badge: "4.2",
  number: "№ 4",
  title: "Вимірювання мас тіл. Варіант 2 (за відео)",
  goal: "навчитися працювати з важільними терезами та визначати за їхньою допомогою маси тіл.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Вимірювання мас тіл (відео)",
  meta: {
    title: "Вимірювання мас тіл (за відео) — лабораторна робота №4, варіант 2",
    description:
      "Перегляньте відео зважування на важільних терезах, запишіть дані до таблиці та визначте масу води в склянці.",
  },
  Content,
};

export default lab;
