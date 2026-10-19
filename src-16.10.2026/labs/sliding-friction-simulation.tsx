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
  "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_all.html";

function Content() {
  return (
    <LabForm sheetName="Коефіцієнт тертя ковзання (симуляція)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>1. Перед тим як виконувати роботу, згадайте відповіді на такі запитання.</p>
        <p>
          1) Від яких чинників залежить сила тертя ковзання та куди вона
          напрямлена?
        </p>
        <Answer id="v_friction_factors" rows={4} />

        <p>2) За якою формулою обчислюють силу тертя ковзання?</p>
        <Answer id="v_friction_formula" rows={3} />

        <p>
          2. У цьому варіанті роботи замість дерев&apos;яного бруска
          використовується симуляція PhET{" "}
          <strong>Forces and Motion: Basics</strong>. Відкрийте екран{" "}
          <strong>Friction</strong> і ввімкніть позначки{" "}
          <strong>Forces</strong>, <strong>Sum of Forces</strong>,{" "}
          <strong>Values</strong> і <strong>Masses</strong> — вони покажуть
          числові значення сил і маси прямо на екрані. Регулятор тертя
          (Friction slider) залиште в одному фіксованому положенні і не
          змінюйте його протягом усієї роботи — так само, як реальна дошка
          не змінює своєї шорсткості між дослідами.
        </p>

        <Simulation
          src={SIMULATION_URL}
          title="PhET: Forces and Motion — Basics"
        />
      </Section>

      <Section title="Експеримент">
        <p>
          <em>Результати вимірювань відразу заносьте до таблиці.</em>
        </p>

        <p>
          1. Перетягніть один об&apos;єкт (наприклад, Crate) на землю. Його
          масу подивіться в позначці Masses; вага (сила нормальної реакції
          опори N) дорівнює m·g.
        </p>

        <p>
          2. Поступово збільшуйте прикладену силу (Applied Force), поки
          об&apos;єкт не почне рухатися рівномірно (Sum of Forces ≈ 0,
          швидкість стала). У цей момент прикладена сила дорівнює силі
          тертя ковзання — зчитайте її значення (Friction Force).
        </p>

        <p>
          3. Повторіть дослід ще тричі, додаючи на землю ще один, потім два,
          потім три додаткові об&apos;єкти (наприклад, ще один Crate, потім
          Trash Can, потім Mystery Object) поруч із першим — так само, як
          додавали тягарці на брусок. Щоразу перевіряйте сумарну масу через
          Masses і повторюйте пункт 2.
        </p>

        <p>Силу нормальної реакції опори обчислюйте як:</p>
        <Formula math="N = m_{\text{заг}} \cdot g" />
        <p>де g ≈ 9,8 м/с² (можна округлити до 10 м/с²).</p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Номер досліду">
                Номер досліду
              </HeaderCell>
              <HeaderCell id="h2" text="Сумарна маса mзаг, кг">
                Сумарна маса m<sub>заг</sub>, кг
              </HeaderCell>
              <HeaderCell id="h3" text="Сила тертя ковзання Fтертя ковз, Н">
                Сила тертя ковзання F<sub>тертя ковз</sub>, Н
              </HeaderCell>
              <HeaderCell id="h4" text="Сила нормальної реакції опори N, Н">
                Сила нормальної реакції опори N, Н
              </HeaderCell>
              <HeaderCell id="h5" text="Коефіцієнт тертя ковзання μ">
                Коефіцієнт тертя ковзання, μ
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4].map((row) => (
              <tr key={row}>
                <Td>{row}</Td>
                <Td>
                  <Cell id={`m${row}`} />
                </Td>
                <Td>
                  <Cell id={`F${row}`} />
                </Td>
                <Td>
                  <Cell id={`N${row}`} />
                </Td>
                <Td>
                  <Cell id={`mu${row}`} />
                </Td>
              </tr>
            ))}
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>
          Для кожного досліду обчисліть коефіцієнт тертя ковзання за
          формулою:
        </p>
        <Formula math="\mu = \dfrac{F_{\text{тертя ковз}}}{N}" />
        <p>Результати занесіть до таблиці.</p>
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>Зробіть висновок, у якому зазначте:</p>

        <p>1) яку фізичну величину ви вимірювали;</p>
        <Answer id="v1" rows={4} />

        <p>2) чи залежить коефіцієнт тертя ковзання від ваги тіла;</p>
        <Answer id="v2" rows={4} />

        <p>
          3) чи збігаються одержані результати з табличним значенням
          коефіцієнта тертя ковзання дерева по дереву (зверніть увагу: у
          симуляції поверхня умовна, а не дерев&apos;яна, тому точний збіг
          не обов&apos;язковий — важливіше, чи лишається μ приблизно сталим);
        </p>
        <Answer id="v3" rows={4} />

        <p>4) які чинники вплинули на точність експерименту.</p>
        <Answer id="v4" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Запишіть план проведення експерименту на підтвердження того, що
          коефіцієнт тертя ковзання не залежить від площі дотичних
          поверхонь.
        </p>
        <p>
          <em>
            Примітка: у цій симуляції не можна змінити площу контакту
            об&apos;єкта із землею (форма об&apos;єктів фіксована), тому
            план запишіть як для реального досліду, а перевірте його
            фізично, якщо є можливість.
          </em>
        </p>
        <Answer id="v_creative_plan" rows={6} />

        <p>Проведіть цей експеримент (фізично, якщо можливо). Зробіть висновок:</p>
        <Answer id="v_creative_conclusion" rows={5} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "sliding-friction-simulation",
  grade: 7,
  badge: "7.3",
  number: "№ 7",
  title: "Визначення коефіцієнта тертя ковзання. Варіант 3 (симуляція)",
  goal: "визначити коефіцієнт тертя ковзання за допомогою симуляції.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Коефіцієнт тертя ковзання (симуляція)",
  meta: {
    title:
      "Визначення коефіцієнта тертя ковзання (симуляція) — лабораторна робота №7, варіант 3",
    description:
      "Визначте коефіцієнт тертя ковзання за допомогою симуляції PhET Forces and Motion: Basics.",
  },
  Content,
};

export default lab;
