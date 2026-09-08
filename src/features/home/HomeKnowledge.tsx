import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { ArticleCard } from "@/features/knowledge-base/ArticleCard";
import { entriesByCategory, type KbCategory, type KbEntry } from "@/data/knowledge-base";
import { regionPath, type Region } from "@/lib/region";

/**
 * The Knowledge Base, on the homepage.
 *
 * The most recent piece from each of the three categories rather than the
 * three most recent overall — otherwise a busy week in one category fills the
 * row and the other two look empty. Each card carries its own category's name
 * so the three read as a spread of what is written here.
 */
export function HomeKnowledge({
  region,
  entries,
  categories,
}: {
  region: Region;
  entries: KbEntry[];
  /** The categories as the Studio has them: title, and whether it is hidden. */
  categories: { id: string; title: string; hidden: boolean }[];
}) {
  const latest = categories
    .filter((category) => !category.hidden)
    .map((category) => ({
      category,
      entry: entriesByCategory(entries, category.id as KbCategory)[0],
    }))
    .filter((row): row is { category: typeof row.category; entry: KbEntry } =>
      Boolean(row.entry)
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
          <div key={category.id} className="flex flex-col gap-3">
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
