import {
  LabForm,
  StudentBlock,
  Answer,
  Cell,
  HeaderCell,
  LabTable,
  Td,
} from "@/components/lab/lab-form";
import { Figure, Section, Simulation } from "@/components/lab/lab-shell";
import { Formula } from "@/components/formula";
import peasRow from "@/assets/small-bodies-measurement-peas-row.png";
import threadRow from "@/assets/small-bodies-measurement-thread-row.png";
import type { LabDefinition } from "./types";

const EXPERIMENT_VIDEO = "https://www.youtube.com/embed/JSSBnOcujZ8";

const ROWS = [
  { id: "pea", label: "Горошина" },
  { id: "millet", label: "Пшоняне зернятко" },
  { id: "thread", label: "Нитка" },
];

function Content() {
  return (
    <LabForm sheetName="Вимірювання розмірів малих тіл (відео)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>Визначте ціну поділки шкали лінійки:</p>
        <p>
          Ціна поділки лінійки = <Cell id="ruler_division" /> мм
        </p>

        <p>
          У цьому варіанті роботи ви не проводите вимірювання самостійно, а
          переглядаєте відео з готовим дослідом. Уважно перегляньте відео нижче
          (за потреби ставте на паузу й переглядайте окремі моменти повторно),
          запишіть подані в ньому дані до таблиці та виконайте обчислення.
        </p>

        <Simulation src={EXPERIMENT_VIDEO} title="Відеоексперимент" />
      </Section>

      <Section title="Експеримент">
        <p>
          <em>
            Переглядаючи відео, заносьте результати вимірювань відразу до
            таблиці. Результати вимірювань діаметрів і товщини округліть до
            десятих.
          </em>
        </p>

        <p>
          1. Визначте методом рядів середнє значення діаметра горошини. Для
          вимірювання рядів скористайтеся зубочисткою. Для цього:
        </p>
        <p>1) Утворіть ряд (викладіть горошини впритул одне до одного).</p>

        <Figure
          src={peasRow}
          alt="Рис. 1. Ряд горошин, викладених впритул одна до одної, виміряний лінійкою"
          className="w-full max-w-md mx-auto"
        />

        <p>
          2) Виміряйте довжину ряду горошин: L = <Cell id="L_pea" /> мм
        </p>
        <p>
          3) Порахуйте кількість горошин у ряді: n = <Cell id="n_pea" />
        </p>
        <p>4) Знайдіть відношення d = L/n.</p>

        <p>
          2. Визначте методом рядів середнє значення діаметра пшоняного зернятка
          (по аналогії до попереднього).
        </p>
        <p>
          L = <Cell id="L_millet" /> мм&nbsp;&nbsp;&nbsp; n ={" "}
          <Cell id="n_millet" />
        </p>

        <p>3. Виміряйте методом рядів товщину нитки. Для цього:</p>
        <p>
          1) Утворіть ряд (намотайте нитку багато разів на стрижень для ручки
          таким чином, щоб витки були розташовані в один ряд і впритул одне до
          одного).
        </p>

        <Figure
          src={threadRow}
          alt="Рис. 2. Нитка, намотана в один щільний ряд витків на стрижень для ручки, виміряна лінійкою"
          className="w-full max-w-md mx-auto"
        />

        <p>
          2) Виміряйте довжину ряду нитки: L = <Cell id="L_thread" /> мм
        </p>
        <p>
          3) Порахуйте кількість витків у ряді: n = <Cell id="n_thread" />
        </p>
        <p>4) Знайдіть відношення d = L/n.</p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Номер досліду">
                Номер досліду
              </HeaderCell>
              <HeaderCell id="h2" text="Тіло">
                Тіло
              </HeaderCell>
              <HeaderCell id="h3" text="Довжина L ряду, мм">
                Довжина L ряду, мм
              </HeaderCell>
              <HeaderCell id="h4" text="Кількість n тіл (витків) у ряді">
                Кількість n тіл (витків) у ряді
              </HeaderCell>
              <HeaderCell id="h5" text="Діаметр (товщина) dвим, мм">
                Діаметр (товщина) d<sub>вим</sub>, мм
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <tr key={row.id}>
                <Td>{i + 1}</Td>
                <Td>{row.label}</Td>
                <Td>
                  <Cell id={`t_L_${row.id}`} />
                </Td>
                <Td>
                  <Cell id={`t_n_${row.id}`} />
                </Td>
                <Td>
                  <Cell id={`d_${row.id}`} />
                </Td>
              </tr>
            ))}
          </tbody>
        </LabTable>

        <p>Для кожного досліду діаметр (товщину) обчислюйте за формулою:</p>
        <Formula math="d_{\text{вим}} = \dfrac{L}{n}" />
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          Проаналізуйте хід і результати експерименту, відповівши на наведені
          нижче запитання, запишіть висновок.
        </p>

        <p>1) чого ви навчилися в ході виконання роботи;</p>
        <Answer id="v1" rows={4} />

        <p>2) які результати отримали;</p>
        <Answer id="v2" rows={4} />

        <p>3) як можна підвищити точність експерименту;</p>
        <Answer id="v3" rows={4} />

        <p>
          4) для чого можуть знадобитися навички, набуті в ході виконання
          роботи.
        </p>
        <Answer id="v4" rows={4} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "small-bodies-measurement-video",
  grade: 7,
  badge: "exp 1.2",
  number: "№ 1",
  title:
    "Вимірювання розмірів малих тіл різними способами. Варіант 2 (за відео)",
  goal: "визначити методом рядів діаметр горошини, діаметр пшоняного зернятка, товщину нитки; оцінити точність вимірювань.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Вимірювання розмірів малих тіл (відео)",
  meta: {
    title:
      "Вимірювання розмірів малих тіл (за відео) — експериментальна робота №1 (7 клас), варіант 2",
    description:
      "Перегляньте відео вимірювання методом рядів діаметра горошини, пшоняного зернятка та товщини нитки.",
  },
  Content,
};

export default lab;
