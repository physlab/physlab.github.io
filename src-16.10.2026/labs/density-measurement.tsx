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
import { Figure, Section } from "@/components/lab/lab-shell";
import { Formula } from "@/components/formula";
import volumeMethodScheme from "@/assets/density-measurement-volume-method.png";
import overflowVesselScheme from "@/assets/density-measurement-overflow-vessel.png";
import type { LabDefinition } from "./types";

const ROWS = [
  { id: "solid", label: "Тверде тіло" },
  { id: "liquid", label: "Рідина" },
];

function Content() {
  return (
    <LabForm sheetName="Густина речовини">
      <StudentBlock />

      <Section title="Експеримент">
        <p>
          <em>
            Дотримуйтесь інструкції з безпеки. Результати вимірювань і обчислень
            відразу заносьте до таблиці.
          </em>
        </p>

        <p>1. Виміряйте масу твердого тіла за допомогою терезів.</p>

        <p>
          2. Виміряйте об&apos;єм твердого тіла за допомогою мірної посудини
          (див. рисунок): занурте тіло у воду в мірній посудині та визначте його
          об&apos;єм за різницею рівнів води до і після занурення.
        </p>

        <Figure
          src={volumeMethodScheme}
          alt="Визначення об'єму твердого тіла за різницею рівнів води в мірній посудині до і після занурення"
          className="w-full max-w-lg mx-auto"
        />

        <p>3. Визначте масу та об&apos;єм досліджуваної рідини:</p>
        <p>• виміряйте масу склянки з досліджуваною рідиною;</p>
        <p>
          • перелийте рідину в мірну посудину та виміряйте об&apos;єм рідини;
        </p>
        <p>• виміряйте масу порожньої склянки;</p>
        <p>• обчисліть масу рідини.</p>

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
      <Section title="Фото установки">
        <ImageCanvas
          label="Прикріпіть фото установки"
          height={400}
          minHeight={250}
          maxHeight={700}
          maxImages={6}
        />
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
  slug: "density-measurement",
  grade: 7,
  badge: "5.1",
  number: "№ 5",
  title: "Вимірювання густини твердого тіла та рідини",
  goal: "навчитися вимірювати густину твердого тіла та рідини за допомогою терезів і мірної посудини.",
  equipment:
    "терези з важками; тверде тіло (кубик) на нитці; мірна посудина; склянка з водою; склянка з досліджуваною рідиною; порожня склянка; паперові серветки.",
  sheetName: "Густина речовини",
  meta: {
    title:
      "Вимірювання густини твердого тіла та рідини — лабораторна робота №5",
    description:
      "Виміряйте масу та об'єм твердого тіла й рідини та визначте їхню густину за допомогою терезів і мірної посудини.",
  },
  Content,
};

export default lab;
