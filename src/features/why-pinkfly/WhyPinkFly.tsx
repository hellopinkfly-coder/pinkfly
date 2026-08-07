import { whyPinkFly } from "@/config/content";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { staggerContainer, fadeUp } from "@/components/motion/variants";

export function WhyPinkFly() {
  return (
    <Section id="why">
      <SectionHeading eyebrow={whyPinkFly.eyebrow} title={whyPinkFly.headline} />

      <Reveal
        as="ul"
        variants={staggerContainer}
        className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
      >
        {whyPinkFly.reasons.map(({ icon: Icon, title, description }) => (
          <Reveal as="li" key={title} variants={fadeUp} className="flex gap-4">
            <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]">
              <Icon size={20} />
            </span>
            <div>
              <h3 className="text-lg">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--pf-text)]">
                {description}
              </p>
            </div>
          </Reveal>
        ))}
      </Reveal>
    </Section>
  );
}
