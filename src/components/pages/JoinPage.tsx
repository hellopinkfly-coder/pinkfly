import { PageHeader } from "@/components/shared/PageHeader";
import { WhyJoinUs } from "@/features/join/WhyJoinUs";
import { EditorialBlock } from "@/features/join/EditorialBlock";
import { JoinNowCTA } from "@/features/join/JoinNowCTA";
import { Faqs } from "@/features/join/Faqs";
import { getJoinContent, getSiteContent } from "@/lib/cms/content";
import type { Region } from "@/lib/region";

/**
 * Join Community page, in wireframe order:
 * header → why join us → editorial block → register → FAQs → footer.
 *
 * Edited in Sanity under Pages → Join Community, including the registration
 * form URL each CTA opens.
 */
export async function JoinPage({ region }: { region: Region }) {
  const [content, site] = await Promise.all([getJoinContent(), getSiteContent()]);
  const formUrl = region.form.googleFormUrl || site.joinFormUrl;

  return (
    <>
      <PageHeader
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        intro={`${content.hero.intro} ${region.copy.joinIntro}`}
        banner={content.hero.banner}
      />
      {content.whyJoin.visible && content.whyJoin.benefits.length > 0 && (
        <WhyJoinUs content={content.whyJoin} />
      )}
      {content.editorial.visible && <EditorialBlock content={content.editorial} />}
      <JoinNowCTA region={region} content={content.cta} formUrl={formUrl} />
      {content.faqs.visible && content.faqs.items.length > 0 && (
        <Faqs items={content.faqs.items} />
      )}
    </>
  );
}
