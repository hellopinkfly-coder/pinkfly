/**
 * One-time import: pushes the site's shipped content into Sanity.
 *
 * After this runs, the Studio holds every headline, paragraph, image URL,
 * card, FAQ, event, article, region and navigation link that the code used to
 * carry — and the CMS becomes the source of truth. The `src/config` and
 * `src/data` modules stay in the repository as the seed and as the fallback
 * used when Sanity is unreachable, but editors never need to touch them.
 *
 *   npm run seed:sanity
 *
 * It reads the write token from `.env.local` (or the shell), and targets the
 * Pinkfly project unless NEXT_PUBLIC_SANITY_PROJECT_ID / _DATASET say
 * otherwise.
 *
 * Document ids never contain a dot. Sanity reads a dot as a path separator
 * and documents inside a path are private — readable only with a token — so a
 * dotted id is invisible to the site, which reads anonymously. That is not a
 * cosmetic detail: it is the difference between an article appearing and not.
 *
 * Safe to re-run: every document has a fixed id and is written with
 * `createOrReplace`, so a second run restores the seed rather than
 * duplicating it. It will overwrite editor changes to those documents —
 * which is the point of a reset, and the reason it is not part of the build.
 */
import { readFileSync } from "node:fs";

import { createClient } from "@sanity/client";

import * as content from "../src/config/content";
import { policies } from "../src/config/policies";
import {
  siteConfig,
  integrations,
  mainNav,
  knowledgeBaseNav,
  footerNav,
  policyNav,
} from "../src/config/site";
import { regions } from "../src/config/regions";
import { joinImages, eventImages } from "../src/config/images";
import { events } from "../src/data/events";
import { kbEntries } from "../src/data/knowledge-base";
import { executiveTeam, initiatives } from "../src/data/team";
import { kbCategories } from "../src/data/knowledge-base";
import { iconKey } from "../src/lib/cms/icons";

/**
 * `.env.local` is where the write token lives, and Next loads it for the app —
 * but this script runs outside Next, so it reads the file itself. Anything
 * already exported in the shell wins.
 */
function loadEnvLocal() {
  let file: string;
  try {
    file = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  } catch {
    return;
  }
  for (const line of file.split("\n")) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(line);
    if (!match) continue;
    const [, key, raw] = match;
    if (process.env[key]) continue;
    process.env[key] = raw.trim().replace(/^["']|["']$/g, "");
  }
}

loadEnvLocal();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "5t0hmzzq";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!token) {
  console.error(
    "Set SANITY_API_WRITE_TOKEN (in .env.local or the shell) before running the seed."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-10-01",
  useCdn: false,
});

/** A `figure`, carrying the current image URL until a real photo is uploaded. */
const figure = (
  image: { src?: string; alt: string; label?: string; focal?: string } | null | undefined
) =>
  image?.src
    ? {
        _type: "figure",
        url: image.src,
        alt: image.alt,
        ...(image.label ? { label: image.label } : {}),
        ...(image.focal ? { focal: image.focal } : {}),
      }
    : undefined;

/** Sanity array members each need a stable key. */
const keyed = <T extends object>(items: T[], prefix: string) =>
  items.map((item, i) => ({ _key: `${prefix}-${i}`, ...item }));

const link = (l: { label: string; href: string }) => ({ _type: "navLink", ...l });

async function seed() {
  const docs: Record<string, unknown>[] = [];

  /* ------------------------------------------------------------- settings */
  docs.push({
    _id: "siteSettings",
    _type: "siteSettings",
    name: siteConfig.name,
    tagline: siteConfig.tagline,
    description: siteConfig.description,
    parent: siteConfig.parent,
    parentUrl: siteConfig.parentUrl,
    contactEmail: siteConfig.contactEmail,
    address: [...siteConfig.address],
    phone: siteConfig.phone,
    socials: { ...siteConfig.socials },
    mainNav: keyed(mainNav.map(link), "nav"),
    knowledgeBaseNav: keyed(knowledgeBaseNav.map(link), "kbnav"),
    footerCommunity: {
      title: footerNav.community.title,
      links: keyed(footerNav.community.links.map(link), "fc"),
    },
    footerCompany: {
      title: footerNav.company.title,
      links: keyed(footerNav.company.links.map(link), "fo"),
    },
    navCta: {
      label: "Join Pinkfly",
      knowledgeLabel: "Join Our Community",
      href: "/join",
    },
    policyNav: keyed(policyNav.map(link), "pol"),
    ...(integrations.joinFormUrl ? { joinFormUrl: integrations.joinFormUrl } : {}),
  });

  /* -------------------------------------------------------------- regions */
  for (const region of Object.values(regions)) {
    docs.push({
      _id: `region-${region.slug}`,
      _type: "region",
      slug: region.slug,
      name: region.name,
      shortName: region.shortName,
      location: region.location,
      heroEyebrow: region.copy.heroEyebrow,
      heroHeadline: region.copy.heroHeadline,
      joinIntro: region.copy.joinIntro,
      eventsIntro: region.copy.eventsIntro,
      ...(region.address ? { address: [...region.address] } : {}),
      ...(region.phone ? { phone: region.phone } : {}),
      ...(region.email ? { email: region.email } : {}),
      ...(region.form.googleFormUrl
        ? { googleFormUrl: region.form.googleFormUrl }
        : {}),
      crmSegment: region.form.crmSegment,
      seo: { _type: "seo", ...region.seo },
    });
  }

  /* --------------------------------------------------------- testimonials */
  const testimonialIds = content.testimonials.items.map((item, i) => {
    const _id = `testimonial-${i}`;
    docs.push({ _id, _type: "testimonial", ...item });
    return { _key: `t-${i}`, _type: "reference", _ref: _id };
  });

  /* ------------------------------------------------------------------ team */
  const teamIds = executiveTeam.map((member, i) => {
    const _id = `teamMember-${i}`;
    docs.push({
      _id,
      _type: "teamMember",
      name: member.name,
      role: member.role,
      bio: member.bio,
      order: i,
      image: figure(member.image ? { src: member.image, alt: `${member.name}, ${member.role}` } : null),
    });
    return { _key: `m-${i}`, _type: "reference", _ref: _id };
  });

  /* ----------------------------------------------------------- initiatives */
  const initiativeIds = initiatives.map((item, i) => {
    const _id = `initiative-${item.slug}`;
    docs.push({
      _id,
      _type: "initiative",
      title: item.title,
      slug: { _type: "slug", current: item.slug },
      period: item.period,
      summary: item.summary,
      highlights: item.highlights,
      image: figure(item.image),
    });
    return { _key: `i-${i}`, _type: "reference", _ref: _id };
  });

  /* -------------------------------------------------------------- homepage */
  docs.push({
    _id: "homePage",
    _type: "homePage",
    heroSlides: keyed(
      content.hero.slides.map((slide) => ({
        _type: "heroSlide",
        eyebrow: slide.eyebrow,
        headline: slide.headline,
        subhead: slide.subhead,
        points: keyed(
          slide.points.map((p) => ({
            _type: "iconPoint",
            icon: iconKey(p.icon),
            label: p.label,
          })),
          "p"
        ),
        cta: { _type: "cta", ...slide.cta },
        image: figure(slide.image.src ? { ...slide.image, alt: slide.image.alt } : null),
      })),
      "slide"
    ),
    impactHeading: {
      _type: "sectionHeading",
      eyebrow: content.impact.eyebrow,
      headline: content.impact.headline,
    },
    impactStats: keyed(
      content.impact.stats.map((stat) => ({
        _type: "statItem",
        icon: iconKey(stat.icon),
        value: stat.value,
        suffix: stat.suffix,
        label: stat.label,
      })),
      "stat"
    ),
    impactVisible: true,
    communityHeading: {
      _type: "sectionHeading",
      eyebrow: content.community.eyebrow,
      headline: content.community.headline,
      intro: content.community.intro,
    },
    communityCards: keyed(
      content.community.cards.map((card) => ({
        _type: "imageCard",
        title: card.title,
        description: card.description,
        shape: card.shape,
        image: figure(card.image),
      })),
      "card"
    ),
    communityVisible: true,
    testimonialsHeading: {
      _type: "sectionHeading",
      eyebrow: content.testimonials.eyebrow,
      headline: content.testimonials.headline,
      intro: content.testimonials.note,
    },
    testimonials: testimonialIds,
    testimonialsVisible: false,
    missionHeading: {
      _type: "sectionHeading",
      eyebrow: content.mission.eyebrow,
      headline: content.mission.headline,
    },
    missionBody: content.mission.body,
    missionCta: { _type: "cta", ...content.mission.cta },
    missionVisible: true,
    finalCta: {
      eyebrow: content.finalCta.eyebrow,
      headline: content.finalCta.headline,
      body: content.finalCta.body,
      formLabel: content.finalCta.cta.formLabel,
      label: content.finalCta.cta.label,
      href: content.finalCta.cta.href,
      note: content.finalCta.note,
    },
    joinCta: { ...content.joinCta },
    socialHeading: {
      eyebrow: content.social.eyebrow,
      headline: content.social.headline,
      intro: content.social.intro,
    },
    socialPosts: keyed(
      content.social.posts.map((post) => ({
        _type: "socialPost",
        url: post.url,
        caption: post.caption,
        image: figure(post.image),
      })),
      "social"
    ),
    socialVisible: true,
  });

  /* ----------------------------------------------------------- about page */
  docs.push({
    _id: "aboutPage",
    _type: "aboutPage",
    eyebrow: content.about.hero.eyebrow,
    title: content.about.hero.title,
    intro: content.about.hero.intro,
    missionHeading: {
      _type: "sectionHeading",
      eyebrow: content.mission.eyebrow,
      headline: content.mission.headline,
    },
    missionBody: content.mission.body,
    missionCta: { _type: "cta", ...content.mission.cta },
    missionVisible: true,
    bannerImage: figure(content.about.hero.image),
    bannerVisible: true,
    founder: {
      eyebrow: content.about.founder.eyebrow,
      name: content.about.founder.name,
      role: content.about.founder.role,
      body: content.about.founder.body,
      image: figure(content.about.founder.image),
    },
    founderVisible: true,
    guidelinesHeading: {
      _type: "sectionHeading",
      eyebrow: content.about.guidelines.eyebrow,
      headline: content.about.guidelines.headline,
      intro: content.about.guidelines.intro,
    },
    guidelinesImage: figure(content.about.guidelines.image),
    guidelines: keyed(
      content.about.guidelines.items.map((item) => ({ _type: "titledItem", ...item })),
      "g"
    ),
    guidelinesVisible: true,
    initiativesHeading: {
      _type: "sectionHeading",
      eyebrow: "Initiatives",
      headline: "What we've built so far.",
      intro: "Programmes, campaigns and gatherings the community has run.",
    },
    initiatives: initiativeIds,
    initiativesVisible: false,
    teamHeading: {
      _type: "sectionHeading",
      eyebrow: "Executive team",
      headline: "The people behind Pinkfly.",
      intro:
        "Photographs and biographies are placeholders until the team's final details are confirmed.",
    },
    team: teamIds,
    teamVisible: true,
    contactHeading: {
      _type: "sectionHeading",
      eyebrow: content.about.contact.eyebrow,
      headline: content.about.contact.headline,
      intro: content.about.contact.intro,
    },
    contactVisible: true,
  });

  /* ------------------------------------------------------------ join page */
  docs.push({
    _id: "joinPage",
    _type: "joinPage",
    eyebrow: content.join.hero.eyebrow,
    title: content.join.hero.title,
    intro: content.join.hero.intro,
    bannerImage: figure(joinImages.banner),
    whyJoinHeading: {
      _type: "sectionHeading",
      eyebrow: content.join.whyJoin.eyebrow,
      headline: content.join.whyJoin.headline,
    },
    benefits: keyed(
      content.join.whyJoin.benefits.map((b) => ({ _type: "titledItem", ...b })),
      "b"
    ),
    whyJoinVisible: true,
    editorial: {
      eyebrow: content.join.editorial.eyebrow,
      headline: content.join.editorial.headline,
      body: content.join.editorial.body,
    },
    editorialVisible: true,
    cta: {
      eyebrow: content.join.cta.eyebrow,
      headline: content.join.cta.headline,
      body: content.join.cta.body,
      formLabel: content.join.cta.formLabel,
      formNote: content.join.cta.formNote,
      pending: content.join.cta.pending,
      steps: [...content.join.cta.steps],
    },
    faqs: keyed(
      content.join.faqs.map((f) => ({ _type: "faqItem", question: f.q, answer: f.a })),
      "faq"
    ),
    faqsVisible: true,
  });

  /* ---------------------------------------------------------- events page */
  docs.push({
    _id: "eventsPage",
    _type: "eventsPage",
    eyebrow: "Events",
    title: "Come and be in the room.",
    intro: "Meetups, webinars, masterclasses and coffee chats.",
    bannerImage: figure(eventImages.banner),
    emptyState: "Nothing scheduled for that combination.",
  });

  /* -------------------------------------------------- knowledge base page */
  docs.push({
    _id: "knowledgeBasePage",
    _type: "knowledgeBasePage",
    eyebrow: content.knowledgeBase.hero.eyebrow,
    title: content.knowledgeBase.hero.title,
    intro: content.knowledgeBase.hero.intro,
    categories: keyed(
      kbCategories.map((c) => ({
        _type: "kbCategoryRail",
        id: c.id,
        title: c.title,
        description: c.intro,
      })),
      "cat"
    ),
    commentsClosedMessage:
      "Discussion opens once the comment backend is connected. Until then, bring your thoughts to the community — that is where the good arguments happen anyway.",
  });

  /* -------------------------------------------------------- policy pages */
  for (const [slug, policy] of Object.entries(policies)) {
    docs.push({
      _id: `policyPage-${slug}`,
      _type: "policyPage",
      slug,
      title: policy.title,
      intro: policy.intro,
      sections: keyed(
        policy.sections.map((s) => ({ _type: "policySection", ...s })),
        "s"
      ),
    });
  }

  /* --------------------------------------------------------------- events */
  for (const event of events) {
    docs.push({
      _id: `event-${event.slug}`,
      _type: "event",
      title: event.title,
      slug: { _type: "slug", current: event.slug },
      excerpt: event.excerpt,
      regions: event.regions,
      city: event.city,
      ...(event.venue ? { venue: event.venue } : {}),
      type: event.type,
      startsAt: event.startsAt,
      durationMinutes: event.durationMinutes,
      format: event.format,
      ...(event.price !== null ? { price: event.price } : {}),
      ...(event.registrationUrl ? { registrationUrl: event.registrationUrl } : {}),
      whoShouldJoin: event.whoShouldJoin,
      whyJoin: event.whyJoin,
      description: event.description,
      speakers: keyed(
        event.speakers.map((s) => ({
          _type: "speaker",
          name: s.name,
          designation: s.designation,
          image: figure(s.image ? { src: s.image, alt: s.name } : null),
        })),
        "sp"
      ),
      image: figure(event.image),
    });
  }

  /* ------------------------------------------------ knowledge base entries */
  for (const entry of kbEntries) {
    docs.push({
      _id: `kbEntry-${entry.category}-${entry.slug}`,
      _type: "kbEntry",
      title: entry.title,
      slug: { _type: "slug", current: entry.slug },
      category: entry.category,
      excerpt: entry.excerpt,
      tag: entry.tag,
      author: entry.author,
      publishedAt: entry.publishedAt,
      readingTime: entry.readingTime,
      body: entry.body,
      ...(entry.source ? { source: entry.source } : {}),
      ...(entry.policy
        ? { policy: { ...entry.policy, keyPoints: [...entry.policy.keyPoints] } }
        : {}),
      image: figure(entry.image),
    });
  }

  /* ------------------------------------------------------------ write out */
  let tx = client.transaction();
  for (const doc of docs) {
    tx = tx.createOrReplace(doc as never);
  }
  await tx.commit();
  console.log(`Seeded ${docs.length} documents into ${projectId}/${dataset}.`);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
