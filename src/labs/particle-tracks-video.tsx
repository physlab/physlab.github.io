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
import photo from "@/assets/particle-tracks-photo.png";
import radiusFigure from "@/assets/particle-tracks-radius-construction.png";
import type { LabDefinition } from "./types";
const EXPERIMENT_VIDEO = "https://www.youtube.com/embed/sO_z6WHtxkI";

function Content() {
  return (
    <LabForm sheetName="Треки заряджених частинок (відео)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>
          1. Згадайте, як визначають модуль і напрямок сили, з якою магнітне
          поле діє на рухому заряджену частинку (сили Лоренца).
        </p>
        <Answer id="v_lorentz" rows={4} />

        <p>
          У цьому варіанті роботи ви не проводите вимірювання самостійно, а
          переглядаєте відео, у якому аналізують фотографію треків. Уважно
          перегляньте відео нижче (за потреби ставте на паузу й переглядайте
          окремі моменти повторно), запишіть подані в ньому дані до таблиці та
          виконайте обчислення.
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

        <Figure
          src={photo}
          alt="Рис. 1. Фотографія треків заряджених частинок у камері Вільсона: трек I і трек II; масштаб — 1 см"
          className="w-full max-w-md mx-auto"
        />

        <p>
          1. Розгляньте фотографію треків заряджених частинок, отриманих за
          допомогою камери Вільсона (рис. 1):
        </p>
        <p>
          1) укажіть напрямки початкових швидкостей руху частинок I і II, яким
          відповідають треки I і II;
        </p>
        <Answer id="v_direction" rows={3} />
        <p>
          2) з'ясуйте, як змінюється товщина кожного треку — від початку до
          кінця пробігу частинки.
        </p>
        <Answer id="v_thickness" rows={3} />

        <p>
          2. Знаючи, що частинка I ідентифікована як протон і що обидві
          частинки рухаються перпендикулярно до вектора магнітної індукції
          магнітного поля, створеного в камері, визначте:
        </p>
        <p>1) знак заряду частинки II;</p>
        <Answer id="v_sign" rows={3} />
        <p>2) напрямок вектора магнітної індукції.</p>
        <Answer id="v_B" rows={3} />

        <p>
          3. Урахувавши масштаб, запишіть радіуси R<sub>I</sub> і R<sub>II</sub>{" "}
          треків на початку пробігу частинок, визначені у відео, для чого (див. рис. 2):
        </p>
        <p>1) на зображенні треку накресліть дві хорди;</p>
        <p>
          2) до кожної хорди поставте серединний перпендикуляр і позначте точку
          O перетину цих перпендикулярів;
        </p>
        <p>
          3) виміряйте відстань R від точки O до початку треку (радіус
          кривизни).
        </p>

        <Figure
          src={radiusFigure}
          alt="Рис. 2. Побудова радіуса кривизни треку: дві хорди, їхні серединні перпендикуляри, точка O їх перетину та радіус R"
          className="w-full max-w-xs mx-auto"
        />

        <p>
          <em>Таблиця 1</em>
        </p>
        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Номер частинки">
                Номер частинки
              </HeaderCell>
              <HeaderCell id="h2" text="Форма треку">
                Форма треку
              </HeaderCell>
              <HeaderCell id="h3" text="Зміна товщини треку">
                Зміна товщини треку
              </HeaderCell>
              <HeaderCell id="h4" text="Радіус кривизни треку R, м">
                Радіус кривизни треку R, м
              </HeaderCell>
              <HeaderCell id="h5" text="Знак заряду частинки">
                Знак заряду частинки
              </HeaderCell>
              <HeaderCell id="h6" text="Питомий заряд q/m, Кл/кг">
                Питомий заряд q/m, Кл/кг
              </HeaderCell>
              <HeaderCell id="h7" text="Назва частинки">
                Назва частинки
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>I</Td>
              <Td>
                <Cell id="shape_I" />
              </Td>
              <Td>
                <Cell id="thick_I" />
              </Td>
              <Td>
                <Cell id="R_I" />
              </Td>
              <Td>
                <Cell id="sign_I" />
              </Td>
              <Td>
                <Cell id="qm_I" />
              </Td>
              <Td>
                <Cell id="name_I" />
              </Td>
            </tr>
            <tr>
              <Td>II</Td>
              <Td>
                <Cell id="shape_II" />
              </Td>
              <Td>
                <Cell id="thick_II" />
              </Td>
              <Td>
                <Cell id="R_II" />
              </Td>
              <Td>
                <Cell id="sign_II" />
              </Td>
              <Td>
                <Cell id="qm_II" />
              </Td>
              <Td>
                <Cell id="name_II" />
              </Td>
            </tr>
          </tbody>
        </LabTable>
      </Section>

      <Section title="Фото">
        <ImageCanvas
          label="Прикріпіть фото / скриншоти"
          height={400}
          minHeight={250}
          maxHeight={700}
          maxImages={6}
        />
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>
          1. За даними таблиці 2 визначте питомий заряд частинки I (нагадуємо,
          що частинка I ідентифікована як протон).
        </p>
        <p>
          q<sub>I</sub>/m<sub>I</sub> = <Cell id="qm_I_calc" /> Кл/кг
        </p>

        <p>
          <em>Таблиця 2</em>
        </p>
        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="t2h1" text="Частинка">
                Частинка
              </HeaderCell>
              <HeaderCell id="t2h2" text="Питомий заряд q/m, Кл/кг">
                Питомий заряд q/m, Кл/кг
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>Електрон</Td>
              <Td>1,759 · 10<sup>11</sup></Td>
            </tr>
            <tr>
              <Td>Протон</Td>
              <Td>9,578 · 10<sup>7</sup></Td>
            </tr>
            <tr>
              <Td>α-частинка</Td>
              <Td>4,822 · 10<sup>7</sup></Td>
            </tr>
          </tbody>
        </LabTable>

        <p>2. Обчисліть питомий заряд частинки II:</p>
        <Formula math="\dfrac{q_{II}}{m_{II}} = \dfrac{q_I}{m_I} \cdot \dfrac{R_I}{R_{II}}" />
        <p>
          q<sub>II</sub>/m<sub>II</sub> = <Cell id="qm_II_calc" /> Кл/кг
        </p>
        <p>
          3. Знаючи питомий заряд частинки II, ідентифікуйте її: визначте,
          ядром якого елемента є ця частинка.
        </p>
        <Answer id="v_ident" rows={3} />
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          Проаналізуйте результати дослідження треків заряджених частинок.
          Сформулюйте висновок.
        </p>
        <Answer id="v_conclusion" rows={6} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Проведіть додаткові вимірювання та визначте, у скільки разів
          зменшилася кінетична енергія протона за час пробігу в камері
          Вільсона.
        </p>
        <Formula math="E_k = \dfrac{(qBR)^2}{2m} \quad \Rightarrow \quad \dfrac{E_{k,\text{поч}}}{E_{k,\text{кін}}} = \left( \dfrac{R_{\text{поч}}}{R_{\text{кін}}} \right)^2" />
        <p>
          R<sub>поч</sub> = R<sub>I</sub> = <Cell id="R_start" /> м&nbsp;&nbsp;&nbsp;
          R<sub>кін</sub> = <Cell id="R_end" /> м
        </p>
        <p>
          E<sub>поч</sub>/E<sub>кін</sub> = <Cell id="E_ratio" />
        </p>
        <Answer id="c_notes" rows={4} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "exp9-particle-tracks-video",
  grade: 11,
  badge: "9.3",
  number: "№ 9",
  title:
    "Дослідження треків заряджених частинок за фотографіями. Варіант 3 (за відео)",
  goal: "навчитися аналізувати фотографії із зображенням треків заряджених частинок, отриманих за допомогою камери Вільсона, та ідентифікувати ці частинки.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Треки заряджених частинок (відео)",
  meta: {
    title:
      "Дослідження треків заряджених частинок (за відео) — експериментальна робота №9, варіант 3",
    description:
      "Перегляньте відео аналізу фотографії треків заряджених частинок та ідентифікуйте частинки.",
  },
  Content,
};

export default lab;
