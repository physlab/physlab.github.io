"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

type Point = { x: number; y: number };

const TEMPS = [30, 40, 50, 60, 70, 80, 90];
// Cell ids: `R_30` … `R_90`
const R_IDS = TEMPS.map((t) => `R_${t}`);

function readNumber(id: string): number {
  const el = document.getElementById(id) as HTMLInputElement | null;
  return parseFloat((el?.value ?? "").replace(",", "."));
}

function getPoints(): Point[] {
  const points: Point[] = [];
  TEMPS.forEach((t, i) => {
    const r = readNumber(R_IDS[i]);
    if (!Number.isNaN(r)) points.push({ x: t, y: r });
  });
  points.sort((a, b) => a.x - b.x);
  return points;
}

/** Ordinary least squares R = a + b·t (a = R0, b = R0·α). */
function fitLine(points: Point[]) {
  const n = points.length;
  if (n < 2) return null;
  const mx = points.reduce((s, p) => s + p.x, 0) / n;
  const my = points.reduce((s, p) => s + p.y, 0) / n;
  const sxx = points.reduce((s, p) => s + (p.x - mx) ** 2, 0);
  if (sxx === 0) return null;
  const sxy = points.reduce((s, p) => s + (p.x - mx) * (p.y - my), 0);
  const slope = sxy / sxx;
  return { slope, intercept: my - slope * mx };
}

/**
 * Live R(t) chart: measured points plus a best-fit line extended to the
 * R axis (t = 0 °C), where it gives R0; α is estimated as slope / R0.
 */
export function ResistanceTemperatureChart() {
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
            label: "R(t)",
            data: [],
            borderColor: "transparent",
            backgroundColor: "#667eea",
            pointRadius: 6,
            showLine: false,
          },
          {
            label: "Пряма, продовжена до осі R",
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
          x: {
            type: "linear",
            min: 0,
            title: { display: true, text: "Температура t, °C" },
          },
          y: {
            title: { display: true, text: "Опір R, кОм" },
          },
        },
        plugins: { legend: { display: false } },
      },
    });

    const redraw = () => {
      const points = getPoints();
      const fit = fitLine(points);
      let line: Point[] = [];
      let summary = "";

      if (fit) {
        const maxT = Math.max(...points.map((p) => p.x));
        line = [
          { x: 0, y: fit.intercept },
          { x: maxT, y: fit.intercept + fit.slope * maxT },
        ];
        if (fit.intercept > 0) {
          const alpha = fit.slope / fit.intercept;
          summary = `Орієнтовно за побудованою прямою: R₀ ≈ ${fit.intercept.toFixed(3)} кОм, α ≈ ${alpha.toExponential(2)} °C⁻¹`;
        }
      }

      chart.data.datasets[0].data = points;
      chart.data.datasets[1].data = line;
      chart.update();
      if (summaryRef.current) summaryRef.current.textContent = summary;
    };

    const inputs = R_IDS
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLInputElement => el !== null);

    inputs.forEach((input) => input.addEventListener("input", redraw));
    redraw();

    return () => {
      inputs.forEach((input) => input.removeEventListener("input", redraw));
      chart.destroy();
    };
  }, []);

  return (
    <div>
      <div className="chart-container" style={{ position: "relative", height: 400 }}>
        <canvas ref={canvasRef} />
      </div>
      <p ref={summaryRef} className="text-sm text-muted-foreground mt-2" />
    </div>
  );
}
