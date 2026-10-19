import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

export type Pt = { x: number; y: number };

/** Smoothly follows a target value (restart-safe: the loop belongs to the effect). */
export function useEased(target: number, rate = 0.12): number {
  const [value, setValue] = useState(target);
  const ref = useRef(target);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      ref.current += (target - ref.current) * rate;
      if (Math.abs(target - ref.current) < 0.002) {
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

/**
 * Dragging inside an <svg>: while an item is held, the whole window listens for
 * the pointer, so the item never "slips away" from the cursor or finger.
 * `start(e, id, currentPosition)` is called from onPointerDown of the item;
 * `onDrop(id, x, y)` receives the final position in viewBox coordinates.
 */
export function useSvgDrag(
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
