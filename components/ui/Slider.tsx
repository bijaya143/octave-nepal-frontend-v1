import React from "react";
import { cn } from "../../lib/cn";

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: React.ReactNode;
  value: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => React.ReactNode;
  minLabel?: React.ReactNode;
  maxLabel?: React.ReactNode;
}

export default function Slider({
  label,
  value,
  onChange,
  formatValue,
  minLabel,
  maxLabel,
  className,
  ...props
}: SliderProps) {
  const displayValue = formatValue ? formatValue(value) : value;

  const min = Number(props.min || 0);
  const max = Number(props.max || 100);
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div className={cn("space-y-3", className)}>
      {(label || displayValue !== undefined) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-sm font-medium text-[color:var(--foreground)]">
              {label}
            </label>
          )}
          {displayValue !== undefined && (
            <span className="text-sm font-semibold text-[color:var(--color-primary-600)]">
              {displayValue}
            </span>
          )}
        </div>
      )}
      <input
        type="range"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[color:var(--color-primary-600)]"
        style={{
          background: `linear-gradient(to right, var(--color-primary-600) 0%, var(--color-primary-600) ${percentage}%, var(--color-neutral-200) ${percentage}%, var(--color-neutral-200) 100%)`
        }}
        {...props}
      />
      {(minLabel || maxLabel) && (
        <div className="flex justify-between text-xs text-[color:var(--color-neutral-500)]">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      )}
    </div>
  );
}
