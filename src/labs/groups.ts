import type { LabDefinition } from "./types";

/**
 * Одна лабораторна робота у списку класу може мати кілька варіантів
 * виконання (звичайний, за відео, симуляція). У реєстрі вони існують як
 * окремі роботи з badge на кшталт "6.1", "6.2", "6.3".
 *
 * Тут вони збираються у групи за цілою частиною badge, щоб у списку класу
 * показувалися саме роботи (1–10), а варіанти розгорталися по клацанню.
 */
export type LabGroup = {
  /** Ціла частина badge, напр. "6" (або сам badge, якщо він не числовий) */
  key: string;
  /** Номер роботи для значка у списку */
  badge: string;
  /** Назва роботи без хвоста ". Варіант N (...)" */
  title: string;
  variants: LabVariant[];
};

export type LabVariant = {
  lab: LabDefinition;
  /** Підпис варіанта, напр. "Варіант 2 (за відео)" */
  label: string;
};

const VARIANT_RE = /\.\s*(Варіант\s*\d+[^.]*)$/u;

/** "6.2" -> "6"; "🔬" -> "🔬" */
function groupKey(badge: string): string {
  const [head] = badge.split(".");
  return (head ?? badge).trim() || badge;
}

function splitTitle(title: string): { base: string; variant: string | null } {
  const match = title.match(VARIANT_RE);
  if (!match) return { base: title.trim(), variant: null };
  return {
    base: title.slice(0, match.index).trim(),
    variant: match[1]!.trim(),
  };
}

function variantOrder(badge: string): number {
  const tail = Number(badge.split(".")[1]);
  return Number.isFinite(tail) ? tail : 0;
}

export function groupLabs(labs: LabDefinition[]): LabGroup[] {
  const groups = new Map<string, LabGroup>();

  for (const lab of labs) {
    const key = groupKey(lab.badge);
    const { base, variant } = splitTitle(lab.title);

    let group = groups.get(key);
    if (!group) {
      group = { key, badge: key, title: base, variants: [] };
      groups.set(key, group);
    }
    // Найкоротша назва (без хвоста варіанта) — це назва роботи.
    if (base.length < group.title.length || !variant) {
      group.title = base;
    }
    group.variants.push({ lab, label: variant ?? "Варіант 1 (основний)" });
  }

  for (const group of groups.values()) {
    group.variants.sort(
      (a, b) => variantOrder(a.lab.badge) - variantOrder(b.lab.badge),
    );
  }

  return [...groups.values()];
}

/** Кількість робіт у класі (варіанти однієї роботи рахуються один раз) */
export function labCount(labs: LabDefinition[]): number {
  return groupLabs(labs).length;
}
