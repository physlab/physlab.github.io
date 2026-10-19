"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

/**
 * Virtual equipment for the "pressure of a solid body" lab. Four tabs:
 *  1. «Динамометр»  — a spring dynamometer (0…5 N, division 0.1 N). Drag the
 *     block and the weights onto the hook: the pointer shows the weight;
 *  2. «Лінійка»     — a ruler (division 1 mm). Drag the block along the ruler
 *     and read its length l, width d and height h;
 *  3. «Поролон»     — a qualitative experiment: the block lies on a foam pad on
 *     any of its three faces, with 0…2 weights on top. The deeper dent shows
 *     the higher pressure (no numbers are shown, the student computes them);
 *  4. «Папір у клітинку» — a footprint on squared paper (creative task): the
 *     student marks whole and partial squares and counts them.
 *
 * The dimensions of the block and the footprint are random and hidden — the
 * student has to measure them.
 */

/* ---------------------------- hidden parameters --------------------------- */

const G = 10; // N/kg

type Foot = { L: number; W: number; ox: number; oy: number }; // cm

type Params = {
  l: number; // cm, length of the block
  d: number; // cm, width
  h: number; // cm, height
  blockW: number; // N, weight of the block
  weightW: number; // N, weight of one extra weight (100 g)
  personMass: number; // kg
  foot: Foot;
};

const DEFAULT_PARAMS: Params = {
  l: 10.4,
  d: 5.2,
  h: 2.8,
  blockW: 0.9,
  weightW: 1,
  personMass: 48,
  foot: { L: 24.5, W: 9.8, ox: 0.6, oy: 0.6 },
};

const round2 = (x: number) => Math.round(x * 100) / 100;
const between = (min: number, max: number) => round2(min + Math.random() * (max - min));
const int = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));
const fmt = (x: number) => String(x).replace(".", ",");

function randomParams(): Params {
  const l = int(90, 120) / 10;
  const d = int(45, 60) / 10;
  const h = int(25, 35) / 10;
  const rho = 0.5 + Math.random() * 0.3; // g/cm³, wood
  return {
    l,
    d,
    h,
    blockW: round2((rho * l * d * h * G) / 1000),
    weightW: 1,
    personMass: int(38, 62),
    foot: {
      L: between(23, 26),
      W: between(9, 10.5),
      ox: between(0.35, 0.9),
      oy: between(0.35, 0.9),
    },
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

/* --------------------------------- shapes --------------------------------- */

function WoodBlock({ w, h, label }: { w: number; h: number; label?: string }) {
  return (
    <g>
      <rect x={-w / 2} y={-h} width={w} height={h} fill="#d9b382" stroke="#8a5a2b" strokeWidth={1.5} rx={2} />
      <line x1={-w / 2 + 4} x2={w / 2 - 4} y1={-h * 0.7} y2={-h * 0.7} stroke="#b98d57" strokeWidth={1} />
      <line x1={-w / 2 + 4} x2={w / 2 - 10} y1={-h * 0.4} y2={-h * 0.4} stroke="#b98d57" strokeWidth={1} />
      <line x1={-w / 2 + 10} x2={w / 2 - 4} y1={-h * 0.15} y2={-h * 0.15} stroke="#b98d57" strokeWidth={1} />
      {label && (
        <text y={-h / 2 + 4} textAnchor="middle" fontSize={12} fill="#4a2f12" fontStyle="italic">
          {label}
        </text>
      )}
    </g>
  );
}

function MassWeight({ w, h }: { w: number; h: number }) {
  return (
    <g>
      <circle cx={0} cy={-h - 3} r={3.5} fill="none" stroke="#8a6d0b" strokeWidth={1.5} />
      <rect x={-w / 2} y={-h} width={w} height={h} fill="#d4a017" stroke="#8a6d0b" strokeWidth={1.2} rx={3} />
      <line x1={-w / 2 + 4} x2={w / 2 - 4} y1={-h + 4} y2={-h + 4} stroke="#f3d46b" strokeWidth={1.5} />
    </g>
  );
}

const btn = "rounded border px-3 py-1";
const activeStyle = (on: boolean) => ({
  background: on ? "#e7f5ff" : undefined,
  fontWeight: on ? 600 : undefined,
});

/* -------------------------------- dynamometer ----------------------------- */

const DYN = { cx: 350, zeroY: 30, pxPerN: 44, maxN: 5 };
const DYN_VB = { w: 700, h: 470 };
const TABLE_Y = 410;
const inHook = (x: number, y: number) => Math.abs(x - DYN.cx) <= 80 && y >= 140 && y <= TABLE_Y - 24;

type DynItem = { id: string; title: string; w: number; h: number; shelf: Pt };
const DYN_ITEMS: DynItem[] = [
  { id: "block", title: "Дерев'яний брусок", w: 44, h: 30, shelf: { x: 130, y: TABLE_Y - 2 } },
  { id: "w1", title: "Тягарець", w: 38, h: 16, shelf: { x: 520, y: TABLE_Y - 2 } },
  { id: "w2", title: "Тягарець", w: 38, h: 16, shelf: { x: 585, y: TABLE_Y - 2 } },
];

function DynamometerStation({ P }: { P: Params }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hung, setHung] = useState<string[]>([]);

  const { drag, start } = useSvgDrag(svgRef, DYN_VB.w, DYN_VB.h, (id, x, y) => {
    if (inHook(x, y)) setHung((prev) => (prev.includes(id) ? prev : [...prev, id]));
  });

  const weight = hung.reduce((s, id) => s + (id === "block" ? P.blockW : P.weightW), 0);
  const shown = useEased(weight, 0.18);
  const ext = shown * DYN.pxPerN;
  const pointerY = DYN.zeroY + ext;
  const hookY = 270 + ext * 0.2; // the hook travels less than the pointer (schematic)

  // stack of hanging items: the block first, then the weights
  const hungOrder = [...hung.filter((id) => id === "block"), ...hung.filter((id) => id !== "block")];
  const hungPos: Record<string, Pt> = {};
  let yy = hookY + 16;
  hungOrder.forEach((id) => {
    const it = DYN_ITEMS.find((i) => i.id === id)!;
    yy += it.h;
    hungPos[id] = { x: DYN.cx, y: yy };
    yy += 7;
  });
  const stackEnd = hungOrder.length ? yy - 7 : hookY + 10;

  const hover = !!drag && inHook(drag.x, drag.y);
  const order = DYN_ITEMS.filter((i) => i.id !== drag?.id);
  if (drag) order.push(DYN_ITEMS.find((i) => i.id === drag.id)!);

  const ticks = Array.from({ length: DYN.maxN * 10 + 1 }, (_, i) => i);

  return (
    <div className="my-2">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${DYN_VB.w} ${DYN_VB.h}`}
        className="w-full select-none"
        style={{ touchAction: "none", cursor: drag ? "grabbing" : undefined }}
        role="img"
        aria-label="Пружинний динамометр із гачком, дерев'яний брусок і тягарці"
      >
        <rect x={0} y={TABLE_Y} width={DYN_VB.w} height={DYN_VB.h - TABLE_Y} fill="#e5e7eb" />
        <line x1={0} x2={DYN_VB.w} y1={TABLE_Y} y2={TABLE_Y} stroke="#9ca3af" />

        {/* hook zone highlight */}
        {hover && (
          <rect
            x={DYN.cx - 95}
            y={250}
            width={190}
            height={TABLE_Y - 250 - 4}
            fill="rgba(59,130,246,0.10)"
            stroke="#3b82f6"
            strokeDasharray="5 4"
            rx={8}
          />
        )}

        {/* hanger */}
        <rect x={DYN.cx - 34} y={0} width={68} height={6} fill="#4b5563" />
        <circle cx={DYN.cx} cy={8} r={6} fill="none" stroke="#4b5563" strokeWidth={3} />

        {/* casing */}
        <rect x={DYN.cx - 32} y={6} width={64} height={266} fill="#f3f4f6" stroke="#6b7280" strokeWidth={2} rx={8} />
        <rect x={DYN.cx - 12} y={DYN.zeroY - 8} width={24} height={DYN.maxN * DYN.pxPerN + 16} fill="#ffffff" stroke="#9ca3af" />

        {/* scale */}
        {ticks.map((i) => {
          const y = DYN.zeroY + (i / 10) * DYN.pxPerN;
          const major = i % 10 === 0;
          const mid = i % 5 === 0;
          const len = major ? 16 : mid ? 12 : 7;
          return (
            <g key={i}>
              <line
                x1={DYN.cx - 12}
                x2={DYN.cx - 12 - len}
                y1={y}
                y2={y}
                stroke="#374151"
                strokeWidth={major ? 1.4 : mid ? 1 : 0.7}
              />
              {major && (
                <text x={DYN.cx - 12 - 20} y={y + 4} textAnchor="end" fontSize={11} fill="#374151">
                  {i / 10}
                </text>
              )}
            </g>
          );
        })}
        <text x={DYN.cx - 12 - 20} y={DYN.zeroY - 14} textAnchor="end" fontSize={11} fill="#374151">
          Н
        </text>

        {/* rod and pointer */}
        <line x1={DYN.cx} x2={DYN.cx} y1={12} y2={pointerY} stroke="#9ca3af" strokeWidth={2} />
        <line x1={DYN.cx - 12} x2={DYN.cx + 12} y1={pointerY} y2={pointerY} stroke="#dc2626" strokeWidth={2.2} />
        <polygon
          points={`${DYN.cx + 12},${pointerY - 4} ${DYN.cx + 12},${pointerY + 4} ${DYN.cx + 19},${pointerY}`}
          fill="#dc2626"
        />

        {/* lower rod, hook and thread */}
        <line x1={DYN.cx} x2={DYN.cx} y1={272} y2={hookY} stroke="#6b7280" strokeWidth={3} />
        <circle cx={DYN.cx} cy={hookY + 5} r={5.5} fill="none" stroke="#4b5563" strokeWidth={2.5} />
        <line x1={DYN.cx} x2={DYN.cx} y1={hookY + 10} y2={stackEnd} stroke="#6b7280" strokeWidth={1.2} />

        {/* shelf labels */}
        <text x={130} y={TABLE_Y + 24} textAnchor="middle" fontSize={11} fill="#374151">
          брусок
        </text>
        <text x={552} y={TABLE_Y + 24} textAnchor="middle" fontSize={11} fill="#374151">
          тягарці
        </text>

        {/* items */}
        {order.map((it) => {
          const p = drag?.id === it.id ? drag : (hungPos[it.id] ?? it.shelf);
          return (
            <g
              key={it.id}
              transform={`translate(${p.x},${p.y})`}
              style={{ cursor: drag?.id === it.id ? "grabbing" : "grab", touchAction: "none" }}
              onPointerDown={(e) => {
                setHung((prev) => prev.filter((i) => i !== it.id));
                start(e, it.id, p);
              }}
            >
              <title>{it.title}</title>
              <rect x={-it.w / 2 - 4} y={-it.h - 8} width={it.w + 8} height={it.h + 10} fill="transparent" />
              {it.id === "block" ? <WoodBlock w={it.w} h={it.h} /> : <MassWeight w={it.w} h={it.h} />}
            </g>
          );
        })}
      </svg>
      <div className="mt-1 flex flex-wrap items-center gap-3 text-sm">
        <button type="button" className={btn} onClick={() => setHung([])}>
          Зняти все з гачка
        </button>
        <span className="text-xs text-muted-foreground">
          Перетягніть брусок і тягарці на гачок динамометра. Вагу зчитуйте за червоною стрілкою; ціна
          поділки шкали — 0,1 Н. Без вантажу стрілка стоїть на нулі.
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------- ruler --------------------------------- */

const RULER = { x0: 34, pxCm: 40, len: 16, top: 200 };
const RULER_VB = { w: 700, h: 270 };
const BLOCK_VIEW_H = 34;

type Dim = "l" | "d" | "h";
const DIM_LABEL: Record<Dim, string> = { l: "довжина l", d: "ширина d", h: "висота h" };

function BoxPictogram({ dim }: { dim: Dim }) {
  const hl = "#dc2626";
  const base = "#6b7280";
  return (
    <g>
      <polygon points="0,18 20,0 100,0 80,18" fill="#e8cfa6" stroke={base} strokeWidth={1.4} />
      <rect x={0} y={18} width={80} height={36} fill="#d9b382" stroke={base} strokeWidth={1.4} />
      <polygon points="80,18 100,0 100,36 80,54" fill="#c49a64" stroke={base} strokeWidth={1.4} />
      {dim === "l" && <line x1={0} x2={80} y1={54} y2={54} stroke={hl} strokeWidth={3.5} />}
      {dim === "h" && <line x1={0} x2={0} y1={18} y2={54} stroke={hl} strokeWidth={3.5} />}
      {dim === "d" && <line x1={80} x2={100} y1={54} y2={36} stroke={hl} strokeWidth={3.5} />}
      <text x={40} y={70} textAnchor="middle" fontSize={12} fontStyle="italic" fill="#374151">
        l
      </text>
      <text x={-9} y={40} textAnchor="middle" fontSize={12} fontStyle="italic" fill="#374151">
        h
      </text>
      <text x={101} y={52} fontSize={12} fontStyle="italic" fill="#374151">
        d
      </text>
    </g>
  );
}

function RulerStation({ P }: { P: Params }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dim, setDim] = useState<Dim>("l");
  const [left, setLeft] = useState(2.3); // cm, position of the left edge of the block

  const value = P[dim];
  const wPx = value * RULER.pxCm;
  const snap = (xPx: number) => {
    const cm = clamp((xPx - RULER.x0) / RULER.pxCm, 0, RULER.len - value);
    return Math.round(cm * 10) / 10;
  };

  const { drag, start } = useSvgDrag(svgRef, RULER_VB.w, RULER_VB.h, (id, x) => {
    if (id === "block") setLeft(snap(x));
  });

  const leftCm = drag ? snap(drag.x) : clamp(left, 0, RULER.len - value);
  const xL = RULER.x0 + leftCm * RULER.pxCm;
  const xR = xL + wPx;
  const yTop = RULER.top - BLOCK_VIEW_H;

  const ticks = Array.from({ length: RULER.len * 10 + 1 }, (_, i) => i);

  return (
    <div className="my-2">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${RULER_VB.w} ${RULER_VB.h}`}
        className="w-full select-none"
        style={{ touchAction: "none", cursor: drag ? "grabbing" : undefined }}
        role="img"
        aria-label="Лінійка з міліметровими поділками та дерев'яний брусок"
      >
        <g transform="translate(540,40)">
          <BoxPictogram dim={dim} />
        </g>
        <text x={50} y={40} fontSize={13} fill="#374151">
          Вимірюється: {DIM_LABEL[dim]}
        </text>

        {/* ruler */}
        <rect
          x={RULER.x0 - 14}
          y={RULER.top}
          width={RULER.len * RULER.pxCm + 28}
          height={52}
          fill="#fdf3c4"
          stroke="#a8923a"
          rx={3}
        />
        {ticks.map((i) => {
          const x = RULER.x0 + (i / 10) * RULER.pxCm;
          const cm = i % 10 === 0;
          const half = i % 5 === 0;
          return (
            <g key={i}>
              <line
                x1={x}
                x2={x}
                y1={RULER.top}
                y2={RULER.top + (cm ? 20 : half ? 14 : 8)}
                stroke="#3f3a1c"
                strokeWidth={cm ? 1.4 : 0.8}
              />
              {cm && (
                <text x={x} y={RULER.top + 36} textAnchor="middle" fontSize={12} fill="#3f3a1c">
                  {i / 10}
                </text>
              )}
            </g>
          );
        })}
        <text x={RULER.x0 + RULER.len * RULER.pxCm + 8} y={RULER.top + 46} textAnchor="end" fontSize={11} fill="#3f3a1c">
          см
        </text>

        {/* arrow over the measured edge */}
        <g stroke="#dc2626" strokeWidth={1.5} fill="#dc2626">
          <line x1={xL} x2={xR} y1={yTop - 14} y2={yTop - 14} />
          <polygon points={`${xL},${yTop - 14} ${xL + 6},${yTop - 18} ${xL + 6},${yTop - 10}`} />
          <polygon points={`${xR},${yTop - 14} ${xR - 6},${yTop - 18} ${xR - 6},${yTop - 10}`} />
        </g>

        {/* block */}
        <g
          transform={`translate(${xL + wPx / 2},${RULER.top})`}
          style={{ cursor: drag ? "grabbing" : "grab", touchAction: "none" }}
          onPointerDown={(e) => start(e, "block", { x: xL, y: RULER.top })}
        >
          <title>Брусок: перетягніть уздовж лінійки</title>
          <rect x={-wPx / 2 - 4} y={-BLOCK_VIEW_H - 6} width={wPx + 8} height={BLOCK_VIEW_H + 10} fill="transparent" />
          <WoodBlock w={wPx} h={BLOCK_VIEW_H} label="брусок" />
        </g>

        {/* guide lines of the edges (looking straight down at the ruler) */}
        {[xL, xR].map((x, i) => (
          <line
            key={i}
            x1={x}
            x2={x}
            y1={RULER.top}
            y2={RULER.top + 52}
            stroke="#dc2626"
            strokeWidth={0.9}
            strokeDasharray="3 2"
            opacity={0.8}
            pointerEvents="none"
          />
        ))}
      </svg>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
        {(["l", "d", "h"] as Dim[]).map((k) => (
          <button key={k} type="button" className={btn} style={activeStyle(dim === k)} onClick={() => setDim(k)}>
            {k === "l" ? "Довжина l" : k === "d" ? "Ширина d" : "Висота h"}
          </button>
        ))}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Перетягніть брусок уздовж лінійки: він «прилипає» до міліметрових поділок. Розмір бруска —
        різниця показів лінійки біля його правого та лівого країв (штриховані лінії допомагають
        зчитати покази). 1 см = 10 мм.
      </p>
    </div>
  );
}

/* ---------------------------------- foam ---------------------------------- */

const FOAM = { x1: 90, x2: 610, top: 280, bottom: 350, cx: 350, pxCm: 11 };
const FOAM_VB = { w: 700, h: 410 };

type Face = 1 | 2 | 3;

/** Bottom face and standing height (the same numbering as in table 1: S₁ = l·d, S₂ = l·h, S₃ = d·h). */
function faceGeometry(P: Params, face: Face) {
  if (face === 1) return { wCm: P.l, hCm: P.h, areaCm2: P.l * P.d };
  if (face === 2) return { wCm: P.l, hCm: P.d, areaCm2: P.l * P.h };
  return { wCm: P.d, hCm: P.l, areaCm2: P.d * P.h };
}

function FoamStation({ P }: { P: Params }) {
  const [face, setFace] = useState<Face>(1);
  const [n, setN] = useState(0);

  const geo = faceGeometry(P, face);
  const force = P.blockW + n * P.weightW;
  const pressure = force / (geo.areaCm2 / 10000); // Pa
  const targetDent = Math.min(46, 8 * Math.sqrt(pressure / 100)); // schematic
  const dent = useEased(targetDent, 0.15);

  const wPx = geo.wCm * FOAM.pxCm;
  const hPx = geo.hCm * FOAM.pxCm;
  const yBottom = FOAM.top + dent;
  const bx1 = FOAM.cx - wPx / 2;
  const bx2 = FOAM.cx + wPx / 2;
  const foamPath = `M${FOAM.x1},${FOAM.top} L${bx1 - 4},${FOAM.top} Q${bx1},${yBottom} ${bx1 + 4},${yBottom} L${bx2 - 4},${yBottom} Q${bx2},${yBottom} ${bx2 + 4},${FOAM.top} L${FOAM.x2},${FOAM.top} L${FOAM.x2},${FOAM.bottom} L${FOAM.x1},${FOAM.bottom} Z`;
  const pores = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        x: FOAM.x1 + 8 + ((i * 97) % (FOAM.x2 - FOAM.x1 - 16)),
        y: FOAM.top + 8 + ((i * 53) % (FOAM.bottom - FOAM.top - 14)),
        r: 1 + (i % 3) * 0.6,
      })),
    [],
  );

  return (
    <div className="my-2">
      <svg
        viewBox={`0 0 ${FOAM_VB.w} ${FOAM_VB.h}`}
        className="w-full select-none"
        role="img"
        aria-label="Брусок на поролоновій подушці: вм'ятина тим глибша, чим більший тиск"
      >
        <rect x={0} y={FOAM.bottom} width={FOAM_VB.w} height={FOAM_VB.h - FOAM.bottom} fill="#e5e7eb" />
        <line x1={0} x2={FOAM_VB.w} y1={FOAM.bottom} y2={FOAM.bottom} stroke="#9ca3af" />

        <path d={foamPath} fill="#f2e29a" stroke="#b59d3a" strokeWidth={1.5} strokeLinejoin="round" />
        {pores.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#dcc96c" />
        ))}
        <text x={FOAM.x1 + 6} y={FOAM.bottom + 22} fontSize={11} fill="#374151">
          поролонова подушка
        </text>

        {/* block */}
        <g transform={`translate(${FOAM.cx},${yBottom})`}>
          <WoodBlock w={wPx} h={hPx} />
          {Array.from({ length: n }, (_, i) => (
            <g key={i} transform={`translate(0,${-hPx - i * 18})`}>
              <MassWeight w={Math.min(40, wPx - 6)} h={16} />
            </g>
          ))}
        </g>

        <text x={FOAM_VB.w - 14} y={30} textAnchor="end" fontSize={12} fill="#374151">
          Брусок лежить на грані {face} ({face === 1 ? "l × d" : face === 2 ? "l × h" : "d × h"})
        </text>
        <text x={FOAM_VB.w - 14} y={48} textAnchor="end" fontSize={12} fill="#374151">
          {n === 0 ? "без тягарців" : n === 1 ? "з одним тягарцем" : "з двома тягарцями"}
        </text>
      </svg>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-xs text-muted-foreground">Грань:</span>
        {([1, 2, 3] as Face[]).map((f) => (
          <button key={f} type="button" className={btn} style={activeStyle(face === f)} onClick={() => setFace(f)}>
            {f === 1 ? "1 (l × d)" : f === 2 ? "2 (l × h)" : "3 (d × h)"}
          </button>
        ))}
        <span className="ml-2 text-xs text-muted-foreground">Тягарці:</span>
        {[0, 1, 2].map((k) => (
          <button key={k} type="button" className={btn} style={activeStyle(n === k)} onClick={() => setN(k)}>
            {k}
          </button>
        ))}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Глибину вм&apos;ятини показано схематично: що більший тиск, то глибша вм&apos;ятина. Числових
        значень тут немає — тиск ви обчислюєте за результатами вимірювань на інших вкладках.
      </p>
    </div>
  );
}

/* ------------------------- footprint on squared paper ---------------------- */

const GRID = { cols: 28, rows: 12, cell: 23, x0: 28, y0: 24 };
const GRID_VB = { w: 700, h: 336 };

/** Outline of a foot print (u: heel → toe, v: inner edge → outer edge), both 0…1. */
const FOOT_BASE: Array<[number, number]> = [
  [0.0, 0.52],
  [0.03, 0.66],
  [0.1, 0.73],
  [0.22, 0.75],
  [0.36, 0.8],
  [0.5, 0.9],
  [0.62, 0.99],
  [0.74, 1.0],
  [0.85, 0.96],
  [0.92, 0.86],
  [0.96, 0.7],
  [0.99, 0.5],
  [1.0, 0.3],
  [0.98, 0.14],
  [0.92, 0.04],
  [0.82, 0.02],
  [0.7, 0.08],
  [0.6, 0.3],
  [0.5, 0.52],
  [0.4, 0.56],
  [0.3, 0.42],
  [0.18, 0.34],
  [0.06, 0.38],
  [0.01, 0.44],
];

/** Closed Catmull–Rom spline through the points. */
function smoothClosed(pts: Array<[number, number]>, steps = 8): Array<[number, number]> {
  const n = pts.length;
  const out: Array<[number, number]> = [];
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const t2 = t * t;
      const t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  return out;
}

function pointInPolygon(poly: Array<[number, number]>, x: number, y: number): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

const BASE_SMOOTH = smoothClosed(FOOT_BASE);

function buildFoot(f: Foot): Array<[number, number]> {
  return BASE_SMOOTH.map(([u, v]) => [f.ox + u * f.L, f.oy + v * f.W] as [number, number]);
}

/** Share (0…1) of every cell (1 cm × 1 cm) covered by the foot. */
function cellCoverage(poly: Array<[number, number]>): number[] {
  const S = 6;
  const out: number[] = [];
  for (let r = 0; r < GRID.rows; r++) {
    for (let c = 0; c < GRID.cols; c++) {
      let hit = 0;
      for (let i = 0; i < S; i++) {
        for (let j = 0; j < S; j++) {
          if (pointInPolygon(poly, c + (i + 0.5) / S, r + (j + 0.5) / S)) hit++;
        }
      }
      out.push(hit / (S * S));
    }
  }
  return out;
}

type Brush = "whole" | "partial" | "erase";
const BRUSH_VALUE: Record<Brush, number> = { whole: 1, partial: 2, erase: 0 };

function FootprintStation({ P }: { P: Params }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const paintingRef = useRef(false);
  const [brush, setBrush] = useState<Brush>("whole");
  const [marks, setMarks] = useState<number[]>(() => new Array(GRID.cols * GRID.rows).fill(0));
  const [report, setReport] = useState<string | null>(null);

  const poly = useMemo(() => buildFoot(P.foot), [P.foot]);
  const coverage = useMemo(() => cellCoverage(poly), [poly]);
  const px = (cm: number) => cm * GRID.cell;
  const footPath =
    poly.map(([x, y], i) => `${i ? "L" : "M"}${(GRID.x0 + px(x)).toFixed(1)},${(GRID.y0 + px(y)).toFixed(1)}`).join(" ") + " Z";

  const whole = marks.filter((m) => m === 1).length;
  const partial = marks.filter((m) => m === 2).length;

  const apply = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const x = ((clientX - r.left) / r.width) * GRID_VB.w;
    const y = ((clientY - r.top) / r.height) * GRID_VB.h;
    const c = Math.floor((x - GRID.x0) / GRID.cell);
    const rr = Math.floor((y - GRID.y0) / GRID.cell);
    if (c < 0 || c >= GRID.cols || rr < 0 || rr >= GRID.rows) return;
    const idx = rr * GRID.cols + c;
    const v = BRUSH_VALUE[brush];
    setMarks((prev) => (prev[idx] === v ? prev : prev.map((m, i) => (i === idx ? v : m))));
    setReport(null);
  };

  const check = () => {
    let wrong = 0; // marked, but marked incorrectly
    let missing = 0; // not marked yet, though it should be
    marks.forEach((m, i) => {
      const f = coverage[i];
      let ok: boolean;
      if (f === 0) ok = m === 0;
      else if (f < 0.1) ok = m === 0 || m === 2;
      else if (f < 1) ok = m === 2 || (f > 0.9 && m === 1);
      else ok = m === 1;
      if (ok) return;
      if (m === 0) missing++;
      else wrong++;
    });
    if (wrong === 0 && missing === 0) {
      setReport("Розмітка правильна: усі клітинки позначено вірно.");
      return;
    }
    const parts: string[] = [];
    if (wrong > 0)
      parts.push(
        `неправильно позначено клітинок: ${wrong} (цілі повністю лежать усередині контуру, неповні — лише частково)`,
      );
    if (missing > 0) parts.push(`ще не позначено клітинок, які потрібно позначити: ${missing}`);
    setReport(`Результат перевірки: ${parts.join("; ")}.`);
  };

  return (
    <div className="my-2">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${GRID_VB.w} ${GRID_VB.h}`}
        className="w-full select-none"
        style={{ touchAction: "none", cursor: "crosshair" }}
        role="img"
        aria-label="Слід ступні на папері в клітинку: позначайте цілі та неповні клітинки"
        onPointerDown={(e) => {
          e.preventDefault();
          e.currentTarget.setPointerCapture(e.pointerId);
          paintingRef.current = true;
          apply(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (paintingRef.current) apply(e.clientX, e.clientY);
        }}
        onPointerUp={() => {
          paintingRef.current = false;
        }}
        onPointerCancel={() => {
          paintingRef.current = false;
        }}
      >
        <rect x={GRID.x0} y={GRID.y0} width={px(GRID.cols)} height={px(GRID.rows)} fill="#ffffff" />
        <path d={footPath} fill="#e9b88f" stroke="#a5683a" strokeWidth={1.6} strokeLinejoin="round" opacity={0.9} />

        {marks.map((m, i) =>
          m ? (
            <rect
              key={i}
              x={GRID.x0 + (i % GRID.cols) * GRID.cell + 1}
              y={GRID.y0 + Math.floor(i / GRID.cols) * GRID.cell + 1}
              width={GRID.cell - 2}
              height={GRID.cell - 2}
              fill={m === 1 ? "rgba(34,197,94,0.55)" : "rgba(250,204,21,0.65)"}
              pointerEvents="none"
            />
          ) : null,
        )}

        <path
          d={
            Array.from({ length: GRID.cols + 1 }, (_, c) => `M${GRID.x0 + c * GRID.cell},${GRID.y0} V${GRID.y0 + px(GRID.rows)}`).join(" ") +
            " " +
            Array.from({ length: GRID.rows + 1 }, (_, r) => `M${GRID.x0},${GRID.y0 + r * GRID.cell} H${GRID.x0 + px(GRID.cols)}`).join(" ")
          }
          stroke="#94a3b8"
          strokeWidth={0.8}
          fill="none"
          pointerEvents="none"
        />
        <rect x={GRID.x0} y={GRID.y0} width={px(GRID.cols)} height={px(GRID.rows)} fill="none" stroke="#64748b" strokeWidth={1.4} pointerEvents="none" />
        <text x={GRID.x0} y={GRID_VB.h - 10} fontSize={11} fill="#374151">
          Сторона однієї клітинки — 1 см, тобто площа клітинки S₀ = 1 см²
        </text>
      </svg>

      <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
        <span className="text-xs text-muted-foreground">Позначати:</span>
        <button type="button" className={btn} style={activeStyle(brush === "whole")} onClick={() => setBrush("whole")}>
          Цілі (зелені)
        </button>
        <button type="button" className={btn} style={activeStyle(brush === "partial")} onClick={() => setBrush("partial")}>
          Неповні (жовті)
        </button>
        <button type="button" className={btn} style={activeStyle(brush === "erase")} onClick={() => setBrush("erase")}>
          Стерти
        </button>
        <button type="button" className={btn} onClick={check}>
          Перевірити розмітку
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => {
            setMarks(new Array(GRID.cols * GRID.rows).fill(0));
            setReport(null);
          }}
        >
          Очистити
        </button>
      </div>
      <p className="mt-1 text-sm">
        Позначено: цілих клітинок n = <strong>{whole}</strong>, неповних k = <strong>{partial}</strong>.
      </p>
      {report && <p className="mt-1 text-sm">{report}</p>}
      <p className="mt-1 text-sm">
        Маса людини, слід ступні якої ви вимірюєте: m = <strong>{fmt(P.personMass)} кг</strong>. Вага
        людини P = m·g, де g = {G} Н/кг.
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Клацайте або проводьте мишею (пальцем) по клітинках. Клітинка, що повністю лежить усередині
        контуру, — ціла; клітинка, яку контур перетинає, — неповна. Площа сліду S = (n + k/2)·S₀.
      </p>
    </div>
  );
}

/* ---------------------------------- bench ---------------------------------- */

type Tab = "dynamometer" | "ruler" | "foam" | "paper";
const TABS: Array<[Tab, string]> = [
  ["dynamometer", "Динамометр"],
  ["ruler", "Лінійка"],
  ["foam", "Поролон"],
  ["paper", "Папір у клітинку"],
];

export function PressureBench() {
  const [P, setP] = useState<Params>(DEFAULT_PARAMS);
  const [tab, setTab] = useState<Tab>("dynamometer");

  // hidden random values (client only, to avoid hydration mismatch)
  useEffect(() => {
    setP(randomParams());
  }, []);

  return (
    <div className="my-4 rounded-lg border p-3" style={{ background: "rgba(0,0,0,0.02)" }}>
      <div className="flex flex-wrap gap-2 text-sm">
        {TABS.map(([id, label]) => (
          <button key={id} type="button" className={btn} style={activeStyle(tab === id)} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: tab === "dynamometer" ? undefined : "none" }}>
        <DynamometerStation P={P} />
      </div>
      <div style={{ display: tab === "ruler" ? undefined : "none" }}>
        <RulerStation P={P} />
      </div>
      <div style={{ display: tab === "foam" ? undefined : "none" }}>
        <FoamStation P={P} />
      </div>
      <div style={{ display: tab === "paper" ? undefined : "none" }}>
        <FootprintStation P={P} />
      </div>
    </div>
  );
}
