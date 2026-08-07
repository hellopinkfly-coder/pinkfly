import type { Metadata } from "next";
import { Mail, MessageCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { ContactForm } from "@/features/contact/ContactForm";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Pink Fly team — partnerships, press, membership, or just to say hello.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk."
        intro="Whether you're curious about membership, exploring a partnership, or just want to say hello — we'd love to hear from you."
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal className="space-y-8">
            <div className="flex gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]">
                <Mail size={20} />
              </span>
              <div>
                <h3 className="text-lg">Email us</h3>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="pf-link text-sm"
                >
                  {siteConfig.contactEmail}
                </a>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]">
                <MessageCircle size={20} />
              </span>
              <div>
                <h3 className="text-lg">Join the conversation</h3>
                <p className="text-sm text-[var(--pf-text)]">
                  The fastest way in is the community itself.{" "}
                  <a href="/#join" className="pf-link">
                    Join here
                  </a>
                  .
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
