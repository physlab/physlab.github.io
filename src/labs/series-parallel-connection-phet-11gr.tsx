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
import type { LabDefinition } from "./types";

const SIMULATION_URL =
  "https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_all.html";

function Content() {
  return (
    <LabForm sheetName="Послідовне і паралельне з'єднання (PhET)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>
          1. Накресліть схеми двох електричних кіл. Кожне коло має містити два
          резистори, які через ключ з'єднані з джерелом струму: схема 1 —
          резистори з'єднані послідовно; схема 2 — резистори з'єднані
          паралельно. Схеми накресліть у зошиті й додайте їх фото в блок «Фото»
          нижче.
        </p>
        <p>
          2. Біля кожної схеми запишіть співвідношення, які вам необхідно
          перевірити (формули для визначення загальної сили струму, загальної
          напруги, загального опору).
        </p>
        <Answer id="v_prep" rows={5} />
        <p>
          Складайте кола в симуляторі нижче. Для зручності ввімкніть
          відображення числових значень (<strong>Values</strong>).
        </p>

        <Simulation
          src={SIMULATION_URL}
          title="PhET: Circuit Construction Kit — DC"
        />
      </Section>

      <Section title="Експеримент">
        <p>
          <em>
            Результати вимірювань і обчислень відразу заносьте до таблиць.
          </em>
        </p>

        <p>
          <strong>
            Дослід 1. Дослідження послідовного з'єднання провідників
          </strong>
        </p>
        <p>
          1. Складіть у симуляторі електричне коло за накресленою вами схемою 1
          (батарея, ключ, два резистори, з'єднувальні дроти).
        </p>
        <p>
          2. Виміряйте (вольтметром симулятора) напругу на першому резисторі (U
          <sub>1</sub>), на другому резисторі (U<sub>2</sub>), на обох
          резисторах разом (U). Накресліть схеми відповідних електричних кіл.
        </p>
        <p>
          3. Виміряйте силу струму, увімкнувши амперметр симулятора спочатку між
          джерелом струму і першим резистором (I<sub>1</sub>), потім між першим
          і другим резисторами (I<sub>2</sub>), а потім між ключем і джерелом
          струму (I). Накресліть схеми відповідних електричних кіл.
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="sh1" text="U1, В">
                U<sub>1</sub>, В
              </HeaderCell>
              <HeaderCell id="sh2" text="U2, В">
                U<sub>2</sub>, В
              </HeaderCell>
              <HeaderCell id="sh3" text="U, В">
                U, В
              </HeaderCell>
              <HeaderCell id="sh4" text="Uпосл, В">
                U<sub>посл</sub>, В
              </HeaderCell>
              <HeaderCell id="sh5" text="εU посл, %">
                ε<sub>U посл</sub>, %
              </HeaderCell>
              <HeaderCell id="sh6" text="I1, А">
                I<sub>1</sub>, А
              </HeaderCell>
              <HeaderCell id="sh7" text="I2, А">
                I<sub>2</sub>, А
              </HeaderCell>
              <HeaderCell id="sh8" text="I, А">
                I, А
              </HeaderCell>
              <HeaderCell id="sh9" text="R1, Ом">
                R<sub>1</sub>, Ом
              </HeaderCell>
              <HeaderCell id="sh10" text="R2, Ом">
                R<sub>2</sub>, Ом
              </HeaderCell>
              <HeaderCell id="sh11" text="R, Ом">
                R, Ом
              </HeaderCell>
              <HeaderCell id="sh12" text="Rпосл, Ом">
                R<sub>посл</sub>, Ом
              </HeaderCell>
              <HeaderCell id="sh13" text="εR посл, %">
                ε<sub>R посл</sub>, %
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <Cell id="s_U1" />
              </Td>
              <Td>
                <Cell id="s_U2" />
              </Td>
              <Td>
                <Cell id="s_U" />
              </Td>
              <Td>
                <Cell id="s_Uposl" />
              </Td>
              <Td>
                <Cell id="s_eU" />
              </Td>
              <Td>
                <Cell id="s_I1" />
              </Td>
              <Td>
                <Cell id="s_I2" />
              </Td>
              <Td>
                <Cell id="s_I" />
              </Td>
              <Td>
                <Cell id="s_R1" />
              </Td>
              <Td>
                <Cell id="s_R2" />
              </Td>
              <Td>
                <Cell id="s_R" />
              </Td>
              <Td>
                <Cell id="s_Rposl" />
              </Td>
              <Td>
                <Cell id="s_eR" />
              </Td>
            </tr>
          </tbody>
        </LabTable>

        <p>
          <strong>
            Дослід 2. Дослідження паралельного з'єднання провідників
          </strong>
        </p>
        <p>
          1. Складіть у симуляторі електричне коло за накресленою вами схемою 2.
        </p>
        <p>
          2. Виміряйте напругу на кожному резисторі (U<sub>1</sub>, U
          <sub>2</sub>), на обох резисторах разом (U). Накресліть схеми
          відповідних електричних кіл.
        </p>
        <p>
          3. Виміряйте силу струму в першому резисторі (I<sub>1</sub>), у
          другому резисторі (I<sub>2</sub>), у нерозгалуженій ділянці кола (I).
          Накресліть схеми відповідних електричних кіл.
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="ph1" text="U1, В">
                U<sub>1</sub>, В
              </HeaderCell>
              <HeaderCell id="ph2" text="U2, В">
                U<sub>2</sub>, В
              </HeaderCell>
              <HeaderCell id="ph3" text="U, В">
                U, В
              </HeaderCell>
              <HeaderCell id="ph4" text="I1, А">
                I<sub>1</sub>, А
              </HeaderCell>
              <HeaderCell id="ph5" text="I2, А">
                I<sub>2</sub>, А
              </HeaderCell>
              <HeaderCell id="ph6" text="I, А">
                I, А
              </HeaderCell>
              <HeaderCell id="ph7" text="Iпарал, А">
                I<sub>парал</sub>, А
              </HeaderCell>
              <HeaderCell id="ph8" text="εI парал, %">
                ε<sub>I парал</sub>, %
              </HeaderCell>
              <HeaderCell id="ph9" text="R1, Ом">
                R<sub>1</sub>, Ом
              </HeaderCell>
              <HeaderCell id="ph10" text="R2, Ом">
                R<sub>2</sub>, Ом
              </HeaderCell>
              <HeaderCell id="ph11" text="R, Ом">
                R, Ом
              </HeaderCell>
              <HeaderCell id="ph12" text="Rпарал, Ом">
                R<sub>парал</sub>, Ом
              </HeaderCell>
              <HeaderCell id="ph13" text="εR парал, %">
                ε<sub>R парал</sub>, %
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <Cell id="p_U1" />
              </Td>
              <Td>
                <Cell id="p_U2" />
              </Td>
              <Td>
                <Cell id="p_U" />
              </Td>
              <Td>
                <Cell id="p_I1" />
              </Td>
              <Td>
                <Cell id="p_I2" />
              </Td>
              <Td>
                <Cell id="p_I" />
              </Td>
              <Td>
                <Cell id="p_Iparal" />
              </Td>
              <Td>
                <Cell id="p_eI" />
              </Td>
              <Td>
                <Cell id="p_R1" />
              </Td>
              <Td>
                <Cell id="p_R2" />
              </Td>
              <Td>
                <Cell id="p_R" />
              </Td>
              <Td>
                <Cell id="p_Rparal" />
              </Td>
              <Td>
                <Cell id="p_eR" />
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
          maxImages={8}
        />
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>
          1. Користуючись законом Ома для ділянки кола, для кожного досліду
          визначте опір першого резистора (R<sub>1</sub>), опір другого
          резистора (R<sub>2</sub>), загальний опір ділянки кола (R):
        </p>
        <Formula math="R_1 = \dfrac{U_1}{I_1}, \qquad R_2 = \dfrac{U_2}{I_2}, \qquad R = \dfrac{U}{I}" />

        <p>
          2. Користуючись співвідношеннями для послідовного і паралельного
          з'єднань споживачів, для кожного досліду визначте загальний опір
          ділянки кола, напругу на ділянці, силу струму в колі:
        </p>
        <Formula math="R_{\text{посл}} = R_1 + R_2, \qquad U_{\text{посл}} = U_1 + U_2" />
        <Formula math="R_{\text{парал}} = \dfrac{R_1 R_2}{R_1 + R_2}, \qquad I_{\text{парал}} = I_1 + I_2" />

        <p>
          3. Оцініть відносну похибку експериментального підтвердження кожної з
          рівностей:
        </p>
        <Formula math="\varepsilon_{R_{\text{посл}}} = \left| 1 - \dfrac{R_{\text{посл}}}{R} \right| \cdot 100\%, \qquad \varepsilon_{U_{\text{посл}}} = \left| 1 - \dfrac{U_{\text{посл}}}{U} \right| \cdot 100\%" />
        <Formula math="\varepsilon_{R_{\text{парал}}} = \left| 1 - \dfrac{R_{\text{парал}}}{R} \right| \cdot 100\%, \qquad \varepsilon_{I_{\text{парал}}} = \left| 1 - \dfrac{I_{\text{парал}}}{I} \right| \cdot 100\%" />

        <p>Результати обчислень занесіть до таблиць.</p>
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          За результатами експерименту сформулюйте і запишіть висновок, у якому
          зазначте:
        </p>
        <p>1) які досліди ви проводили;</p>
        <Answer id="v1" rows={4} />
        <p>2) які співвідношення були підтверджені;</p>
        <Answer id="v2" rows={4} />
        <p>3) які чинники вплинули на точність результатів експерименту.</p>
        <Answer id="v3" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Поміркуйте, який експеримент щодо визначення опору резистора можна
          провести, якщо в обладнанні до роботи: 1) замість амперметра
          використати резистор відомого опору; 2) замість вольтметра використати
          резистор відомого опору. Запишіть план кожного експерименту,
          накресліть відповідні схеми (фото схем додайте в блок «Фото»).
          Проведіть експерименти.
        </p>
        <p>
          1) План експерименту із резистором відомого опору замість амперметра:
        </p>
        <Answer id="c1_plan" rows={5} />
        <p>
          Результат: R<sub>x</sub> = <Cell id="c1_Rx" /> Ом
        </p>
        <p>
          2) План експерименту із резистором відомого опору замість вольтметра:
        </p>
        <Answer id="c2_plan" rows={5} />
        <p>
          Результат: R<sub>x</sub> = <Cell id="c2_Rx" /> Ом
        </p>
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "exp1-series-parallel-phet",
  grade: 11,
  badge: "1.2",
  number: "№ 1",
  title:
    "Перевірка законів послідовного і паралельного з'єднань провідників. Варіант 2 (симуляція PhET)",
  goal: "експериментально перевірити співвідношення, які справджуються у випадку послідовного та у випадку паралельного з'єднань провідників.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Послідовне і паралельне з'єднання (PhET)",
  meta: {
    title:
      "Перевірка законів з'єднань провідників (симуляція PhET) — експериментальна робота №1, варіант 2",
    description:
      "Перевірте співвідношення для послідовного та паралельного з'єднань провідників у симуляції PhET Circuit Construction Kit: DC.",
  },
  Content,
};

export default lab;
