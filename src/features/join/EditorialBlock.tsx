import { join } from "@/config/content";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";

export type EditorialContent = {
  key: string;
  eyebrow: string;
  headline: string;
  body: string[];
};

/**
 * CMS-managed editorial block.
 *
 * Deliberately dumb: it renders whatever `content` it is handed. Today that
 * comes from `src/config/content.ts`; tomorrow a CMS/CRM loader can pass the
 * same shape (`{ eyebrow, headline, body[] }`) straight through with no
 * change here or at the call site. The `key` field is the content
 * identifier the CMS entry will be keyed on.
 */
export function EditorialBlock({
  content = join.editorial,
}: {
  content?: EditorialContent;
}) {
  if (!content?.body?.length) return null;

  return (
    <Section
      id={content.key}
      className="bg-[var(--pf-surface)]"
      data-cms-block={content.key}
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
