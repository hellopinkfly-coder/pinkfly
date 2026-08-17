import { offering } from "@/config/content";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { Card } from "@/components/ui/card";
import { stagger, lift } from "@/components/motion/variants";

/**
 * What membership actually is. One grid — the old site said the same six
 * things twice under two different headings.
 */
export function Offering() {
  return (
    <Section id="membership" className="bg-[var(--pf-surface)]">
      <SectionHeading eyebrow={offering.eyebrow} title={offering.headline} />

      <Reveal
        as="ul"
        variants={stagger}
        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {offering.items.map(({ icon: Icon, title, description }) => (
          <Reveal as="li" key={title} variants={lift}>
            <Card className="group h-full hover:-translate-y-1 hover:border-[var(--pf-accent)]/30 hover:shadow-[var(--pf-shadow-md)]">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--pf-accent-soft)] text-[var(--pf-accent)] transition-transform duration-300 ease-[var(--pf-ease)] group-hover:-translate-y-1">
                <Icon size={22} strokeWidth={1.9} />
              </span>
              <h3 className="mt-5 text-xl">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--pf-text)]">
                {description}
              </p>
            </Card>
          </Reveal>
        ))}
      </Reveal>
    </Section>
  );
}
