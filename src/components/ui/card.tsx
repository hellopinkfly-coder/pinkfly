import * as React from "react";
import { cn } from "@/lib/utils";

/** Rounded, softly elevated surface. The workhorse container of the site. */
export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[var(--pf-radius-xl)] border border-[var(--pf-border)] bg-[var(--pf-surface)] p-6 shadow-[var(--pf-shadow-sm)] transition-all duration-300 ease-[var(--pf-ease)] sm:p-8",
        className
      )}
      {...props}
    />
  );
}
