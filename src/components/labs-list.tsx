import { Link } from "@tanstack/react-router";
import { isAvailable, type LabDefinition } from "@/labs/types";

/**
 * Renders the list of labs for a single grade. Shared by the homepage
 * grade cards and by the dedicated /grades/$grade page.
 */
export function LabsList({ labs }: { labs: LabDefinition[] }) {
  return (
    <ul className="space-y-2">
      {labs.map((lab) => {
        const available = isAvailable(lab);
        const inner = (
          <>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background text-sm font-semibold text-foreground">
              {lab.badge}
            </span>
            <span className="flex-1 text-sm font-medium leading-snug">
              {lab.title}
            </span>
            <span className="text-muted-foreground transition-transform group-hover:translate-x-1">
              →
            </span>
          </>
        );

        return (
          <li key={lab.slug}>
            {available ? (
              <Link
                to="/labs/$slug"
                params={{ slug: lab.slug }}
                className="group flex items-center gap-3 rounded-xl bg-surface px-3 py-2.5 text-foreground transition hover:bg-accent hover:text-accent-foreground"
              >
                {inner}
              </Link>
            ) : (
              <div
                className="group flex cursor-not-allowed items-center gap-3 rounded-xl bg-surface/60 px-3 py-2.5 text-muted-foreground"
                title="Робота ще переноситься"
              >
                {inner}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
