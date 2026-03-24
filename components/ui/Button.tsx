"use client";
import React from "react";
import { cn } from "../../lib/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  block?: boolean;
};

const baseStyles =
  "inline-flex items-center justify-center rounded-lg font-medium focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer";

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "text-white bg-[color:var(--color-primary-600)] hover:bg-[color:var(--color-primary-700)] shadow-sm hover:shadow-md",
  secondary:
    "text-[color:var(--foreground)] border border-[color:var(--color-neutral-200)] bg-white hover:bg-[color:var(--color-neutral-50)] shadow-xs active:bg-[color:var(--color-neutral-100)]",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export default function Button({
  className,
  variant = "primary",
  size = "md",
  block,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        block && "w-full",
        className
      )}
      {...props}
    />
  );
}


