import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function LabShell({
  number,
  title,
  goal,
  equipment,
  children,
}: {
  number: string;
  title: string;
  goal: ReactNode;
  equipment: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-hero px-4 pb-14 pt-8 text-primary-foreground">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 px-4 py-1.5 text-sm font-medium text-primary-foreground/90 transition hover:bg-primary-foreground/10"
          >
            ← До списку робіт
          </Link>
          <p className="mt-8 font-display text-sm uppercase tracking-[0.2em] text-primary-foreground/70">
            Лабораторна робота {number}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">
            {title}
          </h1>
          <dl className="mt-6 grid gap-3 text-sm text-primary-foreground/90 sm:grid-cols-2">
            <div className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-4">
              <dt className="font-semibold">Мета</dt>
              <dd className="mt-1 leading-relaxed">{goal}</dd>
            </div>
            <div className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-4">
              <dt className="font-semibold">Обладнання</dt>
              <dd className="mt-1 leading-relaxed">{equipment}</dd>
            </div>
          </dl>
        </div>
      </header>

      <main className="mx-auto -mt-8 max-w-4xl space-y-8 px-4 pb-20">
        {children}
      </main>
    </div>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8">
      <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
        {title}
      </h2>
      <div className="space-y-4 text-sm leading-relaxed text-foreground sm:text-base">
        {children}
      </div>
    </section>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border-l-4 border-accent bg-surface px-4 py-3 text-sm italic text-muted-foreground">
      {children}
    </p>
  );
}

export function Figure({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`rounded-xl border-border bg-card ${className ?? "max-w-full"}`}
    />
  );
}

export function Simulation({ src, title }: { src: string; title: string }) {
  return (
    <div className="space-y-2">
      <a
        href={src}
        target="_blank"
        rel="noreferrer"
        className="inline-block break-all text-sm font-medium text-accent underline underline-offset-4"
      >
        {src}
      </a>
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        <iframe
          src={src}
          title={title}
          allowFullScreen
          className="aspect-[4/3] w-full"
          loading="lazy"
        />
      </div>
    </div>
  );
}
