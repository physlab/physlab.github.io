import type { Grade } from "./types";

/**
 * These pages aren't linked from anywhere guessable — a page only opens
 * if the exact code in the URL matches a value below.
 *
 * - Change a code any time to rotate that link (old one stops working
 *   immediately, no redeploy of routes needed).
 * - Comment out (or delete) a grade's line in GRADE_CODES to hide that
 *   grade completely: it disappears from the overview page AND its
 *   /grades/<code> URL starts returning "not found". The labs themselves
 *   stay in the registry untouched.
 */

// /$code — reveals the "pick a grade" overview (this used to be at `/`).
export const HOME_CODE = "4342324221";

// /grades/$code — reveals one grade's labs. Keys are arbitrary strings.
export const GRADE_CODES: Record<string, Grade> = {
  "9484393": 7,
  "2214477": 8,
  "3391920": 9,
  "5566110": 10,
  "7788234": 11,
};

/** Reverse lookup: grade -> its code, or undefined if that grade is hidden. */
export function codeForGrade(grade: Grade): string | undefined {
  return Object.entries(GRADE_CODES).find(([, g]) => g === grade)?.[0];
}
