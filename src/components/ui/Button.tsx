import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-white hover:bg-brand-400 active:bg-brand-600 disabled:bg-brand-500/40",
  secondary:
    "bg-white/10 text-white hover:bg-white/15 active:bg-white/20 disabled:bg-white/5 disabled:text-white/40",
  ghost:
    "bg-transparent text-white/80 hover:bg-white/5 active:bg-white/10 disabled:text-white/30",
  danger:
    "bg-red-500 text-white hover:bg-red-400 active:bg-red-600 disabled:bg-red-500/40",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  leadingIcon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  loading = false,
  leadingIcon,
  fullWidth = false,
  className = "",
  disabled,
  children,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
        "min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60",
        "disabled:cursor-not-allowed",
        fullWidth ? "w-full" : "",
        VARIANT_CLASSES[variant],
        className,
      ].join(" ")}
    >
      {loading ? <Spinner /> : leadingIcon}
      <span>{children}</span>
    </button>
  );
}

function Spinner() {
  return (
    <svg
      className="size-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path
        d="M22 12a10 10 0 0 1-10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
