import { join } from "@/config/content";
import { joinImages } from "@/config/images";
import { PageHeader } from "@/components/shared/PageHeader";
import { WhyJoinUs } from "@/features/join/WhyJoinUs";
import { EditorialBlock } from "@/features/join/EditorialBlock";
import { JoinNowCTA } from "@/features/join/JoinNowCTA";
import { Faqs } from "@/features/join/Faqs";
import type { Region } from "@/lib/region";

/**
 * Join Community page, in wireframe order:
 * header → why join us → (CMS-managed editorial) → join now → FAQs → footer.
 */
export function JoinPage({ region }: { region: Region }) {
  return (
    <>
      <PageHeader
        eyebrow={join.hero.eyebrow}
        title={join.hero.title}
        intro={`${join.hero.intro} ${region.copy.joinIntro}`}
        banner={joinImages.banner}
      />
      <WhyJoinUs />
      <EditorialBlock />
      <JoinNowCTA region={region} />
      <Faqs />
    </>
  );
}
