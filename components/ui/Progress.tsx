import { cn } from "@/lib/format";

interface ProgressProps {
  value: number;         // 0-100
  max?: number;
  tone?: "default" | "good" | "warn" | "bad";
  showLabel?: boolean;
  className?: string;
}

export function Progress({ value, max = 100, tone = "default", showLabel, className }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const toneColor = {
    default: "var(--pink)",
    good: "var(--teal)",
    warn: "var(--mustard)",
    bad: "var(--pink-deep)",
  }[tone];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className="flex-1 h-4 border-[2.5px] border-[color:var(--ink)] bg-[color:var(--cream-2)] rounded-full relative overflow-hidden"
        style={{ boxShadow: "2px 2px 0 var(--ink)" }}
      >
        <div
          className="absolute inset-y-0 left-0 transition-all duration-300 rounded-full"
          style={{
            width: `${pct}%`,
            background: toneColor,
          }}
        />
      </div>
      {showLabel && (
        <div className="text-xs tabular font-[family-name:var(--font-display)] text-[color:var(--ink)] w-10 text-right">
          {Math.round(pct)}%
        </div>
      )}
    </div>
  );
}
