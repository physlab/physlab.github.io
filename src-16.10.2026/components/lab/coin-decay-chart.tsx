"use client";

import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

type Point = { x: number; y: number };

const N0 = 128;
const SERIES = [1, 2, 3];
const STEPS = [1, 2, 3, 4, 5, 6, 7, 8];
const COLORS = ["#1c7ed6", "#2f9e44", "#e03131"];

const cellId = (s: number, n: number) => `N_s${s}_${n}`;

function readSeries(s: number): Point[] {
  const pts: Point[] = [];
  STEPS.forEach((n) => {
    const el = document.getElementById(cellId(s, n)) as HTMLInputElement | null;
    const v = parseFloat((el?.value ?? "").replace(",", "."));
    if (!Number.isNaN(v)) pts.push({ x: n, y: v });
  });
  if (pts.length) pts.unshift({ x: 0, y: N0 });
  return pts;
}

/**
 * N(n) chart: up to three experimental series (read live from the table
 * cells N_s{series}_{n}) and the theoretical curve N = 128·2^(−n).
 */
export function CoinDecayChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const theory: Point[] = Array.from({ length: 81 }, (_, i) => {
      const x = i / 10;
      return { x, y: N0 * Math.pow(2, -x) };
    });

    const chart = new Chart<"line", Point[], number>(canvas, {
      type: "line",
      data: {
        datasets: [
          ...SERIES.map((s, i) => ({
            label: `Серія ${s}`,
            data: [] as Point[],
            borderColor: COLORS[i],
            backgroundColor: COLORS[i],
            borderWidth: 2,
            pointRadius: 4,
            showLine: true,
            tension: 0,
          })),
          {
            label: "N = N₀·2⁻ⁿ (теорія)",
            data: theory,
            borderColor: "#111827",
            backgroundColor: "transparent",
            borderDash: [6, 4],
            borderWidth: 2,
            pointRadius: 0,
            showLine: true,
            tension: 0.2,
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
            max: 8,
            ticks: { stepSize: 1 },
            title: { display: true, text: "Кількість кидків n" },
          },
          y: {
            min: 0,
            max: 130,
            title: { display: true, text: "Число ядер N, що не розпалися" },
          },
        },
        plugins: { legend: { display: true } },
      },
    });

    const redraw = () => {
      SERIES.forEach((s, i) => {
        chart.data.datasets[i].data = readSeries(s);
      });
      chart.update();
    };

    const inputs = SERIES.flatMap((s) => STEPS.map((n) => cellId(s, n)))
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLInputElement => el !== null);

    inputs.forEach((el) => el.addEventListener("input", redraw));
    redraw();

    return () => {
      inputs.forEach((el) => el.removeEventListener("input", redraw));
      chart.destroy();
    };
  }, []);

  return (
    <div className="chart-container" style={{ position: "relative", height: 400 }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
