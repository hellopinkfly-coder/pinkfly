import { PageHeader } from "@/components/shared/PageHeader";
import { CategoryRail } from "@/features/knowledge-base/CategoryRail";
import { FinalCTA } from "@/features/final-cta/FinalCTA";
import { entriesByCategory, type KbCategory } from "@/data/knowledge-base";
import { getKbEntries } from "@/lib/cms/collections";
import {
  getKnowledgeBaseContent,
  getFinalCta,
  getSiteContent,
} from "@/lib/cms/content";
import type { Region } from "@/lib/region";

/**
 * Knowledge Base index — one horizontally scrolling rail per category,
 * sharing one card system. Entries are Sanity documents; the page's copy,
 * banner and rail headings are edited under Pages → Knowledge Base.
 */
export async function KnowledgeBasePage({ region }: { region: Region }) {
  const [entries, content, finalCta, site] = await Promise.all([
    getKbEntries(),
    getKnowledgeBaseContent(),
    getFinalCta(),
    getSiteContent(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        intro={content.hero.intro}
      />

      {content.categories
        .filter((category) => !category.hidden)
        .map((category, i) => (
          <CategoryRail
            key={category.id}
            id={category.anchor}
            title={category.title}
            intro={category.intro}
            entries={entriesByCategory(entries, category.id as KbCategory)}
            region={region}
            muted={i % 2 === 1}
          />
        ))}

      <FinalCTA
        region={region}
        content={finalCta}
        formUrl={region.form.googleFormUrl || site.joinFormUrl}
      />
    </>
  );
}
