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
import calorimeterScheme from "@/assets/calorimeter-scheme.png";
import type { LabDefinition } from "./types";

const EXPERIMENT_VIDEO = "https://www.youtube.com/embed/wexd6eK0GQ0";

function Content() {
  return (
    <LabForm sheetName="Тепловий баланс при змішуванні води (відео)">
      <StudentBlock />

      <Section title="Теоретичні відомості">
        <p>
          Для багатьох дослідів із вивчення теплових явищ застосовують
          калориметр — пристрій, що складається з двох посудин, які
          розміщені одна в одній і розділені повітряним прошарком (див.
          рисунок). Завдяки невеликій відстані між внутрішньою і зовнішньою
          посудинами, що зумовлює відсутність конвекційних потоків, а також
          унаслідок слабкої теплопровідності повітря теплообмін із довкіллям
          у калориметрі є незначним.
        </p>

        <Figure
          src={calorimeterScheme}
          alt="Схема калориметра: дві посудини, розміщені одна в одній і розділені повітряним прошарком"
          className="w-40 mx-auto"
        />
      </Section>

      <Section title="Підготовка до експерименту">
        <p>1. Ознайомтесь із будовою калориметра.</p>

        <p>2. Згадайте, у чому полягає стан теплової рівноваги.</p>
        <Answer id="v_thermal_equilibrium_def" rows={4} />

        <p>3. Визначте ціну поділки шкал вимірювальних приладів.</p>
        <p>
          Ціна поділки мірного циліндра = <Cell id="cylinder_division" /> мл
        </p>
        <p>
          Ціна поділки термометра = <Cell id="thermometer_division" /> °С
        </p>

        <p>
          4. У цьому варіанті роботи ви не проводите вимірювання самостійно,
          а переглядаєте відео з готовим дослідом. Уважно перегляньте відео
          нижче (за потреби ставте на паузу й переглядайте окремі моменти
          повторно), запишіть подані в ньому дані до таблиці та виконайте
          обчислення.
        </p>

        <Simulation src={EXPERIMENT_VIDEO} title="Відеоексперимент" />
      </Section>

      <Section title="Експеримент">
        <p>
          <em>
            Переглядаючи відео, заносьте результати вимірювань і обчислень
            відразу до таблиці.
          </em>
        </p>

        <p>
          1. Запишіть об’єм холодної води (V₁), яку наливають у мірний
          циліндр, і її температуру (t₁).
        </p>

        <p>
          2. Запишіть температуру гарячої води в калориметрі (t₂) до
          змішування.
        </p>

        <p>
          3. У відео холодну воду з мірного циліндра виливають у калориметр
          із гарячою водою і перемішують. Стежачи за показами термометра,
          запишіть температуру суміші (t) після встановлення теплової
          рівноваги.
        </p>

        <p>
          4. Запишіть загальний об’єм води (V), який показано у відео після
          переливання всієї води з калориметра в мірний циліндр.
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="t1, °C">
                t<sub>1</sub>, °С
              </HeaderCell>
              <HeaderCell id="h2" text="t2, °C">
                t<sub>2</sub>, °С
              </HeaderCell>
              <HeaderCell id="h3" text="t, °C">
                t, °С
              </HeaderCell>
              <HeaderCell id="h4" text="V1, мл">
                V<sub>1</sub>, мл
              </HeaderCell>
              <HeaderCell id="h5" text="V, мл">
                V, мл
              </HeaderCell>
              <HeaderCell id="h6" text="V2, мл">
                V<sub>2</sub>, мл
              </HeaderCell>
              <HeaderCell id="h7" text="m1, кг">
                m<sub>1</sub>, кг
              </HeaderCell>
              <HeaderCell id="h8" text="m2, кг">
                m<sub>2</sub>, кг
              </HeaderCell>
              <HeaderCell id="h9" text="Q1, Дж">
                Q<sub>1</sub>, Дж
              </HeaderCell>
              <HeaderCell id="h10" text="Q2, Дж">
                Q<sub>2</sub>, Дж
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <Cell id="t1_value" />
              </Td>
              <Td>
                <Cell id="t2_value" />
              </Td>
              <Td>
                <Cell id="t_final" />
              </Td>
              <Td>
                <Cell id="V1_value" />
              </Td>
              <Td>
                <Cell id="V_total" />
              </Td>
              <Td>
                <Cell id="V2_value" />
              </Td>
              <Td>
                <Cell id="m1_value" />
              </Td>
              <Td>
                <Cell id="m2_value" />
              </Td>
              <Td>
                <Cell id="Q1_value" />
              </Td>
              <Td>
                <Cell id="Q2_value" />
              </Td>
            </tr>
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>1. Визначте масу m₁ холодної води за формулою:</p>
        <Formula math="m_1 = \rho_{води} V_1" />
        <p>За формулою обчисліть кількість теплоти Q₁, одержану холодною водою:</p>
        <Formula math="Q_1 = c_{води}\, m_1\, (t - t_1)" />

        <p>2. Визначте об’єм V₂ гарячої води за формулою:</p>
        <Formula math="V_2 = V - V_1" />
        <p>Визначте масу m₂ гарячої води за формулою:</p>
        <Formula math="m_2 = \rho_{води} V_2" />
        <p>За формулою обчисліть кількість теплоти Q₂, віддану гарячою водою:</p>
        <Formula math="Q_2 = c_{води}\, m_2\, (t_2 - t)" />
      </Section>

      <Section title="Аналіз результатів експерименту">
        <p>
          Проаналізуйте експеримент і його результати. Сформулюйте висновок,
          у якому:
        </p>
        <p>а) порівняйте кількість теплоти, віддану гарячою водою, і кількість теплоти, одержану холодною водою;</p>
        <p>б) зазначте причину можливої розбіжності результатів.</p>
        <Answer id="v1" rows={6} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "thermal-balance-mixing-video",
  grade: 8,
  badge: "3.2",
  number: "№ 3",
  title:
    "Вивчення теплового балансу за умови змішування води різної температури. Варіант 2 (за відео)",
  goal:
    "визначити кількість теплоти, віддану гарячою водою, і кількість теплоти, одержану холодною водою, у результаті змішування води різної температури; порівняти результати.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Тепловий баланс при змішуванні води (відео)",
  meta: {
    title:
      "Вивчення теплового балансу (за відео) — лабораторна робота №3 (8 клас), варіант 2",
    description:
      "Перегляньте відео досліду зі змішуванням гарячої та холодної води, запишіть дані до таблиці та порівняйте кількість теплоти, віддану й одержану водою.",
  },
  Content,
};

export default lab;
