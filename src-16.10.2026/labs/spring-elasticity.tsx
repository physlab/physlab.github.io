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
import { Figure, Section } from "@/components/lab/lab-shell";
import { Formula } from "@/components/formula";
import undeformedScheme from "@/assets/spring-elasticity-undeformed.png";
import deformedScheme from "@/assets/spring-elasticity-deformed.png";
import type { LabDefinition } from "./types";

const TRIALS = [
  { n: 1, m: 100, F: 1 },
  { n: 2, m: 200, F: 2 },
  { n: 3, m: 300, F: 3 },
  { n: 4, m: 400, F: 4 },
];

function Content() {
  return (
    <LabForm sheetName="Пружні властивості шнура">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>
          1. Перед тим як виконувати роботу, переконайтеся, що ви знаєте
          відповіді на такі запитання.
        </p>
        <p>1) Що таке деформація? Які існують види деформації?</p>
        <Answer id="v_deformation_def" rows={4} />

        <p>2) Які деформації називають пружними? пластичними?</p>
        <Answer id="v_elastic_plastic_def" rows={4} />

        <p>3) За якою формулою розраховують силу пружності?</p>
        <Answer id="v_elastic_force_formula" rows={3} />

        <p>2. Визначте ціну поділки шкали лінійки.</p>
        <p>
          Ціна поділки = <Cell id="ruler_division" /> см
        </p>

        <p>3. Зберіть пристрій.</p>
        <p>
          1) На кінцях гумового шнура зав&apos;яжіть петлі так, щоб відстань між
          вузликами становила близько 8 см.
        </p>
        <p>2) Підвісьте шнур за одну з петель на лапку штатива (рис. 1).</p>

        <Figure
          src={undeformedScheme}
          alt="Рис. 1. Недеформований гумовий шнур, закріплений на штативі, довжина l0"
          className="w-full max-w-xs mx-auto"
        />
      </Section>

      <Section title="Експеримент">
        <p>
          <em>
            Дотримуйтесь інструкції з безпеки. Результати вимірювань та
            обчислень відразу заносьте до таблиці.
          </em>
        </p>

        <p>
          1. Вирівняйте шнур, не розтягуючи його. Виміряйте відстань l₀ між
          вузликами — довжину недеформованого шнура (див. рис. 1).
        </p>
        <p>
          l<sub>0</sub> = <Cell id="l0" /> см
        </p>

        <p>
          2. Підвісьте до шнура тягарець масою 100 г. Виміряйте відстань l між
          вузликами — довжину деформованого шнура (рис. 2). Підвішений до шнура
          тягарець масою 100 г розтягує шнур із силою приблизно 1 Н.
        </p>

        <Figure
          src={deformedScheme}
          alt="Рис. 2. Деформований гумовий шнур з підвішеним тягарцем, довжина l"
          className="w-full max-w-xs mx-auto"
        />

        <p>
          3. Зніміть тягарець. З&apos;ясуйте, чи повернувся нижній вузлик у
          вихідне положення, тобто чи була деформація шнура пружною.
        </p>

        <p>
          4. Послідовно підвішуйте до шнура спочатку 2, потім 3, потім 4
          тягарці, кожного разу вимірюючи довжину деформованого шнура.
        </p>
        <p>
          <strong>Зверніть увагу:</strong> після кожного досліду необхідно
          знімати тягарці та з&apos;ясовувати, чи повернувся нижній вузлик шнура
          у вихідне положення. Якщо деформація шнура перестане бути пружною
          (після зняття тягарців шнур залишиться деформованим), досліди
          припиніть.
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Номер досліду">
                Номер досліду
              </HeaderCell>
              <HeaderCell id="h2" text="Маса тягарця m, г">
                Маса тягарця m, г
              </HeaderCell>
              <HeaderCell id="h3" text="Сила пружності Fпруж, Н">
                Сила пружності F<sub>пруж</sub>, Н
              </HeaderCell>
              <HeaderCell id="h4" text="Довжина l, см">
                Довжина l, см
              </HeaderCell>
              <HeaderCell id="h5" text="Видовження x, м">
                Видовження x, м
              </HeaderCell>
              <HeaderCell id="h6" text="Відношення Fпруж/x, Н/м">
                Відношення F<sub>пруж</sub>/x, Н/м
              </HeaderCell>
              <HeaderCell id="h7" text="Деформація пружна? (так/ні)">
                Деформація пружна? (так/ні)
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {TRIALS.map((trial, i) => (
              <tr key={trial.n}>
                <Td>{trial.n}</Td>
                <Td>{trial.m}</Td>
                <Td>{trial.F}</Td>
                <Td>
                  <Cell id={`l${trial.n}`} />
                </Td>
                <Td>
                  <Cell id={`x${trial.n}`} />
                </Td>
                <Td>
                  <Cell id={`ratio${trial.n}`} />
                </Td>
                <Td>
                  <Cell id={`elastic${trial.n}`} />
                </Td>
              </tr>
            ))}
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>Для кожного досліду:</p>

        <p>1) визначте видовження шнура:</p>
        <Formula math="x = l - l_0" />
        <p>(одержані результати подайте в метрах);</p>

        <p>2) знайдіть відношення:</p>
        <Formula math="\dfrac{F_{\text{пруж}}}{x}" />
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
          Порівняйте відношення F<sub>пруж</sub>/x, одержані в дослідах. Зробіть
          висновок, у якому зазначте:
        </p>

        <p>
          1) чи впливає навантаження на те, якою буде деформація (пружною або
          пластичною);
        </p>
        <Answer id="v1" rows={4} />

        <p>2) чи залежить (у разі пружної деформації) жорсткість шнура</p>
        <Formula math="k = \dfrac{F_{\text{пруж}}}{x}" />
        <p>від його видовження.</p>
        <Answer id="v2" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Чи зміниться відношення F<sub>пруж</sub>/x, одержане в роботі, якщо
          шнур замінити на такий самий, але вдвічі довший? вдвічі товщий?
        </p>
        <Answer id="v_creative_prediction" rows={5} />

        <p>
          Перевірте результати своїх міркувань експериментально. Опишіть, що ви
          зробили та який результат отримали.
        </p>
        <Answer id="v_creative_verification" rows={5} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "spring-elasticity",
  grade: 7,
  badge: "6.1",
  number: "№ 6",
  title: "Дослідження пружних властивостей тіл",
  goal: "дослідити пружні властивості гумового шнура під час деформації розтягнення.",
  equipment:
    "штатив із муфтою та лапкою; гумовий шнур завдовжки 15–20 см; 4 тягарці масою 100 г кожен; учнівська лінійка.",
  sheetName: "Пружні властивості шнура",
  meta: {
    title: "Дослідження пружних властивостей тіл — лабораторна робота №6",
    description:
      "Дослідіть пружні властивості гумового шнура під час деформації розтягнення та порівняйте відношення сили пружності до видовження.",
  },
  Content,
};

export default lab;
