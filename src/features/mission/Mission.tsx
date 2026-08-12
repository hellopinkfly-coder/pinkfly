import { ArrowRight } from "lucide-react";
import { mission } from "@/config/content";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";
import { regionPath, type Region } from "@/lib/region";

/**
 * "Why Pink Fly exists".
 *
 * The text block is left-aligned but the block itself is centred in the
 * section and held to a comfortable measure, so the copy never stretches the
 * full width of a large screen.
 */
export function Mission({ region }: { region: Region }) {
  return (
    <Section id="why-pink-fly-exists" className="bg-[var(--pf-surface)]">
      <Reveal className="mx-auto max-w-3xl text-left">
        <span className="pf-eyebrow">{mission.eyebrow}</span>
        <h2 className="pf-h2 mt-4">{mission.headline}</h2>

        <div className="mt-7 flex flex-col gap-5">
          {mission.body.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="text-base leading-[1.85] text-[var(--pf-text)] sm:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-9">
          <Button href={regionPath(region, mission.cta.href)} size="lg">
            {mission.cta.label}
            <ArrowRight size={18} />
          </Button>
        </div>
      </Reveal>
    </Section>
  );
}
