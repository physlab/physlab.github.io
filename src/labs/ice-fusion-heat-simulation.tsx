"use client";

import { useState } from "react";
import {
  LabForm,
  StudentBlock,
  Answer,
  Cell,
  HeaderCell,
  LabTable,
  Td,
} from "@/components/lab/lab-form";
import { Section } from "@/components/lab/lab-shell";
import { Formula } from "@/components/formula";
import type { LabDefinition } from "./types";

// Real physical constants, used internally by the simulator but never
// shown to the student before they've done the calculation themselves.
const C_WATER = 4200; // J/(kg·°C)
const LAMBDA_ICE = 334000; // J/kg — the value students are trying to find

/**
 * A self-contained virtual calorimeter. No ready-made simulator exactly
 * reproduces this experiment (checked PhET and a few other sources), so
 * this runs the real heat-balance physics directly in the browser. The
 * ice mass added is randomised and hidden — exactly like in the real
 * experiment, the student has to work it out from the volume/temperature
 * readings, not read it off a dial.
 */
function IceCalorimeterSimulator() {
  const [volumeInput, setVolumeInput] = useState("120");
  const [tempInput, setTempInput] = useState("45");
  const [result, setResult] = useState<{
    finalTemp: number;
    finalVolume: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runExperiment = () => {
    const V0 = parseFloat(volumeInput); // cm3, treated as grams (density 1 g/cm3)
    const t0 = parseFloat(tempInput);

    if (Number.isNaN(V0) || Number.isNaN(t0) || V0 <= 0) {
      setError("Введіть коректний об'єм і температуру.");
      setResult(null);
      return;
    }
    if (t0 <= 5 || t0 > 80) {
      setError("Оберіть початкову температуру води в межах 5–80 °C.");
      setResult(null);
      return;
    }

    const mWater = V0 / 1000; // kg
    // Pick a random ice mass, but keep it small enough that it fully
    // melts and the mixture doesn't drop to/below 0 °C.
    let mIce = (15 + Math.random() * 25) / 1000; // 15–40 g, in kg
    let finalTemp =
      (C_WATER * mWater * t0 - LAMBDA_ICE * mIce) /
      (C_WATER * (mWater + mIce));

    // Safety clamp: if the chosen ice mass would be too much for this
    // amount/temperature of water, shrink it until melting completes
    // with a reasonable final temperature.
    let guard = 0;
    while (finalTemp < 2 && guard < 20) {
      mIce *= 0.7;
      finalTemp =
        (C_WATER * mWater * t0 - LAMBDA_ICE * mIce) /
        (C_WATER * (mWater + mIce));
      guard++;
    }

    // Round to what a real thermometer/measuring cylinder could show.
    const roundedTemp = Math.round(finalTemp * 2) / 2;
    const finalVolume = V0 + mIce * 1000; // cm3

    setError(null);
    setResult({
      finalTemp: roundedTemp,
      finalVolume: Math.round(finalVolume),
    });
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="mb-3 text-sm font-medium">Віртуальний калориметр</p>

      <div className="mb-3 flex flex-wrap gap-4">
        <label className="flex flex-col text-sm">
          Об&apos;єм теплої води, см³ (100–150)
          <input
            type="number"
            className="cell mt-1"
            value={volumeInput}
            onChange={(e) => setVolumeInput(e.target.value)}
            disabled={result !== null}
          />
        </label>
        <label className="flex flex-col text-sm">
          Початкова температура води, °C
          <input
            type="number"
            className="cell mt-1"
            value={tempInput}
            onChange={(e) => setTempInput(e.target.value)}
            disabled={result !== null}
          />
        </label>
      </div>

      {error && <p className="mb-3 text-sm text-destructive">{error}</p>}

      {result === null ? (
        <button
          type="button"
          onClick={runExperiment}
          className="rounded-full bg-gradient-accent px-5 py-2 text-sm font-medium text-accent-foreground"
        >
          Додати лід і почекати, поки розтане
        </button>
      ) : (
        <div className="space-y-1 text-sm">
          <p>
            Кінцева температура води в калориметрі: <strong>{result.finalTemp} °C</strong>
          </p>
          <p>
            Загальний об&apos;єм води після танення льоду:{" "}
            <strong>{result.finalVolume} см³</strong>
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-2 rounded-full border border-border px-4 py-1.5 text-sm"
          >
            Провести дослід ще раз (з іншими даними)
          </button>
        </div>
      )}
    </div>
  );
}

function Content() {
  return (
    <LabForm sheetName="Питома теплота плавлення льоду (симуляція)">
      <StudentBlock />

      <Section title="Теоретичні відомості">
        <p>
          Для визначення питомої теплоти плавлення льоду (а також інших
          речовин, що мають низьку температуру плавлення) зручно
          застосовувати такий метод.
        </p>
        <p>
          У калориметр, який містить відому масу теплої води m<sub>води</sub>{" "}
          за температури t<sub>0 води</sub>, занурюють лід за температури
          плавлення t<sub>пл</sub> = 0 °C. Відбувається теплообмін, у якому
          беруть участь: тепла вода, лід, калориметр, термометр.
        </p>
        <p>Тепла вода віддає тепло та охолоджується до температури t:</p>
        <Formula math="Q_{\text{води}} = c_{\text{води}} m_{\text{води}} (t_{0\,\text{води}} - t)" />
        <p>
          Лід одержує тепло — він тане, а отримана внаслідок танення вода
          нагрівається також до температури t:
        </p>
        <Formula math="Q_{\text{льоду}} = \lambda_{\text{льоду}} m_{\text{льоду}} + c_{\text{води}} m_{\text{льоду}} (t - t_{\text{пл}})" />
        <p>
          Калориметр і термометр порівняно з водою віддають незначну
          кількість теплоти, тому можемо вважати, що кількість теплоти, яку
          віддано теплою водою, дорівнює кількості теплоти, яку одержано
          льодом:
        </p>
        <Formula math="Q_{\text{води}} = Q_{\text{льоду}}" />
        <p>
          Вимірявши температуру t і масу m води після плавлення льоду й
          обчисливши масу льоду, визначають питому теплоту плавлення льоду:
        </p>
        <Formula math="\lambda_{\text{льоду}} = \dfrac{c_{\text{води}} m_{\text{води}} (t_{0\,\text{води}} - t) - c_{\text{води}} m_{\text{льоду}} (t - t_{\text{пл}})}{m_{\text{льоду}}} \quad (*)" />
      </Section>

      <Section title="Підготовка до експерименту">
        <p>1. Уважно прочитайте теоретичні відомості.</p>
        <p>
          2. Згадайте, що характеризує питома теплота плавлення, який її
          фізичний зміст.
        </p>
        <Answer id="v_latent_heat_meaning" rows={4} />

        <p>
          3. У цьому варіанті роботи використовується віртуальний
          калориметр нижче. Ви самі задаєте об&apos;єм і початкову
          температуру теплої води — а скільки льоду в неї потрапить,
          симулятор «ховає» від вас так само, як у реальному досліді (ви ж
          не зважуєте лід до того, як він розтане). Це доведеться
          визначити виміром, як і в реальній лабораторній роботі.
        </p>

        <p>
          Питома теплоємність води (відома величина): c<sub>води</sub> =
          4200 Дж/(кг·°C)
        </p>
      </Section>

      <Section title="Експеримент">
        <p>
          <em>Результати вимірювань відразу заносьте до таблиці.</em>
        </p>

        <p>
          1. Оберіть об&apos;єм теплої води (100–150 см³) та її початкову
          температуру.
        </p>
        <p>
          2. Натисніть «Додати лід і почекати, поки розтане» — симулятор
          покаже кінцеву температуру t і загальний об&apos;єм води V після
          повного танення льоду.
        </p>

        <IceCalorimeterSimulator />

        <LabTable>
          <thead>
            <tr>
              <HeaderCell id="h1" text="Vводи, см³">
                V<sub>води</sub>, см<sup>3</sup>
              </HeaderCell>
              <HeaderCell id="h2" text="V, см³">
                V, см<sup>3</sup>
              </HeaderCell>
              <HeaderCell id="h3" text="t0 води, °C">
                t<sub>0 води</sub>, °C
              </HeaderCell>
              <HeaderCell id="h4" text="tпл, °C">
                t<sub>пл</sub>, °C
              </HeaderCell>
              <HeaderCell id="h5" text="t, °C">
                t, °C
              </HeaderCell>
              <HeaderCell id="h6" text="mводи, кг">
                m<sub>води</sub>, кг
              </HeaderCell>
              <HeaderCell id="h7" text="m, кг">
                m, кг
              </HeaderCell>
              <HeaderCell id="h8" text="mльоду, кг">
                m<sub>льоду</sub>, кг
              </HeaderCell>
              <HeaderCell id="h9" text="cводи, Дж/(кг·°C)">
                c<sub>води</sub>, Дж/(кг·°C)
              </HeaderCell>
              <HeaderCell id="h10" text="λльоду, Дж/кг">
                λ<sub>льоду</sub>, Дж/кг
              </HeaderCell>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td>
                <Cell id="V_vody" />
              </Td>
              <Td>
                <Cell id="V" />
              </Td>
              <Td>
                <Cell id="t0_vody" />
              </Td>
              <Td>0</Td>
              <Td>
                <Cell id="t" />
              </Td>
              <Td>
                <Cell id="m_vody" />
              </Td>
              <Td>
                <Cell id="m" />
              </Td>
              <Td>
                <Cell id="m_ice" />
              </Td>
              <Td>4200</Td>
              <Td>
                <Cell id="lambda_ice" />
              </Td>
            </tr>
          </tbody>
        </LabTable>
      </Section>

      <Section title="Опрацювання результатів експерименту">
        <p>
          1. Визначте початкову масу води в калориметрі (m<sub>води</sub>),
          подайте її в кілограмах.
        </p>
        <p>
          <em>Густина води 1 г/см³, тобто маса води об&apos;ємом 1 см³ дорівнює 1 г.</em>
        </p>

        <p>
          2. Визначте кінцеву масу води в калориметрі (m), подайте її в
          кілограмах.
        </p>

        <p>3. Визначте масу талої води в калориметрі, а отже, масу льоду:</p>
        <Formula math="m_{\text{льоду}} = m - m_{\text{води}}" />

        <p>
          4. Скориставшись формулою (*), визначте питому теплоту плавлення
          льоду.
        </p>
      </Section>

      <Section title="Аналіз результатів експерименту">
        <p>
          Проаналізуйте експеримент і його результати. Сформулюйте
          висновок, у якому:
        </p>

        <p>а) зазначте, яку фізичну величину ви визначали;</p>
        <Answer id="v1" rows={4} />

        <p>б) який результат отримали;</p>
        <Answer id="v2" rows={4} />

        <p>
          в) порівняйте одержане значення питомої теплоти плавлення льоду з
          табличним (λ<sub>льоду</sub> = 334 000 Дж/кг), поясніть причини
          розбіжності.
        </p>
        <Answer id="v3" rows={5} />
      </Section>

      <Section title="Творчі завдання">
        <p>
          1. Дайте відповідь на запитання. У якому випадку точність
          проведеного експерименту буде більшою — за швидкого чи повільного
          виконання всіх дій? Обґрунтуйте свою відповідь.
        </p>
        <Answer id="v_creative1" rows={5} />

        <p>
          2. Доведіть, що якщо маси води та льоду подавати в грамах, то
          результат вимірювання питомої теплоти плавлення льоду не
          зміниться.
        </p>
        <Answer id="v_creative2" rows={5} />
      </Section>
    </LabForm>
  );
}

const lab: LabDefinition = {
  slug: "ice-fusion-heat-simulation",
  grade: 8,
  badge: "5.3",
  number: "№ 5",
  title: "Визначення питомої теплоти плавлення льоду. Варіант 3 (симуляція)",
  goal:
    "дізнатися про один із методів вимірювання питомої теплоти плавлення кристалічних речовин; визначити питому теплоту плавлення льоду, знаючи питому теплоємність води.",
  equipment: "комп'ютер або смартфон з доступом до інтернету, браузер.",
  sheetName: "Питома теплота плавлення льоду (симуляція)",
  meta: {
    title:
      "Визначення питомої теплоти плавлення льоду (симуляція) — лабораторна робота №5 (8 клас), варіант 3",
    description:
      "Визначте питому теплоту плавлення льоду за допомогою вбудованого віртуального калориметра.",
  },
  Content,
};

export default lab;
