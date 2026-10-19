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
import { Formula } from "@/components/formula";
import setupScheme from "@/assets/thread-pendulum-setup-scheme.png";
import type { LabDefinition } from "./types";

const OSCILLATIONS = 20;

function Content() {
  return (
    <LabForm sheetName="Нитяний маятник">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>
          1. Перед тим як виконувати роботу, переконайтеся, що ви знаєте
          відповіді на такі запитання.
        </p>
        <p>1) Що називають амплітудою коливань?</p>
        <Answer id="v_amplitude_def" rows={3} />

        <p>2) За якою формулою можна обчислити період коливань?</p>
        <Answer id="v_period_formula" rows={3} />

        <p>
          2. Закріпіть кульки на нитках так, щоб довжина отриманих маятників
          дорівнювала 1 м.
        </p>
      </Section>

      <Section title="Експеримент. Опрацювання результатів">
        <p>
          <em>Дотримуйтесь інструкції з безпеки.</em>
        </p>

        <p>
          1. Установіть на краю стола штатив. Біля його верхнього кінця
          закріпіть кільце й підвісьте до нього на нитці кульку меншої маси
          так, як показано на рисунку.
        </p>

        <Figure
          src={setupScheme}
          alt="Штатив із підвішеним на нитці маятником довжиною 1 м, під ним лінійка для вимірювання амплітуди"
          className="w-full max-w-xs mx-auto"
        />

        <p>2. Дослідіть залежність періоду коливань маятника від його амплітуди.</p>

        <p>
          1) (Дослід 1) Відхиливши маятник на відстань 2–3 см від положення
          рівноваги та відпустивши, виміряйте час, за який маятник виконає{" "}
          {OSCILLATIONS} коливань. Визначте період коливань.
        </p>
        <p>
          2) (Дослід 2) Повторіть дослід 1, збільшивши амплітуду коливань до
          5–6 см.
        </p>
        <p>3) Результати вимірювань і обчислень занесіть до табл. 1.</p>

        <p>
          <strong>Таблиця 1</strong>
        </p>
        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1_1" text="Номер досліду">
                Номер досліду
              </HeaderCell>
              <HeaderCell id="h1_2" text="Довжина нитки l, м">
                Довжина нитки l, м
              </HeaderCell>
              <HeaderCell id="h1_3" text="Амплітуда коливань A, см">
                Амплітуда коливань A, см
              </HeaderCell>
              <HeaderCell id="h1_4" text="Число коливань N">
                Число коливань N
              </HeaderCell>
              <HeaderCell id="h1_5" text="Час коливань t, с">
                Час коливань t, с
              </HeaderCell>
              <HeaderCell id="h1_6" text="Період коливань T, с">
                Період коливань T, с
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>1</Td>
              <Td>1</Td>
              <Td>
                <Cell id="t1_A1" />
              </Td>
              <Td>{OSCILLATIONS}</Td>
              <Td>
                <Cell id="t1_t1" />
              </Td>
              <Td>
                <Cell id="t1_T1" />
              </Td>
            </tr>
            <tr>
              <Td>2</Td>
              <Td>1</Td>
              <Td>
                <Cell id="t1_A2" />
              </Td>
              <Td>{OSCILLATIONS}</Td>
              <Td>
                <Cell id="t1_t2" />
              </Td>
              <Td>
                <Cell id="t1_T2" />
              </Td>
            </tr>
          </tbody>
        </LabTable>

        <p>3. Дослідіть залежність періоду коливань маятника від його маси.</p>

        <p>
          1) Перенесіть із табл. 1 до табл. 2 результати досліду 1. Занесіть
          до табл. 2 маси кульок.
        </p>
        <p>
          2) (Дослід 3) Повторіть дослід 1 для маятника більшої маси.
          Зверніть увагу: довжини маятників мають бути однаковими.
        </p>
        <p>3) Результати вимірювань і обчислень занесіть до табл. 2.</p>

        <p>
          <strong>Таблиця 2</strong>
        </p>
        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h2_1" text="Номер досліду">
                Номер досліду
              </HeaderCell>
              <HeaderCell id="h2_2" text="Довжина нитки l, м">
                Довжина нитки l, м
              </HeaderCell>
              <HeaderCell id="h2_3" text="Маса кульки m, кг">
                Маса кульки m, кг
              </HeaderCell>
              <HeaderCell id="h2_4" text="Число коливань N">
                Число коливань N
              </HeaderCell>
              <HeaderCell id="h2_5" text="Час коливань t, с">
                Час коливань t, с
              </HeaderCell>
              <HeaderCell id="h2_6" text="Період коливань T, с">
                Період коливань T, с
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>1</Td>
              <Td>1</Td>
              <Td>
                <Cell id="t2_m1" />
              </Td>
              <Td>{OSCILLATIONS}</Td>
              <Td>
                <Cell id="t2_t1" />
              </Td>
              <Td>
                <Cell id="t2_T1" />
              </Td>
            </tr>
            <tr>
              <Td>3</Td>
              <Td>1</Td>
              <Td>
                <Cell id="t2_m3" />
              </Td>
              <Td>{OSCILLATIONS}</Td>
              <Td>
                <Cell id="t2_t3" />
              </Td>
              <Td>
                <Cell id="t2_T3" />
              </Td>
            </tr>
          </tbody>
        </LabTable>

        <p>4. Дослідіть залежність періоду коливань маятника від його довжини.</p>

        <p>1) Перенесіть із табл. 1 до табл. 3 результати досліду 1.</p>
        <p>2) (Дослід 4) Повторіть дослід 1, зменшивши довжину маятника до 0,25 м.</p>
        <p>3) Результати вимірювань і обчислень занесіть до табл. 3.</p>

        <p>
          <strong>Таблиця 3</strong>
        </p>
        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h3_1" text="Номер досліду">
                Номер досліду
              </HeaderCell>
              <HeaderCell id="h3_2" text="Довжина нитки l, м">
                Довжина нитки l, м
              </HeaderCell>
              <HeaderCell id="h3_3" text="Число коливань N">
                Число коливань N
              </HeaderCell>
              <HeaderCell id="h3_4" text="Час коливань t, с">
                Час коливань t, с
              </HeaderCell>
              <HeaderCell id="h3_5" text="Період коливань T, с">
                Період коливань T, с
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>1</Td>
              <Td>1</Td>
              <Td>{OSCILLATIONS}</Td>
              <Td>
                <Cell id="t3_t1" />
              </Td>
              <Td>
                <Cell id="t3_T1" />
              </Td>
            </tr>
            <tr>
              <Td>4</Td>
              <Td>0,25</Td>
              <Td>{OSCILLATIONS}</Td>
              <Td>
                <Cell id="t3_t4" />
              </Td>
              <Td>
                <Cell id="t3_T4" />
              </Td>
            </tr>
          </tbody>
        </LabTable>

        <p>У кожній таблиці період коливань обчислюйте за формулою:</p>
        <Formula math="T = \dfrac{t}{N}" />
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>Проаналізувавши результати, зробіть висновок, у якому зазначте:</p>

        <p>1) які величини ви навчилися вимірювати;</p>
        <Answer id="v1" rows={4} />

        <p>2) які чинники вплинули на точність одержаних результатів;</p>
        <Answer id="v2" rows={4} />

        <p>
          3) чи залежить період коливань маятника від амплітуди коливань,
          маси тягарця, довжини нитки.
        </p>
        <Answer id="v3" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Не виконуючи вимірювань, визначте період коливань маятника
          довжиною 4 м, амплітуда коливань якого становить 10 см, а маса
          дорівнює 300 г. Відповідь обґрунтуйте.
        </p>
        <Answer id="v_creative" rows={6} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "thread-pendulum",
  grade: 7,
  badge: "3",
  number: "№ 3",
  title: "Дослідження коливань нитяного маятника",
  goal:
    "переконатися на досліді, що період коливань нитяного маятника не залежить від маси тягарця й амплітуди коливань, проте залежить від довжини нитки.",
  equipment:
    "дві невеличкі важкі кульки різних мас; дві міцні нерозтяжні нитки завдовжки 1,1 м; лінійка (мірна стрічка); штатив із муфтою та кільцем; секундомір.",
  sheetName: "Нитяний маятник",
  meta: {
    title: "Дослідження коливань нитяного маятника — лабораторна робота №3",
    description:
      "Дослідіть, як період коливань нитяного маятника залежить від амплітуди, маси тягарця та довжини нитки.",
  },
  Content,
};

export default lab;
