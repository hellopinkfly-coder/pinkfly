import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { staggerContainer, fadeUp } from "@/components/motion/variants";
import type { PolicySlug } from "@/config/policies";
import { getPolicyContent, getSiteContent } from "@/lib/cms/content";
import type { Region } from "@/lib/region";

/**
 * Shared layout for every policy page (terms, refund, privacy, community
 * guidelines) across every region. Copy is edited in Sanity under Policy
 * pages, keyed by the page's slug.
 */
export async function PolicyPage({
  slug,
  region,
}: {
  slug: PolicySlug;
  region: Region;
}) {
  const [policy, site] = await Promise.all([
    getPolicyContent(slug),
    getSiteContent(),
  ]);
  // Unpublished in Sanity means gone, not "fall back to the shipped copy".
  if (!policy) notFound();

  const email = region.email ?? site.contactEmail;

  return (
    <>
      <PageHeader eyebrow="Policies" title={policy.title} intro={policy.intro} />

      <Section>
        <Reveal
          as="ul"
          variants={staggerContainer}
          className="mx-auto flex max-w-3xl flex-col gap-10"
        >
          {policy.sections.map((section) => (
            <Reveal as="li" key={section.heading} variants={fadeUp}>
              <h2 className="text-xl">{section.heading}</h2>
              <p className="mt-3 leading-[1.85] text-[var(--pf-text)]">
                {section.body}
              </p>
            </Reveal>
          ))}
        </Reveal>

        <p className="mx-auto mt-14 max-w-3xl text-xs leading-relaxed text-[var(--pf-muted)]">
          Placeholder wording — to be replaced with legally reviewed copy before
          launch. Questions? Write to{" "}
          <a href={`mailto:${email}`} className="pf-link">
            {email}
          </a>
          .
        </p>
      </Section>
    </>
  );
}
