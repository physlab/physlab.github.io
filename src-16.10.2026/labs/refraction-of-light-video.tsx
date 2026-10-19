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
import { RefractionChart } from "@/components/lab/refraction-chart";
import fig2 from "@/assets/refraction-fig2-pins.png";
import fig3 from "@/assets/refraction-fig3-lengths.png";
import waterCircle from "@/assets/refraction-water-circle.png";
import type { LabDefinition } from "./types";
const EXPERIMENT_VIDEO = "https://www.youtube.com/embed/iSakV76GYz4";

const X_IDS = ["b1", "b2", "b3", "b4"];
const Y_IDS = ["a1", "a2", "a3", "a4"];

function Content() {
  return (
    <LabForm sheetName="Заломлення світла (відео)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>1. Перед тим як переглядати відео, згадайте:</p>
        <p>1) вимоги безпеки під час роботи зі скляними предметами;</p>
        <Answer id="v_safety" rows={3} />
        <p>2) закони заломлення світла;</p>
        <Answer id="v_laws" rows={3} />
        <p>
          3) формулу для визначення показника заломлення середовища 1 відносно
          середовища 2.
        </p>
        <Answer id="v_formula" rows={3} />

        <p>
          У цьому варіанті роботи ви не проводите вимірювання самостійно, а
          переглядаєте відео з готовим дослідом. Уважно перегляньте відео нижче
          (за потреби ставте на паузу й переглядайте окремі моменти повторно),
          запишіть подані в ньому дані до таблиці та виконайте обчислення.
        </p>

        <Simulation src={EXPERIMENT_VIDEO} title="Відеоексперимент" />
      </Section>

      <Section title="Експеримент">
        <p>
          <em>
            Переглядаючи відео, заносьте результати вимірювань відразу до
            таблиці.
          </em>
        </p>
        <p>
          1. Простежте, як на рисунку з контуром скляної пластинки будується
          падаючий промінь (точки A і O) та заломлений промінь OM (рис. 1).
        </p>

        <Figure
          src={fig2}
          alt="Рис. 1. Шпильки 1 і 2 в точках A і O, шпильки 3 і 4 за пластинкою, лінія спостереження"
          className="w-full max-w-md mx-auto"
        />

        <p>
          2. Для кожного з чотирьох рисунків запишіть довжини відрізків a і b —
          перпендикулярів, опущених із точок A і B на пряму k (див. рис. 3 у розділі «Опрацювання результатів експерименту»).
        </p>
      </Section>

      <Section title="Результати вимірювань">

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="№">
                №
              </HeaderCell>
              <HeaderCell id="h2" text="Довжина відрізка a, мм">
                a, мм
              </HeaderCell>
              <HeaderCell id="h3" text="Довжина відрізка b, мм">
                b, мм
              </HeaderCell>
              <HeaderCell id="h4" text="Показник заломлення n">
                n
              </HeaderCell>
              <HeaderCell id="h5" text="Показник заломлення nсер">
                n<sub>сер</sub>
              </HeaderCell>
              <HeaderCell id="h6" text="Похибка експерименту ε, %">
                ε, %
              </HeaderCell>
              <HeaderCell id="h7" text="Похибка експерименту Δn">
                Δn
              </HeaderCell>
              <HeaderCell id="h8" text="Результат n = nсер ± Δn">
                n = n<sub>сер</sub> ± Δn
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>1</Td>
              <Td>
                <Cell id="a1" />
              </Td>
              <Td>
                <Cell id="b1" />
              </Td>
              <Td>
                <Cell id="n1" />
              </Td>
              <Td rowSpan={4}>
                <Cell id="n_mean" />
              </Td>
              <Td rowSpan={4}>
                <Cell id="eps" />
              </Td>
              <Td rowSpan={4}>
                <Cell id="d_n" />
              </Td>
              <Td rowSpan={4}>
                <Cell id="n_result" />
              </Td>
            </tr>
            <tr>
              <Td>2</Td>
              <Td>
                <Cell id="a2" />
              </Td>
              <Td>
                <Cell id="b2" />
              </Td>
              <Td>
                <Cell id="n2" />
              </Td>
            </tr>
            <tr>
              <Td>3</Td>
              <Td>
                <Cell id="a3" />
              </Td>
              <Td>
                <Cell id="b3" />
              </Td>
              <Td>
                <Cell id="n3" />
              </Td>
            </tr>
            <tr>
              <Td>4</Td>
              <Td>
                <Cell id="a4" />
              </Td>
              <Td>
                <Cell id="b4" />
              </Td>
              <Td>
                <Cell id="n4" />
              </Td>
            </tr>
          </tbody>
        </LabTable>
      </Section>

      <Section title="Фото">
        <ImageCanvas
          label="Прикріпіть фото (рисунки, скриншоти)"
          height={400}
          minHeight={250}
          maxHeight={700}
          maxImages={8}
        />
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>
          На кожному рисунку (для кожного контуру) виконайте такі дії:
        </p>
        <p>1. Зазначте кут падіння α і кут заломлення γ.</p>
        <p>
          2. Із точок A і B опустіть перпендикуляри на пряму k і виміряйте
          довжини a і b отриманих відрізків (див. рис. 3).
        </p>

        <Figure
          src={fig3}
          alt="Рис. 3. Кут падіння α, кут заломлення γ, відрізки a і b — перпендикуляри з точок A і B на пряму k"
          className="w-full max-w-xs mx-auto"
        />

        <p>3. Визначте показник заломлення скла відносно повітря:</p>
        <Formula math="n = \dfrac{\sin\alpha}{\sin\gamma}; \qquad \sin\alpha = \dfrac{a}{r}; \qquad \sin\gamma = \dfrac{b}{r} \quad \Rightarrow \quad n = \dfrac{a}{b}" />

        <p>
          4. Побудуйте графік залежності a(b) і визначте середнє значення
          показника заломлення (див. Додаток 2 підручника). Графік нижче
          будується автоматично за даними з таблиці — порівняйте його зі
          своїм.
        </p>
        <RefractionChart xIds={X_IDS} yIds={Y_IDS} xTitle="b, мм" yTitle="a, мм" />

        <p>
          5. Визначте відносну й абсолютну похибки вимірювання показника
          заломлення скла відносно повітря, порівнявши отриманий результат із
          табличним значенням n<sub>табл</sub>, округліть результати,
          скориставшись правилами округлення (див. Додаток 2 підручника):
        </p>
        <Formula math="\varepsilon = \left| 1 - \dfrac{n_{\text{сер}}}{n_{\text{табл}}} \right| \cdot 100\%; \qquad \Delta n = n_{\text{сер}} \cdot \dfrac{\varepsilon}{100\%}" />
        <p>
          n<sub>табл</sub> = <Cell id="n_table" />
        </p>
        <p>Результати занесіть до таблиці.</p>
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
        <p>3) чи залежить значення отриманої величини від кута падіння світла;</p>
        <Answer id="v3" rows={4} />
        <p>4) у чому причини можливої похибки експерименту.</p>
        <Answer id="v4" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <Figure
          src={waterCircle}
          alt="Рисунок до творчого завдання: круг із картону, наполовину занурений у воду; промінь OB у воді, спостерігач дивиться з повітря"
          className="w-full max-w-xs mx-auto"
        />
        <p>
          Скориставшись рисунком, продумайте і запишіть план проведення
          експерименту з визначення показника заломлення води відносно повітря.
          
        </p>
        <p>1) План експерименту:</p>
        <Answer id="c_plan" rows={5} />
        <p>
          2) Запишіть, за якою формулою ви обчислювали б показник заломлення
          води:
        </p>
        <Answer id="c_formula" rows={3} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "exp5-refraction-video",
  grade: 11,
  badge: "5.3",
  number: "№ 5",
  title:
    "Дослідження заломлення світла. Варіант 3 (за відео)",
  goal: "дослідити заломлення світла на межі «скло — повітря», визначити показник заломлення скла відносно повітря.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Заломлення світла (відео)",
  meta: {
    title:
      "Дослідження заломлення світла (за відео) — експериментальна робота №5, варіант 3",
    description:
      "Перегляньте відео дослідження заломлення світла на межі «скло — повітря» та визначте показник заломлення скла.",
  },
  Content,
};

export default lab;
