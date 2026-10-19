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
import { Formula } from "@/components/formula";
import a1a2Diagram from "@/assets/light-wavelength-a1-a2-diagram.png";
import type { LabDefinition } from "./types";

const SIMULATION_URL = "https://www.thephysicsaviary.com/Physics/Programs/Labs/EMSpectrum/";

const COLORS = [
  { id: "violet", label: "Фіолетовий", tableRange: "380-450" },
  { id: "red", label: "Червоний", tableRange: "620-760" },
];

function Content() {
  return (
    <LabForm sheetName="Довжина світлової хвилі (симуляція)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>
          1. У цій роботі використовується симуляція EM Spectrum Lab. У
          ній ви дивитиметесь на розжарену нитку лампи крізь дифракційну
          ґратку з відомою кількістю штрихів на міліметр (N) — оберіть
          одну з доступних ґраток і запишіть її N.
        </p>
        <Formula math="d = \dfrac{10^{-3}\,\text{м}}{N}" />
        <p>
          N = <Cell id="N" /> штрихів/мм&nbsp;&nbsp;&nbsp; d ={" "}
          <Cell id="d" /> м
        </p>

        <p>
          2. Встановіть відстань від лампи (щілини) до ґратки/екрана —
          симулятор дозволяє змінювати цю відстань. Запишіть її значення
          як l.
        </p>

        <Simulation src={SIMULATION_URL} title="EM Spectrum Lab" />
      </Section>

      <Section title="Експеримент">
        <p>
          <em>Результати вимірювань і обчислень відразу заносьте до таблиці.</em>
        </p>

        <p>
          1. Спостерігайте дифракційні спектри по обидва боки від
          зображення нитки розжарення.
        </p>

        <p>
          2. За шкалою в симуляторі визначте спочатку відстань a₁ від
          центра щілини до межі фіолетового кольору спектра першого
          порядку, розташованої праворуч, потім відстань a₂ до тієї самої
          межі, розташованої ліворуч.
        </p>

        <Figure
          src={a1a2Diagram}
          alt="Визначення відстаней a1 і a2 від центра щілини до меж кольору спектра першого порядку праворуч і ліворуч"
          className="w-full max-w-md mx-auto"
        />

        <p>
          3. Повторіть дії, описані в п. 2, для межі червоного кольору
          спектра першого порядку.
        </p>
        <p>
          4. Значення відстані l від ґратки до екрана (з підготовки до
          експерименту):
        </p>
        <p>
          l = <Cell id="l" /> м
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Колір спектра">
                Колір спектра
              </HeaderCell>
              <HeaderCell id="h2" text="a1, м">
                a<sub>1</sub>, м
              </HeaderCell>
              <HeaderCell id="h3" text="a2, м">
                a<sub>2</sub>, м
              </HeaderCell>
              <HeaderCell id="h4" text="aсер, м">
                a<sub>сер</sub>, м
              </HeaderCell>
              <HeaderCell id="h5" text="λ виміряна, нм">
                λ виміряна, нм
              </HeaderCell>
              <HeaderCell id="h6" text="λтабл, нм">
                λ<sub>табл</sub>, нм
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {COLORS.map((c) => (
              <tr key={c.id}>
                <Td>{c.label}</Td>
                <Td>
                  <Cell id={`a1_${c.id}`} />
                </Td>
                <Td>
                  <Cell id={`a2_${c.id}`} />
                </Td>
                <Td>
                  <Cell id={`a_avg_${c.id}`} />
                </Td>
                <Td>
                  <Cell id={`lambda_${c.id}`} />
                </Td>
                <Td>{c.tableRange}</Td>
              </tr>
            ))}
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>
          1. Обчисліть середні значення відстаней від щілини до відповідних
          меж фіолетового і червоного кольорів спектрів першого порядку:
        </p>
        <Formula math="a_{\text{сер}} = \dfrac{a_1 + a_2}{2}" />

        <p>
          2. Скориставшись формулою, обчисліть довжину світлової хвилі
          фіолетового кольору та світлової хвилі червоного кольору:
        </p>
        <Formula math="\lambda = \dfrac{d \, a_{\text{сер}}}{l}" />

        <p>
          3. Оцініть відносну похибку експерименту, порівнявши значення
          довжин хвиль, отриманих у ході експерименту, з табличним
          значенням:
        </p>
        <Formula math="\varepsilon_\lambda = \left|1 - \dfrac{\lambda}{\lambda_{\text{табл}}}\right| \cdot 100\%" />
        <p>
          ε<sub>λ</sub> (фіолетовий) = <Cell id="eps_violet" /> %
        </p>
        <p>
          ε<sub>λ</sub> (червоний) = <Cell id="eps_red" /> %
        </p>
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          Проаналізуйте експеримент і його результати. Сформулюйте
          висновок, у якому зазначте:
        </p>

        <p>1) яку фізичну величину ви визначали;</p>
        <Answer id="v1" rows={4} />

        <p>2) який результат отримали;</p>
        <Answer id="v2" rows={4} />

        <p>3) у чому причини можливої похибки експерименту.</p>
        <Answer id="v3" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Визначте довжину хвилі світла червоного кольору за дифракційним
          спектром другого порядку. Порівняйте значення довжини хвилі
          світла червоного кольору, отримане в результаті цього
          експерименту, з тим, що було отримане в ході виконання
          експериментальної роботи. Запишіть причини розбіжності.
        </p>

        <p>
          Для спектра другого порядку (n = 2) формула набуває вигляду:
        </p>
        <Formula math="\lambda = \dfrac{d \, a_{\text{сер}}}{n \, l}" />

        <p>
          a₁ (2-й порядок) = <Cell id="a1_red2" /> м&nbsp;&nbsp; a₂ (2-й
          порядок) = <Cell id="a2_red2" /> м
        </p>
        <p>
          a<sub>сер</sub> (2-й порядок) = <Cell id="a_avg_red2" /> м
        </p>
        <p>
          λ (2-й порядок) = <Cell id="lambda_red2" /> нм
        </p>

        <Answer id="v_creative" rows={6} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "light-wavelength-simulation",
  grade: 11,
  badge: "7.3",
  number: "№ 7",
  title: "Вимірювання довжини світлової хвилі. Варіант 3 (симуляція)",
  goal: "навчитися вимірювати довжину світлової хвилі за допомогою дифракційної ґратки.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Довжина світлової хвилі (симуляція)",
  meta: {
    title:
      "Вимірювання довжини світлової хвилі (симуляція) — експериментальна робота №7 (11 клас), варіант 3",
    description:
      "Виміряйте довжину світлової хвилі за допомогою дифракційної ґратки в симуляції EM Spectrum Lab.",
  },
  Content,
};

export default lab;
