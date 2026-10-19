import type { Grade, LabDefinition } from "./types";

/**
 * Автоматичне підключення всіх лабораторних робіт.
 *
 * Щоб додати нову роботу, достатньо створити один файл `src/labs/<slug>.tsx`
 * з `export default` значенням типу `LabDefinition` — він підхопиться сам,
 * без правок цього файлу чи роутера.
 */
const modules = import.meta.glob<{ default: LabDefinition }>("./*.tsx", {
  eager: true,
});

const badgeOrder = (badge: string) => {
  const n = Number(badge);
  return Number.isFinite(n) ? n : Number.POSITIVE_INFINITY;
};

export const labs: LabDefinition[] = Object.entries(modules)
  .map(([path, mod]) => {
    const lab = mod.default;
    if (!lab) {
      throw new Error(
        `Файл ${path} у src/labs не має "export default" з LabDefinition`,
      );
    }
    return lab;
  })
  .sort(
    (a, b) => a.grade - b.grade || badgeOrder(a.badge) - badgeOrder(b.badge),
  );

if (import.meta.env.DEV) {
  const seen = new Map<string, string>();
  for (const lab of labs) {
    const prev = seen.get(lab.slug);
    if (prev) {
      throw new Error(
        `Дублікат slug "${lab.slug}" у лабораторних роботах: "${prev}" та "${lab.title}"`,
      );
    }
    seen.set(lab.slug, lab.title);
  }
}

export function getLab(slug: string): LabDefinition | undefined {
  return labs.find((lab) => lab.slug === slug);
}

export function labsByGrade(grade: Grade): LabDefinition[] {
  return labs.filter((lab) => lab.grade === grade);
}

export const gradesInUse: Grade[] = Array.from(
  new Set(labs.map((lab) => lab.grade)),
).sort((a, b) => a - b);
