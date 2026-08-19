import { ArrowUpRight, Check } from "lucide-react";
import { join } from "@/config/content";
import { integrations } from "@/config/site";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { GradientBackdrop } from "@/components/shared/GradientBackdrop";
import { Button } from "@/components/ui/button";
import { JoinForm } from "./JoinForm";
import type { Region } from "@/lib/region";

/**
 * "Join now" — the membership sign-up.
 *
 * The Google Form is the real destination. When its URL is configured this
 * section is a single, unmissable button to it, with the three steps spelled
 * out so nobody has to guess what happens after they click.
 *
 * Until that URL exists the on-site form (`JoinForm`) stands in, so the page
 * is never a dead end. The two are deliberately never shown together: they
 * collect the same details into different places, and a visitor who fills in
 * the wrong one is a lead nobody sees.
 *
 * Switching over is one environment variable — `NEXT_PUBLIC_JOIN_FORM_URL`,
 * or the per-region variable in `src/config/regions.ts`. No code change.
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

          {formUrl ? (
            <>
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
                <p className="text-sm text-[var(--pf-muted)]">
                  {join.cta.formNote}
                </p>
              </div>
            </>
          ) : (
            <JoinForm region={region} />
          )}
        </div>
      </Reveal>
    </Section>
  );
}
