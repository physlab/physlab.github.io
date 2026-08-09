import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { labsByGrade } from "@/labs/registry";
import { gradeCaption } from "@/labs/grade-labels";
import { VISIBLE_GRADES } from "@/labs/grades-config";
import type { Grade } from "@/labs/types";
import { LabsList } from "@/components/labs-list";

const ALL_GRADES: readonly Grade[] = [7, 8, 9, 10, 11];

function parseGrade(raw: string): Grade | null {
  const value = Number(raw);
  return (ALL_GRADES as readonly number[]).includes(value)
    ? (value as Grade)
    : null;
}

export const Route = createFileRoute("/grades/$grade")({
  loader: ({ params }) => {
    const grade = parseGrade(params.grade);
    // Unknown grade, or a grade that's been hidden in grades-config.ts —
    // treat both the same way: 404.
    if (grade === null || !VISIBLE_GRADES.includes(grade)) {
      throw notFound();
    }
    return { grade };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [{ title: `${loaderData.grade} клас — лабораторні роботи з фізики` }]
      : [],
  }),
  component: GradePage,
});

function GradePage() {
  const { grade } = Route.useLoaderData();
  const labs = labsByGrade(grade);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-hero px-4 pb-16 pt-20 text-primary-foreground">
        <div className="mx-auto max-w-3xl">
          <Link
            to="/"
            className="text-xs uppercase tracking-[0.35em] text-primary-foreground/70 hover:text-primary-foreground"
          >
            ← Усі класи
          </Link>
          <h1 className="mt-4 text-4xl font-bold leading-[1.1] sm:text-5xl">
            {grade} клас
          </h1>
          <p className="mt-3 text-base text-primary-foreground/80">
            {gradeCaption(grade, labs.length)}
          </p>
        </div>
      </header>

      <main className="mx-auto -mt-10 max-w-3xl px-4 pb-20">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <LabsList labs={labs} />
        </div>
      </main>
    </div>
  );
}
