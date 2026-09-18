import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { GradientBackdrop } from "@/components/shared/GradientBackdrop";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { regionPath, type Region } from "@/lib/region";
import type { FinalCtaContent } from "@/lib/cms/content";

/**
 * "Your seat is waiting" — the site-wide join CTA, on the homepage, About,
 * Events, Knowledge Base and the region entry page.
 *
 * The button opens the region's Google Form when one is configured, falling
 * back to the global form. Until a URL is supplied it links to the on-site
 * Join page, which carries the same membership form — so the CTA always
 * leads somewhere a visitor can actually join, and no URL is invented.
 *
 * The card is kept tight: it sits on six pages, most of them just above the
 * footer, so its padding and inner spacing are a step below the usual section
 * rhythm rather than the generous hero measure.
 *
 * Set `NEXT_PUBLIC_JOIN_FORM_URL` (or the per-region variable in
 * `src/config/regions.ts`) to switch it over. Nothing here needs to change.
 */
export function FinalCTA({
  region,
  content,
  formUrl,
  compact = false,
}: {
  region: Region;
  content: FinalCtaContent;
  /** The region's registration form, resolved by the page. */
  formUrl: string;
  /**
   * Draw the card tighter still.
   *
   * The Events page already asks for a registration on every card, so by the
   * time a visitor reaches the bottom the invitation is a reminder rather
   * than the pitch. Elsewhere it is the first time the page asks.
   */
  compact?: boolean;
}) {

  return (
    <Section
      id="join"
      className={cn(
        "relative overflow-hidden",
        compact ? "py-5 sm:py-7" : "py-7 sm:py-10"
      )}
    >
      <GradientBackdrop />
      <Reveal className="mx-auto max-w-3xl">
        <div
          className={cn(
            "pf-glass rounded-[var(--pf-radius-2xl)] text-left shadow-[var(--pf-shadow-md)]",
            compact ? "p-5 sm:p-7" : "p-6 sm:p-9"
          )}
        >
          <span className="pf-eyebrow">{content.eyebrow}</span>
          {/* A step down from pf-h2's clamp, which tops out at 2.9rem.
              There is no pf-h3 in this codebase, so the smaller measure is
              written out rather than invented as a class. */}
          <h2
            className="mt-3"
            style={{
              fontSize: compact
                ? "clamp(1.4rem, 3.6vw, 2.1rem)"
                : "clamp(1.6rem, 5vw, 2.9rem)",
            }}
          >
            {content.headline}
          </h2>
          <p
            className={cn(
              "max-w-xl text-base text-[var(--pf-text)]",
              compact ? "mt-3 leading-[1.6]" : "mt-4 leading-[1.7]"
            )}
          >
            {content.body}
          </p>

          <div
            className={cn(
              "flex flex-wrap items-center gap-4",
              compact ? "mt-5" : "mt-6"
            )}
          >
            {formUrl ? (
              <Button
                href={formUrl}
                size="lg"
                data-crm-segment={region.form.crmSegment}
              >
                {content.cta.formLabel}
                {/* Up-and-out arrow: this one leaves the site. */}
                <ArrowUpRight size={18} />
              </Button>
            ) : (
              <Button href={regionPath(region, content.cta.href)} size="lg">
                {content.cta.label}
                <ArrowRight size={18} />
              </Button>
            )}
            <p className="text-sm text-[var(--pf-muted)]">{content.note}</p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
