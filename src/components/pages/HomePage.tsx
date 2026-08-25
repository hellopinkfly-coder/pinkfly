import { Hero } from "@/features/hero/Hero";
import { FinalCTA } from "@/features/final-cta/FinalCTA";
import { Impact } from "@/features/impact/Impact";
import { Community } from "@/features/community/Community";
import { Testimonials } from "@/features/testimonials/Testimonials";
import { Mission } from "@/features/mission/Mission";
import { Join } from "@/features/join/Join";
import { SocialWall } from "@/features/social/SocialWall";
import { getHomeContent, getSiteContent } from "@/lib/cms/content";
import type { Region } from "@/lib/region";

/**
 * The homepage, in the order the wireframe sets out:
 * hero carousel → join CTA → impact → how we gather →
 * testimonials → why Pink Fly → social wall → join + newsletter.
 *
 * One component serves every region; only the `region` object changes.
 * All copy, imagery and section visibility come from Sanity — this file
 * fetches the page's content once and hands each section its own slice.
 */
export async function HomePage({ region }: { region: Region }) {
  const [content, site] = await Promise.all([getHomeContent(), getSiteContent()]);
  const formUrl = region.form.googleFormUrl || site.joinFormUrl;

  return (
    <>
      <Hero region={region} slides={content.hero.slides} />
      <FinalCTA region={region} content={content.finalCta} formUrl={formUrl} />
      {content.impact.visible && <Impact content={content.impact} />}
      {content.community.visible && <Community content={content.community} />}
      {content.testimonials.visible && (
        <Testimonials content={content.testimonials} />
      )}
      {content.mission.visible && (
        <Mission region={region} content={content.mission} />
      )}
      {content.social.visible && <SocialWall content={content.social} />}
      <Join region={region} content={content.joinCta} />
    </>
  );
}
