import { ArrowUpRight, Info } from "lucide-react";
import { join } from "@/config/content";
import { integrations } from "@/config/site";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { GradientBackdrop } from "@/components/shared/GradientBackdrop";
import { Button } from "@/components/ui/button";
import type { Region } from "@/lib/region";

/**
 * "Join now" CTA.
 *
 * Points at the region's Google Form when one is configured, falling back to
 * the global form. No URL is invented — if neither is set the button becomes
 * a mailto and an inline note explains that the form is being finalised.
 *
 * Submission flow, once the CRM is connected:
 *   Google Form → Apps Script / Zapier → `CRM_WEBHOOK_URL` → CRM record,
 * tagged with `region.form.crmSegment` so leads route to the right team.
 * Nothing on this page needs to change when that is wired up — only the
 * environment variables in `src/config/regions.ts` and `src/config/site.ts`.
 */
export function JoinNowCTA({ region }: { region: Region }) {
  const formUrl = region.form.googleFormUrl || integrations.joinFormUrl;
  const configured = Boolean(formUrl);

  return (
    <Section id="join-now" className="relative overflow-hidden">
      <GradientBackdrop />
      <Reveal className="mx-auto max-w-3xl">
        <div className="pf-glass rounded-[var(--pf-radius-2xl)] p-8 text-left shadow-[var(--pf-shadow-md)] sm:p-12">
          <h2 className="pf-h2">{join.cta.headline}</h2>
          <p className="mt-5 max-w-xl text-base leading-[1.85] text-[var(--pf-text)] sm:text-lg">
            {join.cta.body}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            {configured ? (
              <Button
                href={formUrl}
                size="lg"
                data-crm-segment={region.form.crmSegment}
              >
                {join.cta.label}
                <ArrowUpRight size={18} />
              </Button>
            ) : (
              <Button href={`mailto:${region.email ?? "hello@oinkfly.community"}?subject=Joining Oinkfly`} size="lg">
                Email us to join
                <ArrowUpRight size={18} />
              </Button>
            )}
            <p className="text-sm text-[var(--pf-muted)]">
              Free to join · Takes about two minutes
            </p>
          </div>

          {!configured && (
            <p className="mt-6 flex items-start gap-2 rounded-[var(--pf-radius-lg)] bg-[var(--pf-surface-muted)] p-4 text-xs leading-relaxed text-[var(--pf-muted)]">
              <Info size={15} className="mt-0.5 shrink-0" aria-hidden />
              <span>
                The membership form is being finalised. Set{" "}
                <code className="font-bold">NEXT_PUBLIC_JOIN_FORM_URL</code> (or
                the region-specific variable) to point this button at the
                Google Form.
              </span>
            </p>
          )}
        </div>
      </Reveal>
    </Section>
  );
}
