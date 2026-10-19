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
import { Section } from "@/components/lab/lab-shell";
import { Formula } from "@/components/formula";
import { DensityBench } from "@/components/lab/density-bench";
import type { LabDefinition } from "./types";

const ROWS = [
  { id: "solid", label: "Тверде тіло" },
  { id: "liquid", label: "Рідина" },
];

// Довідкова таблиця густин (речовини, які можуть траплятися у віртуальній роботі)
const DENSITY_TABLE = [
  { name: "Алюміній", kind: "тверде тіло", rho: 2700 },
  { name: "Сталь", kind: "тверде тіло", rho: 7800 },
  { name: "Латунь", kind: "тверде тіло", rho: 8500 },
  { name: "Мідь", kind: "тверде тіло", rho: 8900 },
  { name: "Спирт", kind: "рідина", rho: 800 },
  { name: "Олія соняшникова", kind: "рідина", rho: 930 },
  { name: "Вода", kind: "рідина", rho: 1000 },
  { name: "Молоко", kind: "рідина", rho: 1030 },
  { name: "Гліцерин", kind: "рідина", rho: 1260 },
];

function Content() {
  return (
    <LabForm sheetName="Густина речовини (симуляція)">
      <StudentBlock />

      <Section title="Підготовка до експерименту">
        <p>
          У цьому варіанті роботи замість реального обладнання ви працюєте з
          віртуальною лабораторією, у якій є три «робочі місця» (вкладки):
        </p>
        <p>
          • <strong>Терези</strong> — важільні терези з набором гир і
          клаптиками паперу (правила зважування — як у лабораторній роботі
          про вимірювання мас);
        </p>
        <p>
          • <strong>Мензурки</strong> — мензурка A з водою (для вимірювання
          об&apos;єму твердого тіла) та мензурка B (для вимірювання об&apos;єму
          рідини);
        </p>
        <p>
          • <strong>Відливна посудина</strong> — для виконання творчого
          завдання.
        </p>
        <p>
          Усі предмети перетягуються мишею (або пальцем на сенсорному
          екрані). Тіло та рідина в кожному запуску випадкові й наперед
          невідомі.
        </p>

        <p>
          <strong>Таблиця густин</strong> (для визначення речовин):
        </p>
        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="dt1" text="Речовина">
                Речовина
              </HeaderCell>
              <HeaderCell id="dt2" text="Агрегатний стан">
                Агрегатний стан
              </HeaderCell>
              <HeaderCell id="dt3" text="Густина ρ, кг/м³">
                Густина ρ, кг/м<sup>3</sup>
              </HeaderCell>
              <HeaderCell id="dt4" text="Густина ρ, г/см³">
                Густина ρ, г/см<sup>3</sup>
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {DENSITY_TABLE.map((row) => (
              <tr key={row.name}>
                <Td>{row.name}</Td>
                <Td>{row.kind}</Td>
                <Td>{row.rho}</Td>
                <Td>{(row.rho / 1000).toFixed(2).replace(".", ",")}</Td>
              </tr>
            ))}
          </tbody>
        </LabTable>
      </Section>

      <Section title="Експеримент">
        <p>
          <em>
            Результати вимірювань і обчислень відразу заносьте до таблиці.
          </em>
        </p>

        <DensityBench />

        <p>
          <strong>Тверде тіло.</strong>
        </p>
        <p>
          1. На вкладці «Терези» виміряйте масу твердого тіла (кнопка
          «Прибрати все з терезів» очищає шальки; не забувайте зрівноважувати
          порожні шальки клаптиками паперу).
        </p>
        <p>
          2. На вкладці «Мензурки» визначте початковий об&apos;єм води V
          <sub>1</sub> у мензурці A. Перетягніть тіло в мензурку A та визначте
          новий об&apos;єм V<sub>2</sub>. Об&apos;єм тіла знайдіть за
          різницею рівнів води: V = V<sub>2</sub> − V<sub>1</sub> (1 мл =
          1 см³).
        </p>
        <p>
          V<sub>1</sub> = <Cell id="V1_water" /> мл&nbsp;&nbsp; V
          <sub>2</sub> = <Cell id="V2_water" /> мл
        </p>

        <p>
          <strong>Рідина.</strong>
        </p>
        <p>
          3. На вкладці «Терези» виміряйте масу склянки з досліджуваною
          рідиною.
        </p>
        <p>
          m<sub>1</sub> = <Cell id="m_glass_liquid" /> г
        </p>
        <p>
          4. На вкладці «Мензурки» перетягніть склянку з рідиною на мензурку B
          — рідина перелиється. Визначте об&apos;єм рідини.
        </p>
        <p>
          5. Поверніться на вкладку «Терези» й виміряйте масу порожньої
          склянки. Обчисліть масу рідини.
        </p>
        <p>
          m<sub>2</sub> = <Cell id="m_glass_empty" /> г&nbsp;&nbsp; m
          <sub>рідини</sub> = m<sub>1</sub> − m<sub>2</sub> ={" "}
          <Cell id="m_liquid_calc" /> г
        </p>

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Досліджуване тіло або рідина">
                Досліджуване тіло або рідина
              </HeaderCell>
              <HeaderCell id="h2" text="Маса m, г">
                Маса m, г
              </HeaderCell>
              <HeaderCell id="h3" text="Об'єм V, см³">
                Об&apos;єм V, см<sup>3</sup>
              </HeaderCell>
              <HeaderCell id="h4" text="Густина ρ, г/см³">
                Густина ρ, г/см<sup>3</sup>
              </HeaderCell>
              <HeaderCell id="h5" text="Густина ρ, кг/м³">
                Густина ρ, кг/м<sup>3</sup>
              </HeaderCell>
              <HeaderCell id="h6" text="Речовина">
                Речовина
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.id}>
                <Td>{row.label}</Td>
                <Td>
                  <Cell id={`m_${row.id}`} />
                </Td>
                <Td>
                  <Cell id={`V_${row.id}`} />
                </Td>
                <Td>
                  <Cell id={`rho_gcm3_${row.id}`} />
                </Td>
                <Td>
                  <Cell id={`rho_kgm3_${row.id}`} />
                </Td>
                <Td>
                  <Cell id={`substance_${row.id}`} />
                </Td>
              </tr>
            ))}
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>
          1. Визначте густину речовини, з якої виготовлено тверде тіло, та
          густину досліджуваної рідини:
        </p>
        <Formula math="\rho = \dfrac{m}{V}" />

        <p>
          2. Користуючись таблицею густин, визначте речовини, які досліджено,
          і запишіть їх до таблиці.
        </p>
      </Section>

      <Section title="Знімок симуляції">
        <ImageCanvas
          label="Прикріпіть скриншоти симуляції"
          height={400}
          minHeight={250}
          maxHeight={700}
          maxImages={6}
        />
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>Зробіть висновок, у якому зазначте:</p>

        <p>
          1) яку фізичну величину та за допомогою яких приладів ви вимірювали;
        </p>
        <Answer id="v1" rows={4} />

        <p>2) які чинники могли вплинути на точність результатів.</p>
        <Answer id="v2" rows={4} />
      </Section>

      <Section title="Творче завдання">
        <p>
          Запропонуйте способи (теоретичний та експериментальний), за допомогою
          яких можна знайти масу води, що виллється з відливної посудини, якщо
          в неї повільно занурити алюмінієвий кубик. Скористайтеся віртуальним
          обладнанням на вкладці «Відливна посудина» (відливна посудина з
          водою, склянка-збирач, алюмінієвий кубик із відомим ребром) та
          терезами.
        </p>

        <p>Теоретичний спосіб:</p>
        <Answer id="v_theoretical" rows={5} />
        <p>
          Об&apos;єм кубика V = <Cell id="cube_volume" /> см³&nbsp;&nbsp;
          Маса води (розрахунок) = <Cell id="mass_theory" /> г
        </p>

        <p>Експериментальний спосіб:</p>
        <Answer id="v_experimental" rows={5} />
        <p>
          Маса склянки-збирача до досліду = <Cell id="mass_collect_before" /> г
          &nbsp;&nbsp; після досліду = <Cell id="mass_collect_after" /> г
        </p>
        <p>
          Маса води (дослід) = <Cell id="mass_experiment" /> г
        </p>

        <p>Порівняйте результати двох способів і зробіть висновок:</p>
        <Answer id="v_creative_conclusion" rows={4} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "density-measurement-simulation",
  grade: 7,
  badge: "5.3",
  number: "№ 5",
  title: "Вимірювання густини твердого тіла та рідини. Варіант 3 (симуляція)",
  goal: "навчитися вимірювати густину твердого тіла та рідини за допомогою терезів і мірної посудини.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Густина речовини (симуляція)",
  meta: {
    title:
      "Вимірювання густини твердого тіла та рідини (симуляція) — лабораторна робота №5, варіант 3",
    description:
      "У віртуальній лабораторії виміряйте масу та об'єм твердого тіла й рідини за допомогою терезів і мензурок та визначте їхню густину.",
  },
  Content,
};

export default lab;
