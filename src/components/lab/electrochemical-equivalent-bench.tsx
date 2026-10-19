"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import {
  INITIAL_STATE,
  balanceReading,
  circuitCurrent,
  formatClock,
  randomBaseMass,
  step,
  type SimState,
} from "./electrochemical-equivalent-model";

/**
 * Virtual set-up for the "electrochemical equivalent" lab: a cell with copper
 * sulfate solution and two electrodes in a holder, a power supply, a key, an
 * ammeter, a rheostat, a clock and an electronic balance (0.01 g).
 *
 * The cathode (left electrode, marked with a black band) can be taken out,
 * blotted with a napkin and weighed. A wet electrode weighs more — the student
 * has to blot it before reading the balance. During electrolysis the current
 * slowly drifts, so it must be kept constant with the rheostat.
 */

const SPEEDS = [1, 10, 30, 60];
const TICK_MS = 100;

export function ElectrochemicalEquivalentBench() {
  const [sim, setSim] = useState<SimState>(INITIAL_STATE);
  const [baseMass, setBaseMass] = useState<number>(18.5);
  const [keyClosed, setKeyClosed] = useState(false);
  const [onBalance, setOnBalance] = useState(false);
  const [wet, setWet] = useState(false);
  const [pct, setPct] = useState(12);
  const [speed, setSpeed] = useState(10);
  const [paused, setPaused] = useState(false);

  // random initial mass of the cathode (client only, to avoid hydration mismatch)
  useEffect(() => {
    setBaseMass(randomBaseMass());
  }, []);

  const circuitClosed = keyClosed && !onBalance;

  // simulation clock
  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => {
      setSim((s) => {
        let next = s;
        let left = (TICK_MS / 1000) * speed;
        while (left > 1e-9) {
          const dt = Math.min(1, left);
          next = step(next, circuitClosed, pct, dt);
          left -= dt;
        }
        return next;
      });
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [paused, speed, circuitClosed, pct]);

  const current = circuitCurrent(circuitClosed, pct, sim.elTime);
  const balance = onBalance ? balanceReading(baseMass, sim.depositMg, wet) : 0;
  const coat = Math.min(1, sim.depositMg / 350);

  const toggleCathode = () => {
    if (onBalance) {
      setOnBalance(false);
      setWet(false);
    } else {
      setOnBalance(true);
      setWet(true); // taken out of the solution — it is wet
    }
  };

  const reset = () => {
    setSim(INITIAL_STATE);
    setBaseMass(randomBaseMass());
    setKeyClosed(false);
    setOnBalance(false);
    setWet(false);
    setPct(12);
    setPaused(false);
  };

  const rheoX = 330 + pct * 1.4;

  // Перетягування повзунка реостата прямо на малюнку (миша й дотик)
  const svgRef = useRef<SVGSVGElement>(null);
  const draggingRef = useRef(false);
  const setPctFromPointer = (e: ReactPointerEvent<SVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 620; // координати viewBox
    const value = Math.round(((x - 330) / 140) * 100);
    setPct(Math.max(0, Math.min(100, value)));
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

  return (
    <div className="my-4 rounded-lg border p-3" style={{ background: "rgba(0,0,0,0.02)" }}>
      <svg
        ref={svgRef}
        viewBox="0 0 620 380"
        className="w-full select-none"
        role="img"
        aria-label="Установка для електролізу: джерело струму, ключ, амперметр, реостат, посудина з розчином купрум(ІІ) сульфату та електронні терези"
      >
        {/* table */}
        <rect x={0} y={340} width={620} height={40} fill="#e5e7eb" />
        <line x1={0} x2={620} y1={340} y2={340} stroke="#9ca3af" />

        {/* wires */}
        <path d="M45,252 L45,70 L140,70" fill="none" stroke="#dc2626" strokeWidth={2.5} />
        <path d="M190,70 L226,70" fill="none" stroke="#dc2626" strokeWidth={2.5} />
        <path d="M274,70 L330,70" fill="none" stroke="#dc2626" strokeWidth={2.5} />
        <path d="M470,70 L500,70 L500,150 L285,150 L285,186" fill="none" stroke="#dc2626" strokeWidth={2.5} />
        <path d="M225,186 L225,170 L105,170 L105,252" fill="none" stroke="#1f2937" strokeWidth={2.5} />

        {/* power supply */}
        <rect x={20} y={252} width={110} height={88} fill="#2f3640" rx={6} />
        <circle cx={45} cy={252} r={6} fill="#dc2626" stroke="#fff" />
        <circle cx={105} cy={252} r={6} fill="#111827" stroke="#fff" />
        <text x={45} y={282} textAnchor="middle" fontSize={16} fill="#fca5a5">+</text>
        <text x={105} y={282} textAnchor="middle" fontSize={16} fill="#e5e7eb">−</text>
        <text x={75} y={320} textAnchor="middle" fontSize={12} fill="#e5e7eb">6 В</text>

        {/* key */}
        <circle cx={140} cy={70} r={5} fill="#9ca3af" stroke="#4b5563" />
        <circle cx={190} cy={70} r={5} fill="#9ca3af" stroke="#4b5563" />
        {keyClosed ? (
          <line x1={140} y1={70} x2={190} y2={70} stroke="#111827" strokeWidth={4} />
        ) : (
          <line x1={140} y1={70} x2={182} y2={42} stroke="#111827" strokeWidth={4} />
        )}
        <text x={165} y={98} textAnchor="middle" fontSize={12} fill="#374151">
          Ключ
        </text>

        {/* ammeter */}
        <circle cx={250} cy={70} r={24} fill="#ffffff" stroke="#374151" strokeWidth={2} />
        <text x={250} y={77} textAnchor="middle" fontSize={20} fontWeight="bold" fill="#111827">
          A
        </text>
        <rect x={218} y={100} width={64} height={20} fill="#c9d6b8" rx={3} />
        <text x={276} y={115} textAnchor="end" fontSize={14} fontFamily="monospace" fill="#1f2a14">
          {current.toFixed(2)} А
        </text>

        {/* rheostat — повзунок можна перетягувати мишею або пальцем */}
        <g
          onPointerDown={onRheoDown}
          onPointerMove={onRheoMove}
          onPointerUp={onRheoUp}
          onPointerCancel={onRheoUp}
          style={{ cursor: "ew-resize", touchAction: "none" }}
        >
          <rect x={320} y={30} width={160} height={60} fill="transparent" />
          <rect x={330} y={55} width={140} height={30} fill="#e5e7eb" stroke="#6b7280" rx={4} />
          {Array.from({ length: 14 }, (_, i) => (
            <line key={i} x1={336 + i * 10} x2={336 + i * 10} y1={60} y2={80} stroke="#b45309" strokeWidth={2} />
          ))}
          <polygon points={`${rheoX - 9},34 ${rheoX + 9},34 ${rheoX},55`} fill="#111827" />
        </g>
        <text x={400} y={108} textAnchor="middle" fontSize={12} fill="#374151">
          Реостат (перетягніть повзунок)
        </text>

        {/* beaker + solution */}
        <rect x={170} y={215} width={170} height={112} fill="#7fb4e8" opacity={0.75} />
        <path d="M170,200 L170,327 L340,327 L340,200" fill="none" stroke="#6b7280" strokeWidth={3} />
        <text x={255} y={357} textAnchor="middle" fontSize={11} fill="#374151">
          розчин CuSO₄
        </text>

        {/* holder and terminals */}
        <rect x={185} y={190} width={140} height={10} fill="#374151" rx={2} />
        <circle cx={225} cy={186} r={5} fill="#c0c4cc" stroke="#555" />
        <circle cx={285} cy={186} r={5} fill="#c0c4cc" stroke="#555" />

        {/* anode */}
        <rect x={276} y={200} width={18} height={112} fill="#4b5563" rx={2} />
        <text x={285} y={338} textAnchor="middle" fontSize={11} fill="#374151">
          анод
        </text>

        {/* cathode (left, marked with a black band) — in the cell */}
        {!onBalance && (
          <g>
            <rect x={216} y={200} width={18} height={112} fill="#4b5563" rx={2} />
            <rect x={216} y={200} width={18} height={112} fill="#c2631d" opacity={coat * 0.9} rx={2} />
            <rect x={216} y={202} width={18} height={7} fill="#000000" />
            <text x={225} y={338} textAnchor="middle" fontSize={11} fill="#374151">
              катод
            </text>
          </g>
        )}

        {/* balance */}
        <rect x={410} y={315} width={190} height={25} fill="#374151" rx={4} />
        <rect x={452} y={321} width={106} height={14} fill="#c9d6b8" rx={2} />
        <text x={552} y={332} textAnchor="end" fontSize={12} fontFamily="monospace" fill="#1f2a14">
          {balance.toFixed(2)} г
        </text>
        <rect x={440} y={300} width={130} height={8} fill="#9ca3af" rx={2} />
        <rect x={500} y={308} width={10} height={7} fill="#6b7280" />
        <text x={505} y={358} textAnchor="middle" fontSize={11} fill="#374151">
          електронні терези (0,01 г)
        </text>
        {onBalance && (
          <g>
            <rect x={470} y={286} width={70} height={14} fill="#4b5563" rx={2} />
            <rect x={470} y={286} width={70} height={14} fill="#c2631d" opacity={coat * 0.9} rx={2} />
            <rect x={472} y={286} width={8} height={14} fill="#000000" />
            {wet && (
              <g>
                <ellipse cx={485} cy={298} rx={4} ry={2.5} fill="#7fb4e8" />
                <ellipse cx={505} cy={299} rx={5} ry={2.5} fill="#7fb4e8" />
                <ellipse cx={528} cy={298} rx={4} ry={2.5} fill="#7fb4e8" />
              </g>
            )}
          </g>
        )}
      </svg>

      <div className="mt-2 grid gap-2 text-sm" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
        <div className="rounded border p-2">
          Годинник: <strong>{formatClock(sim.clock)}</strong>
          <div className="text-xs text-muted-foreground">години : хвилини : секунди</div>
        </div>
        <div className="rounded border p-2">
          Сила струму: <strong>{current.toFixed(2)} А</strong>
          <div className="text-xs text-muted-foreground">
            {circuitClosed
              ? "електроліз іде"
              : keyClosed && onBalance
                ? "катод поза розчином — коло розімкнене"
                : "ключ розімкнений"}
          </div>
        </div>
        <div className="rounded border p-2">
          Терези: <strong>{balance.toFixed(2)} г</strong>
          <div className="text-xs text-muted-foreground">
            {onBalance ? (wet ? "електрод мокрий" : "електрод сухий") : "катод у розчині"}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <button
          type="button"
          className="rounded border px-3 py-1"
          style={{ background: onBalance ? "#e7f5ff" : undefined }}
          onClick={toggleCathode}
        >
          {onBalance ? "Повернути катод у тримач" : "Вийняти катод і покласти на терези"}
        </button>
        <button
          type="button"
          className="rounded border px-3 py-1"
          disabled={!onBalance || !wet}
          onClick={() => setWet(false)}
        >
          Промокнути серветкою
        </button>
        <button
          type="button"
          className="rounded border px-3 py-1"
          style={{ background: keyClosed ? "#ffe3e3" : undefined }}
          onClick={() => setKeyClosed((k) => !k)}
        >
          {keyClosed ? "Розімкнути ключ" : "Замкнути ключ"}
        </button>
        <label className="flex items-center gap-2">
          реостат:
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={pct}
            onChange={(e) => setPct(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
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
        <button type="button" className="rounded border px-3 py-1" onClick={reset}>
          Скинути
        </button>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Сила струму з часом трохи змінюється — підтримуйте її незмінною за
        допомогою реостата. Паузою зручно зафіксувати показ, поки ви
        записуєте результат. Мокрий електрод важчий — перед зважуванням
        його потрібно промокнути серветкою.
      </p>

    </div>
  );
}
