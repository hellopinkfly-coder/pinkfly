import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { ArticleCard } from "@/features/knowledge-base/ArticleCard";
import type { KbEntry } from "@/data/knowledge-base";
import { regionPath, type Region } from "@/lib/region";

/**
 * The Knowledge Base, on the homepage.
 *
 * The three most recently published articles, whichever categories they come
 * from — a homepage that showed one piece per category could have its newest
 * article nowhere on it, which is the opposite of what the section is for.
 * Each card still carries its own category's name, and links to it.
 *
 * An editor can override the three in the Studio (Homepage → Events +
 * articles). What they pick wins, in the order they put it in; what they
 * leave empty falls back to the most recent.
 */
export function HomeKnowledge({
  region,
  entries,
  categories,
  featured = [],
}: {
  region: Region;
  entries: KbEntry[];
  /** The categories as the Studio has them: title, and whether it is hidden. */
  categories: { id: string; title: string; hidden: boolean }[];
  /** Slugs chosen in the Studio. Empty means "the most recent three". */
  featured?: string[];
}) {
  const visible = categories.filter((category) => !category.hidden);
  const byId = new Map(visible.map((category) => [category.id, category]));

  // Only articles in a category the Studio still shows: a hidden category's
  // rail is gone from the Knowledge Base, so its articles have no business
  // being the first thing on the homepage.
  const shown = entries.filter((entry) => byId.has(entry.category));

  const chosen = featured
    .map((slug) => shown.find((entry) => entry.slug === slug))
    .filter((entry): entry is KbEntry => Boolean(entry));

  const recent = [...shown]
    .sort(
      (a, b) => (Date.parse(b.publishedAt) || 0) - (Date.parse(a.publishedAt) || 0)
    )
    .slice(0, 3);

  const latest = (chosen.length > 0 ? chosen : recent)
    .map((entry) => ({ category: byId.get(entry.category), entry }))
    .filter(
      (row): row is { category: { id: string; title: string; hidden: boolean }; entry: KbEntry } =>
        Boolean(row.category)
    );

  if (latest.length === 0) return null;

  return (
    <Section
      id="knowledge-base"
      className="border-t border-[var(--pf-border)] bg-[var(--pf-surface)]"
    >
      <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="pf-eyebrow">Knowledge Base</span>
          <h2 className="pf-h2">Written for founders in a hurry.</h2>
          <p className="max-w-2xl text-base text-[var(--pf-text)]">
            Playbooks, the business news that moves your market, and the policy
            changes that affect how you build.
          </p>
        </div>

        <Link
          href={regionPath(region, "/knowledge-base")}
          className="pf-link inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-bold"
        >
          Show all
          <ArrowRight size={15} aria-hidden />
        </Link>
      </Reveal>

      <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {latest.map(({ category, entry }) => (
          <div key={`${entry.category}/${entry.slug}`} className="flex flex-col gap-3">
            <Link
              href={regionPath(region, `/knowledge-base/${category.id}`)}
              className="pf-link inline-flex min-h-9 items-center gap-1.5 text-xs font-bold uppercase tracking-[0.14em]"
            >
              {category.title}
              <ArrowRight size={13} aria-hidden />
            </Link>
            <ArticleCard entry={entry} region={region} layout="grid" />
          </div>
        ))}
      </div>
    </Section>
  );
}
