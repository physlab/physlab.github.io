import { useState } from "react";
import { Check, ChevronDown, Copy, ExternalLink } from "lucide-react";
import { isAvailable, type Grade, type LabDefinition } from "@/labs/types";
import { groupLabs, type LabVariant } from "@/labs/groups";

/**
 * Renders the list of labs for a single grade: one row per lab, with the
 * variants (video / simulation / classroom) collapsed inside. Each variant
 * opens in a new tab and can have its link copied to the clipboard.
 */

type GradeTheme = {
  badge: string;
  ring: string;
  soft: string;
  hoverSoft: string;
  text: string;
  border: string;
};

const gradeThemes: Record<Grade, GradeTheme> = {
  7: {
    badge: "bg-grade-7",
    ring: "ring-grade-7/30",
    soft: "bg-grade-7/8",
    hoverSoft: "hover:bg-grade-7/10",
    text: "text-grade-7",
    border: "border-grade-7/25",
  },
  8: {
    badge: "bg-grade-8",
    ring: "ring-grade-8/30",
    soft: "bg-grade-8/8",
    hoverSoft: "hover:bg-grade-8/10",
    text: "text-grade-8",
    border: "border-grade-8/25",
  },
  9: {
    badge: "bg-grade-9",
    ring: "ring-grade-9/30",
    soft: "bg-grade-9/8",
    hoverSoft: "hover:bg-grade-9/10",
    text: "text-grade-9",
    border: "border-grade-9/25",
  },
  10: {
    badge: "bg-grade-10",
    ring: "ring-grade-10/30",
    soft: "bg-grade-10/8",
    hoverSoft: "hover:bg-grade-10/10",
    text: "text-grade-10",
    border: "border-grade-10/25",
  },
  11: {
    badge: "bg-grade-11",
    ring: "ring-grade-11/30",
    soft: "bg-grade-11/8",
    hoverSoft: "hover:bg-grade-11/10",
    text: "text-grade-11",
    border: "border-grade-11/25",
  },
};

function labHref(slug: string): string {
  return `/labs/${slug}`;
}

function absoluteHref(slug: string): string {
  if (typeof window === "undefined") return labHref(slug);
  return new URL(labHref(slug), window.location.origin).toString();
}

function CopyLinkButton({
  slug,
  theme,
  disabled,
  className = "",
}: {
  slug: string;
  theme: GradeTheme;
  disabled?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const url = absoluteHref(slug);
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const area = document.createElement("textarea");
      area.value = url;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={copy}
      disabled={disabled}
      aria-label={copied ? "Посилання скопійовано" : "Скопіювати посилання"}
      title={copied ? "Посилання скопійовано" : "Скопіювати посилання"}
      className={`flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 ${
        copied ? `${theme.text} ${theme.border}` : ""
      } ${className}`}
    >
      {copied ? (
        <Check className="size-4" />
      ) : (
        <Copy className="size-4" />
      )}
    </button>
  );
}

function VariantRow({
  variant,
  theme,
}: {
  variant: LabVariant;
  theme: GradeTheme;
}) {
  const { lab, label } = variant;
  const available = isAvailable(lab);

  return (
    <li className="flex items-center gap-2">
      {available ? (
        <a
          href={labHref(lab.slug)}
          target="_blank"
          rel="noopener noreferrer"
          className={`group flex flex-1 items-center gap-2.5 rounded-lg border border-transparent px-3 py-2 text-sm text-foreground transition ${theme.hoverSoft}`}
        >
          <span
            className={`size-1.5 shrink-0 rounded-full ${theme.badge}`}
            aria-hidden
          />
          <span className="flex-1 leading-snug">{label}</span>
          <ExternalLink className="size-3.5 shrink-0 text-muted-foreground transition group-hover:text-foreground" />
        </a>
      ) : (
        <div
          className="flex flex-1 items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground"
          title="Робота ще переноситься"
        >
          <span
            className="size-1.5 shrink-0 rounded-full bg-muted-foreground/40"
            aria-hidden
          />
          <span className="flex-1 leading-snug">{label}</span>
          <span className="text-xs uppercase tracking-wide">скоро</span>
        </div>
      )}
      <CopyLinkButton slug={lab.slug} theme={theme} disabled={!available} />
    </li>
  );
}

function variantsWord(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "варіант";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "варіанти";
  return "варіантів";
}

export function LabsList({
  labs,
  grade,
  dense = false,
}: {
  labs: LabDefinition[];
  grade?: Grade;
  /** Компактний режим для вузьких карток класів на головній */
  dense?: boolean;
}) {
  const groups = groupLabs(labs);
  const theme = gradeThemes[grade ?? labs[0]?.grade ?? 7];
  const [openKey, setOpenKey] = useState<string | null>(null);

  return (
    <ul className="space-y-2">
      {groups.map((group) => {
        const single = group.variants.length === 1;
        const first = group.variants[0]!;
        const open = openKey === group.key;
        const anyAvailable = group.variants.some((v) => isAvailable(v.lab));

        const badge = (
          <span
            className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold text-primary-foreground ${
              anyAvailable ? theme.badge : "bg-muted-foreground/30"
            }`}
          >
            {group.badge}
          </span>
        );

        return (
          <li
            key={group.key}
            className={`overflow-hidden rounded-xl border transition ${
              open ? `${theme.border} ${theme.soft}` : "border-transparent bg-surface"
            }`}
          >
            {single ? (
              <div className="flex items-center gap-2 pr-2">
                {isAvailable(first.lab) ? (
                  <a
                    href={labHref(first.lab.slug)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5 text-foreground transition hover:opacity-90"
                  >
                    {badge}
                    <span className="min-w-0 flex-1 break-words text-sm font-medium leading-snug">
                      {group.title}
                    </span>
                    <ExternalLink className="size-4 shrink-0 text-muted-foreground transition group-hover:text-foreground" />
                  </a>
                ) : (
                  <div
                    className="flex min-w-0 flex-1 cursor-not-allowed items-center gap-3 px-3 py-2.5 text-muted-foreground"
                    title="Робота ще переноситься"
                  >
                    {badge}
                    <span className="min-w-0 flex-1 break-words text-sm font-medium leading-snug">
                      {group.title}
                    </span>
                    <span className="text-xs uppercase tracking-wide">скоро</span>
                  </div>
                )}
                <CopyLinkButton
                  className="shrink-0"
                  slug={first.lab.slug}
                  theme={theme}
                  disabled={!isAvailable(first.lab)}
                />
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setOpenKey(open ? null : group.key)}
                  aria-expanded={open}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-foreground transition hover:opacity-90"
                >
                  {badge}
                  <span className="min-w-0 flex-1 break-words text-sm font-medium leading-snug">
                    {group.title}
                  </span>
                  {!dense && (
                    <span
                      className={`hidden shrink-0 rounded-full px-2 py-0.5 text-xs font-medium sm:inline ${theme.text} ${theme.soft}`}
                    >
                      {group.variants.length}{" "}
                      {variantsWord(group.variants.length)}
                    </span>
                  )}
                  <ChevronDown
                    className={`size-4 shrink-0 text-muted-foreground transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {open && (
                  <ul className="space-y-1 border-t border-border/60 px-2 py-2">
                    {group.variants.map((variant) => (
                      <VariantRow
                        key={variant.lab.slug}
                        variant={variant}
                        theme={theme}
                      />
                    ))}
                  </ul>
                )}
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}
