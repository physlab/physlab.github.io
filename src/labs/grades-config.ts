import type { Grade } from "./types";

/**
 * Grades shown on the homepage and reachable via /grades/$grade.
 *
 * To hide a grade (e.g. 7th grade labs aren't ready yet), just comment
 * out its line below — the labs themselves stay in the registry
 * untouched, they simply won't be listed or linked anywhere.
 *
 * Example — this hides 7th grade:
 *   export const VISIBLE_GRADES: readonly Grade[] = [
 *     // 7,
 *     8,
 *     9,
 *     10,
 *     11,
 *   ];
 */
export const VISIBLE_GRADES: readonly Grade[] = [7, 8, 9, 10, 11];
