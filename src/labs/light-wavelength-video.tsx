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
import setupPhoto from "@/assets/light-wavelength-setup.png";
import lampPhoto from "@/assets/light-wavelength-lamp-photo.png";
import spectrumPhoto from "@/assets/light-wavelength-spectrum-photo.png";
import a1a2Diagram from "@/assets/light-wavelength-a1-a2-diagram.png";
import type { LabDefinition } from "./types";

const EXPERIMENT_VIDEO = "https://www.youtube.com/embed/H5UJKzYkDsQ";

const COLORS = [
  { id: "violet", label: "Фіолетовий", tableRange: "380-450" },
  { id: "red", label: "Червоний", tableRange: "620-760" },
];

function Content() {
  return (
    <LabForm sheetName="Довжина світлової хвилі (відео)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>
          1. Визначте період d дифракційної ґратки. (Зазвичай на ґратці
          вказують кількість N штрихів на 1 мм, а період ґратки
          обчислюють за формулою):
        </p>
        <Formula math="d = \dfrac{10^{-3}\,\text{м}}{N}" />
        <p>
          N = <Cell id="N" /> штрихів/мм&nbsp;&nbsp;&nbsp; d ={" "}
          <Cell id="d" /> м
        </p>

        <p>
          2. У цьому варіанті роботи ви не збираєте установку самостійно, а
          переглядаєте відео з готовим дослідом. Уважно перегляньте відео
          нижче (за потреби ставте на паузу й переглядайте окремі моменти
          повторно), запишіть подані в ньому дані до таблиці та виконайте
          обчислення.
        </p>

        <Figure
          src={setupPhoto}
          alt="Рисунок 1. Установка: штатив із муфтою, екран зі щілиною, дифракційна ґратка"
          className="w-full max-w-md mx-auto"
        />

        <Simulation src={EXPERIMENT_VIDEO} title="Відеоексперимент" />
      </Section>

      <Section title="Експеримент">
        <p>
          <em>
            Переглядаючи відео, заносьте результати вимірювань і обчислень
            відразу до таблиці.
          </em>
        </p>

        <p>
          1. Дивлячись крізь дифракційну ґратку і щілину на лампу
          розжарювання, спостерігайте на екрані приладу різкі дифракційні
          спектри, лінії яких паралельні штрихам на шкалі.
        </p>

        <Figure
          src={lampPhoto}
          alt="Рисунок 2. Спостереження дифракційного спектра лампи розжарювання крізь ґратку"
          className="w-full max-w-sm mx-auto"
        />
        <Figure
          src={spectrumPhoto}
          alt="Рисунок 3. Дифракційні спектри, що спостерігаються на екрані приладу"
          className="w-full max-w-sm mx-auto"
        />

        <p>
          2. За шкалою на екрані визначте спочатку відстань a₁ від центра
          щілини до межі фіолетового кольору спектра першого порядку,
          розташованої праворуч від щілини, потім відстань a₂ від центра
          щілини до межі фіолетового кольору спектра першого порядку,
          розташованої ліворуч від щілини.
        </p>

        <Figure
          src={a1a2Diagram}
          alt="Рисунок 4. Визначення відстаней a1 і a2 від центра щілини до меж кольору спектра першого порядку праворуч і ліворуч"
          className="w-full max-w-md mx-auto"
        />

        <p>
          3. Повторіть дії, описані в п. 2, для межі червоного кольору
          спектра першого порядку.
        </p>
        <p>4. Виміряйте відстань l від ґратки до екрана.</p>
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
  slug: "light-wavelength-video",
  grade: 11,
  badge: "7.2",
  number: "№ 7",
  title: "Вимірювання довжини світлової хвилі. Варіант 2 (за відео)",
  goal: "навчитися вимірювати довжину світлової хвилі за допомогою дифракційної ґратки.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Довжина світлової хвилі (відео)",
  meta: {
    title:
      "Вимірювання довжини світлової хвилі (за відео) — експериментальна робота №7 (11 клас), варіант 2",
    description:
      "Перегляньте відео вимірювання довжини світлової хвилі за допомогою дифракційної ґратки та виконайте обчислення.",
  },
  Content,
};

export default lab;
