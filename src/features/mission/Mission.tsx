import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { regionPath, type Region } from "@/lib/region";
import { ctaHref } from "@/lib/join-url";
import type { MissionContent } from "@/lib/cms/content";

/**
 * "Why Pinkfly exists".
 *
 * Typeset exactly like every other section: the eyebrow, headline and lead
 * paragraph all go through `SectionHeading`, so the hierarchy between them is
 * the shared one rather than a second set of sizes invented here. Any further
 * paragraph repeats the lead's treatment, and the CTA closes the block.
 */
export function Mission({
  region,
  content,
  joinHref,
}: {
  region: Region;
  content: MissionContent;
  /** Where its button leads — the community, where one is set. */
  joinHref: string;
}) {
  // The first paragraph is the section's lead, so it is typeset as one.
  const [lead, ...rest] = content.body;

  return (
    <Section id="why-pink-fly-exists" className="bg-[var(--pf-surface)]">
      {/* The one section that keeps the centred setting it was designed
          with. Everything else on the site starts on the page margin; this
          block is a statement rather than a heading over content, and it was
          asked for back the way it was. Centred here means centred all the
          way down — heading, paragraphs and button — so it reads as one
          deliberate column rather than a centred title over left-set text. */}
      <SectionHeading
        eyebrow={content.eyebrow}
        title={content.headline}
        intro={lead}
        align="center"
      />

      <Reveal className="mx-auto mt-6 flex max-w-2xl flex-col items-center gap-4 text-center">
        {rest.map((paragraph) => (
          <p
            key={paragraph.slice(0, 32)}
            className="max-w-[58ch] text-pretty text-base leading-relaxed text-[var(--pf-text)] sm:text-lg"
          >
            {paragraph}
          </p>
        ))}

        <div className="mt-7">
          <Button href={ctaHref(content.cta.href, joinHref, region)} size="lg">
            {content.cta.label}
            <ArrowRight size={18} />
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
