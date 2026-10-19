"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

/**
 * Virtual beam balance for the "mass measurement" lab.
 *
 * Bodies (two blocks, an empty glass, a glass with water, a coin), scraps of
 * paper and a set of weights (grams and milligrams) can be dragged with the
 * mouse or a finger onto either pan. The beam tilts according to the real mass
 * difference; a pointer (amplified ×20) and a lamp show when the balance is in
 * equilibrium. The masses of the bodies are random and hidden — the student
 * has to find them by weighing.
 */

const VB_W = 700;
const VB_H = 480;
const C = { x: 350, y: 100 }; // beam pivot
const H = 200; // half length of the beam
const HANG = 110; // distance from beam end to pan surface
const PAN_HALF = 90;
const MAX_ANGLE = 7; // degrees
const POINTER_GAIN = 20;
const EQUILIBRIUM_EPS = 0.005; // g

type Side = "L" | "R";
type Shape = "block" | "cyl" | "glass" | "coin" | "paper" | "weight" | "mgweight";

type Item = {
  id: string;
  title: string;
  shape: Shape;
  label?: string;
  w: number;
  h: number;
  tray: { x: number; y: number };
  /** mass in g */
  mass: number;
  /** glass only: fraction (0…1) of the glass filled with liquid */
  fillFrac?: number;
  fillColor?: string;
};

/** A body that can be put on the balance (supplied by the lab page). */
export type BalanceBody = {
  id: string;
  title: string;
  shape: "block" | "cyl" | "glass" | "coin";
  label?: string;
  /** mass, g */
  mass: number;
  fillFrac?: number;
  fillColor?: string;
};

const BODY_SIZE: Record<BalanceBody["shape"], { w: number; h: number }> = {
  block: { w: 34, h: 28 },
  cyl: { w: 30, h: 34 },
  glass: { w: 34, h: 44 },
  coin: { w: 24, h: 6 },
};

const G_WEIGHTS: Array<[string, number]> = [
  ["w100", 100],
  ["w50", 50],
  ["w20a", 20],
  ["w20b", 20],
  ["w10", 10],
  ["w5", 5],
  ["w2a", 2],
  ["w2b", 2],
  ["w1", 1],
];
const MG_WEIGHTS: Array<[string, number]> = [
  ["m500", 0.5],
  ["m200a", 0.2],
  ["m200b", 0.2],
  ["m100", 0.1],
  ["m50", 0.05],
  ["m20a", 0.02],
  ["m20b", 0.02],
  ["m10", 0.01],
];

const COMMON_ITEMS: Item[] = [
  ...[0, 1, 2].map<Item>((i) => ({
    id: `paper${i + 1}`,
    title: "Клаптик паперу",
    shape: "paper",
    w: 14,
    h: 8,
    tray: { x: 252 + i * 18, y: 450 },
    mass: 0.02,
  })),
  ...G_WEIGHTS.map<Item>(([id, m], i) => ({
    id,
    title: `Гиря ${m} г`,
    shape: "weight",
    label: `${m} г`,
    w: m >= 20 ? 32 : 28,
    h: 18,
    tray: { x: 345 + i * 38, y: 404 },
    mass: m,
  })),
  ...MG_WEIGHTS.map<Item>(([id, m], i) => ({
    id,
    title: `Гиря ${Math.round(m * 1000)} мг`,
    shape: "mgweight",
    label: `${Math.round(m * 1000)} мг`,
    w: 36,
    h: 12,
    tray: { x: 345 + i * 38, y: 446 },
    mass: m,
  })),
];

function buildItems(bodies: BalanceBody[]): Item[] {
  const bodyItems = bodies.map<Item>((b, i) => ({
    id: b.id,
    title: b.title,
    shape: b.shape,
    label: b.label,
    w: BODY_SIZE[b.shape].w,
    h: BODY_SIZE[b.shape].h,
    tray: { x: 36 + i * 46, y: 450 },
    mass: b.mass,
    fillFrac: b.fillFrac,
    fillColor: b.fillColor,
  }));
  return [...bodyItems, ...COMMON_ITEMS];
}

/** Positions (relative to the pan centre, anchor = bottom centre) of the items lying on a pan. */
function layoutPan(ids: string[], byId: Record<string, Item>): Record<string, { dx: number; dy: number }> {
  const out: Record<string, { dx: number; dy: number }> = {};
  const limit = PAN_HALF - 4;
  let cursor = -limit;
  let rowBase = -1;
  let rowH = 0;
  ids.forEach((id) => {
    const it = byId[id];
    if (cursor + it.w > limit && rowH > 0) {
      rowBase -= rowH + 2;
      cursor = -limit;
      rowH = 0;
    }
    out[id] = { dx: cursor + it.w / 2, dy: rowBase };
    cursor += it.w + 3;
    rowH = Math.max(rowH, it.h);
  });
  return out;
}

function ItemShape({ it }: { it: Item }) {
  const { w, h } = it;
  switch (it.shape) {
    case "block":
      return (
        <g>
          <rect x={-w / 2} y={-h} width={w} height={h} fill="#8d99ae" stroke="#4a5568" strokeWidth={1.5} rx={2} />
          <line x1={-w / 2 + 3} x2={w / 2 - 3} y1={-h + 5} y2={-h + 5} stroke="#cbd5e1" strokeWidth={2} />
          <text y={-9} textAnchor="middle" fontSize={11} fill="#1f2937">{it.label}</text>
        </g>
      );
    case "cyl":
      return (
        <g>
          <rect x={-w / 2} y={-h + 4} width={w} height={h - 8} fill="#c97b4a" stroke="#7c4a2a" strokeWidth={1.5} />
          <ellipse cx={0} cy={-h + 4} rx={w / 2} ry={4} fill="#dd9a6d" stroke="#7c4a2a" strokeWidth={1.5} />
          <ellipse cx={0} cy={-4} rx={w / 2} ry={4} fill="#c97b4a" stroke="#7c4a2a" strokeWidth={1.5} />
          <text y={-12} textAnchor="middle" fontSize={11} fill="#3b1f0f">{it.label}</text>
        </g>
      );
    case "glass": {
      const f = Math.max(0, Math.min(1, it.fillFrac ?? 0));
      return (
        <g>
          {f > 0 && (
            <path
              d={`M${-w / 2 + 3 * (1 - f)},${-h * f} L${w / 2 - 3 * (1 - f)},${-h * f} L${w / 2 - 3},-1 L${-w / 2 + 3},-1 Z`}
              fill={it.fillColor ?? "#7fb4e8"}
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
    case "coin":
      return (
        <g>
          <ellipse cx={0} cy={-3} rx={w / 2} ry={3} fill="#e0b64a" stroke="#8a6d0b" strokeWidth={1.2} />
        </g>
      );
    case "paper":
      return (
        <polygon points={`${-w / 2},0 ${w / 2},0 ${w / 2 - 1},${-h} ${-w / 2 + 2},${-h + 1}`} fill="#ffffff" stroke="#9ca3af" strokeWidth={1} />
      );
    case "weight":
      return (
        <g>
          <rect x={-w / 2} y={-h} width={w} height={h} fill="#d4a017" stroke="#8a6d0b" strokeWidth={1.2} rx={3} />
          <text y={-5} textAnchor="middle" fontSize={9} fontWeight="bold" fill="#3b2a00">{it.label}</text>
        </g>
      );
    case "mgweight":
      return (
        <g>
          <rect x={-w / 2} y={-h} width={w} height={h} fill="#cfd4da" stroke="#6b7280" strokeWidth={1.2} rx={2} />
          <text y={-3} textAnchor="middle" fontSize={8} fill="#1f2937">{it.label}</text>
        </g>
      );
  }
}

export function BalanceScale({ bodies, delta }: { bodies: BalanceBody[]; delta: number }) {
  const items = useMemo(() => buildItems(bodies), [bodies]);
  const byId = useMemo<Record<string, Item>>(
    () => Object.fromEntries(items.map((it) => [it.id, it])),
    [items],
  );
  const [placed, setPlaced] = useState<Record<string, { side: Side; seq: number }>>({});
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const [angle, setAngle] = useState(0);

  const seqRef = useRef(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const angleRef = useRef(0);
  const velRef = useRef(0);
  const targetRef = useRef(0);
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);
  const panRef = useRef<Record<Side, { x: number; y: number }>>({ L: { x: 0, y: 0 }, R: { x: 0, y: 0 } });

  // physics: mass difference → target angle
  let mL = delta;
  let mR = 0;
  Object.entries(placed).forEach(([id, p]) => {
    const m = byId[id]?.mass ?? 0;
    if (p.side === "L") mL += m;
    else mR += m;
  });
  const diff = mL - mR;
  const balanced = Math.abs(diff) < EQUILIBRIUM_EPS;
  const target = balanced ? 0 : MAX_ANGLE * Math.tanh(diff / 0.4);

  // spring animation of the beam. The loop belongs to the effect and is cancelled
  // by its own cleanup, so it restarts correctly (also in React StrictMode).
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const a = angleRef.current;
      const v = velRef.current;
      const nv = v + ((target - a) * 0.06 - v * 0.14);
      const na = a + nv;
      if (Math.abs(target - na) < 0.003 && Math.abs(nv) < 0.003) {
        angleRef.current = target;
        velRef.current = 0;
        setAngle(target);
        return;
      }
      angleRef.current = na;
      velRef.current = nv;
      setAngle(na);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  // geometry of the beam and pans
  const rad = (angle * Math.PI) / 180;
  const leftEnd = { x: C.x - H * Math.cos(rad), y: C.y + H * Math.sin(rad) };
  const rightEnd = { x: C.x + H * Math.cos(rad), y: C.y - H * Math.sin(rad) };
  const pans: Record<Side, { x: number; y: number }> = {
    L: { x: leftEnd.x, y: leftEnd.y + HANG },
    R: { x: rightEnd.x, y: rightEnd.y + HANG },
  };

  const layouts: Record<Side, Record<string, { dx: number; dy: number }>> = { L: {}, R: {} };
  (["L", "R"] as Side[]).forEach((side) => {
    const ids = Object.entries(placed)
      .filter(([, p]) => p.side === side)
      .sort((a, b) => a[1].seq - b[1].seq)
      .map(([id]) => id);
    layouts[side] = layoutPan(ids.filter((id) => byId[id]), byId);
  });

  const posOf = (id: string): { x: number; y: number } => {
    if (drag && drag.id === id) return { x: drag.x, y: drag.y };
    const p = placed[id];
    if (p) {
      const l = layouts[p.side][id];
      return { x: pans[p.side].x + l.dx, y: pans[p.side].y + l.dy };
    }
    return byId[id].tray;
  };

  panRef.current = pans;

  const clientToSvg = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const r = svg.getBoundingClientRect();
    return {
      x: ((clientX - r.left) / r.width) * VB_W,
      y: ((clientY - r.top) / r.height) * VB_H,
    };
  };

  // which pan (if any) is the item over
  const sideAt = (id: string, x: number, y: number): Side | null => {
    const it = byId[id];
    const cy = y - it.h / 2;
    const sides: Side[] = ["L", "R"];
    for (const side of sides) {
      const pan = panRef.current[side];
      if (Math.abs(x - pan.x) <= PAN_HALF + 30 && cy >= pan.y - 150 && cy <= pan.y + 30) {
        return side;
      }
    }
    return null;
  };

  const onDown = (e: ReactPointerEvent<SVGGElement>, id: string) => {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    const p = clientToSvg(e.clientX, e.clientY);
    const cur = posOf(id);
    dragRef.current = { id, dx: cur.x - p.x, dy: cur.y - p.y };
    setPlaced((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setDrag({ id, x: cur.x, y: cur.y });
  };

  // While an item is being dragged, listen on the whole window: the pointer
  // never "loses" the item, even if it moves fast or leaves the drawing.
  const draggingId = drag?.id ?? null;
  useEffect(() => {
    if (!draggingId) return;

    const move = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const p = clientToSvg(e.clientX, e.clientY);
      setDrag({ id: d.id, x: p.x + d.dx, y: p.y + d.dy });
    };
    const up = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      dragRef.current = null;
      const p = clientToSvg(e.clientX, e.clientY);
      const side = sideAt(d.id, p.x + d.dx, p.y + d.dy);
      if (side) {
        seqRef.current += 1;
        const seq = seqRef.current;
        setPlaced((prev) => ({ ...prev, [d.id]: { side, seq } }));
      }
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

  const clearPans = () => {
    setPlaced({});
    setDrag(null);
  };

  const hoverSide = drag ? sideAt(drag.id, drag.x, drag.y) : null;
  const pointerAngle = Math.max(-40, Math.min(40, angle * POINTER_GAIN));
  const ticks = [-40, -30, -20, -10, 0, 10, 20, 30, 40];

  const order = items.map((it) => it.id).filter((id) => !drag || drag.id !== id);
  if (drag) order.push(drag.id);

  return (
    <div className="my-4 rounded-lg border p-3" style={{ background: "rgba(0,0,0,0.02)" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="w-full select-none"
        style={{ touchAction: "none", cursor: drag ? "grabbing" : undefined }}
        role="img"
        aria-label="Віртуальні важільні терези з тілами та набором гир"
      >
        {/* table */}
        <rect x={0} y={352} width={VB_W} height={VB_H - 352} fill="#e5e7eb" />
        <line x1={0} x2={VB_W} y1={352} y2={352} stroke="#9ca3af" />

        {/* stand */}
        <rect x={344} y={100} width={12} height={240} fill="#6b7280" />
        <rect x={270} y={340} width={160} height={12} fill="#4b5563" rx={3} />

        {/* indicator plate with scale and lamp */}
        <rect x={296} y={158} width={108} height={30} fill="#f3f4f6" stroke="#9ca3af" rx={3} />
        {ticks.map((t) => {
          const phi = (t * Math.PI) / 180;
          const r1 = t === 0 ? 70 : 76;
          const r2 = 84;
          return (
            <line
              key={t}
              x1={C.x + r1 * Math.sin(phi)}
              y1={C.y + r1 * Math.cos(phi)}
              x2={C.x + r2 * Math.sin(phi)}
              y2={C.y + r2 * Math.cos(phi)}
              stroke={t === 0 ? "#16a34a" : "#6b7280"}
              strokeWidth={t === 0 ? 2.5 : 1.5}
            />
          );
        })}
        <g transform={`rotate(${-pointerAngle} ${C.x} ${C.y})`}>
          <line x1={C.x} y1={C.y} x2={C.x} y2={C.y + 74} stroke="#dc2626" strokeWidth={2.5} />
          <polygon points={`${C.x - 3},${C.y + 68} ${C.x + 3},${C.y + 68} ${C.x},${C.y + 78}`} fill="#dc2626" />
        </g>
        <circle cx={C.x} cy={212} r={5} fill={balanced ? "#16a34a" : "#9ca3af"} stroke="#374151" />
        <text x={C.x} y={230} textAnchor="middle" fontSize={10} fill="#374151">
          {balanced ? "рівновага" : "немає рівноваги"}
        </text>

        {/* beam */}
        <g transform={`rotate(${-angle} ${C.x} ${C.y})`}>
          <rect x={C.x - H} y={C.y - 4} width={2 * H} height={8} fill="#4b5563" rx={4} />
        </g>
        <circle cx={C.x} cy={C.y} r={7} fill="#111827" />

        {/* strings and pans */}
        {(["L", "R"] as Side[]).map((side) => {
          const end = side === "L" ? leftEnd : rightEnd;
          const pan = pans[side];
          return (
            <g key={side}>
              <circle cx={end.x} cy={end.y} r={4} fill="#111827" />
              <line x1={end.x} y1={end.y} x2={pan.x - PAN_HALF + 6} y2={pan.y} stroke="#6b7280" strokeWidth={1.5} />
              <line x1={end.x} y1={end.y} x2={pan.x + PAN_HALF - 6} y2={pan.y} stroke="#6b7280" strokeWidth={1.5} />
              {hoverSide === side && (
                <rect
                  x={pan.x - PAN_HALF - 8}
                  y={pan.y - 110}
                  width={2 * PAN_HALF + 16}
                  height={124}
                  fill="rgba(59,130,246,0.10)"
                  stroke="#3b82f6"
                  strokeDasharray="5 4"
                  rx={8}
                />
              )}
              <rect x={pan.x - PAN_HALF} y={pan.y} width={2 * PAN_HALF} height={6} fill="#9ca3af" stroke="#4b5563" rx={3} />
            </g>
          );
        })}

        {/* trays */}
        <rect x={10} y={364} width={300} height={108} fill="#cbd5e1" stroke="#64748b" rx={6} />
        <text x={20} y={380} fontSize={11} fill="#334155">Тіла та клаптики паперу</text>
        <rect x={320} y={364} width={370} height={108} fill="#374151" stroke="#111827" rx={6} />
        <text x={330} y={380} fontSize={11} fill="#e5e7eb">Набір гир</text>

        {/* items */}
        {order.map((id) => {
          const it = byId[id];
          const p = posOf(id);
          const isDragging = drag?.id === id;
          return (
            <g
              key={id}
              transform={`translate(${p.x},${p.y})`}
              style={{ cursor: isDragging ? "grabbing" : "grab", touchAction: "none" }}
              onPointerDown={(e) => onDown(e, id)}
            >
              <title>{it.title}</title>
              {/* larger invisible hit area for fingers */}
              <rect x={-it.w / 2 - 3} y={-it.h - 3} width={it.w + 6} height={it.h + 6} fill="transparent" />
              <ItemShape it={it} />
            </g>
          );
        })}
      </svg>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
        <button type="button" className="rounded border px-3 py-1" onClick={clearPans}>
          Прибрати все з терезів
        </button>
        <span className="text-xs text-muted-foreground">
          Перетягуйте тіла, клаптики паперу та гирі мишею (або пальцем) на шальки. Щоб
          зняти предмет, перетягніть його назад.
        </span>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Терези в рівновазі, коли червона стрілка стоїть на зеленій позначці, а
        коромисло горизонтальне. Маси тіл у кожному запуску випадкові. Порожні
        шальки спочатку не зрівноважені — зрівноважте їх клаптиками паперу.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Lab "Вимірювання мас тіл": набір тіл з випадковими масами            */
/* ------------------------------------------------------------------ */

type Masses = { body1: number; body2: number; glass: number; water: number; coin: number; delta: number };

const DEFAULT_MASSES: Masses = { body1: 47.3, body2: 62.15, glass: 58.2, water: 84.5, coin: 4.1, delta: 0.04 };

const rnd = (min: number, max: number) => Math.round((min + Math.random() * (max - min)) * 100) / 100;

function randomMasses(): Masses {
  return {
    body1: rnd(18, 92),
    body2: rnd(25, 110),
    glass: rnd(45, 70),
    water: rnd(60, 110),
    coin: rnd(2, 7),
    // the left pan is slightly heavier than the right one: scraps of paper are needed
    delta: [0.02, 0.04, 0.06][Math.floor(Math.random() * 3)],
  };
}

export function BalanceBench() {
  const [masses, setMasses] = useState<Masses>(DEFAULT_MASSES);

  // hidden random masses (client only, to avoid hydration mismatch)
  useEffect(() => {
    setMasses(randomMasses());
  }, []);

  const bodies = useMemo<BalanceBody[]>(
    () => [
      { id: "body1", title: "Тіло 1", shape: "block", label: "1", mass: masses.body1 },
      { id: "body2", title: "Тіло 2", shape: "cyl", label: "2", mass: masses.body2 },
      { id: "glass", title: "Порожня склянка", shape: "glass", mass: masses.glass },
      {
        id: "glass_water",
        title: "Склянка з водою",
        shape: "glass",
        mass: masses.glass + masses.water,
        fillFrac: 0.62,
        fillColor: "#7fb4e8",
      },
      { id: "coin", title: "Монетка", shape: "coin", mass: masses.coin },
    ],
    [masses],
  );

  return <BalanceScale bodies={bodies} delta={masses.delta} />;
}
