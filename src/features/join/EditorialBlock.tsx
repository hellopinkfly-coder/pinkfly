import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";

export type EditorialContent = {
  eyebrow: string;
  headline: string;
  body: string[];
};

/** Stable anchor and CMS block id. Not copy — links point at it. */
const BLOCK_ID = "join-community-editorial";

/**
 * CMS-managed editorial block.
 *
 * Deliberately dumb: it renders whatever `content` it is handed. The eyebrow,
 * headline and every paragraph come from Sanity (Pages → Join Community →
 * Editorial block); an empty body hides the section entirely.
 */
export function EditorialBlock({
  content,
}: {
  content: EditorialContent;
}) {
  if (!content?.body?.length) return null;

  return (
    <Section
      id={BLOCK_ID}
      className="bg-[var(--pf-surface)]"
      data-cms-block={BLOCK_ID}
    >
      <Reveal className="mx-auto max-w-3xl text-left">
        <span className="pf-eyebrow">{content.eyebrow}</span>
        <h2 className="pf-h2 mt-4">{content.headline}</h2>
        <div className="pf-prose mt-7 text-[var(--pf-text)]">
          {content.body.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
