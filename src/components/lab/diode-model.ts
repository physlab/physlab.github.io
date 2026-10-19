/** Physics model for the virtual "semiconductor diode in a DC circuit" setup. */

export type DiodeElement = "rectifier" | "led";
export type MeterRange = "A" | "mA" | "uA";

/** EMF of the power supply (the rheostat works as a voltage divider), V. */
export const E_V = 3;

type DiodeParams = {
  name: string;
  /** "knee" voltage, V */
  u0: number;
  /** softness of the knee, V */
  w: number;
  /** slope above the knee, A/V */
  a: number;
  /** maximum permissible forward current, A */
  imax: number;
  /** reverse current at 0 V (scale), A */
  irev: number;
};

export const DIODE_PARAMS: Record<DiodeElement, DiodeParams> = {
  rectifier: {
    name: "напівпровідниковий діод",
    u0: 0.7,
    w: 0.12,
    a: 0.65,
    imax: 1.0,
    irev: 1e-7,
  },
  led: {
    name: "світлодіод",
    u0: 1.75,
    w: 0.06,
    a: 0.08,
    imax: 0.03,
    irev: 2e-8,
  },
};

function softplus(x: number): number {
  return x > 30 ? x : Math.log1p(Math.exp(x));
}

/** Current through the diode for voltage U (V) across it, A. Positive when forward-biased. */
export function diodeCurrent(
  element: DiodeElement,
  forward: boolean,
  u: number,
): number {
  const p = DIODE_PARAMS[element];
  if (u <= 0) return 0;
  // small repeatable "noise", as with real instruments
  const noise = 1 + 0.008 * Math.sin(u * 53.7);
  if (forward) {
    return p.a * p.w * softplus((u - p.u0) / p.w) * noise;
  }
  return p.irev * (1 + u) * noise;
}

const RANGES: Record<
  MeterRange,
  { k: number; fullScale: number; decimals: number; unit: string }
> = {
  A: { k: 1, fullScale: 2, decimals: 3, unit: "А" },
  mA: { k: 1e3, fullScale: 200, decimals: 2, unit: "мА" },
  uA: { k: 1e6, fullScale: 200, decimals: 2, unit: "мкА" },
};

export const RANGE_LABELS: Record<MeterRange, string> = {
  A: "А",
  mA: "мА",
  uA: "мкА",
};

/** Digital ammeter reading on the chosen range; shows "OL" on overload. */
export function ammeterReading(
  amps: number,
  range: MeterRange,
): { text: string; unit: string; overload: boolean } {
  const r = RANGES[range];
  const v = Math.abs(amps) * r.k;
  if (v > r.fullScale) return { text: "OL", unit: r.unit, overload: true };
  return { text: v.toFixed(r.decimals), unit: r.unit, overload: false };
}
