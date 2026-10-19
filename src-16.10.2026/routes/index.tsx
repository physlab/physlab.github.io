import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PhysLabs" },
      // Nothing to list here on purpose — see access-codes.ts.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: BlankHome,
});

function BlankHome() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="font-display text-sm uppercase tracking-[0.35em] text-muted-foreground">
        PhysLabs
      </p>
    </div>
  );
}
