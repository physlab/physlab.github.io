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
import setupScheme from "@/assets/average-speed-setup-scheme.png";
import type { LabDefinition } from "./types";

const SCHEME_VIDEO = "https://www.youtube.com/embed/WLStaT3cTtI";
const EXPERIMENT_VIDEO = "https://www.youtube.com/embed/yZGDF5CEYR8";

function Content() {
  return (
    <LabForm sheetName="Середня швидкість">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>1. Переконайтеся, що ви знаєте відповіді на такі запитання.</p>
        <p>1) Який рух називають нерівномірним?</p>
        <Answer id="v_uneven_motion" rows={3} />

        <p>2) Як обчислюють середню швидкість руху тіла?</p>
        <Answer id="v_avg_speed_def" rows={3} />

        <p>2. Підготуйте обладнання.</p>
        <p>
          1) Закріпіть жолоб у лапці штатива. Опустіть лапку, розташувавши жолоб
          під невеликим кутом до горизонту.
        </p>
        <p>2) У верхній частині жолоба зробіть позначку крейдою.</p>

        <Figure
          src={setupScheme}
          alt="Схема установки: жолоб під кутом на штативі, кулька, вимірювальна стрічка, металевий циліндр і секундомір"
          className="w-full max-w-lg mx-auto"
        />

        <p>Відео: як розмістити установку (стіл, жолоб, штатив):</p>
        <Simulation src={SCHEME_VIDEO} title="Схема установки" />

        <p>
          <strong>ВАЖЛИВО!!!</strong> Сфотографуйте вашу установку та додайте
          фото через секцію &quot;Фото установки&quot;.
        </p>
      </Section>

      <Section title="Експеримент">
        <p>
          <em>
            Дотримуйтесь інструкції з безпеки. Результати вимірювань відразу
            заносьте до таблиці.
          </em>
        </p>

        <p>1. Розташуйте металевий циліндр у нижній частині жолоба.</p>
        <p>
          2. Виміряйте відстань l від позначки до циліндра (ця відстань дорівнює
          шляху, який долатиме кулька, рухаючись уздовж жолоба).
        </p>
        <p>
          3. Розташуйте кульку навпроти позначки, відпустіть кульку, не
          штовхаючи її, та виміряйте час t<sub>1</sub>, за який кулька
          скочується (час від початку руху кульки до моменту її удару об
          металевий циліндр).
        </p>
        <p>4. Повторіть дослід іще двічі.</p>

        <p>
          Відео: як провести експеримент та вимірювання якщо у вас немає
          необхідного обладнання:
        </p>
        <Simulation src={EXPERIMENT_VIDEO} title="Проведення експерименту" />

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

      <Section title="Фото установки">
        <ImageCanvas
          label="Прикріпіть фото установки"
          height={400}
          minHeight={250}
          maxHeight={700}
          maxImages={6}
        />
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
  slug: "average-speed",
  grade: 7,
  badge: "1.1",
  number: "№ 1",
  title: "Визначення середньої швидкості руху тіла",
  goal: "дослідити нерівномірний рух тіла; виміряти середню швидкість руху тіла.",
  equipment:
    "секундомір; вимірювальна стрічка; жолоб завдовжки 1–1,5 м; кулька; штатив із муфтою та лапкою; металевий циліндр (або інший предмет для припинення руху кульки по жолобу); шматочок крейди.",
  sheetName: "Середня швидкість",
  meta: {
    title: "Визначення середньої швидкості руху тіла — лабораторна робота №1",
    description:
      "Дослідіть нерівномірний рух кульки похилим жолобом та виміряйте середню швидкість її руху.",
  },
  Content,
};

export default lab;
