"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { BalanceScale, type BalanceBody } from "./balance-bench";

/**
 * Virtual equipment for the "density" lab. Three tabs:
 *  1. «Терези»  — the beam balance (see balance-bench.tsx);
 *  2. «Мензурки» — two measuring cylinders: drag the body into the water in
 *     cylinder A (it is immersed and the level rises); drag the glass with the
 *     liquid over cylinder B (the liquid is poured in);
 *  3. «Відливна посудина» — an overflow vessel with a collecting glass and an
 *     aluminium cube (equipment for the creative task).
 *
 * All masses and volumes are random and hidden — the student must measure them.
 */

/* ---------------------------- hidden parameters --------------------------- */

const SOLIDS = [
  { name: "алюміній", rho: 2.7 },
  { name: "сталь", rho: 7.8 },
  { name: "мідь", rho: 8.9 },
  { name: "латунь", rho: 8.5 },
];
const LIQUIDS = [
  { name: "спирт", rho: 0.8, color: "#dbeafe" },
  { name: "олія", rho: 0.93, color: "#f2d14b" },
  { name: "молоко", rho: 1.03, color: "#f8f8f0" },
  { name: "гліцерин", rho: 1.26, color: "#cfe8dc" },
];

type Params = {
  solidV: number; // cm³
  solidMass: number; // g
  waterV0: number; // mL, initial water volume in cylinder A
  liquidV: number; // mL
  liquidMass: number; // g
  liquidColor: string;
  glassMass: number; // g, empty glass with the liquid
  collectMass: number; // g, empty collecting glass
  cubeEdge: number; // cm
  spillMass: number; // g, water that overflows when the cube is immersed
  delta: number; // g, initial imbalance of the empty pans
};

const DEFAULT_PARAMS: Params = {
  solidV: 12,
  solidMass: 32.4,
  waterV0: 50,
  liquidV: 60,
  liquidMass: 55.8,
  liquidColor: "#f2d14b",
  glassMass: 58.2,
  collectMass: 52.4,
  cubeEdge: 2.5,
  spillMass: 15.63,
  delta: 0.04,
};

const round2 = (x: number) => Math.round(x * 100) / 100;
const between = (min: number, max: number) => round2(min + Math.random() * (max - min));
const int = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const jitter = (rho: number) => rho * (1 + (Math.random() - 0.5) * 0.01);

function randomParams(): Params {
  const solid = pick(SOLIDS);
  const liquid = pick(LIQUIDS);
  const solidV = int(8, 20);
  const liquidV = int(40, 80);
  const cubeEdge = pick([2, 2.5, 3]);
  return {
    solidV,
    solidMass: round2(jitter(solid.rho) * solidV),
    waterV0: int(40, 59),
    liquidV,
    liquidMass: round2(jitter(liquid.rho) * liquidV),
    liquidColor: liquid.color,
    glassMass: between(45, 70),
    collectMass: between(45, 70),
    cubeEdge,
    spillMass: round2(cubeEdge ** 3 * 1.0),
    delta: pick([0.02, 0.04, 0.06]),
  };
}

/* ------------------------------ small helpers ----------------------------- */

/** Smoothly follows a target value (restart-safe: the loop belongs to the effect). */
function useEased(target: number, rate = 0.12): number {
  const [value, setValue] = useState(target);
  const ref = useRef(target);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      ref.current += (target - ref.current) * rate;
      if (Math.abs(target - ref.current) < 0.005) {
        ref.current = target;
        setValue(target);
        return;
      }
      setValue(ref.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, rate]);
  return value;
}

type Pt = { x: number; y: number };

/**
 * Dragging inside an <svg>: while an item is held, the whole window listens for
 * the pointer, so the item never "slips away" from the cursor or finger.
 */
function useSvgDrag(
  svgRef: { current: SVGSVGElement | null },
  vbW: number,
  vbH: number,
  onDrop: (id: string, x: number, y: number) => void,
) {
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const dropRef = useRef(onDrop);
  dropRef.current = onDrop;

  const toSvg = (clientX: number, clientY: number): Pt => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const r = svg.getBoundingClientRect();
    return { x: ((clientX - r.left) / r.width) * vbW, y: ((clientY - r.top) / r.height) * vbH };
  };

  const start = (e: ReactPointerEvent<SVGElement>, id: string, cur: Pt) => {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    const p = toSvg(e.clientX, e.clientY);
    dragRef.current = { id, dx: cur.x - p.x, dy: cur.y - p.y };
    setDrag({ id, x: cur.x, y: cur.y });
  };

  const draggingId = drag?.id ?? null;
  useEffect(() => {
    if (!draggingId) return;
    const move = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const p = toSvg(e.clientX, e.clientY);
      setDrag({ id: d.id, x: p.x + d.dx, y: p.y + d.dy });
    };
    const up = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      dragRef.current = null;
      const p = toSvg(e.clientX, e.clientY);
      dropRef.current(d.id, p.x + d.dx, p.y + d.dy);
      setDrag(null);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draggingId]);

  return { drag, start };
}

function GlassShape({ w, h, frac, color }: { w: number; h: number; frac: number; color: string }) {
  const f = Math.max(0, Math.min(1, frac));
  return (
    <g>
      {f > 0 && (
        <path
          d={`M${-w / 2 + 3 * (1 - f)},${-h * f} L${w / 2 - 3 * (1 - f)},${-h * f} L${w / 2 - 3},-1 L${-w / 2 + 3},-1 Z`}
          fill={color}
          opacity={0.85}
        />
      )}
      <path
        d={`M${-w / 2},${-h} L${-w / 2 + 3},0 L${w / 2 - 3},0 L${w / 2},${-h}`}
        fill="rgba(200,230,250,0.35)"
        stroke="#4f8fbf"
        strokeWidth={1.8}
      />
    </g>
  );
}

function Cube({ side, label }: { side: number; label?: string }) {
  return (
    <g>
      <rect x={-side / 2} y={-side} width={side} height={side} fill="#9aa5b1" stroke="#4a5568" strokeWidth={1.5} rx={2} />
      <line x1={-side / 2 + 3} x2={side / 2 - 3} y1={-side + 5} y2={-side + 5} stroke="#e2e8f0" strokeWidth={2} />
      {label && (
        <text y={-side / 2 + 4} textAnchor="middle" fontSize={10} fill="#1f2937">
          {label}
        </text>
      )}
    </g>
  );
}

/* ------------------------------ measuring cylinder ------------------------- */

const CYL_BOTTOM = 360;
const PX_PER_ML = 3.2;
const CYL_HALF = 35;
const CYL_TOP = CYL_BOTTOM - 100 * PX_PER_ML - 6;

function Cylinder({ cx, volume, color, highlight, title }: { cx: number; volume: number; color: string; highlight: boolean; title: string }) {
  const levelY = CYL_BOTTOM - volume * PX_PER_ML;
  const ticks = Array.from({ length: 101 }, (_, v) => v);
  return (
    <g>
      {highlight && (
        <rect
          x={cx - CYL_HALF - 14}
          y={CYL_TOP - 14}
          width={2 * CYL_HALF + 70}
          height={CYL_BOTTOM - CYL_TOP + 28}
          fill="rgba(59,130,246,0.10)"
          stroke="#3b82f6"
          strokeDasharray="5 4"
          rx={8}
        />
      )}
      {volume > 0 && (
        <g>
          <rect x={cx - CYL_HALF + 1} y={levelY} width={2 * CYL_HALF - 2} height={CYL_BOTTOM - levelY} fill={color} opacity={0.55} />
          <path
            d={`M${cx - CYL_HALF + 1},${levelY - 2} Q${cx},${levelY + 3} ${cx + CYL_HALF - 1},${levelY - 2}`}
            fill="none"
            stroke="#1d4ed8"
            strokeWidth={1.2}
          />
        </g>
      )}
      <path
        d={`M${cx - CYL_HALF},${CYL_TOP} L${cx - CYL_HALF},${CYL_BOTTOM} L${cx + CYL_HALF},${CYL_BOTTOM} L${cx + CYL_HALF},${CYL_TOP}`}
        fill="rgba(200,230,250,0.18)"
        stroke="#4f8fbf"
        strokeWidth={2.5}
      />
      <rect x={cx - CYL_HALF - 8} y={CYL_BOTTOM} width={2 * CYL_HALF + 16} height={8} fill="#6b7280" rx={3} />
      {ticks.map((v) => {
        const y = CYL_BOTTOM - v * PX_PER_ML;
        const len = v % 10 === 0 ? 14 : v % 5 === 0 ? 10 : 5;
        return (
          <g key={v}>
            <line x1={cx + CYL_HALF} x2={cx + CYL_HALF - len} y1={y} y2={y} stroke="#374151" strokeWidth={v % 10 === 0 ? 1.4 : 0.8} />
            {v % 10 === 0 && v > 0 && (
              <text x={cx + CYL_HALF + 4} y={y + 3} fontSize={9} fill="#374151">
                {v}
              </text>
            )}
          </g>
        );
      })}
      <text x={cx + CYL_HALF + 4} y={CYL_TOP - 4} fontSize={9} fill="#374151">
        мл
      </text>
      <text x={cx} y={CYL_BOTTOM + 26} textAnchor="middle" fontSize={11} fill="#374151">
        {title}
      </text>
    </g>
  );
}

const A_X = 160;
const B_X = 500;
const inCylinderZone = (cx: number, x: number, y: number, h: number) =>
  Math.abs(x - cx) <= CYL_HALF + 25 && y - h / 2 >= CYL_TOP - 30 && y - h / 2 <= CYL_BOTTOM + 10;

function CylinderStation({
  P,
  bodyIn,
  setBodyIn,
  poured,
  setPoured,
}: {
  P: Params;
  bodyIn: boolean;
  setBodyIn: (v: boolean) => void;
  poured: boolean;
  setPoured: (v: boolean) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { drag, start } = useSvgDrag(svgRef, 700, 430, (id, x, y) => {
    if (id === "solid") setBodyIn(inCylinderZone(A_X, x, y, 28));
    if (id === "glass" && inCylinderZone(B_X, x, y, 44)) setPoured(true);
  });

  const volA = useEased(P.waterV0 + (bodyIn ? P.solidV : 0));
  const volB = useEased(poured ? P.liquidV : 0);

  const solidShelf: Pt = { x: 305, y: 378 };
  const glassShelf: Pt = { x: 395, y: 378 };
  const solidPos: Pt = drag?.id === "solid" ? drag : bodyIn ? { x: A_X, y: CYL_BOTTOM - 2 } : solidShelf;
  const glassPos: Pt = drag?.id === "glass" ? drag : glassShelf;

  const hoverA = drag?.id === "solid" && inCylinderZone(A_X, drag.x, drag.y, 28);
  const hoverB = drag?.id === "glass" && inCylinderZone(B_X, drag.x, drag.y, 44) && !poured;

  const solidNode = (
    <g
      key="solid"
      transform={`translate(${solidPos.x},${solidPos.y})`}
      style={{ cursor: drag?.id === "solid" ? "grabbing" : "grab", touchAction: "none" }}
      onPointerDown={(e) => {
        setBodyIn(false);
        start(e, "solid", solidPos);
      }}
    >
      <title>Тверде тіло на нитці</title>
      {bodyIn && drag?.id !== "solid" && (
        <line x1={0} x2={0} y1={-28} y2={CYL_TOP - 24 - solidPos.y} stroke="#6b7280" strokeWidth={1.2} />
      )}
      <rect x={-22} y={-34} width={44} height={38} fill="transparent" />
      <Cube side={28} />
    </g>
  );
  const glassNode = (
    <g
      key="glass"
      transform={`translate(${glassPos.x},${glassPos.y})`}
      style={{ cursor: drag?.id === "glass" ? "grabbing" : "grab", touchAction: "none" }}
      onPointerDown={(e) => start(e, "glass", glassPos)}
    >
      <title>{poured ? "Порожня склянка" : "Склянка з рідиною"}</title>
      <rect x={-22} y={-48} width={44} height={52} fill="transparent" />
      <GlassShape w={34} h={44} frac={poured ? 0 : 0.62} color={P.liquidColor} />
    </g>
  );
  const nodes = drag?.id === "glass" ? [solidNode, glassNode] : [glassNode, solidNode];

  return (
    <div className="my-2">
      <svg
        ref={svgRef}
        viewBox="0 0 700 430"
        className="w-full select-none"
        style={{ touchAction: "none", cursor: drag ? "grabbing" : undefined }}
        role="img"
        aria-label="Дві мензурки: у першій вода для вимірювання об'єму тіла, друга — для рідини"
      >
        <rect x={0} y={378} width={700} height={52} fill="#e5e7eb" />
        <line x1={0} x2={700} y1={378} y2={378} stroke="#9ca3af" />
        <rect x={A_X - CYL_HALF - 8} y={CYL_BOTTOM} width={2 * CYL_HALF + 16} height={8} fill="#6b7280" rx={3} />
        <Cylinder cx={A_X} volume={volA} color="#3b82f6" highlight={!!hoverA} title="Мензурка A (з водою)" />
        <Cylinder cx={B_X} volume={volB} color={P.liquidColor} highlight={!!hoverB} title="Мензурка B (для рідини)" />
        {nodes}
        <text x={350} y={412} textAnchor="middle" fontSize={11} fill="#374151">
          тіло на нитці · склянка з рідиною
        </text>
      </svg>
      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
        <button
          type="button"
          className="rounded border px-3 py-1"
          onClick={() => {
            setBodyIn(false);
            setPoured(false);
          }}
        >
          Скинути мензурки
        </button>
        <span className="text-xs text-muted-foreground">
          Перетягніть тіло в мензурку A (воно зануриться), а склянку з рідиною — на мензурку B
          (рідина перелиється). Об&apos;єм зчитуйте за нижнім краєм увігнутої поверхні води;
          1 мл = 1 см³.
        </span>
      </div>
    </div>
  );
}

/* ------------------------------ overflow vessel ---------------------------- */

const V_X = 250; // overflow vessel centre
const V_HALF = 60;
const V_TOP = 110;
const V_BOTTOM = 360;
const SPOUT_Y = 172;
const GLASS_X = 365;

function OverflowStation({ P, spilled, setSpilled }: { P: Params; spilled: boolean; setSpilled: (v: boolean) => void }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const side = 10 * P.cubeEdge + 5; // visual size (cm → px), not strictly to scale
  const edgeText = `${P.cubeEdge.toFixed(1).replace(".", ",")} см`;
  const shelf: Pt = { x: 110, y: 360 };

  const { drag, start } = useSvgDrag(svgRef, 700, 430, (id, x, y) => {
    if (id !== "cube") return;
    const over = Math.abs(x - V_X) <= V_HALF + 25 && y >= V_TOP - 60 && y <= V_BOTTOM + 10;
    if (over && !spilled) setSpilled(true);
  });

  const targetFill = spilled ? Math.min(0.85, 0.1 + (P.spillMass / 45) * 0.7) : 0;
  const fill = useEased(targetFill, 0.05);
  const streaming = spilled && Math.abs(fill - targetFill) > 0.01;
  const over = !!drag && !spilled && Math.abs(drag.x - V_X) <= V_HALF + 25 && drag.y >= V_TOP - 60 && drag.y <= V_BOTTOM + 10;

  const cubePos: Pt = drag ? drag : spilled ? { x: V_X, y: V_BOTTOM - 2 } : shelf;

  return (
    <div className="my-2">
      <svg
        ref={svgRef}
        viewBox="0 0 700 430"
        className="w-full select-none"
        style={{ touchAction: "none", cursor: drag ? "grabbing" : undefined }}
        role="img"
        aria-label="Відливна посудина зі склянкою-збирачем та алюмінієвий кубик"
      >
        <rect x={0} y={378} width={700} height={52} fill="#e5e7eb" />
        <line x1={0} x2={700} y1={378} y2={378} stroke="#9ca3af" />

        {/* overflow vessel */}
        {over && (
          <rect x={V_X - V_HALF - 14} y={V_TOP - 20} width={2 * V_HALF + 28} height={V_BOTTOM - V_TOP + 34} fill="rgba(59,130,246,0.10)" stroke="#3b82f6" strokeDasharray="5 4" rx={8} />
        )}
        <rect x={V_X - V_HALF + 1} y={SPOUT_Y} width={2 * V_HALF - 2} height={V_BOTTOM - SPOUT_Y} fill="#3b82f6" opacity={0.5} />
        <path
          d={`M${V_X - V_HALF},${V_TOP} L${V_X - V_HALF},${V_BOTTOM} L${V_X + V_HALF},${V_BOTTOM} L${V_X + V_HALF},${V_TOP}`}
          fill="rgba(200,230,250,0.15)"
          stroke="#4f8fbf"
          strokeWidth={3}
        />
        <path d={`M${V_X + V_HALF - 2},${SPOUT_Y + 2} L${V_X + V_HALF + 38},${SPOUT_Y + 2} L${GLASS_X - 6},${SPOUT_Y + 16} L${GLASS_X - 6},${298}`} fill="none" stroke="#6b7280" strokeWidth={7} strokeLinejoin="round" />
        <path d={`M${V_X + V_HALF - 2},${SPOUT_Y + 2} L${V_X + V_HALF + 38},${SPOUT_Y + 2} L${GLASS_X - 6},${SPOUT_Y + 16} L${GLASS_X - 6},${298}`} fill="none" stroke="#d1d5db" strokeWidth={3} strokeLinejoin="round" />
        <text x={V_X} y={V_TOP - 28} textAnchor="middle" fontSize={11} fill="#374151">
          відливна посудина
        </text>

        {/* collecting glass */}
        <g transform={`translate(${GLASS_X + 20},360)`}>
          <GlassShape w={56} h={64} frac={fill} color="#3b82f6" />
        </g>
        {streaming && (
          <line x1={GLASS_X - 6} x2={GLASS_X - 6} y1={298} y2={360 - 64 * fill} stroke="#3b82f6" strokeWidth={3} />
        )}
        <text x={GLASS_X + 20} y={396} textAnchor="middle" fontSize={11} fill="#374151">
          склянка-збирач
        </text>

        {/* cube */}
        <g
          transform={`translate(${cubePos.x},${cubePos.y})`}
          style={{ cursor: spilled ? "default" : drag ? "grabbing" : "grab", touchAction: "none" }}
          onPointerDown={(e) => {
            if (spilled) return;
            start(e, "cube", cubePos);
          }}
        >
          <title>Алюмінієвий кубик</title>
          <rect x={-side / 2 - 4} y={-side - 4} width={side + 8} height={side + 8} fill="transparent" />
          <Cube side={side} label="Al" />
        </g>
        {!spilled && !drag && (
          <text x={shelf.x} y={396} textAnchor="middle" fontSize={11} fill="#374151">
            алюмінієвий кубик, ребро a = {edgeText}
          </text>
        )}
      </svg>
      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
        <button type="button" className="rounded border px-3 py-1" onClick={() => setSpilled(false)}>
          Дістати кубик, долити воду, замінити склянку
        </button>
        <span className="text-xs text-muted-foreground">
          Перетягніть кубик у відливну посудину: витіснена вода виллється через носик у склянку-збирач.
          Масу склянки до і після досліду зважте на терезах (вкладка «Терези»).
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------- bench ---------------------------------- */

type Tab = "balance" | "cylinders" | "overflow";
const TABS: Array<[Tab, string]> = [
  ["balance", "Терези"],
  ["cylinders", "Мензурки"],
  ["overflow", "Відливна посудина"],
];

export function DensityBench() {
  const [P, setP] = useState<Params>(DEFAULT_PARAMS);
  const [tab, setTab] = useState<Tab>("balance");
  const [bodyIn, setBodyIn] = useState(false);
  const [poured, setPoured] = useState(false);
  const [spilled, setSpilled] = useState(false);

  // hidden random values (client only, to avoid hydration mismatch)
  useEffect(() => {
    setP(randomParams());
  }, []);

  const bodies = useMemo<BalanceBody[]>(
    () => [
      { id: "solid", title: "Тверде тіло", shape: "block", mass: P.solidMass },
      {
        id: "glass_liquid",
        title: poured ? "Порожня склянка" : "Склянка з рідиною",
        shape: "glass",
        mass: poured ? P.glassMass : P.glassMass + P.liquidMass,
        fillFrac: poured ? 0 : 0.62,
        fillColor: P.liquidColor,
      },
      {
        id: "glass_collect",
        title: "Склянка-збирач",
        shape: "glass",
        mass: P.collectMass + (spilled ? P.spillMass : 0),
        fillFrac: spilled ? 0.5 : 0,
        fillColor: "#3b82f6",
      },
    ],
    [P, poured, spilled],
  );

  return (
    <div className="my-4 rounded-lg border p-3" style={{ background: "rgba(0,0,0,0.02)" }}>
      <div className="flex flex-wrap gap-2 text-sm">
        {TABS.map(([id, label]) => (
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

      <div style={{ display: tab === "balance" ? undefined : "none" }}>
        <BalanceScale bodies={bodies} delta={P.delta} />
      </div>
      <div style={{ display: tab === "cylinders" ? undefined : "none" }}>
        <CylinderStation P={P} bodyIn={bodyIn} setBodyIn={setBodyIn} poured={poured} setPoured={setPoured} />
      </div>
      <div style={{ display: tab === "overflow" ? undefined : "none" }}>
        <OverflowStation P={P} spilled={spilled} setSpilled={setSpilled} />
      </div>
    </div>
  );
}
