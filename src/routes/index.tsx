import { createFileRoute } from "@tanstack/react-router";
import { HomeContent } from "@/components/home/home-content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PhysLabs — лабораторні роботи з фізики онлайн" },
      {
        name: "description",
        content:
          "Інтерактивні лабораторні роботи з фізики для 9, 10 та 11 класів: вимірювання, розрахунки й онлайн-звіт учителю.",
      },
      {
        property: "og:title",
        content: "PhysLabs — лабораторні роботи з фізики онлайн",
      },
      {
        property: "og:description",
        content:
          "Оберіть клас і виконайте лабораторну роботу з фізики просто у браузері.",
      },
    ],
  }),
  component: HomeContent,
});
