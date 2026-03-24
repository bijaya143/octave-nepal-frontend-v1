"use client";
import React from "react";
import { cn } from "../../lib/cn";
import { Eye, EyeOff } from "lucide-react";

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string | null;
  label?: string;
  hint?: string;
};

export default function PasswordInput({ className, error, label, hint, id, ...props }: PasswordInputProps) {
  const inputId = id || React.useId();
  const [visible, setVisible] = React.useState(false);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[color:var(--foreground)]">
          {label}
          {props.required && <span className="ml-1 text-red-600" aria-hidden>*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          {...props}
          type={visible ? "text" : "password"}
          className={cn(
            "h-11 w-full px-4 pr-11 rounded-lg bg-white border text-[color:var(--foreground)] placeholder:text-[color:var(--color-neutral-400)]",
            "border-[color:var(--color-neutral-200)] focus:border-[color:var(--color-primary-400)]",
            "shadow-xs focus:shadow-sm transition-all",
            error && "border-red-400 focus:border-red-500 focus:shadow-sm"
          )}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[color:var(--color-neutral-500)] hover:text-[color:var(--color-neutral-700)]"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((v) => !v)}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {hint && !error && <p className="text-xs text-[color:var(--color-neutral-500)]">{hint}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}


