import { initiatives } from "@/data/team";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { Rail } from "@/components/shared/Rail";
import { ImageFrame } from "@/components/shared/ImageFrame";
import { Badge } from "@/components/ui/badge";

/**
 * Previous Pink Fly activities and initiatives.
 *
 * HIDDEN FOR NOW via `flags.initiatives` in `src/config/flags.ts`. The
 * component and its data are complete — flip the flag to publish it. Do not
 * delete: this section is scheduled to go live once content is ready.
 */
export function Initiatives() {
  if (initiatives.length === 0) return null;

  return (
    <Section id="initiatives" className="bg-[var(--pf-surface)]">
      <SectionHeading
        eyebrow="Initiatives"
        title="What we've built so far."
        intro="Programmes, campaigns and gatherings the community has run."
        align="left"
      />

      <Rail label="Past Pink Fly initiatives" className="mt-12">
        {initiatives.map((initiative) => (
          <Reveal
            key={initiative.slug}
            className="group w-[290px] sm:w-[340px]"
          >
            <article className="flex h-full flex-col">
              {initiative.image && (
                <ImageFrame
                  src={initiative.image.src}
                  alt={initiative.image.alt}
                  label={initiative.period}
                  shape="rect"
                  aspect="aspect-[4/3]"
                  sizes="340px"
                  className="shadow-[var(--pf-shadow-sm)] transition-shadow duration-500 group-hover:shadow-[var(--pf-shadow-md)]"
                />
              )}
              <h3 className="mt-5 text-lg">{initiative.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--pf-text)]">
                {initiative.summary}
              </p>
              {initiative.highlights && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {initiative.highlights.map((highlight) => (
                    <li key={highlight}>
                      <Badge variant="neutral">{highlight}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </Reveal>
        ))}
      </Rail>
    </Section>
  );
}
