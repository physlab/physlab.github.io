"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

type Point = { x: number; y: number };

function readNumber(id: string): number {
  const el = document.getElementById(id) as HTMLInputElement | null;
  return parseFloat((el?.value ?? "").replace(",", "."));
}

/**
 * Live chart for the refraction lab: y(x) points plus a best-fit line
 * through the origin whose slope is the refractive index n.
 *  - glass-plate lab:  x = b, y = a            (n = a / b)
 *  - PhET lab:         x = sin γ, y = sin α    (n = sin α / sin γ)
 */
export function RefractionChart({
  xIds,
  yIds,
  xTitle,
  yTitle,
}: {
  xIds: string[];
  yIds: string[];
  xTitle: string;
  yTitle: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const summaryRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const chart = new Chart<"line", Point[], number>(canvas, {
      type: "line",
      data: {
        datasets: [
          {
            label: "Дослідні точки",
            data: [],
            borderColor: "transparent",
            backgroundColor: "#667eea",
            pointRadius: 6,
            showLine: false,
          },
          {
            label: "Пряма через (0; 0)",
            data: [],
            borderColor: "red",
            backgroundColor: "transparent",
            borderWidth: 2,
            pointRadius: 0,
            showLine: true,
            tension: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { type: "linear", min: 0, title: { display: true, text: xTitle } },
          y: { min: 0, title: { display: true, text: yTitle } },
        },
        plugins: { legend: { display: false } },
      },
    });

    const redraw = () => {
      const points: Point[] = [];
      xIds.forEach((xid, i) => {
        const x = readNumber(xid);
        const y = readNumber(yIds[i]);
        if (!Number.isNaN(x) && !Number.isNaN(y)) points.push({ x, y });
      });
      points.sort((p, q) => p.x - q.x);

      const sxy = points.reduce((s, p) => s + p.x * p.y, 0);
      const sxx = points.reduce((s, p) => s + p.x * p.x, 0);
      const slope = sxx > 0 ? sxy / sxx : null;
      const maxX = points.length ? Math.max(...points.map((p) => p.x)) : 1;

      chart.data.datasets[0].data = points;
      chart.data.datasets[1].data =
        slope !== null
          ? [
              { x: 0, y: 0 },
              { x: maxX, y: slope * maxX },
            ]
          : [];
      chart.update();

      if (summaryRef.current) {
        summaryRef.current.textContent =
          slope !== null
            ? `Орієнтовно за побудованою прямою: n ≈ ${slope.toFixed(2)}`
            : "";
      }
    };

    const inputs = [...xIds, ...yIds]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLInputElement => el !== null);

    inputs.forEach((input) => input.addEventListener("input", redraw));
    redraw();

    return () => {
      inputs.forEach((input) => input.removeEventListener("input", redraw));
      chart.destroy();
    };
  }, [xIds, yIds, xTitle, yTitle]);

  return (
    <div>
      <div
        className="chart-container"
        style={{ position: "relative", height: 400 }}
      >
        <canvas ref={canvasRef} />
      </div>
      <p ref={summaryRef} className="text-sm text-muted-foreground mt-2" />
    </div>
  );
}
