import { createFileRoute, notFound, Link } from "@tanstack/react-router";
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
    // Unknown grade, or a grade hidden in grades-config.ts — both 404.
    if (grade === null || !VISIBLE_GRADES.includes(grade)) {
      throw notFound();
    }
    return { grade, labs: labsByGrade(grade) };
  },
  head: ({ loaderData }) =>
    loaderData
      ? { meta: [{ title: `${loaderData.grade} клас — лабораторні роботи з фізики` }] }
      : {},
  component: GradePage,
  notFoundComponent: GradeNotFound,
});

function GradePage() {
  const { grade, labs } = Route.useLoaderData();

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

function GradeNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Клас не знайдено</h1>
      <p className="text-muted-foreground">
        Такого класу немає, або його роботи ще не додані на сайт.
      </p>
      <Link
        to="/"
        className="rounded-full bg-gradient-accent px-6 py-2.5 font-medium text-accent-foreground"
      >
        ← До списку класів
      </Link>
    </div>
  );
}
