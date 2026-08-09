import type { Grade } from "./types";

/** Слово, яке узгоджується з кількістю: "N лабораторних робіт" / "N експериментальних робіт" */
const gradeWord: Record<Grade, string> = {
  7: "лабораторних робіт",
  8: "лабораторних робіт",
  9: "лабораторних робіт",
  10: "лабораторних робіт",
  11: "експериментальних робіт",
};

const gradeWordOne: Record<Grade, string> = {
  7: "лабораторна робота",
  8: "лабораторна робота",
  9: "лабораторна робота",
  10: "лабораторна робота",
  11: "експериментальна робота",
};

const gradeWordFew: Record<Grade, string> = {
  7: "лабораторні роботи",
  8: "лабораторні роботи",
  9: "лабораторні роботи",
  10: "лабораторні роботи",
  11: "експериментальні роботи",
};

/** Українська форма числівника: 1 → одна форма, 2–4 → інша, 5+ → третя (з винятком 11–14) */
function pluralize(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

export function gradeCaption(grade: Grade, count: number): string {
  const word = pluralize(
    count,
    gradeWordOne[grade],
    gradeWordFew[grade],
    gradeWord[grade],
  );
  return `${count} ${word}`;
}
