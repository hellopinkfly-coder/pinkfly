import { impact } from "@/config/content";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { staggerContainer, fadeUp } from "@/components/motion/variants";

export function Impact() {
  return (
    <Section id="impact" className="bg-[var(--pf-surface)]">
      <SectionHeading eyebrow={impact.eyebrow} title={impact.headline} />

      <Reveal
        as="ul"
        variants={staggerContainer}
        className="mt-14 grid grid-cols-2 gap-8 lg:grid-cols-4"
      >
        {impact.stats.map((stat) => (
          <Reveal
            as="li"
            key={stat.label}
            variants={fadeUp}
            className="flex flex-col items-center text-center"
          >
            <span className="font-[family-name:var(--font-display)] text-4xl font-bold text-[var(--pf-heading)] sm:text-5xl">
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
            </span>
            <span className="mt-3 text-sm text-[var(--pf-text)]">
              {stat.label}
            </span>
          </Reveal>
        ))}
      </Reveal>

      <p className="mt-10 text-center text-xs text-[var(--pf-muted)]">
        {impact.subhead}
      </p>
    </Section>
  );
}
