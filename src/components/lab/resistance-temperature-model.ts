/** Physics model for the virtual "copper wire resistance vs temperature" setup. */

export const T_AMBIENT = 20; // °C
export const R0_KOHM = 0.7; // resistance of the wire at 0 °C (hidden), kΩ
export const ALPHA = 4.3e-3; // temperature coefficient of copper (hidden), 1/°C
const BETA = 1.0e-6; // tiny non-linearity, 1/°C²
const TAU_COIL = 8; // s — the wire/thermometer lag behind the water

export type SimState = {
  /** Water temperature, °C */
  tw: number;
  /** Temperature of the wire (and of the thermometer inside the tube), °C */
  tc: number;
  /** Elapsed model time, s */
  time: number;
};

export const INITIAL_STATE: SimState = { tw: 23, tc: 23, time: 0 };

/** Advance the model by `dt` seconds (call with small dt, e.g. 0.1 s). */
export function step(s: SimState, heaterOn: boolean, dt: number): SimState {
  const loss = 0.0006 * (s.tw - T_AMBIENT);
  const dTw = (heaterOn ? 0.45 : 0) - loss;
  const tw = Math.min(100, Math.max(T_AMBIENT, s.tw + dTw * dt));
  const tc = s.tc + ((tw - s.tc) / TAU_COIL) * dt;
  return { tw, tc, time: s.time + dt };
}

/** Wire resistance in kΩ at temperature t, with a small repeatable "noise". */
export function resistanceKOhm(t: number): number {
  const ideal = R0_KOHM * (1 + ALPHA * t + BETA * t * t);
  const noise = 0.0012 * Math.sin(t * 37.7);
  return ideal + noise;
}
