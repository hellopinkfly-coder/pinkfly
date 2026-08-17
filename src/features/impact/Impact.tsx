import { impact } from "@/config/content";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { stagger, lift } from "@/components/motion/variants";

/**
 * Impact — four headline numbers in a single horizontal row, counted up once
 * they scroll into view.
 *
 * One hairline-divided band rather than four separate cards: the numbers are
 * one claim, not four. Each carries a quiet icon so the row reads visually
 * before it reads verbally, and nothing else competes with the figures.
 */
export function Impact() {
  return (
    <Section id="impact">
      <SectionHeading eyebrow={impact.eyebrow} title={impact.headline} />

      <Reveal
        as="ul"
        variants={stagger}
        className="mt-12 grid gap-px overflow-hidden rounded-[var(--pf-radius-2xl)] border border-[var(--pf-border)] bg-[var(--pf-border)] sm:grid-cols-2 lg:grid-cols-4"
      >
        {impact.stats.map(({ icon: Icon, value, suffix, label }) => (
          <Reveal
            as="li"
            key={label}
            variants={lift}
            className="group flex flex-col items-center gap-3 bg-[var(--pf-surface)] p-8 text-center transition-colors duration-300 ease-[var(--pf-ease)] hover:bg-[var(--pf-surface-muted)]"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--pf-accent-soft)] text-[var(--pf-accent)] transition-transform duration-300 ease-[var(--pf-ease)] group-hover:-translate-y-1">
              <Icon size={20} strokeWidth={1.9} aria-hidden />
            </span>
            <AnimatedCounter
              value={value}
              suffix={suffix}
              className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-[var(--pf-accent)] sm:text-5xl"
            />
            <span className="text-sm leading-relaxed text-[var(--pf-text)]">
              {label}
            </span>
          </Reveal>
        ))}
      </Reveal>
    </Section>
  );
}
