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
  "https://phet.colorado.edu/sims/html/masses-and-springs/latest/masses-and-springs_all.html";

// Max load on the spring in this simulation is 300 g, so trials are
// spaced within that limit (unlike the physical version's 100–400 g).
const TRIALS = [
  { n: 1, m: 100, F: 1 },
  { n: 2, m: 150, F: 1.5 },
  { n: 3, m: 200, F: 2 },
  { n: 4, m: 250, F: 2.5 },
  { n: 5, m: 300, F: 3 },
];

function Content() {
  return (
    <LabForm sheetName="Пружні властивості пружини (симуляція)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>
          1. Перед тим як виконувати роботу, переконайтеся, що ви знаєте
          відповіді на такі запитання.
        </p>
        <p>1) Що таке деформація? Які існують види деформації?</p>
        <Answer id="v_deformation_def" rows={4} />

        <p>2) Які деформації називають пружними? пластичними?</p>
        <Answer id="v_elastic_plastic_def" rows={4} />

        <p>3) За якою формулою розраховують силу пружності?</p>
        <Answer id="v_elastic_force_formula" rows={3} />

        <p>
          2. У цьому варіанті роботи замість гумового шнура досліджується
          пружина в симуляції PhET <strong>Masses &amp; Springs</strong>.
          Відкрийте екран <strong>Intro</strong> (перший зліва) і ознайомтеся з
          елементами керування:
        </p>
        <ul>
          <li>
            позначки <strong>Natural Length</strong> (природна довжина) і{" "}
            <strong>Equilibrium Position</strong> (положення рівноваги) —
            увімкніть обидві;
          </li>
          <li>
            <strong>лінійка</strong> — перетягніть її так, щоб нуль збігався з
            верхнім кріпленням пружини;
          </li>
          <li>
            набір тягарців 50 г, 100 г, 250 г та тягарець із довільною масою
            (Custom) — у цій роботі максимальна маса, яку можна підвісити,
            становить <strong>300 г</strong>;
          </li>
          <li>
            регулятор жорсткості пружини (<strong>softness</strong>, від soft до
            hard) — залиште в середньому положенні й не змінюйте протягом
            основної частини роботи.
          </li>
        </ul>

        <Simulation src={SIMULATION_URL} title="PhET: Masses & Springs" />
      </Section>

      <Section title="Експеримент">
        <p>
          1. Оберіть першу пружину (Spring 1) і не чіпайте регулятор жорсткості
          до кінця основної частини роботи.
        </p>

        <p>
          2. Не підвішуючи жодного тягарця, за допомогою лінійки виміряйте
          довжину недеформованої пружини l₀ (від точки кріплення до нижнього
          кінця пружини, орієнтуючись на позначку Natural Length).
        </p>
        <p>
          l<sub>0</sub> = <Cell id="l0" /> см
        </p>

        <p>
          3. Послідовно підвішуйте до пружини тягарці масою 100 г, 150 г, 200 г,
          250 г і 300 г (для проміжних значень скористайтеся тягарцем довільної
          маси), щоразу вимірюючи лінійкою довжину розтягнутої пружини l.
        </p>

        <p>
          <em>
            Примітка: на відміну від реального гумового шнура, пружина в
            симуляції — ідеальна: вона завжди повертається у вихідний стан після
            зняття тягарця, тобто перевіряти пружність деформації (як у
            фізичному варіанті роботи) тут не потрібно.
          </em>
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Номер досліду">
                Номер досліду
              </HeaderCell>
              <HeaderCell id="h2" text="Маса тягарця m, г">
                Маса тягарця m, г
              </HeaderCell>
              <HeaderCell id="h3" text="Сила пружності Fпруж, Н">
                Сила пружності F<sub>пруж</sub>, Н
              </HeaderCell>
              <HeaderCell id="h4" text="Довжина l, см">
                Довжина l, см
              </HeaderCell>
              <HeaderCell id="h5" text="Видовження x, м">
                Видовження x, м
              </HeaderCell>
              <HeaderCell id="h6" text="Відношення Fпруж/x, Н/м">
                Відношення F<sub>пруж</sub>/x, Н/м
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {TRIALS.map((trial) => (
              <tr key={trial.n}>
                <Td>{trial.n}</Td>
                <Td>{trial.m}</Td>
                <Td>{trial.F}</Td>
                <Td>
                  <Cell id={`l${trial.n}`} />
                </Td>
                <Td>
                  <Cell id={`x${trial.n}`} />
                </Td>
                <Td>
                  <Cell id={`ratio${trial.n}`} />
                </Td>
              </tr>
            ))}
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>Для кожного досліду:</p>

        <p>1) визначте видовження пружини:</p>
        <Formula math="x = l - l_0" />
        <p>(одержані результати подайте в метрах);</p>

        <p>2) знайдіть відношення:</p>
        <Formula math="\dfrac{F_{\text{пруж}}}{x}" />
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          Порівняйте відношення F<sub>пруж</sub>/x, одержані в дослідах. Зробіть
          висновок, у якому зазначте:
        </p>

        <p>
          1) чи вплинуло б подальше збільшення навантаження на характер
          деформації (пружна чи пластична) у реальній пружині, і чому симуляція
          цього не показує;
        </p>
        <Answer id="v1" rows={4} />

        <p>2) чи залежить (у разі пружної деформації) жорсткість пружини</p>
        <Formula math="k = \dfrac{F_{\text{пруж}}}{x}" />
        <p>від її видовження.</p>
        <Answer id="v2" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Чи зміниться відношення F<sub>пруж</sub>/x, одержане в роботі, якщо
          пружину замінити на таку саму, але вдвічі довшу? вдвічі товщу?
        </p>
        <p>
          <em>
            Примітка: у цій симуляції не можна напряму подовжити чи потовщити
            пружину, зате можна порівняти дві різні пружини (Spring 1 і Spring
            2) з різною жорсткістю (регулятор softness) — це непрямо ілюструє,
            як змінюється відношення F<sub>пруж</sub>/x для «іншої» пружини.
          </em>
        </p>
        <Answer id="v_creative_prediction" rows={5} />

        <p>
          Спробуйте підвісити однаковий тягарець до Spring 1 і Spring 2 з різною
          жорсткістю та порівняйте видовження. Опишіть результат:
        </p>
        <Answer id="v_creative_verification" rows={5} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "spring-elasticity-simulation",
  grade: 7,
  badge: "6.3",
  number: "№ 6",
  title: "Дослідження пружних властивостей тіл. Варіант 3 (симуляція)",
  goal: "дослідити пружні властивості пружини під час деформації розтягнення.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Пружні властивості пружини (симуляція)",
  meta: {
    title:
      "Дослідження пружних властивостей тіл (симуляція) — лабораторна робота №6, варіант 3",
    description:
      "Дослідіть пружні властивості пружини під час деформації розтягнення за допомогою симуляції PhET Masses & Springs.",
  },
  Content,
};

export default lab;
