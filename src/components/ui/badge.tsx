import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "accent" | "neutral" | "outline";
};

/** Small metadata pill — event type, policy status, article category. */
export function Badge({ className, variant = "accent", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.12em]",
        variant === "accent" &&
          "bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]",
        variant === "neutral" &&
          "bg-[var(--pf-surface-muted)] text-[var(--pf-text)]",
        variant === "outline" &&
          "border border-[var(--pf-border-strong)] text-[var(--pf-text)]",
        className
      )}
      {...props}
    />
  );
}
