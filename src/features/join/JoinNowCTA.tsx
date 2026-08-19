import { ArrowUpRight } from "lucide-react";
import { join } from "@/config/content";
import { integrations } from "@/config/site";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { GradientBackdrop } from "@/components/shared/GradientBackdrop";
import { JoinForm } from "./JoinForm";
import type { Region } from "@/lib/region";

/**
 * "Join now" — the membership form itself, on the page.
 *
 * This used to be a button that opened a Google Form, and a mailto when no
 * form URL was configured. The mailto asked a visitor to compose an email
 * from scratch, which is the highest-friction way to join anything, and the
 * unconfigured state also printed a note about an environment variable to
 * real visitors. Both are gone.
 *
 * Submissions post to /api/join, which forwards to `CRM_WEBHOOK_URL` when it
 * is set — the same CRM destination the Google Form was always meant to feed,
 * tagged with the region so leads route to the right team.
 *
 * If a Google Form URL is configured it is offered underneath as an
 * alternative, rather than replacing the form.
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

          <JoinForm region={region} />

          {formUrl && (
            <p className="mt-8 border-t border-[var(--pf-border)] pt-6 text-sm text-[var(--pf-muted)]">
              Prefer a form?{" "}
              <a
                href={formUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-crm-segment={region.form.crmSegment}
                className="pf-link inline-flex items-center gap-1 font-bold"
              >
                Open the Google Form
                <ArrowUpRight size={14} aria-hidden />
              </a>
            </p>
          )}
        </div>
      </Reveal>
    </Section>
  );
}
