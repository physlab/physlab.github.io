"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

type Point = { x: number; y: number };

export type InductanceSeries = {
  /** Cell id prefix: cells are `${prefix}_U1..U4` and `${prefix}_I1..I4` */
  prefix: string;
  label: string;
  color: string;
};

const TRIALS = [1, 2, 3, 4];

function readNumber(id: string): number {
  const el = document.getElementById(id) as HTMLInputElement | null;
  return parseFloat((el?.value ?? "").replace(",", "."));
}

function getPoints(prefix: string): Point[] {
  const points: Point[] = [];
  TRIALS.forEach((n) => {
    const u = readNumber(`${prefix}_U${n}`);
    const i = readNumber(`${prefix}_I${n}`);
    if (!Number.isNaN(u) && !Number.isNaN(i)) points.push({ x: i, y: u });
  });
  points.sort((a, b) => a.x - b.x);
  return points;
}

/** Least-squares line through the origin U = Z·I; returns Z (slope). */
function fitThroughOrigin(points: Point[]): number | null {
  const sxy = points.reduce((s, p) => s + p.x * p.y, 0);
  const sxx = points.reduce((s, p) => s + p.x * p.x, 0);
  return sxx === 0 ? null : sxy / sxx;
}

/**
 * Live U(I) chart for the coil inductance lab. Each series is drawn as
 * points plus a best-fit line through the origin; the slope is the
 * impedance Z, from which L ≈ Z / (2πν) is estimated.
 */
export function InductanceUIChart({
  series,
  frequencyCellId,
}: {
  series: InductanceSeries[];
  /** Optional cell holding the frequency ν, Hz (defaults to 50 Hz) */
  frequencyCellId?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const datasets = series.flatMap((s) => [
      {
        label: s.label,
        data: [] as Point[],
        borderColor: "transparent",
        backgroundColor: s.color,
        pointRadius: 6,
        showLine: false,
      },
      {
        label: `${s.label} (пряма)`,
        data: [] as Point[],
        borderColor: s.color,
        backgroundColor: "transparent",
        borderWidth: 2,
        pointRadius: 0,
        showLine: true,
        tension: 0,
      },
    ]);

    const chart = new Chart<"line", Point[], number>(canvas, {
      type: "line",
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: "linear",
            min: 0,
            title: { display: true, text: "Діюча сила струму I, А" },
          },
          y: {
            min: 0,
            title: { display: true, text: "Діюча напруга U, В" },
          },
        },
        plugins: { legend: { display: series.length > 1 } },
      },
    });

    const redraw = () => {
      const nu = frequencyCellId ? readNumber(frequencyCellId) : 50;
      const frequency = Number.isFinite(nu) && nu > 0 ? nu : 50;
      const lines: string[] = [];

      series.forEach((s, idx) => {
        const points = getPoints(s.prefix);
        const z = fitThroughOrigin(points);
        const maxI = points.length ? Math.max(...points.map((p) => p.x)) : 1;
        chart.data.datasets[idx * 2].data = points;
        chart.data.datasets[idx * 2 + 1].data =
          z !== null
            ? [
                { x: 0, y: 0 },
                { x: maxI, y: z * maxI },
              ]
            : [];
        if (z !== null) {
          const l = z / (2 * Math.PI * frequency);
          lines.push(
            `${s.label}: Z ≈ ${z.toFixed(1)} Ом, L ≈ ${l.toFixed(3)} Гн (при ν = ${frequency} Гц)`,
          );
        }
      });

      chart.update();
      if (summaryRef.current) {
        summaryRef.current.textContent = lines.length
          ? `Орієнтовно за побудованими прямими — ${lines.join("; ")}`
          : "";
      }
    };

    const ids = [
      ...series.flatMap((s) =>
        TRIALS.flatMap((n) => [`${s.prefix}_U${n}`, `${s.prefix}_I${n}`]),
      ),
      ...(frequencyCellId ? [frequencyCellId] : []),
    ];
    const inputs = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLInputElement => el !== null);

    inputs.forEach((input) => input.addEventListener("input", redraw));
    redraw();

    return () => {
      inputs.forEach((input) => input.removeEventListener("input", redraw));
      chart.destroy();
    };
  }, [series, frequencyCellId]);

  return (
    <div>
      <div className="chart-container" style={{ position: "relative", height: 400 }}>
        <canvas ref={canvasRef} />
      </div>
      <div ref={summaryRef} className="text-sm text-muted-foreground mt-2" />
    </div>
  );
}
