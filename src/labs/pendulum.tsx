import {
  LabForm,
  StudentBlock,
  Answer,
  Cell,
  HeaderCell,
  LabTable,
  Td,
} from "@/components/lab/lab-form";
import { Figure, Note, Section } from "@/components/lab/lab-shell";
import setup from "@/assets/pendulum-setup.png";
import scheme from "@/assets/pendulum-scheme.png";
import f1 from "@/assets/pendulum-f1.png";
import f2 from "@/assets/pendulum-f2.png";
import f3 from "@/assets/pendulum-f3.png";
import f4 from "@/assets/pendulum-f4.png";
import type { LabDefinition } from "./types";

function Content() {
  return (
    <LabForm sheetName="Дослідження коливань нитяного маятника">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>
          Виготовте маятник (див. рисунок). Нитка маятника має бути досить довгою — кулька повинна
          майже торкатися підлоги.
        </p>
        <p>Замість підвішування до штативу, ви можете прив'язати нитку у проємі дверей тощо.</p>
        <div className="flex flex-wrap items-start gap-4">
          <Figure src={setup} alt="Маятник, підвішений до штатива" className="w-40" />
          <Figure src={scheme} alt="Схема нитяного маятника" className="w-40" />
        </div>
      </Section>

      <Section title="Експеримент">
        <Note>
          Суворо дотримуйтесь інструкції з безпеки. Результати вимірювань і обчислень відразу
          заносьте до таблиці.
        </Note>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Виміряйте довжину маятника (відстань від точки підвісу до центра кульки).</li>
          <li>Відхиліть маятник від положення рівноваги на 5–8 см і відпустіть.</li>
          <li>Виміряйте інтервал часу, за який маятник здійснює 20 коливань.</li>
          <li>
            Повторіть дослід ще тричі, останнього разу (дослід 4) зменшивши довжину маятника
            вдвічі.
          </li>
        </ol>
        <Note>
          Цілу частину числа від дробової відокремлюйте крапкою або комою (один з варіантів
          спрацює).
        </Note>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="№" rowSpan={2}>
                №
              </HeaderCell>
              <HeaderCell id="h2" text="Довжина нитки l, м" rowSpan={2}>
                Довжина нитки <i>l</i>, м
              </HeaderCell>
              <HeaderCell id="h3" text="Кількість коливань N" rowSpan={2}>
                Кількість коливань <i>N</i>
              </HeaderCell>
              <HeaderCell id="h4" text="Час коливань" colSpan={2}>
                Час коливань
              </HeaderCell>
              <HeaderCell id="h5" text="Період коливань T, с" rowSpan={2}>
                Період коливань <i>T</i>, с
              </HeaderCell>
            </tr>
            <tr>
              <HeaderCell id="h6" text="t, c">
                <i>t</i>, c
              </HeaderCell>
              <HeaderCell id="h7" text="t сер, c">
                <i>t</i>
                <sub>сер</sub>, c
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>1</Td>
              <Td rowSpan={3}>
                <Cell id="r1c2" type="number" />
              </Td>
              <Td rowSpan={3}>
                <Cell id="r1c3" type="number" />
              </Td>
              <Td>
                <Cell id="r1c4" type="number" />
              </Td>
              <Td rowSpan={3}>
                <Cell id="r1c5" type="number" />
              </Td>
              <Td rowSpan={3}>
                <Cell id="r1c6" type="number" />
              </Td>
            </tr>
            <tr>
              <Td>2</Td>
              <Td>
                <Cell id="r2c4" type="number" />
              </Td>
            </tr>
            <tr>
              <Td>3</Td>
              <Td>
                <Cell id="r3c4" type="number" />
              </Td>
            </tr>
            <tr>
              <Td>4</Td>
              <Td>
                <Cell id="r4c2" type="number" />
              </Td>
              <Td>
                <Cell id="r4c3" type="number" />
              </Td>
              <Td>
                <Cell id="r4c4" type="number" />
              </Td>
              <Td>
                <Cell id="r4c5" type="number" />
              </Td>
              <Td>
                <Cell id="r4c6" type="number" />
              </Td>
            </tr>
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p className="font-semibold italic">Частина 1. Вимірювання прискорення вільного падіння</p>
        <p>1. За даними дослідів 1–3 визначте:</p>
        <p>
          1) середній час 20 коливань: <i>t</i>
          <sub>сер</sub> = (<i>t</i>
          <sub>1</sub> + <i>t</i>
          <sub>2</sub> + <i>t</i>
          <sub>3</sub>) / 3
        </p>
        <Answer id="sol_tser" rows={2} />
        <p>
          2) період коливань маятника: <i>T</i> = <i>t</i>
          <sub>сер</sub> / <i>N</i>
        </p>
        <Answer id="sol_Tser" rows={2} />
        <div className="flex flex-wrap items-center gap-3">
          <span>3) прискорення вільного падіння:</span>
          <Figure src={f1} alt="Формула прискорення вільного падіння" className="w-48" />
        </div>
        <Answer id="sol_g" rows={2} />
        <p>
          2. Оцініть відносну похибку експерименту, порівнявши значення прискорення вільного
          падіння, отриманого в ході експерименту (<i>g</i>
          <sub>вим</sub>), із табличним значенням (<i>g</i>
          <sub>таб</sub> = 9,8 м/с<sup>2</sup>), за формулою:
        </p>
        <Figure src={f2} alt="Формула відносної похибки" className="w-64" />
        <Answer id="sol_eps" rows={2} />

        <p className="pt-4 font-semibold italic">Частина 2. Перевірка формули Гюйґенса</p>
        <p>1. Для досліду 4 обчисліть період коливань маятника у два способи:</p>
        <p>
          1) скориставшись означенням періоду: <i>T</i> = <i>t</i> / <i>N</i>
        </p>
        <Answer id="sol_T_ch2" rows={2} />
        <p>
          2) скориставшись формулою Гюйґенса (вважайте, що <i>g</i> = 9,8 м/с<sup>2</sup>):
        </p>
        <Figure src={f3} alt="Формула Гюйґенса" className="w-64" />
        <Answer id="sol_T_Gug" rows={2} />
        <p>2. Оцініть відносну похибку експерименту:</p>
        <Figure src={f4} alt="Формула відносної похибки для формули Гюйґенса" className="w-64" />
        <Answer id="sol_eps_Gug" rows={2} />
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>Проаналізуйте експеримент і його результати. У висновку зазначте:</p>
        <p>1) величини, які ви вимірювали;</p>
        <Answer id="v1" rows={6} />
        <p>2) чи залежать значення цих величин від довжини нитки (якщо залежать, то як);</p>
        <Answer id="v2" rows={6} />
        <p>3) причини похибки.</p>
        <Answer id="v3" rows={6} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "pendulum",
  grade: 10,
  badge: "5",
  number: "№ 5",
  title: "Дослідження коливань нитяного маятника, вимірювання прискорення вільного падіння",
  goal: "виготовити нитяний маятник, визначити за його допомогою прискорення вільного падіння; переконатися в справедливості формули Гюйґенса.",
  equipment:
    "штатив із муфтою та лапкою, металева кулька (або тягарець) із петелькою, нитка завдовжки 1,5–2 м, вимірювальна стрічка, секундомір.",
  sheetName: "Дослідження коливань нитяного маятника",
  meta: {
    title: "Коливання нитяного маятника — лабораторна робота №5",
    description:
      "Виміряйте прискорення вільного падіння за коливаннями нитяного маятника та перевірте формулу Гюйґенса.",
  },
  Content,
};

export default lab;
