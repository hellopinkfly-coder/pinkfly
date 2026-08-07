import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, type = "text", ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-12 w-full rounded-full border border-[var(--pf-border-strong)] bg-[var(--pf-surface)] px-5 text-[var(--pf-heading)] placeholder:text-[var(--pf-muted)] transition-colors duration-200 focus:border-[var(--pf-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--pf-accent)]/20",
        className
      )}
      {...props}
    />
  );
});
