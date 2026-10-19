/** Physics model for the virtual "electrolysis of CuSO₄ solution" setup. */

/** Real (hidden) electrochemical equivalent of copper in this model, mg/C. */
export const K_TRUE_MG_PER_C = 0.327;
/** Table value, mg/C (3.3·10⁻⁷ kg/C). */
export const K_TABLE_MG_PER_C = 0.33;
/** EMF of the power supply, V. */
export const EMF_V = 6;
/** Mass of the liquid film on a wet electrode (disappears after blotting), g. */
export const WET_FILM_G = 0.28;
/** Start of the model clock (14:00:00), s. */
export const CLOCK_START_S = 14 * 3600;

export type SimState = {
  /** Model clock, s since midnight */
  clock: number;
  /** Time during which current has been flowing, s */
  elTime: number;
  /** Mass of copper deposited on the cathode, mg */
  depositMg: number;
};

export const INITIAL_STATE: SimState = {
  clock: CLOCK_START_S,
  elTime: 0,
  depositMg: 0,
};

/** Rheostat resistance for slider position 0…100 %, Ω. */
export function rheostatOhm(pct: number): number {
  return 2 + 0.28 * pct;
}

/** Resistance of the cell: slowly grows during electrolysis, Ω. */
export function cellOhm(elTime: number): number {
  return 1 + 0.0009 * elTime;
}

/** Current in the circuit, A (0 if the circuit is open). */
export function circuitCurrent(
  circuitClosed: boolean,
  pct: number,
  elTime: number,
): number {
  if (!circuitClosed) return 0;
  return EMF_V / (rheostatOhm(pct) + cellOhm(elTime));
}

/** Advance the model by `dt` seconds (call with dt ≤ 1 s). */
export function step(
  s: SimState,
  circuitClosed: boolean,
  pct: number,
  dt: number,
): SimState {
  const I = circuitCurrent(circuitClosed, pct, s.elTime);
  return {
    clock: s.clock + dt,
    elTime: s.elTime + (I > 0 ? dt : 0),
    depositMg: s.depositMg + K_TRUE_MG_PER_C * I * dt,
  };
}

/** Reading of the electronic balance (resolution 0.01 g), g. */
export function balanceReading(
  baseMassG: number,
  depositMg: number,
  wet: boolean,
): number {
  const m = baseMassG + depositMg / 1000 + (wet ? WET_FILM_G : 0);
  return Math.round(m * 100) / 100;
}

/** Random initial mass of the cathode, 17.50…19.49 g. */
export function randomBaseMass(): number {
  return 17.5 + Math.floor(Math.random() * 200) / 100;
}

export function formatClock(totalSeconds: number): string {
  const s = Math.floor(totalSeconds) % 86400;
  const hh = Math.floor(s / 3600);
  const mm = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(hh)}:${p(mm)}:${p(ss)}`;
}
