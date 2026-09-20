import { PageHeader } from "@/components/shared/PageHeader";
import { ContactSection } from "@/features/contact/ContactSection";
import { FinalCTA } from "@/features/final-cta/FinalCTA";
import {
  getContactContent,
  getFinalCta,
  getSiteContent,
} from "@/lib/cms/content";
import type { Region } from "@/lib/region";

/**
 * The Contact page.
 *
 * Its own page rather than the last section of About: the two answer
 * different questions, and a form under the team photographs is a form
 * nobody scrolls to. About now carries a short invitation that leads here.
 *
 * The address, phone and inbox come from the active region, so a visitor on
 * /india/contact is given the Indian details.
 */
export async function ContactPage({ region }: { region: Region }) {
  const [content, finalCta, site] = await Promise.all([
    getContactContent(),
    getFinalCta(),
    getSiteContent(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        intro={content.hero.intro}
        compact
      />

      <ContactSection
        region={region}
        content={{ heading: content.heading }}
        fallbackEmail={site.contactEmail}
        responseNote={content.responseNote}
      />

      <FinalCTA
        region={region}
        content={finalCta}
        formUrl={region.form.googleFormUrl || site.joinFormUrl}
        compact
      />
    </>
  );
}
