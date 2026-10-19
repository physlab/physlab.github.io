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
import { Figure, Section } from "@/components/lab/lab-shell";
import { Formula } from "@/components/formula";
import { RefractionChart } from "@/components/lab/refraction-chart";
import fig1 from "@/assets/refraction-fig1-contour.png";
import fig2 from "@/assets/refraction-fig2-pins.png";
import fig3 from "@/assets/refraction-fig3-lengths.png";
import waterCircle from "@/assets/refraction-water-circle.png";
import type { LabDefinition } from "./types";

const X_IDS = ["b1", "b2", "b3", "b4"];
const Y_IDS = ["a1", "a2", "a3", "a4"];

function Content() {
  return (
    <LabForm sheetName="Заломлення світла">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>1. Перед тим як виконувати роботу, згадайте:</p>
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
          2. Підготуйте рисунки для виконання роботи (див. рис. 1). Для цього:
        </p>

        <Figure
          src={fig1}
          alt="Рис. 1. Контур скляної пластинки, точка O, перпендикуляр k, коло з центром O, промінь і точка A"
          className="w-full max-w-xs mx-auto"
        />

        <p>
          1) покладіть скляну пластинку на сторінку зошита і гостро заточеним
          олівцем окресліть контур пластинки;
        </p>
        <p>2) на відрізку, що відповідає положенню верхньої заломної грані пластинки:</p>
        <p>• позначте точку O;</p>
        <p>
          • проведіть через точку O пряму k, перпендикулярну до даного відрізка;
        </p>
        <p>
          • за допомогою циркуля побудуйте коло радіусом 4–5 см із центром у
          точці O;
        </p>
        <p>
          3) під кутом приблизно 45° накресліть промінь, який задаватиме
          напрямок пучка світла, що падає в точку O; позначте точку перетину
          променя і кола літерою A;
        </p>
        <p>
          4) повторіть дії, описані в пунктах 1–3, ще тричі (виконайте ще три
          рисунки), спочатку збільшивши, а потім зменшивши заданий кут падіння
          променя світла.
        </p>
        <p>
          Фото виконаних рисунків додайте в блок «Фото» нижче.
        </p>
      </Section>

      <Section title="Експеримент">
        <p>
          <em>Суворо дотримуйтесь інструкції з безпеки.</em>
        </p>
        <p>
          <em>Результати вимірювань і обчислень відразу заносьте до таблиці.</em>
        </p>
        <p>
          1. Покладіть під аркуш зошита з першим контуром аркуш гофрованого
          картону, накладіть на контур скляну пластинку.
        </p>
        <p>
          2. Встроміть вертикально в точки A і O шпильки 1 і 2 (див. рис. 2).
        </p>

        <Figure
          src={fig2}
          alt="Рис. 2. Шпильки 1 і 2 в точках A і O, шпильки 3 і 4 за пластинкою, лінія спостереження"
          className="w-full max-w-md mx-auto"
        />

        <p>
          3. Дивлячись на шпильки 1 і 2 крізь скло, встроміть шпильки 3 і 4 так,
          щоб усі чотири шпильки здавалися розташованими на одній прямій.
        </p>
        <p>
          4. Приберіть шпильки і пластинку, проведіть через основи шпильок 3 і
          4 пряму, позначте точку M і накресліть заломлений промінь OM (див.
          рис. 2 і 3).
        </p>
        <p>
          5. Повторіть дії, описані в пунктах 1–4, ще для трьох контурів.
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
          Виріжте з картону круг і проведіть експеримент. Проаналізуйте
          результат, сформулюйте висновок.
        </p>
        <p>1) План експерименту:</p>
        <Answer id="c_plan" rows={5} />
        <p>2) Результат експерименту:</p>
        <p>
          n<sub>води</sub> = <Cell id="n_water" />
        </p>
        <p>3) Висновок:</p>
        <Answer id="c_conclusion" rows={4} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "exp5-refraction-devices",
  grade: 11,
  badge: "5.1",
  number: "№ 5",
  title:
    "Дослідження заломлення світла",
  goal: "дослідити заломлення світла на межі «скло — повітря», визначити показник заломлення скла відносно повітря.",
  equipment: "скляна пластинка з паралельними гранями, аркуш гофрованого картону, олівець, 4 шпильки, косинець із міліметровою шкалою, циркуль.",
  sheetName: "Заломлення світла",
  meta: {
    title:
      "Дослідження заломлення світла — експериментальна робота №5",
    description:
      "Дослідіть заломлення світла на межі «скло — повітря» та визначте показник заломлення скла відносно повітря.",
  },
  Content,
};

export default lab;
