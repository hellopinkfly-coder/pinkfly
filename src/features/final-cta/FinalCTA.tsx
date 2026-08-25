import { ArrowRight, ArrowUpRight } from "lucide-react";
import { finalCta } from "@/config/content";
import { integrations } from "@/config/site";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { GradientBackdrop } from "@/components/shared/GradientBackdrop";
import { Button } from "@/components/ui/button";
import { regionPath, type Region } from "@/lib/region";

/**
 * "Your seat is waiting" — the site-wide join CTA, on the homepage, About,
 * Events, Knowledge Base and the region entry page.
 *
 * The button opens the region's Google Form when one is configured, falling
 * back to the global form. Until a URL is supplied it links to the on-site
 * Join page, which carries the same membership form — so the CTA always
 * leads somewhere a visitor can actually join, and no URL is invented.
 *
 * Set `NEXT_PUBLIC_JOIN_FORM_URL` (or the per-region variable in
 * `src/config/regions.ts`) to switch it over. Nothing here needs to change.
 */
export function FinalCTA({ region }: { region: Region }) {
  const formUrl = region.form.googleFormUrl || integrations.joinFormUrl;

  return (
    <Section id="join" className="relative overflow-hidden">
      <GradientBackdrop />
      <Reveal className="mx-auto max-w-3xl">
        <div className="pf-glass rounded-[var(--pf-radius-2xl)] p-8 text-left shadow-[var(--pf-shadow-md)] sm:p-12">
          <span className="pf-eyebrow">{finalCta.eyebrow}</span>
          <h2 className="pf-h2 mt-4">{finalCta.headline}</h2>
          <p className="mt-5 max-w-xl text-base leading-[1.85] text-[var(--pf-text)] sm:text-lg">
            {finalCta.body}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {formUrl ? (
              <Button
                href={formUrl}
                size="lg"
                data-crm-segment={region.form.crmSegment}
              >
                {finalCta.cta.formLabel}
                {/* Up-and-out arrow: this one leaves the site. */}
                <ArrowUpRight size={18} />
              </Button>
            ) : (
              <Button href={regionPath(region, finalCta.cta.href)} size="lg">
                {finalCta.cta.label}
                <ArrowRight size={18} />
              </Button>
            )}
            <p className="text-sm text-[var(--pf-muted)]">{finalCta.note}</p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
