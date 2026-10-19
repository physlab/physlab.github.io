"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { DiodeCircuit, RHEO_X0, RHEO_X1, VIEWBOX_W } from "./diode-circuit";
import {
  DIODE_PARAMS,
  E_V,
  RANGE_LABELS,
  ammeterReading,
  diodeCurrent,
  type DiodeElement,
  type MeterRange,
} from "./diode-model";

/**
 * Virtual set-up for the "semiconductor diode" lab: a source, a key, a rheostat
 * (voltage divider), an ammeter with three ranges (A, mA, µA), a voltmeter and
 * a diode (or an LED) that can be turned round to reverse the bias.
 *
 * The forward current must not exceed the maximum permissible value, otherwise
 * the element burns out and has to be replaced («Скинути»).
 */

const RANGES: MeterRange[] = ["A", "mA", "uA"];

export function DiodeBench() {
  const [pct, setPct] = useState(0);
  const [keyClosed, setKeyClosed] = useState(false);
  const [forward, setForward] = useState(true);
  const [element, setElement] = useState<DiodeElement>("rectifier");
  const [range, setRange] = useState<MeterRange>("A");
  const [burned, setBurned] = useState(false);

  const voltage = keyClosed ? (E_V * pct) / 100 : 0;
  const rawCurrent = keyClosed ? diodeCurrent(element, forward, voltage) : 0;
  const current = burned ? 0 : rawCurrent;
  const meter = ammeterReading(current, range);
  const params = DIODE_PARAMS[element];

  // the element burns out if the forward current exceeds the maximum value
  useEffect(() => {
    if (keyClosed && forward && !burned && rawCurrent > params.imax) {
      setBurned(true);
    }
  }, [keyClosed, forward, burned, rawCurrent, params.imax]);

  const glow = element === "led" && forward && !burned ? current / 0.02 : 0;

  // dragging the rheostat slider on the diagram (mouse and touch)
  const svgRef = useRef<SVGSVGElement>(null);
  const draggingRef = useRef(false);
  const setPctFromPointer = (e: ReactPointerEvent<SVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * VIEWBOX_W;
    const value = ((x - RHEO_X0) / (RHEO_X1 - RHEO_X0)) * 100;
    setPct(Math.max(0, Math.min(100, Math.round(value * 2) / 2)));
  };
  const onRheoDown = (e: ReactPointerEvent<SVGGElement>) => {
    e.preventDefault();
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setPctFromPointer(e);
  };
  const onRheoMove = (e: ReactPointerEvent<SVGGElement>) => {
    if (draggingRef.current) setPctFromPointer(e);
  };
  const onRheoUp = (e: ReactPointerEvent<SVGGElement>) => {
    draggingRef.current = false;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const reset = () => {
    setPct(0);
    setKeyClosed(false);
    setForward(true);
    setBurned(false);
  };

  const changeElement = (next: DiodeElement) => {
    setElement(next);
    setBurned(false);
    setPct(0);
    setKeyClosed(false);
    setForward(true);
  };

  return (
    <div className="my-4 rounded-lg border p-3" style={{ background: "rgba(0,0,0,0.02)" }}>
      <DiodeCircuit
        svgRef={svgRef}
        pct={pct}
        keyClosed={keyClosed}
        forward={forward}
        element={element}
        glow={glow}
        burned={burned}
        interactive
        onRheoDown={onRheoDown}
        onRheoMove={onRheoMove}
        onRheoUp={onRheoUp}
      />

      <div className="mt-2 grid gap-2 text-sm" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
        <div className="rounded border p-2">
          Вольтметр: <strong>{voltage.toFixed(2)} В</strong>
          <div className="text-xs text-muted-foreground">напруга на елементі</div>
        </div>
        <div className="rounded border p-2">
          Амперметр:{" "}
          <strong>
            {meter.text} {meter.overload ? "" : meter.unit}
          </strong>
          <div className="text-xs text-muted-foreground">
            {meter.overload
              ? "перевантаження — оберіть більшу межу"
              : `межа вимірювання: ${RANGE_LABELS[range]}`}
          </div>
        </div>
      </div>

      {burned && (
        <p className="mt-2 rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">
          Прямий струм перевищив максимально допустиму силу струму (
          {element === "led" ? "30 мА" : "1 А"}) — елемент вийшов з ладу. Натисніть
          «Скинути», щоб замінити його на новий, і надалі стежте за показами амперметра.
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <button
          type="button"
          className="rounded border px-3 py-1"
          style={{ background: keyClosed ? "#ffe3e3" : undefined }}
          onClick={() => setKeyClosed((k) => !k)}
        >
          {keyClosed ? "Розімкнути ключ" : "Замкнути ключ"}
        </button>
        <button
          type="button"
          className="rounded border px-3 py-1"
          onClick={() => setForward((f) => !f)}
        >
          Повернути елемент іншим боком
        </button>
        <label className="flex items-center gap-2">
          реостат:
          <input
            type="range"
            min={0}
            max={100}
            step={0.5}
            value={pct}
            onChange={(e) => setPct(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <span>Межа амперметра:</span>
        {RANGES.map((r) => (
          <button
            key={r}
            type="button"
            className="rounded border px-3 py-1"
            style={{ background: range === r ? "#e7f5ff" : undefined }}
            onClick={() => setRange(r)}
          >
            {RANGE_LABELS[r]}
          </button>
        ))}
        <label className="flex items-center gap-2">
          елемент:
          <select
            value={element}
            onChange={(e) => changeElement(e.target.value as DiodeElement)}
            className="rounded border px-2 py-1"
          >
            <option value="rectifier">напівпровідниковий діод</option>
            <option value="led">світлодіод</option>
          </select>
        </label>
        <button type="button" className="rounded border px-3 py-1" onClick={reset}>
          Скинути
        </button>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Перетягніть повзунок реостата на схемі (або скористайтеся повзунком
        «реостат»), щоб змінювати напругу на елементі. Якщо амперметр показує
        «OL», оберіть більшу межу; для дуже малих струмів оберіть мА або мкА.
        Не перевищуйте максимально допустимий прямий струм елемента.
      </p>
    </div>
  );
}
