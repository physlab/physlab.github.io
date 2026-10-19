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
import airScheme from "@/assets/hydrostatic-weighing-air-scheme.png";
import waterScheme from "@/assets/hydrostatic-weighing-water-scheme.png";
import type { LabDefinition } from "./types";

const EXPERIMENT_VIDEO = "https://www.youtube.com/embed/uhqfbuSggkU";

const BODIES = [
  { id: "body1", label: "Тіло 1 (наприклад, пластилін)" },
  { id: "body2", label: "Тіло 2 (наприклад, брелок)" },
];

function Content() {
  return (
    <LabForm sheetName="Гідростатичне зважування (відео)">
      <StudentBlock />

      <Section title="Теоретичні відомості">
        <p>
          Якщо досліджуване тіло тоне у воді, то для визначення його маси
          методом гідростатичного зважування виконують такі дії.
        </p>

        <p>
          <strong>Крок 1.</strong> Вимірюють початкову довжину l₀ пружини.
          Потім тіло підвішують на пружині в повітрі та вимірюють видовження
          x₁ пружини: x₁ = l₁ − l₀ (див. рис. 1). На тіло діють дві сили —
          сила тяжіння й сила пружності, адже дією архімедової сили в
          повітрі можна знехтувати. Тіло перебуває в стані спокою, тому
          сили, що діють на нього, є зрівноваженими:
        </p>
        <Formula math="F_{\text{пруж}} = F_{\text{тяж}}" />
        <p>
          Тут F<sub>пруж</sub> = kx₁ (де k — жорсткість пружини), а F
          <sub>тяж</sub> = mg. Отже, дістанемо:
        </p>
        <Formula math="kx_1 = mg \quad (1)" />

        <Figure
          src={airScheme}
          alt="Рис. 1. Тіло підвішене на пружині в повітрі; діють сила пружності та сила тяжіння"
          className="w-full max-w-xs mx-auto"
        />

        <p>
          <strong>Крок 2.</strong> Вимірюють об&apos;єм V₀ води у
          вимірювальному циліндрі. Потім, зануривши тіло у вимірювальний
          циліндр з водою, вимірюють: 1) об&apos;єм V<sub>т</sub> тіла; 2)
          видовження x₂ пружини: x₂ = l₂ − l₀ (див. рис. 2). Тепер на тіло
          діють три сили: сила тяжіння, сила пружності й архімедова сила.
          Сили зрівноважені:
        </p>
        <Formula math="F_{\text{пруж}} + F_{\text{арх}} = F_{\text{тяж}}" />
        <p>
          Тут F<sub>пруж</sub> = kx₂, а F<sub>арх</sub> = ρ<sub>води</sub>gV
          <sub>т</sub>, тому:
        </p>
        <Formula math="kx_2 + \rho_{\text{води}} g V_{\text{т}} = mg \implies kx_2 = mg - \rho_{\text{води}} g V_{\text{т}} \quad (2)" />

        <Figure
          src={waterScheme}
          alt="Рис. 2. Тіло занурене у вимірювальний циліндр з водою; діють сила пружності, архімедова сила та сила тяжіння"
          className="w-full max-w-xs mx-auto"
        />

        <p>
          Поділивши рівняння (2) на рівняння (1) і виконавши перетворення,
          одержимо формулу для визначення маси тіла:
        </p>
        <Formula math="m = \dfrac{\rho_{\text{води}} V_{\text{т}} x_1}{x_1 - x_2} \quad (3)" />
      </Section>

      <Section title="Підготовка до експерименту">
        <p>1. Уважно прочитайте теоретичні відомості.</p>
        <p>
          2. У цьому варіанті роботи ви не проводите вимірювання самостійно,
          а переглядаєте відео з готовим дослідом. Уважно перегляньте відео
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
          У відео показано: об&apos;єм води у циліндрі V₀, початкову
          довжину пружини l₀, потім довжину пружини l₁ з підвішеним тілом у
          повітрі, а після занурення тіла у воду — довжину пружини l₂ та
          новий об&apos;єм V у циліндрі. Дослід повторюється для двох
          різних тіл.
        </p>

        <Simulation src={EXPERIMENT_VIDEO} title="Відеоексперимент" />

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Тіло">
                Тіло
              </HeaderCell>
              <HeaderCell id="h2" text="V0, см³">
                V<sub>0</sub>, см<sup>3</sup>
              </HeaderCell>
              <HeaderCell id="h3" text="V, см³">
                V, см<sup>3</sup>
              </HeaderCell>
              <HeaderCell id="h4" text="Vт, см³">
                V<sub>т</sub>, см<sup>3</sup>
              </HeaderCell>
              <HeaderCell id="h5" text="l0, см">
                l<sub>0</sub>, см
              </HeaderCell>
              <HeaderCell id="h6" text="l1, см">
                l<sub>1</sub>, см
              </HeaderCell>
              <HeaderCell id="h7" text="l2, см">
                l<sub>2</sub>, см
              </HeaderCell>
              <HeaderCell id="h8" text="x1, см">
                x<sub>1</sub>, см
              </HeaderCell>
              <HeaderCell id="h9" text="x2, см">
                x<sub>2</sub>, см
              </HeaderCell>
              <HeaderCell id="h10" text="Маса тіла m, г">
                Маса тіла m, г
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {BODIES.map((body) => (
              <tr key={body.id}>
                <Td>{body.label}</Td>
                <Td>
                  <Cell id={`V0_${body.id}`} />
                </Td>
                <Td>
                  <Cell id={`V_${body.id}`} />
                </Td>
                <Td>
                  <Cell id={`Vt_${body.id}`} />
                </Td>
                <Td>
                  <Cell id={`l0_${body.id}`} />
                </Td>
                <Td>
                  <Cell id={`l1_${body.id}`} />
                </Td>
                <Td>
                  <Cell id={`l2_${body.id}`} />
                </Td>
                <Td>
                  <Cell id={`x1_${body.id}`} />
                </Td>
                <Td>
                  <Cell id={`x2_${body.id}`} />
                </Td>
                <Td>
                  <Cell id={`m_${body.id}`} />
                </Td>
              </tr>
            ))}
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>Для кожного тіла визначте:</p>

        <p>1) об&apos;єм Vт тіла:</p>
        <Formula math="V_{\text{т}} = V - V_0" />

        <p>2) видовження x₁ та x₂ пружини:</p>
        <Formula math="x_1 = l_1 - l_0; \quad x_2 = l_2 - l_0" />

        <p>3) масу m тіла за формулою (3):</p>
        <Formula math="m = \dfrac{\rho_{\text{води}} V_{\text{т}} x_1}{x_1 - x_2}" />

        <p>Результати обчислень занесіть до таблиці.</p>
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          Проаналізувавши експеримент і його результати, зробіть висновок,
          у якому зазначте:
        </p>

        <p>1) яку фізичну величину і яким способом ви вимірювали;</p>
        <Answer id="v1" rows={4} />

        <p>2) які ще методи вимірювання цієї фізичної величини ви знаєте;</p>
        <Answer id="v2" rows={4} />

        <p>3) у чому перевага опанованого методу.</p>
        <Answer id="v3" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Обміркуйте й запишіть план проведення експерименту з визначення
          маси тіла, яке не тоне у воді.
        </p>
        <Answer id="v_creative_plan" rows={6} />

        <p>
          Якщо у вас є можливість — проведіть цей експеримент. Якщо ні —
          опишіть, який результат ви очікуєте отримати і чому.
        </p>
        <Answer id="v_creative_conclusion" rows={5} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "hydrostatic-weighing-video",
  grade: 7,
  badge: "9.2",
  number: "№ 9",
  title: "Гідростатичне зважування тіла. Варіант 2 (за відео)",
  goal:
    "опанувати один із методів визначення маси тіла, а саме метод гідростатичного зважування.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Гідростатичне зважування (відео)",
  meta: {
    title:
      "Гідростатичне зважування тіла (за відео) — лабораторна робота №9, варіант 2",
    description:
      "Перегляньте відео гідростатичного зважування тіл, запишіть дані до таблиці та визначте масу тіл за допомогою закону Архімеда.",
  },
  Content,
};

export default lab;
