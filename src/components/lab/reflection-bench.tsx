"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

/**
 * Virtual set-up for the lab "Дослідження відбивання світла" (top view of a sheet of paper).
 *
 * A lamp with a slit screen sends a narrow beam at the point O of a flat mirror. The lamp
 * slides along an arc when dragged, which changes the angle of incidence. As in the real
 * experiment the student can:
 *  – mark the points A (on the incident beam) and A₁ (on the reflected beam) with a pencil;
 *  – remove the mirror (the beams disappear, the pencil lines AO and OA₁ stay on the paper);
 *  – draw the normal at O;
 *  – put a protractor on the sheet (its base lies along the mirror line, the 90° mark is
 *    the normal) and read the angles.
 *
 * The angle is random at start and hidden: it has to be measured with the protractor.
 */

const VB = { w: 700, h: 420 };
const O = { x: 350, y: 330 };
const LAMP_R = 270; // distance from O to the lamp
const MARK_R = 215; // distance from O to the pencil marks
const PROT_R = 190; // radius of the protractor
const MIN_I = 5;
const MAX_I = 80;

type Pt = { x: number; y: number };

const rad = (deg: number) => (deg * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

/** Signed angle of incidence i: i > 0 — the lamp is to the left of the normal. */
const normalizeI = (i: number) => {
  const s = i < 0 ? -1 : 1;
  return s * clamp(Math.abs(i), MIN_I, MAX_I);
};
const randomI = () => {
  const mag = 15 + Math.random() * 55;
  return (Math.random() < 0.5 ? -1 : 1) * Math.round(mag * 10) / 10;
};

const lampPos = (i: number): Pt => ({
  x: O.x - LAMP_R * Math.sin(rad(i)),
  y: O.y - LAMP_R * Math.cos(rad(i)),
});
const incidentPoint = (i: number, r: number): Pt => ({
  x: O.x - r * Math.sin(rad(i)),
  y: O.y - r * Math.cos(rad(i)),
});
const reflectedPoint = (i: number, r: number): Pt => ({
  x: O.x + r * Math.sin(rad(i)),
  y: O.y - r * Math.cos(rad(i)),
});

/** Dragging inside an <svg> (the window listens for the pointer while an item is held). */
function useSvgDrag(
  svgRef: { current: SVGSVGElement | null },
  onMove: (p: Pt) => void,
) {
  const [dragging, setDragging] = useState(false);
  const moveRef = useRef(onMove);
  moveRef.current = onMove;

  const toSvg = (clientX: number, clientY: number): Pt => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const r = svg.getBoundingClientRect();
    return { x: ((clientX - r.left) / r.width) * VB.w, y: ((clientY - r.top) / r.height) * VB.h };
  };

  const start = (e: ReactPointerEvent<SVGElement>) => {
    if (e.button !== undefined && e.button !== 0) return;
    e.preventDefault();
    setDragging(true);
  };

  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => moveRef.current(toSvg(e.clientX, e.clientY));
    const up = () => setDragging(false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging]);

  return { dragging, start };
}

function Protractor() {
  const ticks = Array.from({ length: 181 }, (_, d) => d);
  const at = (d: number, r: number): Pt => ({
    x: O.x + r * Math.cos(rad(d)),
    y: O.y - r * Math.sin(rad(d)),
  });
  return (
    <g pointerEvents="none">
      <path
        d={`M${O.x - PROT_R},${O.y} A${PROT_R},${PROT_R} 0 0 1 ${O.x + PROT_R},${O.y} Z`}
        fill="rgba(186,222,245,0.28)"
        stroke="#64748b"
        strokeWidth={1.4}
      />
      <rect x={O.x - PROT_R} y={O.y} width={2 * PROT_R} height={10} fill="rgba(186,222,245,0.45)" stroke="#64748b" />
      {ticks.map((d) => {
        const major = d % 10 === 0;
        const mid = d % 5 === 0;
        const len = major ? 16 : mid ? 11 : 6;
        const a = at(d, PROT_R);
        const b = at(d, PROT_R - len);
        return (
          <line
            key={d}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke={d === 90 ? "#dc2626" : "#334155"}
            strokeWidth={major ? 1.2 : 0.7}
          />
        );
      })}
      {ticks
        .filter((d) => d % 10 === 0)
        .map((d) => {
          const p1 = at(d, PROT_R - 27);
          const p2 = at(d, PROT_R - 43);
          return (
            <g key={d}>
              <text x={p1.x} y={p1.y + 3} textAnchor="middle" fontSize={9} fill="#1e293b">
                {d}
              </text>
              <text x={p2.x} y={p2.y + 3} textAnchor="middle" fontSize={9} fill="#2563eb">
                {180 - d}
              </text>
            </g>
          );
        })}
      {/* centre mark */}
      <line x1={O.x - 9} x2={O.x + 9} y1={O.y} y2={O.y} stroke="#1e293b" strokeWidth={1} />
      <line x1={O.x} x2={O.x} y1={O.y - 9} y2={O.y + 9} stroke="#1e293b" strokeWidth={1} />
    </g>
  );
}

function Lamp() {
  return (
    <g>
      {/* drawn pointing "down" (+y); the front of the slit is the origin */}
      <rect x={-18} y={-64} width={36} height={52} fill="#4b5563" stroke="#1f2937" rx={4} />
      <circle cx={0} cy={-46} r={7} fill="#fde047" stroke="#a16207" />
      <rect x={-26} y={-12} width={52} height={12} fill="#f3f4f6" stroke="#6b7280" />
      <rect x={-1.6} y={-12} width={3.2} height={12} fill="#f59e0b" />
      <title>Лампочка зі щілиною: перетягніть, щоб змінити кут падіння</title>
      <rect x={-30} y={-68} width={60} height={72} fill="transparent" />
    </g>
  );
}

export function ReflectionBench() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [i, setI] = useState(35); // deterministic first render, random after mount
  const [mirrorOn, setMirrorOn] = useState(true);
  const [protractor, setProtractor] = useState(true);
  const [normal, setNormal] = useState(false);
  const [marks, setMarks] = useState<{ A: Pt; A1: Pt } | null>(null);

  useEffect(() => {
    setI(randomI());
  }, []);

  const { dragging, start } = useSvgDrag(svgRef, (p) => {
    const dx = O.x - p.x; // > 0 — the lamp is to the left
    const dy = Math.max(O.y - p.y, 20);
    setI(normalizeI(deg(Math.atan2(dx, dy))));
  });

  const L = lampPos(i);
  const R = reflectedPoint(i, 290);

  return (
    <div className="my-4 rounded-lg border p-3" style={{ background: "rgba(0,0,0,0.02)" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        className="w-full select-none"
        style={{ touchAction: "none", cursor: dragging ? "grabbing" : undefined }}
        role="img"
        aria-label="Вигляд зверху: лампочка зі щілиною, плоске дзеркало, аркуш паперу й транспортир"
      >
        {/* table and sheet */}
        <rect x={0} y={0} width={VB.w} height={VB.h} fill="#e5e7eb" />
        <rect x={20} y={8} width={660} height={376} fill="#ffffff" stroke="#9ca3af" />

        {/* pencil line along the mirror */}
        <line x1={60} x2={640} y1={O.y} y2={O.y} stroke="#6b7280" strokeWidth={1} strokeDasharray="6 4" />
        <text x={64} y={O.y + 22} fontSize={11} fill="#6b7280">
          лінія вздовж поверхні дзеркала
        </text>

        {/* mirror */}
        {mirrorOn && (
          <g>
            <rect x={120} y={O.y} width={460} height={7} fill="#bfe3d4" stroke="#3f6b5a" strokeWidth={1.4} />
            {Array.from({ length: 46 }, (_, k) => (
              <line key={k} x1={124 + k * 10} x2={116 + k * 10} y1={O.y + 7} y2={O.y + 15} stroke="#6b7280" strokeWidth={1} />
            ))}
          </g>
        )}

        {/* protractor */}
        {protractor && <Protractor />}

        {/* normal */}
        {normal && (
          <line x1={O.x} x2={O.x} y1={O.y} y2={40} stroke="#111827" strokeWidth={1} strokeDasharray="7 4" />
        )}

        {/* light beams */}
        {mirrorOn && (
          <g pointerEvents="none">
            <polyline points={`${L.x},${L.y} ${O.x},${O.y} ${R.x},${R.y}`} fill="none" stroke="#f59e0b" strokeOpacity={0.28} strokeWidth={9} strokeLinejoin="round" />
            <polyline points={`${L.x},${L.y} ${O.x},${O.y} ${R.x},${R.y}`} fill="none" stroke="#f59e0b" strokeWidth={2.4} strokeLinejoin="round" />
          </g>
        )}

        {/* pencil marks */}
        {marks && (
          <g pointerEvents="none">
            {!mirrorOn && (
              <>
                <line x1={marks.A.x} y1={marks.A.y} x2={O.x} y2={O.y} stroke="#374151" strokeWidth={1.3} />
                <line x1={O.x} y1={O.y} x2={marks.A1.x} y2={marks.A1.y} stroke="#374151" strokeWidth={1.3} />
              </>
            )}
            {([
              ["A", marks.A, -12, -6],
              ["A₁", marks.A1, 8, -6],
              ["O", O, 8, 18],
            ] as Array<[string, Pt, number, number]>).map(([name, p, dx, dy]) => (
              <g key={name}>
                <circle cx={p.x} cy={p.y} r={3.5} fill="#111827" />
                <text x={p.x + dx} y={p.y + dy} fontSize={15} fontStyle="italic" fill="#111827">
                  {name}
                </text>
              </g>
            ))}
          </g>
        )}

        {/* lamp */}
        <g
          transform={`translate(${L.x},${L.y}) rotate(${-i})`}
          style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
          onPointerDown={start}
        >
          <Lamp />
        </g>
      </svg>

      <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
        <button
          type="button"
          className="rounded border px-3 py-1"
          disabled={!mirrorOn}
          onClick={() => setMarks(marks ? null : { A: incidentPoint(i, MARK_R), A1: reflectedPoint(i, MARK_R) })}
        >
          {marks ? "Стерти точки A, O, A₁" : "Позначити точки A, O, A₁"}
        </button>
        <button type="button" className="rounded border px-3 py-1" onClick={() => setMirrorOn((v) => !v)}>
          {mirrorOn ? "Прибрати дзеркало" : "Поставити дзеркало"}
        </button>
        <button type="button" className="rounded border px-3 py-1" onClick={() => setNormal((v) => !v)}>
          {normal ? "Стерти перпендикуляр" : "Побудувати перпендикуляр у точці O"}
        </button>
        <button type="button" className="rounded border px-3 py-1" onClick={() => setProtractor((v) => !v)}>
          {protractor ? "Прибрати транспортир" : "Покласти транспортир"}
        </button>
        <button
          type="button"
          className="rounded border px-3 py-1"
          onClick={() => {
            setMarks(null);
            setMirrorOn(true);
            setI(randomI());
          }}
        >
          Новий дослід
        </button>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        Перетягніть лампочку: вона рухається по дузі, спрямовуючи вузький пучок світла в точку O на
        дзеркалі. Транспортир лежить основою вздовж лінії дзеркала; червона позначка 90° — це
        перпендикуляр до дзеркала в точці O. Кут падіння (відбивання) — кут між променем і цим
        перпендикуляром. Покази читайте на шкалі там, де промінь перетинає дугу транспортира (чорні
        цифри — від правого краю, сині — від лівого; ціна поділки — 1°).
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Щоб виміряти кути так, як у реальному досліді: позначте точки A, O, A₁, приберіть дзеркало —
        на аркуші залишаться лише проведені олівцем промені AO та OA₁ — і виміряйте кути
        транспортиром. Кут падіння випадковий і наперед невідомий.
      </p>
    </div>
  );
}
