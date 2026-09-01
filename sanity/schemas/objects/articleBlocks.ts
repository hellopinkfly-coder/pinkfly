import { defineField, defineType } from "sanity";

/**
 * The blocks a Knowledge Base entry is built from: paragraphs, and the
 * pictures, videos and downloads an editor places between them. Images use the
 * shared `figure` object, so an inline picture behaves exactly like every
 * other image on the site — upload or external URL, alt text, optional caption
 * chip.
 *
 * Each lives in its own field on the entry rather than in one mixed array,
 * because Sanity cannot mix plain text with objects in a single array — the
 * attempt to do so left the editor unable to add anything at all.
 *
 * They are ordinary array members, so the order in the Studio is the order on
 * the page: text, picture, more text, a PDF at the end, or any other mix.
 */

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
