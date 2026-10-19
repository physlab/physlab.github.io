import type { PointerEvent as ReactPointerEvent, Ref } from "react";
import type { DiodeElement } from "./diode-model";

/**
 * Electrical circuit diagram: source, key, rheostat (voltage divider),
 * ammeter in series with a diode, voltmeter in parallel with the diode.
 * Used both as a static figure (instruments / video variants) and inside the
 * interactive bench (simulation variant, where the rheostat slider can be dragged).
 */

export const RHEO_X0 = 170;
export const RHEO_X1 = 400;
export const VIEWBOX_W = 620;

type Props = {
  pct?: number;
  keyClosed?: boolean;
  /** true — forward bias (anode to «+»), false — reverse bias */
  forward?: boolean;
  element?: DiodeElement;
  /** 0…1 — brightness of the LED glow */
  glow?: number;
  burned?: boolean;
  svgRef?: Ref<SVGSVGElement>;
  onRheoDown?: (e: ReactPointerEvent<SVGGElement>) => void;
  onRheoMove?: (e: ReactPointerEvent<SVGGElement>) => void;
  onRheoUp?: (e: ReactPointerEvent<SVGGElement>) => void;
  interactive?: boolean;
  ariaLabel?: string;
};

const WIRE = { fill: "none", stroke: "#374151", strokeWidth: 2.5 } as const;

export function DiodeCircuit({
  pct = 50,
  keyClosed = true,
  forward = true,
  element = "rectifier",
  glow = 0,
  burned = false,
  svgRef,
  onRheoDown,
  onRheoMove,
  onRheoUp,
  interactive = false,
  ariaLabel = "Схема електричного кола: джерело струму, ключ, реостат, амперметр, діод і вольтметр",
}: Props) {
  const xs = RHEO_X0 + ((RHEO_X1 - RHEO_X0) * pct) / 100;

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 620 350"
      className="w-full select-none"
      role="img"
      aria-label={ariaLabel}
    >
      {/* wires */}
      <path d="M60,120 L60,30 L90,30" {...WIRE} />
      <path d="M140,30 L400,30 L400,62" {...WIRE} />
      <path d="M170,62 L170,330" {...WIRE} />
      <path d="M60,135 L60,330 L470,330" {...WIRE} />
      <path d={`M${xs},92 L${xs},110 L470,110 L470,127`} {...WIRE} />
      <path d="M470,163 L470,190" {...WIRE} />
      <path d="M470,225 L470,330" {...WIRE} />
      <path d="M470,175 L540,175 L540,192" {...WIRE} />
      <path d="M540,228 L540,250 L470,250" {...WIRE} />

      {/* source */}
      <line x1={45} x2={75} y1={120} y2={120} stroke="#111827" strokeWidth={3} />
      <line x1={51} x2={69} y1={135} y2={135} stroke="#111827" strokeWidth={3} />
      <text x={86} y={119} fontSize={14} fill="#dc2626">+</text>
      <text x={86} y={143} fontSize={14} fill="#111827">−</text>
      <text x={20} y={132} fontSize={12} fill="#374151">3 В</text>

      {/* key */}
      <circle cx={90} cy={30} r={4} fill="#9ca3af" stroke="#4b5563" />
      <circle cx={140} cy={30} r={4} fill="#9ca3af" stroke="#4b5563" />
      {keyClosed ? (
        <line x1={90} y1={30} x2={140} y2={30} stroke="#111827" strokeWidth={4} />
      ) : (
        <line x1={90} y1={30} x2={132} y2={6} stroke="#111827" strokeWidth={4} />
      )}
      <text x={115} y={54} textAnchor="middle" fontSize={12} fill="#374151">
        Ключ
      </text>

      {/* rheostat (voltage divider) */}
      <g
        onPointerDown={onRheoDown}
        onPointerMove={onRheoMove}
        onPointerUp={onRheoUp}
        onPointerCancel={onRheoUp}
        style={interactive ? { cursor: "ew-resize", touchAction: "none" } : undefined}
      >
        <rect x={RHEO_X0 - 10} y={44} width={RHEO_X1 - RHEO_X0 + 20} height={64} fill="transparent" />
        <rect x={RHEO_X0} y={50} width={RHEO_X1 - RHEO_X0} height={25} fill="#e5e7eb" stroke="#6b7280" rx={4} />
        {Array.from({ length: 22 }, (_, i) => (
          <line
            key={i}
            x1={RHEO_X0 + 8 + i * 10}
            x2={RHEO_X0 + 8 + i * 10}
            y1={55}
            y2={70}
            stroke="#b45309"
            strokeWidth={2}
          />
        ))}
        <polygon points={`${xs - 9},94 ${xs + 9},94 ${xs},75`} fill="#111827" />
      </g>
      <text x={285} y={130} textAnchor="middle" fontSize={12} fill="#374151">
        {interactive ? "Реостат (перетягніть повзунок)" : "Реостат"}
      </text>

      {/* ammeter */}
      <circle cx={470} cy={145} r={18} fill="#ffffff" stroke="#374151" strokeWidth={2} />
      <text x={470} y={152} textAnchor="middle" fontSize={18} fontWeight="bold" fill="#111827">
        A
      </text>

      {/* voltmeter */}
      <circle cx={540} cy={210} r={18} fill="#ffffff" stroke="#374151" strokeWidth={2} />
      <text x={540} y={217} textAnchor="middle" fontSize={18} fontWeight="bold" fill="#111827">
        V
      </text>

      {/* diode / LED (vertical, current flows from top to bottom when forward) */}
      {element === "led" && glow > 0 && (
        <circle cx={470} cy={208} r={40} fill="#fbbf24" opacity={Math.min(1, glow) * 0.65} />
      )}
      {forward ? (
        <g>
          <polygon points="458,190 482,190 470,225" fill="#ffffff" stroke="#111827" strokeWidth={2} />
          <line x1={456} x2={484} y1={225} y2={225} stroke="#111827" strokeWidth={3} />
        </g>
      ) : (
        <g>
          <polygon points="458,225 482,225 470,190" fill="#ffffff" stroke="#111827" strokeWidth={2} />
          <line x1={456} x2={484} y1={190} y2={190} stroke="#111827" strokeWidth={3} />
        </g>
      )}
      {element === "led" && (
        <g stroke="#111827" strokeWidth={1.5} fill="none">
          <path d="M486,200 L500,186 M494,186 L500,186 L500,192" />
          <path d="M492,212 L506,198 M500,198 L506,198 L506,204" />
        </g>
      )}
      {burned && (
        <g stroke="#dc2626" strokeWidth={4}>
          <line x1={455} y1={190} x2={485} y2={225} />
          <line x1={485} y1={190} x2={455} y2={225} />
        </g>
      )}
      <text x={430} y={212} textAnchor="end" fontSize={12} fill="#374151">
        {element === "led" ? "світлодіод" : "діод"}
      </text>
    </svg>
  );
}
