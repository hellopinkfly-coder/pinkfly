import { ArrowRight, Check } from "lucide-react";
import { valueSpotlight } from "@/config/content";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";

/**
 * Additional value block: visual on the left, copy + CTA on the right.
 * Sits between the benefits grid and the final CTA.
 */
export function ValueSpotlight() {
  return (
    <Section id="value">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Visual */}
        <Reveal className="order-1">
          <div className="relative aspect-[5/4] overflow-hidden rounded-[var(--pf-radius-2xl)] border border-[var(--pf-border)] bg-gradient-to-br from-[var(--pf-surface-muted)] via-[var(--pf-surface)] to-[var(--pf-accent-soft)] shadow-[var(--pf-shadow-md)]">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="px-8 text-center font-[family-name:var(--font-display)] text-sm uppercase tracking-widest text-[var(--pf-muted)]">
                Photograph of a
                <br />
                Pink Fly meetup
              </span>
            </div>
          </div>
        </Reveal>

        {/* Copy */}
        <Reveal className="order-2 flex flex-col items-start gap-5">
          <span className="pf-eyebrow">{valueSpotlight.eyebrow}</span>
          <h2 className="pf-h2">{valueSpotlight.headline}</h2>
          <p className="text-base leading-relaxed text-[var(--pf-text)] sm:text-lg">
            {valueSpotlight.body}
          </p>

          <ul className="mt-1 flex flex-col gap-3">
            {valueSpotlight.points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]">
                  <Check size={14} />
                </span>
                <span className="text-sm leading-relaxed text-[var(--pf-text)]">
                  {point}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-3">
            <Button href={valueSpotlight.cta.href} size="lg">
              {valueSpotlight.cta.label}
              <ArrowRight size={18} />
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
