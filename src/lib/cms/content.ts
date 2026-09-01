/**
 * The content layer.
 *
 * Every page asks this module for its content and gets back exactly the
 * shapes the components have always taken. Where Sanity has a value it wins;
 * where it does not, the seed content in `src/config` and `src/data` fills
 * the gap. That keeps one source of truth for editors — the Studio — while
 * guaranteeing the site builds and renders before the CMS is populated, and
 * survives a CMS outage afterwards.
 *
 * Nothing in here knows anything about layout. Components are untouched
 * apart from taking their content as a prop instead of importing it.
 */
import type { LucideIcon } from "lucide-react";

import { cmsFetch } from "./fetch";
import { iconFor, iconKey } from "./icons";
import {
  pick,
  pickBool,
  pickList,
  resolveImage,
  type CmsFigure,
  type ResolvedImage,
  fallback,
  fallbackFlag,
} from "./resolve";
import {
  homePageQuery,
  aboutPageQuery,
  joinPageQuery,
  eventsPageQuery,
  knowledgeBasePageQuery,
  policyPagesQuery,
  siteSettingsQuery,
  partnersQuery,
} from "./queries";

import * as seed from "@/config/content";
import { flags } from "@/config/flags";
import { policies, type PolicySlug } from "@/config/policies";
import { siteConfig, integrations, mainNav, knowledgeBaseNav, footerNav, policyNav } from "@/config/site";
import { aboutImages, joinImages, eventImages, teamPlaceholder } from "@/config/images";
import { executiveTeam, initiatives as seedInitiatives, type Initiative, type TeamMember } from "@/data/team";
import { kbCategories } from "@/data/knowledge-base";
import type { FrameShape } from "@/components/shared/ImageFrame";
import type { CommunityCard } from "@/config/content";
import { platformFromUrl, thumbnailFromUrl, type SocialPlatform } from "@/lib/social";

/* ============================================================ shared types */

export type Heading = { eyebrow: string; headline: string; intro?: string };
export type Cta = { label: string; href: string };

type CmsHeading = { eyebrow?: string; headline?: string; intro?: string } | null | undefined;
type CmsCta = { label?: string; href?: string } | null | undefined;

function heading(cms: CmsHeading, seedValue: Heading): Heading {
  return {
    eyebrow: pick(cms?.eyebrow, seedValue.eyebrow),
    headline: pick(cms?.headline, seedValue.headline),
    intro: pick(cms?.intro, seedValue.intro),
  };
}

function cta(cms: CmsCta, seedValue: Cta): Cta {
  return {
    label: pick(cms?.label, seedValue.label),
    href: pick(cms?.href, seedValue.href),
  };
}

/* ================================================================ homepage */

export type HeroSlideContent = {
  eyebrow: string;
  headline: string;
  subhead: string;
  /**
   * Icon *names*, not components. The hero is a client component, and a
   * function cannot cross the server/client boundary — it resolves the name
   * through `iconFor` itself.
   */
  points: { icon: string; label: string }[];
  cta: Cta;
  image: { src?: string; alt: string; focal?: string };
};

/**
 * The seed wall, in the shape the section renders. The platform is derived
 * rather than stored, so a seed entry is just a link, a caption and a picture.
 */
function seedSocialPosts(): SocialPost[] {
  return seed.social.posts.map((post) => ({
    url: post.url,
    platform: platformFromUrl(post.url),
    caption: post.caption,
    image: { src: post.image.src, alt: post.image.alt },
  }));
}

/** One card in the homepage social wall. */
export type SocialPost = {
  url: string;
  platform: SocialPlatform;
  caption: string;
  image: ResolvedImage;
};

export type HomeContent = {
  hero: { slides: HeroSlideContent[] };
  impact: {
    visible: boolean;
    heading: Heading;
    stats: { icon: LucideIcon; value: number; suffix: string; label: string }[];
  };
  community: {
    visible: boolean;
    heading: Heading;
    cards: {
      title: string;
      description: string;
      image: ResolvedImage;
      shape: FrameShape;
    }[];
  };
  testimonials: {
    visible: boolean;
    heading: Heading;
    items: { quote: string; name: string; role: string; company: string }[];
  };
  mission: MissionContent;
  social: {
    visible: boolean;
    heading: Heading;
    posts: SocialPost[];
  };
  finalCta: FinalCtaContent;
  /** The CTA band under the hero, and the join block at the foot of the page. */
  finalCtaVisible: boolean;
  joinCtaVisible: boolean;
  joinCta: {
    eyebrow: string;
    headline: string;
    body: string;
    placeholder: string;
    cta: string;
    success: string;
  };
};

export type MissionContent = {
  visible: boolean;
  eyebrow: string;
  headline: string;
  body: string[];
  cta: Cta;
};

export type FinalCtaContent = {
  eyebrow: string;
  headline: string;
  body: string;
  cta: { formLabel: string; label: string; href: string };
  note: string;
};

type CmsHome = {
  heroSlides?: {
    eyebrow?: string;
    headline?: string;
    subhead?: string;
    points?: { icon?: string; label?: string }[];
    cta?: CmsCta;
    image?: CmsFigure;
  }[];
  impactHeading?: CmsHeading;
  impactStats?: { icon?: string; value?: number; suffix?: string; label?: string }[];
  impactVisible?: boolean;
  communityHeading?: CmsHeading;
  communityCards?: {
    title?: string;
    description?: string;
    shape?: FrameShape;
    image?: CmsFigure;
  }[];
  communityVisible?: boolean;
  testimonialsHeading?: CmsHeading;
  testimonials?: ({ quote?: string; name?: string; role?: string; company?: string } | null)[];
  testimonialsVisible?: boolean;
  missionHeading?: CmsHeading;
  missionBody?: string[];
  missionCta?: CmsCta;
  missionVisible?: boolean;
  finalCtaVisible?: boolean;
  joinCtaVisible?: boolean;
  finalCta?: {
    eyebrow?: string;
    headline?: string;
    body?: string;
    formLabel?: string;
    label?: string;
    href?: string;
    note?: string;
  };
  joinCta?: {
    eyebrow?: string;
    headline?: string;
    body?: string;
    placeholder?: string;
    cta?: string;
    success?: string;
  };
  socialHeading?: CmsHeading;
  socialPosts?: { url?: string; caption?: string; image?: CmsFigure }[];
  socialVisible?: boolean;
} | null;

function missionFrom(
  cms: { missionHeading?: CmsHeading; missionBody?: string[]; missionCta?: CmsCta; missionVisible?: boolean } | null | undefined
): MissionContent {
  const h = heading(cms?.missionHeading, {
    eyebrow: seed.mission.eyebrow,
    headline: seed.mission.headline,
  });
  return {
    visible: pickBool(cms?.missionVisible, true),
    eyebrow: h.eyebrow,
    headline: h.headline,
    body: pick(cms?.missionBody, seed.mission.body),
    cta: cta(cms?.missionCta, seed.mission.cta),
  };
}

function finalCtaFrom(cms: NonNullable<CmsHome>["finalCta"]): FinalCtaContent {
  return {
    eyebrow: pick(cms?.eyebrow, seed.finalCta.eyebrow),
    headline: pick(cms?.headline, seed.finalCta.headline),
    body: pick(cms?.body, seed.finalCta.body),
    cta: {
      formLabel: pick(cms?.formLabel, seed.finalCta.cta.formLabel),
      label: pick(cms?.label, seed.finalCta.cta.label),
      href: pick(cms?.href, seed.finalCta.cta.href),
    },
    note: pick(cms?.note, seed.finalCta.note),
  };
}

/** The shipped hero, with its icon components reduced to their CMS keys. */
function seedHeroSlides(): HeroSlideContent[] {
  return seed.hero.slides.map((slide) => ({
    ...slide,
    points: slide.points.map((point) => ({
      icon: iconKey(point.icon),
      label: point.label,
    })),
  }));
}

export async function getHomeContent(): Promise<HomeContent> {
  const { live, data: cms } = await cmsFetch<CmsHome>(homePageQuery);

  return {
    hero: {
      slides: pickList(cms?.heroSlides, fallback(seedHeroSlides(), live), (slide, i) => {
        const fallback = seedHeroSlides()[i];
        const image = resolveImage(slide.image, {
          src: fallback?.image.src ?? "",
          alt: fallback?.image.alt ?? "",
          focal: fallback?.image.focal,
        });
        return {
          eyebrow: pick(slide.eyebrow, fallback?.eyebrow ?? ""),
          headline: pick(slide.headline, fallback?.headline ?? ""),
          subhead: pick(slide.subhead, fallback?.subhead ?? ""),
          points: pickList(slide.points, fallback?.points ?? [], (point) => ({
            icon: point.icon ?? "sparkles",
            label: point.label ?? "",
          })),
          cta: cta(slide.cta, fallback?.cta ?? { label: "Join", href: "/join" }),
          image: {
            src: image.src || undefined,
            alt: image.alt,
            focal: image.focal,
          },
        };
      }),
    },

    impact: {
      visible: pickBool(cms?.impactVisible, fallbackFlag(true, live, cms)),
      heading: heading(cms?.impactHeading, {
        eyebrow: seed.impact.eyebrow,
        headline: seed.impact.headline,
      }),
      stats: pickList(cms?.impactStats, fallback(seed.impact.stats, live), (stat) => ({
        icon: iconFor(stat.icon),
        value: stat.value ?? 0,
        suffix: stat.suffix ?? "",
        label: stat.label ?? "",
      })),
    },

    community: {
      visible: pickBool(cms?.communityVisible, fallbackFlag(true, live, cms)),
      heading: heading(cms?.communityHeading, {
        eyebrow: seed.community.eyebrow,
        headline: seed.community.headline,
        intro: seed.community.intro,
      }),
      cards: pickList(cms?.communityCards, fallback(seed.community.cards as CommunityCard[], live), (card, i) => {
        const fallback = seed.community.cards[i];
        return {
          title: pick(card.title, fallback?.title ?? ""),
          description: pick(card.description, fallback?.description ?? ""),
          image: resolveImage(card.image, fallback?.image ?? { src: "", alt: "" }),
          shape: pick(card.shape, fallback?.shape ?? "rect"),
        };
      }),
    },

    testimonials: {
      // The seed flag stays the default so nothing changes until an editor
      // flips the switch in Sanity.
      visible: pickBool(cms?.testimonialsVisible, fallbackFlag(flags.testimonials, live, cms)),
      heading: heading(cms?.testimonialsHeading, {
        eyebrow: seed.testimonials.eyebrow,
        headline: seed.testimonials.headline,
        // The "these are placeholders" note lives in the supporting text, so
        // an editor removes it by clearing the field once real quotes land.
        intro: seed.testimonials.note,
      }),
      items: pickList(published(cms?.testimonials), fallback(seed.testimonials.items, live), (item) => ({
        quote: item.quote ?? "",
        name: item.name ?? "",
        role: item.role ?? "",
        company: item.company ?? "",
      })),
    },

    mission: missionFrom(cms),

    social: {
      visible: pickBool(cms?.socialVisible, fallbackFlag(true, live, cms)),
      heading: heading(cms?.socialHeading, {
        eyebrow: seed.social.eyebrow,
        headline: seed.social.headline,
        intro: seed.social.intro,
      }),
      // A post with no link is not a card — it has nowhere to go.
      posts: pickList(cms?.socialPosts, fallback(seedSocialPosts(), live), (post, i) => {
        const fallback = seedSocialPosts()[i];
        const url = pick(post.url, fallback?.url ?? "");
        const image = resolveImage(post.image, {
          src: thumbnailFromUrl(url) ?? fallback?.image.src ?? "",
          alt: fallback?.image.alt ?? "",
        });
        return {
          url,
          platform: platformFromUrl(url),
          caption: pick(post.caption, fallback?.caption ?? ""),
          // A YouTube link carries its own still, so it needs no upload —
          // but an upload, when there is one, still wins.
          image: image.src ? image : { ...image, src: thumbnailFromUrl(url) ?? "" },
        };
      }).filter((post) => post.url && post.image.src),
    },

    finalCta: finalCtaFrom(cms?.finalCta),
    finalCtaVisible: pickBool(cms?.finalCtaVisible, fallbackFlag(true, live, cms)),
    joinCtaVisible: pickBool(cms?.joinCtaVisible, fallbackFlag(true, live, cms)),
    joinCta: {
      eyebrow: pick(cms?.joinCta?.eyebrow, seed.joinCta.eyebrow),
      headline: pick(cms?.joinCta?.headline, seed.joinCta.headline),
      body: pick(cms?.joinCta?.body, seed.joinCta.body),
      placeholder: pick(cms?.joinCta?.placeholder, seed.joinCta.placeholder),
      cta: pick(cms?.joinCta?.cta, seed.joinCta.cta),
      success: pick(cms?.joinCta?.success, seed.joinCta.success),
    },
  };
}

/**
 * The site-wide "Your seat is waiting" CTA, which appears on pages that do
 * not otherwise load the homepage document.
 */
export async function getFinalCta(): Promise<FinalCtaContent> {
  const { live, data: cms } = await cmsFetch<CmsHome>(homePageQuery);
  return finalCtaFrom(cms?.finalCta);
}

/* =============================================================== about page */

export type AboutContent = {
  hero: { eyebrow: string; title: string; intro: string };
  mission: MissionContent;
  banner: { visible: boolean; image: ResolvedImage };
  founder: {
    visible: boolean;
    eyebrow: string;
    name: string;
    role: string;
    image: ResolvedImage;
    body: string[];
  };
  guidelines: {
    visible: boolean;
    heading: Heading;
    image: ResolvedImage;
    items: { title: string; description: string }[];
  };
  initiatives: { visible: boolean; heading: Heading; items: Initiative[] };
  team: { visible: boolean; heading: Heading; members: TeamMember[] };
  contact: { visible: boolean; heading: Heading };
};

type CmsAbout = {
  eyebrow?: string;
  title?: string;
  intro?: string;
  missionHeading?: CmsHeading;
  missionBody?: string[];
  missionCta?: CmsCta;
  missionVisible?: boolean;
  bannerImage?: CmsFigure;
  bannerVisible?: boolean;
  founder?: {
    eyebrow?: string;
    name?: string;
    role?: string;
    body?: string[];
    image?: CmsFigure;
  };
  founderVisible?: boolean;
  guidelinesHeading?: CmsHeading;
  guidelinesImage?: CmsFigure;
  guidelines?: { title?: string; description?: string }[];
  guidelinesVisible?: boolean;
  initiativesHeading?: CmsHeading;
  initiatives?: ({
    slug?: string;
    title?: string;
    period?: string;
    summary?: string;
    highlights?: string[];
    image?: CmsFigure;
  } | null)[];
  initiativesVisible?: boolean;
  teamHeading?: CmsHeading;
  team?: ({
    name?: string;
    role?: string;
    bio?: string;
    linkedin?: string;
    image?: CmsFigure;
  } | null)[];
  teamVisible?: boolean;
  contactHeading?: CmsHeading;
  contactVisible?: boolean;
} | null;

/**
 * A reference to an unpublished document dereferences to `null`, and those
 * nulls stay in the array. Dropping them here is what keeps an unpublished
 * team member or initiative from rendering as a blank card — and from
 * crashing the render outright when the mapper reads a field off it.
 */
function published<T>(items: (T | null)[] | null | undefined): T[] | undefined {
  if (!items) return undefined;
  return items.filter((item): item is T => item !== null);
}

export async function getAboutContent(): Promise<AboutContent> {
  const { live, data: cms } = await cmsFetch<CmsAbout>(aboutPageQuery);
  const initiativeDocs = published(cms?.initiatives);
  const teamDocs = published(cms?.team);

  return {
    hero: {
      eyebrow: pick(cms?.eyebrow, seed.about.hero.eyebrow),
      title: pick(cms?.title, seed.about.hero.title),
      intro: pick(cms?.intro, seed.about.hero.intro),
    },
    mission: missionFrom(cms),
    banner: {
      visible: pickBool(cms?.bannerVisible, fallbackFlag(true, live, cms)),
      image: resolveImage(cms?.bannerImage, seed.about.hero.image),
    },
    founder: {
      visible: pickBool(cms?.founderVisible, fallbackFlag(true, live, cms)),
      eyebrow: pick(cms?.founder?.eyebrow, seed.about.founder.eyebrow),
      name: pick(cms?.founder?.name, seed.about.founder.name),
      role: pick(cms?.founder?.role, seed.about.founder.role),
      image: resolveImage(cms?.founder?.image, seed.about.founder.image),
      body: pick(cms?.founder?.body, seed.about.founder.body),
    },
    guidelines: {
      visible: pickBool(cms?.guidelinesVisible, fallbackFlag(true, live, cms)),
      heading: heading(cms?.guidelinesHeading, {
        eyebrow: seed.about.guidelines.eyebrow,
        headline: seed.about.guidelines.headline,
        intro: seed.about.guidelines.intro,
      }),
      image: resolveImage(cms?.guidelinesImage, seed.about.guidelines.image),
      items: pickList(cms?.guidelines, fallback(seed.about.guidelines.items, live), (item, i) => ({
        title: pick(item.title, seed.about.guidelines.items[i]?.title ?? ""),
        description: pick(
          item.description,
          seed.about.guidelines.items[i]?.description ?? ""
        ),
      })),
    },
    initiatives: {
      visible: pickBool(cms?.initiativesVisible, fallbackFlag(flags.initiatives, live, cms)),
      heading: heading(cms?.initiativesHeading, {
        eyebrow: "Our work",
        headline: "Previous activities and initiatives.",
        intro: "A look at what the community has built so far.",
      }),
      items: pickList(initiativeDocs, fallback(seedInitiatives, live), (item, i) => ({
        slug: pick(item.slug, seedInitiatives[i]?.slug ?? `initiative-${i}`),
        title: pick(item.title, seedInitiatives[i]?.title ?? ""),
        period: pick(item.period, seedInitiatives[i]?.period ?? ""),
        summary: pick(item.summary, seedInitiatives[i]?.summary ?? ""),
        highlights: pick(item.highlights, seedInitiatives[i]?.highlights),
        image: resolveImage(item.image, seedInitiatives[i]?.image ?? undefined) ?? null,
      })),
    },
    team: {
      visible: pickBool(cms?.teamVisible, fallbackFlag(true, live, cms)),
      heading: heading(cms?.teamHeading, {
        eyebrow: "The team",
        headline: "Executive team.",
        intro: "The people building Pinkfly.",
      }),
      members: pickList(teamDocs, fallback(executiveTeam, live), (member, i) => ({
        name: pick(member.name, executiveTeam[i]?.name ?? ""),
        role: pick(member.role, executiveTeam[i]?.role ?? ""),
        bio: pick(member.bio, executiveTeam[i]?.bio),
        linkedin: pick(member.linkedin, executiveTeam[i]?.linkedin),
        image:
          resolveImage(member.image, {
            src: executiveTeam[i]?.image ?? teamPlaceholder,
            alt: member.name ?? executiveTeam[i]?.name ?? "Team member",
          })?.src ?? null,
      })),
    },
    contact: {
      visible: pickBool(cms?.contactVisible, fallbackFlag(true, live, cms)),
      heading: heading(cms?.contactHeading, {
        eyebrow: seed.about.contact.eyebrow,
        headline: seed.about.contact.headline,
        intro: seed.about.contact.intro,
      }),
    },
  };
}

/* ================================================================ join page */

export type JoinContent = {
  hero: { eyebrow: string; title: string; intro: string; banner: ResolvedImage };
  whyJoin: {
    visible: boolean;
    heading: Heading;
    benefits: { title: string; description: string }[];
  };
  editorial: {
    visible: boolean;
    eyebrow: string;
    headline: string;
    body: string[];
  };
  cta: {
    eyebrow: string;
    headline: string;
    body: string;
    formLabel: string;
    formNote: string;
    pending: string;
    steps: string[];
  };
  faqs: { visible: boolean; items: { q: string; a: string }[] };
};

type CmsJoin = {
  eyebrow?: string;
  title?: string;
  intro?: string;
  bannerImage?: CmsFigure;
  whyJoinHeading?: CmsHeading;
  benefits?: { title?: string; description?: string }[];
  whyJoinVisible?: boolean;
  editorial?: { eyebrow?: string; headline?: string; body?: string[] };
  editorialVisible?: boolean;
  cta?: {
    eyebrow?: string;
    headline?: string;
    body?: string;
    formLabel?: string;
    formNote?: string;
    pending?: string;
    steps?: string[];
  };
  faqs?: { question?: string; answer?: string }[];
  faqsVisible?: boolean;
} | null;

export async function getJoinContent(): Promise<JoinContent> {
  const { live, data: cms } = await cmsFetch<CmsJoin>(joinPageQuery);

  return {
    hero: {
      eyebrow: pick(cms?.eyebrow, seed.join.hero.eyebrow),
      title: pick(cms?.title, seed.join.hero.title),
      intro: pick(cms?.intro, seed.join.hero.intro),
      banner: resolveImage(cms?.bannerImage, joinImages.banner),
    },
    whyJoin: {
      visible: pickBool(cms?.whyJoinVisible, fallbackFlag(true, live, cms)),
      heading: heading(cms?.whyJoinHeading, {
        eyebrow: seed.join.whyJoin.eyebrow,
        headline: seed.join.whyJoin.headline,
      }),
      benefits: pickList(cms?.benefits, fallback(seed.join.whyJoin.benefits, live), (item, i) => ({
        title: pick(item.title, seed.join.whyJoin.benefits[i]?.title ?? ""),
        description: pick(
          item.description,
          seed.join.whyJoin.benefits[i]?.description ?? ""
        ),
      })),
    },
    editorial: {
      visible: pickBool(cms?.editorialVisible, fallbackFlag(true, live, cms)),
      eyebrow: pick(cms?.editorial?.eyebrow, seed.join.editorial.eyebrow),
      headline: pick(cms?.editorial?.headline, seed.join.editorial.headline),
      body: pick(cms?.editorial?.body, seed.join.editorial.body),
    },
    cta: {
      eyebrow: pick(cms?.cta?.eyebrow, seed.join.cta.eyebrow),
      headline: pick(cms?.cta?.headline, seed.join.cta.headline),
      body: pick(cms?.cta?.body, seed.join.cta.body),
      formLabel: pick(cms?.cta?.formLabel, seed.join.cta.formLabel),
      formNote: pick(cms?.cta?.formNote, seed.join.cta.formNote),
      pending: pick(cms?.cta?.pending, seed.join.cta.pending),
      steps: pick(cms?.cta?.steps, [...seed.join.cta.steps]),
    },
    faqs: {
      visible: pickBool(cms?.faqsVisible, fallbackFlag(true, live, cms)),
      items: pickList(cms?.faqs, fallback(seed.join.faqs, live), (item, i) => ({
        q: pick(item.question, seed.join.faqs[i]?.q ?? ""),
        a: pick(item.answer, seed.join.faqs[i]?.a ?? ""),
      })),
    },
  };
}

/* ============================================================== events page */

export type EventsPageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  banner: ResolvedImage;
  emptyState: string;
};

export async function getEventsPageContent(): Promise<EventsPageContent> {
  const { live, data: cms } = await cmsFetch<{
    eyebrow?: string;
    title?: string;
    intro?: string;
    bannerImage?: CmsFigure;
    emptyState?: string;
  } | null>(eventsPageQuery);

  return {
    eyebrow: pick(cms?.eyebrow, "Events"),
    title: pick(cms?.title, "Rooms worth showing up for."),
    intro: pick(
      cms?.intro,
      "Meetups, webinars, masterclasses and coffee chats."
    ),
    banner: resolveImage(cms?.bannerImage, eventImages.banner),
    emptyState: pick(
      cms?.emptyState,
      "No events match those filters yet. Try another month or location."
    ),
  };
}

/* ====================================================== knowledge base page */

export type KnowledgeBaseContent = {
  // The page opens on its heading and copy — it carries no banner.
  hero: { eyebrow: string; title: string; intro: string };
  categories: {
    id: string;
    title: string;
    intro: string;
    anchor: string;
    /** Set in Sanity to take the rail off the page without deleting it. */
    hidden: boolean;
  }[];
  commentsClosedMessage: string;
};

export async function getKnowledgeBaseContent(): Promise<KnowledgeBaseContent> {
  const { live, data: cms } = await cmsFetch<{
    eyebrow?: string;
    title?: string;
    intro?: string;
    categories?: {
      id?: string;
      title?: string;
      description?: string;
      hidden?: boolean;
    }[];
    commentsClosedMessage?: string;
  } | null>(knowledgeBasePageQuery);

  return {
    hero: {
      eyebrow: pick(cms?.eyebrow, seed.knowledgeBase.hero.eyebrow),
      title: pick(cms?.title, seed.knowledgeBase.hero.title),
      intro: pick(cms?.intro, seed.knowledgeBase.hero.intro),
    },
    // The anchor stays in code: it is a URL contract the navigation links to,
    // not copy, so an editor cannot break the in-page links by retitling a rail.
    categories: pickList<
      { id?: string; title?: string; description?: string; hidden?: boolean },
      { id: string; title: string; intro: string; anchor: string; hidden: boolean }
    >(
      cms?.categories,
      kbCategories.map((c) => ({ ...c, hidden: false })),
      (category, i) => {
      const fallback =
        kbCategories.find((c) => c.id === category.id) ?? kbCategories[i];
      return {
        id: pick(category.id, fallback?.id ?? ""),
        title: pick(category.title, fallback?.title ?? ""),
        intro: pick(category.description, fallback?.intro ?? ""),
        anchor: fallback?.anchor ?? "",
        hidden: category.hidden === true,
      };
    }),
    commentsClosedMessage: pick(
      cms?.commentsClosedMessage,
      "Discussion opens once the comment backend is connected. Until then, bring your thoughts to the community — that is where the good arguments happen anyway."
    ),
  };
}

/* ============================================================ policy pages */

export type PolicyContent = {
  slug: string;
  title: string;
  intro: string;
  seo: PageSeo;
  sections: { heading: string; body: string }[];
};

export async function getPolicyContent(
  slug: PolicySlug
): Promise<PolicyContent | null> {
  const { live, data: all } = await cmsFetch<
    {
      slug?: string;
      title?: string;
      intro?: string;
      sections?: { heading?: string; body?: string }[];
      seo?: { title?: string; description?: string; ogImage?: CmsFigure };
    }[]
  >(policyPagesQuery);
  const cms = all?.find((p) => p.slug === slug);
  const seedPolicy = policies[slug];

  // Sanity answered and this policy is not among the published documents:
  // it has been unpublished or deleted, and the route 404s rather than
  // quietly serving the shipped copy.
  if (live && !cms) return null;

  const title = pick(cms?.title, seedPolicy.title);
  const intro = pick(cms?.intro, seedPolicy.intro);

  return {
    slug,
    title,
    intro,
    // The page's own SEO tab wins; otherwise the meta title follows the
    // heading an editor set, rather than the copy shipped in the repo.
    seo: {
      title: pick(cms?.seo?.title, title),
      description: pick(cms?.seo?.description, intro),
      image: resolveImage(cms?.seo?.ogImage)?.src ?? (await getDefaultOgImage()),
    },
    sections: pickList(cms?.sections, fallback([...seedPolicy.sections], live), (section, i) => ({
      heading: pick(section.heading, seedPolicy.sections[i]?.heading ?? ""),
      body: pick(section.body, seedPolicy.sections[i]?.body ?? ""),
    })),
  };
}

/* =========================================================== site settings */

export type SiteContent = {
  name: string;
  tagline: string;
  description: string;
  parent: string;
  parentUrl: string;
  contactEmail: string;
  address: string[];
  phone: string | null;
  socials: { instagram: string; youtube: string; linkedin: string; twitter: string };
  logo: ResolvedImage | undefined;
  mainNav: { label: string; href: string }[];
  knowledgeBaseNav: { label: string; href: string }[];
  footerNav: {
    community: { title: string; links: { label: string; href: string }[] };
    company: { title: string; links: { label: string; href: string }[] };
  };
  navCta: { label: string; knowledgeLabel: string; href: string };
  policyNav: { label: string; href: string }[];
  joinFormUrl: string;
};

type CmsLinks = { label?: string; href?: string }[] | undefined;

function links(cms: CmsLinks, seedLinks: readonly { label: string; href: string }[]) {
  return pickList(cms, [...seedLinks], (link, i) => ({
    label: pick(link.label, seedLinks[i]?.label ?? ""),
    href: pick(link.href, seedLinks[i]?.href ?? "/"),
  }));
}

export async function getSiteContent(): Promise<SiteContent> {
  const { live, data: cms } = await cmsFetch<{
    name?: string;
    tagline?: string;
    description?: string;
    parent?: string;
    parentUrl?: string;
    logo?: CmsFigure;
    contactEmail?: string;
    address?: string[];
    phone?: string;
    socials?: Partial<SiteContent["socials"]>;
    mainNav?: CmsLinks;
    knowledgeBaseNav?: CmsLinks;
    footerCommunity?: { title?: string; links?: CmsLinks };
    footerCompany?: { title?: string; links?: CmsLinks };
    navCta?: { label?: string; knowledgeLabel?: string; href?: string };
    policyNav?: CmsLinks;
    joinFormUrl?: string;
  } | null>(siteSettingsQuery);

  return {
    name: pick(cms?.name, siteConfig.name),
    tagline: pick(cms?.tagline, siteConfig.tagline),
    description: pick(cms?.description, siteConfig.description),
    parent: pick(cms?.parent, siteConfig.parent),
    parentUrl: pick(cms?.parentUrl, siteConfig.parentUrl),
    contactEmail: pick(cms?.contactEmail, siteConfig.contactEmail),
    address: pick(cms?.address, [...siteConfig.address]),
    // A phone number that has not been supplied stays null, so the footer
    // renders its honest placeholder rather than an invented number.
    phone: pick(cms?.phone, siteConfig.phone) || null,
    socials: {
      instagram: pick(cms?.socials?.instagram, siteConfig.socials.instagram),
      youtube: pick(cms?.socials?.youtube, siteConfig.socials.youtube),
      linkedin: pick(cms?.socials?.linkedin, siteConfig.socials.linkedin),
      twitter: pick(cms?.socials?.twitter, siteConfig.socials.twitter),
    },
    logo: resolveImage(cms?.logo),
    mainNav: links(cms?.mainNav, mainNav),
    knowledgeBaseNav: links(cms?.knowledgeBaseNav, knowledgeBaseNav),
    footerNav: {
      community: {
        title: pick(cms?.footerCommunity?.title, footerNav.community.title),
        links: links(cms?.footerCommunity?.links, footerNav.community.links),
      },
      company: {
        title: pick(cms?.footerCompany?.title, footerNav.company.title),
        links: links(cms?.footerCompany?.links, footerNav.company.links),
      },
    },
    navCta: {
      label: pick(cms?.navCta?.label, "Join Pinkfly"),
      knowledgeLabel: pick(cms?.navCta?.knowledgeLabel, "Join Our Community"),
      href: pick(cms?.navCta?.href, "/join"),
    },
    policyNav: links(cms?.policyNav, policyNav),
    joinFormUrl: pick(cms?.joinFormUrl, integrations.joinFormUrl),
  };
}

/* ================================================================= partners */

export async function getPartners(): Promise<
  { name: string; url?: string; logo?: ResolvedImage }[]
> {
  const { live, data: cms } = await cmsFetch<{ name?: string; url?: string; logo?: CmsFigure }[]>(
    partnersQuery
  );
  return pickList(
    cms,
    seed.trust.logos.map((name) => ({ name, url: undefined, logo: undefined })),
    (partner) => ({
      name: partner.name ?? "",
      url: partner.url,
      logo: resolveImage(partner.logo),
    })
  );
}

/* =============================================================== page SEO */

export type PageSeo = {
  title: string;
  description: string;
  /**
   * The share image, resolved to a URL. A page's own SEO image wins; the
   * site-wide default in Site settings stands in when it has none, and the
   * shipped logo card when neither is set.
   */
  image?: string;
};

const SEO_QUERIES: Record<string, string> = {
  home: homePageQuery,
  about: aboutPageQuery,
  join: joinPageQuery,
  events: eventsPageQuery,
  knowledgeBase: knowledgeBasePageQuery,
};

/**
 * A page's meta title and description.
 *
 * Editors set these per page in the Studio's SEO tab. `home` is the one
 * exception: its seed lives on the region, because each regional homepage
 * has its own title, so only an explicit CMS value overrides it.
 */
export async function getPageSeo(
  page: keyof typeof SEO_QUERIES,
  seedSeo: PageSeo
): Promise<PageSeo> {
  const { data: doc } = await cmsFetch<{
    seo?: { title?: string; description?: string; ogImage?: CmsFigure };
  } | null>(SEO_QUERIES[page]);

  return {
    title: pick(doc?.seo?.title, seedSeo.title),
    description: pick(doc?.seo?.description, seedSeo.description),
    image: resolveImage(doc?.seo?.ogImage)?.src ?? (await getDefaultOgImage()),
  };
}

/**
 * The site-wide share image from Site settings, used by any page that has not
 * set its own. Undefined falls through to the shipped logo card in
 * `src/lib/seo.ts`.
 */
export async function getDefaultOgImage(): Promise<string | undefined> {
  const { data } = await cmsFetch<{ defaultOgImage?: CmsFigure } | null>(
    siteSettingsQuery
  );
  return resolveImage(data?.defaultOgImage)?.src;
}
