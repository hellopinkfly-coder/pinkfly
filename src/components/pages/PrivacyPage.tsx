import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { siteConfig } from "@/config/site";
import type { Region } from "@/lib/region";

/**
 * Privacy policy.
 *
 * Placeholder structure only — the sections below are the ones a final,
 * lawyer-reviewed policy will need. No claims are made about how data is
 * actually processed until that copy is supplied.
 */
const sections = [
  {
    title: "What we collect",
    body: "Placeholder. This section will describe the information Pink Fly collects — the details you give us when you join the community or register for an event, and the technical information collected automatically when you browse the site.",
  },
  {
    title: "How we use it",
    body: "Placeholder. This section will describe the purposes we use your information for, such as running the community, sending event invitations and the Pink Fly letter, and improving the site.",
  },
  {
    title: "Who we share it with",
    body: "Placeholder. This section will list the categories of service providers Pink Fly relies on and confirm that member information is not sold.",
  },
  {
    title: "How long we keep it",
    body: "Placeholder. This section will set out retention periods for membership records, event registrations and newsletter subscriptions.",
  },
  {
    title: "Your rights",
    body: "Placeholder. This section will explain how to access, correct or delete your information, and how to unsubscribe from Pink Fly communications.",
  },
  {
    title: "Contact",
    body: `Questions about this policy can be sent to ${siteConfig.contactEmail}.`,
  },
];

export function PrivacyPage({ region }: { region: Region }) {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        intro={`How Pink Fly ${region.slug === "global" ? "" : region.shortName + " "}handles the information you share with us. This page is a placeholder pending final legal review.`}
      />

      <Section>
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          {sections.map((section) => (
            <Reveal key={section.title}>
              <h2 className="text-xl">{section.title}</h2>
              <p className="mt-3 leading-[1.85] text-[var(--pf-text)]">
                {section.body}
              </p>
            </Reveal>
          ))}
        </div>
      </Section>
    </>
  );
}
