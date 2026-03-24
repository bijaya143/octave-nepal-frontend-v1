import React from "react";
import { cn } from "../../lib/cn";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "outline";
};

export default function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variant === "default" && "bg-[color:var(--color-primary-100)] text-[color:var(--color-primary-800)]",
        variant === "outline" && "bg-white text-[color:var(--color-primary-700)] border border-[color:var(--color-primary-200)]",
        className
      )}
      {...props}
    />
  );
}


