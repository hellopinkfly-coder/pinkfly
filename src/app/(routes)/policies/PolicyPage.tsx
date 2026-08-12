import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { staggerContainer, fadeUp } from "@/components/motion/variants";
import { siteConfig } from "@/config/site";
import { policies, type PolicySlug } from "./policies";

/** Shared layout for every policy page. */
export function PolicyPage({ slug }: { slug: PolicySlug }) {
  const policy = policies[slug];

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
              <p className="mt-3 leading-relaxed text-[var(--pf-text)]">
                {section.body}
              </p>
            </Reveal>
          ))}
        </Reveal>

        <p className="mx-auto mt-14 max-w-3xl text-xs text-[var(--pf-muted)]">
          Placeholder wording — to be replaced with legally reviewed copy before
          launch. Questions? Write to{" "}
          <a href={`mailto:${siteConfig.contactEmail}`} className="pf-link">
            {siteConfig.contactEmail}
          </a>
          .
        </p>
      </Section>
    </>
  );
}
