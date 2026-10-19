"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const TRIALS = [1, 2, 3, 4, 5];
const U_CELL_IDS = TRIALS.map((n) => `U${n}`);
const I_CELL_IDS = TRIALS.map((n) => `I${n}`);

type Point = { x: number; y: number };

function getPoints(): Point[] {
  const points: Point[] = [];
  TRIALS.forEach((_, index) => {
    const uInput = document.getElementById(
      U_CELL_IDS[index],
    ) as HTMLInputElement | null;
    const iInput = document.getElementById(
      I_CELL_IDS[index],
    ) as HTMLInputElement | null;
    const u = parseFloat((uInput?.value ?? "").replace(",", "."));
    const i = parseFloat((iInput?.value ?? "").replace(",", "."));
    if (!Number.isNaN(u) && !Number.isNaN(i)) points.push({ x: u, y: i });
  });
  points.sort((a, b) => a.x - b.x);
  return points;
}

/**
 * Ordinary least-squares line I = a + b·U through the measured points.
 * Unlike the resistor lab, this line must NOT be forced through the origin:
 * it crosses the I axis at I_кз (U = 0) and the U axis at ε (I = 0).
 */
function fitLine(points: Point[]) {
  const n = points.length;
  if (n < 2) return null;
  const meanX = points.reduce((s, p) => s + p.x, 0) / n;
  const meanY = points.reduce((s, p) => s + p.y, 0) / n;
  const sxx = points.reduce((s, p) => s + (p.x - meanX) ** 2, 0);
  if (sxx === 0) return null;
  const sxy = points.reduce((s, p) => s + (p.x - meanX) * (p.y - meanY), 0);
  const slope = sxy / sxx;
  const intercept = meanY - slope * meanX;
  return { slope, intercept };
}

/**
 * Live I(U) chart for the EMF / internal resistance lab: scatter of the
 * measured points plus a best-fit line extended to both axes.
 */
export function EmfIVChart() {
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
            label: "I(U)",
            data: [],
            borderColor: "transparent",
            backgroundColor: "#667eea",
            pointRadius: 6,
            showLine: false,
          },
          {
            label: "Пряма, продовжена до осей",
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
            title: { display: true, text: "Напруга U, В" },
          },
          y: {
            min: 0,
            title: { display: true, text: "Сила струму I, А" },
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

      if (fit && fit.slope < 0 && fit.intercept > 0) {
        const eps = -fit.intercept / fit.slope; // I = 0  → U = ε
        line = [
          { x: 0, y: fit.intercept }, // U = 0 → I = I_кз
          { x: eps, y: 0 },
        ];
        summary = `Орієнтовно за побудованою прямою: ε ≈ ${eps.toFixed(2)} В, Iкз ≈ ${fit.intercept.toFixed(2)} А`;
      }

      chart.data.datasets[0].data = points;
      chart.data.datasets[1].data = line;
      chart.update();
      if (summaryRef.current) summaryRef.current.textContent = summary;
    };

    const inputs = [...U_CELL_IDS, ...I_CELL_IDS]
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
    <div className="chart-container">
      <canvas ref={canvasRef} id="emfIVChart" width={600} height={400} />
      <p ref={summaryRef} className="text-sm text-muted-foreground mt-2" />
    </div>
  );
}
