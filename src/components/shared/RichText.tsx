import Link from "next/link";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

/**
 * Body copy from Sanity, with the links an editor put in it.
 *
 * Accepts both shapes the CMS holds: Portable Text blocks, and the plain
 * strings written before rich text existed. That is what lets an entry render
 * correctly whether or not it has been converted, so there is no window where
 * an article looks broken.
 *
 * Links are rendered by destination rather than by a flag: an address on this
 * site uses `next/link` so navigation stays client-side, and anything external
 * gets `rel="noopener noreferrer"` — a target of `_blank` without it hands the
 * opened page a reference back to this one.
 */
export type RichTextValue = PortableTextBlock[] | string[] | undefined;

// The shape `@portabletext/react` accepts, kept loose so a plain string in the
// same array does not fail the type.
type PortableTextBlock = { _type: string; _key?: string; [key: string]: unknown };

const components: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href : "";
      if (!href) return <>{children}</>;

      const internal = href.startsWith("/");
      if (internal) {
        return (
          <Link href={href} className="pf-link">
            {children}
          </Link>
        );
      }

      return (
        <a
          href={href}
          className="pf-link"
          {...(value?.newTab
            ? { target: "_blank", rel: "noopener noreferrer" }
            : { rel: "noopener noreferrer" })}
        >
          {children}
        </a>
      );
    },
  },
};

export function RichText({ value }: { value: RichTextValue }) {
  if (!value || value.length === 0) return null;

  // Plain strings: paragraphs written before rich text, rendered as they were.
  if (typeof value[0] === "string") {
    return (
      <>
        {(value as string[])
          .filter((paragraph) => paragraph?.trim())
          .map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
      </>
    );
  }

  return <PortableText value={value as PortableTextBlock[]} components={components} />;
}
