import { defineField, defineType } from "sanity";

/**
 * The blocks a Knowledge Base entry is built from: paragraphs, and the
 * pictures, videos and downloads an editor places between them. Images use the
 * shared `figure` object, so an inline picture behaves exactly like every
 * other image on the site — upload or external URL, alt text, optional caption
 * chip.
 *
 * A paragraph is an object rather than a plain string because Sanity cannot
 * mix primitive and object members in one array: with `text` alongside
 * `figure`, the Studio offers no way to add the pictures at all. Making every
 * member an object is what puts Image, Video and File into the "Add item"
 * menu.
 *
 * They are ordinary array members, so the order in the Studio is the order on
 * the page: text, picture, more text, a PDF at the end, or any other mix.
 */

export const paragraph = defineType({
  name: "paragraph",
  title: "Paragraph",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      rows: 5,
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { text: "text" },
    prepare: ({ text }) => ({ title: text || "Empty paragraph" }),
  },
});

export const videoEmbed = defineType({
  name: "videoEmbed",
  title: "Video",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "Video URL",
      type: "url",
      description:
        "A YouTube or Vimeo link — paste the address from the browser bar. A direct .mp4 link also works.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description:
        "Describes the video for screen readers, and shown as a caption beneath it.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "url" },
    prepare: ({ title, subtitle }) => ({
      title: title || "Video",
      subtitle,
    }),
  },
});

export const fileAttachment = defineType({
  name: "fileAttachment",
  title: "File to download",
  type: "object",
  fields: [
    defineField({
      name: "file",
      title: "File",
      type: "file",
      description: "A PDF, or any other document a reader should be able to download.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Label",
      type: "string",
      description: "What the download button says. Defaults to the file's own name.",
    }),
    defineField({
      name: "description",
      title: "Note",
      type: "string",
      description: "One line under the label. Optional.",
    }),
  ],
  preview: {
    select: { title: "title", filename: "file.asset.originalFilename" },
    prepare: ({ title, filename }) => ({
      title: title || filename || "File",
      subtitle: filename,
    }),
  },
});
