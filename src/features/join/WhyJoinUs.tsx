import { join } from "@/config/content";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import { staggerContainer, fadeUp } from "@/components/motion/variants";

/** "Why join us" — the benefits grid from the Join Community wireframe. */
export function WhyJoinUs() {
  return (
    <Section id="why-join-us">
      <SectionHeading
        eyebrow={join.whyJoin.eyebrow}
        title={join.whyJoin.headline}
        align="left"
      />

      <Reveal
        as="ul"
        variants={staggerContainer}
        className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {join.whyJoin.benefits.map((benefit, i) => (
          <Reveal
            as="li"
            key={benefit.title}
            variants={fadeUp}
            className="group relative flex flex-col gap-3 overflow-hidden rounded-[var(--pf-radius-xl)] border border-[var(--pf-border)] bg-[var(--pf-surface)] p-7 shadow-[var(--pf-shadow-sm)] transition-all duration-300 ease-[var(--pf-ease)] hover:-translate-y-1 hover:border-[var(--pf-accent)]/30 hover:shadow-[var(--pf-shadow-md)]"
          >
            <span
              aria-hidden
              className="font-[family-name:var(--font-display)] text-sm font-bold text-[var(--pf-accent)]"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-lg">{benefit.title}</h3>
            <p className="text-sm leading-relaxed text-[var(--pf-text)]">
              {benefit.description}
            </p>
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-[var(--pf-accent)] transition-transform duration-500 ease-[var(--pf-ease)] group-hover:scale-x-100"
            />
          </Reveal>
        ))}
      </Reveal>
    </Section>
  );
}
