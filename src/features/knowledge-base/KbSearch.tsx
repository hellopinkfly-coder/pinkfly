"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "./ArticleCard";
import type { KbEntry } from "@/data/knowledge-base";
import type { Region } from "@/lib/region";

const ANY = "any";

/**
 * Search and filtering across the whole Knowledge Base.
 *
 * The rails below are a good way to browse one category and a poor way to
 * find one article: three horizontal scrollers, and nothing that looks across
 * all of them. This sits above them and searches the lot.
 *
 * Results replace the rails rather than appearing beneath them. Someone who
 * has just searched is looking for their results, not for the browse view
 * they were on a moment ago — leaving both on screen meant the answer sat
 * under three scrollers. Clearing the search puts the rails back.
 *
 * Filtering is immediate, with no Apply button. The Events page stages its
 * filters because it has three selects and a longer list; here the point is
 * to type a word and see what matches as you type.
 */
export function KbSearch({
  entries,
  region,
  categories,
  children,
}: {
  entries: KbEntry[];
  region: Region;
  /** The category list, in the Studio's own order. */
  categories: { id: string; title: string }[];
  /** The browse rails, shown whenever nothing is being searched for. */
  children: React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ANY);
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const trimmed = query.trim();
  const active = trimmed.length > 0 || category !== ANY;

  const results = useMemo(() => {
    if (!active) return [];
    // Match the words in any order, and across the fields a reader would
    // expect: an author's name and the tag are as good a way in as the title.
    const words = trimmed.toLowerCase().split(/\s+/).filter(Boolean);
    const matched = entries.filter((entry) => {
      if (category !== ANY && entry.category !== category) return false;
      if (words.length === 0) return true;
      const haystack = [
        entry.title,
        entry.excerpt,
        entry.tag,
        entry.author.name,
      ]
        .join(" ")
        .toLowerCase();
      return words.every((word) => haystack.includes(word));
    });

    return [...matched].sort((a, b) => {
      const left = Date.parse(a.publishedAt) || 0;
      const right = Date.parse(b.publishedAt) || 0;
      return sort === "newest" ? right - left : left - right;
    });
  }, [entries, trimmed, category, sort, active]);

  function clear() {
    setQuery("");
    setCategory(ANY);
    setSort("newest");
  }

  const categoryTitle = categories.find((c) => c.id === category)?.title;

  return (
    <>
      <Section id="kb-search" className="pb-0 sm:pb-0">
        <div className="rounded-[var(--pf-radius-2xl)] border border-[var(--pf-border)] bg-[var(--pf-surface)] p-5 shadow-[var(--pf-shadow-sm)] sm:p-6">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--pf-heading)]">
            <SlidersHorizontal
              size={16}
              className="text-[var(--pf-accent)]"
              aria-hidden
            />
            Find an article
          </div>

          {/* A form so a phone keyboard offers "search" and Enter does not
              reload the page — the filtering has already happened by then. */}
          <form
            onSubmit={(e) => e.preventDefault()}
            role="search"
            className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] lg:items-end"
          >
            <div className="flex w-full flex-col gap-1.5">
              <label
                htmlFor="kb-search-input"
                className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--pf-muted)]"
              >
                Search
              </label>
              <div className="relative">
                <Search
                  size={16}
                  aria-hidden
                  className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[var(--pf-muted)]"
                />
                <Input
                  id="kb-search-input"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Pricing, hiring, funding…"
                  className="pl-12"
                />
              </div>
            </div>

            <Select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value={ANY}>All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </Select>

            <Select
              label="Sort by"
              value={sort}
              onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </Select>
          </form>
        </div>
      </Section>

      {active ? (
        <Section aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="pf-h2">
              {results.length} {results.length === 1 ? "result" : "results"}
            </h2>
            <Button type="button" variant="secondary" size="sm" onClick={clear}>
              <X size={15} aria-hidden />
              Clear search
            </Button>
          </div>

          <p className="mt-2 text-base text-[var(--pf-text)]">
            {trimmed && categoryTitle
              ? `Matching “${trimmed}” in ${categoryTitle}.`
              : trimmed
                ? `Matching “${trimmed}” across the Knowledge Base.`
                : `Everything in ${categoryTitle}.`}
          </p>

          {results.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((entry) => (
                <ArticleCard
                  key={`${entry.category}/${entry.slug}`}
                  entry={entry}
                  region={region}
                  layout="grid"
                />
              ))}
            </div>
          ) : (
            <p className="mt-8 rounded-[var(--pf-radius-xl)] border border-dashed border-[var(--pf-border-strong)] p-8 text-center text-[var(--pf-text)]">
              Nothing matches that yet. Try a shorter word, or clear the
              category to search everything.
            </p>
          )}
        </Section>
      ) : (
        children
      )}
    </>
  );
}
