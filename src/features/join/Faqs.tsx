import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Reveal } from "@/components/shared/Reveal";
import type { JoinContent } from "@/lib/cms/content";

/** FAQ accordion built on native <details> — no JS, fully keyboard-usable. */
export function Faqs({ items }: { items: JoinContent["faqs"]["items"] }) {
  return (
    <Section id="faqs" className="bg-[var(--pf-surface)]">
      <SectionHeading eyebrow="FAQs" title="The questions we get most." align="left" />

      <Reveal className="mt-10 divide-y divide-[var(--pf-border)] border-y border-[var(--pf-border)]">
        {items.map((faq) => (
          <details key={faq.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-base font-bold text-[var(--pf-heading)] transition-colors hover:text-[var(--pf-accent)]">
              {faq.q}
              <span
                aria-hidden
                className="shrink-0 text-xl leading-none text-[var(--pf-accent)] transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--pf-text)]">
              {faq.a}
            </p>
          </details>
        ))}
      </Reveal>
    </Section>
  );
}
