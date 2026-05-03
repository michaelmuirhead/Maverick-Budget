import { forwardRef, type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, hint, id, className = "", ...rest },
  ref,
) {
  const inputId = id ?? `input-${rest.name ?? Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <label htmlFor={inputId} className="text-xs font-medium text-white/70">
          {label}
        </label>
      ) : null}
      <input
        {...rest}
        id={inputId}
        ref={ref}
        className={[
          "min-h-[44px] rounded-xl bg-white/5 px-4 py-3 text-base text-white",
          "ring-1 ring-inset ring-white/10 placeholder:text-white/30",
          "focus:outline-none focus:ring-2 focus:ring-brand-400/60",
          error ? "ring-red-500/60" : "",
          className,
        ].join(" ")}
      />
      {error ? (
        <p className="text-xs text-red-400">{error}</p>
      ) : hint ? (
        <p className="text-xs text-white/40">{hint}</p>
      ) : null}
    </div>
  );
});
