import { impact } from "@/config/content";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { staggerContainer, fadeUp } from "@/components/motion/variants";

/** Four headline numbers, counted up once they scroll into view. */
export function Impact() {
  return (
    <Section id="impact">
      <SectionHeading eyebrow={impact.eyebrow} title={impact.headline} />

      <Reveal
        as="ul"
        variants={staggerContainer}
        className="mt-12 grid gap-px overflow-hidden rounded-[var(--pf-radius-2xl)] border border-[var(--pf-border)] bg-[var(--pf-border)] sm:grid-cols-2 lg:grid-cols-4"
      >
        {impact.stats.map((stat) => (
          <Reveal
            as="li"
            key={stat.label}
            variants={fadeUp}
            className="flex flex-col gap-3 bg-[var(--pf-surface)] p-8 text-center transition-colors duration-300 hover:bg-[var(--pf-surface-muted)]"
          >
            <AnimatedCounter
              value={stat.value}
              suffix={stat.suffix}
              className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-[var(--pf-accent)] sm:text-5xl"
            />
            <span className="text-sm leading-relaxed text-[var(--pf-text)]">
              {stat.label}
            </span>
          </Reveal>
        ))}
      </Reveal>

      <p className="mt-6 text-center text-xs text-[var(--pf-muted)]">
        {impact.note}
      </p>
    </Section>
  );
}
