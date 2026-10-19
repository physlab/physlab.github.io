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
import { Section, Simulation } from "@/components/lab/lab-shell";
import { Formula } from "@/components/formula";
import { InductanceUIChart } from "@/components/lab/inductance-ui-chart";
import type { LabDefinition } from "./types";
const EXPERIMENT_VIDEO = "https://www.youtube.com/embed/2860nQXyW0Q";

const SERIES = [
  { prefix: "c", label: "З осердям", color: "#667eea" },
  { prefix: "n", label: "Без осердя", color: "#e07a5f" },
];

function Content() {
  return (
    <LabForm sheetName="Індуктивність котушки (відео)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>
          Із формули для визначення повного опору Z кола змінного струму, яке
          містить котушку, отримайте формулу для визначення індуктивності L
          котушки:
        </p>
        <Formula math="Z = \sqrt{R^2 + \omega^2 L^2}" />
        <Answer id="v_prep" rows={4} />

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

        <p>1. Запишіть активний опір котушки, виміряний мультиметром.</p>
        <p>
          2. Для котушки з осердям запишіть покази вольтметра (U) і
          міліамперметра (I) для чотирьох значень напруги.
        </p>
        <p>
          3. Вийміть осердя (у відео) і запишіть покази приладів для котушки
          без осердя для чотирьох значень напруги.
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Котушка">
                Котушка
              </HeaderCell>
              <HeaderCell id="h2" text="Активний опір R, Ом">
                Активний опір R, Ом
              </HeaderCell>
              <HeaderCell id="h3" text="U1, В">
                U<sub>1</sub>, В
              </HeaderCell>
              <HeaderCell id="h4" text="U2, В">
                U<sub>2</sub>, В
              </HeaderCell>
              <HeaderCell id="h5" text="U3, В">
                U<sub>3</sub>, В
              </HeaderCell>
              <HeaderCell id="h6" text="U4, В">
                U<sub>4</sub>, В
              </HeaderCell>
              <HeaderCell id="h7" text="I1, А">
                I<sub>1</sub>, А
              </HeaderCell>
              <HeaderCell id="h8" text="I2, А">
                I<sub>2</sub>, А
              </HeaderCell>
              <HeaderCell id="h9" text="I3, А">
                I<sub>3</sub>, А
              </HeaderCell>
              <HeaderCell id="h10" text="I4, А">
                I<sub>4</sub>, А
              </HeaderCell>
              <HeaderCell id="h11" text="Середній повний опір Zсер, Ом">
                Середній повний опір Z<sub>сер</sub>, Ом
              </HeaderCell>
              <HeaderCell id="h12" text="Індуктивність котушки Lсер, Гн">
                Індуктивність котушки L<sub>сер</sub>, Гн
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>з осердям</Td>
              <Td rowSpan={2}>
                <Cell id="R" />
              </Td>
              <Td>
                <Cell id="c_U1" />
              </Td>
              <Td>
                <Cell id="c_U2" />
              </Td>
              <Td>
                <Cell id="c_U3" />
              </Td>
              <Td>
                <Cell id="c_U4" />
              </Td>
              <Td>
                <Cell id="c_I1" />
              </Td>
              <Td>
                <Cell id="c_I2" />
              </Td>
              <Td>
                <Cell id="c_I3" />
              </Td>
              <Td>
                <Cell id="c_I4" />
              </Td>
              <Td>
                <Cell id="c_Z" />
              </Td>
              <Td>
                <Cell id="c_L" />
              </Td>
            </tr>
            <tr>
              <Td>без осердя</Td>
              <Td>
                <Cell id="n_U1" />
              </Td>
              <Td>
                <Cell id="n_U2" />
              </Td>
              <Td>
                <Cell id="n_U3" />
              </Td>
              <Td>
                <Cell id="n_U4" />
              </Td>
              <Td>
                <Cell id="n_I1" />
              </Td>
              <Td>
                <Cell id="n_I2" />
              </Td>
              <Td>
                <Cell id="n_I3" />
              </Td>
              <Td>
                <Cell id="n_I4" />
              </Td>
              <Td>
                <Cell id="n_Z" />
              </Td>
              <Td>
                <Cell id="n_L" />
              </Td>
            </tr>
          </tbody>
        </LabTable>
      </Section>

      <Section title="Фото">
        <ImageCanvas
          label="Прикріпіть фото (схеми, скріншоти)"
          height={400}
          minHeight={250}
          maxHeight={700}
          maxImages={6}
        />
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>
          Дії, описані нижче, виконайте для котушки з осердям і для котушки без
          осердя.
        </p>
        <p>
          1. Побудуйте графік U(I) — залежності діючої напруги від діючої сили
          струму. Графік нижче будується автоматично за даними з таблиці —
          порівняйте його зі своїм.
        </p>
        <InductanceUIChart series={SERIES} />
        <p>
          2. За графіком U(I) визначте середнє значення повного опору ділянки
          (див. Додаток 2), де U′ і I′ — значення напруги і сили струму для
          довільно обраної точки графіка:
        </p>
        <Formula math="Z_{\text{сер}} = \dfrac{U'}{I'}" />
        <p>
          З осердям: U′ = <Cell id="c_Up" /> В&nbsp;&nbsp;&nbsp; I′ ={" "}
          <Cell id="c_Ip" /> А
        </p>
        <p>
          Без осердя: U′ = <Cell id="n_Up" /> В&nbsp;&nbsp;&nbsp; I′ ={" "}
          <Cell id="n_Ip" /> А
        </p>

        <p>
          3. Обчисліть середнє значення індуктивності котушки (якщо 
          R ≪ Z, то активним опором котушки можна знехтувати):
        </p>
        <Formula math="L_{\text{сер}} \approx \dfrac{Z_{\text{сер}}}{\omega} \approx \dfrac{Z_{\text{сер}}}{2\pi\nu}" />
        <p>
          де ν = 50 Гц — частота зміни напруги.
        </p>
        <p>Результати обчислень занесіть до таблиці.</p>
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          Проаналізуйте експеримент і його результати. За результатами
          експерименту сформулюйте і запишіть висновок, у якому зазначте:
        </p>
        <p>1) яку фізичну величину ви вимірювали;</p>
        <Answer id="v1" rows={4} />
        <p>2) результати вимірювань;</p>
        <Answer id="v2" rows={4} />
        <p>3) чи залежить індуктивність котушки від поданої напруги; від наявності осердя;</p>
        <Answer id="v3" rows={4} />
        <p>4) причини похибки.</p>
        <Answer id="v4" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Продумайте і запишіть плани проведення експериментів щодо доведення
          залежності індуктивності котушки від кількості витків в її обмотці;
          від форми осердя.
        </p>
        <p>1) План експерименту щодо залежності L від кількості витків:</p>
        <Answer id="c1_plan" rows={5} />
        <p>2) План експерименту щодо залежності L від форми осердя:</p>
        <Answer id="c2_plan" rows={5} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "exp4-inductance-video",
  grade: 11,
  badge: "4.3",
  number: "№ 4",
  title:
    "Вимірювання індуктивності котушки. Варіант 3 (за відео)",
  goal: "експериментально визначити індуктивність котушки; переконатися на досліді, що індуктивність котушки суттєво залежить від наявності осердя.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Індуктивність котушки (відео)",
  meta: {
    title:
      "Вимірювання індуктивності котушки (за відео) — експериментальна робота №4, варіант 3",
    description:
      "Перегляньте відео вимірювання індуктивності котушки з осердям і без осердя та опрацюйте результати.",
  },
  Content,
};

export default lab;
