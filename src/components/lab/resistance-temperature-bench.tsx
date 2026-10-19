"use client";

import { useEffect, useState } from "react";
import {
  ALPHA,
  INITIAL_STATE,
  R0_KOHM,
  resistanceKOhm,
  step,
  type SimState,
} from "./resistance-temperature-model";

/**
 * Virtual set-up for lab No. 3: a copper-wire device with a thermometer in a
 * beaker of water on a heater, and a multimeter (range 10³ Ω, reading in kΩ).
 * The water is heated, the wire follows with a small lag; the student reads the
 * thermometer and touches the device terminals with the multimeter probes only
 * for the moment of measurement (as the instruction requires).
 *
 * The hidden values R₀ and α can be revealed for self-checking.
 */

const SPEEDS = [1, 5, 10, 30];
const TICK_MS = 100;
const PROBE_AUTO_OFF_MS = 10000;

// thermometer geometry (SVG px)
const TH_BOTTOM = 285;
const TH_PER_DEG = 2.1;
const yForTemp = (t: number) => TH_BOTTOM - Math.max(0, Math.min(105, t)) * TH_PER_DEG;

export function ResistanceTemperatureBench() {
  const [sim, setSim] = useState<SimState>(INITIAL_STATE);
  const [heater, setHeater] = useState(false);
  const [speed, setSpeed] = useState(10);
  const [paused, setPaused] = useState(false);
  const [probes, setProbes] = useState(false);
  const [reveal, setReveal] = useState(false);

  // simulation clock
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setSim((s) => {
        let next = s;
        const sub = Math.max(1, Math.round(speed));
        for (let i = 0; i < sub; i++) next = step(next, heater, TICK_MS / 1000);
        return next;
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [heater, speed, paused]);

  // probes may touch the terminals only briefly
  useEffect(() => {
    if (!probes) return;
    const id = window.setTimeout(() => setProbes(false), PROBE_AUTO_OFF_MS);
    return () => window.clearTimeout(id);
  }, [probes]);

  const thermometer = Math.round(sim.tc); // scale division: 1 °C
  const mercuryY = yForTemp(sim.tc);
  const reading = resistanceKOhm(sim.tc);
  const lcd = probes ? reading.toFixed(3) : "1";
  const minutes = Math.floor(sim.time / 60);
  const seconds = Math.floor(sim.time % 60);
  const boiling = sim.tw > 92;

  return (
    <div className="my-4 rounded-lg border p-3" style={{ background: "rgba(0,0,0,0.02)" }}>
      <svg
        viewBox="0 0 560 400"
        className="w-full select-none"
        role="img"
        aria-label="Установка: пристрій із мідним дротом і термометром у посудині з водою на електроплитці, мультиметр"
      >
        <defs>
          <linearGradient id="rt-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cfe8ff" />
            <stop offset="100%" stopColor="#8fc3f2" />
          </linearGradient>
          <radialGradient id="rt-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff7a18" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ff7a18" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* table */}
        <rect x={0} y={340} width={560} height={60} fill="#e5e7eb" />
        <line x1={0} x2={560} y1={340} y2={340} stroke="#9ca3af" />

        {/* stand */}
        <rect x={40} y={338} width={80} height={8} fill="#374151" rx={2} />
        <rect x={66} y={70} width={8} height={270} fill="#6b7280" />
        <rect x={70} y={142} width={110} height={6} fill="#6b7280" />
        <rect x={168} y={136} width={14} height={18} fill="#374151" rx={2} />

        {/* heater */}
        <rect x={105} y={314} width={200} height={26} fill="#2b2f36" rx={4} />
        {heater && <ellipse cx={205} cy={314} rx={105} ry={14} fill="url(#rt-glow)" />}
        <circle cx={285} cy={327} r={5} fill={heater ? "#ff4d4f" : "#555b66"} />

        {/* beaker + water */}
        <rect x={130} y={200} width={150} height={112} fill="url(#rt-water)" opacity={0.85} />
        <path d="M130,185 L130,312 L280,312 L280,185" fill="none" stroke="#6b7280" strokeWidth={3} />
        {boiling &&
          [150, 175, 232, 258, 200].map((cx, i) => (
            <circle key={cx} cx={cx} cy={285 - ((sim.time * 20 + i * 23) % 70)} r={3} fill="#ffffff" opacity={0.7} />
          ))}

        {/* device: tube with copper coil */}
        <rect x={190} y={150} width={30} height={152} fill="#e8f1f8" opacity={0.85} stroke="#6b7280" strokeWidth={1.5} rx={4} />
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1={192} x2={218} y1={248 + i * 5} y2={248 + i * 5} stroke="#b45309" strokeWidth={2.5} />
        ))}
        {/* panel and terminals */}
        <rect x={170} y={142} width={70} height={10} fill="#374151" rx={2} />
        <circle cx={180} cy={138} r={5} fill="#c0c4cc" stroke="#555" />
        <circle cx={230} cy={138} r={5} fill="#c0c4cc" stroke="#555" />

        {/* thermometer */}
        <rect x={201} y={yForTemp(105)} width={8} height={TH_BOTTOM - yForTemp(105)} fill="#f3f4f6" stroke="#6b7280" rx={3} />
        <circle cx={205} cy={TH_BOTTOM + 4} r={7} fill="#e03131" />
        <rect x={203.5} y={mercuryY} width={3} height={TH_BOTTOM - mercuryY} fill="#e03131" />
        {Array.from({ length: 11 }, (_, i) => i * 10).map((t) => (
          <g key={t}>
            <line x1={210} x2={216} y1={yForTemp(t)} y2={yForTemp(t)} stroke="#374151" />
            {t >= 20 && (
              <text x={219} y={yForTemp(t) + 4} fontSize={10} fill="#374151">
                {t}
              </text>
            )}
          </g>
        ))}

        {/* wires */}
        <path d="M180,138 C180,60 330,40 400,318" fill="none" stroke="#d6336c" strokeWidth={2.5} />
        <path d="M230,138 C260,80 420,60 470,318" fill="none" stroke="#d6336c" strokeWidth={2.5} />

        {/* multimeter */}
        <rect x={350} y={170} width={180} height={160} fill="#2f3640" rx={10} />
        <rect x={364} y={184} width={152} height={44} fill="#c9d6b8" rx={4} />
        <text x={506} y={216} textAnchor="end" fontSize={30} fontFamily="monospace" fill="#1f2a14">
          {lcd}
        </text>
        <text x={372} y={198} fontSize={10} fill="#3a4a26">
          {probes ? "кОм" : ""}
        </text>
        <circle cx={440} cy={275} r={26} fill="#d1d5db" stroke="#9ca3af" strokeWidth={2} />
        <line x1={440} y1={275} x2={440} y2={252} stroke="#111827" strokeWidth={3} />
        <text x={440} y={316} textAnchor="middle" fontSize={11} fill="#e5e7eb">
          Ω · 10³
        </text>
        <circle cx={400} cy={322} r={6} fill="#d6336c" />
        <circle cx={470} cy={322} r={6} fill="#d6336c" />
        {probes && (
          <text x={185} y={122} fontSize={12} fill="#d6336c">
            щупи на клемах
          </text>
        )}
      </svg>

      <div className="mt-2 grid gap-2 text-sm" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
        <div className="rounded border p-2">
          Показ термометра: <strong>{thermometer} °C</strong>
          <div className="text-xs text-muted-foreground">ціна поділки 1 °C</div>
        </div>
        <div className="rounded border p-2">
          Час моделювання:{" "}
          <strong>
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </strong>
          <div className="text-xs text-muted-foreground">
            вода: {Math.round(sim.tw)} °C — дріт нагрівається з відставанням
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <button
          type="button"
          className="rounded border px-3 py-1"
          style={{ background: heater ? "#ffe3e3" : undefined }}
          onClick={() => setHeater((h) => !h)}
        >
          {heater ? "Вимкнути нагрівник" : "Увімкнути нагрівник"}
        </button>
        <button
          type="button"
          className="rounded border px-3 py-1"
          style={{ background: probes ? "#e7f5ff" : undefined }}
          onClick={() => setProbes((p) => !p)}
        >
          {probes ? "Прибрати щупи" : "Торкнутися клем щупами"}
        </button>
        <label className="flex items-center gap-2">
          швидкість:
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="rounded border px-2 py-1"
          >
            {SPEEDS.map((v) => (
              <option key={v} value={v}>
                ×{v}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="rounded border px-3 py-1" onClick={() => setPaused((p) => !p)}>
          {paused ? "Продовжити" : "Пауза"}
        </button>
        <button
          type="button"
          className="rounded border px-3 py-1"
          onClick={() => {
            setSim(INITIAL_STATE);
            setHeater(false);
            setProbes(false);
            setPaused(false);
          }}
        >
          Скинути
        </button>
        <button type="button" className="rounded border px-3 py-1" onClick={() => setReveal((v) => !v)}>
          {reveal ? "Сховати" : "Показати"} задані значення (для перевірки)
        </button>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Торкайтеся клем щупами лише на момент вимірювання (через 10 с щупи
        відключаться самі). Якщо щупи не торкаються клем, мультиметр показує «1».
        Паузою зручно зафіксувати показ, поки ви записуєте результат.
      </p>

      {reveal && (
        <p className="mt-2 text-sm">
          Задано: R<sub>0</sub> = {R0_KOHM.toFixed(3)} кОм, α ={" "}
          {(ALPHA * 1000).toFixed(1)}·10<sup>−3</sup> °C<sup>−1</sup>.
        </p>
      )}
    </div>
  );
}
