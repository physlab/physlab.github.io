"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { useSvgDrag, type Pt } from "./svg-drag";

/**
 * Virtual set-up for the "electromagnetic induction" lab.
 *
 *  1. «Котушка і магніт» — a coil connected to a centre-zero milliammeter and a bar
 *     magnet (one or two magnets put together with like poles). The magnet and the coil
 *     can be dragged, or moved automatically (slowly / quickly). The coil has a marked
 *     end: the magnet is inserted from that end.
 *  2. «Дві котушки» — two coils on a common core: the primary one is connected to a source,
 *     a key and a rheostat, the secondary one to the milliammeter (the core can be
 *     taken out, the secondary coil can be moved).
 *
 * Physics (simplified): ε = −dΦ/dt; the flux of a magnet through the coil is a bell-shaped
 * function of the distance between them; in the second tab ε₂ = −M·dI₁/dt.
 */

const METER_MAX = 5; // mA
const METER_MINOR = 0.2;
const K1 = 0.8; // mA per unit of emf (magnet and coil)
const C2 = 0.2; // mA per (A/s) (two coils)
const TAU = 0.12; // s, time constant of the primary circuit
const EMF = 6; // V
const R_COIL1 = 1.0; // Ω
const SPEEDS = { slow: 120, fast: 360 } as const; // px/s

const bell = (d: number) => 1 / (1 + (d / 90) ** 2) ** 1.5;
const clamp = (x: number, a: number, b: number) => Math.max(a, Math.min(b, x));

/* ------------------------------- milliammeter ------------------------------ */

function MeterDial({ cx, cy, value, marker }: { cx: number; cy: number; value: number; marker: number | null }) {
  const R = 92;
  const th = (v: number) => (clamp(v, -METER_MAX * 1.05, METER_MAX * 1.05) / METER_MAX) * 50;
  const pt = (v: number, r: number) => {
    const a = (th(v) * Math.PI) / 180;
    return { x: cx + r * Math.sin(a), y: cy - r * Math.cos(a) };
  };
  const steps = Math.round((2 * METER_MAX) / METER_MINOR);
  const ticks = Array.from({ length: steps + 1 }, (_, k) => -METER_MAX + k * METER_MINOR);
  const tip = pt(value, R - 6);
  return (
    <g>
      <rect x={cx - 125} y={cy - 118} width={250} height={138} rx={14} fill="#1f2937" />
      <rect x={cx - 112} y={cy - 106} width={224} height={104} rx={6} fill="#f8f5e6" stroke="#9ca3af" />
      {ticks.map((v, i) => {
        const isMajor = Math.abs(v - Math.round(v)) < 1e-6;
        const a = pt(v, R);
        const b = pt(v, R - (isMajor ? 12 : 6));
        const l = pt(v, R - 22);
        return (
          <g key={i}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#111827" strokeWidth={isMajor ? 1.5 : 0.8} />
            {isMajor && (
              <text x={l.x} y={l.y + 3} textAnchor="middle" fontSize={9} fill="#111827">
                {Math.round(v)}
              </text>
            )}
          </g>
        );
      })}
      {marker != null && Math.abs(marker) > 0.05 && (
        <line
          x1={pt(marker, R + 2).x}
          y1={pt(marker, R + 2).y}
          x2={pt(marker, R - 12).x}
          y2={pt(marker, R - 12).y}
          stroke="#2563eb"
          strokeWidth={3}
        />
      )}
      <text x={cx} y={cy - 40} textAnchor="middle" fontSize={13} fontWeight="bold" fill="#111827">
        мА
      </text>
      <line x1={cx} y1={cy} x2={tip.x} y2={tip.y} stroke="#dc2626" strokeWidth={2.4} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={5} fill="#111827" />
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize={10} fill="#e5e7eb">
        міліамперметр
      </text>
    </g>
  );
}

/* ----------------------------------- bench --------------------------------- */

type Tab = "magnet" | "coils";
type Mover = "magnet" | "coil";

const COIL_Y = 140;
const M_Y = 140;

export function InductionBench() {
  const [tab, setTab] = useState<Tab>("magnet");

  // tab 1
  const [xm, setXm] = useState(120);
  const [xc, setXc] = useState(420);
  const [o, setO] = useState<1 | -1>(1); // 1: N at the right end of the magnet
  const [doubled, setDoubled] = useState(false);
  const [mover, setMover] = useState<Mover>("magnet");
  const [speed, setSpeed] = useState<"slow" | "fast">("slow");

  // tab 2
  const [keyClosed, setKeyClosed] = useState(false);
  const [pct, setPct] = useState(70);
  const [coreIn, setCoreIn] = useState(true);
  const [xs2, setXs2] = useState(300);

  // meter signals
  const [p1, setP1] = useState(0);
  const [p2, setP2] = useState(0);
  const [peak1, setPeak1] = useState<number | null>(null);
  const [peak2, setPeak2] = useState<number | null>(null);

  // refs shared between render and the simulation loop
  const auto = useRef<{ who: Mover; target: number; speed: number } | null>(null);
  const peakRef = useRef({ a: 0, b: 0 });
  const live = useRef({ xm: 120, xc: 420, o: 1 as 1 | -1, strength: 1, key: false, pct: 70, core: true, xs2: 300 });

  const svgRef = useRef<SVGSVGElement>(null);
  const { drag, start } = useSvgDrag(svgRef, 700, 430, (id, x) => {
    if (id === "magnet") {
      setXm(clamp(x, 40, 660));
      live.current.xm = clamp(x, 40, 660);
    }
    if (id === "coil") {
      setXc(clamp(x, 40, 660));
      live.current.xc = clamp(x, 40, 660);
    }
    if (id === "coil2") setXs2(clamp(x, 100, 340));
  });

  const curXm = drag?.id === "magnet" ? clamp(drag.x, 40, 660) : xm;
  const curXc = drag?.id === "coil" ? clamp(drag.x, 40, 660) : xc;
  const curXs2 = drag?.id === "coil2" ? clamp(drag.x, 100, 340) : xs2;

  live.current = {
    xm: auto.current ? live.current.xm : curXm,
    xc: auto.current ? live.current.xc : curXc,
    o,
    strength: doubled ? 2 : 1,
    key: keyClosed,
    pct,
    core: coreIn,
    xs2: curXs2,
  };

  const resetPeaks = () => {
    peakRef.current = { a: 0, b: 0 };
    setPeak1(null);
    setPeak2(null);
  };

  // simulation loop: emf from the flux change, pointer inertia
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let prevPhi: number | null = null;
    let s1 = 0;
    let q1 = 0;
    let s2 = 0;
    let q2 = 0;
    let I1 = 0;

    const tick = (now: number) => {
      const dt = clamp((now - last) / 1000, 0.001, 0.05);
      last = now;
      const L = live.current;

      // automatic motion
      const a = auto.current;
      if (a) {
        const cur = a.who === "magnet" ? L.xm : L.xc;
        const step = a.speed * dt;
        let nx: number;
        if (Math.abs(a.target - cur) <= step) {
          nx = a.target;
          auto.current = null;
        } else {
          nx = cur + Math.sign(a.target - cur) * step;
        }
        if (a.who === "magnet") {
          L.xm = nx;
          setXm(nx);
        } else {
          L.xc = nx;
          setXc(nx);
        }
      }

      // 1) magnet and coil
      const phi = L.strength * L.o * bell(L.xm - L.xc);
      const e1 = prevPhi === null ? 0 : -(phi - prevPhi) / dt;
      prevPhi = phi;
      s1 += (e1 - s1) * 0.35;
      q1 += (K1 * s1 - q1) * 0.25;

      // 2) two coils
      const target = L.key ? EMF / (R_COIL1 + 0.5 + (11.5 * L.pct) / 100) : 0;
      const dI = (target - I1) / TAU;
      I1 += dI * dt;
      const gap = Math.max(0, 405 - (L.xs2 + 55));
      const coupling = Math.exp(-((gap / 140) ** 2));
      const e2 = -C2 * coupling * (L.core ? 4 : 1) * dI;
      s2 += (e2 - s2) * 0.4;
      q2 += (s2 - q2) * 0.35;

      const v1 = clamp(q1, -METER_MAX * 1.05, METER_MAX * 1.05);
      const v2 = clamp(q2, -METER_MAX * 1.05, METER_MAX * 1.05);
      setP1(v1);
      setP2(v2);
      if (Math.abs(v1) > Math.abs(peakRef.current.a) + 0.02) {
        peakRef.current.a = v1;
        setPeak1(v1);
      }
      if (Math.abs(v2) > Math.abs(peakRef.current.b) + 0.02) {
        peakRef.current.b = v2;
        setPeak2(v2);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const startAuto = (dir: "in" | "out") => {
    resetPeaks();
    const L = live.current;
    const target =
      mover === "magnet"
        ? dir === "in"
          ? L.xc
          : clamp(L.xc - 300, 40, 660)
        : dir === "in"
          ? L.xm
          : clamp(L.xm + 300, 40, 660);
    auto.current = { who: mover, target, speed: SPEEDS[speed] };
  };

  const grab = (e: ReactPointerEvent<SVGElement>, id: string, cur: Pt) => {
    auto.current = null;
    resetPeaks();
    start(e, id, cur);
  };

  /* --------------------------- drawing: tab 1 ---------------------------- */

  const magH = doubled ? 48 : 34;
  const leftColor = o === 1 ? "#dc2626" : "#2563eb";
  const rightColor = o === 1 ? "#2563eb" : "#dc2626";
  const leftLetter = o === 1 ? "S" : "N";
  const rightLetter = o === 1 ? "N" : "S";
  const turnsX = Array.from({ length: 14 }, (_, i) => curXc - 40 + (80 * i) / 13);

  const tab1 = (
    <svg
      ref={svgRef}
      viewBox="0 0 700 430"
      className="w-full select-none"
      style={{ touchAction: "none", cursor: drag ? "grabbing" : undefined }}
      role="img"
      aria-label="Котушка з міліамперметром і стрижньовий магніт"
    >
      <rect width={700} height={430} fill="#f8fafc" />

      {/* wires to the meter */}
      <path d={`M${curXc - 30},175 C${curXc - 30},240 300,205 300,262`} fill="none" stroke="#374151" strokeWidth={2.4} />
      <path d={`M${curXc + 30},175 C${curXc + 30},240 400,205 400,262`} fill="none" stroke="#374151" strokeWidth={2.4} />
      <circle cx={300} cy={262} r={4} fill="#c0c4cc" stroke="#555" />
      <circle cx={400} cy={262} r={4} fill="#c0c4cc" stroke="#555" />
      <MeterDial cx={350} cy={385} value={p1} marker={peak1} />

      {/* magnet */}
      <g
        transform={`translate(${curXm},${M_Y})`}
        style={{ cursor: drag?.id === "magnet" ? "grabbing" : "grab", touchAction: "none" }}
        onPointerDown={(e) => grab(e, "magnet", { x: curXm, y: M_Y })}
      >
        <title>Магніт — перетягніть</title>
        <rect x={-72} y={-magH / 2 - 4} width={144} height={magH + 8} fill="transparent" />
        <rect x={-70} y={-magH / 2} width={70} height={magH} fill={leftColor} stroke="#111827" strokeWidth={1.5} />
        <rect x={0} y={-magH / 2} width={70} height={magH} fill={rightColor} stroke="#111827" strokeWidth={1.5} />
        <text x={-35} y={5} textAnchor="middle" fontSize={16} fontWeight="bold" fill="#fff">{leftLetter}</text>
        <text x={35} y={5} textAnchor="middle" fontSize={16} fontWeight="bold" fill="#fff">{rightLetter}</text>
        {doubled && <line x1={-70} x2={70} y1={0} y2={0} stroke="#111827" strokeWidth={1.2} strokeDasharray="4 3" />}
      </g>

      {/* coil (drawn over the magnet, semi-transparent) */}
      <g
        style={{ cursor: drag?.id === "coil" ? "grabbing" : "grab", touchAction: "none" }}
        onPointerDown={(e) => grab(e, "coil", { x: curXc, y: COIL_Y })}
      >
        <title>Котушка — перетягніть</title>
        <rect x={curXc - 48} y={COIL_Y - 38} width={96} height={76} fill="rgba(180,100,40,0.20)" stroke="#92400e" strokeWidth={1.5} rx={6} />
        {turnsX.map((x, i) => (
          <line key={i} x1={x - 3} y1={COIL_Y + 38} x2={x + 3} y2={COIL_Y - 38} stroke="#b45309" strokeWidth={2} />
        ))}
        <circle cx={curXc - 48} cy={COIL_Y} r={6} fill="#dc2626" stroke="#7f1d1d" />
        <circle cx={curXc - 30} cy={175} r={3} fill="#111827" />
        <circle cx={curXc + 30} cy={175} r={3} fill="#111827" />
      </g>
      <text x={curXc - 48} y={COIL_Y - 46} textAnchor="middle" fontSize={11} fill="#7f1d1d">
        мітка (магніт вводимо з цього боку)
      </text>
    </svg>
  );

  /* --------------------------- drawing: tab 2 ---------------------------- */

  const xsl = 550 + pct * 0.9;
  const tab2 = (
    <svg
      viewBox="0 0 700 430"
      className="w-full select-none"
      style={{ touchAction: "none", cursor: drag?.id === "coil2" ? "grabbing" : undefined }}
      role="img"
      aria-label="Дві котушки на спільному осерді: вторинна з міліамперметром, первинна з джерелом, ключем і реостатом"
    >
      <rect width={700} height={430} fill="#f8fafc" />

      {/* core */}
      {coreIn && <rect x={60} y={125} width={580} height={30} fill="#9ca3af" stroke="#4b5563" rx={6} />}
      {coreIn && <rect x={64} y={129} width={572} height={6} fill="#d1d5db" rx={3} />}

      {/* primary coil */}
      <rect x={405} y={100} width={130} height={80} fill="rgba(180,100,40,0.20)" stroke="#92400e" strokeWidth={1.5} rx={6} />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={411 + i * 10.5 - 3} y1={180} x2={411 + i * 10.5 + 3} y2={100} stroke="#b45309" strokeWidth={2} />
      ))}
      <text x={470} y={92} textAnchor="middle" fontSize={11} fill="#374151">первинна котушка</text>

      {/* primary circuit */}
      <g fill="none" stroke="#374151" strokeWidth={2.4}>
        <path d="M410,180 L410,300 L424,300" />
        <path d="M436,300 L470,300" />
        <path d="M510,300 L550,300" />
        <path d={`M${xsl},288 L${xsl},268 L670,268 L670,200 L530,200 L530,180`} />
      </g>
      <line x1={424} x2={424} y1={288} y2={312} stroke="#111827" strokeWidth={4} />
      <line x1={436} x2={436} y1={294} y2={306} stroke="#111827" strokeWidth={4} />
      <circle cx={470} cy={300} r={4} fill="#9ca3af" stroke="#4b5563" />
      <circle cx={510} cy={300} r={4} fill="#9ca3af" stroke="#4b5563" />
      {keyClosed ? (
        <line x1={470} y1={300} x2={510} y2={300} stroke="#111827" strokeWidth={4} />
      ) : (
        <line x1={470} y1={300} x2={504} y2={278} stroke="#111827" strokeWidth={4} />
      )}
      <text x={490} y={326} textAnchor="middle" fontSize={11} fill="#374151">ключ</text>
      <rect x={550} y={288} width={90} height={24} fill="#e5e7eb" stroke="#6b7280" rx={4} />
      <rect x={550} y={288} width={Math.max(0, xsl - 550)} height={24} fill="rgba(251,146,60,0.28)" rx={4} />
      <polygon points={`${xsl - 7},282 ${xsl + 7},282 ${xsl},289`} fill="#111827" />
      <text x={595} y={326} textAnchor="middle" fontSize={11} fill="#374151">реостат</text>
      <text x={430} y={326} textAnchor="middle" fontSize={11} fill="#374151">джерело</text>

      {/* secondary coil + meter */}
      <path d={`M${curXs2 - 40},180 C${curXs2 - 40},245 150,215 150,272`} fill="none" stroke="#374151" strokeWidth={2.4} />
      <path d={`M${curXs2 + 40},180 C${curXs2 + 40},245 230,215 230,272`} fill="none" stroke="#374151" strokeWidth={2.4} />
      <circle cx={150} cy={272} r={4} fill="#c0c4cc" stroke="#555" />
      <circle cx={230} cy={272} r={4} fill="#c0c4cc" stroke="#555" />
      <MeterDial cx={190} cy={390} value={p2} marker={peak2} />

      <g
        style={{ cursor: drag?.id === "coil2" ? "grabbing" : "grab", touchAction: "none" }}
        onPointerDown={(e) => grab(e, "coil2", { x: curXs2, y: 140 })}
      >
        <title>Вторинна котушка — перетягніть уздовж осердя</title>
        <rect x={curXs2 - 55} y={100} width={110} height={80} fill="rgba(180,100,40,0.20)" stroke="#92400e" strokeWidth={1.5} rx={6} />
        {Array.from({ length: 10 }, (_, i) => (
          <line key={i} x1={curXs2 - 49 + i * 11 - 3} y1={180} x2={curXs2 - 49 + i * 11 + 3} y2={100} stroke="#b45309" strokeWidth={2} />
        ))}
        <circle cx={curXs2 - 40} cy={180} r={3} fill="#111827" />
        <circle cx={curXs2 + 40} cy={180} r={3} fill="#111827" />
      </g>
      <text x={curXs2} y={92} textAnchor="middle" fontSize={11} fill="#374151">вторинна котушка (перетягніть)</text>
    </svg>
  );

  return (
    <div className="my-4 rounded-lg border p-3" style={{ background: "rgba(0,0,0,0.02)" }}>
      <div className="flex flex-wrap gap-2 text-sm">
        {(
          [
            ["magnet", "Котушка і магніт"],
            ["coils", "Дві котушки"],
          ] as Array<[Tab, string]>
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className="rounded border px-3 py-1"
            style={{ background: tab === id ? "#e7f5ff" : undefined, fontWeight: tab === id ? 600 : undefined }}
            onClick={() => {
              setTab(id);
              auto.current = null;
              resetPeaks();
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: tab === "magnet" ? undefined : "none" }}>
        {tab1}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
          <span>Рухається:</span>
          {(["magnet", "coil"] as Mover[]).map((m) => (
            <button
              key={m}
              type="button"
              className="rounded border px-3 py-1"
              style={{ background: mover === m ? "#e7f5ff" : undefined }}
              onClick={() => setMover(m)}
            >
              {m === "magnet" ? "магніт" : "котушка"}
            </button>
          ))}
          <span>швидкість:</span>
          {(["slow", "fast"] as const).map((s) => (
            <button
              key={s}
              type="button"
              className="rounded border px-3 py-1"
              style={{ background: speed === s ? "#e7f5ff" : undefined }}
              onClick={() => setSpeed(s)}
            >
              {s === "slow" ? "повільно" : "швидко"}
            </button>
          ))}
          <button type="button" className="rounded border px-3 py-1" onClick={() => startAuto("in")}>
            Ввести / наблизити
          </button>
          <button type="button" className="rounded border px-3 py-1" onClick={() => startAuto("out")}>
            Вивести / віддалити
          </button>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
          <button
            type="button"
            className="rounded border px-3 py-1"
            onClick={() => {
              auto.current = null;
              resetPeaks();
              setO((v) => (v === 1 ? -1 : 1));
            }}
          >
            Повернути магніт (поміняти полюси місцями)
          </button>
          <button
            type="button"
            className="rounded border px-3 py-1"
            style={{ background: doubled ? "#e7f5ff" : undefined }}
            onClick={() => {
              resetPeaks();
              setDoubled((v) => !v);
            }}
          >
            {doubled ? "Залишити один магніт" : "Скласти два магніти однойменними полюсами"}
          </button>
          <button type="button" className="rounded border px-3 py-1" onClick={resetPeaks}>
            Скинути синю позначку
          </button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Магніт і котушку можна перетягувати мишею (або пальцем) уздовж осі, а можна рухати автоматично —
          повільно чи швидко. Синій полюс — північний (N), червоний — південний (S). Магніт вводять у
          котушку з боку червоної мітки. Синя позначка на шкалі міліамперметра показує найбільше відхилення
          під час останнього руху.
        </p>
      </div>

      <div style={{ display: tab === "coils" ? undefined : "none" }}>
        {tab2}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
          <button
            type="button"
            className="rounded border px-3 py-1"
            style={{ background: keyClosed ? "#ffe3e3" : undefined }}
            onClick={() => {
              resetPeaks();
              setKeyClosed((k) => !k);
            }}
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
              onChange={(e) => {
                setPct(Number(e.target.value));
              }}
              onPointerDown={resetPeaks}
            />
          </label>
          <button
            type="button"
            className="rounded border px-3 py-1"
            onClick={() => {
              resetPeaks();
              setCoreIn((c) => !c);
            }}
          >
            {coreIn ? "Вийняти осердя" : "Вставити осердя"}
          </button>
          <button type="button" className="rounded border px-3 py-1" onClick={resetPeaks}>
            Скинути синю позначку
          </button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Вторинну котушку (з міліамперметром) можна пересувати вздовж осердя. Замикайте й розмикайте ключ,
          змінюйте опір реостата й стежте за міліамперметром. Що менша відстань між котушками і що є
          осердя, то сильніший ефект.
        </p>
      </div>
    </div>
  );
}
