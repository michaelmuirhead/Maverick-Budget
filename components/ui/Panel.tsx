import { cn } from "@/lib/format";

interface PanelProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
}

export function Panel({ title, children, className, headerRight }: PanelProps) {
  return (
    <div className={cn("panel", className)}>
      {title && (
        <div className="panel-header flex items-baseline justify-between gap-2">
          <span>{title}</span>
          {headerRight && <span className="text-xs">{headerRight}</span>}
        </div>
      )}
      {children}
    </div>
  );
}
