"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Globe } from "lucide-react";
import { regionList } from "@/config/regions";
import { regionPath, type Region } from "@/lib/region";
import { cn } from "@/lib/utils";

type RegionSelectorProps = {
  /** The region currently being viewed. */
  current: Region;
  /** Path within the region, e.g. `/events` — preserved across the switch. */
  rest: string;
  className?: string;
  /** Full-width list styling for the mobile menu. */
  variant?: "menu" | "inline";
};

/**
 * Region switcher.
 *
 * Switching navigates to the same page inside the chosen region, so the URL,
 * copy, address, phone, currency, events and form config all update together.
 * Selection is explicit — there is no IP-based redirect anywhere on the site.
 */
export function RegionSelector({
  current,
  rest,
  className,
  variant = "menu",
}: RegionSelectorProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (!wrapper.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function select(region: Region) {
    setOpen(false);
    router.push(regionPath(region, rest));
  }

  if (variant === "inline") {
    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <span className="px-4 pb-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--pf-muted)]">
          Region
        </span>
        {regionList.map((region) => (
          <button
            key={region.slug}
            type="button"
            onClick={() => select(region)}
            className={cn(
              "flex items-center justify-between rounded-xl px-4 py-2.5 text-left text-sm transition-colors",
              region.slug === current.slug
                ? "bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]"
                : "text-[var(--pf-heading)] hover:bg-[var(--pf-surface-muted)]"
            )}
          >
            {region.name}
            {region.slug === current.slug && <Check size={16} />}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={wrapper} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Region: ${current.name}. Change region`}
        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-[var(--pf-border-strong)] px-3.5 text-sm text-[var(--pf-heading)] transition-all duration-200 hover:border-[var(--pf-accent)] hover:text-[var(--pf-accent)]"
      >
        <Globe size={15} aria-hidden />
        <span className="hidden sm:inline">{current.shortName}</span>
        <ChevronDown
          size={14}
          aria-hidden
          className={cn("transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Select a region"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="pf-glass absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-[var(--pf-radius-lg)] p-1.5 shadow-[var(--pf-shadow-md)]"
          >
            {regionList.map((region) => {
              const active = region.slug === current.slug;
              return (
                <li key={region.slug}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => select(region)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                      active
                        ? "bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]"
                        : "text-[var(--pf-heading)] hover:bg-[var(--pf-surface-muted)]"
                    )}
                  >
                    <span>{region.name}</span>
                    {active && <Check size={15} aria-hidden />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
