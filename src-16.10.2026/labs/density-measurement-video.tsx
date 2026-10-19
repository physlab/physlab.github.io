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
import overflowVesselScheme from "@/assets/density-measurement-overflow-vessel.png";
import type { LabDefinition } from "./types";

const EXPERIMENT_VIDEO = "https://www.youtube.com/embed/V0neZn6CZhE";

const ROWS = [
  { id: "solid", label: "Тверде тіло" },
  { id: "liquid", label: "Рідина" },
];

function Content() {
  return (
    <LabForm sheetName="Густина речовини (відео)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>
          У цьому варіанті роботи ви не проводите вимірювання самостійно, а
          переглядаєте відео з готовим дослідом. Уважно перегляньте відео нижче
          (за потреби ставте на паузу й переглядайте окремі моменти повторно),
          запишіть подані в ньому дані до таблиці та виконайте обчислення.
        </p>
      </Section>

      <Section title="Експеримент">
        <p>
          <em>
            Переглядаючи відео, заносьте результати вимірювань відразу до
            таблиці.
          </em>
        </p>

        <p>
          У відео показано, як вимірюють масу твердого тіла терезами, його
          об&apos;єм — мірною посудиною (за різницею рівнів води до і після
          занурення), а також масу та об&apos;єм досліджуваної рідини.
        </p>

        <Simulation src={EXPERIMENT_VIDEO} title="Відеоексперимент" />

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Досліджуване тіло або рідина">
                Досліджуване тіло або рідина
              </HeaderCell>
              <HeaderCell id="h2" text="Маса m, г">
                Маса m, г
              </HeaderCell>
              <HeaderCell id="h3" text="Об'єм V, см³">
                Об&apos;єм V, см<sup>3</sup>
              </HeaderCell>
              <HeaderCell id="h4" text="Густина ρ, г/см³">
                Густина ρ, г/см<sup>3</sup>
              </HeaderCell>
              <HeaderCell id="h5" text="Густина ρ, кг/м³">
                Густина ρ, кг/м<sup>3</sup>
              </HeaderCell>
              <HeaderCell id="h6" text="Речовина">
                Речовина
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.id}>
                <Td>{row.label}</Td>
                <Td>
                  <Cell id={`m_${row.id}`} />
                </Td>
                <Td>
                  <Cell id={`V_${row.id}`} />
                </Td>
                <Td>
                  <Cell id={`rho_gcm3_${row.id}`} />
                </Td>
                <Td>
                  <Cell id={`rho_kgm3_${row.id}`} />
                </Td>
                <Td>
                  <Cell id={`substance_${row.id}`} />
                </Td>
              </tr>
            ))}
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>
          1. Визначте густину речовини, з якої виготовлено тверде тіло, та
          густину досліджуваної рідини:
        </p>
        <Formula math="\rho = \dfrac{m}{V}" />

        <p>
          2. Користуючись таблицями густин, визначте речовини, які досліджено, і
          запишіть їх до таблиці.
        </p>
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>Зробіть висновок, у якому зазначте:</p>

        <p>
          1) яку фізичну величину та за допомогою яких приладів ви вимірювали;
        </p>
        <Answer id="v1" rows={4} />

        <p>2) які чинники могли вплинути на точність результатів.</p>
        <Answer id="v2" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Запропонуйте способи (теоретичний та експериментальний), за допомогою
          яких можна знайти масу води, що виллється з відливної посудини (див.
          рисунок), якщо в неї повільно занурити, наприклад, алюмінієвий кубик.
        </p>

        <Figure
          src={overflowVesselScheme}
          alt="Відливна посудина: тіло занурюють у повну посудину, витіснена рідина виливається в склянку"
          className="w-full max-w-md mx-auto"
        />

        <p>Теоретичний спосіб:</p>
        <Answer id="v_theoretical" rows={5} />

        <p>Експериментальний спосіб:</p>
        <Answer id="v_experimental" rows={5} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "density-measurement-video",
  grade: 7,
  badge: "5.2",
  number: "№ 5",
  title: "Вимірювання густини твердого тіла та рідини. Варіант 2 (за відео)",
  goal: "навчитися вимірювати густину твердого тіла та рідини за допомогою терезів і мірної посудини.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Густина речовини (відео)",
  meta: {
    title:
      "Вимірювання густини твердого тіла та рідини (за відео) — лабораторна робота №5, варіант 2",
    description:
      "Перегляньте відео вимірювання маси та об'єму твердого тіла й рідини, запишіть дані до таблиці та визначте густину.",
  },
  Content,
};

export default lab;
