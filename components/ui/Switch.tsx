import React from "react";
import { cn } from "../../lib/cn";

type SwitchProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string;
  hint?: string;
  error?: string | null;
};

export default function Switch({ className, label, hint, error, id, ...props }: SwitchProps) {
  const switchId = id || React.useId();

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <div className="flex flex-col gap-1 flex-1">
        {label && (
          <label htmlFor={switchId} className="text-sm font-medium text-[color:var(--foreground)] cursor-pointer">
            {label}
          </label>
        )}
        {hint && !error && <p className="text-xs text-[color:var(--color-neutral-500)]">{hint}</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={props.checked}
        onClick={() => props.onChange?.({ target: { checked: !props.checked } } as any)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[color:var(--color-primary-400)] focus:ring-offset-2",
          props.checked ? "bg-[color:var(--color-primary-600)]" : "bg-[color:var(--color-neutral-200)]",
          props.disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            props.checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
      <input
        type="checkbox"
        id={switchId}
        className="sr-only"
        {...props}
      />
    </div>
  );
}
