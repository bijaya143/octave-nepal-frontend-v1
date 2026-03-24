"use client";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type Crumb = {
  label: string;
  href?: string;
};

type BreadcrumbProps = {
  items: Crumb[];
  className?: string;
  separatorIcon?: React.ReactNode;
};

export default function Breadcrumb({ items, className, separatorIcon }: BreadcrumbProps) {
  const Separator = () => (
    <span aria-hidden="true" className="inline-flex items-center text-[color:var(--color-neutral-400)]">
      {separatorIcon ?? (
        <span className="text-[color:var(--color-primary-400)]">•</span>
      )}
    </span>
  );

  return (
    <nav aria-label="Breadcrumb" className={cn("", className)}>
      <ol className="flex items-center gap-2 text-xs sm:text-sm text-[color:var(--color-neutral-600)]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={`${item.label}-${index}`}>
              <li className={cn(!isLast && "hover:text-[color:var(--color-neutral-800)]")}
                  aria-current={isLast ? "page" : undefined}>
                {item.href && !isLast ? (
                  <Link href={item.href} className="inline-flex items-center gap-1 text-[color:var(--color-primary-700)] hover:underline underline-offset-2">
                    {item.label}
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[color:var(--color-neutral-800)] font-medium">{item.label}</span>
                )}
              </li>
              {!isLast && (
                <li aria-hidden="true" className="inline-flex items-center">
                  <Separator />
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}


