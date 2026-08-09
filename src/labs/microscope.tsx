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
import { Figure, Section, Simulation } from "@/components/lab/lab-shell";
import rayDiagram from "@/assets/microscope-ray-diagram.png";
import type { LabDefinition } from "./types";

const SIMULATION_URL =
  "https://phydemo.app/ray-optics/gallery/compound-microscope";

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

const TRIALS = 3;

function Content() {
  return (
    <LabForm sheetName="Модель мікроскопа">
      <StudentBlock />

      <Section title="Теоретичні відомості">
        <p>
          Оптична система моделі мікроскопа складається з двох збиральних лінз.
          Короткофокусна лінза — об&apos;єктив — створює дійсне збільшене
          перевернуте зображення A₁B₁ предмета AB. Довгофокусна лінза — окуляр —
          працює як лупа та додатково збільшує зображення A₁B₁. У підсумку ми
          спостерігаємо збільшене уявне зображення A₂B₂ предмета AB.
        </p>
        <p>Хід променів у мікроскопі показано на рисунку:</p>
        <Figure
          src={rayDiagram}
          alt="Хід променів у мікроскопі: об'єктив будує дійсне зображення A1B1, окуляр перетворює його на уявне збільшене зображення A2B2"
          className="w-full max-w-lg mx-auto"
        />
      </Section>

      <Section title="Підготовка до експерименту">
        <p>Перед виконанням роботи згадайте:</p>
        <p>
          1) умови, за яких утворюється дійсне та уявне зображення в збиральній
          лінзі;
        </p>
        <Answer id="v_image_conditions" rows={4} />

        <p>2) формулу тонкої лінзи та формулу для розрахунку збільшення.</p>
        <Answer id="v_formulas" rows={4} />

        <p>
          Ця робота виконується за допомогою онлайн-симулятора променевої оптики{" "}
          <strong>Ray Optics Simulation</strong>. На відміну від PhET, тут можна
          одночасно розмістити <strong>дві лінзи</strong>, що і потрібно для
          моделі мікроскопа. Основні інструменти, які знадобляться (у лівій
          панелі):
        </p>
        <ul>
          <li>
            <strong>Point source</strong> або <strong>Beam</strong> — для
            позначення кінців предмета A і B (двома точковими джерелами
            променів);
          </li>
          <li>
            <strong>Lens → Ideal lens</strong> — ідеальна тонка лінза з фокусною
            відстанню, яку можна задати напряму (без розрахунку кривизни скла);
          </li>
          <li>
            <strong>Ruler</strong> — лінійка для вимірювання відстаней і висот;
          </li>
          <li>
            у налаштуваннях променів увімкніть <strong>Extended rays</strong>{" "}
            (продовжені промені) — це дозволить побачити пунктирні лінії, що
            вказують на положення уявного зображення, як на рисунку вище.
          </li>
        </ul>

        <p>
          <em>
            Примітка: у симуляторі неможливо буквально «подивитися в окуляр»,
            тому збільшення визначатимемо не порівнянням шкал на око, а точним
            вимірюванням висоти зображення лінійкою — це навіть точніше за
            оригінальний метод.
          </em>
        </p>

        <Simulation src={SIMULATION_URL} title="Ray Optics Simulation" />
      </Section>

      <Section title="Експеримент">
        <p>
          Дотримуйтесь інструкції з безпеки під час роботи з комп&apos;ютером.
        </p>

        <p>
          1. Додайте предмет AB — наприклад, двома точковими джерелами (Point
          source) на невеликій відстані одне від одного по вертикалі, або
          скористайтеся інструментом Beam. Запишіть висоту предмета:
        </p>
        <p>
          Висота предмета AB = <Cell id="ab_height" /> (умовні одиниці сітки
          симулятора)
        </p>

        <p>
          2. Додайте об&apos;єктив — Ideal lens з малою фокусною відстанню
          (короткофокусна), розташуйте предмет на відстані, трохи більшій за
          фокусну відстань об&apos;єктива.
        </p>
        <p>
          F<sub>об</sub> = <Cell id="f_ob" />
        </p>

        <p>
          3. На відстані 15–20 умовних одиниць (можна масштабувати за власним
          бажанням) від об&apos;єктива додайте другу лінзу — окуляр — з великою
          фокусною відстанню (довгофокусна).
        </p>
        <p>
          F<sub>ок</sub> = <Cell id="f_ok" /> &nbsp;&nbsp;&nbsp; Відстань між
          лінзами L = <Cell id="l_dist" />
        </p>

        <p>
          4. Увімкніть показ продовжених променів (Extended rays). За точкою
          перетину пунктирних ліній за окуляром знайдіть положення уявного
          зображення A₂B₂.
        </p>

        <p>
          5. За допомогою лінійки (Ruler) виміряйте висоту зображення A₂B₂
          (відстань від оптичної осі до точки B₂):
        </p>
        <p>
          Висота зображення A₂B₂ = <Cell id="a2b2_height" />
        </p>

        <p>6. Обчисліть збільшення моделі мікроскопа:</p>
        <Formula math="\Gamma = \dfrac{A_2B_2}{AB}" />
        <p>
          Γ = <Cell id="gamma_main" />
        </p>

        <p>
          7. З&apos;ясуйте, чи залежить збільшення від відстані між лінзами: не
          змінюючи фокусні відстані, повторіть виміри висоти зображення для{" "}
          {TRIALS} різних відстаней L між об&apos;єктивом і окуляром.
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h_num" text="№">
                №
              </HeaderCell>
              <HeaderCell id="h_L" text="Відстань між лінзами L">
                Відстань між лінзами L
              </HeaderCell>
              <HeaderCell id="h_h" text="Висота зображення A2B2">
                Висота зображення A₂B₂
              </HeaderCell>
              <HeaderCell id="h_g" text="Збільшення Γ">
                Збільшення Γ
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: TRIALS }).map((_, i) => (
              <tr key={i}>
                <Td>{i + 1}</Td>
                <Td>
                  <Cell id={`L${i + 1}`} />
                </Td>
                <Td>
                  <Cell id={`h${i + 1}`} />
                </Td>
                <Td>
                  <Cell id={`g${i + 1}`} />
                </Td>
              </tr>
            ))}
          </tbody>
        </LabTable>
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          Проаналізуйте експеримент і його результати. Сформулюйте висновок, у
          якому зазначте:
        </p>

        <p>1) як утворюється зображення в мікроскопі;</p>
        <Answer id="v1_image_formation" rows={4} />

        <p>2) яке збільшення ви отримали;</p>
        <Answer id="v2_magnification" rows={4} />

        <p>3) чи залежить збільшення від відстані між лінзами;</p>
        <Answer id="v3_distance_dependence" rows={4} />

        <p>4) у чому причини можливої похибки.</p>
        <Answer id="v4_error_reasons" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Оцініть, у скільки разів збільшення вашої моделі мікроскопа
          відрізняється від збільшення стандартного шкільного мікроскопа
          (зазвичай 100–400×). Які зміни треба внести в модель (фокусні відстані
          лінз, відстань між ними), щоб наблизитися до цих значень? Перевірте
          свої припущення в симуляторі.
        </p>
        <Answer id="v_creative" rows={8} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "microscope",
  grade: 9,
  badge: "10",
  number: "№ 10",
  title: "Складання моделі мікроскопа",
  goal: "скласти модель оптичного мікроскопа з двох збиральних лінз й визначити збільшення зібраної моделі.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Модель мікроскопа",
  meta: {
    title: "Складання моделі мікроскопа — лабораторна робота №10",
    description:
      "Складіть модель оптичного мікроскопа з двох збиральних лінз та визначте його збільшення за допомогою симулятора Ray Optics Simulation.",
  },
  Content,
};

export default lab;
