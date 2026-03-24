import React from "react";
import { cn } from "../../lib/cn";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  error?: string | null;
  label?: string;
  hint?: string;
  required?: boolean;
};

export default function Select({ className, error, label, hint, id, required, children, ...props }: SelectProps) {
  const selectId = id || React.useId();
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-[color:var(--foreground)]">
          {label}
          {required && <span className="ml-1 text-red-600" aria-hidden>*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            "h-11 w-full appearance-none rounded-lg bg-white border pr-9 px-3 text-[color:var(--foreground)]",
            "border-[color:var(--color-neutral-200)] focus:border-[color:var(--color-primary-400)]",
            "shadow-xs focus:shadow-sm transition-all",
            "placeholder:text-[color:var(--color-neutral-400)]",
            error && "border-red-400 focus:border-red-500 focus:shadow-sm",
            className
          )}
          {...props}
        >
          {children}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[color:var(--color-neutral-500)]"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </div>
      {hint && !error && <p className="text-xs text-[color:var(--color-neutral-500)]">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}


