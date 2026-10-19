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

const EXPERIMENT_VIDEO = "https://www.youtube.com/embed/T90oZCO7EEA";

const TRIALS = [
  { n: 1, m: 100, F: 1 },
  { n: 2, m: 200, F: 2 },
  { n: 3, m: 300, F: 3 },
  { n: 4, m: 400, F: 4 },
];

function Content() {
  return (
    <LabForm sheetName="Пружні властивості шнура (відео)">
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
          2. У цьому варіанті роботи ви не проводите експеримент самостійно, а
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
          У відео гумовий шнур закріплено на штативі; спочатку вимірюється
          довжина недеформованого шнура l₀, потім до шнура послідовно підвішують
          1, 2, 3 і 4 тягарці масою 100 г кожен, щоразу вимірюючи довжину
          деформованого шнура l. Підвішений тягарець масою 100 г розтягує шнур
          із силою приблизно 1 Н.
        </p>

        <Simulation src={EXPERIMENT_VIDEO} title="Відеоексперимент" />

        <p>
          l<sub>0</sub> = <Cell id="l0" /> см
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
              <HeaderCell id="h7" text="Деформація пружна? (так/ні)">
                Деформація пружна? (так/ні)
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
                <Td>
                  <Cell id={`elastic${trial.n}`} />
                </Td>
              </tr>
            ))}
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>Для кожного досліду:</p>

        <p>1) визначте видовження шнура:</p>
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
          1) чи впливає навантаження на те, якою буде деформація (пружною або
          пластичною);
        </p>
        <Answer id="v1" rows={4} />

        <p>2) чи залежить (у разі пружної деформації) жорсткість шнура</p>
        <Formula math="k = \dfrac{F_{\text{пруж}}}{x}" />
        <p>від його видовження.</p>
        <Answer id="v2" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Чи зміниться відношення F<sub>пруж</sub>/x, одержане в роботі, якщо
          шнур замінити на такий самий, але вдвічі довший? вдвічі товщий?
        </p>
        <Answer id="v_creative_prediction" rows={5} />

        <p>
          Якщо у вас є можливість — перевірте результати своїх міркувань
          експериментально. Якщо ні — опишіть, як саме ви б це зробили.
        </p>
        <Answer id="v_creative_verification" rows={5} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "spring-elasticity-video",
  grade: 7,
  badge: "6.2",
  number: "№ 6",
  title: "Дослідження пружних властивостей тіл. Варіант 2 (за відео)",
  goal: "дослідити пружні властивості гумового шнура під час деформації розтягнення.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Пружні властивості шнура (відео)",
  meta: {
    title:
      "Дослідження пружних властивостей тіл (за відео) — лабораторна робота №6, варіант 2",
    description:
      "Перегляньте відео досліду з гумовим шнуром, запишіть дані до таблиці та порівняйте відношення сили пружності до видовження.",
  },
  Content,
};

export default lab;
