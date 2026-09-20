import { ArrowRight, Mail } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";
import { regionPath, type Region } from "@/lib/region";

/**
 * The invitation to Contact, at the foot of About.
 *
 * About used to end with the whole contact block — details, form and all —
 * which put a form under the team photographs where few people scrolled, and
 * left "who we are" and "how to reach us" competing on one page. The form now
 * has its own page and this points at it.
 */
export function ContactCta({
  region,
  content,
  email,
}: {
  region: Region;
  content: { eyebrow: string; headline: string; body: string; label: string };
  /** Shown beside the button, for anyone who would rather just write. */
  email: string;
}) {
  return (
    <Section id="contact" className="bg-[var(--pf-surface)]">
      <Reveal className="mx-auto flex max-w-3xl flex-col items-start gap-5 rounded-[var(--pf-radius-2xl)] border border-[var(--pf-border)] bg-[var(--pf-bg)] p-6 shadow-[var(--pf-shadow-sm)] sm:flex-row sm:items-center sm:gap-8 sm:p-9">
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]">
          <Mail size={20} aria-hidden />
        </span>

        <div className="flex-1">
          <span className="pf-eyebrow">{content.eyebrow}</span>
          <h2 className="mt-1.5 text-xl leading-tight sm:text-2xl">
            {content.headline}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--pf-text)]">
            {content.body}{" "}
            <a href={`mailto:${email}`} className="pf-link">
              {email}
            </a>
          </p>
        </div>

        <Button href={regionPath(region, "/contact")} className="shrink-0">
          {content.label}
          <ArrowRight size={16} />
        </Button>
      </Reveal>
    </Section>
  );
}
