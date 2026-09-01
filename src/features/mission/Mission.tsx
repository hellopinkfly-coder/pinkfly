import { ArrowRight } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/button";
import { regionPath, type Region } from "@/lib/region";
import type { MissionContent } from "@/lib/cms/content";

/**
 * "Why PinkFly exists".
 *
 * Centred on the same eyebrow → headline → copy pattern every other section
 * uses, so the page reads as one system rather than switching alignment
 * halfway down. The measure stays narrow, so the copy never stretches the
 * full width of a large screen.
 */
export function Mission({
  region,
  content,
}: {
  region: Region;
  content: MissionContent;
}) {
  return (
    <Section id="why-pink-fly-exists" className="bg-[var(--pf-surface)]">
      <SectionHeading eyebrow={content.eyebrow} title={content.headline} />

      <Reveal className="mx-auto mt-7 flex max-w-2xl flex-col items-center gap-5 text-center">
        {content.body.map((paragraph) => (
          <p
            key={paragraph.slice(0, 32)}
            className="text-base leading-[1.85] text-[var(--pf-text)] sm:text-lg"
          >
            {paragraph}
          </p>
        ))}

        <div className="mt-4">
          <Button href={regionPath(region, content.cta.href)} size="lg">
            {content.cta.label}
            <ArrowRight size={18} />
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
