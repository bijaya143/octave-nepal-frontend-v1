"use client";
import React from "react";
import { cn } from "../../lib/cn";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  panelClassName?: string;
  contentClassName?: string;
};

export default function Modal({ open, onClose, title, children, panelClassName, contentClassName }: ModalProps) {
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6">
        <div className={cn("w-full max-w-md sm:max-w-lg md:max-w-xl rounded-none sm:rounded-xl bg-white shadow-lg border border-[color:var(--color-neutral-200)] animate-in fade-in slide-in-from-bottom-2 relative overflow-hidden flex flex-col max-h-[85vh]", panelClassName)} role="dialog" aria-modal="true">
          {title && (
            <div className="px-6 pt-5 pr-14 text-base font-semibold" style={{ fontFamily: "var(--font-heading-sans)" }}>{title}</div>
          )}
          <button
            aria-label="Close"
            title="Close"
            onClick={onClose}
            className="absolute top-3.5 right-3.5 inline-flex h-9 w-9 items-center justify-center rounded-md text-[color:var(--color-neutral-700)] hover:bg-[color:var(--color-neutral-100)] focus-visible:outline-none"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div className={cn("px-6 py-5 overflow-y-auto scroll-elegant", contentClassName)}>{children}</div>
        </div>
      </div>
    </div>
  );
}


