import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function PlaceholderScreen({ title, subtitle, children }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 pt-12">
      <header className="safe-top">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-white/60">{subtitle}</p>
        ) : null}
      </header>

      {children ? (
        <div className="flex flex-col gap-4">{children}</div>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-sm text-white/40">
          Coming in the next phase.
        </div>
      )}
    </div>
  );
}
