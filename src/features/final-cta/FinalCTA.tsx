import { ArrowRight } from "lucide-react";
import { finalCta } from "@/config/content";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { GradientBackdrop } from "@/components/shared/GradientBackdrop";
import { Button } from "@/components/ui/button";
import { regionPath, type Region } from "@/lib/region";

/**
 * "Your seat is waiting".
 *
 * Left-aligned copy inside a block that stays visually centred in the
 * section — the same treatment as "Why Pink Fly exists", per the wireframe.
 */
export function FinalCTA({ region }: { region: Region }) {
  return (
    <Section id="join" className="relative overflow-hidden">
      <GradientBackdrop />
      <Reveal className="mx-auto max-w-3xl">
        <div className="pf-glass rounded-[var(--pf-radius-2xl)] p-8 text-left shadow-[var(--pf-shadow-md)] sm:p-12">
          <span className="pf-eyebrow">{finalCta.eyebrow}</span>
          <h2 className="pf-h2 mt-4">{finalCta.headline}</h2>
          <p className="mt-5 max-w-xl text-base leading-[1.85] text-[var(--pf-text)] sm:text-lg">
            {finalCta.body}
          </p>
          <div className="mt-8">
            <Button href={regionPath(region, finalCta.cta.href)} size="lg">
              {finalCta.cta.label}
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
