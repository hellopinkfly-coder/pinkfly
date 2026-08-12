import { knowledgeBase } from "@/config/content";
import { knowledgeImages } from "@/config/images";
import { PageHeader } from "@/components/shared/PageHeader";
import { CategoryRail } from "@/features/knowledge-base/CategoryRail";
import { FinalCTA } from "@/features/final-cta/FinalCTA";
import { kbCategories, getEntriesByCategory } from "@/data/knowledge-base";
import type { Region } from "@/lib/region";

/**
 * Knowledge Base index — three horizontally scrolling category rails sharing
 * one card system. The page's navigation (Recent Articles / Business News /
 * Government Policies / Join Our Community) is supplied by the `knowledge`
 * navbar variant, which `SiteChrome` selects for this route.
 */
export function KnowledgeBasePage({ region }: { region: Region }) {
  return (
    <>
      <PageHeader
        eyebrow={knowledgeBase.hero.eyebrow}
        title={knowledgeBase.hero.title}
        intro={knowledgeBase.hero.intro}
        banner={knowledgeImages.banner}
      />

      {kbCategories.map((category, i) => (
        <CategoryRail
          key={category.id}
          id={category.anchor}
          title={category.title}
          intro={category.intro}
          entries={getEntriesByCategory(category.id)}
          region={region}
          muted={i % 2 === 1}
        />
      ))}

      <FinalCTA region={region} />
    </>
  );
}
