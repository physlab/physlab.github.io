import katex from "katex";
import "katex/dist/katex.min.css";
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
import type { LabDefinition } from "./types";

const SIMULATION_URL =
  "https://phet.colorado.edu/sims/html/geometric-optics/latest/geometric-optics_all.html";

/**
 * Renders a LaTeX string with KaTeX directly.
 */
function Formula({ math }: { math: string }) {
  const html = katex.renderToString(math, {
    throwOnError: false,
    displayMode: true,
  });
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

const TRIALS = 5;

function Content() {
  return (
    <LabForm sheetName="Фокусна відстань збиральної лінзи">
      <StudentBlock />

      <Section title="Опис методу вимірювання">
        <p>
          Збиральна лінза, на відміну від розсіювальної, утворює дійсне
          зображення предмета, якщо предмет розташований далі від лінзи, ніж її
          фокус. Це зображення можна спостерігати на екрані (у реальному
          досліді) або напряму побачити в симуляції.
        </p>
        <p>
          Вимірявши відстань d від предмета до лінзи та відповідну відстань f
          від лінзи до зображення, оптичну силу збиральної лінзи визначають за
          формулою:
        </p>
        <Formula math="D = \dfrac{1}{d} + \dfrac{1}{f}" />
        <p>
          (на відміну від розсіювальної лінзи, значення D має бути додатним).
        </p>
      </Section>

      <Section title="Підготовка до експерименту">
        <p>1. Перед тим як виконувати роботу, згадайте:</p>
        <p>1) формулу тонкої лінзи;</p>
        <Answer id="v_thin_lens_formula" rows={3} />

        <p>2) означення оптичної сили лінзи.</p>
        <Answer id="v_optical_power_def" rows={3} />

        <p>
          2. Ця робота виконується за допомогою комп&apos;ютерної симуляції PhET{" "}
          <strong>Geometric Optics</strong>. Відкрийте вкладку Lens, оберіть тип
          лінзи — <strong>Converging</strong> (збиральна), увімкніть позначку{" "}
          <strong>Labels</strong> (підписи відстаней) та скористайтеся
          інструментом <strong>Ruler</strong> (лінійка) для перевірки показів.
        </p>

        <p>
          3. Складіть детальний план проведення експерименту (на яких відстанях
          від лінзи розташовуватимете предмет, скільки випробувань проведете).
        </p>
        <Answer id="v_plan" rows={6} />

        <Simulation src={SIMULATION_URL} title="PhET: Geometric Optics" />
      </Section>

      <Section title="Експеримент">
        <p>Проведіть експеримент відповідно до складеного вами плану:</p>
        <p>
          1. Переконайтеся, що обрано збиральну лінзу (Converging) і предмет
          розташований далі від лінзи, ніж її фокус (інакше дійсне зображення не
          утвориться).
        </p>
        <p>
          2. По черзі встановлюйте предмет на {TRIALS} різних відстанях d від
          лінзи. Щоразу зчитуйте відповідну відстань f до дійсного зображення і
          заносьте обидва значення до таблиці.
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h_num" text="№">
                №
              </HeaderCell>
              <HeaderCell id="h_d" text="Відстань d, м">
                Відстань d, м
              </HeaderCell>
              <HeaderCell id="h_f" text="Відстань f, м">
                Відстань f, м
              </HeaderCell>
              <HeaderCell id="h_1d" text="1/d, м⁻¹">
                1/d, м<sup>-1</sup>
              </HeaderCell>
              <HeaderCell id="h_1f" text="1/f, м⁻¹">
                1/f, м<sup>-1</sup>
              </HeaderCell>
              <HeaderCell id="h_D" text="Оптична сила D, дптр">
                Оптична сила D, дптр
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: TRIALS }).map((_, i) => (
              <tr key={i}>
                <Td>{i + 1}</Td>
                <Td>
                  <Cell id={`d${i + 1}`} />
                </Td>
                <Td>
                  <Cell id={`f${i + 1}`} />
                </Td>
                <Td>
                  <Cell id={`inv_d${i + 1}`} />
                </Td>
                <Td>
                  <Cell id={`inv_f${i + 1}`} />
                </Td>
                <Td>
                  <Cell id={`D${i + 1}`} />
                </Td>
              </tr>
            ))}
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>
          1. За даними таблиці знайдіть значення виразів 1/d і 1/f, округліть
          результати до двох значущих цифр і занесіть до таблиці.
        </p>

        <p>
          2. Визначте оптичну силу збиральної лінзи за формулою вище, округліть
          результат до двох значущих цифр і закінчіть заповнення таблиці.
        </p>

        <p>
          Середнє значення оптичної сили D<sub>сер</sub> = <Cell id="D_avg" />{" "}
          дптр
        </p>

        <p>3. Розрахуйте фокусну відстань збиральної лінзи:</p>
        <Formula math="F = \dfrac{1}{D}" />
        <p>
          F = <Cell id="F" /> м
        </p>
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          Проаналізуйте експеримент і його результати. Сформулюйте висновок, у
          якому:
        </p>

        <p>
          1) зазначте значення фокусної відстані й оптичної сили збиральної
          лінзи, які ви отримали;
        </p>
        <Answer id="v1_result" rows={4} />

        <p>
          2) дізнайтесь у вчителя / вчительки (або зі значень, встановлених у
          симуляції для лінзи) паспортне значення оптичної сили лінзи та
          порівняйте його зі значеннями оптичної сили, отриманими в ході
          експерименту;
        </p>
        <Answer id="v2_comparison" rows={4} />

        <p>3) зазначте причини можливої розбіжності результатів.</p>
        <Answer id="v3_discrepancy" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Скориставшись методом «нескінченно віддаленого предмета» (d → ∞),
          наближено оцініть фокусну відстань збиральної лінзи: встановіть
          предмет на максимально можливій відстані від лінзи в симуляції та
          зафіксуйте, на якій відстані від лінзи утворюється зображення — воно
          наближатиметься до фокусної площини лінзи (f ≈ F). Порівняйте отримане
          наближене значення з результатом, отриманим у ході виконання основної
          частини лабораторної роботи.
        </p>
        <Answer id="v_creative" rows={8} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "focal-length-thick-lens",
  grade: 9,
  badge: "8",
  number: "№ 8",
  title: "Визначення фокусної відстані та оптичної сили збиральної лінзи",
  goal: "визначити фокусну відстань та оптичну силу збиральної лінзи.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Фокусна відстань збиральної лінзи",
  meta: {
    title:
      "Визначення фокусної відстані та оптичної сили збиральної лінзи — лабораторна робота №8",
    description:
      "Визначте фокусну відстань та оптичну силу збиральної лінзи за допомогою симуляції PhET Geometric Optics.",
  },
  Content,
};

export default lab;
