"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type RailProps = {
  children: React.ReactNode;
  /** Accessible name for the scroll region. */
  label: string;
  className?: string;
};

/**
 * Smooth, snap-aligned horizontal scroller with arrow controls.
 *
 * Used by every Knowledge Base category and the upcoming-events rail. On
 * touch devices the arrows hide and native momentum scrolling takes over;
 * the rail keeps keyboard access via the arrow buttons and tab order.
 */
export function Rail({ children, label, className }: RailProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= max - 2);
  }, []);

  useEffect(() => {
    sync();
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, [sync]);

  function scrollBy(direction: 1 | -1) {
    const el = ref.current;
    if (!el) return;
    // Advance by roughly one card, derived from the first child's width.
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: step * direction, behavior: "smooth" });
  }

  const canScroll = !(atStart && atEnd);

  return (
    <div className={cn("relative", className)}>
      <div
        ref={ref}
        onScroll={sync}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="pf-rail -mx-6 px-6 sm:-mx-8 sm:px-8 lg:mx-0 lg:px-0"
      >
        {children}
        {/* Trailing spacer so the last card clears the gutter on mobile. */}
        <span aria-hidden className="w-2 shrink-0 lg:hidden" />
      </div>

      {canScroll && (
        <div className="mt-6 hidden justify-end gap-2 lg:flex">
          <RailButton
            direction="left"
            disabled={atStart}
            onClick={() => scrollBy(-1)}
          />
          <RailButton
            direction="right"
            disabled={atEnd}
            onClick={() => scrollBy(1)}
          />
        </div>
      )}
    </div>
  );
}

function RailButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Scroll left" : "Scroll right"}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-300 ease-[var(--pf-ease)]",
        disabled
          ? "cursor-not-allowed border-[var(--pf-border)] text-[var(--pf-muted)] opacity-40"
          : "border-[var(--pf-border-strong)] text-[var(--pf-heading)] hover:-translate-y-0.5 hover:border-[var(--pf-accent)] hover:text-[var(--pf-accent)] hover:shadow-[var(--pf-shadow-sm)]"
      )}
    >
      <Icon size={18} />
    </button>
  );
}
