import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { ImageFrame } from "@/components/shared/ImageFrame";
import type { AboutContent } from "@/lib/cms/content";

/**
 * Founder story — portrait on the right, narrative on the left, with the
 * image lifted slightly out of the text column for an editorial feel.
 */
export function FounderStory({
  founder,
}: {
  founder: AboutContent["founder"];
}) {

  return (
    <Section id="founder-story" className="bg-[var(--pf-surface)]">
      <div className="grid items-start gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
        <Reveal>
          <span className="pf-eyebrow">{founder.eyebrow}</span>
          <h2 className="pf-h2 mt-4">{founder.name}</h2>
          <p className="mt-2 text-sm font-bold uppercase tracking-[0.14em] text-[var(--pf-muted)]">
            {founder.role}
          </p>

          <div className="mt-7 flex flex-col gap-5">
            {founder.body.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="text-base leading-[1.85] text-[var(--pf-text)] sm:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal className="group lg:sticky lg:top-28">
          <ImageFrame
            src={founder.image.src}
            alt={founder.image.alt}
            label={founder.name}
            shape="arch"
            aspect="aspect-[4/5]"
            sizes="(max-width: 1024px) 90vw, 34vw"
            className="shadow-[var(--pf-shadow-lg)]"
          />
        </Reveal>
      </div>
    </Section>
  );
}
