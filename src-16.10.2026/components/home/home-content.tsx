import { Link } from "@tanstack/react-router";
import { gradesInUse, labsByGrade } from "@/labs/registry";
import { gradeCaption } from "@/labs/grade-labels";
import { codeForGrade } from "@/labs/access-codes";
import type { Grade } from "@/labs/types";
import { LabsList } from "@/components/labs-list";

const gradeStyles: Record<Grade, { dot: string; bar: string }> = {
  7: { dot: "bg-grade-7", bar: "bg-grade-7" },
  8: { dot: "bg-grade-8", bar: "bg-grade-8" },
  9: { dot: "bg-grade-9", bar: "bg-grade-9" },
  10: { dot: "bg-grade-10", bar: "bg-grade-10" },
  11: { dot: "bg-grade-11", bar: "bg-grade-11" },
};

export function HomeContent() {
  // Only grades that both have labs AND have a code configured in
  // access-codes.ts (a grade with no code is simply not shown or linkable).
  const visibleGrades = gradesInUse.filter(
    (grade) => codeForGrade(grade) !== undefined,
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-hero px-4 pb-24 pt-20 text-primary-foreground">
        <div className="mx-auto max-w-5xl">
          <p className="font-display text-xs uppercase tracking-[0.35em] text-primary-foreground/70">
            PhysLabs
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-[1.1] sm:text-5xl">
            Лабораторні роботи з фізики
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/80 sm:text-lg">
            Виберіть свій клас і роботу — вимірювання, обчислення та висновки
            заповнюються прямо у браузері, сформуйте PDF файл та надішліть
            його вчителю.
          </p>
        </div>
      </header>

      <main className="mx-auto -mt-14 max-w-5xl px-4 pb-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {visibleGrades.map((grade) => {
            const gradeLabs = labsByGrade(grade);
            const code = codeForGrade(grade);
            // Shouldn't happen (we just filtered on this), but keeps
            // TypeScript honest and avoids ever emitting a broken link.
            if (!code) return null;
            return (
              <section
                key={grade}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className={`h-1.5 w-full ${gradeStyles[grade].bar}`} />
                <div className="p-6">
                  <Link
                    to="/grades/$code"
                    params={{ code }}
                    className="group flex items-center gap-4 border-b border-border pb-5"
                  >
                    <span
                      className={`flex size-12 items-center justify-center rounded-xl font-display text-lg font-bold text-primary-foreground ${gradeStyles[grade].dot}`}
                    >
                      {grade}
                    </span>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground group-hover:underline">
                        {grade} клас
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {gradeCaption(grade, gradeLabs.length)}
                      </p>
                    </div>
                  </Link>

                  <div className="mt-5">
                    <LabsList labs={gradeLabs} />
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          © 2026 Лабораторні роботи з фізики
        </p>
      </main>
    </div>
  );
}
