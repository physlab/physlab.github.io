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
import { Formula } from "@/components/formula";
import type { LabDefinition } from "./types";

const OSCILLATIONS = 20;

const SIMULATION_URL =
  "https://phet.colorado.edu/sims/html/pendulum-lab/latest/pendulum-lab_all.html?locale=uk";

function Content() {
  return (
    <LabForm sheetName="Нитяний маятник (симуляція)">
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
          2. У цьому варіанті роботи замість реального маятника на штативі
          використовується симуляція PhET <strong>«Лабораторія маятника»</strong>{" "}
          (Pendulum Lab). Відкрийте вкладку <strong>Intro</strong> (Вступ).
          Повзунками Length (довжина) та Mass (маса) можна змінювати довжину
          нитки й масу кульки, а перетягуючи кульку мишею або пальцем, —
          задавати амплітуду коливань (відхилення від положення рівноваги в
          градусах). Для вимірювання часу скористайтеся секундоміром
          (Stopwatch), а для вимірювання довжини та кута — лінійкою (Ruler) і
          кутоміром (Protractor), якщо вони є в симуляції; якщо в симуляції
          є тертя, вимкніть його.
        </p>

        <Simulation src={SIMULATION_URL} title="PhET: Pendulum Lab" />

        <p>
          <strong>ВАЖЛИВО!!!</strong> Зробіть знімок екрана симуляції та
          додайте його через секцію &quot;Знімок симуляції&quot;.
        </p>
      </Section>

      <Section title="Експеримент. Опрацювання результатів">
        <p>
          <em>Результати вимірювань і обчислень відразу заносьте до таблиць.</em>
        </p>

        <p>
          1. У симуляції встановіть довжину маятника 1,00 м і оберіть малу
          масу кульки (наприклад, 0,20 кг). Це маятник для дослідів 1 і 2.
        </p>

        <p>2. Дослідіть залежність періоду коливань маятника від його амплітуди.</p>

        <p>
          1) (Дослід 1) Відхиліть маятник на невеликий кут (приблизно 5°)
          від положення рівноваги та відпустіть. Виміряйте час, за який
          маятник виконає {OSCILLATIONS} коливань. Визначте період коливань.
        </p>
        <p>
          2) (Дослід 2) Повторіть дослід 1, збільшивши амплітуду коливань
          (відхиліть маятник приблизно на 15°).
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
              <HeaderCell id="h1_3" text="Амплітуда коливань A, °">
                Амплітуда коливань A, °
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
              <Td><Cell id="t1_A1" /></Td>
              <Td>{OSCILLATIONS}</Td>
              <Td><Cell id="t1_t1" /></Td>
              <Td><Cell id="t1_T1" /></Td>
            </tr>
            <tr>
              <Td>2</Td>
              <Td>1</Td>
              <Td><Cell id="t1_A2" /></Td>
              <Td>{OSCILLATIONS}</Td>
              <Td><Cell id="t1_t2" /></Td>
              <Td><Cell id="t1_T2" /></Td>
            </tr>
          </tbody>
        </LabTable>

        <p>3. Дослідіть залежність періоду коливань маятника від його маси.</p>

        <p>
          1) Перенесіть із табл. 1 до табл. 2 результати досліду 1. Занесіть
          до табл. 2 масу кульки (у кілограмах).
        </p>
        <p>
          2) (Дослід 3) Повторіть дослід 1 для маятника більшої маси
          (наприклад, 1,00 кг), змінивши повзунок Mass. Зверніть увагу:
          довжина маятника має бути такою самою, а амплітуда — такою ж, як у
          досліді 1.
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
              <Td><Cell id="t2_m1" /></Td>
              <Td>{OSCILLATIONS}</Td>
              <Td><Cell id="t2_t1" /></Td>
              <Td><Cell id="t2_T1" /></Td>
            </tr>
            <tr>
              <Td>3</Td>
              <Td>1</Td>
              <Td><Cell id="t2_m3" /></Td>
              <Td>{OSCILLATIONS}</Td>
              <Td><Cell id="t2_t3" /></Td>
              <Td><Cell id="t2_T3" /></Td>
            </tr>
          </tbody>
        </LabTable>

        <p>4. Дослідіть залежність періоду коливань маятника від його довжини.</p>

        <p>1) Перенесіть із табл. 1 до табл. 3 результати досліду 1.</p>
        <p>
          2) (Дослід 4) Повторіть дослід 1, зменшивши довжину маятника до
          0,25 м (повзунок Length). Амплітуда та маса кульки — як у досліді 1.
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
              <Td>1</Td>
              <Td>{OSCILLATIONS}</Td>
              <Td><Cell id="t3_t1" /></Td>
              <Td><Cell id="t3_T1" /></Td>
            </tr>
            <tr>
              <Td>4</Td>
              <Td>0,25</Td>
              <Td>{OSCILLATIONS}</Td>
              <Td><Cell id="t3_t4" /></Td>
              <Td><Cell id="t3_T4" /></Td>
            </tr>
          </tbody>
        </LabTable>

        <p>У кожній таблиці період коливань обчислюйте за формулою:</p>
        <Formula math="T = \dfrac{t}{N}" />
      </Section>

      <Section title="Знімок симуляції">
        <ImageCanvas
          label="Прикріпіть знімок екрана симуляції"
          height={400}
          minHeight={250}
          maxHeight={700}
          maxImages={6}
        />
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
  slug: "thread-pendulum-simulation",
  grade: 7,
  badge: "3.3",
  number: "№ 3",
  title: "Дослідження коливань нитяного маятника. Варіант 3 (симуляція)",
  goal:
    "переконатися на досліді, що період коливань нитяного маятника не залежить від маси тягарця й амплітуди коливань, проте залежить від довжини нитки.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Нитяний маятник (симуляція)",
  meta: {
    title:
      "Дослідження коливань нитяного маятника (симуляція) — лабораторна робота №3, варіант 3",
    description:
      "У симуляції PhET Pendulum Lab дослідіть, як період коливань нитяного маятника залежить від амплітуди, маси тягарця та довжини нитки.",
  },
  Content,
};

export default lab;
