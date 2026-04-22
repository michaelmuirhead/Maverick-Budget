import { cn } from "@/lib/format";

interface StatProps {
  label: string;
  value: string | number;
  sub?: string;
  tone?: "default" | "good" | "warn" | "bad" | "info";
  className?: string;
}

export function Stat({ label, value, sub, tone = "default", className }: StatProps) {
  const toneClass = {
    default: "text-[color:var(--ink)]",
    good: "status-ok",
    warn: "status-warn",
    bad: "status-bad",
    info: "status-info",
  }[tone];

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <div className="text-[0.68rem] uppercase tracking-[0.12em] text-[color:var(--ink-soft)] font-[family-name:var(--font-display)] leading-none">
        {label}
      </div>
      <div
        className={cn(
          "text-2xl tabular font-[family-name:var(--font-display)] leading-tight",
          toneClass
        )}
      >
        {value}
      </div>
      {sub && (
        <div className="text-xs text-[color:var(--ink-soft)] font-semibold">
          {sub}
        </div>
      )}
    </div>
  );
}
