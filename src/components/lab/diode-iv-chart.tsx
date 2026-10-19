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
 * Live I(U) chart: points from the table cells (ids in `uIds` / `iIds`)
 * joined by a smooth line — the current-voltage characteristic.
 */
export function DiodeIVChart({
  uIds,
  iIds,
  xLabel = "Напруга U, В",
  yLabel = "Сила струму I, А",
}: {
  uIds: string[];
  iIds: string[];
  xLabel?: string;
  yLabel?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
            borderColor: "#667eea",
            backgroundColor: "#667eea",
            pointRadius: 5,
            showLine: true,
            tension: 0.25,
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
            title: { display: true, text: xLabel },
          },
          y: {
            min: 0,
            title: { display: true, text: yLabel },
          },
        },
        plugins: { legend: { display: false } },
      },
    });

    const redraw = () => {
      const points: Point[] = [];
      uIds.forEach((uid, i) => {
        const u = readNumber(uid);
        const cur = readNumber(iIds[i]);
        if (!Number.isNaN(u) && !Number.isNaN(cur)) points.push({ x: u, y: cur });
      });
      points.sort((a, b) => a.x - b.x);
      chart.data.datasets[0].data = points;
      chart.update();
    };

    const inputs = [...uIds, ...iIds]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLInputElement => el !== null);

    inputs.forEach((input) => input.addEventListener("input", redraw));
    redraw();

    return () => {
      inputs.forEach((input) => input.removeEventListener("input", redraw));
      chart.destroy();
    };
  }, [uIds, iIds, xLabel, yLabel]);

  return (
    <div className="chart-container" style={{ position: "relative", height: 380 }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
