import { siteConfig } from "@/config/site";
import { regionPath, type Region } from "@/lib/region";
import type { KbEntry } from "@/data/knowledge-base";
import type { PinkflyEvent } from "@/data/events";

/**
 * Schema.org structured data.
 *
 * The metadata builder already gives every page a canonical URL, an hreflang
 * set and share tags. What it cannot express is what a page *is* — that this
 * one is an article with an author and a date, that one an event with a place
 * and a start time. Search engines read that from JSON-LD, and without it a
 * result is a blue link where it could be a date, a byline or a venue.
 *
 * Everything here is built from data the page already renders. Nothing is
 * asserted that a reader cannot also see: a rating nobody gave, or an offer
 * that does not exist, is what earns a manual penalty.
 */

const abs = (path: string) =>
  `${siteConfig.url}${path === "/" ? "" : path}`;

/** The organisation itself, and the site. Rendered once, in the layout. */
export function organizationSchema() {
  const socials = Object.values(siteConfig.socials ?? {}).filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        logo: {
          "@type": "ImageObject",
          url: abs("/brand/pinkfly-logo.png"),
        },
        email: siteConfig.contactEmail,
        ...(siteConfig.parentUrl
          ? {
              parentOrganization: {
                "@type": "Organization",
                name: siteConfig.parent,
                url: siteConfig.parentUrl,
              },
            }
          : null),
        ...(socials.length > 0 ? { sameAs: socials } : null),
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: { "@id": `${siteConfig.url}/#organization` },
      },
    ],
  };
}

/** One Knowledge Base entry. */
export function articleSchema(entry: KbEntry, region: Region) {
  const url = abs(
    regionPath(region, `/knowledge-base/${entry.category}/${entry.slug}`)
  );
  const image = entry.heroImage?.src || entry.image?.src;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: entry.title,
    description: entry.excerpt,
    ...(image ? { image: [image] } : null),
    ...(entry.publishedAt ? { datePublished: entry.publishedAt } : null),
    author: {
      "@type": "Person",
      name: entry.author.name,
      ...(entry.author.role ? { jobTitle: entry.author.role } : null),
    },
    publisher: { "@id": `${siteConfig.url}/#organization` },
    ...(entry.tag ? { articleSection: entry.tag } : null),
  };
}

/**
 * One event.
 *
 * `eventAttendanceMode` and a `location` are what make a result show a date
 * and a place. An online event has a virtual location — a URL — rather than
 * an address, and saying otherwise would put a street on a webinar.
 */
export function eventSchema(event: PinkflyEvent, region: Region) {
  const url = abs(regionPath(region, `/events/${event.slug}`));
  const online = event.format === "Online";
  const end =
    event.startsAt && event.durationMinutes
      ? new Date(
          new Date(event.startsAt).getTime() + event.durationMinutes * 60_000
        ).toISOString()
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "@id": `${url}#event`,
    name: event.title,
    description: event.excerpt,
    url,
    ...(event.startsAt ? { startDate: event.startsAt } : null),
    ...(end ? { endDate: end } : null),
    eventAttendanceMode: online
      ? "https://schema.org/OnlineEventAttendanceMode"
      : "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    ...(event.image?.src ? { image: [event.image.src] } : null),
    location: online
      ? { "@type": "VirtualLocation", url: event.registrationUrl || url }
      : {
          "@type": "Place",
          name: event.venue || event.city || siteConfig.name,
          address: {
            "@type": "PostalAddress",
            ...(event.venue ? { streetAddress: event.venue } : null),
            ...(event.city ? { addressLocality: event.city } : null),
          },
        },
    organizer: { "@id": `${siteConfig.url}/#organization` },
    // Only a real price. A free event says so; one whose price is unknown
    // says nothing rather than implying it is free.
    ...(typeof event.price === "number"
      ? {
          offers: {
            "@type": "Offer",
            price: event.price,
            priceCurrency: region.currency?.code ?? "INR",
            availability: "https://schema.org/InStock",
            url: event.registrationUrl || url,
          },
        }
      : null),
  };
}

/** The FAQs page: every question and its answer. */
export function faqSchema(
  groups: { items: { question: string; answer: string }[] }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: groups.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      }))
    ),
  };
}

/** A trail from the site root to this page. */
export function breadcrumbSchema(
  region: Region,
  trail: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: siteConfig.name, path: "/" },
      ...trail,
    ].map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: abs(regionPath(region, crumb.path)),
    })),
  };
}
