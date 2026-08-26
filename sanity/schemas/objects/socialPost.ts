import { defineField, defineType } from "sanity";

/**
 * One post in the homepage social wall.
 *
 * The link is the only required field: paste the URL of an Instagram,
 * YouTube, LinkedIn or X post and the card appears, opening that post when
 * clicked. The platform is read off the link, so there is nothing to pick.
 *
 * YouTube links bring their own still. Instagram and the rest do not hand out
 * a thumbnail without an authenticated API call, so add an image here for
 * those — the same picture you posted works.
 */
export const socialPost = defineType({
  name: "socialPost",
  title: "Social post",
  type: "object",
  fields: [
    defineField({
      name: "url",
      title: "Link to the post",
      type: "url",
      description:
        "The post's own URL — not the profile. Opens in a new tab when clicked.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "image",
      title: "Thumbnail",
      type: "figure",
      description:
        "Required for Instagram, LinkedIn, X and Facebook. YouTube links use the video's own still, so this can be left empty for those.",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "A line shown under the image. Optional.",
      validation: (r) => r.max(120),
    }),
  ],
  preview: {
    select: { title: "caption", subtitle: "url", media: "image.asset" },
    prepare: ({ title, subtitle, media }) => ({
      title: title || subtitle || "Post",
      subtitle: title ? subtitle : undefined,
      media,
    }),
  },
});
