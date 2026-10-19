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

const SIMULATION_URL =
  "https://phet.colorado.edu/sims/cheerpj/motion-series/latest/motion-series.html?simulation=ramp-forces-and-motion&locale=uk";

function Content() {
  return (
    <LabForm sheetName="ККД похилої площини (симуляція)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>1. Перед виконанням роботи згадайте відповіді на такі запитання.</p>
        <p>1) Як визначити ККД механізму?</p>
        <Answer id="v_efficiency_def" rows={4} />

        <p>2) Чому ККД будь-якого механізму завжди менший від 100 %?</p>
        <Answer id="v_efficiency_why" rows={4} />

        <p>
          2. У цьому варіанті роботи замість реальної похилої площини
          використовується симуляція PhET <strong>«Похила площина: сили
          та рух»</strong>. Відкрийте вкладку <strong>Introduction</strong>{" "}
          (Вступ). Оберіть предмет із випадаючого списку внизу, увімкніть
          відображення значень сили та лінійку (Ruler), щоб вимірювати
          довжину похилої площини. У правій панелі керування встановіть кут
          нахилу площини та вимкніть тертя (Friction — None), щоб умови
          нагадували роботу з гладеньким бруском.
        </p>

        <Simulation
          src={SIMULATION_URL}
          title="PhET: Ramp — Forces and Motion"
        />

        <p>
          Ціна поділки лінійки (Ruler) у симуляції = <Cell id="tape_division" /> м
        </p>
      </Section>

      <Section title="Експеримент">
        <p>
          <em>Результати вимірювань і обчислень відразу заносьте до таблиці.</em>
        </p>

        <p>
          1. Встановіть кут нахилу площини й не змінюйте його протягом усього
          досліду. Виміряйте за допомогою лінійки довжину l і висоту h
          похилої площини (висоту можна обчислити або зчитати з висотоміра
          симуляції).
        </p>
        <p>
          l = <Cell id="l_value" /> м&nbsp;&nbsp; h = <Cell id="h_value" /> м
        </p>

        <p>
          2. Зчитайте із симуляції вагу P₁ обраного предмета (масу m₁,
          помножену на прискорення вільного падіння g = 9,8 м/с²).
        </p>
        <p>
          P₁ = <Cell id="P1_value" /> Н
        </p>

        <p>
          3. Прикладіть до предмета силу (Applied Force), яка рівномірно
          пересуває його вгору похилою площиною зі сталою швидкістю. Зчитайте
          значення прикладеної сили F<sub>тяги 1</sub> у панелі керування або
          на графіку сил.
        </p>

        <p>
          4. Оберіть у симуляції предмет, маса якого приблизно відповідає
          масі одного тягарця (наприклад, невеликий об&apos;єкт), і зчитайте
          його вагу.
        </p>
        <p>
          Вага «одного тягарця» = <Cell id="weight_one" /> Н
        </p>

        <p>
          5. Не змінюючи кута нахилу площини, повторіть дослід (див. п. 3) ще
          тричі, щоразу збільшуючи масу предмета (додаючи «тягарці»): оберіть
          важчі об&apos;єкти зі списку або скористайтеся полем введення маси,
          якщо воно доступне.
        </p>
        <p>
          <em>
            Примітка: на відміну від фізичного варіанта, тут немає реального
            динамометра й тягарців, тому масу тіла та прикладену силу ви
            зчитуєте безпосередньо з панелі керування симуляції — це інший,
            але рівноцінний спосіб застосувати той самий принцип.
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
          Увімкніть у симуляції тертя (Friction) та встановіть інший кут
          нахилу площини. З’ясуйте, як залежить ККД похилої площини від кута
          її нахилу. Чому, на вашу думку, ККД змінюється?
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
  slug: "inclined-plane-efficiency-simulation",
  grade: 8,
  badge: "2.3",
  number: "№ 2",
  title: "Визначення ККД похилої площини. Варіант 3 (симуляція)",
  goal:
    "переконатися на досліді, що корисна робота, виконана за допомогою похилої площини, менша від повної роботи; визначити ККД похилої площини.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "ККД похилої площини (симуляція)",
  meta: {
    title:
      "Визначення ККД похилої площини (симуляція) — лабораторна робота №2 (8 клас), варіант 3",
    description:
      "Перевірте за допомогою симуляції PhET Ramp: Forces and Motion, що корисна робота на похилій площині менша від повної, та визначте її ККД.",
  },
  Content,
};

export default lab;
