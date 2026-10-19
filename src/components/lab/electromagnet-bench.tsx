"use client";

import { useEffect, useRef, useState, type ReactElement } from "react";
import { useEased, useSvgDrag, type Pt } from "./svg-drag";

/**
 * Virtual set-up for the "electromagnet" lab.
 *
 *  • «Установка» — electric circuit (source, key, ammeter, rheostat) and an
 *    electromagnet: the number of turns of two coils can be changed, the iron core
 *    can be taken out, the winding scheme can be chosen, the source can be
 *    reversed. Iron filings cling to the poles; a draggable compass (magnetic
 *    needle) shows the poles.
 *  • «Динамометр» — the electromagnet holds an iron plate; the dynamometer pulls
 *    it off and shows the maximum force.
 *
 * Physics (simplified): B ∝ N·I·μ (μ = 4 with the core, 1 without), force ∝ (N·I·μ)².
 */

const EMF = 6; // V
const R_RH_MIN = 0.5; // Ω
const R_RH_MAX = 12; // Ω
const MU_CORE = 4;
const C_FORCE = 2.5e-6; // N per (turns·A)²
const I_SCALE_MAX = 3; // A, ammeter scale
const F_SCALE_MAX = 2; // N, dynamometer scale

const coilR = (n: number) => 0.5 + 0.02 * n;
const rheoR = (pct: number) => R_RH_MIN + ((R_RH_MAX - R_RH_MIN) * pct) / 100;

// geometry of the electromagnet in the main picture
const COIL_X0 = 390;
const COIL_X1 = 590;
const CORE_X0 = 360;
const CORE_X1 = 620;
const MAG_Y = 200;
const COIL_Y0 = 178;
const COIL_Y1 = 222;
const RH_X0 = 300;
const RH_X1 = 430;

type Winding = "same" | "opposite";

/* ------------------------------- helpers ---------------------------------- */

const rand = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Circular dial with a needle. */
function Dial({
  cx,
  cy,
  r,
  max,
  major,
  minor,
  value,
  unit,
  marker,
}: {
  cx: number;
  cy: number;
  r: number;
  max: number;
  major: number;
  minor: number;
  value: number;
  unit: string;
  marker?: number | null;
}) {
  const ang = (v: number) => ((210 - 240 * (Math.min(Math.max(v, 0), max * 1.04) / max)) * Math.PI) / 180;
  const pt = (v: number, rr: number) => ({ x: cx + rr * Math.cos(ang(v)), y: cy - rr * Math.sin(ang(v)) });
  const steps = Math.round(max / minor);
  const ticks = Array.from({ length: steps + 1 }, (_, k) => k * minor);
  const needle = pt(value, r - 8);
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#ffffff" stroke="#374151" strokeWidth={2.5} />
      {ticks.map((v, i) => {
        const isMajor = Math.abs(v / major - Math.round(v / major)) < 1e-6;
        const a = pt(v, r - 4);
        const b = pt(v, r - (isMajor ? 13 : 8));
        const lab = pt(v, r - 22);
        return (
          <g key={i}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#111827" strokeWidth={isMajor ? 1.6 : 0.8} />
            {isMajor && (
              <text x={lab.x} y={lab.y + 3} textAnchor="middle" fontSize={r > 48 ? 10 : 9} fill="#111827">
                {String(v).replace(".", ",")}
              </text>
            )}
          </g>
        );
      })}
      {marker != null && marker > 0 && (
        <line
          x1={pt(marker, r - 4).x}
          y1={pt(marker, r - 4).y}
          x2={pt(marker, r - 16).x}
          y2={pt(marker, r - 16).y}
          stroke="#2563eb"
          strokeWidth={3}
        />
      )}
      <text x={cx} y={cy + r * 0.52} textAnchor="middle" fontSize={14} fontWeight="bold" fill="#111827">
        {unit}
      </text>
      <line x1={cx} y1={cy} x2={needle.x} y2={needle.y} stroke="#dc2626" strokeWidth={2.5} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={4} fill="#111827" />
    </g>
  );
}

/** Iron filings clinging to a pole. side: −1 left end, +1 right end, 0 middle. */
function Filings({ x, side, count, seed }: { x: number; side: -1 | 0 | 1; count: number; seed: number }) {
  const lines: ReactElement[] = [];
  const spread = 5 + Math.sqrt(count) * 2.6;
  for (let j = 0; j < count; j++) {
    const a = (rand(seed + j * 3) - 0.5) * 2.4;
    const r = 2 + rand(seed + j * 3 + 1) * spread;
    let px: number;
    let py: number;
    let qx: number;
    let qy: number;
    if (side === 0) {
      const up = rand(seed + j * 3 + 2) < 0.5;
      px = x + (rand(seed + j * 3 + 1) - 0.5) * 70;
      py = up ? COIL_Y0 - 1 - rand(seed + j) * (3 + spread * 0.5) : COIL_Y1 + 1 + rand(seed + j) * (3 + spread * 0.5);
      qx = px + (rand(seed + j * 5) - 0.5) * 3;
      qy = py + (up ? -4 : 4);
    } else {
      px = x + side * r * Math.cos(a);
      py = MAG_Y + r * Math.sin(a) * 1.3;
      qx = px + side * Math.cos(a) * 4;
      qy = py + Math.sin(a) * 4;
    }
    lines.push(<line key={j} x1={px} y1={py} x2={qx} y2={qy} stroke="#1f2937" strokeWidth={1.4} strokeLinecap="round" />);
  }
  return <g>{lines}</g>;
}

/* ================================== bench =================================== */

type Tab = "setup" | "dyn";

export function ElectromagnetBench() {
  const [tab, setTab] = useState<Tab>("setup");
  const [turns1, setTurns1] = useState(40);
  const [turns2, setTurns2] = useState(80);
  const [active, setActive] = useState<1 | 2>(2);
  const [coreIn, setCoreIn] = useState(true);
  const [keyClosed, setKeyClosed] = useState(false);
  const [dirSign, setDirSign] = useState<1 | -1>(1);
  const [pct, setPct] = useState(100);
  const [winding, setWinding] = useState<Winding>("same");
  const [compassPos, setCompassPos] = useState<Pt>({ x: 110, y: 372 });

  const svgRef = useRef<SVGSVGElement>(null);
  const { drag, start } = useSvgDrag(svgRef, 700, 430, (id, x, y) => {
    if (id === "compass") setCompassPos({ x: Math.max(24, Math.min(676, x)), y: Math.max(24, Math.min(406, y)) });
    if (id === "rheo") setPct(Math.max(0, Math.min(100, Math.round(((x - RH_X0) / (RH_X1 - RH_X0)) * 100))));
  });

  const pctEff = drag?.id === "rheo" ? Math.max(0, Math.min(100, ((drag.x - RH_X0) / (RH_X1 - RH_X0)) * 100)) : pct;
  const xs = RH_X0 + ((RH_X1 - RH_X0) * pctEff) / 100;

  // physics
  const N = active === 1 ? turns1 : turns2;
  const I = keyClosed ? EMF / (coilR(N) + rheoR(pctEff)) : 0;
  const mu = coreIn ? MU_CORE : 1;
  const bNorm = (N * I * mu) / 480;
  const forceRaw = C_FORCE * (N * I * mu) ** 2 * (winding === "opposite" ? 0.25 : 1);

  const needleI = useEased(Math.min(I, I_SCALE_MAX * 1.04), 0.2);

  // poles (positions in the picture, signs: + north, − south)
  const xL = coreIn ? CORE_X0 : COIL_X0;
  const xR = coreIn ? CORE_X1 : COIL_X1;
  const xM = (COIL_X0 + COIL_X1) / 2;
  const dL = dirSign;
  const dR = winding === "same" ? dirSign : (-dirSign as 1 | -1);
  const qh = 12000 * bNorm;
  const poles = [
    { x: xL, s: -dL * qh },
    { x: xM, s: (dL - dR) * qh },
    { x: xR, s: dR * qh },
  ];

  // compass needle
  const cpos = drag?.id === "compass" ? drag : compassPos;
  let fx = 0;
  let fy = 0.5; // the Earth's field points to the north (up the picture)
  poles.forEach((p) => {
    if (p.s === 0) return;
    const dx = cpos.x - p.x;
    const dy = -(cpos.y - MAG_Y);
    const rr = Math.max(Math.hypot(dx, dy), 14);
    fx += (p.s * dx) / rr ** 3;
    fy += (p.s * dy) / rr ** 3;
  });
  const needleAngle = (Math.atan2(fx, fy) * 180) / Math.PI;

  // filings
  const totalFilings = Math.min(90, Math.round(Math.min(forceRaw, 2.5) * 45));
  const sumAbs = poles.reduce((s, p) => s + Math.abs(p.s), 0) || 1;
  const counts = poles.map((p) => Math.round((totalFilings * Math.abs(p.s)) / sumAbs));

  const overload = I > I_SCALE_MAX;

  // turns drawing
  const turnLines = Math.min(N, 90);
  const lineX = (i: number) => COIL_X0 + 4 + ((COIL_X1 - COIL_X0 - 8) * (i + 0.5)) / turnLines;

  const compassNode = (
    <g
      transform={`translate(${cpos.x},${cpos.y})`}
      style={{ cursor: drag?.id === "compass" ? "grabbing" : "grab", touchAction: "none" }}
      onPointerDown={(e) => start(e, "compass", cpos)}
    >
      <title>Магнітна стрілка (компас) — перетягніть</title>
      <circle r={26} fill="#ffffff" stroke="#374151" strokeWidth={2} />
      <text y={-14} textAnchor="middle" fontSize={8} fill="#6b7280">Пн</text>
      <g style={{ transform: `rotate(${needleAngle}deg)`, transition: "transform 0.25s" }}>
        <polygon points="-4,0 4,0 0,-19" fill="#dc2626" />
        <polygon points="-4,0 4,0 0,19" fill="#2563eb" />
      </g>
      <circle r={2.5} fill="#111827" />
    </g>
  );

  return (
    <div className="my-4 rounded-lg border p-3" style={{ background: "rgba(0,0,0,0.02)" }}>
      <div className="flex flex-wrap gap-2 text-sm">
        {(
          [
            ["setup", "Установка"],
            ["dyn", "Динамометр"],
          ] as Array<[Tab, string]>
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className="rounded border px-3 py-1"
            style={{ background: tab === id ? "#e7f5ff" : undefined, fontWeight: tab === id ? 600 : undefined }}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ---------------------------- main picture ---------------------------- */}
      <div style={{ display: tab === "setup" ? undefined : "none" }}>
        <svg
          ref={svgRef}
          viewBox="0 0 700 430"
          className="w-full select-none"
          style={{ touchAction: "none", cursor: drag ? "grabbing" : undefined }}
          role="img"
          aria-label="Електричне коло з електромагнітом, магнітна стрілка та залізні ошурки"
        >
          <rect x={0} y={320} width={700} height={110} fill="#e5e7eb" />
          <line x1={0} x2={700} y1={320} y2={320} stroke="#9ca3af" />

          {/* wires */}
          <g fill="none" stroke="#374151" strokeWidth={2.5}>
            <path d="M40,150 L40,100 L90,100" />
            <path d="M140,100 L164,100" />
            <path d="M256,100 L300,100" />
            <path d={`M${xs},82 L${xs},64 L590,64 L590,${COIL_Y0}`} />
            <path d={`M40,162 L40,270 L390,270 L390,${COIL_Y1}`} />
          </g>

          {/* source */}
          <line x1={26} x2={54} y1={dirSign === 1 ? 150 : 162} y2={dirSign === 1 ? 150 : 162} stroke="#111827" strokeWidth={3.5} />
          <line x1={32} x2={48} y1={dirSign === 1 ? 162 : 150} y2={dirSign === 1 ? 162 : 150} stroke="#111827" strokeWidth={3.5} />
          <text x={60} y={dirSign === 1 ? 148 : 160} fontSize={13} fill="#dc2626">+</text>
          <text x={60} y={dirSign === 1 ? 166 : 154} fontSize={13} fill="#111827">{"\u2212"}</text>
          <text x={10} y={190} fontSize={11} fill="#374151">джерело 6 В</text>

          {/* key */}
          <circle cx={90} cy={100} r={4} fill="#9ca3af" stroke="#4b5563" />
          <circle cx={140} cy={100} r={4} fill="#9ca3af" stroke="#4b5563" />
          {keyClosed ? (
            <line x1={90} y1={100} x2={140} y2={100} stroke="#111827" strokeWidth={4} />
          ) : (
            <line x1={90} y1={100} x2={132} y2={76} stroke="#111827" strokeWidth={4} />
          )}
          <text x={115} y={124} textAnchor="middle" fontSize={11} fill="#374151">Ключ</text>

          {/* ammeter */}
          <Dial cx={210} cy={100} r={46} max={I_SCALE_MAX} major={0.5} minor={0.1} value={needleI} unit="А" />
          <text x={210} y={164} textAnchor="middle" fontSize={11} fill="#374151">Амперметр</text>

          {/* rheostat */}
          <rect x={RH_X0} y={88} width={RH_X1 - RH_X0} height={24} fill="#e5e7eb" stroke="#6b7280" rx={4} />
          {Array.from({ length: 13 }, (_, i) => (
            <line key={i} x1={RH_X0 + 6 + i * 10} x2={RH_X0 + 6 + i * 10} y1={92} y2={108} stroke="#b45309" strokeWidth={2} />
          ))}
          <rect x={RH_X0} y={88} width={Math.max(0, xs - RH_X0)} height={24} fill="rgba(251,146,60,0.28)" rx={4} />
          <g
            style={{ cursor: drag?.id === "rheo" ? "grabbing" : "ew-resize", touchAction: "none" }}
            onPointerDown={(e) => start(e, "rheo", { x: xs, y: 82 })}
          >
            <title>Повзунок реостата — перетягніть</title>
            <rect x={xs - 14} y={60} width={28} height={30} fill="transparent" />
            <polygon points={`${xs - 8},80 ${xs + 8},80 ${xs},89`} fill="#111827" />
          </g>
          <text x={365} y={132} textAnchor="middle" fontSize={11} fill="#374151">Реостат (перетягніть повзунок)</text>

          {/* electromagnet */}
          <rect x={COIL_X0} y={COIL_Y0} width={COIL_X1 - COIL_X0} height={COIL_Y1 - COIL_Y0} fill="rgba(180,100,40,0.18)" stroke="#92400e" rx={4} />
          {coreIn && <rect x={CORE_X0} y={190} width={CORE_X1 - CORE_X0} height={20} fill="#9ca3af" stroke="#4b5563" rx={2} />}
          {coreIn && <rect x={CORE_X0 + 2} y={192} width={CORE_X1 - CORE_X0 - 4} height={4} fill="#d1d5db" />}
          {Array.from({ length: turnLines }, (_, i) => {
            const x = lineX(i);
            const left = x < (COIL_X0 + COIL_X1) / 2;
            const sl = winding === "same" || left ? 1 : -1;
            return <line key={i} x1={x - 1.5 * sl} y1={COIL_Y1} x2={x + 1.5 * sl} y2={COIL_Y0} stroke="#b45309" strokeWidth={1.3} />;
          })}
          <circle cx={COIL_X0} cy={COIL_Y1} r={3} fill="#111827" />
          <circle cx={COIL_X1} cy={COIL_Y0} r={3} fill="#111827" />
          <text x={xM} y={252} textAnchor="middle" fontSize={11} fill="#374151">
            електромагніт {active} · {N} витків
          </text>
          {!coreIn && (
            <g>
              <rect x={190} y={388} width={260} height={18} fill="#9ca3af" stroke="#4b5563" rx={2} />
              <text x={320} y={424} textAnchor="middle" fontSize={11} fill="#374151">залізний стрижень (вийнято)</text>
            </g>
          )}

          {/* filings */}
          {keyClosed &&
            totalFilings > 0 &&
            poles.map((p, i) =>
              counts[i] > 0 ? (
                <Filings key={i} x={p.x} side={i === 0 ? -1 : i === 2 ? 1 : 0} count={counts[i]} seed={i * 101 + 7} />
              ) : null,
            )}
          <g>
            {Array.from({ length: 26 }, (_, j) => (
              <line
                key={j}
                x1={560 + rand(j) * 90}
                y1={355 + rand(j + 40) * 14}
                x2={560 + rand(j) * 90 + 3}
                y2={355 + rand(j + 40) * 14 + 2}
                stroke="#1f2937"
                strokeWidth={1.6}
                strokeLinecap="round"
              />
            ))}
            <text x={605} y={395} textAnchor="middle" fontSize={11} fill="#374151">залізні ошурки</text>
          </g>

          {compassNode}
        </svg>
      </div>

      {/* ---------------------------- dynamometer ----------------------------- */}
      <div style={{ display: tab === "dyn" ? undefined : "none" }}>
        <DynamometerStation
          force={keyClosed ? forceRaw : 0}
          current={I}
          needleI={needleI}
          coreIn={coreIn}
          turns={N}
          winding={winding}
        />
      </div>

      {/* ------------------------------ controls ------------------------------ */}
      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
        <Stepper label="Електромагніт 1: витків" value={turns1} onChange={setTurns1} />
        <Stepper label="Електромагніт 2: витків" value={turns2} onChange={setTurns2} />
        <span>У колі:</span>
        {([1, 2] as const).map((k) => (
          <button
            key={k}
            type="button"
            className="rounded border px-3 py-1"
            style={{ background: active === k ? "#e7f5ff" : undefined }}
            onClick={() => setActive(k)}
          >
            електромагніт {k}
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
        <button
          type="button"
          className="rounded border px-3 py-1"
          style={{ background: keyClosed ? "#ffe3e3" : undefined }}
          onClick={() => setKeyClosed((k) => !k)}
        >
          {keyClosed ? "Розімкнути ключ" : "Замкнути ключ"}
        </button>
        <button type="button" className="rounded border px-3 py-1" onClick={() => setDirSign((d) => (d === 1 ? -1 : 1))}>
          Змінити полярність джерела
        </button>
        <button type="button" className="rounded border px-3 py-1" onClick={() => setCoreIn((c) => !c)}>
          {coreIn ? "Вийняти стрижень з обмотки" : "Вставити стрижень в обмотку"}
        </button>
        <label className="flex items-center gap-2">
          обмотка:
          <select value={winding} onChange={(e) => setWinding(e.target.value as Winding)} className="rounded border px-2 py-1">
            <option value="same">усі витки в одному напрямку</option>
            <option value="opposite">друга половина витків — у протилежному напрямку</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          реостат:
          <input type="range" min={0} max={100} step={1} value={Math.round(pctEff)} onChange={(e) => setPct(Number(e.target.value))} />
        </label>
      </div>

      {overload && (
        <p className="mt-2 rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">
          Сила струму перевищує межу шкали амперметра (3 А)! Збільште опір реостата.
        </p>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        Реостат змінює силу струму: пересувайте повзунок на схемі (або скористайтеся повзунком «реостат»);
        що більший опір реостата, то менший струм. Магнітну стрілку (компас) можна перетягувати до кінців
        електромагніту. Кількість витків кожного електромагніту змінюється кнопками «−» і «+».
      </p>
    </div>
  );
}

function Stepper({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <span className="flex items-center gap-1">
      {label}
      <button type="button" className="rounded border px-2" onClick={() => onChange(Math.max(10, value - 10))} aria-label="менше витків">
        −
      </button>
      <strong style={{ minWidth: 24, textAlign: "center" }}>{value}</strong>
      <button type="button" className="rounded border px-2" onClick={() => onChange(Math.min(90, value + 10))} aria-label="більше витків">
        +
      </button>
    </span>
  );
}

/* ============================ dynamometer station =========================== */

function DynamometerStation({
  force,
  current,
  needleI,
  coreIn,
  turns,
  winding,
}: {
  force: number;
  current: number;
  needleI: number;
  coreIn: boolean;
  turns: number;
  winding: Winding;
}) {
  type Pull = "idle" | "pulling" | "released";
  const [pull, setPull] = useState<Pull>("idle");
  const [maxReading, setMaxReading] = useState<number | null>(null);

  const fDisp = Math.min(force, F_SCALE_MAX * 1.04);
  const held = force > 0.01;
  const target = pull === "pulling" ? fDisp : 0;
  const reading = useEased(target, 0.035);

  // when the pulling force reaches the holding force, the plate comes off
  useEffect(() => {
    if (pull === "pulling" && reading >= fDisp * 0.995 - 0.001) {
      setMaxReading(fDisp);
      setPull("released");
    }
  }, [pull, reading, fDisp]);

  const X = 170;
  const poleY = coreIn ? 210 : 170;
  const coilLines = Math.min(turns, 45);
  const plateAttached = pull !== "released" && held;
  const plateY = plateAttached ? poleY + 2 : 384;

  return (
    <div className="my-2">
      <svg viewBox="0 0 700 430" className="w-full select-none" role="img" aria-label="Електромагніт, залізна пластина та динамометр">
        <rect x={0} y={400} width={700} height={30} fill="#e5e7eb" />
        <line x1={0} x2={700} y1={400} y2={400} stroke="#9ca3af" />

        {/* electromagnet (vertical) */}
        <rect x={X - 30} y={60} width={60} height={110} fill="rgba(180,100,40,0.18)" stroke="#92400e" rx={4} />
        {coreIn && <rect x={X - 10} y={30} width={20} height={180} fill="#9ca3af" stroke="#4b5563" rx={2} />}
        {Array.from({ length: coilLines }, (_, i) => {
          const y = 64 + ((102 * (i + 0.5)) / coilLines);
          const upper = y < 115;
          const sl = winding === "same" || upper ? 1 : -1;
          return <line key={i} x1={X - 30} y1={y - 1.2 * sl} x2={X + 30} y2={y + 1.2 * sl} stroke="#b45309" strokeWidth={1.2} />;
        })}
        <text x={X + 44} y={115} fontSize={11} fill="#374151">{turns} витків</text>

        {/* plate + string to the dynamometer */}
        {plateAttached && (
          <g>
            <rect x={X - 38} y={plateY} width={76} height={14} fill="#6b7280" stroke="#374151" rx={2} />
            <line x1={X} y1={plateY + 14} x2={X} y2={286} stroke="#6b7280" strokeWidth={2} />
          </g>
        )}
        {!plateAttached && (
          <g>
            <rect x={X + 120} y={plateY} width={76} height={14} fill="#6b7280" stroke="#374151" rx={2} />
            <text x={X + 158} y={420} textAnchor="middle" fontSize={11} fill="#374151">
              {held ? "пластина відірвалась" : "пластина лежить (без струму не притягується)"}
            </text>
          </g>
        )}

        {/* dynamometer dial */}
        <Dial cx={X} cy={336} r={50} max={F_SCALE_MAX} major={0.5} minor={0.05} value={reading} unit="Н" marker={maxReading} />
        <text x={X + 62} y={340} fontSize={11} fill="#374151">динамометр</text>

        {/* ammeter */}
        <Dial cx={480} cy={130} r={44} max={I_SCALE_MAX} major={0.5} minor={0.1} value={needleI} unit="А" />
        <text x={480} y={192} textAnchor="middle" fontSize={11} fill="#374151">амперметр</text>
        <text x={480} y={230} textAnchor="middle" fontSize={12} fill="#374151">
          {current > 0 ? "коло замкнене" : "струму немає"}
        </text>
      </svg>
      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
        <button
          type="button"
          className="rounded border px-3 py-1"
          disabled={pull !== "idle" || !held}
          onClick={() => {
            setMaxReading(null);
            setPull("pulling");
          }}
        >
          Потягнути динамометр (відірвати пластину)
        </button>
        <button
          type="button"
          className="rounded border px-3 py-1"
          onClick={() => {
            setPull("idle");
            setMaxReading(null);
          }}
        >
          Прикласти пластину знову
        </button>
        <span className="text-xs text-muted-foreground">
          Замкніть ключ (кнопки під малюнком), установіть потрібну силу струму й відірвіть пластину:
          сила, яку показує динамометр у момент відриву, — це сила притягання. Синя позначка на шкалі
          залишається на найбільшому показі. Ціну поділки визначте за шкалою.
        </span>
      </div>
    </div>
  );
}
