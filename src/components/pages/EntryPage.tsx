import Link from "next/link";
import { ArrowLeft, Clock, ExternalLink, MessageCircle } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { ImageFrame } from "@/components/shared/ImageFrame";
import { Rail } from "@/components/shared/Rail";
import { Badge } from "@/components/ui/badge";
import { ArticleBody } from "@/features/knowledge-base/ArticleBody";
import { ArticleCard } from "@/features/knowledge-base/ArticleCard";
import { FinalCTA } from "@/features/final-cta/FinalCTA";
import { flags } from "@/config/flags";
import { relatedEntries, type KbEntry } from "@/data/knowledge-base";
import { getKbEntries } from "@/lib/cms/collections";
import {
  getKnowledgeBaseContent,
  getFinalCta,
  getSiteContent,
} from "@/lib/cms/content";
import { regionPath, type Region } from "@/lib/region";

/**
 * A single Knowledge Base entry.
 *
 * The shell (banner → title/author/reading time → body → comments → recent)
 * is shared, per the wireframe. What differs by category is the module that
 * sits alongside the body: business news carries a source attribution, and a
 * government policy carries the structured policy summary its wireframe
 * calls for. Articles carry neither.
 */
export async function EntryPage({
  entry,
  region,
}: {
  entry: KbEntry;
  region: Region;
}) {
  const [entries, kb, finalCta, site] = await Promise.all([
    getKbEntries(),
    getKnowledgeBaseContent(),
    getFinalCta(),
    getSiteContent(),
  ]);
  const related = relatedEntries(entries, entry);
  const category = kb.categories.find((c) => c.id === entry.category);
  const publishedLabel = new Date(entry.publishedAt).toLocaleDateString(
    region.locale,
    { day: "numeric", month: "long", year: "numeric" }
  );

  return (
    <>
      {/* Banner */}
      <section className="pt-28 sm:pt-32">
        <Container className="max-w-7xl">
          <Reveal className="group">
            <ImageFrame
              src={entry.image.src}
              alt={entry.image.alt}
              label={entry.tag}
              shape="rect"
              aspect="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]"
              sizes="(max-width: 1280px) 94vw, 1240px"
              priority
              hoverZoom={false}
              className="shadow-[var(--pf-shadow-lg)]"
            />
          </Reveal>
        </Container>
      </section>

      {/* Title, metadata, body */}
      <Section className="pt-10 sm:pt-14">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Link
              href={
                regionPath(region, "/knowledge-base") +
                `#${category?.anchor ?? ""}`
              }
              className="inline-flex items-center gap-2 text-sm text-[var(--pf-muted)] transition-colors hover:text-[var(--pf-accent)]"
            >
              <ArrowLeft size={15} aria-hidden />
              {category?.title ?? "Knowledge Base"}
            </Link>

            <h1 className="pf-h2 mt-5">{entry.title}</h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-[var(--pf-border)] py-4 text-sm text-[var(--pf-text)]">
              <span className="font-bold text-[var(--pf-heading)]">
                {entry.author.name}
              </span>
              <span className="text-[var(--pf-muted)]">{entry.author.role}</span>
              <span aria-hidden className="text-[var(--pf-border-strong)]">|</span>
              <span className="inline-flex items-center gap-1.5 text-[var(--pf-muted)]">
                <Clock size={14} aria-hidden />
                {entry.readingTime}
              </span>
              <span aria-hidden className="text-[var(--pf-border-strong)]">|</span>
              <time dateTime={entry.publishedAt} className="text-[var(--pf-muted)]">
                {publishedLabel}
              </time>
            </div>
          </Reveal>

          {/* Category-specific module */}
          {entry.policy && (
            <Reveal className="mt-8">
              <PolicySummary policy={entry.policy} />
            </Reveal>
          )}

          <Reveal className="pf-prose mt-9 text-[var(--pf-text)]">
            <p className="text-[var(--pf-heading)]">{entry.excerpt}</p>
            <ArticleBody blocks={entry.body} />
          </Reveal>

          {entry.source && (
            <Reveal className="mt-8 flex items-center gap-2 rounded-[var(--pf-radius-lg)] bg-[var(--pf-surface-muted)] px-5 py-4 text-sm text-[var(--pf-text)]">
              <ExternalLink size={15} aria-hidden className="text-[var(--pf-accent)]" />
              <span>
                Source:{" "}
                {entry.source.url ? (
                  <a
                    href={entry.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pf-link"
                  >
                    {entry.source.name}
                  </a>
                ) : (
                  <span className="font-bold">{entry.source.name}</span>
                )}
              </span>
            </Reveal>
          )}
        </div>
      </Section>

      {/* Comment section */}
      <Section className="border-t border-[var(--pf-border)] bg-[var(--pf-surface)] py-12 sm:py-16">
        <div className="mx-auto max-w-4xl">
          <Reveal className="flex flex-col items-start gap-3 rounded-[var(--pf-radius-xl)] border border-dashed border-[var(--pf-border-strong)] p-8 text-left">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--pf-accent-soft)] text-[var(--pf-accent)]">
              <MessageCircle size={19} />
            </span>
            <h2 className="text-lg">Comments</h2>
            <p className="max-w-lg text-sm leading-relaxed text-[var(--pf-text)]">
              {flags.articleComments
                ? "Be the first to comment on this piece."
                : kb.commentsClosedMessage}
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Recent in this category */}
      {related.length > 0 && (
        <Section id="recent">
          <Reveal>
            <h2 className="pf-h2">Recent {category?.title ?? "posts"}</h2>
          </Reveal>
          <Rail label={`Recent ${category?.title ?? "posts"}`} className="mt-10">
            {related.map((item) => (
              <ArticleCard key={item.slug} entry={item} region={region} />
            ))}
          </Rail>
        </Section>
      )}

      <FinalCTA
        region={region}
        content={finalCta}
        formUrl={region.form.googleFormUrl || site.joinFormUrl}
      />
    </>
  );
}

function PolicySummary({
  policy,
}: {
  policy: NonNullable<KbEntry["policy"]>;
}) {
  const rows = [
    { label: "Authority", value: policy.authority },
    { label: "Applies to", value: policy.appliesTo },
    { label: "Effective from", value: policy.effectiveFrom },
  ];

  return (
    <aside className="rounded-[var(--pf-radius-xl)] border border-[var(--pf-border)] bg-[var(--pf-surface)] p-7 shadow-[var(--pf-shadow-sm)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base">Policy at a glance</h2>
        <Badge>{policy.status}</Badge>
      </div>

      <dl className="mt-5 grid gap-4 sm:grid-cols-3">
        {rows.map((row) => (
          <div key={row.label}>
            <dt className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--pf-muted)]">
              {row.label}
            </dt>
            <dd className="mt-1 text-sm text-[var(--pf-heading)]">{row.value}</dd>
          </div>
        ))}
      </dl>

      <ul className="mt-6 flex flex-col gap-2.5 border-t border-[var(--pf-border)] pt-5">
        {policy.keyPoints.map((point) => (
          <li
            key={point}
            className="flex gap-3 text-sm leading-relaxed text-[var(--pf-text)]"
          >
            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--pf-accent)]" />
            {point}
          </li>
        ))}
      </ul>
    </aside>
  );
}
