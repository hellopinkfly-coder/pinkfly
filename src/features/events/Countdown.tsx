"use client";

import { useEffect, useState } from "react";

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

function remainingFrom(target: number): Remaining | null {
  const diff = target - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

/**
 * "Time left" counter for an event.
 *
 * Starts empty and fills in after mount so the server and client markup
 * always agree — a live clock cannot be server-rendered without a hydration
 * mismatch. Once the event has started it swaps to a short status line.
 */
export function Countdown({ startsAt }: { startsAt: string }) {
  const target = new Date(startsAt).getTime();
  const [remaining, setRemaining] = useState<Remaining | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRemaining(remainingFrom(target));
    const id = setInterval(() => setRemaining(remainingFrom(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (mounted && !remaining) {
    return (
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--pf-accent)]">
        This event has started
      </p>
    );
  }

  const units = [
    { label: "Days", value: remaining?.days },
    { label: "Hours", value: remaining?.hours },
    { label: "Minutes", value: remaining?.minutes },
    { label: "Seconds", value: remaining?.seconds },
  ];

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--pf-muted)]">
        Time left
      </p>
      <ul className="mt-4 flex gap-3" aria-label="Time remaining until this event">
        {units.map((unit) => (
          <li
            key={unit.label}
            className="flex min-w-[68px] flex-col items-center gap-1 rounded-[var(--pf-radius-lg)] border border-[var(--pf-border)] bg-[var(--pf-surface)] px-3 py-3.5 shadow-[var(--pf-shadow-sm)] sm:min-w-[78px]"
          >
            <span
              className="font-[family-name:var(--font-display)] text-2xl font-bold tabular-nums text-[var(--pf-heading)] sm:text-3xl"
              suppressHydrationWarning
            >
              {unit.value === undefined ? "—" : String(unit.value).padStart(2, "0")}
            </span>
            <span className="text-[0.62rem] font-bold uppercase tracking-[0.14em] text-[var(--pf-muted)]">
              {unit.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
