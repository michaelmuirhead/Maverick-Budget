import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Optional footer rendered fixed at the bottom of the sheet. */
  footer?: ReactNode;
}

/**
 * Bottom-sheet modal. Full-height on phones, centered card on wider screens.
 * Locks body scroll while open. Closes on backdrop click or Escape.
 */
export function Sheet({ open, onClose, title, children, footer }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative flex max-h-[92dvh] w-full max-w-md flex-col rounded-t-3xl bg-ink-950 ring-1 ring-white/10 shadow-2xl sm:max-h-[80dvh] sm:rounded-3xl safe-bottom"
      >
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 className="text-base font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 rounded-full p-2 text-white/60 hover:bg-white/5 hover:text-white"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer ? (
          <footer className="border-t border-white/10 px-5 py-3">{footer}</footer>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
