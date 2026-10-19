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
import setupScheme from "@/assets/inclined-plane-scheme.png";
import type { LabDefinition } from "./types";

const EXPERIMENT_VIDEO =
  "https://www.youtube.com/embed/nY46cZ7QzRQ?list=PLB2vQ0tl7CxYA3XYTwxIvD8I97xW9uu0K";

function Content() {
  return (
    <LabForm sheetName="ККД похилої площини (відео)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>1. Перш ніж виконувати роботу, згадайте відповіді на такі запитання.</p>
        <p>1) Як визначити ККД механізму?</p>
        <Answer id="v_efficiency_def" rows={4} />

        <p>2) Чому ККД будь-якого механізму завжди менший від 100 %?</p>
        <Answer id="v_efficiency_why" rows={4} />

        <p>2. Визначте ціни поділок шкал вимірювальних приладів.</p>
        <p>
          Ціна поділки мірної стрічки = <Cell id="tape_division" /> м
        </p>
        <p>
          Ціна поділки динамометра = <Cell id="dynamometer_division" /> Н
        </p>

        <p>
          3. У цьому варіанті роботи ви не проводите вимірювання самостійно, а
          переглядаєте відео з готовим дослідом. Установку показано на
          рисунку нижче.
        </p>

        <Figure
          src={setupScheme}
          alt="Схема установки: похила площина, закріплена на штативі, брусок з динамометром і мірна стрічка"
          className="w-64 mx-auto"
        />

        <p>
          Уважно перегляньте відео нижче (за потреби ставте на паузу й
          переглядайте окремі моменти повторно), запишіть подані в ньому дані
          до таблиці та виконайте обчислення.
        </p>

        <Simulation src={EXPERIMENT_VIDEO} title="Відеоексперимент" />
      </Section>

      <Section title="Експеримент">
        <p>
          <em>
            Переглядаючи відео, заносьте результати вимірювань і обчислень
            відразу до таблиці.
          </em>
        </p>

        <p>1. Запишіть довжину l і висоту h похилої площини.</p>
        <p>
          l = <Cell id="l_value" /> м&nbsp;&nbsp; h = <Cell id="h_value" /> м
        </p>

        <p>2. Запишіть вагу P₁ бруска, визначену за допомогою динамометра.</p>
        <p>
          P₁ = <Cell id="P1_value" /> Н
        </p>

        <p>
          3. У відео брусок рівномірно пересувають угору похилою площиною.
          Запишіть силу тяги F<sub>тяги 1</sub>, яку показує динамометр.
        </p>

        <p>4. Запишіть вагу одного тягарця, визначену за допомогою динамометра.</p>
        <p>
          Вага одного тягарця = <Cell id="weight_one" /> Н
        </p>

        <p>
          5. У відео дослід (див. п. 3) повторюють ще тричі, розмістивши на
          бруску спочатку один, потім два, а потім три тягарці. Не змінюючи
          кута нахилу площини, запишіть відповідні дані.
        </p>
        <p>
          <em>
            Зверніть увагу! У кожному із цих дослідів, щоб знайти вагу тіла,
            необхідно до ваги бруска додати вагу тягарця (тягарців).
          </em>
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Номер досліду">
                Номер досліду
              </HeaderCell>
              <HeaderCell id="h2" text="Вага тіла, P, Н">
                Вага тіла
                <br />
                (P, Н)
              </HeaderCell>
              <HeaderCell id="h3" text="Висота похилої площини, h, м">
                Висота
                <br />
                (h, м)
              </HeaderCell>
              <HeaderCell id="h4" text="Довжина похилої площини, l, м">
                Довжина
                <br />
                (l, м)
              </HeaderCell>
              <HeaderCell id="h5" text="Повна робота, Aповна, Дж">
                A<sub>повна</sub>, Дж
              </HeaderCell>
              <HeaderCell id="h6" text="Корисна робота, Aкор, Дж">
                A<sub>кор</sub>, Дж
              </HeaderCell>
              <HeaderCell id="h7" text="Сила тяги, Fтяги, Н">
                F<sub>тяги</sub>, Н
              </HeaderCell>
              <HeaderCell id="h8" text="Виграш у силі, P/Fтяги">
                P / F<sub>тяги</sub>
              </HeaderCell>
              <HeaderCell id="h9" text="ККД, η, %">
                η, %
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4].map((row) => (
              <tr key={row}>
                <Td>{row}</Td>
                <Td>
                  <Cell id={`P_${row}`} />
                </Td>
                <Td>
                  <Cell id={`h_${row}`} />
                </Td>
                <Td>
                  <Cell id={`l_${row}`} />
                </Td>
                <Td>
                  <Cell id={`Afull_${row}`} />
                </Td>
                <Td>
                  <Cell id={`Auseful_${row}`} />
                </Td>
                <Td>
                  <Cell id={`Fpull_${row}`} />
                </Td>
                <Td>
                  <Cell id={`gain_${row}`} />
                </Td>
                <Td>
                  <Cell id={`eff_${row}`} />
                </Td>
              </tr>
            ))}
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>Для кожного досліду обчисліть:</p>
        <p>1) повну роботу:</p>
        <Formula math="A_{повна} = F_{тяги} \cdot l" />

        <p>2) корисну роботу (P — вага тіла):</p>
        <Formula math="A_{кор} = P \cdot h" />

        <p>3) виграш у силі, який дає похила площина:</p>
        <Formula math="\dfrac{P}{F_{тяги}}" />

        <p>4) ККД похилої площини:</p>
        <Formula math="\eta = \dfrac{A_{кор}}{A_{повна}} \cdot 100\% = \dfrac{P \cdot h}{F_{тяги} \cdot l} \cdot 100\%" />

        <p>Закінчіть заповнення таблиці.</p>
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          1) Для кожного досліду порівняйте значення сили тяги (F<sub>тяги</sub>)
          зі значенням ваги тіла (P) і зробіть висновок про виграш у силі, який
          дає похила площина.
        </p>
        <Answer id="v_compare_force_weight" rows={4} />

        <p>
          2) Порівняйте одержані значення ККД і зробіть висновок, чи залежить
          ККД від ваги тіла, яке піднімають похилою площиною.
        </p>
        <Answer id="v_compare_efficiency" rows={4} />

        <p>Зробіть висновок, у якому:</p>
        <p>
          1) зазначте, чи виявили ви виграш у силі та в чому корисна робота
          похилої площини завжди менша від повної;
        </p>
        <Answer id="v1" rows={4} />

        <p>2) проаналізуйте, які чинники вплинули на точність вимірювань.</p>
        <Answer id="v2" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          З’ясуйте, як залежить ККД похилої площини від кута її нахилу. Якщо у
          відео показано досліди для різних кутів нахилу, запишіть отримані
          дані нижче; якщо ні — виконайте цю частину роботи самостійно, якщо є
          можливість. Чому, на вашу думку, ККД змінюється?
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="ct1" text="Кут нахилу">
                Кут нахилу
              </HeaderCell>
              <HeaderCell id="ct2" text="l, м">
                l, м
              </HeaderCell>
              <HeaderCell id="ct3" text="h, м">
                h, м
              </HeaderCell>
              <HeaderCell id="ct4" text="Fтяги, Н">
                F<sub>тяги</sub>, Н
              </HeaderCell>
              <HeaderCell id="ct5" text="ККД, %">
                η, %
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {["1", "2", "3"].map((id) => (
              <tr key={id}>
                <Td>
                  <Cell id={`ct_angle${id}`} />
                </Td>
                <Td>
                  <Cell id={`ct_l${id}`} />
                </Td>
                <Td>
                  <Cell id={`ct_h${id}`} />
                </Td>
                <Td>
                  <Cell id={`ct_F${id}`} />
                </Td>
                <Td>
                  <Cell id={`ct_eff${id}`} />
                </Td>
              </tr>
            ))}
          </tbody>
        </LabTable>

        <Answer id="v_creative1" rows={5} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "inclined-plane-efficiency-video",
  grade: 8,
  badge: "2.2",
  number: "№ 2",
  title: "Визначення ККД похилої площини. Варіант 2 (за відео)",
  goal:
    "переконатися на досліді, що корисна робота, виконана за допомогою похилої площини, менша від повної роботи; визначити ККД похилої площини.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "ККД похилої площини (відео)",
  meta: {
    title:
      "Визначення ККД похилої площини (за відео) — лабораторна робота №2 (8 клас), варіант 2",
    description:
      "Перегляньте відео досліду з похилою площиною, запишіть дані до таблиці та визначте ККД похилої площини.",
  },
  Content,
};

export default lab;
