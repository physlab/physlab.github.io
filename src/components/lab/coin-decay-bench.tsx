"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Virtual version of the coin-tossing model of radioactive decay (lab No. 8).
 *
 * It follows the real procedure step by step: shake the paper cup with the
 * coins, pour them onto the tray, count the "heads" (nuclei that have not
 * decayed) and put them back into the cup, move the "tails" (decayed nuclei)
 * into the second cup. After each throw the numbers are written to the
 * table cells N_s{series}_{n} and Nd_s{series}_{n} (if auto-fill is on), and
 * the N(n) chart on the page updates.
 */

const N0 = 128;
const MAX_THROWS = 8;
const R = 11; // coin radius, px

// scene geometry (SVG px)
const W = 760;
const H = 420;
const TRAY = { x: 165, y: 60, w: 430, h: 320 };
const CUP_A = { x: 80, y: 250 }; // cup with coins that have not decayed
const CUP_B = { x: 680, y: 250 }; // cup with decayed coins
const MOUTH_A = { x: 100, y: 110 };

type Phase = "idle" | "shaking" | "landing" | "landed" | "collecting" | "done";

type Coin = { id: number; x: number; y: number; heads: boolean };

function setCell(id: string, value: string) {
  const el = document.getElementById(id) as HTMLInputElement | null;
  if (!el) return;
  const setter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value",
  )?.set;
  setter?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

function scatter(count: number): Coin[] {
  const coins: Coin[] = [];
  const minD = R * 2 + 2;
  for (let i = 0; i < count; i++) {
    let best = { x: 0, y: 0 };
    for (let attempt = 0; attempt < 80; attempt++) {
      const x = TRAY.x + R + 6 + Math.random() * (TRAY.w - 2 * R - 12);
      const y = TRAY.y + R + 6 + Math.random() * (TRAY.h - 2 * R - 12);
      best = { x, y };
      if (coins.every((c) => (c.x - x) ** 2 + (c.y - y) ** 2 > minD * minD)) break;
    }
    coins.push({ id: i, x: best.x, y: best.y, heads: Math.random() < 0.5 });
  }
  return coins;
}

function binomialHalf(n: number): number {
  let k = 0;
  for (let i = 0; i < n; i++) if (Math.random() < 0.5) k++;
  return k;
}

function CoinShape({ heads, size = R }: { heads: boolean; size?: number }) {
  return (
    <g>
      <circle r={size} fill={heads ? "#f2c94c" : "#cfd4da"} stroke={heads ? "#b8860b" : "#7b8794"} strokeWidth={1.4} />
      <circle r={size - 3} fill="none" stroke={heads ? "#d9a520" : "#a9b0b8"} strokeWidth={0.8} />
      <text y={size * 0.36} textAnchor="middle" fontSize={size * 1.05} fontWeight={700} fill={heads ? "#7a5a00" : "#4b5563"}>
        {heads ? "Г" : "Ц"}
      </text>
    </g>
  );
}

function Cup({ x, y, label, count, shake, accent }: { x: number; y: number; label: string; count: number; shake?: boolean; accent: string }) {
  const pile = Math.min(14, Math.ceil(count / 9));
  return (
    <g transform={`translate(${x},${y})`}>
      <g className={shake ? "coin-cup-shake" : undefined}>
        <path d="M-52,-90 L52,-90 L40,70 L-40,70 Z" fill="#f4efe6" stroke="#8a7f6a" strokeWidth={2.5} />
        <path d="M-50,-72 L50,-72" stroke="#cfc6b3" strokeWidth={2} />
        {Array.from({ length: pile }, (_, i) => (
          <circle key={i} cx={-24 + (i % 5) * 12} cy={52 - Math.floor(i / 5) * 9} r={5} fill={accent} stroke="#6b5b2a" strokeWidth={0.8} />
        ))}
      </g>
      <text y={104} textAnchor="middle" fontSize={13} fill="#374151">
        {label}
      </text>
      <text y={124} textAnchor="middle" fontSize={17} fontWeight={700} fill="#111827">
        {count}
      </text>
    </g>
  );
}

export function CoinDecayBench() {
  const [series, setSeries] = useState(1);
  const [n, setN] = useState(0);
  const [alive, setAlive] = useState(N0);
  const [dead, setDead] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [coins, setCoins] = useState<Coin[]>([]);
  const [launched, setLaunched] = useState(false);
  const [collecting, setCollecting] = useState(false);
  const [autoFill, setAutoFill] = useState(true);
  const timers = useRef<number[]>([]);

  // exploration panel (creative task)
  const [exploreN0, setExploreN0] = useState(128);
  const [explore, setExplore] = useState<null | { n0: number; rows: Array<{ n: number; theory: number; mean: number; dev: number }> }>(null);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const heads = coins.filter((c) => c.heads).length;
  const tails = coins.length - heads;

  const record = (s: number, step: number, headsCount: number, tailsCount: number) => {
    if (!autoFill) return;
    setCell(`N_s${s}_${step}`, String(headsCount));
    setCell(`Nd_s${s}_${step}`, String(tailsCount));
  };

  const finished = (a: number, step: number) => a <= 1 || step >= MAX_THROWS;

  const shakeAndPour = () => {
    if (phase !== "idle") return;
    setPhase("shaking");
    later(() => {
      setCoins(scatter(alive));
      setLaunched(false);
      setCollecting(false);
      setPhase("landing");
      requestAnimationFrame(() => requestAnimationFrame(() => setLaunched(true)));
      later(() => setPhase("landed"), 1000);
    }, 800);
  };

  const collect = () => {
    if (phase !== "landed") return;
    setPhase("collecting");
    setCollecting(true);
    later(() => {
      const step = n + 1;
      const h = coins.filter((c) => c.heads).length;
      const t = coins.length - h;
      record(series, step, h, t);
      setN(step);
      setAlive(h);
      setDead((d) => d + t);
      setCoins([]);
      setCollecting(false);
      setPhase(finished(h, step) ? "done" : "idle");
    }, 900);
  };

  const autoFinish = () => {
    if (phase !== "idle") return;
    let a = alive;
    let step = n;
    let d = dead;
    while (!finished(a, step)) {
      step += 1;
      const h = binomialHalf(a);
      record(series, step, h, a - h);
      d += a - h;
      a = h;
    }
    setN(step);
    setAlive(a);
    setDead(d);
    setPhase("done");
  };

  const clearSeriesCells = (s: number) => {
    for (let k = 1; k <= MAX_THROWS; k++) {
      setCell(`N_s${s}_${k}`, "");
      setCell(`Nd_s${s}_${k}`, "");
    }
  };

  const resetCurrent = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
    if (autoFill) clearSeriesCells(series);
    setN(0);
    setAlive(N0);
    setDead(0);
    setCoins([]);
    setCollecting(false);
    setPhase("idle");
  };

  const nextSeries = () => {
    if (series >= 3) return;
    setSeries(series + 1);
    setN(0);
    setAlive(N0);
    setDead(0);
    setCoins([]);
    setPhase("idle");
  };

  const runExplore = () => {
    const runs = 5;
    const sums = Array(MAX_THROWS + 1).fill(0);
    for (let r = 0; r < runs; r++) {
      let a = exploreN0;
      sums[0] += a;
      for (let k = 1; k <= MAX_THROWS; k++) {
        a = binomialHalf(a);
        sums[k] += a;
      }
    }
    const rows = sums.map((sum, k) => {
      const theory = exploreN0 * Math.pow(2, -k);
      const mean = sum / runs;
      return { n: k, theory, mean, dev: Math.abs(mean - theory) / theory * 100 };
    });
    setExplore({ n0: exploreN0, rows });
  };

  const coinPos = (c: Coin) => {
    if (collecting) {
      const dest = c.heads ? { x: CUP_A.x, y: CUP_A.y - 40 } : { x: CUP_B.x, y: CUP_B.y - 40 };
      return { ...dest, scale: 0.5, opacity: 0 };
    }
    if (!launched) return { x: MOUTH_A.x, y: MOUTH_A.y, scale: 1, opacity: 1 };
    return { x: c.x, y: c.y, scale: 1, opacity: 1 };
  };

  const hint =
    phase === "idle"
      ? n === 0
        ? "Покладіть 128 монет у стакан — вони вже там. Перемішайте їх і висипте на тацю."
        : `Кидок ${n} виконано. Перемішайте монети, що залишилися, і висипте їх знову.`
      : phase === "shaking"
        ? "Перемішування монет у стакані…"
        : phase === "landing"
          ? "Монети падають на тацю…"
          : phase === "landed"
            ? "Полічіть «герби» (Г) і «цифри» (Ц), потім зберіть монети."
            : phase === "collecting"
              ? "«Герби» повертаються до стакана, «цифри» — до другого стакана…"
              : "Серію завершено: " +
                (alive <= 1 ? "залишилась одна монета з «гербом» (або жодної)." : `виконано максимум ${MAX_THROWS} кидків.`);

  return (
    <div className="my-4 rounded-lg border p-3" style={{ background: "rgba(0,0,0,0.02)" }}>
      <style>{`
        @keyframes coin-spin { 0%{transform:scaleX(1)} 20%{transform:scaleX(-0.15)} 40%{transform:scaleX(1)} 60%{transform:scaleX(-0.15)} 80%{transform:scaleX(1)} 100%{transform:scaleX(1)} }
        @keyframes coin-cup-shake { 0%,100%{transform:rotate(0deg)} 15%{transform:rotate(-9deg) translateX(-4px)} 35%{transform:rotate(8deg) translateX(4px)} 55%{transform:rotate(-7deg) translateX(-3px)} 75%{transform:rotate(6deg) translateX(3px)} }
        .coin-spin { transform-box: fill-box; transform-origin: center; animation: coin-spin 0.9s ease-out; }
        .coin-cup-shake { transform-box: fill-box; transform-origin: 50% 100%; animation: coin-cup-shake 0.8s ease-in-out; }
      `}</style>

      <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
        <span>
          Серія: <strong>{series} / 3</strong>
        </span>
        <span>
          Кидок: <strong>{n} / {MAX_THROWS}</strong>
        </span>
        <span>
          Не розпалися (N): <strong>{alive}</strong>
        </span>
        <span>
          Розпалися: <strong>{N0 - alive}</strong>
        </span>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full select-none" role="img" aria-label="Стакани з монетами та таця">
        {/* tray */}
        <rect x={TRAY.x} y={TRAY.y} width={TRAY.w} height={TRAY.h} rx={14} fill="#3b6b4f" stroke="#244433" strokeWidth={4} />
        <rect x={TRAY.x + 8} y={TRAY.y + 8} width={TRAY.w - 16} height={TRAY.h - 16} rx={10} fill="#4d8a66" />
        <text x={TRAY.x + TRAY.w / 2} y={TRAY.y - 12} textAnchor="middle" fontSize={13} fill="#6b7280">
          таця
        </text>

        <Cup x={CUP_A.x} y={CUP_A.y} label="стакан (не розпалися)" count={alive} shake={phase === "shaking"} accent="#f2c94c" />
        <Cup x={CUP_B.x} y={CUP_B.y} label="стакан (розпалися)" count={dead} accent="#cfd4da" />

        {coins.map((c, i) => {
          const p = coinPos(c);
          return (
            <g
              key={c.id}
              style={{
                transform: `translate(${p.x}px, ${p.y}px) scale(${p.scale})`,
                opacity: p.opacity,
                transition: collecting
                  ? `transform 0.8s ease-in ${(i % 8) * 0.02}s, opacity 0.8s ease-in`
                  : "transform 0.75s cubic-bezier(.2,.8,.3,1)",
                transitionDelay: collecting ? undefined : `${(i % 16) * 0.015}s`,
              }}
            >
              <g className={phase === "landing" ? "coin-spin" : undefined}>
                <CoinShape heads={c.heads} />
              </g>
            </g>
          );
        })}

        {phase === "landed" && (
          <g>
            <rect x={TRAY.x + TRAY.w / 2 - 120} y={TRAY.y + TRAY.h + 8} width={240} height={26} rx={6} fill="#ffffff" stroke="#9ca3af" />
            <text x={TRAY.x + TRAY.w / 2} y={TRAY.y + TRAY.h + 26} textAnchor="middle" fontSize={14} fill="#111827">
              «герб» (Г): {heads} · «цифра» (Ц): {tails}
            </text>
          </g>
        )}
      </svg>

      <p className="text-sm" style={{ margin: "6px 0 10px" }}>
        {hint}
      </p>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button type="button" className="rounded border px-3 py-1" disabled={phase !== "idle"} onClick={shakeAndPour}>
          Перемішати й висипати на тацю
        </button>
        <button type="button" className="rounded border px-3 py-1" disabled={phase !== "landed"} onClick={collect}>
          Зібрати монети
        </button>
        <button type="button" className="rounded border px-3 py-1" disabled={phase !== "idle"} onClick={autoFinish}>
          Завершити серію автоматично
        </button>
        <button type="button" className="rounded border px-3 py-1" onClick={resetCurrent}>
          Почати серію спочатку
        </button>
        <button type="button" className="rounded border px-3 py-1" disabled={phase !== "done" || series >= 3} onClick={nextSeries}>
          Наступна серія →
        </button>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={autoFill} onChange={(e) => setAutoFill(e.target.checked)} />
          автоматично заповнювати таблицю
        </label>
      </div>

      <details className="mt-4 text-sm">
        <summary className="cursor-pointer font-medium">
          Дослідження для творчого завдання: інша кількість монет
        </summary>
        <p className="mt-2">
          Оберіть кількість монет і виконайте 5 серій по 8 кидків. Таблиця
          показує середнє число монет, що не розпалися, порівняно з теорією
          N₀·2⁻ⁿ. Ці дані не потрапляють у таблиці роботи.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <select value={exploreN0} onChange={(e) => setExploreN0(Number(e.target.value))} className="rounded border px-2 py-1">
            <option value={43}>43 монети (÷3)</option>
            <option value={128}>128 монет</option>
            <option value={384}>384 монети (×3)</option>
          </select>
          <button type="button" className="rounded border px-3 py-1" onClick={runExplore}>
            Виконати 5 серій
          </button>
        </div>
        {explore && (
          <div className="mt-2 overflow-x-auto">
            <table className="text-xs" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th className="border px-2 py-1">n</th>
                  <th className="border px-2 py-1">теорія</th>
                  <th className="border px-2 py-1">середнє N</th>
                  <th className="border px-2 py-1">відхилення, %</th>
                </tr>
              </thead>
              <tbody>
                {explore.rows.map((r) => (
                  <tr key={r.n}>
                    <td className="border px-2 py-1">{r.n}</td>
                    <td className="border px-2 py-1">{r.theory.toFixed(1)}</td>
                    <td className="border px-2 py-1">{r.mean.toFixed(1)}</td>
                    <td className="border px-2 py-1">{r.dev.toFixed(0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </details>
    </div>
  );
}
