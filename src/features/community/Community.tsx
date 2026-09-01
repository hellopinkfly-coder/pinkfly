import Link from "next/link";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { ImageFrame } from "@/components/shared/ImageFrame";
import { staggerContainer, fadeUp } from "@/components/motion/variants";
import { regionPath, type Region } from "@/lib/region";
import { cn } from "@/lib/utils";
import type { HomeContent } from "@/lib/cms/content";

/**
 * "How we gather" — four ways the community meets.
 *
 * Real photography rather than infographics, each in a different organic
 * frame, with the alternating vertical offset giving the row an editorial,
 * asymmetric rhythm on wide screens.
 *
 * Each card is one way the community meets, so the whole card — image, title
 * and description — opens the Events page, in the region the visitor is
 * browsing.
 */
export function Community({
  content,
  region,
}: {
  content: HomeContent["community"];
  region: Region;
}) {
  const href = regionPath(region, "/events");
  return (
    <Section id="community" className="bg-[var(--pf-surface)]">
      <SectionHeading
        eyebrow={content.heading.eyebrow}
        title={content.heading.headline}
        intro={content.heading.intro}
      />

      <Reveal
        as="ul"
        variants={staggerContainer}
        className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
      >
        {content.cards.map((card, i) => (
          <Reveal
            as="li"
            key={card.title}
            variants={fadeUp}
            className={cn(
              "group flex flex-col",
              // Staggered baseline — only on the widest layout.
              i % 2 === 1 && "lg:mt-14"
            )}
          >
            <Link
              href={href}
              className="flex flex-col rounded-[var(--pf-radius-xl)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--pf-accent)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--pf-surface)]"
            >
              <ImageFrame
                src={card.image.src}
                alt={card.image.alt}
                label={card.image.label ?? card.title}
                shape={card.shape}
                aspect="aspect-[4/5]"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
                className="shadow-[var(--pf-shadow-md)] transition-shadow duration-500 group-hover:shadow-[var(--pf-shadow-lg)]"
              />
              <h3 className="mt-6 text-lg transition-colors duration-300 group-hover:text-[var(--pf-accent)]">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--pf-text)]">
                {card.description}
              </p>
            </Link>
          </Reveal>
        ))}
      </Reveal>
    </Section>
  );
}
