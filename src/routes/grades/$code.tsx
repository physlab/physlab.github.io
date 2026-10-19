import { createFileRoute, notFound } from "@tanstack/react-router";
import { labsByGrade } from "@/labs/registry";
import { gradeCaption } from "@/labs/grade-labels";
import { GRADE_CODES } from "@/labs/access-codes";
import { LabsList } from "@/components/labs-list";

export const Route = createFileRoute("/grades/$code")({
  loader: ({ params }) => {
    const grade = GRADE_CODES[params.code];
    // Unknown code, or a grade that's been removed from access-codes.ts —
    // both 404, so an old/guessed link reveals nothing either way.
    if (grade === undefined) {
      throw notFound();
    }
    return { grade, labs: labsByGrade(grade) };
  },
  head: ({ loaderData }) => ({
    meta: [
      ...(loaderData
        ? [{ title: `${loaderData.grade} клас — лабораторні роботи з фізики` }]
        : []),
      // Not meant to be crawled/indexed — the whole point is that it's
      // only reachable if you already have the exact link.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: GradePage,
  notFoundComponent: GradeNotFound,
});

function GradePage() {
  const { grade, labs } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-hero px-4 pb-16 pt-20 text-primary-foreground">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold leading-[1.1] sm:text-5xl">
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
      <h1 className="text-2xl font-semibold text-foreground">Сторінку не знайдено</h1>
      <p className="text-muted-foreground">
        Такого посилання не існує.
      </p>
    </div>
  );
}
