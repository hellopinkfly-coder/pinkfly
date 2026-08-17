import { about } from "@/config/content";
import { flags } from "@/config/flags";
import { PageHeader } from "@/components/shared/PageHeader";
import { Mission } from "@/features/mission/Mission";
import { AboutBanner } from "@/features/about/AboutBanner";
import { FounderStory } from "@/features/about/FounderStory";
import { CommunityGuidelines } from "@/features/about/CommunityGuidelines";
import { Initiatives } from "@/features/about/Initiatives";
import { ExecutiveTeam } from "@/features/about/ExecutiveTeam";
import { ContactSection } from "@/features/about/ContactSection";
import { FinalCTA } from "@/features/final-cta/FinalCTA";
import type { Region } from "@/lib/region";

/**
 * About page, in wireframe order:
 * header → why Oinkfly exists → banner → founder story →
 * community guidelines → initiatives (hidden) → executive team → footer.
 */
export function AboutPage({ region }: { region: Region }) {
  return (
    <>
      <PageHeader
        eyebrow={about.hero.eyebrow}
        title={about.hero.title}
        intro={about.hero.intro}
      />
      <Mission region={region} />
      <AboutBanner />
      <FounderStory />
      <CommunityGuidelines />
      {/* Built and ready — enable via `flags.initiatives` when content lands. */}
      {flags.initiatives && <Initiatives />}
      <ExecutiveTeam />
      <ContactSection region={region} />
      <FinalCTA region={region} />
    </>
  );
}
