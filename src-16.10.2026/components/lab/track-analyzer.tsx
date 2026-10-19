"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { circumcircle, dist, type Pt } from "./track-geometry";

/**
 * Touch-friendly analyser of particle-track photographs (lab No. 9).
 *
 *  - one finger / mouse drag on empty space pans the photo, two fingers pinch-zoom
 *    (mouse wheel zooms too);
 *  - tap on the photo puts the next point of the selected group (calibration or a
 *    measurement); drag a marker to adjust it — a magnifier appears so the finger
 *    does not hide the point;
 *  - calibration: two points at a known distance (e.g. the "1 см" bar on the photo);
 *  - every measurement = 3 points on a track → two chords, their perpendicular
 *    bisectors, centre O and the radius R (in metres), exactly as in the instruction;
 *  - students can load their own photo (gallery / camera / drag-and-drop);
 *  - a measured R can be written straight into a table cell of the page.
 */

type View = { s: number; tx: number; ty: number };
type Meas = { id: string; label: string; color: string; pts: (Pt | null)[]; target: string };
type Loaded = { el: HTMLImageElement; w: number; h: number; name: string; url: string; objectUrl: boolean };
export type TrackTarget = { id: string; label: string };

const COLORS = ["#e03131", "#1c7ed6", "#2f9e44", "#ae3ec9", "#f08c00"];
const CAL_COLOR = "#f59f00";
const LOUPE_R = 62;
const LOUPE_ZOOM = 4;

function setCell(id: string, value: string) {
  const el = document.getElementById(id) as HTMLInputElement | null;
  if (!el) return false;
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
  setter?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
  return true;
}

export function TrackAnalyzer({
  defaultImage,
  defaultName = "Фото треків",
  defaultCalibration,
  targets,
}: {
  defaultImage: string;
  defaultName?: string;
  /** Pre-set calibration for the default photo (image pixels) */
  defaultCalibration?: { p1: Pt; p2: Pt; lengthCm: number };
  /** Table cells that a result can be written into */
  targets: TrackTarget[];
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [img, setImg] = useState<Loaded | null>(null);
  const [size, setSize] = useState({ w: 320, h: 420 });
  const [view, setView] = useState<View>({ s: 1, tx: 0, ty: 0 });
  const [cal, setCal] = useState<(Pt | null)[]>([null, null]);
  const [calLen, setCalLen] = useState("1");
  const [meas, setMeas] = useState<Meas[]>([
    { id: "m1", label: "Трек I", color: COLORS[0], pts: [null, null, null], target: targets[0]?.id ?? "" },
    { id: "m2", label: "Трек II", color: COLORS[1], pts: [null, null, null], target: targets[1]?.id ?? "" },
  ]);
  const [active, setActive] = useState<string>("cal");
  const [loupe, setLoupe] = useState<Pt | null>(null);
  const [note, setNote] = useState("");

  // latest state for event handlers
  const st = useRef({ img, view, cal, meas, active, size });
  st.current = { img, view, cal, meas, active, size };

  const ptrs = useRef(new Map<number, Pt>());
  const gesture = useRef<
    | { type: "none" }
    | { type: "pan"; sx: number; sy: number; tx: number; ty: number; moved: boolean }
    | { type: "marker"; group: string; idx: number; ox: number; oy: number }
    | { type: "pinch"; d0: number; s0: number; ip: Pt }
  >({ type: "none" });

  const fitView = useCallback((i: Loaded, w: number, h: number): View => {
    const s = Math.min(w / i.w, h / i.h);
    return { s, tx: (w - i.w * s) / 2, ty: (h - i.h * s) / 2 };
  }, []);

  // ---------- image loading ----------
  const loadImage = useCallback(
    (url: string, name: string, objectUrl: boolean, isDefault: boolean) => {
      const el = new Image();
      el.onload = () => {
        setImg((old) => {
          if (old?.objectUrl) URL.revokeObjectURL(old.url);
          return { el, w: el.naturalWidth, h: el.naturalHeight, name, url, objectUrl };
        });
        setMeas((ms) => ms.map((m) => ({ ...m, pts: [null, null, null] })));
        if (isDefault && defaultCalibration) {
          setCal([defaultCalibration.p1, defaultCalibration.p2]);
          setCalLen(String(defaultCalibration.lengthCm));
          setActive("m1");
          setNote("");
        } else {
          setCal([null, null]);
          setActive("cal");
          setNote("Нове фото: спершу відкалібруйте масштаб — поставте дві точки на відомій відстані й введіть її довжину.");
        }
        const { w, h } = st.current.size;
        setView(fitView({ el, w: el.naturalWidth, h: el.naturalHeight, name, url, objectUrl }, w, h));
      };
      el.onerror = () => setNote("Не вдалося завантажити зображення.");
      el.src = url;
    },
    [defaultCalibration, fitView],
  );

  useEffect(() => {
    loadImage(defaultImage, defaultName, false, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultImage]);

  useEffect(() => () => {
    if (st.current.img?.objectUrl) URL.revokeObjectURL(st.current.img.url);
  }, []);

  const onFile = (file?: File | null) => {
    if (!file || !file.type.startsWith("image/")) return;
    loadImage(URL.createObjectURL(file), file.name, true, false);
  };

  // ---------- canvas size ----------
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const update = () => {
      const w = Math.max(240, Math.floor(wrap.clientWidth));
      const h = Math.round(Math.min(Math.max(w * 1.1, 340), 620));
      setSize({ w, h });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  const firstFit = useRef(false);
  useEffect(() => {
    if (img && !firstFit.current) {
      setView(fitView(img, size.w, size.h));
      firstFit.current = true;
    }
  }, [img, size, fitView]);

  // ---------- helpers ----------
  const toScreen = (p: Pt, v: View): Pt => ({ x: v.tx + p.x * v.s, y: v.ty + p.y * v.s });
  const toImage = (p: Pt, v: View): Pt => ({ x: (p.x - v.tx) / v.s, y: (p.y - v.ty) / v.s });

  const setPoint = (group: string, idx: number, p: Pt) => {
    if (group === "cal") setCal((c) => c.map((q, i) => (i === idx ? p : q)));
    else setMeas((ms) => ms.map((m) => (m.id === group ? { ...m, pts: m.pts.map((q, i) => (i === idx ? p : q)) } : m)));
  };

  const findHit = (x: number, y: number, radius: number) => {
    const { cal: c, meas: ms, view: v } = st.current;
    let best: { group: string; idx: number; d: number; pt: Pt } | null = null;
    const consider = (group: string, idx: number, p: Pt | null) => {
      if (!p) return;
      const sp = toScreen(p, v);
      const d = Math.hypot(sp.x - x, sp.y - y);
      if (d <= radius && (!best || d < best.d)) best = { group, idx, d, pt: sp };
    };
    c.forEach((p, i) => consider("cal", i, p));
    ms.forEach((m) => m.pts.forEach((p, i) => consider(m.id, i, p)));
    return best as { group: string; idx: number; d: number; pt: Pt } | null;
  };

  const placePoint = (ip: Pt) => {
    const { active: a, cal: c, meas: ms } = st.current;
    const pts = a === "cal" ? c : ms.find((m) => m.id === a)?.pts;
    if (!pts) return;
    let idx = pts.findIndex((p) => p === null);
    if (idx === -1) {
      let best = 0;
      let bd = Infinity;
      pts.forEach((p, i) => {
        const d = p ? dist(p, ip) : Infinity;
        if (d < bd) {
          bd = d;
          best = i;
        }
      });
      idx = best;
    }
    setPoint(a, idx, ip);
  };

  // ---------- pointer events ----------
  const local = (e: React.PointerEvent | WheelEvent): Pt => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!st.current.img) return;
    canvasRef.current!.setPointerCapture(e.pointerId);
    const p = local(e);
    ptrs.current.set(e.pointerId, p);
    const v = st.current.view;
    if (ptrs.current.size === 2) {
      const [a, b] = [...ptrs.current.values()];
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      gesture.current = { type: "pinch", d0: Math.max(1, dist(a, b)), s0: v.s, ip: toImage(mid, v) };
      setLoupe(null);
      return;
    }
    if (ptrs.current.size > 2) return;
    const hit = findHit(p.x, p.y, e.pointerType === "touch" ? 34 : 18);
    if (hit) {
      gesture.current = { type: "marker", group: hit.group, idx: hit.idx, ox: hit.pt.x - p.x, oy: hit.pt.y - p.y };
      setActive(hit.group);
      setLoupe(toImage(hit.pt, v));
    } else {
      gesture.current = { type: "pan", sx: p.x, sy: p.y, tx: v.tx, ty: v.ty, moved: false };
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!ptrs.current.has(e.pointerId)) return;
    const p = local(e);
    ptrs.current.set(e.pointerId, p);
    const g = gesture.current;
    const v = st.current.view;
    if (g.type === "marker") {
      const ip = toImage({ x: p.x + g.ox, y: p.y + g.oy }, v);
      setPoint(g.group, g.idx, ip);
      setLoupe(ip);
    } else if (g.type === "pan") {
      const dx = p.x - g.sx;
      const dy = p.y - g.sy;
      if (!g.moved && Math.hypot(dx, dy) > 6) g.moved = true;
      if (g.moved) setView({ ...v, tx: g.tx + dx, ty: g.ty + dy });
    } else if (g.type === "pinch" && ptrs.current.size >= 2) {
      const [a, b] = [...ptrs.current.values()];
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const base = st.current.img ? fitView(st.current.img, st.current.size.w, st.current.size.h).s : 1;
      const s = Math.min(base * 14, Math.max(base * 0.5, g.s0 * (dist(a, b) / g.d0)));
      setView({ s, tx: mid.x - g.ip.x * s, ty: mid.y - g.ip.y * s });
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const g = gesture.current;
    ptrs.current.delete(e.pointerId);
    if (g.type === "pan" && !g.moved) placePoint(toImage({ x: g.sx, y: g.sy }, st.current.view));
    if (g.type === "marker") setLoupe(null);
    if (g.type === "pinch" && ptrs.current.size >= 1) {
      const rest = [...ptrs.current.values()][0];
      const v = st.current.view;
      gesture.current = { type: "pan", sx: rest.x, sy: rest.y, tx: v.tx, ty: v.ty, moved: true };
      return;
    }
    if (ptrs.current.size === 0) gesture.current = { type: "none" };
  };

  const zoomAt = useCallback(
    (factor: number, at: Pt) => {
      const { img: im, view: v, size: sz } = st.current;
      if (!im) return;
      const base = fitView(im, sz.w, sz.h).s;
      const s = Math.min(base * 14, Math.max(base * 0.5, v.s * factor));
      const ip = { x: (at.x - v.tx) / v.s, y: (at.y - v.ty) / v.s };
      setView({ s, tx: at.x - ip.x * s, ty: at.y - ip.y * s });
    },
    [fitView],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      zoomAt(e.deltaY < 0 ? 1.15 : 1 / 1.15, { x: e.clientX - r.left, y: e.clientY - r.top });
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  // ---------- results ----------
  const mpp = useMemo(() => {
    const [a, b] = cal;
    const len = parseFloat(calLen.replace(",", "."));
    if (!a || !b || !(len > 0)) return null;
    const d = dist(a, b);
    return d > 0 ? len / 100 / d : null; // metres per image pixel
  }, [cal, calLen]);

  const results = useMemo(
    () =>
      meas.map((m) => {
        const [p1, p2, p3] = m.pts;
        const circle = p1 && p2 && p3 ? circumcircle(p1, p2, p3) : null;
        return { m, circle, R: circle && mpp ? circle.r * mpp : null };
      }),
    [meas, mpp],
  );

  // ---------- drawing ----------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(size.w * dpr);
    canvas.height = Math.round(size.h * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, size.w, size.h);
    if (!img) return;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img.el, view.tx, view.ty, img.w * view.s, img.h * view.s);

    const S = (p: Pt) => toScreen(p, view);

    const marker = (p: Pt, color: string, label: string) => {
      const q = S(p);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.arc(q.x, q.y, 11, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(q.x - 17, q.y);
      ctx.lineTo(q.x - 5, q.y);
      ctx.moveTo(q.x + 5, q.y);
      ctx.lineTo(q.x + 17, q.y);
      ctx.moveTo(q.x, q.y - 17);
      ctx.lineTo(q.x, q.y - 5);
      ctx.moveTo(q.x, q.y + 5);
      ctx.lineTo(q.x, q.y + 17);
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.font = "bold 13px sans-serif";
      ctx.fillText(label, q.x + 13, q.y - 11);
    };

    // calibration
    const [c1, c2] = cal;
    if (c1 && c2) {
      ctx.strokeStyle = CAL_COLOR;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(S(c1).x, S(c1).y);
      ctx.lineTo(S(c2).x, S(c2).y);
      ctx.stroke();
    }
    cal.forEach((p, i) => p && marker(p, CAL_COLOR, `К${i + 1}`));

    // measurements
    results.forEach(({ m, circle }) => {
      const [p1, p2, p3] = m.pts;
      ctx.strokeStyle = m.color;
      ctx.fillStyle = m.color;
      if (p1 && p2 && p3 && circle) {
        const O = S(circle.c);
        ctx.lineWidth = 1.5;
        // chords
        ctx.beginPath();
        ctx.moveTo(S(p1).x, S(p1).y);
        ctx.lineTo(S(p2).x, S(p2).y);
        ctx.lineTo(S(p3).x, S(p3).y);
        ctx.stroke();
        // perpendicular bisectors through the centre
        ([[p1, p2], [p2, p3]] as Pt[][]).forEach(([a, b]) => {
          const mid = S({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
          const dx = O.x - mid.x;
          const dy = O.y - mid.y;
          const len = Math.hypot(dx, dy) || 1;
          ctx.setLineDash([6, 4]);
          ctx.beginPath();
          ctx.moveTo(mid.x - (dx / len) * 20, mid.y - (dy / len) * 20);
          ctx.lineTo(O.x + (dx / len) * 12, O.y + (dy / len) * 12);
          ctx.stroke();
          ctx.setLineDash([]);
        });
        // circle, centre and radius
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(O.x, O.y, circle.r * view.s, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(O.x, O.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = "bold 14px sans-serif";
        ctx.fillText("O", O.x + 7, O.y - 7);
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.moveTo(O.x, O.y);
        ctx.lineTo(S(p1).x, S(p1).y);
        ctx.stroke();
        ctx.setLineDash([]);
        const rm = { x: (O.x + S(p1).x) / 2, y: (O.y + S(p1).y) / 2 };
        ctx.fillText("R", rm.x + 5, rm.y - 5);
      }
      m.pts.forEach((p, i) => p && marker(p, m.color, `${i + 1}`));
    });

    // magnifier
    if (loupe) {
      const sp = S(loupe);
      const onRight = sp.x < size.w / 2;
      const cx = onRight ? size.w - LOUPE_R - 10 : LOUPE_R + 10;
      const cy = LOUPE_R + 10;
      const srcSize = (LOUPE_R * 2) / (view.s * LOUPE_ZOOM);
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, LOUPE_R, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = "#000";
      ctx.fillRect(cx - LOUPE_R, cy - LOUPE_R, LOUPE_R * 2, LOUPE_R * 2);
      ctx.drawImage(img.el, loupe.x - srcSize / 2, loupe.y - srcSize / 2, srcSize, srcSize, cx - LOUPE_R, cy - LOUPE_R, LOUPE_R * 2, LOUPE_R * 2);
      ctx.restore();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, LOUPE_R, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = "#ff3b30";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 14, cy);
      ctx.lineTo(cx + 14, cy);
      ctx.moveTo(cx, cy - 14);
      ctx.lineTo(cx, cy + 14);
      ctx.stroke();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img, view, cal, results, loupe, size]);

  // ---------- actions ----------
  const resetView = () => img && setView(fitView(img, size.w, size.h));
  const clearMarks = () => {
    setMeas((ms) => ms.map((m) => ({ ...m, pts: [null, null, null] })));
    setCal([null, null]);
    setActive("cal");
  };
  const addMeas = () => {
    setMeas((ms) => {
      const n = ms.length + 1;
      const id = `m${Date.now()}`;
      setActive(id);
      return [
        ...ms,
        { id, label: `Вимірювання ${n}`, color: COLORS[(n - 1) % COLORS.length], pts: [null, null, null], target: targets[n - 1]?.id ?? "" },
      ];
    });
  };
  const removeMeas = (id: string) => {
    setMeas((ms) => ms.filter((m) => m.id !== id));
    if (active === id) setActive("cal");
  };
  const writeCell = (target: string, R: number) => {
    if (!target) return;
    const ok = setCell(target, R.toFixed(3).replace(".", ","));
    setNote(ok ? "Значення записано в таблицю." : "Не вдалося знайти клітинку таблиці.");
  };

  const chip = (id: string, text: string, color: string, done: string) => (
    <button
      key={id}
      type="button"
      onClick={() => setActive(id)}
      className="rounded-full border px-3 py-1 text-sm"
      style={{
        borderColor: color,
        background: active === id ? color : "transparent",
        color: active === id ? "#fff" : color,
        minHeight: 36,
      }}
    >
      {text} ({done})
    </button>
  );

  const hint =
    active === "cal"
      ? "Калібрування: торкніться фото в двох кінцях відрізка відомої довжини (на цьому фото — смужка «1 см»)."
      : "Торкніться трьох точок на треку (на початку пробігу частинки, на значній відстані одна від одної). Перетягніть мітку, щоб уточнити.";

  return (
    <div
      className="my-4 rounded-lg border p-3"
      style={{ background: "rgba(0,0,0,0.02)" }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onFile(e.dataTransfer.files?.[0]);
      }}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
        <button type="button" className="rounded border px-3 py-1" style={{ minHeight: 36 }} onClick={() => fileRef.current?.click()}>
          Завантажити своє фото
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} />
        <button
          type="button"
          className="rounded border px-3 py-1"
          style={{ minHeight: 36 }}
          onClick={() => { firstFit.current = false; loadImage(defaultImage, defaultName, false, true); }}
        >
          Стандартне фото
        </button>
        <span className="text-xs text-muted-foreground">Зараз: {img?.name ?? "…"}</span>
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-2">
        {chip("cal", "Калібрування", CAL_COLOR, `${cal.filter(Boolean).length}/2`)}
        {meas.map((m) => (
          <span key={m.id} className="inline-flex items-center gap-1">
            {chip(m.id, m.label, m.color, `${m.pts.filter(Boolean).length}/3`)}
            {m.id !== "m1" && m.id !== "m2" && (
              <button type="button" aria-label="Видалити вимірювання" className="rounded border px-2" style={{ minHeight: 36 }} onClick={() => removeMeas(m.id)}>
                ×
              </button>
            )}
          </span>
        ))}
        <button type="button" className="rounded-full border px-3 py-1 text-sm" style={{ minHeight: 36 }} onClick={addMeas}>
          + вимірювання
        </button>
      </div>

      <p className="mb-2 text-sm">{hint}</p>

      <div ref={wrapRef} className="relative w-full overflow-hidden rounded" style={{ height: size.h }}>
        <canvas
          ref={canvasRef}
          style={{ width: size.w, height: size.h, touchAction: "none", display: "block", cursor: "crosshair" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
        <div className="absolute flex flex-col gap-1" style={{ right: 8, bottom: 8 }}>
          <button type="button" aria-label="Збільшити" className="rounded border bg-white px-3 text-lg" style={{ minHeight: 40 }} onClick={() => zoomAt(1.4, { x: size.w / 2, y: size.h / 2 })}>
            +
          </button>
          <button type="button" aria-label="Зменшити" className="rounded border bg-white px-3 text-lg" style={{ minHeight: 40 }} onClick={() => zoomAt(1 / 1.4, { x: size.w / 2, y: size.h / 2 })}>
            −
          </button>
          <button type="button" aria-label="Скинути вигляд" className="rounded border bg-white px-3 text-sm" style={{ minHeight: 40 }} onClick={resetView}>
            ⤢
          </button>
        </div>
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        Один палець — переміщення, два пальці — масштаб (колесо миші теж). Дотик до фото ставить наступну точку вибраної групи.
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <label className="flex items-center gap-2">
          Довжина відрізка між точками калібрування, см:
          <input
            type="number"
            inputMode="decimal"
            step="0.1"
            min="0"
            value={calLen}
            onChange={(e) => setCalLen(e.target.value)}
            className="w-24 rounded border px-2 py-1"
          />
        </label>
        <button type="button" className="rounded border px-3 py-1" style={{ minHeight: 36 }} onClick={clearMarks}>
          Очистити всі мітки
        </button>
      </div>

      <div className="mt-3 space-y-2 text-sm">
        {mpp === null && <p className="text-muted-foreground">Щоб отримати радіус у метрах, завершіть калібрування (дві точки + довжина).</p>}
        {results.map(({ m, circle, R }) => (
          <div key={m.id} className="flex flex-wrap items-center gap-2 rounded border p-2">
            <span style={{ color: m.color, fontWeight: 600 }}>{m.label}:</span>
            {R !== null ? (
              <>
                <span>
                  R = <strong>{(R * 100).toFixed(1)} см</strong> = <strong>{R.toFixed(3)} м</strong>
                </span>
                {targets.length > 0 && (
                  <>
                    <select
                      value={m.target}
                      onChange={(e) => setMeas((ms) => ms.map((x) => (x.id === m.id ? { ...x, target: e.target.value } : x)))}
                      className="rounded border px-2 py-1"
                    >
                      <option value="">— куди записати —</option>
                      {targets.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <button type="button" className="rounded border px-3 py-1" style={{ minHeight: 36 }} disabled={!m.target} onClick={() => writeCell(m.target, R)}>
                      Записати в таблицю
                    </button>
                  </>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">
                {m.pts.every(Boolean) && !circle ? "точки лежать на одній прямій — змістіть одну з них" : "поставте 3 точки на треку"}
              </span>
            )}
          </div>
        ))}
        {note && <p className="text-xs">{note}</p>}
      </div>
    </div>
  );
}
