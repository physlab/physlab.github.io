import {
  LabForm,
  StudentBlock,
  Answer,
  Cell,
  HeaderCell,
  LabTable,
  Td,
} from "@/components/lab/lab-form";
import { Figure, Section } from "@/components/lab/lab-shell";
import { Formula } from "@/components/formula";
import blockOrientations from "@/assets/pressure-solid-block-orientations.png";
import type { LabDefinition } from "./types";

const WEIGHT_ROWS = [
  { id: "block", label: "Брусок" },
  { id: "block1", label: "Брусок із тягарцем" },
  { id: "block2", label: "Брусок із двома тягарцями" },
];

function Content() {
  return (
    <LabForm sheetName="Тиск твердого тіла">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>Переконайтеся, що ви знаєте відповіді на такі запитання.</p>
        <p>1) За якою формулою визначають тиск? Яка одиниця тиску в СІ?</p>
        <Answer id="v_pressure_formula" rows={4} />

        <p>2) Як визначити площу прямокутника?</p>
        <Answer id="v_rectangle_area" rows={3} />

        <p>3) Якими способами можна змінити тиск?</p>
        <Answer id="v_change_pressure" rows={4} />
      </Section>

      <Section title="Дослідження залежності тиску від площі опори">
        <p>
          <em>
            Дотримуйтесь інструкції з безпеки. Результати вимірювань відразу
            заносьте до табл. 1.
          </em>
        </p>

        <Figure
          src={blockOrientations}
          alt="Дерев'яний брусок, покладений на різні грані, і брусок із тягарцями зверху"
          className="w-full max-w-xs mx-auto"
        />

        <p>1. Виміряйте вагу бруска.</p>
        <p>
          P<sub>брус</sub> = <Cell id="P_bar" /> Н
        </p>

        <p>2. Виміряйте розміри (довжину l, ширину d, висоту h) бруска.</p>

        <p>
          <strong>Таблиця 1</strong>
        </p>
        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1_1" text="Грані бруска">
                Грані бруска
              </HeaderCell>
              <HeaderCell id="h1_2" text="l, см">
                l, см
              </HeaderCell>
              <HeaderCell id="h1_3" text="d, см">
                d, см
              </HeaderCell>
              <HeaderCell id="h1_4" text="h, см">
                h, см
              </HeaderCell>
              <HeaderCell id="h1_5" text="Площа грані S, см²">
                Площа грані S, см<sup>2</sup>
              </HeaderCell>
              <HeaderCell id="h1_6" text="Площа грані S, м²">
                Площа грані S, м<sup>2</sup>
              </HeaderCell>
              <HeaderCell id="h1_7" text="Вага бруска P, Н">
                Вага бруска P, Н
              </HeaderCell>
              <HeaderCell id="h1_8" text="Сила тиску F, Н">
                Сила тиску F, Н
              </HeaderCell>
              <HeaderCell id="h1_9" text="Тиск p, Па">
                Тиск p, Па
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((row) => (
              <tr key={row}>
                <Td>{row}</Td>
                {row === 1 && (
                  <>
                    <Td rowSpan={3}>
                      <Cell id="l" />
                    </Td>
                    <Td rowSpan={3}>
                      <Cell id="d" />
                    </Td>
                    <Td rowSpan={3}>
                      <Cell id="h" />
                    </Td>
                  </>
                )}
                <Td>
                  <Cell id={`S_cm2_${row}`} />
                </Td>
                <Td>
                  <Cell id={`S_m2_${row}`} />
                </Td>
                {row === 1 && (
                  <>
                    <Td rowSpan={3}>
                      <Cell id="P" />
                    </Td>
                    <Td rowSpan={3}>
                      <Cell id="F" />
                    </Td>
                  </>
                )}
                <Td>
                  <Cell id={`p_${row}`} />
                </Td>
              </tr>
            ))}
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів дослідження">
        <p>
          Результати обчислень відразу заносьте до табл. 1.
        </p>

        <p>1. Визначте силу, з якою брусок тисне на поверхню стола:</p>
        <Formula math="F = P_{\text{брус}}" />

        <p>
          2. Визначте площу кожної грані бруска. Подайте площі в метрах
          квадратних (м²):
        </p>
        <Formula math="S_1 = l \cdot d; \quad S_2 = l \cdot h; \quad S_3 = d \cdot h" />

        <p>
          3. Обчисліть тиск, який створює брусок на поверхню стола кожною з
          трьох граней:
        </p>
        <Formula math="p = \dfrac{F}{S}" />
      </Section>

      <Section title="Дослідження залежності тиску від ваги тіла">
        <p>
          <em>Результати вимірювань відразу заносьте до табл. 2.</em>
        </p>

        <p>1. Запишіть у табл. 2 вагу бруска та площу його найбільшої грані.</p>
        <p>
          Площа найбільшої грані S<sub>max</sub> = <Cell id="S_max" /> м
          <sup>2</sup>
        </p>

        <p>2. Виміряйте вагу бруска разом із одним тягарцем.</p>
        <p>3. Виміряйте вагу бруска разом із двома тягарцями.</p>

        <p>
          <strong>Таблиця 2</strong>
        </p>
        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h2_1" text="Тверде тіло">
                Тверде тіло
              </HeaderCell>
              <HeaderCell id="h2_2" text="Вага P, Н">
                Вага P, Н
              </HeaderCell>
              <HeaderCell id="h2_3" text="Сила тиску F, Н">
                Сила тиску F, Н
              </HeaderCell>
              <HeaderCell id="h2_4" text="Площа грані S, м²">
                Площа грані S, м<sup>2</sup>
              </HeaderCell>
              <HeaderCell id="h2_5" text="Тиск p, Па">
                Тиск p, Па
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {WEIGHT_ROWS.map((row, i) => (
              <tr key={row.id}>
                <Td>{row.label}</Td>
                <Td>
                  <Cell id={`w_P_${row.id}`} />
                </Td>
                <Td>
                  <Cell id={`w_F_${row.id}`} />
                </Td>
                {i === 0 && (
                  <Td rowSpan={3}>
                    <Cell id="w_S" />
                  </Td>
                )}
                <Td>
                  <Cell id={`w_p_${row.id}`} />
                </Td>
              </tr>
            ))}
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів дослідження (табл. 2)">
        <p>
          Визначте тиск, який створює брусок на поверхню в кожному випадку:
        </p>
        <Formula math="p = \dfrac{F}{S}" />
        <p>Результати обчислень занесіть до табл. 2.</p>
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          Проаналізувавши експеримент та його результати, зробіть висновок,
          у якому зазначте:
        </p>

        <p>1) які фізичні величини ви виміряли;</p>
        <Answer id="v1" rows={4} />

        <p>2) значення якої величини визначили;</p>
        <Answer id="v2" rows={4} />

        <p>3) які результати отримали;</p>
        <Answer id="v3" rows={4} />

        <p>4) які залежності виявили.</p>
        <Answer id="v4" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Площу S фігури, яка має неправильну геометричну форму, можна
          визначити за контуром фігури, намальованим на папері в клітинку:
        </p>
        <Formula math="S = \left(n + \dfrac{k}{2}\right) S_0" />
        <p>
          де n — кількість цілих квадратів, k — кількість нецілих квадратів,
          S<sub>0</sub> — площа одного квадрата.
        </p>

        <p>
          Визначте тиск, який ви створюєте на підлогу під час ходіння;
          коли стоїте на місці.
        </p>

        <p>
          Ваша вага P = <Cell id="creative_P" /> Н
        </p>
        <p>
          Площа сліду однієї ступні S<sub>ступні</sub> ={" "}
          <Cell id="creative_S_foot" /> м<sup>2</sup>
        </p>

        <p>
          Тиск, стоячи на двох ногах (S = 2·S<sub>ступні</sub>):
        </p>
        <p>
          p<sub>стоячи</sub> = <Cell id="creative_p_standing" /> Па
        </p>

        <p>Тиск під час ходьби (в момент опори на одну ногу, S = Sступні):</p>
        <p>
          p<sub>ходьба</sub> = <Cell id="creative_p_walking" /> Па
        </p>

        <p>Опишіть, як ви визначили площу сліду ступні, та зробіть висновок:</p>
        <Answer id="v_creative" rows={6} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "pressure-solid",
  grade: 7,
  badge: "8.1",
  number: "№ 8",
  title: "Вимірювання тиску твердого тіла на опору",
  goal:
    "визначити тиск твердого тіла на горизонтальну поверхню і виявити залежність тиску від ваги тіла та площі поверхні, на яку спирається тіло.",
  equipment: "дерев'яний брусок; динамометр; учнівська лінійка; два тягарці.",
  sheetName: "Тиск твердого тіла",
  meta: {
    title: "Вимірювання тиску твердого тіла на опору — лабораторна робота №8",
    description:
      "Визначте тиск твердого тіла на горизонтальну поверхню та виявіть залежність тиску від ваги тіла та площі опори.",
  },
  Content,
};

export default lab;
