import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Body copy an editor can put links into.
 *
 * Portable Text rather than plain strings, because a link is an annotation on
 * a span of text — highlight the words, click the link button, paste the URL —
 * and a plain string has nowhere to keep that. The renderer in
 * `src/components/shared/RichText.tsx` still accepts plain strings, so copy
 * written before this existed keeps rendering while it is converted.
 *
 * Deliberately narrow: paragraphs, headings, lists, bold, italic and links.
 * Images, videos and downloads have their own fields on the document, so the
 * editor is not asked to choose between two ways of adding a picture.
 */
export const richText = defineType({
  name: "richText",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal" },
        { title: "Heading", value: "h3" },
        { title: "Subheading", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bulleted", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
        ],
        annotations: [
          defineField({
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "URL",
                type: "url",
                description:
                  "An address on this site (/events) or anywhere else (https://…).",
                validation: (r) =>
                  r
                    .required()
                    .uri({
                      allowRelative: true,
                      scheme: ["http", "https", "mailto", "tel"],
                    }),
              }),
              defineField({
                name: "newTab",
                title: "Open in a new tab",
                type: "boolean",
                initialValue: false,
              }),
            ],
          }),
        ],
      },
    }),
  ],
});
