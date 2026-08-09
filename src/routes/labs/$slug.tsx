import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getLab } from "@/labs/registry";
import { isAvailable } from "@/labs/types";
import { LabShell } from "@/components/lab/lab-shell";

export const Route = createFileRoute("/labs/$slug")({
  loader: ({ params }) => {
    const lab = getLab(params.slug);
    if (!lab || !isAvailable(lab)) {
      throw notFound();
    }
    return lab;
  },
  head: ({ loaderData }) =>
    loaderData?.meta
      ? {
          meta: [
            { title: loaderData.meta.title },
            { name: "description", content: loaderData.meta.description },
            { property: "og:title", content: loaderData.meta.title },
            {
              property: "og:description",
              content: loaderData.meta.description,
            },
          ],
        }
      : {},
  component: LabPage,
  notFoundComponent: LabNotFound,
});

function LabPage() {
  const lab = Route.useLoaderData();
  const Content = lab.Content;
  return (
    <LabShell
      number={lab.number}
      title={lab.title}
      goal={lab.goal}
      equipment={lab.equipment}
    >
      <Content />
    </LabShell>
  );
}

function LabNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold text-foreground">
        Лабораторну роботу не знайдено
      </h1>
      <p className="text-muted-foreground">
        Можливо, її ще не перенесено в онлайн-формат, або посилання застаріле.
      </p>
      <Link
        to="/"
        className="rounded-full bg-gradient-accent px-6 py-2.5 font-medium text-accent-foreground"
      >
        ← До списку робіт
      </Link>
    </div>
  );
}
