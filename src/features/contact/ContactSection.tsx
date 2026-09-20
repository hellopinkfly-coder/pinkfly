import { Mail, MapPin, Phone } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { ContactForm } from "./ContactForm";
import type { Region } from "@/lib/region";
import type { ContactContent } from "@/lib/cms/content";

/**
 * The contact details and the form, side by side.
 *
 * Lives on its own page rather than at the foot of About: the two answer
 * different questions — who Pinkfly is, and how to reach it — and a form
 * buried under the team photographs is a form nobody finds. About now
 * carries a short invitation that leads here.
 *
 * Details come from the active region, so switching region updates the
 * address, phone and inbox shown.
 */
export function ContactSection({
  region,
  content,
  fallbackEmail,
  responseNote,
}: {
  region: Region;
  content: Pick<ContactContent, "heading">;
  /** The global inbox, used when the region has none of its own. */
  fallbackEmail: string;
  /** What to expect after writing. Empty shows nothing. */
  responseNote?: string;
}) {
  const email = region.email ?? fallbackEmail;

  return (
    <Section id="contact">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <span className="pf-eyebrow">{content.heading.eyebrow}</span>
          <h2 className="pf-h2 mt-4">{content.heading.headline}</h2>
          <p className="mt-5 text-base leading-relaxed text-[var(--pf-text)]">
            {content.heading.intro}
          </p>

          {responseNote && (
            <p className="mt-4 inline-flex items-center rounded-full bg-[var(--pf-accent-soft)] px-4 py-2 text-sm font-bold text-[var(--pf-accent-hover)]">
              {responseNote}
            </p>
          )}

          <ul className="mt-8 flex flex-col gap-5 text-sm">
            <Detail icon={MapPin} label={`Pinkfly ${region.shortName}`}>
              {region.address ? (
                region.address.map((line) => <span key={line} className="block">{line}</span>)
              ) : (
                <span className="text-[var(--pf-muted)]">Address coming soon</span>
              )}
            </Detail>

            <Detail icon={Phone} label="Phone">
              {region.phone ? (
                <a
                  href={`tel:${region.phone.replace(/[^\d+]/g, "")}`}
                  className="pf-link"
                >
                  {region.phone}
                </a>
              ) : (
                <span className="text-[var(--pf-muted)]">Phone coming soon</span>
              )}
            </Detail>

            <Detail icon={Mail} label="Email">
              <a href={`mailto:${email}`} className="pf-link">
                {email}
              </a>
            </Detail>
          </ul>
        </Reveal>

        <Reveal className="rounded-[var(--pf-radius-2xl)] border border-[var(--pf-border)] bg-[var(--pf-bg)] p-6 shadow-[var(--pf-shadow-sm)] sm:p-9">
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}

function Detail({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Mail;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]">
        <Icon size={17} />
      </span>
      <div>
        <p className="font-bold text-[var(--pf-heading)]">{label}</p>
        <div className="mt-1 leading-relaxed text-[var(--pf-text)]">{children}</div>
      </div>
    </li>
  );
}
