import React from "react";
import { cn } from "../../lib/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
};

export default function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "surface rounded-xl border border-[color:var(--color-neutral-200)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 pt-5", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 pb-5", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 pb-5 pt-3", className)} {...props} />;
}

