import { mission } from "@/config/content";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { Card } from "@/components/ui/card";
import { staggerContainer, fadeUp } from "@/components/motion/variants";

export function Mission() {
  return (
    <Section id="mission">
      <SectionHeading
        eyebrow={mission.eyebrow}
        title={mission.headline}
        intro={mission.body}
      />

      <Reveal
        as="ul"
        variants={staggerContainer}
        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {mission.pillars.map(({ icon: Icon, title, description }) => (
          <Reveal as="li" key={title} variants={fadeUp}>
            <Card className="h-full">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]">
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
