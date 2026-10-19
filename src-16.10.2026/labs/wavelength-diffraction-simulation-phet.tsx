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

const WAVE_INTERFERENCE_URL =
  "https://phet.colorado.edu/sims/html/wave-interference/latest/wave-interference_all.html?locale=uk";

function Content() {
  return (
    <LabForm sheetName="Вимірювання довжини світлової хвилі (симуляція PhET)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>2. Запишіть формули для визначення:</p>
        <p>1) періоду (сталої) дифракційної ґратки / відстані між щілинами:</p>
        <Formula math="d = \dfrac{1}{N}" />
        <p>(де N — кількість щілин / штрихів на одиницю довжини)</p>
        <p>2) умови максимуму дифракції (для малих кутів):</p>
        <Formula math="d \sin\theta \approx d\,\dfrac{a}{l} = k\lambda" />
        <p>звідки</p>
        <Formula math="\lambda = \dfrac{d\, a}{k\, l}" />
        <p>3) відносної похибки:</p>
        <Formula math="\varepsilon_{\lambda} = \left| 1 - \dfrac{\lambda}{\lambda_{\text{табл}}} \right| \cdot 100\%" />

        <p>
          3. Згадайте, як працює дифракційна гратка та чому різні кольори
          відхиляються на різні кути.
        </p>
        <Answer id="v_grating_principle" rows={4} />

        <p>
          <em>
            Повна фізична установка з лампою розжарення, реальною дифракційною
            граткою та шкалою в одній безкоштовній симуляції майже не
            зустрічається. Тому цей варіант використовує симуляцію PhET «Хвильова
            інтерференція» (вкладка «Світло» / «Light»), де можна дослідити
            дифракцію на одній і двох щілинах, а також спостерігати залежність
            положення максимумів від довжини хвилі. Далі ви виконаєте
            ілюстративні вимірювання та розрахунки.
          </em>
        </p>
      </Section>

      <Section title="Частина 1. Ознайомлення з дифракцією світла (PhET Wave Interference)">
        <p>
          1. Відкрийте симуляцію PhET <strong>«Хвильова інтерференція»</strong>{" "}
          (Wave Interference). Перейдіть на вкладку <strong>Light</strong>{" "}
          (Світло).
        </p>

        <Simulation
          src={WAVE_INTERFERENCE_URL}
          title="PhET: Wave Interference — Light"
        />

        <p>
          2. Увімкніть джерело світла (лазер). Додайте бар’єр з однією або двома
          щілинами. Спостерігайте дифракційну / інтерференційну картину на
          екрані.
        </p>

        <p>
          3. Змініть довжину хвилі (колір) світла за допомогою повзунка.
          Зафіксуйте, як змінюється відстань між максимумами при збільшенні /
          зменшенні λ.
        </p>
        <p>
          Спостереження: при збільшенні λ відстань між максимумами{" "}
          <Cell id="observation_lambda" /> (збільшується / зменшується).
        </p>

        <p>
          4. Змініть відстань між щілинами (d). Як це впливає на картину?
        </p>
        <Answer id="v_slit_distance_effect" rows={3} />
      </Section>

      <Section title="Частина 2. Ілюстративні вимірювання та розрахунки">
        <p>
          Оскільки в симуляції немає реальної шкали в метрах і готової
          дифракційної гратки з відомим N, використайте умовні значення,
          близькі до шкільного експерименту, або виміряйте в умовних одиницях
          екрана симуляції (пікселі / поділки).
        </p>

        <p>
          1. Задайте в симуляції (або прийміть умовно) такі параметри:
        </p>
        <p>
          d (відстань між щілинами / період) = <Cell id="d_value" /> м
          (умовне)
        </p>
        <p>
          l (відстань до екрана) = <Cell id="l_value" /> м (умовне)
        </p>
        <p>
          k (порядок максимуму) = <Cell id="k_value" />
        </p>

        <p>
          2. Виміряйте (або оцініть за екраном симуляції) відстань a від
          центрального максимуму до першого (або другого) максимуму для
          фіолетового та червоного світла.
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="d, м">
                d, м
              </HeaderCell>
              <HeaderCell id="h2" text="Колір">
                Колір
              </HeaderCell>
              <HeaderCell id="h3" text="a, м (умовне)">
                a, м (умовне)
              </HeaderCell>
              <HeaderCell id="h4" text="l, м">
                l, м
              </HeaderCell>
              <HeaderCell id="h5" text="k">
                k
              </HeaderCell>
              <HeaderCell id="h6" text="λ обчислена, нм">
                λ обчислена, нм
              </HeaderCell>
              <HeaderCell id="h7" text="λ табл, нм">
                λ<sub>табл</sub>, нм
              </HeaderCell>
              <HeaderCell id="h8" text="ελ, %">
                ε<sub>λ</sub>, %
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td rowSpan={2}>
                <Cell id="d_table" />
              </Td>
              <Td>Фіолетовий</Td>
              <Td>
                <Cell id="a_violet" />
              </Td>
              <Td rowSpan={2}>
                <Cell id="l_table" />
              </Td>
              <Td rowSpan={2}>
                <Cell id="k_table" />
              </Td>
              <Td>
                <Cell id="lambda_violet" />
              </Td>
              <Td>380–450</Td>
              <Td>
                <Cell id="eps_violet" />
              </Td>
            </tr>
            <tr>
              <Td>Червоний</Td>
              <Td>
                <Cell id="a_red" />
              </Td>
              <Td>
                <Cell id="lambda_red" />
              </Td>
              <Td>620–760</Td>
              <Td>
                <Cell id="eps_red" />
              </Td>
            </tr>
          </tbody>
        </LabTable>

        <p>
          3. Обчисліть λ за формулою{" "}
          <Formula math="\lambda = \dfrac{d\, a}{k\, l}" /> і порівняйте з
          табличними значеннями.
        </p>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>1. Використавши результати, обчисліть:</p>
        <p>1) довжину хвилі для фіолетового та червоного світла;</p>
        <Formula math="\lambda = \dfrac{d\, a}{k\, l}" />
        <p>2) відносну похибку:</p>
        <Formula math="\varepsilon_{\lambda} = \left| 1 - \dfrac{\lambda}{\lambda_{\text{табл}}} \right| \cdot 100\%" />

        <p>2. Закінчіть заповнення таблиці.</p>
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          Проаналізувавши експеримент і його результати, зробіть висновок, у
          якому зазначте:
        </p>
        <p>
          1) яку фізичну величину ви вимірювали, за допомогою яких засобів
          (симуляція PhET);
        </p>
        <p>2) який результат отримали;</p>
        <p>
          3) чому довжина хвилі фіолетового світла менша, ніж червоного, і як
          це проявляється на дифракційній картині;
        </p>
        <p>
          4) які чинники (умовність масштабу симуляції, відсутність реальної
          гратки з відомим N, похибка «вимірювання» на екрані) вплинули на
          точність результатів.
        </p>
        <Answer id="v1" rows={7} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Запропонуйте план реального шкільного експерименту з визначення
          довжини світлової хвилі за допомогою дифракційної гратки. Яке
          обладнання знадобиться? Як можна зменшити похибку вимірювання a₁ та
          a₂?
        </p>
        <Answer id="v_creative1" rows={7} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "wavelength-diffraction-simulation-phet",
  grade: 11,
  badge: "7.3",
  number: "№ 7",
  title:
    "Вимірювання довжини світлової хвилі. Варіант 3 (симуляція PhET)",
  goal:
    "навчитися вимірювати довжину світлової хвилі; спостерігати дифракцію світла за допомогою симуляції PhET.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Вимірювання довжини світлової хвилі (симуляція PhET)",
  meta: {
    title:
      "Вимірювання довжини світлової хвилі (симуляція PhET) — експериментальна робота №7, варіант 3",
    description:
      "Дослідіть дифракцію світла в симуляції PhET Wave Interference та виконайте ілюстративні розрахунки довжини хвилі.",
  },
  Content,
};

export default lab;
