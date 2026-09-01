import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { regionPath, type Region } from "@/lib/region";
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
}: {
  region: Region;
  content: MissionContent;
}) {
  // The first paragraph is the section's lead, so it is typeset as one.
  const [lead, ...rest] = content.body;

  return (
    <Section id="why-pink-fly-exists" className="bg-[var(--pf-surface)]">
      <SectionHeading
        eyebrow={content.eyebrow}
        title={content.headline}
        intro={lead}
      />

      <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
        {rest.map((paragraph) => (
          <p
            key={paragraph.slice(0, 32)}
            className="text-base leading-relaxed text-[var(--pf-text)] sm:text-lg"
          >
            {paragraph}
          </p>
        ))}

        <div className="mt-7">
          <Button href={regionPath(region, content.cta.href)} size="lg">
            {content.cta.label}
            <ArrowRight size={18} />
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
