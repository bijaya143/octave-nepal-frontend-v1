import React from "react";
import { cn } from "../../lib/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string | null;
  label?: string;
  hint?: string;
};

export default function Input({ className, error, label, hint, id, ...props }: InputProps) {
  const inputId = id || React.useId();
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[color:var(--foreground)]">
          {label}
          {props.required && <span className="ml-1 text-red-600" aria-hidden>*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "h-11 px-4 rounded-lg bg-white border text-[color:var(--foreground)] placeholder:text-[color:var(--color-neutral-400)]",
          "border-[color:var(--color-neutral-200)] focus:border-[color:var(--color-primary-400)]",
          "shadow-xs focus:shadow-sm transition-all",
          error && "border-red-400 focus:border-red-500 focus:shadow-sm"
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-[color:var(--color-neutral-500)]">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}


