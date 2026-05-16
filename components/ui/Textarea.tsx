"use client";
import React from "react";
import { cn } from "../../lib/cn";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string | null;
  label?: string;
  hint?: string;
};

export default function Textarea({
  className,
  error,
  label,
  hint,
  id,
  rows = 5,
  required,
  ...props
}: TextareaProps) {
  const textareaId = id || React.useId();
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-medium text-[color:var(--foreground)]"
        >
          {label}
          {required && (
            <span className="ml-1 text-red-600" aria-hidden>
              *
            </span>
          )}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        aria-required={required}
        className={cn(
          "w-full rounded-lg bg-white border px-4 py-3 text-[color:var(--foreground)] placeholder:text-[color:var(--color-neutral-400)]",
          "border-[color:var(--color-neutral-200)] focus:border-[color:var(--color-primary-400)]",
          "shadow-xs focus:shadow-sm transition-all resize-y min-h-[120px]",
          error && "border-red-400 focus:border-red-500 focus:shadow-sm",
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-[color:var(--color-neutral-500)]">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}


