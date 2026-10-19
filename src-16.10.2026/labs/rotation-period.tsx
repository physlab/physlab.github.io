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
import techniqueScheme from "@/assets/rotation-period-technique-scheme.png";
import type { LabDefinition } from "./types";
import { Formula } from "@/components/formula";

const REVOLUTIONS = 10;

function Content() {
  return (
    <LabForm sheetName="Період обертання">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>Переконайтеся, що ви знаєте відповіді на такі запитання.</p>
        <p>1) Який рух називають рівномірним рухом по колу?</p>
        <Answer id="v_circular_motion_def" rows={3} />

        <p>
          2) За якою формулою обчислюють період рівномірного руху тіла по колу?
          обертову частоту?
        </p>
        <Answer id="v_formulas" rows={3} />

        <p>
          Підготуйте обладнання. Все необхідне легко знайти вдома: як тіло
          підійде ґудзик, ключ або невелика кулька; секундоміром може слугувати
          секундомір у смартфоні або на годиннику.
        </p>
        <p>
          1. Намалюйте на аркуші паперу коло радіусом 15 см (наприклад, за
          допомогою нитки-циркуля: закріпіть один кінець нитки в центрі аркуша,
          відміряйте 15 см і, натягнувши нитку, обведіть коло олівцем; або
          скористайтеся циркулем чи будь-яким круглим предметом відповідного
          розміру).
        </p>
        <p>
          2. Прикріпіть тіло (ґудзик, ключ, кульку тощо) до нитки завдовжки
          50–60 см. На вільному кінці нитки зробіть петлю.
        </p>
      </Section>

      <Section title="Експеримент">
        <p>
          <em>Дотримуйтесь інструкції з безпеки.</em>
        </p>

        <p>
          1. Візьміть за петлю нитку з тілом. Розташуйте руку над центром
          намальованого кола. Примусьте тіло рухатися так, щоб траєкторія його
          руху збігалася з колом.
        </p>

        <Figure
          src={techniqueScheme}
          alt="Обертання тіла на нитці над намальованим колом"
          className="w-full max-w-xs mx-auto"
        />

        <p>2. Виміряйте радіус кола, по якому рухається тіло:</p>
        <p>
          R = <Cell id="R" /> м
        </p>

        <p>3. Виміряйте час t, за який тіло здійснює {REVOLUTIONS} обертів.</p>

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
              <Td>{REVOLUTIONS}</Td>
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
          виявити залежність періоду обертання та обертової частоти
          виготовленого вами пристрою від довжини нитки.
        </p>
        <Answer id="v_plan" rows={6} />

        <p>
          Проведіть цей експеримент, вимірявши період обертання для кількох
          різних довжин нитки:
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h_c1" text="№">
                №
              </HeaderCell>
              <HeaderCell id="h_c2" text="Довжина нитки L, м">
                Довжина нитки L, м
              </HeaderCell>
              <HeaderCell id="h_c3" text="Період обертання T, с">
                Період обертання T, с
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((row) => (
              <tr key={row}>
                <Td>{row}</Td>
                <Td>
                  <Cell id={`cL${row}`} />
                </Td>
                <Td>
                  <Cell id={`cT${row}`} />
                </Td>
              </tr>
            ))}
          </tbody>
        </LabTable>

        <p>Зробіть висновок:</p>
        <Answer id="v_creative_conclusion" rows={5} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "rotation-period",
  grade: 7,
  badge: "2",
  number: "№ 2",
  title: "Вимірювання періоду обертання та обертової частоти",
  goal: "виміряти період обертання та обертову частоту тіла під час його рівномірного руху по колу.",
  equipment:
    "невелике тіло (ґудзик, ключ, кулька тощо); аркуш із зображенням кола радіусом 15 см; нитка завдовжки 50–60 см; секундомір (можна скористатися секундоміром у смартфоні або на годиннику); лінійка.",
  sheetName: "Період обертання",
  meta: {
    title:
      "Вимірювання періоду обертання та обертової частоти — лабораторна робота №2",
    description:
      "Виміряйте період обертання та обертову частоту тіла, яке рухається рівномірно по колу на нитці.",
  },
  Content,
};

export default lab;
