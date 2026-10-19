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

// Віртуальна лабораторія з дифракційною ґраткою (UFC / інші відкриті ресурси)
const SIMULATION_URL =
  "https://www.thephysicsaviary.com/Physics/Programs/Labs/EMSpectrum/";

function Content() {
  return (
    <LabForm sheetName="Вимірювання довжини світлової хвилі (симуляція, інший ресурс)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>2. Запишіть формули для визначення:</p>
        <p>1) періоду дифракційної гратки:</p>
        <Formula math="d = \dfrac{10^{-3}\,\text{м}}{N}" />
        <p>2) середньої відстані:</p>
        <Formula math="a_{\text{сер}} = \dfrac{a_1 + a_2}{2}" />
        <p>3) довжини світлової хвилі (для першого порядку, k = 1):</p>
        <Formula math="\lambda = \dfrac{d\, a_{\text{сер}}}{l}" />
        <p>4) відносної похибки:</p>
        <Formula math="\varepsilon_{\lambda} = \left| 1 - \dfrac{\lambda}{\lambda_{\text{табл}}} \right| \cdot 100\%" />

        <p>
          3. Згадайте, як потрібно розташувати дифракційну гратку, джерело
          світла та екран, щоб спостерігати чіткі спектри.
        </p>
        <Answer id="v_setup" rows={4} />

        <p>
          4. Відкрийте віртуальну лабораторію з дифракційними ґратками
          (Laboratory of Virtual Physics — Diffraction Gratings). У цій
          симуляції можна змінювати кількість штрихів, довжину хвилі та
          спостерігати положення максимумів.
        </p>
        <p>
          <em>
            Сайт може відкриватися в новій вкладці. Скористайтеся посиланням
            нижче.
          </em>
        </p>
        <p>
          <a href={SIMULATION_URL} target="_blank" rel="noopener noreferrer">
            Відкрити Diffraction Grating Simulation ↗
          </a>
        </p>
        <Simulation
          src={SIMULATION_URL}
          title="Diffraction Grating Virtual Lab"
        />

        <p>
          5. Ознайомтеся з інтерфейсом: оберіть кількість ліній на мм (N),
          довжину хвилі (або колір), відстань до екрана.
        </p>
      </Section>

      <Section title="Експеримент">
        <p>
          <em>Результати вимірювань відразу заносьте до таблиці.</em>
        </p>

        <p>
          1. Встановіть у симуляції значення N (кількість штрихів на 1 мм) і
          обчисліть період d.
        </p>
        <p>
          N = <Cell id="N_value" /> штрихів/мм&nbsp;&nbsp; d ={" "}
          <Cell id="d_value" /> м
        </p>

        <p>2. Встановіть відстань l від гратки до екрана. Запишіть її.</p>
        <p>
          l = <Cell id="l_value" /> м
        </p>

        <p>
          3. Для фіолетового світла (або найкоротшої доступної λ) виміряйте
          відстані a₁ та a₂ від центрального максимуму до максимумів першого
          порядку (або до межі спектра, якщо симуляція показує спектр).
        </p>

        <p>4. Повторіть для червоного світла (найдовшої доступної λ).</p>

        <p>
          5. Якщо симуляція дозволяє, повторіть вимірювання для спектра другого
          порядку (k = 2).
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Період d, м">
                Період d, м
              </HeaderCell>
              <HeaderCell id="h2" text="Колір / λ">
                Колір / λ
              </HeaderCell>
              <HeaderCell id="h3" text="a1, м">
                a<sub>1</sub>, м
              </HeaderCell>
              <HeaderCell id="h4" text="a2, м">
                a<sub>2</sub>, м
              </HeaderCell>
              <HeaderCell id="h5" text="aсер, м">
                a<sub>сер</sub>, м
              </HeaderCell>
              <HeaderCell id="h6" text="l, м">
                l, м
              </HeaderCell>
              <HeaderCell id="h7" text="k">
                k
              </HeaderCell>
              <HeaderCell id="h8" text="λ виміряна, нм">
                λ виміряна, нм
              </HeaderCell>
              <HeaderCell id="h9" text="λ табл, нм">
                λ<sub>табл</sub>, нм
              </HeaderCell>
              <HeaderCell id="h10" text="ελ, %">
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
                <Cell id="a1_violet" />
              </Td>
              <Td>
                <Cell id="a2_violet" />
              </Td>
              <Td>
                <Cell id="a_avg_violet" />
              </Td>
              <Td rowSpan={2}>
                <Cell id="l_table" />
              </Td>
              <Td>
                <Cell id="k_violet" />
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
                <Cell id="a1_red" />
              </Td>
              <Td>
                <Cell id="a2_red" />
              </Td>
              <Td>
                <Cell id="a_avg_red" />
              </Td>
              <Td>
                <Cell id="k_red" />
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
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>1. Використавши результати вимірювань, обчисліть:</p>
        <p>
          1) середні значення a<sub>сер</sub>;
        </p>
        <Formula math="a_{\text{сер}} = \dfrac{a_1 + a_2}{2}" />
        <p>2) довжину світлової хвилі:</p>
        <Formula math="\lambda = \dfrac{d\, a_{\text{сер}}}{k\, l}" />
        <p>(результат у метрах переведіть у нанометри)</p>
        <p>3) відносну похибку:</p>
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
          (віртуальна лабораторія);
        </p>
        <p>2) який результат отримали;</p>
        <p>
          3) чому різні кольори мають різні довжини хвиль і як це видно на
          дифракційній картині;
        </p>
        <p>
          4) які чинники (особливості моделі симуляції, точність «вимірювання»
          на екрані, округлення) могли вплинути на точність отриманих
          результатів.
        </p>
        <Answer id="v1" rows={7} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Визначте довжину хвилі світла червоного кольору за дифракційним
          спектром другого порядку (k = 2). Порівняйте значення з результатом
          для першого порядку. Запишіть можливі причини розбіжності.
        </p>
        <Answer id="v_creative1" rows={7} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "wavelength-diffraction-simulation-other",
  grade: 11,
  badge: "7.4",
  number: "№ 7",
  title:
    "Вимірювання довжини світлової хвилі. Варіант 4 (симуляція, інший ресурс)",
  goal: "навчитися вимірювати довжину світлової хвилі за допомогою дифракційної гратки у віртуальній лабораторії.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Вимірювання довжини світлової хвилі (симуляція, інший ресурс)",
  meta: {
    title:
      "Вимірювання довжини світлової хвилі (віртуальна лабораторія) — експериментальна робота №7, варіант 4",
    description:
      "Виміряйте довжину світлової хвилі у віртуальній лабораторії з дифракційними ґратками.",
  },
  Content,
};

export default lab;
