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

const EXPERIMENT_VIDEO = "https://www.youtube.com/embed/6w4kB5zYIpM";

function Content() {
  return (
    <LabForm sheetName="Період обертання (відео)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>Переконайтеся, що ви знаєте відповіді на такі запитання.</p>
        <p>1) Який рух називають рівномірним рухом по колу?</p>
        <Answer id="v_circular_motion_def" rows={3} />

        <p>
          2) За якими формулами обчислюють період рівномірного руху тіла по
          колу, обертову частоту та швидкість руху?
        </p>
        <Answer id="v_formulas" rows={3} />

        <p>
          У цьому варіанті роботи ви не проводите експеримент самостійно, а
          переглядаєте відео з готовим дослідом. Уважно перегляньте відео нижче
          (за потреби ставте на паузу й переглядайте окремі моменти повторно),
          запишіть дані, які в ньому наведено або які можна виміряти за
          відео, до таблиці та виконайте обчислення.
        </p>
      </Section>

      <Section title="Експеримент">
        <p>
          <em>
            Переглядаючи відео, заносьте результати вимірювань відразу до
            таблиці.
          </em>
        </p>

        <Simulation src={EXPERIMENT_VIDEO} title="Відеоексперимент" />

        <p>
          1. З відео визначте радіус кола, по якому рухається тіло:
        </p>
        <p>
          R = <Cell id="R" /> м
        </p>

        <p>
          2. Запишіть кількість обертів N, яку здійснило тіло, та час t, за
          який відбулися ці оберти (час можна визначити за секундоміром у
          відео або виміряти власним секундоміром під час перегляду).
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Кількість обертів N">
                Кількість обертів N
              </HeaderCell>
              <HeaderCell id="h2" text="Час t, с">
                Час t, с
              </HeaderCell>
              <HeaderCell id="h3" text="Період обертання T, с">
                Період обертання T, с
              </HeaderCell>
              <HeaderCell id="h4" text="Обертова частота n, Гц">
                Обертова частота n, Гц
              </HeaderCell>
              <HeaderCell id="h5" text="Швидкість руху v, м/с">
                Швидкість руху v, м/с
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <Cell id="N" />
              </Td>
              <Td>
                <Cell id="t" />
              </Td>
              <Td>
                <Cell id="T" />
              </Td>
              <Td>
                <Cell id="n" />
              </Td>
              <Td>
                <Cell id="v" />
              </Td>
            </tr>
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>
          Визначте період обертання, обертову частоту та швидкість руху тіла:
        </p>
        <Formula math="T = \frac{t}{N}" />

        <p>
          <Formula math="n = \frac{1}{T}" />
        </p>
        <p>
          <Formula math="v = \frac{2\pi R}{T}" />
        </p>

        <p>Занесіть обчислені значення T, n і v до таблиці.</p>
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>Проаналізувавши експеримент, зробіть висновок, у якому зазначте:</p>

        <p>1) який рух ви вивчали;</p>
        <Answer id="v1" rows={4} />

        <p>2) значення яких величин визначали;</p>
        <Answer id="v2" rows={4} />

        <p>3) які результати отримали;</p>
        <Answer id="v3" rows={4} />

        <p>4) у чому причина похибки.</p>
        <Answer id="v4" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Продумайте та запишіть план проведення експерименту, мета якого —
          виявити залежність періоду обертання та обертової частоти тіла від
          довжини нитки.
        </p>
        <Answer id="v_plan" rows={6} />

        <p>Зробіть висновок про те, як, на вашу думку, змінюватимуться T і n:</p>
        <Answer id="v_creative_conclusion" rows={5} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "rotation-period-video",
  grade: 7,
  badge: "2.2",
  number: "№ 2",
  title:
    "Вимірювання періоду обертання та обертової частоти. Варіант 2 (за відео)",
  goal: "виміряти період обертання та обертову частоту тіла під час його рівномірного руху по колу.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Період обертання (відео)",
  meta: {
    title:
      "Вимірювання періоду обертання та обертової частоти (за відео) — лабораторна робота №2, варіант 2",
    description:
      "Перегляньте відео досліду, запишіть дані до таблиці та визначте період обертання, обертову частоту й швидкість руху тіла по колу.",
  },
  Content,
};

export default lab;
