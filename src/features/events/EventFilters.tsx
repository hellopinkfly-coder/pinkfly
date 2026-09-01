"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarX2, SlidersHorizontal } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { EventCard } from "./EventCard";
import type { PinkflyEvent } from "@/data/events";
import { formatMonthKey } from "@/lib/date";
import type { Region } from "@/lib/region";

const ANY = "any";

type Filters = { city: string; month: string; type: string };
const EMPTY: Filters = { city: ANY, month: ANY, type: ANY };

/**
 * Events filtering.
 *
 * Selections are staged locally and only take effect when "Apply filters" is
 * pressed — the results below update in place and the visitor is never
 * navigated away from the page. Paging is client-side for the same reason.
 */
export function EventFilters({
  events,
  region,
  cities,
  months,
  types,
  emptyState,
  perPage = 6,
}: {
  events: PinkflyEvent[];
  region: Region;
  cities: string[];
  months: string[];
  types: string[];
  /** Shown when no event matches the filters. Edited in Sanity. */
  emptyState: string;
  perPage?: number;
}) {
  const [draft, setDraft] = useState<Filters>(EMPTY);
  const [applied, setApplied] = useState<Filters>(EMPTY);
  const [page, setPage] = useState(1);

  const results = useMemo(
    () =>
      events.filter(
        (e) =>
          (applied.city === ANY || e.city === applied.city) &&
          (applied.month === ANY || e.startsAt.startsWith(applied.month)) &&
          (applied.type === ANY || e.type === applied.type)
      ),
    [events, applied]
  );

  const pageCount = Math.max(1, Math.ceil(results.length / perPage));
  const current = Math.min(page, pageCount);
  const visible = results.slice((current - 1) * perPage, current * perPage);
  const isFiltered = JSON.stringify(applied) !== JSON.stringify(EMPTY);

  function apply(e: React.FormEvent) {
    e.preventDefault();
    setApplied(draft);
    setPage(1);
  }

  function reset() {
    setDraft(EMPTY);
    setApplied(EMPTY);
    setPage(1);
  }

  return (
    <Section id="events-list">
      <form
        onSubmit={apply}
        className="rounded-[var(--pf-radius-2xl)] border border-[var(--pf-border)] bg-[var(--pf-surface)] p-6 shadow-[var(--pf-shadow-sm)] sm:p-8"
      >
        <div className="flex items-center gap-2 text-sm font-bold text-[var(--pf-heading)]">
          <SlidersHorizontal size={16} className="text-[var(--pf-accent)]" aria-hidden />
          Find an event
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end">
          <Select
            label="Location"
            value={draft.city}
            onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))}
          >
            <option value={ANY}>All locations</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>

          <Select
            label="Month"
            value={draft.month}
            onChange={(e) => setDraft((d) => ({ ...d, month: e.target.value }))}
          >
            <option value={ANY}>All months</option>
            {months.map((month) => (
              <option key={month} value={month}>
                {formatMonthKey(month, region.locale)}
              </option>
            ))}
          </Select>

          <Select
            label="Event type"
            value={draft.type}
            onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))}
          >
            <option value={ANY}>All types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>

          <div className="flex gap-2">
            <Button type="submit" size="md" className="h-12 flex-1 lg:flex-none">
              Apply filters
            </Button>
            {isFiltered && (
              <Button
                type="button"
                variant="secondary"
                size="md"
                className="h-12"
                onClick={reset}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      </form>

      <p className="mt-8 text-sm text-[var(--pf-muted)]" role="status" aria-live="polite">
        {results.length === 0
          ? "No events match these filters."
          : `Showing ${visible.length} of ${results.length} event${results.length === 1 ? "" : "s"}`}
      </p>

      <AnimatePresence mode="wait">
        {results.length > 0 ? (
          <motion.ul
            key={`${JSON.stringify(applied)}-${current}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {visible.map((event) => (
              <li key={event.slug}>
                <EventCard event={event} region={region} />
              </li>
            ))}
          </motion.ul>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 flex flex-col items-center gap-4 rounded-[var(--pf-radius-2xl)] border border-dashed border-[var(--pf-border-strong)] px-6 py-16 text-center"
          >
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]">
              <CalendarX2 size={24} />
            </span>
            <h3 className="text-lg">{emptyState}</h3>
            <p className="max-w-md text-sm leading-relaxed text-[var(--pf-text)]">
              Try a wider month range or a different location — or join the
              community and we&apos;ll tell you the moment something is announced
              near you.
            </p>
            <Button type="button" variant="secondary" onClick={reset}>
              Clear filters
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {pageCount > 1 && (
        <nav
          aria-label="Event pages"
          className="mt-12 flex justify-center gap-2"
        >
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              aria-current={n === current ? "page" : undefined}
              className={
                n === current
                  ? "inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--pf-accent)] text-sm font-bold text-white"
                  : "inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--pf-border-strong)] text-sm text-[var(--pf-heading)] transition-all hover:border-[var(--pf-accent)] hover:text-[var(--pf-accent)]"
              }
            >
              {n}
            </button>
          ))}
        </nav>
      )}
    </Section>
  );
}
