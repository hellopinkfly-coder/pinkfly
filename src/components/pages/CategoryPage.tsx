import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { PageHeader } from "@/components/shared/PageHeader";
import { Reveal } from "@/components/shared/Reveal";
import { ArticleCard } from "@/features/knowledge-base/ArticleCard";
import { FinalCTA } from "@/features/final-cta/FinalCTA";
import { entriesByCategory, type KbCategory } from "@/data/knowledge-base";
import { getKbEntries } from "@/lib/cms/collections";
import {
  getKnowledgeBaseContent,
  getFinalCta,
  getSiteContent,
} from "@/lib/cms/content";
import { regionPath, type Region } from "@/lib/region";

/**
 * One Knowledge Base category, in full.
 *
 * The index shows each category as a rail — a few cards, scrolled sideways.
 * This is where "Show all" leads: every entry in the category, in a grid that
 * wraps, so nothing is hidden behind a scroll. The cards are the index's own,
 * so an article looks the same wherever it is met.
 */
export async function CategoryPage({
  region,
  category,
}: {
  region: Region;
  category: KbCategory;
}) {
  const [entries, content, finalCta, site] = await Promise.all([
    getKbEntries(),
    getKnowledgeBaseContent(),
    getFinalCta(),
    getSiteContent(),
  ]);

  const meta = content.categories.find((c) => c.id === category);
  const list = entriesByCategory(entries, category);

  return (
    <>
      <PageHeader
        eyebrow="Knowledge Base"
        title={meta?.title ?? "Knowledge Base"}
        intro={meta?.intro ?? ""}
      />

      <Section>
        <Reveal>
          <Link
            href={regionPath(region, "/knowledge-base")}
            className="pf-link inline-flex min-h-11 items-center gap-2 text-sm font-bold"
          >
            <ArrowLeft size={15} aria-hidden />
            All of the Knowledge Base
          </Link>
        </Reveal>

        {list.length === 0 ? (
          <p className="mt-8 text-base text-[var(--pf-text)]">
            Nothing here yet. New pieces are added as they are written.
          </p>
        ) : (
          <div className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((entry) => (
              <ArticleCard
                key={entry.slug}
                entry={entry}
                region={region}
                layout="grid"
              />
            ))}
          </div>
        )}
      </Section>

      <FinalCTA
        region={region}
        content={finalCta}
        formUrl={region.form.googleFormUrl || site.joinFormUrl}
      />
    </>
  );
}
