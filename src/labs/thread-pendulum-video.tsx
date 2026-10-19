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

const EXPERIMENT_VIDEO = "https://www.youtube.com/embed/zAhV-z7Tga0";

function Content() {
  return (
    <LabForm sheetName="Нитяний маятник (відео)">
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
          2. У цьому варіанті роботи ви не проводите експеримент самостійно, а
          переглядаєте відео з готовими дослідами. Уважно перегляньте відео
          нижче (за потреби ставте на паузу й переглядайте окремі моменти
          повторно), запишіть подані в ньому дані (довжину нитки, амплітуду,
          масу кульки, кількість коливань і час) до таблиць та виконайте
          обчислення.
        </p>
      </Section>

      <Section title="Експеримент. Опрацювання результатів">
        <p>
          <em>
            Переглядаючи відео, заносьте результати вимірювань відразу до
            таблиць.
          </em>
        </p>

        <Simulation src={EXPERIMENT_VIDEO} title="Відеоексперимент" />

        <p>
          1. У відео маятник підвішено на штативі. Досліджуються залежності
          періоду коливань маятника від амплітуди, маси тягарця та довжини
          нитки.
        </p>

        <p>2. Залежність періоду коливань маятника від його амплітуди.</p>
        <p>
          1) (Дослід 1) Запишіть довжину маятника, амплітуду, кількість
          коливань N та час t, за який маятник їх виконує.
        </p>
        <p>
          2) (Дослід 2) Запишіть ті самі величини для досліду з більшою
          амплітудою коливань.
        </p>
        <p>3) Визначте період коливань і занесіть результати до табл. 1.</p>

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
              <Td><Cell id="t1_l1" /></Td>
              <Td><Cell id="t1_A1" /></Td>
              <Td><Cell id="t1_1_N" /></Td>
              <Td><Cell id="t1_t1" /></Td>
              <Td><Cell id="t1_T1" /></Td>
            </tr>
            <tr>
              <Td>2</Td>
              <Td><Cell id="t1_l2" /></Td>
              <Td><Cell id="t1_A2" /></Td>
              <Td><Cell id="t1_2_N" /></Td>
              <Td><Cell id="t1_t2" /></Td>
              <Td><Cell id="t1_T2" /></Td>
            </tr>
          </tbody>
        </LabTable>

        <p>3. Залежність періоду коливань маятника від його маси.</p>
        <p>
          1) Перенесіть із табл. 1 до табл. 2 результати досліду 1. Запишіть
          масу кульки в досліді 1.
        </p>
        <p>
          2) (Дослід 3) Запишіть дані досліду для маятника більшої маси
          (довжини маятників однакові).
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
              <Td><Cell id="t2_l1" /></Td>
              <Td><Cell id="t2_m1" /></Td>
              <Td><Cell id="t2_1_N" /></Td>
              <Td><Cell id="t2_t1" /></Td>
              <Td><Cell id="t2_T1" /></Td>
            </tr>
            <tr>
              <Td>3</Td>
              <Td><Cell id="t2_l3" /></Td>
              <Td><Cell id="t2_m3" /></Td>
              <Td><Cell id="t2_3_N" /></Td>
              <Td><Cell id="t2_t3" /></Td>
              <Td><Cell id="t2_T3" /></Td>
            </tr>
          </tbody>
        </LabTable>

        <p>4. Залежність періоду коливань маятника від його довжини.</p>
        <p>1) Перенесіть із табл. 1 до табл. 3 результати досліду 1.</p>
        <p>
          2) (Дослід 4) Запишіть дані досліду, у якому довжину маятника
          зменшено.
        </p>
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
              <Td><Cell id="t3_l1" /></Td>
              <Td><Cell id="t3_1_N" /></Td>
              <Td><Cell id="t3_t1" /></Td>
              <Td><Cell id="t3_T1" /></Td>
            </tr>
            <tr>
              <Td>4</Td>
              <Td><Cell id="t3_l4" /></Td>
              <Td><Cell id="t3_4_N" /></Td>
              <Td><Cell id="t3_t4" /></Td>
              <Td><Cell id="t3_T4" /></Td>
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
  slug: "thread-pendulum-video",
  grade: 7,
  badge: "3.2",
  number: "№ 3",
  title: "Дослідження коливань нитяного маятника. Варіант 2 (за відео)",
  goal:
    "переконатися на досліді, що період коливань нитяного маятника не залежить від маси тягарця й амплітуди коливань, проте залежить від довжини нитки.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Нитяний маятник (відео)",
  meta: {
    title:
      "Дослідження коливань нитяного маятника (за відео) — лабораторна робота №3, варіант 2",
    description:
      "Перегляньте відео досліду з нитяним маятником, запишіть дані до таблиць та з'ясуйте, як період коливань залежить від амплітуди, маси тягарця та довжини нитки.",
  },
  Content,
};

export default lab;
