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
import { Figure, Section, Simulation } from "@/components/lab/lab-shell";
import { Formula } from "@/components/formula";
import exampleGraph from "@/assets/coin-decay-model-example-graph.png";
import type { LabDefinition } from "./types";

const EXPERIMENT_VIDEO = "https://www.youtube.com/embed/YHUBMd3EZ5g";

const STEPS = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const SERIES = [1, 2, 3];
const THEORY_VALUES = STEPS.map((n) => 128 * Math.pow(2, -n));

function SeriesTable({ series }: { series: number }) {
  return (
    <LabTable>
      <thead>
        <tr>
          <HeaderCell id={`h_s${series}_label`} text="Показник">
            Показник
          </HeaderCell>
          {STEPS.map((n) => (
            <HeaderCell key={n} id={`h_s${series}_n${n}`} text={`n = ${n}`}>
              n = {n}
            </HeaderCell>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <Td>
            N (не розпалися)
          </Td>
          {STEPS.map((n) =>
            n === 0 ? (
              <Td key={n}>128</Td>
            ) : (
              <Td key={n}>
                <Cell id={`N_s${series}_${n}`} />
              </Td>
            ),
          )}
        </tr>
        <tr>
          <Td>
            N&apos; (розпалися)
          </Td>
          {STEPS.map((n) =>
            n === 0 ? (
              <Td key={n}>0</Td>
            ) : (
              <Td key={n}>
                <Cell id={`Nd_s${series}_${n}`} />
              </Td>
            ),
          )}
        </tr>
      </tbody>
    </LabTable>
  );
}

function Content() {
  return (
    <LabForm sheetName="Моделювання радіоактивного розпаду (відео)">
      <StudentBlock />

      <Section title="Опис моделі">
        <p>
          Розпад того чи іншого ядра — подія випадкова. Такою самою
          випадковою подією є випадання «герба» або «цифри» після кидка
          монети. Тому для моделювання радіоактивного розпаду
          використаємо таку модель.
        </p>
        <p>
          Ядра в радіонуклідному зразку змоделюємо монетами в паперовому
          стакані: нехай ядру, що не розпалося, відповідає монета, на якій
          випаде «герб»; ядру, що розпалося, — монета, на якій випаде
          «цифра». Тоді кожен кидок купи монет відповідатиме періоду
          піврозпаду T<sub>½</sub> (часу, за який розпадається половина
          ядер радіонукліда в зразку), а кількість n кидків — кількості
          періодів піврозпаду, тобто часу спостереження:
        </p>
        <Formula math="t = n \, T_{1/2}" />
      </Section>

      <Section title="Експеримент">
        <p>
          <em>
            Переглядаючи відео, заносьте результати вимірювань і обчислень
            відразу до таблиць.
          </em>
        </p>

        <p>
          У відео 128 монет кидають у стакані, висипають на тацю та
          рахують кількість «гербів» (ядер, що не розпалися). Ці монети
          знову кидають — і так до 8 разів або доки не залишиться одна
          монета з «гербом». Уся серія повторюється тричі.
        </p>

        <Simulation src={EXPERIMENT_VIDEO} title="Відеоексперимент" />

        {SERIES.map((s) => (
          <div key={s}>
            <p>
              <strong>Таблиця {s}. Серія кидків {s}</strong>&nbsp;&nbsp;
              Колір графіка: <Cell id={`color_s${s}`} />
            </p>
            <SeriesTable series={s} />
          </div>
        ))}
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>
          1. На міліметровому папері для кожної серії кидків побудуйте
          відповідним кольором графік залежності N(n) — залежності числа N
          ядер, які не розпалися, від кількості кидків.
        </p>

        <p>Приклад такого графіка:</p>
        <Figure
          src={exampleGraph}
          alt="Приклад графіка залежності числа ядер N, що не розпалися, від кількості кидків n"
          className="w-full max-w-sm mx-auto"
        />

        <p>
          2. У тих самих осях для кожної серії кидків побудуйте графік
          функції, яка виражає закон радіоактивного розпаду (вважайте, що
          початкова кількість ядер радіонукліда N₀ = 128):
        </p>
        <Formula math="N = N_0 \cdot 2^{-n}" />

        <p>
          Колір графіка теоретичної залежності: <Cell id="color_theory" />
        </p>

        <p>
          <strong>Таблиця 4. Теоретичний закон розпаду</strong>
        </p>
        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h4_label" text="Показник">
                Показник
              </HeaderCell>
              {STEPS.map((n) => (
                <HeaderCell key={n} id={`h4_n${n}`} text={`n = ${n}`}>
                  n = {n}
                </HeaderCell>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>N = 128·2⁻ⁿ</Td>
              {THEORY_VALUES.map((v, i) => (
                <Td key={i}>{v}</Td>
              ))}
            </tr>
          </tbody>
        </LabTable>

        <p>
          3. Прикріпіть фото (скан) графіків, побудованих на міліметровому
          папері:
        </p>
        <ImageCanvas
          label="Прикріпіть фото графіка N(n) з міліметрового паперу"
          height={400}
          minHeight={250}
          maxHeight={700}
          maxImages={4}
        />
      </Section>

      <Section title="Аналіз експерименту та його результатів">
        <p>
          За результатами експерименту сформулюйте висновок, у якому
          поясніть, чому побудовані графіки не збігаються. Це є
          закономірністю чи використано недосконалу модель? Чи мають місце
          обидві причини?
        </p>
        <Answer id="v_conclusion" rows={6} />
      </Section>

      <Section title="Творче завдання">
        <p>
          З&apos;ясуйте, як вплине на якість моделі процесу радіоактивного
          розпаду, використаної в роботі, збільшення кількості монет у 3
          рази; зменшення кількості монет у 3 рази.
        </p>
        <Answer id="v_creative" rows={6} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "coin-decay-model-video",
  grade: 11,
  badge: "8.2",
  number: "№ 8",
  title: "Моделювання радіоактивного розпаду. Варіант 2 (за відео)",
  goal:
    "змоделювавши радіоактивний розпад, перевірити на моделі закон радіоактивного розпаду.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер; міліметровий папір, кольорові олівці.",
  sheetName: "Моделювання радіоактивного розпаду (відео)",
  meta: {
    title:
      "Моделювання радіоактивного розпаду (за відео) — експериментальна робота №8 (11 клас), варіант 2",
    description:
      "Перегляньте відео моделювання радіоактивного розпаду підкиданням монет та перевірте закон радіоактивного розпаду.",
  },
  Content,
};

export default lab;
