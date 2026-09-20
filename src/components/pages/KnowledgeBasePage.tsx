import { PageHeader } from "@/components/shared/PageHeader";
import { CategoryRail } from "@/features/knowledge-base/CategoryRail";
import { KbSearch } from "@/features/knowledge-base/KbSearch";
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

  const visibleCategories = content.categories.filter(
    (category) => !category.hidden
  );

  return (
    <>
      <PageHeader
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        intro={content.hero.intro}
        compact
      />

      {/* Search and filters sit above the rails and search across all of
          them; the rails are what they fall back to. Hidden categories are
          filtered out once, so neither the rails nor the search offer an
          article from a category the Studio has taken down. */}
      <KbSearch
        entries={entries.filter((entry) =>
          visibleCategories.some((c) => c.id === entry.category)
        )}
        region={region}
        categories={visibleCategories.map((c) => ({ id: c.id, title: c.title }))}
      >
        {visibleCategories.map((category, i) => (
          <CategoryRail
            key={category.id}
            id={category.anchor}
            category={category.id}
            title={category.title}
            intro={category.intro}
            entries={entriesByCategory(entries, category.id as KbCategory)}
            region={region}
            muted={i % 2 === 1}
          />
        ))}
      </KbSearch>

      {/* The Knowledge Base is something to read through, so the closing
          invitation is drawn tight rather than as a second hero. */}
      <FinalCTA
        region={region}
        content={finalCta}
        formUrl={region.form.googleFormUrl || site.joinFormUrl}
        compact
      />
    </>
  );
}
