import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import tableBg from "@/assets/connected-bodies-sim-table.png";
import pulleyWheel from "@/assets/connected-bodies-sim-pulley-wheel.png";
import ruler from "@/assets/connected-bodies-sim-ruler.png";

/**
 * Портовано з forces.html + js/forces/script.js (canvas-симуляція бруска на
 * трибометрі, з'єднаного через блок із тягарцем, що падає).
 *
 * Фізика 1:1 з оригіналу:
 *   a = g·(m2 − μ·m1) / (m1 + m2)
 * Рух рахується у "кадрових" одиницях (як і в оригіналі) — це не реальний
 * час, а домовлена одиниця, підібрана авторами під швидкість анімації.
 *
 * Примітка: оригінальні css/forces/style.css мені не надавали, тому точне
 * піксельне позиціювання шківа/лінійки на фоновій картинці підібране
 * приблизно (за координатами з script.js) — можливо, знадобиться невелике
 * підлаштування після інтеграції в реальний проєкт.
 */

const G = 9.81;
const MU = 0.25;
const X0 = 70;
const Y0 = 50;
const DT = 0.3;
const TIME_SCALE = 0.05;
const BLOCK_WIDTH = 50;
const BLOCK_HEIGHT = 30;
const TRACK_LIMIT = 378 + 70; // widthTribometr з оригіналу
const PULLEY_X = 508;
const WEIGHT_COLUMN_X = 520;
const WEIGHT_WIDTH = 30;
const WEIGHT_HEIGHT = 10;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 490;

// Рухома частина (canvas) була зміщена відносно фонової картинки на 30px
// вниз і 30px вліво — компенсуємо це зсувом у зворотний бік.
const OFFSET_X = 17;
const OFFSET_Y = -29;

const MASS1_OPTIONS = [0.1, 0.15, 0.2, 0.25, 0.3, 0.35];
const MASS2_OPTIONS = [0.05, 0.1, 0.15];

function computeAcceleration(m1: number, m2: number) {
  return (G * (m2 - MU * m1)) / (m1 + m2);
}

type SimState = {
  x: number;
  vx: number;
  ax: number;
  running: boolean;
};

export function ConnectedBodiesSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const stateRef = useRef<SimState>({
    x: X0,
    vx: 0,
    ax: computeAcceleration(0.35, 0.1),
    running: false,
  });

  const [mass1, setMass1] = useState(0.35);
  const [mass2, setMass2] = useState(0.1);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState("00.00");
  const [speed, setSpeed] = useState("0.00");
  const [accel, setAccel] = useState("0.00");

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { x } = stateRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bx = x + OFFSET_X;
    const by = Y0 + OFFSET_Y;
    const pulleyX = PULLEY_X + OFFSET_X;
    const weightColumnX = WEIGHT_COLUMN_X + OFFSET_X;

    // брусок
    ctx.fillStyle = "#8b5a2b";
    ctx.fillRect(bx, by, BLOCK_WIDTH, BLOCK_HEIGHT);

    // горизонтальна нитка до блока
    ctx.strokeStyle = "#2b6cb0";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx + BLOCK_WIDTH, by + BLOCK_HEIGHT / 2);
    ctx.lineTo(pulleyX, by + BLOCK_HEIGHT / 2);
    ctx.stroke();

    const l1 = PULLEY_X - x + BLOCK_WIDTH;
    const l2 = PULLEY_X - l1 + 20;

    // вертикальна нитка до тягарця
    ctx.beginPath();
    ctx.moveTo(weightColumnX, by + BLOCK_HEIGHT / 2 + 8);
    ctx.lineTo(weightColumnX, by + BLOCK_HEIGHT / 2 + l2 - 10);
    ctx.stroke();

    // тягарець
    ctx.fillStyle = "#e53e3e";
    ctx.fillRect(
      weightColumnX - WEIGHT_WIDTH / 2,
      by + l2,
      WEIGHT_WIDTH,
      WEIGHT_HEIGHT,
    );
  }, []);

  const tick = useCallback(() => {
    const state = stateRef.current;

    if (state.running) {
      if (state.ax <= 0) {
        state.ax = 0;
      }

      if (state.x > TRACK_LIMIT - 10) {
        state.running = false;
        setRunning(false);
      } else {
        state.vx += state.ax * DT;
        state.x += state.vx * DT;
      }

      draw();

      setSeconds((prev) => {
        const next = (parseFloat(prev) + DT * TIME_SCALE).toFixed(2);
        return parseFloat(next) < 10 ? `0${next}` : next;
      });
      setSpeed(state.vx.toFixed(2));
      setAccel(state.ax.toFixed(2));
    }

    frameRef.current = requestAnimationFrame(tick);
  }, [draw]);

  useEffect(() => {
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [tick]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleReset = () => {
    stateRef.current = {
      x: X0,
      vx: 0,
      ax: computeAcceleration(mass1, mass2),
      running: false,
    };
    setRunning(false);
    setSeconds("00.00");
    setSpeed("0.00");
    setAccel("0.00");
    draw();
  };

  const handleToggle = () => {
    const next = !stateRef.current.running;
    stateRef.current.running = next;
    setRunning(next);
  };

  // перетягувана лінійка
  const rulerRef = useRef<HTMLImageElement>(null);
  const [rulerPos, setRulerPos] = useState({ left: 16, top: 40 });
  const dragOffset = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);

  const onPointerDown = (e: PointerEvent<HTMLImageElement>) => {
    const rect = rulerRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLImageElement>) => {
    if (!draggingRef.current) return;
    const container = rulerRef.current?.parentElement?.getBoundingClientRect();
    if (!container) return;
    setRulerPos({
      left: e.clientX - container.left - dragOffset.current.x,
      top: e.clientY - container.top - dragOffset.current.y,
    });
  };

  const onPointerUp = () => {
    draggingRef.current = false;
  };

  return (
    <div className="mx-auto w-full max-w-[600px]">
      <div
        className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md"
        style={{
          width: "100%",
          aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}`,
        }}
      >
        <img
          src={tableBg}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-contain"
        />
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="absolute inset-0 h-full w-full"
        />
        <img
          src={pulleyWheel}
          alt=""
          className="pointer-events-none absolute w-[6%]"
          style={{
            left: `${((PULLEY_X - 5) / CANVAS_WIDTH) * 100}%`,
            top: `${((Y0 - 15) / CANVAS_HEIGHT) * 100}%`,
            animation: running
              ? "connected-bodies-spin 0.6s linear infinite"
              : "none",
          }}
        />
        <img
          ref={rulerRef}
          src={ruler}
          alt="Лінійка (перетягніть для вимірювання)"
          className="absolute w-10 max-w-none cursor-grab touch-none select-none active:cursor-grabbing"
          style={{ left: rulerPos.left, top: rulerPos.top }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          Маса бруска
          <select
            className="rounded-md border border-gray-300 px-2 py-1"
            value={mass1}
            onChange={(e) => setMass1(parseFloat(e.target.value))}
          >
            {MASS1_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m.toFixed(2)} кг
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm">
          Маса тягарця
          <select
            className="rounded-md border border-gray-300 px-2 py-1"
            value={mass2}
            onChange={(e) => setMass2(parseFloat(e.target.value))}
          >
            {MASS2_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m.toFixed(2)} кг
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={handleToggle}
          className="rounded-full bg-indigo-600 px-5 py-2 font-medium text-white transition hover:bg-indigo-700"
        >
          {running ? "Пауза" : "Пуск"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full border border-gray-300 px-5 py-2 font-medium transition hover:bg-gray-100"
        >
          Перевстановити
        </button>
      </div>

      <div className="mt-3 text-center text-sm">
        t = {seconds} c &nbsp; υ = {speed} м/с &nbsp; a = {accel} м/с²
      </div>

      <style>{`
        @keyframes connected-bodies-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
