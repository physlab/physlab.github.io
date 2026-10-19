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
import genericScheme from "@/assets/lever-equilibrium-generic-scheme.png";
import trial2Scheme from "@/assets/lever-equilibrium-trial2.png";
import trial3Scheme from "@/assets/lever-equilibrium-trial3-dynamometer.png";
import creativeScheme from "@/assets/lever-equilibrium-creative-scheme.png";
import type { LabDefinition } from "./types";

function Content() {
  return (
    <LabForm sheetName="Рівновага важеля">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>1. Перед виконанням роботи згадайте відповіді на такі запитання.</p>
        <p>1) Який механізм називають важелем і де застосовують важелі?</p>
        <Answer id="v_lever_def" rows={4} />

        <p>2) Що називають плечем сили?</p>
        <Answer id="v_arm_def" rows={3} />

        <p>3) Що таке момент сили?</p>
        <Answer id="v_torque_def" rows={3} />

        <p>2. Визначте ціни поділок шкал вимірювальних приладів.</p>
        <p>
          Ціна поділки лінійки = <Cell id="ruler_division" /> м
        </p>
        <p>
          Ціна поділки динамометра = <Cell id="dynamometer_division" /> Н
        </p>

        <p>
          3. Обчисліть силу, що діє на важіль з боку одного тягарця.
          Урахуйте, що ця сила дорівнює вазі тягарця.
        </p>
        <p>
          F<sub>тягарець</sub> = <Cell id="F_weight_one" /> Н
        </p>

        <p>
          4. Закріпіть на лапці штатива важіль і зрівноважте його за
          допомогою регулювальних гайок.
        </p>
      </Section>

      <Section title="Експеримент">
        <p>
          <em>
            Дотримуйтесь інструкції з безпеки. Результати вимірювань відразу
            заносьте до таблиці.
          </em>
        </p>

        <p>
          1. Підвісьте з одного боку від осі обертання важеля один тягарець,
          з іншого боку — два тягарці.
        </p>
        <p>2. Пересуваючи тягарці, зрівноважте важіль.</p>
        <p>
          3. Виміряйте за допомогою лінійки плечі d₁ і d₂ відповідних сил F₁
          і F₂.
        </p>

        <Figure
          src={genericScheme}
          alt="Схема важеля з силами F1 і F2, прикладеними по обидва боки від осі обертання"
          className="w-48 mx-auto"
        />

        <p>
          4. Повторіть дослід, підвісивши на одній половині важеля два
          тягарці, а на іншій — три.
        </p>

        <Figure
          src={trial2Scheme}
          alt="Важіль із двома тягарцями з одного боку та трьома тягарцями з іншого боку осі обертання"
          className="w-48 mx-auto"
        />

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
          5. Підвісьте праворуч від осі обертання на відстані 12 см три
          тягарці. Визначте за допомогою динамометра, яку силу F₁ потрібно
          прикласти в точці, що лежить на відстані 8 см правіше від точки
          підвішення тягарців, щоб утримувати важіль у рівновазі.
        </p>

        <Figure
          src={trial3Scheme}
          alt="Три тягарці підвішені праворуч від осі обертання, динамометр прикладає силу F1 у точці далі праворуч"
          className="w-48 mx-auto"
        />

        <p>
          Сила тягарців F<sub>2</sub> = <Cell id="d3_F2" /> Н&nbsp;&nbsp;
          Плече d<sub>2</sub> = 0,12 м
        </p>
        <p>
          Виміряна сила F<sub>1</sub> = <Cell id="d3_F1" /> Н&nbsp;&nbsp;
          Плече d<sub>1</sub> = 0,20 м
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

      <Section title="Творчі завдання">
        <p>1. Зберіть пристрій, як показано на рисунку.</p>

        <Figure
          src={creativeScheme}
          alt="Пристрій для творчого завдання: два тягарці на різних відстанях зліва, динамометр справа"
          className="w-48 mx-auto"
        />

        <p>
          Виконайте необхідні вимірювання та визначте моменти сил, що
          діють на важіль. Знайдіть суму моментів сил, що повертають важіль
          за ходом годинникової стрілки, і суму моментів сил, що повертають
          важіль проти ходу годинникової стрілки.
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
          2. За допомогою олівця та кількох монет виміряйте масу лінійки.
          Вважайте, що сила тяжіння, яка діє на лінійку, прикладена до її
          середини. Відомості щодо мас монет, використаних в експерименті,
          знайдіть в інтернеті.
        </p>
        <p>
          Опишіть, як ви розташували олівець (вісь обертання) і монети,
          та наведіть отриманий результат:
        </p>
        <Answer id="v_creative2" rows={6} />
        <p>
          Маса лінійки = <Cell id="ruler_mass" /> г
        </p>
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "lever-equilibrium",
  grade: 8,
  badge: "1.1",
  number: "№ 1",
  title: "Вивчення умови рівноваги важеля",
  goal:
    "перевірити дослідним шляхом, яким має бути співвідношення сил і їхніх плечей, щоб важіль перебував у рівновазі.",
  equipment:
    "важіль; штатив із муфтою та лапкою; набір тягарців масою по 100 г; динамометр; лінійка.",
  sheetName: "Рівновага важеля",
  meta: {
    title: "Вивчення умови рівноваги важеля — лабораторна робота №1 (8 клас)",
    description:
      "Перевірте дослідним шляхом умову рівноваги важеля: співвідношення сил і плечей та моментів сил.",
  },
  Content,
};

export default lab;
