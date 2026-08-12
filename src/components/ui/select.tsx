import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  /** Visually hide the label but keep it for screen readers. */
  hideLabel?: boolean;
};

/** Styled native select — keeps the mobile picker, loses the default chrome. */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ className, label, hideLabel, id, children, ...props }, ref) {
    const reactId = React.useId();
    const selectId = id ?? reactId;

    return (
      <div className="flex w-full flex-col gap-1.5">
        <label
          htmlFor={selectId}
          className={cn(
            "text-xs font-bold uppercase tracking-[0.14em] text-[var(--pf-muted)]",
            hideLabel && "sr-only"
          )}
        >
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "h-12 w-full cursor-pointer appearance-none rounded-full border border-[var(--pf-border-strong)] bg-[var(--pf-surface)] pl-5 pr-11 text-sm text-[var(--pf-heading)] transition-colors duration-200 focus:border-[var(--pf-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--pf-accent)]/20",
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown
            size={16}
            aria-hidden
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[var(--pf-muted)]"
          />
        </div>
      </div>
    );
  }
);
