import { community } from "@/config/content";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { Card } from "@/components/ui/card";
import { staggerContainer, fadeUp } from "@/components/motion/variants";

export function Community() {
  return (
    <Section id="community" className="bg-[var(--pf-surface)]">
      <SectionHeading eyebrow={community.eyebrow} title={community.headline} />

      <Reveal
        as="ul"
        variants={staggerContainer}
        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {community.offerings.map(({ icon: Icon, title, description }) => (
          <Reveal as="li" key={title} variants={fadeUp}>
            <Card className="group h-full hover:-translate-y-1 hover:border-[var(--pf-accent)]/30 hover:shadow-[var(--pf-shadow-md)]">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--pf-accent-soft)] text-[var(--pf-accent)] transition-transform duration-300 group-hover:scale-110">
                <Icon size={22} />
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
