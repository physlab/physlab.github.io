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

const SIMULATION_URL =
  "https://phet.colorado.edu/sims/html/buoyancy/latest/buoyancy_all.html";

const BODIES = [
  { id: "body1", label: "Тіло 1" },
  { id: "body2", label: "Тіло 2" },
];

function Content() {
  return (
    <LabForm sheetName="Гідростатичне зважування (симуляція)">
      <StudentBlock />

      <Section title="Теоретичні відомості">
        <p>
          Якщо тіло тоне у воді, для визначення його маси методом
          гідростатичного зважування зазвичай зважують тіло на пружині
          спочатку в повітрі, а потім у воді, і, знаючи об&apos;єм тіла,
          застосовують закон Архімеда.
        </p>
        <p>
          У повітрі на тіло діють сила тяжіння й сила пружності (силою
          Архімеда в повітрі нехтують), вони зрівноважені:
        </p>
        <Formula math="F_1 = F_{\text{тяж}} = mg" />
        <p>
          У воді на тіло додатково діє архімедова сила, тому показ
          динамометра (сила пружності) зменшується:
        </p>
        <Formula math="F_2 = F_{\text{тяж}} - F_{\text{арх}} = mg - \rho_{\text{води}} g V_{\text{т}}" />

        <p>
          <em>
            У симуляції PhET <strong>Buoyancy</strong> датчик сили одразу
            показує значення в ньютонах (на відміну від реальної пружини,
            довжину якої довелося б перераховувати через невідому
            жорсткість). Це дозволяє знайти масу тіла прямо з покажчика F₁
            в повітрі:
          </em>
        </p>
        <Formula math="m = \dfrac{F_1}{g}" />
        <p>
          <em>
            а об&apos;єм тіла — двома незалежними способами, щоб
            перевірити закон Архімеда: 1) прямим вимірюванням рівня води в
            резервуарі до і після занурення; 2) через різницю показів
            датчика сили F₁ − F₂:
          </em>
        </p>
        <Formula math="V_{\text{т}} = \dfrac{F_1 - F_2}{\rho_{\text{води}} \, g}" />
      </Section>

      <Section title="Підготовка до експерименту">
        <p>1. Уважно прочитайте теоретичні відомості.</p>
        <p>
          2. Відкрийте симуляцію, оберіть екран <strong>Intro</strong>.
          Увімкніть позначки <strong>Show Forces</strong> і{" "}
          <strong>Readouts</strong> — вони покажуть числові значення сил.
          Оберіть два різні непрозорі блоки (наприклад, у режимі{" "}
          <strong>Mystery</strong>), кожен з яких тоне у воді.
        </p>
      </Section>

      <Section title="Експеримент">
        <p>
          <em>Результати вимірювань відразу заносьте до таблиці.</em>
        </p>

        <p>1. Визначте об&apos;єм V₀ води в резервуарі (до занурення тіла).</p>
        <p>
          2. Підвісьте тіло на датчику сили над водою (тіло в повітрі,
          не торкається води). Зчитайте показ сили F₁.
        </p>
        <p>
          3. Повністю занурте тіло у воду (не торкаючись дна і стінок
          резервуару). Зчитайте новий показ сили F₂ та новий об&apos;єм
          води й тіла V у резервуарі.
        </p>
        <p>4. Повторіть дослід для іншого тіла.</p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Тіло">
                Тіло
              </HeaderCell>
              <HeaderCell id="h2" text="V0, л">
                V<sub>0</sub>, л
              </HeaderCell>
              <HeaderCell id="h3" text="V, л">
                V, л
              </HeaderCell>
              <HeaderCell id="h4" text="Vт (за рівнем води), л">
                V<sub>т</sub> (за рівнем води), л
              </HeaderCell>
              <HeaderCell id="h5" text="F1, Н (у повітрі)">
                F<sub>1</sub>, Н (у повітрі)
              </HeaderCell>
              <HeaderCell id="h6" text="F2, Н (у воді)">
                F<sub>2</sub>, Н (у воді)
              </HeaderCell>
              <HeaderCell id="h7" text="Vт (за силою), л">
                V<sub>т</sub> (за силою), л
              </HeaderCell>
              <HeaderCell id="h8" text="Маса тіла m, г">
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
                  <Cell id={`Vt_level_${body.id}`} />
                </Td>
                <Td>
                  <Cell id={`F1_${body.id}`} />
                </Td>
                <Td>
                  <Cell id={`F2_${body.id}`} />
                </Td>
                <Td>
                  <Cell id={`Vt_force_${body.id}`} />
                </Td>
                <Td>
                  <Cell id={`m_${body.id}`} />
                </Td>
              </tr>
            ))}
          </tbody>
        </LabTable>

        <Simulation src={SIMULATION_URL} title="PhET: Buoyancy" />
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>Для кожного тіла визначте:</p>

        <p>1) об&apos;єм тіла за рівнем води:</p>
        <Formula math="V_{\text{т}} = V - V_0" />

        <p>2) об&apos;єм тіла за різницею показів сили (перевірка):</p>
        <Formula math="V_{\text{т}} = \dfrac{F_1 - F_2}{\rho_{\text{води}} \, g}" />
        <p>
          (ρ<sub>води</sub> = 1000 кг/м³, g ≈ 9,8 м/с²; порівняйте це
          значення з тим, що отримали за рівнем води)
        </p>

        <p>3) масу тіла:</p>
        <Formula math="m = \dfrac{F_1}{g}" />

        <p>Результати обчислень занесіть до таблиці.</p>
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          Проаналізувавши експеримент і його результати, зробіть висновок,
          у якому зазначте:
        </p>

        <p>1) яку фізичну величину і яким способом ви вимірювали;</p>
        <Answer id="v1" rows={4} />

        <p>2) чи збіглися два способи визначення об&apos;єму тіла, і чому;</p>
        <Answer id="v2" rows={4} />

        <p>
          3) у чому перевага методу гідростатичного зважування, і чим
          симуляція спростила його порівняно з реальним дослідом.
        </p>
        <Answer id="v3" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Обміркуйте й запишіть план проведення експерименту з визначення
          маси тіла, яке не тоне у воді.
        </p>
        <p>
          <em>
            Примітка: у симуляції можна тримати такий блок під водою вручну
            (утримуючи його зануреним) — спробуйте застосувати цей прийом.
          </em>
        </p>
        <Answer id="v_creative_plan" rows={6} />

        <p>Проведіть цей експеримент у симуляції. Зробіть висновок:</p>
        <Answer id="v_creative_conclusion" rows={5} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "hydrostatic-weighing-simulation",
  grade: 7,
  badge: "9.3",
  number: "№ 9",
  title: "Гідростатичне зважування тіла. Варіант 3 (симуляція)",
  goal:
    "опанувати один із методів визначення маси тіла, а саме метод гідростатичного зважування.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Гідростатичне зважування (симуляція)",
  meta: {
    title:
      "Гідростатичне зважування тіла (симуляція) — лабораторна робота №9, варіант 3",
    description:
      "Опануйте метод гідростатичного зважування за допомогою симуляції PhET Buoyancy: визначте масу тіла, застосувавши закон Архімеда.",
  },
  Content,
};

export default lab;
