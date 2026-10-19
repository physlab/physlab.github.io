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
  "https://phet.colorado.edu/sims/html/balancing-act/latest/balancing-act_all.html";

function Content() {
  return (
    <LabForm sheetName="Рівновага важеля (симуляція)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>1. Перед виконанням роботи згадайте відповіді на такі запитання.</p>
        <p>1) Який механізм називають важелем і де застосовують важелі?</p>
        <Answer id="v_lever_def" rows={4} />

        <p>2) Що називають плечем сили?</p>
        <Answer id="v_arm_def" rows={3} />

        <p>3) Що таке момент сили?</p>
        <Answer id="v_torque_def" rows={3} />

        <p>
          2. У цьому варіанті роботи замість реального важеля
          використовується симуляція PhET <strong>Balancing Act</strong>.
          Відкрийте екран <strong>Balance Lab</strong> і увімкніть позначки{" "}
          <strong>Level</strong> (індикатор рівноваги) та{" "}
          <strong>Rulers</strong> (лінійки для вимірювання відстані від
          осі). Об&apos;єкти з відомою масою (цеглини, людські фігурки)
          можна ставити на будь-яку відстань від осі — саме вони
          відіграватимуть роль тягарців.
        </p>

        <Simulation src={SIMULATION_URL} title="PhET: Balancing Act" />
      </Section>

      <Section title="Експеримент">
        <p>
          <em>Результати вимірювань відразу заносьте до таблиці.</em>
        </p>

        <p>
          1. Поставте з одного боку від осі один об&apos;єкт відомої маси, з
          іншого боку — такий самий об&apos;єкт масою вдвічі більшою
          (наприклад, дві однакові цеглини, поставлені одна на одну).
        </p>
        <p>
          2. Пересуваючи об&apos;єкти, зрівноважте важіль (індикатор Level
          має показати горизонтальне положення).
        </p>
        <p>3. Виміряйте лінійками відстані d₁ і d₂ від осі до об&apos;єктів.</p>

        <p>
          4. Повторіть дослід, поставивши на одній половині важеля масу,
          що вдвічі більша за одиничну, а на іншій — масу, що втричі
          більша.
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Номер досліду">
                Номер досліду
              </HeaderCell>
              <HeaderCell id="h2" text="Проти год. стрілки: F1, Н">
                F<sub>1</sub> (проти год. стрілки), Н
              </HeaderCell>
              <HeaderCell id="h3" text="Проти год. стрілки: d1, м">
                d<sub>1</sub>, м
              </HeaderCell>
              <HeaderCell id="h4" text="Проти год. стрілки: M1, Н·м">
                M<sub>1</sub>, Н·м
              </HeaderCell>
              <HeaderCell id="h5" text="За год. стрілкою: F2, Н">
                F<sub>2</sub> (за год. стрілкою), Н
              </HeaderCell>
              <HeaderCell id="h6" text="За год. стрілкою: d2, м">
                d<sub>2</sub>, м
              </HeaderCell>
              <HeaderCell id="h7" text="За год. стрілкою: M2, Н·м">
                M<sub>2</sub>, Н·м
              </HeaderCell>
              <HeaderCell id="h_ratio_f" text="F1/F2">
                F<sub>1</sub>/F<sub>2</sub>
              </HeaderCell>
              <HeaderCell id="h_ratio_d" text="d2/d1">
                d<sub>2</sub>/d<sub>1</sub>
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {[1, 2].map((row) => (
              <tr key={row}>
                <Td>{row}</Td>
                <Td>
                  <Cell id={`F1_${row}`} />
                </Td>
                <Td>
                  <Cell id={`d1_${row}`} />
                </Td>
                <Td>
                  <Cell id={`M1_${row}`} />
                </Td>
                <Td>
                  <Cell id={`F2_${row}`} />
                </Td>
                <Td>
                  <Cell id={`d2_${row}`} />
                </Td>
                <Td>
                  <Cell id={`M2_${row}`} />
                </Td>
                <Td>
                  <Cell id={`ratioF_${row}`} />
                </Td>
                <Td>
                  <Cell id={`ratioD_${row}`} />
                </Td>
              </tr>
            ))}
          </tbody>
        </LabTable>

        <p>
          5. <strong>Пошук невідомої маси.</strong> Поставте праворуч від
          осі на відстані 12 см (0,12 м) об&apos;єкт масою, що втричі
          більша за одиничну. У симуляторі оберіть один із об&apos;єктів{" "}
          <strong>Mystery</strong> (невідомої маси) і поставте його на
          відстані 20 см (0,20 м) від осі з того самого боку. Пересуваючи
          відомі об&apos;єкти по інший бік осі (або підбираючи позицію),
          зрівноважте важіль і визначте невідому масу за умовою рівноваги.
        </p>
        <p>
          <em>
            Примітка: на відміну від фізичного варіанта, тут немає
            динамометра, тому замість вимірювання сили F₁ приладом ми
            знаходимо невідому масу розрахунком із умови рівноваги — це
            інший, але рівноцінний спосіб застосувати той самий принцип.
          </em>
        </p>

        <p>
          Маса тягарців праворуч (втричі більша) F<sub>2</sub> ={" "}
          <Cell id="d3_F2" /> Н&nbsp;&nbsp; d<sub>2</sub> = 0,12 м
        </p>
        <p>
          Розрахована сила невідомого об&apos;єкта F<sub>1</sub> ={" "}
          <Cell id="d3_F1" /> Н&nbsp;&nbsp; d<sub>1</sub> = 0,20 м
        </p>
        <p>
          M<sub>1</sub> = <Cell id="d3_M1" /> Н·м&nbsp;&nbsp; M
          <sub>2</sub> = <Cell id="d3_M2" /> Н·м
        </p>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>1. Для кожного досліду:</p>
        <p>1) знайдіть відношення сил F₁/F₂ і відношення плечей d₂/d₁;</p>
        <p>
          2) обчисліть момент M₁ сили, що повертає важіль проти ходу
          годинникової стрілки, і момент M₂ сили, що повертає важіль за
          ходом годинникової стрілки:
        </p>
        <Formula math="M = F \cdot d" />

        <p>2. Закінчіть заповнення таблиці.</p>
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>На підставі проведених дослідів порівняйте:</p>

        <p>
          1) відношення сил, що діють на важіль, і відношення його плечей:
        </p>
        <Formula math="\dfrac{F_1}{F_2} \; ? \; \dfrac{d_2}{d_1}" />
        <Answer id="v_compare_ratios" rows={4} />

        <p>
          2) момент сили, що повертає важіль за ходом годинникової стрілки,
          з моментом сили, що повертає важіль проти ходу годинникової
          стрілки.
        </p>
        <Answer id="v_compare_moments" rows={4} />

        <p>Зробіть висновок, у якому:</p>
        <p>
          1) зазначте, чи підтвердили проведені вами експерименти умову
          рівноваги важеля;
        </p>
        <Answer id="v1" rows={4} />

        <p>2) проаналізуйте, які чинники вплинули на точність вимірювань.</p>
        <Answer id="v2" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Поставте два об&apos;єкти різної відомої маси на різних
          відстанях зліва від осі, а праворуч — об&apos;єкт{" "}
          <strong>Mystery</strong>. Зрівноважте важіль і визначте моменти
          сил, що діють на нього. Знайдіть суму моментів сил, що повертають
          важіль за ходом годинникової стрілки, і суму моментів сил, що
          повертають важіль проти ходу годинникової стрілки.
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="ct1" text="Сила">
                Сила
              </HeaderCell>
              <HeaderCell id="ct2" text="F, Н">
                F, Н
              </HeaderCell>
              <HeaderCell id="ct3" text="d, м">
                d, м
              </HeaderCell>
              <HeaderCell id="ct4" text="M, Н·м">
                M, Н·м
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {["1", "2", "3"].map((id) => (
              <tr key={id}>
                <Td>
                  F<sub>{id}</sub>
                </Td>
                <Td>
                  <Cell id={`ct_F${id}`} />
                </Td>
                <Td>
                  <Cell id={`ct_d${id}`} />
                </Td>
                <Td>
                  <Cell id={`ct_M${id}`} />
                </Td>
              </tr>
            ))}
          </tbody>
        </LabTable>

        <p>
          Сума моментів за ходом годинникової стрілки ={" "}
          <Cell id="ct_sum_cw" /> Н·м
        </p>
        <p>
          Сума моментів проти ходу годинникової стрілки ={" "}
          <Cell id="ct_sum_ccw" /> Н·м
        </p>

        <p>Зробіть висновок про умову рівноваги важеля в цьому експерименті:</p>
        <Answer id="v_creative1" rows={5} />

        <p>
          <em>
            Другу частину творчого завдання (визначення маси лінійки за
            допомогою олівця й монет) симуляція не відтворює — виконайте
            її фізично, якщо є можливість, скориставшись описом у
            фізичному варіанті цієї роботи.
          </em>
        </p>
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "lever-equilibrium-simulation",
  grade: 8,
  badge: "1.3",
  number: "№ 1",
  title: "Вивчення умови рівноваги важеля. Варіант 3 (симуляція)",
  goal:
    "перевірити дослідним шляхом, яким має бути співвідношення сил і їхніх плечей, щоб важіль перебував у рівновазі.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Рівновага важеля (симуляція)",
  meta: {
    title:
      "Вивчення умови рівноваги важеля (симуляція) — лабораторна робота №1 (8 клас), варіант 3",
    description:
      "Перевірте умову рівноваги важеля за допомогою симуляції PhET Balancing Act: співвідношення сил, плечей і моментів сил.",
  },
  Content,
};

export default lab;
