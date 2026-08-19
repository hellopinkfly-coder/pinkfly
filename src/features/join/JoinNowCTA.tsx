import { ArrowUpRight, Check } from "lucide-react";
import { join } from "@/config/content";
import { integrations } from "@/config/site";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { GradientBackdrop } from "@/components/shared/GradientBackdrop";
import { Button } from "@/components/ui/button";
import type { Region } from "@/lib/region";

/**
 * "Join now" — the membership sign-up.
 *
 * One call to action, opening the Google Form in a new tab. Registration is
 * collected entirely in that form; the site never asks for the same details
 * itself, so there is no second place a lead can go missing.
 *
 * The URL comes from `NEXT_PUBLIC_JOIN_FORM_URL`, or the per-region variable
 * in `src/config/regions.ts`, which takes precedence. Until one is supplied
 * the section says registration is opening shortly rather than rendering a
 * button with nowhere to go.
 */
export function JoinNowCTA({ region }: { region: Region }) {
  const formUrl = region.form.googleFormUrl || integrations.joinFormUrl;

  return (
    <Section id="join-now" className="relative overflow-hidden">
      <GradientBackdrop />
      <Reveal className="mx-auto max-w-3xl">
        <div className="pf-glass rounded-[var(--pf-radius-2xl)] p-8 text-left shadow-[var(--pf-shadow-md)] sm:p-12">
          <span className="pf-eyebrow">{join.cta.eyebrow}</span>
          <h2 className="pf-h2 mt-4">{join.cta.headline}</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[var(--pf-text)] sm:text-lg">
            {join.cta.body}
          </p>

          {/* What happens after the click, before they leave the site. */}
          <ol className="mt-8 flex flex-col gap-3">
            {join.cta.steps.map((step) => (
              <li
                key={step}
                className="flex items-start gap-3 text-sm text-[var(--pf-text)] sm:text-base"
              >
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]">
                  <Check size={13} strokeWidth={3} aria-hidden />
                </span>
                {step}
              </li>
            ))}
          </ol>

          {formUrl ? (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                href={formUrl}
                size="lg"
                data-crm-segment={region.form.crmSegment}
              >
                {join.cta.formLabel}
                {/* Up-and-out arrow: this one leaves the site. */}
                <ArrowUpRight size={18} />
              </Button>
              <p className="text-sm text-[var(--pf-muted)]">{join.cta.formNote}</p>
            </div>
          ) : (
            /* No URL yet. An honest "not open yet" beats a dead button. */
            <p className="mt-8 inline-flex items-center rounded-full bg-[var(--pf-surface-muted)] px-5 py-3 text-sm text-[var(--pf-text)]">
              {join.cta.pending}
            </p>
          )}
        </div>
      </Reveal>
    </Section>
  );
}
