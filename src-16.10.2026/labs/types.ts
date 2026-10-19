import type { ComponentType, ReactNode } from "react";

export type Grade = 7 | 8 | 9 | 10 | 11;

export type LabMeta = {
  /** <title> сторінки та og:title */
  title: string;
  /** meta description та og:description */
  description: string;
};

/**
 * Опис однієї лабораторної роботи.
 *
 * Мінімум (тільки картка у списку, робота ще не перенесена в онлайн-формат):
 *   { slug, grade, badge, title }
 *
 * Повний опис (робота доступна для виконання онлайн) додатково містить
 * number/goal/equipment/sheetName/Content (і, бажано, meta).
 */
export type LabDefinition = {
  /** Унікальний ідентифікатор у межах сайту, використовується в URL /labs/:slug */
  slug: string;
  grade: Grade;
  /** Порядковий номер у списку класу (або емодзі-маркер) */
  badge: string;
  title: string;

  /** Номер роботи для заголовка сторінки, напр. "№ 5" */
  number?: string;
  goal?: ReactNode;
  equipment?: ReactNode;
  /** Назва аркуша/роботи, під якою звіт іде на бекенд і в PDF */
  sheetName?: string;
  meta?: LabMeta;
  /** Компонент з бланком роботи (все, що всередині <LabForm>). Якщо відсутній — робота ще не перенесена. */
  Content?: ComponentType;
};

/** Лабораторна робота, доступна для виконання онлайн (усі опційні поля заповнені) */
export type AvailableLabDefinition = LabDefinition &
  Required<
    Pick<
      LabDefinition,
      "number" | "goal" | "equipment" | "sheetName" | "Content"
    >
  >;

export function isAvailable(lab: LabDefinition): lab is AvailableLabDefinition {
  return Boolean(lab.Content);
}
