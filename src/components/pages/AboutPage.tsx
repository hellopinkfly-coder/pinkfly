import { PageHeader } from "@/components/shared/PageHeader";
import { Mission } from "@/features/mission/Mission";
import { AboutBanner } from "@/features/about/AboutBanner";
import { FounderStory } from "@/features/about/FounderStory";
import { CommunityGuidelines } from "@/features/about/CommunityGuidelines";
import { Initiatives } from "@/features/about/Initiatives";
import { ExecutiveTeam } from "@/features/about/ExecutiveTeam";
import { ContactCta } from "@/features/about/ContactCta";
import { FinalCTA } from "@/features/final-cta/FinalCTA";
import { getAboutContent, getFinalCta, getSiteContent } from "@/lib/cms/content";
import type { Region } from "@/lib/region";

/**
 * About page, in wireframe order:
 * header → why Pinkfly exists → banner → founder story →
 * community guidelines → initiatives → executive team →
 * the way through to Contact → footer.
 *
 * Every headline, paragraph, image and section switch on this page is edited
 * in Sanity under Pages → About.
 */
export async function AboutPage({ region }: { region: Region }) {
  const [content, finalCta, site] = await Promise.all([
    getAboutContent(),
    getFinalCta(),
    getSiteContent(),
  ]);
  const formUrl = region.form.googleFormUrl || site.joinFormUrl;

  return (
    <>
      <PageHeader
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        intro={content.hero.intro}
      />
      {content.mission.visible && (
        <Mission region={region} content={content.mission} />
      )}
      {content.banner.visible && <AboutBanner image={content.banner.image} />}
      {content.founder.visible && <FounderStory founder={content.founder} />}
      {content.guidelines.visible && content.guidelines.items.length > 0 && (
        <CommunityGuidelines guidelines={content.guidelines} />
      )}
      {content.initiatives.visible && content.initiatives.items.length > 0 && (
        <Initiatives content={content.initiatives} />
      )}
      {content.team.visible && content.team.members.length > 0 && (
        <ExecutiveTeam
          members={content.team.members}
          heading={content.team.heading}
        />
      )}
      {/* Not the form itself — that has its own page now. This is the door
          to it, for a reader who has just finished reading about us. */}
      {content.contact.visible && (
        <ContactCta
          region={region}
          content={content.contact.cta}
          email={region.email ?? site.contactEmail}
        />
      )}
      <FinalCTA region={region} content={finalCta} formUrl={formUrl} />
    </>
  );
}
