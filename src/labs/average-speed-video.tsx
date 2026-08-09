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
import type { LabDefinition } from "./types";

const EXPERIMENT_VIDEO = "https://www.youtube.com/embed/9VOG92DTD58";

function Content() {
  return (
    <LabForm sheetName="Середня швидкість (відео)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>1. Переконайтеся, що ви знаєте відповіді на такі запитання.</p>
        <p>1) Який рух називають нерівномірним?</p>
        <Answer id="v_uneven_motion" rows={3} />

        <p>2) Як обчислюють середню швидкість руху тіла?</p>
        <Answer id="v_avg_speed_def" rows={3} />

        <p>
          2. У цьому варіанті роботи ви не проводите експеримент самостійно, а
          переглядаєте відео з готовим дослідом. Уважно перегляньте відео нижче
          (за потреби ставте на паузу й переглядайте окремі моменти повторно),
          запишіть подані в ньому дані до таблиці та виконайте обчислення.
        </p>
      </Section>

      <Section title="Експеримент">
        <p>
          <em>
            Переглядаючи відео, заносьте результати вимірювань відразу до
            таблиці.
          </em>
        </p>

        <p>
          У відео показано дослід з кулькою, яка скочується похилим жолобом:
          вимірюється шлях l, який долає кулька, та час t її руху для трьох
          дослідів. Запишіть ці дані до таблиці.
        </p>

        <Simulation src={EXPERIMENT_VIDEO} title="Відеоексперимент" />

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Номер досліду">
                Номер досліду
              </HeaderCell>
              <HeaderCell id="h2" text="Шлях l, м">
                Шлях l, м
              </HeaderCell>
              <HeaderCell id="h3" text="Час руху кульки t, с">
                Час руху кульки t, с
              </HeaderCell>
              <HeaderCell id="h4" text="Середній час руху кульки tсер, с">
                Середній час руху кульки t<sub>сер</sub>, с
              </HeaderCell>
              <HeaderCell
                id="h5"
                text="Середня швидкість руху кульки vсер, м/с"
              >
                Середня швидкість руху кульки v<sub>сер</sub>, м/с
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((row) => (
              <tr key={row}>
                <Td>{row}</Td>
                {row === 1 && (
                  <Td rowSpan={3}>
                    <Cell id="l" />
                  </Td>
                )}
                <Td>
                  <Cell id={`t${row}`} />
                </Td>
                {row === 1 && (
                  <>
                    <Td rowSpan={3}>
                      <Cell id="t_ser" />
                    </Td>
                    <Td rowSpan={3}>
                      <Cell id="v_ser" />
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
          t<sub>сер</sub> = (t<sub>1</sub> + t<sub>2</sub> + t<sub>3</sub>) / 3
        </p>
        <p>
          t<sub>сер</sub> = <Cell id="f_t_ser" /> с
        </p>

        <p>2. Визначте середню швидкість руху кульки:</p>
        <p>
          v<sub>сер</sub> = l / t<sub>сер</sub>
        </p>
        <p>
          v<sub>сер</sub> = <Cell id="f_v_ser" /> м/с
        </p>

        <p>Результати обчислень занесіть до таблиці.</p>
      </Section>

      <Section title="Аналіз експериментального дослідження та його результатів">
        <p>
          Проаналізувавши експеримент та його результати, зробіть висновок, у
          якому зазначте:
        </p>

        <p>1) який рух ви вивчали;</p>
        <Answer id="v1" rows={5} />

        <p>2) значення якої величини визначили;</p>
        <Answer id="v2" rows={5} />

        <p>3) які результати отримали;</p>
        <Answer id="v3" rows={5} />

        <p>4) які чинники вплинули на точність результатів.</p>
        <Answer id="v4" rows={5} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Продумайте і запишіть план проведення експерименту, мета якого —
          довести, що середня швидкість нерівномірного руху кульки похилим
          жолобом на всьому шляху відрізняється від середньої швидкості руху
          кульки на половині шляху.
        </p>
        <Answer id="v_creative_plan" rows={6} />

        <p>Поясніть, чому ці значення не збігаються.</p>
        <Answer id="v_creative_explanation" rows={5} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "average-speed-video",
  grade: 7,
  badge: "1.2",
  number: "№ 1",
  title: "Визначення середньої швидкості руху тіла. Варіант 2 (за відео)",
  goal: "дослідити нерівномірний рух тіла; виміряти середню швидкість руху тіла.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Середня швидкість (відео)",
  meta: {
    title:
      "Визначення середньої швидкості руху тіла (за відео) — лабораторна робота №1, варіант 2",
    description:
      "Перегляньте відео досліду з кулькою на похилому жолобі, запишіть дані до таблиці та визначте середню швидкість її руху.",
  },
  Content,
};

export default lab;
