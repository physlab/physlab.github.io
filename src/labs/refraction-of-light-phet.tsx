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
import waterCircle from "@/assets/refraction-water-circle.png";
import type { LabDefinition } from "./types";

const SIMULATION_URL =
  "https://phet.colorado.edu/sims/html/bending-light/latest/bending-light_uk.html";

const X_IDS = ["sg1", "sg2", "sg3", "sg4"];
const Y_IDS = ["sa1", "sa2", "sa3", "sa4"];

function Content() {
  return (
    <LabForm sheetName="Заломлення світла (PhET)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>1. Перед тим як виконувати роботу, згадайте:</p>
        <p>1) вимоги безпеки під час роботи за комп'ютером;</p>
        <Answer id="v_safety" rows={3} />
        <p>2) закони заломлення світла;</p>
        <Answer id="v_laws" rows={3} />
        <p>
          3) формулу для визначення показника заломлення середовища 1 відносно
          середовища 2.
        </p>
        <Answer id="v_formula" rows={3} />

        <p>
          2. Відкрийте симулятор нижче, перейдіть на вкладку «Вступ»
          (Intro). Для верхнього середовища оберіть повітря, для нижнього —
          скло. Запишіть показник заломлення скла, заданий у симуляторі:
          n<sub>задане</sub> = <Cell id="n_set" />
        </p>

        <Simulation
          src={SIMULATION_URL}
          title="PhET: Заломлення світла"
        />
      </Section>

      <Section title="Експеримент">
        <p>
          <em>Результати вимірювань і обчислень відразу заносьте до таблиці.</em>
        </p>
        <p>
          1. Увімкніть лазер і кутомір (Protractor). Налаштуйте промінь так,
          щоб він падав із повітря на поверхню скла.
        </p>
        <p>
          2. Установіть кут падіння α приблизно 45° (перетягуючи лазер) і за
          кутоміром визначте кут заломлення γ — кут між заломленим променем і
          нормаллю.
        </p>
        <p>
          3. Повторіть вимірювання ще для трьох значень кута падіння:
          спочатку збільшивши, а потім зменшивши заданий кут.
        </p>
        <p>
          4. Обчисліть sin α і sin γ для кожного досліду та занесіть значення
          до таблиці.
        </p>
      </Section>

      <Section title="Результати вимірювань">

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="№">
                №
              </HeaderCell>
              <HeaderCell id="h2" text="Кут падіння α, °">
                α, °
              </HeaderCell>
              <HeaderCell id="h3" text="Кут заломлення γ, °">
                γ, °
              </HeaderCell>
              <HeaderCell id="h4" text="sin α">
                sin α
              </HeaderCell>
              <HeaderCell id="h5" text="sin γ">
                sin γ
              </HeaderCell>
              <HeaderCell id="h6" text="Показник заломлення n">
                n
              </HeaderCell>
              <HeaderCell id="h7" text="Показник заломлення nсер">
                n<sub>сер</sub>
              </HeaderCell>
              <HeaderCell id="h8" text="Похибка експерименту ε, %">
                ε, %
              </HeaderCell>
              <HeaderCell id="h9" text="Похибка експерименту Δn">
                Δn
              </HeaderCell>
              <HeaderCell id="h10" text="Результат n = nсер ± Δn">
                n = n<sub>сер</sub> ± Δn
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>1</Td>
              <Td>
                <Cell id="al1" />
              </Td>
              <Td>
                <Cell id="ga1" />
              </Td>
              <Td>
                <Cell id="sa1" />
              </Td>
              <Td>
                <Cell id="sg1" />
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
                <Cell id="al2" />
              </Td>
              <Td>
                <Cell id="ga2" />
              </Td>
              <Td>
                <Cell id="sa2" />
              </Td>
              <Td>
                <Cell id="sg2" />
              </Td>
              <Td>
                <Cell id="n2" />
              </Td>
            </tr>
            <tr>
              <Td>3</Td>
              <Td>
                <Cell id="al3" />
              </Td>
              <Td>
                <Cell id="ga3" />
              </Td>
              <Td>
                <Cell id="sa3" />
              </Td>
              <Td>
                <Cell id="sg3" />
              </Td>
              <Td>
                <Cell id="n3" />
              </Td>
            </tr>
            <tr>
              <Td>4</Td>
              <Td>
                <Cell id="al4" />
              </Td>
              <Td>
                <Cell id="ga4" />
              </Td>
              <Td>
                <Cell id="sa4" />
              </Td>
              <Td>
                <Cell id="sg4" />
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
        <p>1. Визначте показник заломлення скла відносно повітря:</p>
        <Formula math="n = \dfrac{\sin\alpha}{\sin\gamma}" />
        <p>
          Значення sin α і sin γ занесіть до таблиці (їх можна визначити за
          калькулятором).
        </p>

        <p>
          2. Побудуйте графік залежності sin α(sin γ) і визначте середнє
          значення показника заломлення (див. Додаток 2 підручника). Графік
          нижче будується автоматично за даними з таблиці — порівняйте його зі
          своїм.
        </p>
        <RefractionChart
          xIds={X_IDS}
          yIds={Y_IDS}
          xTitle="sin γ"
          yTitle="sin α"
        />

        <p>
          3. Визначте відносну й абсолютну похибки вимірювання показника
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
          експерименту з визначення показника заломлення води відносно
          повітря. Проведіть експеримент у симуляторі, обравши як нижнє
          середовище воду. Проаналізуйте результат, сформулюйте висновок.
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
  slug: "exp5-refraction-phet",
  grade: 11,
  badge: "5.2",
  number: "№ 5",
  title:
    "Дослідження заломлення світла. Варіант 2 (симуляція PhET)",
  goal: "дослідити заломлення світла на межі «скло — повітря», визначити показник заломлення скла відносно повітря.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Заломлення світла (PhET)",
  meta: {
    title:
      "Дослідження заломлення світла (симуляція PhET) — експериментальна робота №5, варіант 2",
    description:
      "Дослідіть заломлення світла на межі «скло — повітря» в симуляції PhET «Заломлення світла».",
  },
  Content,
};

export default lab;
