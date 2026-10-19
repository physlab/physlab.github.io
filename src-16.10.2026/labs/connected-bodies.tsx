import {
  LabForm,
  StudentBlock,
  Answer,
  Cell,
  HeaderCell,
  LabTable,
  Td,
} from "@/components/lab/lab-form";
import { Figure, Section } from "@/components/lab/lab-shell";
import experimentScheme from "@/assets/connected-bodies-experiment-scheme.png";
import accelerationFormula from "@/assets/connected-bodies-acceleration-formula.png";
import frictionFormula from "@/assets/connected-bodies-friction-formula.png";
import errorFormula from "@/assets/connected-bodies-error-formula.png";
import creativeTask from "@/assets/connected-bodies-creative-task.png";
import { ConnectedBodiesSimulation } from "@/components/lab/connected-bodies-simulation";
import type { LabDefinition } from "./types";

function Content() {
  return (
    <LabForm sheetName="Дослідження руху зв'язаних тіл">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>
          Уважно вивчіть схему установки для проведення лабораторної роботи та дайте відповіді на
          запитання:
        </p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Які сили діють на брусок під час проведення досліду?</li>
          <li>Які сили діють на тягарець під час проведення досліду?</li>
          <li>
            Що буде з бруском після початку досліду (перебуватиме у стані спокою, рухатиметься
            рівномірно, рухатиметься рівноприскорено), та від чого це залежить?
          </li>
        </ol>
        <Answer id="qw_1" rows={6} />
      </Section>

      <Section title="Експеримент">
        <ConnectedBodiesSimulation />

        <p>2. Ознайомтеся з установкою для проведення експерименту.</p>
        <p>
          3. Запишіть до таблиці значення мас бруска <i>m</i>
          <sub>1</sub> та тягарця <i>m</i>
          <sub>2</sub>
        </p>
        <p>
          4. Виміряйте висоту, на яку опуститься тягарець після запуску імітації. Для цього
          використайте «лінійку», яку можна перетягувати. Запишіть отримане значення H до
          таблиці.
        </p>

        <Figure src={experimentScheme} alt="Схема експерименту" className="w-full max-w-lg" />

        <p>
          5. Запустіть імітацію кнопкою Пуск, одночасно увімкнувши секундомір. Після того, як
          брусок перестане рухатися, вимкніть секундомір. Запишіть отримане значення часу руху до
          таблиці.
        </p>
        <p>6. Повторіть дослід ще 2 рази, щоразу записуючи до таблиці значення часу t.</p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="№">
                №
              </HeaderCell>
              <HeaderCell id="h2" text="Маса бруска m1, кг">
                Маса бруска <i>m</i>
                <sub>1</sub>, кг
              </HeaderCell>
              <HeaderCell id="h3" text="Маса тягарця m2, кг">
                Маса тягарця <i>m</i>
                <sub>2</sub>, кг
              </HeaderCell>
              <HeaderCell id="h4" text="Висота падіння тягарця H, м">
                Висота падіння тягарця <i>H</i>, м
              </HeaderCell>
              <HeaderCell id="h5" text="Час падіння t, с">
                Час падіння <i>t</i>, с
              </HeaderCell>
              <HeaderCell id="h6" text="Час падіння tсер, с">
                Час падіння <i>t</i>
                <sub>сер</sub>, с
              </HeaderCell>
              <HeaderCell id="h7" text="Прискорення тягарця aсер, м/с²">
                Прискорення тягарця <i>a</i>
                <sub>сер</sub>, м/с<sup>2</sup>
              </HeaderCell>
              <HeaderCell id="h8" text="Коефіцієнт тертя ковзання μсер">
                Коефіцієнт тертя ковзання <i>μ</i>
                <sub>сер</sub>
              </HeaderCell>
              <HeaderCell id="h9" text="Відносна похибка εμ, %">
                Відносна похибка <i>ε</i>
                <sub>μ</sub>, %
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((row) => (
              <tr key={row}>
                <Td>{row}</Td>
                {row === 1 && (
                  <>
                    <Td rowSpan={3}>
                      <Cell id="r1c2" />
                    </Td>
                    <Td rowSpan={3}>
                      <Cell id="r1c3" />
                    </Td>
                    <Td rowSpan={3}>
                      <Cell id="r1c4" />
                    </Td>
                  </>
                )}
                <Td>
                  <Cell id={`r${row}c5`} />
                </Td>
                {row === 1 && (
                  <>
                    <Td rowSpan={3}>
                      <Cell id="r1c6" />
                    </Td>
                    <Td rowSpan={3}>
                      <Cell id="r1c7" />
                    </Td>
                    <Td rowSpan={3}>
                      <Cell id="r1c8" />
                    </Td>
                    <Td rowSpan={3}>
                      <Cell id="r1c9" />
                    </Td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>
          1. Визначте середнє значення часу t<sub>сер</sub>
        </p>
        <p>
          2. Визначте середнє значення прискорення тіла a<sub>сер</sub>, використавши формулу:
        </p>
        <Figure src={accelerationFormula} alt="Формула прискорення" className="w-full max-w-sm" />

        <p>
          3. Визначте середнє значення коефіцієнта тертя ковзання µ<sub>сер</sub>, використавши
          формулу:
        </p>
        <Figure src={frictionFormula} alt="Формула коефіцієнта тертя" className="w-full max-w-sm" />
        <p>та запишіть отримане значення до таблиці.</p>

        <p>
          4. Визначте відносну похибку обчислення коефіцієнта тертя ковзання ε, використавши
          формулу:
        </p>
        <Figure src={errorFormula} alt="Формула похибки" className="w-full max-w-sm" />
        <p>та запишіть отримане значення до таблиці.</p>
        <p>
          Табличне значення візьміть µ<sub>табл</sub> = 0,25
        </p>
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>Проаналізуйте експеримент і його результати. Сформулюйте висновок, у якому зазначте:</p>

        <p>1) величину, яку ви вимірювали та які потім обчислили;</p>
        <Answer id="v1" rows={6} />

        <p>2) отримані результати;</p>
        <Answer id="v2" rows={6} />

        <p>3) причини похибки.</p>
        <Answer id="v3" rows={6} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Запишіть план проведення експерименту щодо визначення прискорення вільного падіння з
          використанням установки, зображеної на рисунку. За можливості проведіть експеримент.
        </p>
        <Figure src={creativeTask} alt="Схема для творчого завдання" className="w-full max-w-lg" />
        <Answer id="tvorche1" rows={6} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "connected-bodies",
  grade: 10,
  badge: "3",
  number: "№ 3",
  title: "Дослідження руху зв'язаних тіл",
  goal: "визначити коефіцієнт тертя ковзання дерева по дереву.",
  equipment: "комп'ютер або смартфон, комп'ютерна програма для моделювання, секундомір.",
  sheetName: "Дослідження руху зв'язаних тіл",
  meta: {
    title: "Дослідження руху зв'язаних тіл — лабораторна робота №3",
    description:
      "Визначте коефіцієнт тертя ковзання дерева по дереву у віртуальній лабораторії та заповніть онлайн-бланк лабораторної роботи.",
  },
  Content,
};

export default lab;
