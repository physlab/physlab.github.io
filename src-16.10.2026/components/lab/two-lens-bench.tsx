"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  activeLenses,
  computeImage,
  traceRay,
  type Lens,
} from "./two-lens-optics";

/**
 * Virtual optical bench for lab No. 6: a light source (arrow), a converging
 * lens, a diverging lens and a screen on a 120 cm rail. Every element can be
 * dragged along the rail (or typed in precisely), and each lens can be taken
 * off the bench — so all three experiments of the lab can be reproduced,
 * including the lens system "in contact".
 *
 * The focal lengths are fixed and hidden; students determine them from the
 * measurements. A "show" button reveals them for self-checking.
 */

// Hidden "true" parameters of the lenses (cm). D = 100 / f(cm) diopters.
const F_CONVERGING = 10; //  D = +10 дптр
const F_DIVERGING = -20; //  D =  −5 дптр

const BENCH_CM = 120;
const PX_PER_CM = 8;
const PAD_X = 24;
const VIEW_W = PAD_X * 2 + BENCH_CM * PX_PER_CM; // 1008
const VIEW_H = 330;
const AXIS_Y = 150;
const VS = 12; // vertical px per cm (for object/image/rays)
const OBJECT_H = 2.5; // cm
const CLIP = 125; // px: rays/images are clipped to ±CLIP around the axis

type Key = "src" | "div" | "conv" | "screen";

const LABELS: Record<Key, string> = {
  src: "Джерело світла",
  div: "Розсіювальна лінза",
  conv: "Збиральна лінза",
  screen: "Екран",
};

const COLORS: Record<Key, string> = {
  src: "#e07a5f",
  div: "#2f9e44",
  conv: "#1c7ed6",
  screen: "#6b7280",
};

const xPx = (cm: number) => PAD_X + cm * PX_PER_CM;
const clampCm = (v: number) => Math.min(BENCH_CM, Math.max(0, v));
const round1 = (v: number) => Math.round(v * 10) / 10;
const clampPx = (y: number) => Math.max(-CLIP, Math.min(CLIP, y));

export function TwoLensBench() {
  const [pos, setPos] = useState<Record<Key, number>>({
    src: 5,
    div: 30,
    conv: 55,
    screen: 100,
  });
  const [present, setPresent] = useState({ conv: true, div: false });
  const [showRays, setShowRays] = useState(true);
  const [revealF, setRevealF] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragging = useRef<Key | null>(null);

  const setOne = useCallback((key: Key, cm: number) => {
    setPos((p) => ({ ...p, [key]: round1(clampCm(cm)) }));
  }, []);

  const pointerToCm = (clientX: number) => {
    const svg = svgRef.current;
    if (!svg) return 0;
    const rect = svg.getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width) * VIEW_W;
    return (px - PAD_X) / PX_PER_CM;
  };

  const onPointerDown = (key: Key) => (e: React.PointerEvent) => {
    dragging.current = key;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    e.preventDefault();
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) setOne(dragging.current, pointerToCm(e.clientX));
  };
  const onPointerUp = () => {
    dragging.current = null;
  };

  const model = useMemo(() => {
    const lenses: Lens[] = [];
    if (present.conv) lenses.push({ x: pos.conv, f: F_CONVERGING });
    if (present.div) lenses.push({ x: pos.div, f: F_DIVERGING });
    const active = activeLenses(lenses, pos.src, pos.screen);
    const image = computeImage(pos.src, active);

    // Two characteristic rays from the tip of the object
    const rays: Array<Array<{ x: number; y: number }>> = [];
    const first = active[0];
    rays.push(traceRay(pos.src, OBJECT_H, 0, active, pos.screen));
    rays.push(
      traceRay(
        pos.src,
        OBJECT_H,
        first ? -OBJECT_H / (first.x - pos.src) : 0,
        active,
        pos.screen,
      ),
    );

    // Appearance of the image on the screen
    let screenImage: { h: number; blur: number } | null = null;
    if (image.x !== null && image.real && active.length > 0) {
      const delta = Math.abs(pos.screen - image.x);
      screenImage = {
        h: image.m * OBJECT_H,
        blur: Math.min(10, Math.max(0, (delta - 0.25) * 1.1)),
      };
    }
    return { active, image, rays, screenImage };
  }, [pos, present]);

  const toPath = (pts: Array<{ x: number; y: number }>) =>
    pts
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"}${xPx(p.x).toFixed(1)},${(
            AXIS_Y - p.y * VS
          ).toFixed(1)}`,
      )
      .join(" ");

  const drawLens = (key: "conv" | "div") => {
    const x = xPx(pos[key]);
    const c = COLORS[key];
    const half = 95;
    const a = 10;
    const converging = key === "conv";
    return (
      <g
        key={key}
        style={{ cursor: "ew-resize", touchAction: "none" }}
        onPointerDown={onPointerDown(key)}
      >
        <rect x={x - 14} y={AXIS_Y - half - 14} width={28} height={half * 2 + 28} fill="transparent" />
        <line x1={x} y1={AXIS_Y - half} x2={x} y2={AXIS_Y + half} stroke={c} strokeWidth={3} />
        {[-1, 1].map((s) => {
          const ty = AXIS_Y + s * half;
          const dir = converging ? -s : s; // arrowheads out for converging
          return (
            <path
              key={s}
              d={`M${x - a},${ty + dir * a} L${x},${ty} L${x + a},${ty + dir * a}`}
              fill="none"
              stroke={c}
              strokeWidth={3}
            />
          );
        })}
        <text x={x} y={AXIS_Y + half + 32} textAnchor="middle" fontSize={13} fill={c}>
          {key === "conv" ? "збиральна" : "розсіювальна"}
        </text>
      </g>
    );
  };

  const fmt = (cm: number) => cm.toFixed(1);

  return (
    <div className="my-4 rounded-lg border p-3" style={{ background: "rgba(0,0,0,0.02)" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="w-full select-none"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        role="img"
        aria-label="Оптична лава з джерелом світла, двома лінзами та екраном"
      >
        <defs>
          <clipPath id="bench-clip">
            <rect x={0} y={AXIS_Y - CLIP} width={VIEW_W} height={CLIP * 2} />
          </clipPath>
          <filter id="img-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={model.screenImage?.blur ?? 0} />
          </filter>
        </defs>

        {/* rail with ruler */}
        <rect x={PAD_X - 10} y={AXIS_Y + 125} width={BENCH_CM * PX_PER_CM + 20} height={14} fill="#374151" rx={3} />
        {Array.from({ length: BENCH_CM + 1 }, (_, i) => i).map((i) => (
          <g key={i}>
            <line
              x1={xPx(i)}
              x2={xPx(i)}
              y1={AXIS_Y + 125}
              y2={AXIS_Y + 125 + (i % 10 === 0 ? 14 : i % 5 === 0 ? 10 : 6)}
              stroke="#e5e7eb"
              strokeWidth={1}
            />
            {i % 10 === 0 && (
              <text x={xPx(i)} y={AXIS_Y + 159} textAnchor="middle" fontSize={11} fill="#6b7280">
                {i}
              </text>
            )}
          </g>
        ))}
        <text x={VIEW_W - PAD_X} y={AXIS_Y + 176} textAnchor="end" fontSize={11} fill="#6b7280">
          см
        </text>

        {/* optical axis */}
        <line x1={PAD_X} x2={VIEW_W - PAD_X} y1={AXIS_Y} y2={AXIS_Y} stroke="#9ca3af" strokeDasharray="6 4" />

        {/* rays */}
        {showRays && (
          <g clipPath="url(#bench-clip)" fill="none" stroke="#f59f00" strokeWidth={1.6}>
            {model.rays.map((r, i) => (
              <path key={i} d={toPath(r)} />
            ))}
          </g>
        )}

        {/* screen */}
        <g style={{ cursor: "ew-resize", touchAction: "none" }} onPointerDown={onPointerDown("screen")}>
          <rect x={xPx(pos.screen) - 12} y={AXIS_Y - CLIP - 6} width={24} height={CLIP * 2 + 12} fill="transparent" />
          <rect x={xPx(pos.screen) - 3} y={AXIS_Y - CLIP} width={6} height={CLIP * 2} fill="#9ca3af" />
          <text x={xPx(pos.screen)} y={AXIS_Y - CLIP - 10} textAnchor="middle" fontSize={13} fill="#6b7280">
            екран
          </text>
        </g>

        {/* image on the screen */}
        {model.screenImage && (
          <g clipPath="url(#bench-clip)" filter="url(#img-blur)">
            <line
              x1={xPx(pos.screen) + 8}
              x2={xPx(pos.screen) + 8}
              y1={AXIS_Y}
              y2={AXIS_Y - clampPx(model.screenImage.h * VS)}
              stroke="#e07a5f"
              strokeWidth={Math.max(3, Math.min(10, Math.abs(model.screenImage.h) * 2))}
              strokeLinecap="round"
            />
          </g>
        )}

        {/* source (arrow) */}
        <g style={{ cursor: "ew-resize", touchAction: "none" }} onPointerDown={onPointerDown("src")}>
          <rect x={xPx(pos.src) - 14} y={AXIS_Y - OBJECT_H * VS - 14} width={28} height={OBJECT_H * VS + 28} fill="transparent" />
          <line x1={xPx(pos.src)} x2={xPx(pos.src)} y1={AXIS_Y} y2={AXIS_Y - OBJECT_H * VS} stroke={COLORS.src} strokeWidth={4} strokeLinecap="round" />
          <path
            d={`M${xPx(pos.src) - 6},${AXIS_Y - OBJECT_H * VS + 9} L${xPx(pos.src)},${AXIS_Y - OBJECT_H * VS} L${xPx(pos.src) + 6},${AXIS_Y - OBJECT_H * VS + 9}`}
            fill="none"
            stroke={COLORS.src}
            strokeWidth={3}
          />
          <text x={xPx(pos.src)} y={AXIS_Y + 22} textAnchor="middle" fontSize={13} fill={COLORS.src}>
            джерело
          </text>
        </g>

        {/* lenses */}
        {present.div && drawLens("div")}
        {present.conv && drawLens("conv")}
      </svg>

      <p className="text-xs text-muted-foreground" style={{ margin: "4px 0 8px" }}>
        Перетягуйте елементи вздовж рейки мишею або пальцем, або введіть
        точне положення нижче. Чітким зображення на екрані стає лише тоді,
        коли екран розташований у місці розташування зображення.
      </p>

      <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
        {(["src", "div", "conv", "screen"] as Key[]).map((k) => {
          const isLens = k === "div" || k === "conv";
          const on = isLens ? present[k as "div" | "conv"] : true;
          return (
            <div key={k} className="rounded border p-2" style={{ opacity: on ? 1 : 0.55 }}>
              <label className="block text-sm font-medium" style={{ color: COLORS[k] }}>
                {LABELS[k]}, см
              </label>
              <input
                type="number"
                min={0}
                max={BENCH_CM}
                step={0.1}
                value={fmt(pos[k])}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  if (!Number.isNaN(v)) setOne(k, v);
                }}
                className="w-full rounded border px-2 py-1"
              />
              {isLens && (
                <label className="mt-1 flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={(e) =>
                      setPresent((p) => ({ ...p, [k]: e.target.checked }))
                    }
                  />
                  лінза на лаві
                </label>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={showRays} onChange={(e) => setShowRays(e.target.checked)} />
          показати промені
        </label>
        <button
          type="button"
          className="rounded border px-2 py-1"
          onClick={() => setRevealF((v) => !v)}
        >
          {revealF ? "Сховати" : "Показати"} задані значення (для перевірки)
        </button>
        <button
          type="button"
          className="rounded border px-2 py-1"
          onClick={() => {
            setPos({ src: 5, div: 30, conv: 55, screen: 100 });
            setPresent({ conv: true, div: false });
          }}
        >
          Скинути
        </button>
      </div>

      {revealF && (
        <p className="mt-2 text-sm">
          Збиральна лінза: F = {F_CONVERGING / 100} м, D ={" "}
          {(100 / F_CONVERGING).toFixed(1)} дптр. Розсіювальна лінза: F ={" "}
          {F_DIVERGING / 100} м, D = {(100 / F_DIVERGING).toFixed(1)} дптр.
        </p>
      )}
    </div>
  );
}
