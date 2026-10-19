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

const CIRCUIT_SIMULATION_URL =
  "https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_all.html?locale=uk";
const ENERGY_SIMULATION_URL =
  "https://phet.colorado.edu/sims/html/energy-forms-and-changes/latest/energy-forms-and-changes_all.html?locale=uk";

function Content() {
  return (
    <LabForm sheetName="ККД електричного нагрівника (симуляція PhET)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>2. Запишіть формули для визначення:</p>
        <p>1) кількості теплоти, що виділяється в нагрівнику внаслідок проходження струму:</p>
        <Formula math="Q_{повна} = U I \tau" />
        <p>2) кількості теплоти, що необхідна для нагрівання речовини:</p>
        <Formula math="Q_{кор} = c_{води}\, m\, (t - t_0)" />
        <p>3) ККД нагрівника:</p>
        <Formula math="\eta = \dfrac{Q_{кор}}{Q_{повна}} \cdot 100\%" />

        <p>
          3. Згадайте, як потрібно приєднати амперметр і вольтметр, щоб
          виміряти силу струму в спіралі нагрівника та напругу, подану на
          спіраль.
        </p>
        <Answer id="v_meter_connection" rows={4} />

        <p>4. Запишіть у таблицю значення питомої теплоємності води (c<sub>води</sub>).</p>
        <p>
          c<sub>води</sub> = <Cell id="c_water_value" /> Дж/(кг·°С)
        </p>

        <p>
          <em>
            Жодна відома безкоштовна симуляція не поєднує в одному екрані
            реальний амперметр/вольтметр і калориметр з водою. Тому цей
            варіант складається з двох частин у двох різних симуляціях PhET:
            електричні вимірювання (Частина 1) та спостереження теплової дії
            струму (Частина 2).
          </em>
        </p>
      </Section>

      <Section title="Частина 1. Електричні вимірювання (Circuit Construction Kit: DC)">
        <p>
          1. Відкрийте симуляцію PhET <strong>«Конструктор електричних
          кіл: постійний струм»</strong>. Зберіть коло: батарея — ключ —
          амперметр — резистор (він відіграє роль ніхромової спіралі
          нагрівника) — назад до батареї. Підключіть вольтметр паралельно
          до резистора.
        </p>

        <Simulation
          src={CIRCUIT_SIMULATION_URL}
          title="PhET: Circuit Construction Kit — DC"
        />

        <p>
          2. Клацніть на резисторі й встановіть який завгодно опір (це буде
          умовна «спіраль нагрівника»). Замкніть ключ і одночасно запустіть
          секундомір на телефоні або подивіться на годинник.
        </p>

        <p>
          3. Запишіть силу струму I та напругу U, які показують амперметр і
          вольтметр. Через τ = 10 хв (600 с) розімкніть ключ.
        </p>
        <p>
          I = <Cell id="I_value" /> А&nbsp;&nbsp; U = <Cell id="U_value" /> В&nbsp;&nbsp;
          τ = <Cell id="tau_value" /> с
        </p>
      </Section>

      <Section title="Частина 2. Теплова дія струму (Energy Forms and Changes — Systems)">
        <p>
          1. Відкрийте симуляцію PhET <strong>«Форми та зміни
          енергії»</strong> і перейдіть на вкладку <strong>Systems</strong>{" "}
          (Системи).
        </p>

        <Simulation
          src={ENERGY_SIMULATION_URL}
          title="PhET: Energy Forms and Changes — Systems"
        />

        <p>
          2. Як джерело енергії оберіть генератор (наприклад, велосипед або
          водяне колесо), а як «споживача» — посудину з водою (Beaker of
          Water). Увімкніть позначки <strong>Energy Symbols</strong>{" "}
          (Позначки енергії), щоб бачити потоки енергії.
        </p>

        <p>
          3. Запустіть симуляцію й спостерігайте за термометром у посудині з
          водою. Запишіть початкову температуру t₀ і температуру t після
          деякого часу нагрівання.
        </p>
        <p>
          t<sub>0</sub> = <Cell id="t0_value" /> °С&nbsp;&nbsp;
          t = <Cell id="t_final" /> °С
        </p>

        <p>
          4. Зверніть увагу: частина «шматочків» енергії (Energy Chunks)
          вилітає з посудини вгору, у повітря, — вона не потрапляє у воду.
          Поясніть, як це пов’язано з тим, чому ККД нагрівника завжди
          менший від 100 %.
        </p>
        <Answer id="v_energy_chunks_explanation" rows={4} />

        <p>
          <em>
            Примітка: ця симуляція не показує масу води в кілограмах, тож
            для остаточного обчислення ККД скористайтеся умовною масою
            (наприклад, m<sub>води</sub> = 0,13 кг, як у фізичному варіанті
            роботи) — це дозволить довести розрахунок до числа, хоча
            результат і буде лише ілюстративним, а не точно пов’язаним із
            електричними вимірюваннями з Частини 1.
          </em>
        </p>
        <p>
          m<sub>води</sub> (умовно) = <Cell id="m_water" /> кг
        </p>
      </Section>

      <Section title="Таблиця результатів">
        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Вода: cводи, Дж/(кг·C)">
                Вода: c<sub>води</sub>, Дж/(кг·°С)
              </HeaderCell>
              <HeaderCell id="h2" text="Вода: m, кг">
                Вода: m, кг
              </HeaderCell>
              <HeaderCell id="h3" text="Вода: t0, C">
                Вода: t<sub>0</sub>, °С
              </HeaderCell>
              <HeaderCell id="h4" text="Вода: t, C">
                Вода: t, °С
              </HeaderCell>
              <HeaderCell id="h5" text="Вода: Qкор, Дж">
                Вода: Q<sub>кор</sub>, Дж
              </HeaderCell>
              <HeaderCell id="h6" text="Нагрівник: I, А">
                Нагрівник: I, А
              </HeaderCell>
              <HeaderCell id="h7" text="Нагрівник: U, В">
                Нагрівник: U, В
              </HeaderCell>
              <HeaderCell id="h8" text="Нагрівник: τ, с">
                Нагрівник: τ, с
              </HeaderCell>
              <HeaderCell id="h9" text="Нагрівник: Qповна, Дж">
                Нагрівник: Q<sub>повна</sub>, Дж
              </HeaderCell>
              <HeaderCell id="h10" text="ККД: η, %">
                ККД: η, %
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <Cell id="c_water_table" />
              </Td>
              <Td>
                <Cell id="m_water_table" />
              </Td>
              <Td>
                <Cell id="t0_table" />
              </Td>
              <Td>
                <Cell id="t_table" />
              </Td>
              <Td>
                <Cell id="Q_useful" />
              </Td>
              <Td>
                <Cell id="I_table" />
              </Td>
              <Td>
                <Cell id="U_table" />
              </Td>
              <Td>
                <Cell id="tau_table" />
              </Td>
              <Td>
                <Cell id="Q_full" />
              </Td>
              <Td>
                <Cell id="eta_value" />
              </Td>
            </tr>
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>1. Використавши результати вимірювань, обчисліть:</p>
        <p>1) кількість теплоти, отриману водою:</p>
        <Formula math="Q_{кор} = c_{води}\, m\, (t - t_0)" />
        <p>2) кількість теплоти, що виділилася в нагрівнику внаслідок проходження струму:</p>
        <Formula math="Q_{повна} = U I \tau" />
        <p>3) коефіцієнт корисної дії нагрівника:</p>
        <Formula math="\eta = \dfrac{Q_{кор}}{Q_{повна}} \cdot 100\%" />

        <p>2. Закінчіть заповнення таблиці.</p>
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          Проаналізувавши експеримент і його результати, зробіть висновок, у
          якому зазначте:
        </p>
        <p>1) яку фізичну величину ви вимірювали, за допомогою яких приладів (реальних чи симуляцій);</p>
        <p>2) який результат отримали;</p>
        <p>3) чому ККД нагрівника набагато менший від 100 %;</p>
        <p>
          4) які чинники (зокрема, те, що електричні й теплові вимірювання
          проводилися в різних симуляціях, не пов’язаних між собою) могли
          вплинути на точність отриманих результатів.
        </p>
        <Answer id="v1" rows={7} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Запишіть план проведення експерименту щодо визначення ККД
          електричного чайника. Які прилади вам знадобляться, якщо фактична
          потужність чайника збігається з номінальною?
        </p>
        <Answer id="v_creative1" rows={7} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "heater-efficiency-simulation-phet",
  grade: 8,
  badge: "10.3",
  number: "№ 10",
  title:
    "Визначення ККД електричного нагрівника. Варіант 3 (симуляція PhET)",
  goal:
    "спостерігати теплову дію електричного струму; навчитися вимірювати ККД електричного нагрівника за допомогою симуляцій.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "ККД електричного нагрівника (симуляція PhET)",
  meta: {
    title:
      "Визначення ККД електричного нагрівника (симуляція PhET) — лабораторна робота №10 (8 клас), варіант 3",
    description:
      "Виміряйте силу струму й напругу на нагрівнику в Circuit Construction Kit: DC і спостерігайте теплову дію струму в Energy Forms and Changes.",
  },
  Content,
};

export default lab;
