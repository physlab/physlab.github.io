import { createFileRoute, notFound } from "@tanstack/react-router";
import { HOME_CODE } from "@/labs/access-codes";
import { HomeContent } from "@/components/home/home-content";

export const Route = createFileRoute("/$code")({
  loader: ({ params }) => {
    if (params.code !== HOME_CODE) {
      throw notFound();
    }
  },
  head: () => ({
    meta: [
      { title: "PhysLabs — лабораторні роботи з фізики онлайн" },
      {
        name: "description",
        content:
          "Інтерактивні лабораторні роботи з фізики для 7–11 класів: вимірювання, розрахунки й онлайн-звіт учителю.",
      },
      // Same reasoning as /grades/$code — this link is meant to be shared
      // directly, not discovered through search.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: HomeContent,
  notFoundComponent: CodeNotFound,
});

function CodeNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold text-foreground">Сторінку не знайдено</h1>
      <p className="text-muted-foreground">Такого посилання не існує.</p>
    </div>
  );
}
