/**
 * Thin-lens optics for the two-lens optical bench (all lengths in cm).
 * Sign convention: lens focal length f > 0 for a converging lens and
 * f < 0 for a diverging lens; positions increase from left to right.
 */

export type Lens = { x: number; f: number };

export type ImageResult = {
  /** Position of the final image on the bench (cm); null if none / at infinity */
  x: number | null;
  /** Signed lateral magnification of the whole chain (negative = inverted) */
  m: number;
  /** True if the final image is real (formed to the right of the last lens) */
  real: boolean;
};

/** Lenses that actually act on the beam: between source and screen, left to right. */
export function activeLenses(
  lenses: Lens[],
  sourceX: number,
  screenX: number,
): Lens[] {
  return lenses
    .filter((l) => l.x > sourceX && l.x < screenX)
    .sort((a, b) => a.x - b.x);
}

/** Image of the source after passing through the given lenses in order. */
export function computeImage(sourceX: number, lenses: Lens[]): ImageResult {
  let pos = sourceX;
  let m = 1;
  let real = true;
  for (const lens of lenses) {
    const u = lens.x - pos; // >0: real object, <0: virtual object
    if (Math.abs(u - lens.f) < 1e-9) {
      return { x: null, m, real: false }; // image at infinity
    }
    const v = (lens.f * u) / (u - lens.f);
    m *= -v / u;
    pos = lens.x + v;
    real = v > 0;
  }
  return { x: pos, m, real };
}

/**
 * Paraxial trace of a ray that starts at (x0, y0) with slope theta
 * through the lenses and on to xEnd. Returns the polyline vertices.
 */
export function traceRay(
  x0: number,
  y0: number,
  theta: number,
  lenses: Lens[],
  xEnd: number,
): Array<{ x: number; y: number }> {
  const pts = [{ x: x0, y: y0 }];
  let x = x0;
  let y = y0;
  let t = theta;
  for (const lens of lenses) {
    y += t * (lens.x - x);
    x = lens.x;
    pts.push({ x, y });
    t -= y / lens.f;
  }
  pts.push({ x: xEnd, y: y + t * (xEnd - x) });
  return pts;
}
