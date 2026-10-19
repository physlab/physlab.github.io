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

const SIMULATION_URL =
  "https://phet.colorado.edu/sims/html/circuit-construction-kit-ac-virtual-lab/latest/circuit-construction-kit-ac-virtual-lab_all.html";

const SERIES = [{ prefix: "c", label: "Котушка", color: "#667eea" }];

function Content() {
  return (
    <LabForm sheetName="Індуктивність котушки (PhET)">
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
          У симуляторі не можна вставити осердя в котушку або вийняти його,
          тому в цьому варіанті ви визначаєте індуктивність однієї котушки й
          порівнюєте результат із значенням, яке задано в симуляторі.
        </p>

        <Simulation
          src={SIMULATION_URL}
          title="PhET: Circuit Construction Kit — AC, Virtual Lab"
        />
      </Section>

      <Section title="Експеримент">
        <p>
          <em>Результати вимірювань і обчислень відразу заносьте до таблиць.</em>
        </p>

        <p>
          1. Складіть у симуляторі коло: джерело змінної напруги (AC Voltage),
          ключ, котушка індуктивності (Inductor) — послідовно; вольтметр
          підключіть паралельно котушці, амперметр — послідовно в коло.
          Увімкніть відображення числових значень.
        </p>
        <p>
          2. Запишіть задану індуктивність котушки L<sub>задане</sub> ={" "}
          <Cell id="L_set" /> Гн, частоту джерела ν = <Cell id="nu" /> Гц і
          активний опір котушки R (у симуляторі котушка ідеальна, тому
          R ≈ 0).
        </p>
        <p>3. Замкніть ключ.</p>
        <p>
          4. Змінюючи амплітуду напруги джерела, виміряйте силу струму за
          чотирьох значень напруги. Якщо прилади показують амплітудні
          значення, використовуйте їх: відношення U/I однакове і для
          амплітудних, і для діючих значень.
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
              <Td>котушка</Td>
              <Td rowSpan={1}>
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
          1. Побудуйте графік U(I) — залежності діючої напруги від діючої сили
          струму. Графік нижче будується автоматично за даними з таблиці —
          порівняйте його зі своїм.
        </p>
        <InductanceUIChart series={SERIES} frequencyCellId="nu" />
        <p>
          2. За графіком U(I) визначте середнє значення повного опору ділянки
          (див. Додаток 2), де U′ і I′ — значення напруги і сили струму для
          довільно обраної точки графіка:
        </p>
        <Formula math="Z_{\text{сер}} = \dfrac{U'}{I'}" />
        <p>
          U′ = <Cell id="c_Up" /> В&nbsp;&nbsp;&nbsp; I′ = <Cell id="c_Ip" /> А
        </p>

        <p>
          3. Обчисліть середнє значення індуктивності котушки (якщо 
          R ≪ Z, то активним опором котушки можна знехтувати):
        </p>
        <Formula math="L_{\text{сер}} \approx \dfrac{Z_{\text{сер}}}{\omega} \approx \dfrac{Z_{\text{сер}}}{2\pi\nu}" />
        <p>
          де ν — частота джерела, яку ви записали в п. 2 розділу «Експеримент».
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
        <p>3) чи залежить індуктивність котушки від поданої напруги;</p>
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
  slug: "exp4-inductance-phet",
  grade: 11,
  badge: "4.2",
  number: "№ 4",
  title:
    "Вимірювання індуктивності котушки. Варіант 2 (симуляція PhET)",
  goal: "експериментально визначити індуктивність котушки в симуляції та порівняти її із заданим значенням.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Індуктивність котушки (PhET)",
  meta: {
    title:
      "Вимірювання індуктивності котушки (симуляція PhET) — експериментальна робота №4, варіант 2",
    description:
      "Визначте індуктивність котушки в симуляції PhET Circuit Construction Kit: AC Virtual Lab.",
  },
  Content,
};

export default lab;
