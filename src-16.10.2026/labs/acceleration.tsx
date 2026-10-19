import katex from "katex";
import "katex/dist/katex.min.css";
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
import type { LabDefinition } from "./types";
import { Formula } from "@/components/formula";

const SCHEME_VIDEO = "https://www.youtube.com/embed/WLStaT3cTtI";
const EXPERIMENT_VIDEO = "https://www.youtube.com/embed/yZGDF5CEYR8";

/**
 * Renders a LaTeX string with KaTeX directly (no react-katex wrapper).
 */

function Content() {
  return (
    <LabForm sheetName="Прискорення">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>
          1. Підготуйте похилу поверхню. Це може бути стіл, під дві ніжки якого
          підкладіть невеликі предмети.
        </p>
        <p>
          2. Підготуйте кульку невеликих розмірів. Це може бути кулька для
          настільного тенісу, металева кулька від підшипника. Можна також
          використати предмет циліндричної форми, якщо ви не знайдете кульки.
        </p>
        <p>
          3. Пустіть по поверхні стола кульку, переконайтеся, що кулька котиться
          по прямій траєкторії.
        </p>
        <p>
          4. Підберіть кут нахилу таким, щоб кулька котилася не менш ніж 1
          секунду. Штовхати кульку не потрібно.
        </p>
        <p>
          5. Якщо кулька котиться не по прямій, можна покласти довгу планку,
          опираючись збоку на яку котитиметься ваша кулька.
        </p>
        <p>6. Відмітьте точку, від якої ви пускатимете кульку.</p>
        <p>7. Відмітьте точку, до якої котитиметься кулька.</p>
        <p>
          8. Підготуйте секундомір. Це може бути секундомір у вашому мобільному
          телефоні.
        </p>

        <Simulation src={SCHEME_VIDEO} title="Схема установки" />

        <p>
          <strong>ВАЖЛИВО!!!</strong> Сфотографуйте вашу установку та додайте
          фото через секцію "Фото установки".
        </p>
      </Section>

      <Section title="Експеримент">
        <p>
          <em>
            Суворо дотримуйтесь інструкції з безпеки. Результати вимірювань
            відразу заносьте до таблиці.
          </em>
        </p>

        <p>
          1. Виміряйте відстань s від позначки, від якої ви відпускатимете
          кульку, до позначки, до якої котитиметься кулька (ця відстань дорівнює
          модулю переміщення кульки).
        </p>
        <p>
          2. Розташуйте кульку навпроти позначки та виміряйте час t<sub>1</sub>,
          за який скочується кулька (до моменту її перетину позначки завершення
          руху).
        </p>

        <Simulation src={EXPERIMENT_VIDEO} title="Проведення експерименту" />

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="№">
                №
              </HeaderCell>
              <HeaderCell id="h2" text="Переміщення кульки s, м">
                Переміщення кульки s, м
              </HeaderCell>
              <HeaderCell id="h3" text="Час руху кульки tᵢ, с">
                Час руху кульки t<sub>і</sub>, с
              </HeaderCell>
              <HeaderCell id="h4" text="Середній час tсер, с">
                Середній час t<sub>сер</sub>, с
              </HeaderCell>
              <HeaderCell id="h5" text="Прискорення aсер, м/с²">
                Прискорення a<sub>сер</sub>, м/с<sup>2</sup>
              </HeaderCell>
              <HeaderCell id="h6" text="Відносна похибка εa, %">
                Відносна похибка ε<sub>a</sub>, %
              </HeaderCell>
              <HeaderCell id="h7" text="Абсолютна похибка ∆a, м/с²">
                Абсолютна похибка ∆a, м/с<sup>2</sup>
              </HeaderCell>
              <HeaderCell id="h8" text="Результат a = aсер ± ∆a, м/с²">
                Результат a = a<sub>сер</sub> ± ∆a, м/с<sup>2</sup>
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4].map((row) => (
              <tr key={row}>
                <Td>{row}</Td>
                {row === 1 && (
                  <Td rowSpan={4}>
                    <Cell id="S" />
                  </Td>
                )}
                <Td>
                  <Cell id={`t${row}`} />
                </Td>
                {row === 1 && (
                  <>
                    <Td rowSpan={4}>
                      <Cell id="t_ser" />
                    </Td>
                    <Td rowSpan={4}>
                      <Cell id="a_ser" />
                    </Td>
                    <Td rowSpan={4}>
                      <Cell id="e_a_ser" />
                    </Td>
                    <Td rowSpan={4}>
                      <Cell id="delta_a_ser" />
                    </Td>
                    <Td rowSpan={4}>
                      <Cell id="res" />
                    </Td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>1. Обчисліть середній час руху кульки:</p>
        <p>
          t<sub>сер</sub> = (t<sub>1</sub> + t<sub>2</sub> + t<sub>3</sub> + t
          <sub>4</sub>) / 4
        </p>
        <p>
          t<sub>сер</sub> = <Cell id="f_t_ser" /> с
        </p>

        <p>2. Обчисліть середнє значення прискорення кульки:</p>
        <p>
          a<sub>сер</sub> = 2s / t<sub>сер</sub>
          <sup>2</sup>
        </p>
        <p>
          a<sub>сер</sub> = <Cell id="f_a_ser" /> м/с<sup>2</sup>
        </p>

        <p>
          3. Обчисліть абсолютну та відносну похибки вимірювання (див. п. 4 §
          2):
        </p>

        <p>
          <strong>1) часу:</strong>
        </p>
        <Formula math="\Delta t_{\text{сер}} = \dfrac{|t_1 - t_{\text{сер}}| + |t_2 - t_{\text{сер}}| + |t_3 - t_{\text{сер}}| + |t_4 - t_{\text{сер}}|}{4}" />
        <Formula math="\varepsilon_t = \dfrac{\Delta t_{\text{сер}}}{t_{\text{сер}}}" />
        <p>
          ∆t<sub>сер</sub> = <Cell id="f_delta_t_ser" /> с
        </p>
        <p>
          ε<sub>t</sub> = <Cell id="f_et" /> %
        </p>

        <p>
          <strong>2) модуля переміщення:</strong>
        </p>
        <Formula math="\Delta s = \Delta s_{\text{прил}} + \Delta s_{\text{вип}}" />
        <Formula math="\varepsilon_s = \dfrac{\Delta s}{s}" />
        <p>
          (Похибки приладів див. п. 4 § 2, якщо ви користуєтесь іншими
          приладами, то вважайте, що похибка приладу дорівнює половині ціни
          поділки шкали цього приладу. Якщо вимірювання проводилися один раз, то
          випадкова похибка дорівнює половині ціни поділки шкали приладу)
        </p>
        <p>
          ∆s<sub>сер</sub> = <Cell id="f_delta_s" /> м
        </p>
        <p>
          ε<sub>s</sub> = <Cell id="f_es" /> %
        </p>

        <p>
          <strong>3) модуля прискорення:</strong>
        </p>
        <Formula math="\varepsilon_a = \varepsilon_s + 2\varepsilon_t" />
        <Formula math="\Delta a = \varepsilon_a \cdot a_{\text{сер}}" />
        <p>
          ε<sub>a</sub> = <Cell id="f_eps_a" /> %
        </p>
        <p>
          ∆a = <Cell id="f_delta_a" /> м/с<sup>2</sup>
        </p>

        <p>
          4. Округліть результати та запишіть до таблиці результат вимірювання
          прискорення.
        </p>
        <p>
          (Абсолютну похибку ∆a округлюють до однієї значущої цифри із
          завищенням, а результат вимірювання a<sub>сер</sub> – до величини
          розряду, який залишився в абсолютній похибці після округлення)
        </p>
      </Section>
      <Section title="Фото установки">
        <ImageCanvas
          label="Прикріпіть фото установки"
          height={400}
          minHeight={250}
          maxHeight={700}
          maxImages={6}
        />
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          Проаналізуйте експеримент і його результати. За результатами
          експерименту сформулюйте і запишіть висновок, у якому зазначте:
        </p>

        <p>1) величину, яку ви вимірювали;</p>
        <Answer id="v1" rows={6} />

        <p>2) результат вимірювання;</p>
        <Answer id="v2" rows={6} />

        <p>3) причини похибки;</p>
        <Answer id="v3" rows={6} />

        <p>4) вимірювання якої величини дає найбільшу похибку.</p>
        <Answer id="v4" rows={6} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "acceleration",
  grade: 10,
  badge: "1",
  number: "№ 1",
  title:
    "Визначення прискорення тіла в ході рівноприскореного прямолінійного руху",
  goal: "визначити прискорення руху кульки, яка скочується похилою поверхнею.",
  equipment: "похила поверхня, кулька, секундомір, вимірювальна стрічка.",
  sheetName: "Прискорення",
  meta: {
    title: "Визначення прискорення тіла — лабораторна робота №1",
    description:
      "Визначте прискорення кульки, яка скочується похилою поверхнею, та заповніть онлайн-бланк лабораторної роботи.",
  },
  Content,
};

export default lab;
