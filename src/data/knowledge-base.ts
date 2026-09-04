/**
 * Knowledge Base content.
 *
 * Shaped like a CMS response on purpose: every entry is a plain object with a
 * stable `slug`, and the accessor functions below are the only thing the UI
 * touches. Swapping this file for a CMS fetch means changing the four
 * functions at the bottom and nothing else.
 */

export type KbCategory = "articles" | "business-news" | "government-policies";

/** One block of an entry's body. */
export type KbBlock =
  | { kind: "paragraph"; text: string }
  /** Portable Text from Sanity — paragraphs that may carry links. */
  | { kind: "rich"; value: unknown[] }
  | { kind: "image"; src: string; alt: string; caption?: string }
  | { kind: "video"; url: string; title?: string }
  | {
      kind: "file";
      url: string;
      title: string;
      description?: string;
      /** Human-readable size, e.g. "1.2 MB". Absent when Sanity did not report one. */
      sizeLabel?: string;
    };

/** Plain copy as body blocks — what the seed and any string CMS body become. */
export function paragraphs(lines: string[]): KbBlock[] {
  return lines.map((text) => ({ kind: "paragraph", text }) as const);
}

export type KbEntry = {
  slug: string;
  category: KbCategory;
  title: string;
  /** One-line summary used on cards and in metadata. */
  excerpt: string;
  author: { name: string; role: string };
  /** ISO date. */
  publishedAt: string;
  readingTime: string;
  image: { src: string; alt: string };
  /** Small label rendered in the corner of the card image. */
  tag: string;
  /**
   * The article, in the order it reads. Paragraphs carry the copy; the other
   * three blocks are what an editor drops between them in the Studio — a
   * picture, a video, or a file to download.
   */
  body: KbBlock[];
  /** Business news only — the source the story is drawn from. */
  source?: { name: string; url?: string };
  /** Government policies only — the structured summary the wireframe shows. */
  policy?: {
    authority: string;
    status: "Active" | "Announced" | "In consultation";
    effectiveFrom: string;
    appliesTo: string;
    keyPoints: string[];
  };
};

const img = (id: string, alt: string) => ({
  src: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`,
  alt,
});

const PLACEHOLDER_BODY = [
  "Placeholder body copy. This entry is structured exactly as a real one will be, so replacing this file with a CMS feed requires no change to the page.",
  "Each paragraph in the `body` array renders as its own block, with the typography, measure and rhythm defined by the article layout. Long-form content stays comfortably readable at every breakpoint.",
  "Images, pull quotes and callouts can be layered in later without altering the surrounding structure — the layout is built to absorb them.",
];

export const kbEntries: KbEntry[] = [
  /* ------------------------------------------------------- Recent articles */
  {
    slug: "pricing-without-apologising",
    category: "articles",
    title: "Pricing without apologising",
    excerpt:
      "How founders in the community set a number, hold it, and stop discounting out of nervousness.",
    author: { name: "Placeholder Author", role: "Contributor" },
    publishedAt: "2026-07-28",
    readingTime: "10 min read",
    image: img("1554224155-6726b3ff858f", "A notebook with pricing calculations"),
    tag: "Playbook",
    body: paragraphs(PLACEHOLDER_BODY),
  },
  {
    slug: "your-first-ten-hires",
    category: "articles",
    title: "Your first ten hires decide the next ten years",
    excerpt:
      "A practical framework for hiring early, from founders who have done it twice.",
    author: { name: "Placeholder Author", role: "Contributor" },
    publishedAt: "2026-07-19",
    readingTime: "10 min read",
    image: img("1521737604893-d14cc237f11d", "A small team in a hiring conversation"),
    tag: "Hiring",
    body: paragraphs(PLACEHOLDER_BODY),
  },
  {
    slug: "the-quiet-work-of-retention",
    category: "articles",
    title: "The quiet work of retention",
    excerpt:
      "Growth gets the headlines. Keeping the customers you already have is what compounds.",
    author: { name: "Placeholder Author", role: "Contributor" },
    publishedAt: "2026-07-11",
    readingTime: "8 min read",
    image: img("1460925895917-afdab827c52f", "An analytics dashboard on a laptop"),
    tag: "Growth",
    body: paragraphs(PLACEHOLDER_BODY),
  },
  {
    slug: "raising-without-a-warm-intro",
    category: "articles",
    title: "Raising without a warm intro",
    excerpt:
      "What actually works when you don't already know the investors on your list.",
    author: { name: "Placeholder Author", role: "Contributor" },
    publishedAt: "2026-06-30",
    readingTime: "12 min read",
    image: img("1454165804606-c3d57bc86b40", "A founder preparing a pitch deck"),
    tag: "Funding",
    body: paragraphs(PLACEHOLDER_BODY),
  },
  {
    slug: "building-in-a-slow-quarter",
    category: "articles",
    title: "Building through a slow quarter",
    excerpt:
      "Six founders on what they changed — and what they deliberately left alone.",
    author: { name: "Placeholder Author", role: "Contributor" },
    publishedAt: "2026-06-18",
    readingTime: "9 min read",
    image: img("1531482615713-2afd69097998", "A founder working late at a desk"),
    tag: "Community",
    body: paragraphs(PLACEHOLDER_BODY),
  },

  /* ---------------------------------------------------------- Business news */
  {
    slug: "women-led-startups-funding-round-up",
    category: "business-news",
    title: "Women-led startups: this quarter's funding round-up",
    excerpt:
      "A summary of the raises, the sectors leading them, and what investors said publicly.",
    author: { name: "Placeholder Author", role: "News desk" },
    publishedAt: "2026-08-04",
    readingTime: "6 min read",
    image: img("1611974789855-9c2a0a7236a3", "A city skyline of business districts"),
    tag: "Funding",
    source: { name: "Placeholder source" },
    body: paragraphs(PLACEHOLDER_BODY),
  },
  {
    slug: "small-business-lending-shifts",
    category: "business-news",
    title: "What shifting small-business lending means for founders",
    excerpt:
      "Credit conditions are moving. Here is the practical read for an owner-operated business.",
    author: { name: "Placeholder Author", role: "News desk" },
    publishedAt: "2026-07-25",
    readingTime: "7 min read",
    image: img("1454165833767-8ce7c7c0e6ec", "Financial charts on a desk"),
    tag: "Finance",
    source: { name: "Placeholder source" },
    body: paragraphs(PLACEHOLDER_BODY),
  },
  {
    slug: "retail-and-d2c-outlook",
    category: "business-news",
    title: "Retail and D2C: the outlook founders are planning against",
    excerpt:
      "Channel costs, marketplace terms and the return of physical retail.",
    author: { name: "Placeholder Author", role: "News desk" },
    publishedAt: "2026-07-14",
    readingTime: "6 min read",
    image: img("1441986300917-64674bd600d8", "A retail storefront"),
    tag: "Retail",
    source: { name: "Placeholder source" },
    body: paragraphs(PLACEHOLDER_BODY),
  },
  {
    slug: "ai-tooling-in-small-teams",
    category: "business-news",
    title: "How small teams are actually using AI tooling",
    excerpt: "Beyond the demos — where founders report real time savings.",
    author: { name: "Placeholder Author", role: "News desk" },
    publishedAt: "2026-07-02",
    readingTime: "8 min read",
    image: img("1518770660439-4636190af475", "Circuit board close-up"),
    tag: "Technology",
    source: { name: "Placeholder source" },
    body: paragraphs(PLACEHOLDER_BODY),
  },

  /* ---------------------------------------------------- Government policies */
  {
    slug: "women-entrepreneurship-scheme",
    category: "government-policies",
    title: "Women entrepreneurship support scheme",
    excerpt:
      "Eligibility, benefits and the documents you need before you apply.",
    author: { name: "Placeholder Author", role: "Policy desk" },
    publishedAt: "2026-08-01",
    readingTime: "9 min read",
    image: img("1589829545856-d10d557cf95f", "A government building facade"),
    tag: "Scheme",
    policy: {
      authority: "Placeholder authority",
      status: "Announced",
      effectiveFrom: "To be confirmed",
      appliesTo: "Women-owned small and medium businesses",
      keyPoints: [
        "Placeholder summary point — replace with the published policy text.",
        "Placeholder eligibility criterion.",
        "Placeholder application window and process.",
      ],
    },
    body: paragraphs(PLACEHOLDER_BODY),
  },
  {
    slug: "small-business-tax-changes",
    category: "government-policies",
    title: "Small business tax changes explained",
    excerpt:
      "What changes, when it takes effect, and the filing deadlines to diarise.",
    author: { name: "Placeholder Author", role: "Policy desk" },
    publishedAt: "2026-07-21",
    readingTime: "11 min read",
    image: img("1450101499163-c8848c66ca85", "Tax documents on a desk"),
    tag: "Taxation",
    policy: {
      authority: "Placeholder authority",
      status: "In consultation",
      effectiveFrom: "To be confirmed",
      appliesTo: "Registered small businesses",
      keyPoints: [
        "Placeholder summary point — replace with the published policy text.",
        "Placeholder threshold change.",
        "Placeholder compliance deadline.",
      ],
    },
    body: paragraphs(PLACEHOLDER_BODY),
  },
  {
    slug: "export-incentives-for-small-exporters",
    category: "government-policies",
    title: "Export incentives for first-time exporters",
    excerpt:
      "A plain-language guide to the incentives available to a small exporter.",
    author: { name: "Placeholder Author", role: "Policy desk" },
    publishedAt: "2026-07-08",
    readingTime: "10 min read",
    image: img("1494412574643-ff11b0a5c1c3", "Shipping containers at a port"),
    tag: "Trade",
    policy: {
      authority: "Placeholder authority",
      status: "Active",
      effectiveFrom: "To be confirmed",
      appliesTo: "Businesses exporting for the first time",
      keyPoints: [
        "Placeholder summary point — replace with the published policy text.",
        "Placeholder incentive value.",
        "Placeholder registration requirement.",
      ],
    },
    body: paragraphs(PLACEHOLDER_BODY),
  },
  {
    slug: "digital-compliance-for-online-sellers",
    category: "government-policies",
    title: "Digital compliance rules for online sellers",
    excerpt:
      "Data, disclosure and consumer-protection duties for a business selling online.",
    author: { name: "Placeholder Author", role: "Policy desk" },
    publishedAt: "2026-06-26",
    readingTime: "8 min read",
    image: img("1563986768609-322da13575f3", "A laptop showing an online store"),
    tag: "Compliance",
    policy: {
      authority: "Placeholder authority",
      status: "Active",
      effectiveFrom: "To be confirmed",
      appliesTo: "Businesses selling to consumers online",
      keyPoints: [
        "Placeholder summary point — replace with the published policy text.",
        "Placeholder disclosure requirement.",
        "Placeholder penalty for non-compliance.",
      ],
    },
    body: paragraphs(PLACEHOLDER_BODY),
  },
];

export const kbCategories: {
  id: KbCategory;
  title: string;
  intro: string;
  /** Anchor used by the Knowledge Base navigation. */
  anchor: string;
}[] = [
  {
    id: "articles",
    title: "Recent Articles",
    intro: "Playbooks and essays from the Pinkfly community.",
    anchor: "recent-articles",
  },
  {
    id: "business-news",
    title: "Business News",
    intro: "The stories shaping the market you're building in.",
    anchor: "business-news",
  },
  {
    id: "government-policies",
    title: "Government Policies",
    intro: "Policy changes that affect how you register, hire, sell and file.",
    anchor: "government-policies",
  },
];

/* ------------------------------------------------------------- Accessors -- */
/** Everything in a category, newest first. */
export function getEntriesByCategory(category: KbCategory): KbEntry[] {
  return kbEntries
    .filter((e) => e.category === category)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getEntry(category: KbCategory, slug: string): KbEntry | undefined {
  return kbEntries.find((e) => e.category === category && e.slug === slug);
}

/** Sibling entries used by the "Recent" rail at the foot of an entry page. */
export function getRelatedEntries(entry: KbEntry, limit = 3): KbEntry[] {
  return getEntriesByCategory(entry.category)
    .filter((e) => e.slug !== entry.slug)
    .slice(0, limit);
}

export function getAllEntryPaths(): { category: KbCategory; slug: string }[] {
  return kbEntries.map(({ category, slug }) => ({ category, slug }));
}

export function isKbCategory(value: string): value is KbCategory {
  return kbCategories.some((c) => c.id === value);
}

/* ------------------------------------------------------------------------- */
/* List-taking variants, so the same helpers work over CMS entries as well as */
/* the seed list above. See `getKbEntries()` in src/lib/cms/collections.ts.   */

export function entriesByCategory(list: KbEntry[], category: KbCategory): KbEntry[] {
  return list
    .filter((e) => e.category === category)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function findEntry(
  list: KbEntry[],
  category: KbCategory,
  slug: string
): KbEntry | undefined {
  return list.find((e) => e.category === category && e.slug === slug);
}

export function relatedEntries(
  list: KbEntry[],
  entry: KbEntry,
  limit = 3
): KbEntry[] {
  return entriesByCategory(list, entry.category)
    .filter((e) => e.slug !== entry.slug)
    .slice(0, limit);
}
