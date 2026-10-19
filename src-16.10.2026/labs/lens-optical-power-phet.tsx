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
import { Figure, Section, Simulation } from "@/components/lab/lab-shell";
import { Formula } from "@/components/formula";
import fig1 from "@/assets/lens-fig1-converging.png";
import fig3 from "@/assets/lens-fig3-virtual-image.png";
import type { LabDefinition } from "./types";

const SIMULATION_URL =
  "https://phet.colorado.edu/sims/html/geometric-optics/latest/geometric-optics_uk.html";

function Content() {
  return (
    <LabForm sheetName="Оптична сила лінзи (PhET)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>
          Запишіть формулу тонкої лінзи, проаналізуйте її та подумайте, які
          вимірювання вам слід зробити, щоб визначити оптичну силу лінзи.
        </p>
        <Answer id="v_prep" rows={4} />

        <p>
          Усі вимірювання виконуйте в симуляторі нижче.
        </p>

        <Simulation
          src={SIMULATION_URL}
          title="PhET: Геометрична оптика"
        />
      </Section>

      <Section title="Експеримент">
        <p>
          <em>Результати вимірювань і обчислень відразу заносьте до таблиці.</em>
        </p>
        <p>
          У симуляторі одночасно можна використовувати лише одну лінзу, тому
          дослід 3 (система лінз, складених упритул) у цьому варіанті не
          виконується. Відстані записуйте в метрах (за потреби переведіть
          значення з сантиметрів).
        </p>

        <p>
          <strong>Дослід 1. Вимірювання оптичної сили збиральної лінзи</strong>
        </p>

        <Figure
          src={fig1}
          alt="Рис. 1. Установка для досліду 1: джерело світла, збиральна лінза, екран; відстані d1 і f1"
          className="w-full max-w-lg mx-auto"
        />

        <p>
          1. Відкрийте симулятор, перейдіть на вкладку «Лінза» (Lens) і
          оберіть збиральну лінзу. Увімкніть екран і лінійку.
        </p>
        <p>
          2. Розташуйте джерело світла (предмет) далі від лінзи, ніж її
          фокусна відстань, і переміщуйте екран, доки не отримаєте чітке
          збільшене зображення.
        </p>
        <p>
          3. За лінійкою виміряйте відстань d<sub>1</sub> від предмета до лінзи
          і відстань f<sub>1</sub> від лінзи до екрана.
        </p>

        <p>
          <strong>Дослід 2. Вимірювання оптичної сили розсіювальної лінзи</strong>
        </p>

        <Figure
          src={fig3}
          alt="Рис. 3. Побудова зображення S1 точки S у розсіювальній лінзі; відстані d2 і f2"
          className="w-full max-w-sm mx-auto"
        />

        <p>
          1. Оберіть розсіювальну лінзу. Увімкніть відображення уявного
          зображення (Virtual Image).
        </p>
        <p>
          2. За лінійкою виміряйте відстань d<sub>2</sub> від предмета до лінзи
          і відстань f<sub>2</sub> від лінзи до уявного зображення S<sub>1</sub>
          (див. рис. 3).
        </p>
      </Section>

      <Section title="Результати вимірювань">

        <p>
          Стовпці таблиці: Збиральна лінза · Розсіювальна лінза.
        </p>
        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Збиральна лінза: d1, м">
                d<sub>1</sub>, м
              </HeaderCell>
              <HeaderCell id="h2" text="Збиральна лінза: f1, м">
                f<sub>1</sub>, м
              </HeaderCell>
              <HeaderCell id="h3" text="Збиральна лінза: D1, дптр">
                D<sub>1</sub>, дптр
              </HeaderCell>
              <HeaderCell id="h4" text="Збиральна лінза: F1, м">
                F<sub>1</sub>, м
              </HeaderCell>
              <HeaderCell id="h5" text="Розсіювальна лінза: d2, м">
                d<sub>2</sub>, м
              </HeaderCell>
              <HeaderCell id="h6" text="Розсіювальна лінза: f2, м">
                f<sub>2</sub>, м
              </HeaderCell>
              <HeaderCell id="h7" text="Розсіювальна лінза: D2, дптр">
                D<sub>2</sub>, дптр
              </HeaderCell>
              <HeaderCell id="h8" text="Розсіювальна лінза: F2, м">
                F<sub>2</sub>, м
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <Cell id="d1" />
              </Td>
              <Td>
                <Cell id="f1" />
              </Td>
              <Td>
                <Cell id="D1" />
              </Td>
              <Td>
                <Cell id="F1" />
              </Td>
              <Td>
                <Cell id="d2" />
              </Td>
              <Td>
                <Cell id="f2" />
              </Td>
              <Td>
                <Cell id="D2" />
              </Td>
              <Td>
                <Cell id="F2" />
              </Td>
            </tr>
          </tbody>
        </LabTable>
      </Section>

      <Section title="Фото">
        <ImageCanvas
          label="Прикріпіть фото (установка, скриншоти)"
          height={400}
          minHeight={250}
          maxHeight={700}
          maxImages={6}
        />
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>
          1. Скориставшись формулами, визначте для кожного досліду оптичну силу і фокусну відстань лінзи:
        </p>
        <Formula math="D = \dfrac{1}{d} + \dfrac{1}{f}; \qquad F = \dfrac{1}{D}" />
        <p>
          <em>Зверніть увагу:</em> для досліду 2 відстань f<sub>2</sub> від
          лінзи до зображення слід брати зі знаком «−», оскільки S<sub>1</sub>{" "}
          — це уявне зображення джерела світла S у розсіювальній лінзі.
        </p>
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          Проаналізуйте експеримент і його результати. Сформулюйте висновок, у
          якому зазначте:
        </p>
        <p>1) яку фізичну величину ви визначали;</p>
        <Answer id="v1" rows={4} />
        <p>2) який результат отримали;</p>
        <Answer id="v2" rows={4} />
        <p>3) у чому причини можливої похибки експерименту.</p>
        <Answer id="v3" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Вважаючи, що глибина f очного дна (відстань від оптичного центра
          оптичної системи «око» до сітківки) дорівнює 15 мм, оцініть
          найбільшу оптичну силу вашого ока. Для цього закрийте одне око, а
          напроти другого розмістіть «ширму» — два розсунуті пальці. Дивлячись
          через «ширму» на зубочистку, повільно наближайте її до «ширми» доти,
          доки зубочистка не почне роздвоюватися. Виміряйте відстань d від
          зубочистки до ока і, скориставшись формулою тонкої лінзи, визначте
          найбільшу оптичну силу ока (D<sub>max</sub>).
        </p>
        <p>
          d = <Cell id="d_eye" /> м&nbsp;&nbsp;&nbsp; f = 0,015 м
          &nbsp;&nbsp;&nbsp; D<sub>max</sub> = <Cell id="D_max" /> дптр
        </p>
        <Formula math="D_{\max} = \dfrac{1}{d} + \dfrac{1}{f}" />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "exp6-lens-optical-power-phet",
  grade: 11,
  badge: "6.2",
  number: "№ 6",
  title:
    "Вимірювання оптичної сили лінзи. Варіант 2 (симуляція PhET)",
  goal: "визначити оптичні сили збиральної та розсіювальної лінз за допомогою симуляції.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Оптична сила лінзи (PhET)",
  meta: {
    title:
      "Вимірювання оптичної сили лінзи (симуляція PhET) — експериментальна робота №6, варіант 2",
    description:
      "Визначте оптичні сили збиральної та розсіювальної лінз у симуляції PhET «Геометрична оптика».",
  },
  Content,
};

export default lab;
