"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type FaqGroup = {
  title: string;
  intro: string;
  items: { question: string; answer: string }[];
};

/** A group's anchor, derived from its title so the Studio sets the URL. */
function anchorFor(title: string) {
  return (
    "faq-" +
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

/**
 * The FAQs, grouped, with shortcuts and a search.
 *
 * Every answer is on one page rather than behind a category filter: a reader
 * who does not know which section their question belongs to can still find it
 * by scrolling, and the browser's own Find works across the lot.
 *
 * Searching narrows the sections in place rather than flattening them into a
 * single list, so an answer keeps the context of what it is about. A section
 * with nothing matching disappears, and so do its shortcut and its heading.
 *
 * The accordion is native `<details>`: closed until opened, open on the
 * browser's own Find, keyboard-operable, and working before any JavaScript
 * loads. While a search is running the matches are opened, because a list of
 * closed questions is not an answer.
 */
export function FaqSearch({ groups }: { groups: FaqGroup[] }) {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();
  const searching = trimmed.length > 0;

  const filtered = useMemo(() => {
    if (!searching) return groups;
    const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          const haystack = `${item.question} ${item.answer}`.toLowerCase();
          return words.every((word) => haystack.includes(word));
        }),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, trimmed, searching]);

  const total = filtered.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <>
      <Section id="faq-search" className="pb-0 sm:pb-0">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={(e) => e.preventDefault()} role="search">
            <label htmlFor="faq-search-input" className="sr-only">
              Search the FAQs
            </label>
            <div className="relative">
              <Search
                size={17}
                aria-hidden
                className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[var(--pf-muted)]"
              />
              <Input
                id="faq-search-input"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search — cost, mentors, events, privacy…"
                className="h-14 pl-12 text-base"
              />
            </div>
          </form>

          {/* Shortcuts, not a filter: they jump down the page, and the page
              still holds every answer. Hidden while searching, when the
              sections they point at are being added and removed. */}
          {!searching && groups.length > 1 && (
            <nav aria-label="FAQ sections" className="mt-5">
              <ul className="flex flex-wrap gap-2">
                {groups.map((group) => (
                  <li key={group.title}>
                    <a
                      href={`#${anchorFor(group.title)}`}
                      className="inline-flex min-h-10 items-center rounded-full border border-[var(--pf-border-strong)] px-4 text-sm text-[var(--pf-text)] transition-colors hover:border-[var(--pf-accent)] hover:text-[var(--pf-accent)]"
                    >
                      {group.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          {searching && (
            <p className="mt-4 text-sm text-[var(--pf-muted)]" aria-live="polite">
              {total} {total === 1 ? "answer" : "answers"} matching “{trimmed}”.
            </p>
          )}
        </div>
      </Section>

      {filtered.length === 0 ? (
        <Section>
          <p className="mx-auto max-w-3xl rounded-[var(--pf-radius-xl)] border border-dashed border-[var(--pf-border-strong)] p-8 text-center text-[var(--pf-text)]">
            Nothing matches that. Try a single word — “price”, “mentor”,
            “online” — or clear the search to read everything.
          </p>
        </Section>
      ) : (
        filtered.map((group, i) => (
          <Section
            key={group.title}
            id={anchorFor(group.title)}
            className={cn(
              "border-t border-[var(--pf-border)]",
              i % 2 === 1 && "bg-[var(--pf-surface)]"
            )}
          >
            <div className="mx-auto max-w-3xl">
              <h2 className="pf-h2">{group.title}</h2>
              {group.intro && (
                <p className="mt-2 text-base text-[var(--pf-text)]">
                  {group.intro}
                </p>
              )}

              <div className="mt-7 divide-y divide-[var(--pf-border)] border-y border-[var(--pf-border)]">
                {group.items.map((item) => (
                  <details
                    key={item.question}
                    className="group py-5"
                    open={searching}
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-bold text-[var(--pf-heading)] transition-colors hover:text-[var(--pf-accent)]">
                      {item.question}
                      <span
                        aria-hidden
                        className="shrink-0 text-xl leading-none text-[var(--pf-accent)] transition-transform duration-300 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--pf-text)]">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </Section>
        ))
      )}
    </>
  );
}
