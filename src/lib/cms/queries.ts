import { groq } from "next-sanity";

/**
 * Every GROQ query the site runs.
 *
 * Each page fetches exactly one document, with its referenced collections
 * dereferenced in the same round trip — one request per page render.
 */

/** The `figure` object, projected to the fields `resolveImage` needs. */
const FIGURE = groq`{ asset, url, alt, label, focal }`;
const SEO = groq`{ title, description, ogImage ${FIGURE} }`;
const HEADING = groq`{ eyebrow, headline, intro }`;

export const homePageQuery = groq`*[_type == "homePage"][0]{
  heroSlides[]{ eyebrow, headline, subhead, points[]{ icon, label }, cta, image ${FIGURE} },
  impactHeading ${HEADING},
  impactStats[]{ icon, value, suffix, label },
  impactVisible,
  communityHeading ${HEADING},
  communityCards[]{ title, description, shape, cta, image ${FIGURE} },
  communityVisible,
  testimonialsHeading ${HEADING},
  testimonials[]->{ quote, name, role, company },
  testimonialsVisible,
  missionHeading ${HEADING},
  missionBody,
  missionCta,
  missionVisible,
  finalCta,
  finalCtaVisible,
  joinCta,
  joinCtaVisible,
  socialHeading ${HEADING},
  socialPosts[]{ url, caption, image ${FIGURE} },
  socialVisible,
  seo ${SEO}
}`;

export const aboutPageQuery = groq`*[_type == "aboutPage"][0]{
  eyebrow, title, intro,
  missionHeading ${HEADING}, missionBody, missionCta, missionVisible,
  bannerImage ${FIGURE}, bannerVisible,
  founder{ eyebrow, name, role, body, image ${FIGURE} }, founderVisible,
  guidelinesHeading ${HEADING}, guidelinesImage ${FIGURE},
  guidelines[]{ title, description, icon }, guidelinesVisible,
  initiativesHeading ${HEADING},
  initiatives[]->{ "slug": slug.current, title, period, summary, highlights, image ${FIGURE} },
  initiativesVisible,
  teamHeading ${HEADING},
  team[]->{ name, role, bio, linkedin, order, image ${FIGURE} },
  teamVisible,
  contactHeading ${HEADING}, contactForm, contactVisible,
  seo ${SEO}
}`;

export const joinPageQuery = groq`*[_type == "joinPage"][0]{
  eyebrow, title, intro, bannerImage ${FIGURE},
  whyJoinHeading ${HEADING}, benefits[]{ title, description, icon }, whyJoinVisible,
  editorial{ eyebrow, headline, body }, editorialVisible,
  cta,
  faqs[]{ question, answer }, faqsVisible,
  seo ${SEO}
}`;

export const eventsPageQuery = groq`*[_type == "eventsPage"][0]{
  eyebrow, title, intro, bannerImage ${FIGURE}, emptyState, seo ${SEO}
}`;

export const knowledgeBasePageQuery = groq`*[_type == "knowledgeBasePage"][0]{
  eyebrow, title, intro,
  categories[]{ id, title, description, hidden },
  commentsClosedMessage,
  seo ${SEO}
}`;

export const policyPagesQuery = groq`*[_type == "policyPage"]{
  slug, title, intro, sections[]{ heading, body }, seo ${SEO}
}`;

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]{
  name, tagline, description, parent, parentUrl,
  logo ${FIGURE}, defaultOgImage ${FIGURE}, placeholderImage ${FIGURE},
  contactEmail, address, phone, socials,
  mainNav[]{ label, href },
  knowledgeBaseNav[]{ label, href },
  footerCommunity{ title, links[]{ label, href } },
  footerCompany{ title, links[]{ label, href } },
  navCta,
  policyNav[]{ label, href },
  joinFormUrl
}`;

export const regionsQuery = groq`*[_type == "region"]{
  slug, name, shortName, location,
  heroEyebrow, heroHeadline, joinIntro, eventsIntro,
  address, phone, email,
  googleFormUrl, crmSegment,
  seo ${SEO}
}`;

// `hidden != true` rather than `!hidden`: the field is absent on every event
// created before the toggle existed, and absent must mean visible.
export const eventsQuery = groq`*[_type == "event" && hidden != true] | order(startsAt asc){
  "slug": slug.current, title, excerpt, regions, city, venue, type,
  startsAt, durationMinutes, format, price, registrationUrl,
  whoShouldJoin, whyJoin, description,
  speakers[]{ name, designation, image ${FIGURE} },
  image ${FIGURE}
}`;

export const kbEntriesQuery = groq`*[_type == "kbEntry" && hidden != true] | order(publishedAt desc){
  "slug": slug.current, category, title, excerpt, tag,
  author, publishedAt, readingTime, source, policy,
  body, bodyAfterImage,
  inlineImage ${FIGURE},
  video,
  image ${FIGURE},
  // Files are the one part needing a dereference: the image builder resolves a
  // figure from its reference alone, but a download needs the asset's real
  // URL, name and size.
  "files": attachments[]{
    title, description,
    "url": file.asset->url,
    "name": file.asset->originalFilename,
    "size": file.asset->size
  }
}`;

export const partnersQuery = groq`*[_type == "partner"] | order(order asc){
  name, url, logo ${FIGURE}
}`;
