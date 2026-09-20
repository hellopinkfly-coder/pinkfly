import Link from "next/link";
import { Mail } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { FaqSearch } from "@/features/faq/FaqSearch";
import { FinalCTA } from "@/features/final-cta/FinalCTA";
import { getFaqContent, getFinalCta, getSiteContent } from "@/lib/cms/content";
import { siteConfig } from "@/config/site";
import { regionPath, type Region } from "@/lib/region";

/**
 * The FAQs page.
 *
 * Every answer in one place, grouped by subject, with shortcuts to each
 * group and a search across the lot. The Join page keeps its own short set
 * for the moment of deciding — this is the reference behind it.
 *
 * Answers are rendered as plain paragraphs rather than rich text: an FAQ that
 * needs formatting is usually an article, and belongs in the Knowledge Base.
 */
export async function FaqPage({ region }: { region: Region }) {
  const [content, finalCta, site] = await Promise.all([
    getFaqContent(),
    getFinalCta(),
    getSiteContent(),
  ]);

  const email = site.contactEmail || siteConfig.contactEmail;
  // The closing line names the address once, in the editor's own sentence.
  const [beforeEmail, afterEmail] = content.contactNote.split("{email}");

  return (
    <>
      <PageHeader
        eyebrow={content.hero.eyebrow}
        title={content.hero.title}
        intro={content.hero.intro}
        compact
      />

      <FaqSearch groups={content.groups} />

      <Section className="pt-0 sm:pt-0">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-start gap-3 rounded-[var(--pf-radius-xl)] border border-dashed border-[var(--pf-border-strong)] p-6 sm:flex-row sm:items-center sm:gap-5 sm:p-8">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]">
            <Mail size={19} aria-hidden />
          </span>
          <p className="text-sm leading-relaxed text-[var(--pf-text)] sm:text-base">
            {beforeEmail}
            <a href={`mailto:${email}`} className="pf-link">
              {email}
            </a>
            {afterEmail ?? ""}
            {" "}
            <Link href={regionPath(region, "/join")} className="pf-link">
              Or just ask the community.
            </Link>
          </p>
        </Reveal>
      </Section>

      <FinalCTA
        region={region}
        content={finalCta}
        formUrl={region.form.googleFormUrl || site.joinFormUrl}
        compact
      />
    </>
  );
}
