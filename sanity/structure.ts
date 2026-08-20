import type { StructureResolver } from "sanity/structure";

/**
 * Studio navigation.
 *
 * Pages are singletons — one document each, opened directly rather than as a
 * list you have to click into. Collections stay as lists, because Pink Fly
 * adds and removes those over time.
 */
const SINGLETONS: [type: string, title: string][] = [
  ["homePage", "Homepage"],
  ["aboutPage", "About"],
  ["joinPage", "Join Community"],
  ["eventsPage", "Events"],
  ["knowledgeBasePage", "Knowledge Base"],
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Pink Fly")
    .items([
      S.listItem()
        .title("Pages")
        .child(
          S.list()
            .title("Pages")
            .items(
              SINGLETONS.map(([type, title]) =>
                S.listItem()
                  .title(title)
                  .id(type)
                  .child(S.document().schemaType(type).documentId(type).title(title))
              )
            )
        ),
      S.divider(),
      S.documentTypeListItem("event").title("Events"),
      S.documentTypeListItem("kbEntry").title("Knowledge Base entries"),
      S.documentTypeListItem("teamMember").title("Team"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.documentTypeListItem("initiative").title("Initiatives"),
      S.documentTypeListItem("partner").title("Partners"),
      S.divider(),
      S.documentTypeListItem("policyPage").title("Policy pages"),
      S.documentTypeListItem("region").title("Regions"),
      S.listItem()
        .title("Site settings")
        .id("siteSettings")
        .child(
          S.document()
            .schemaType("siteSettings")
            .documentId("siteSettings")
            .title("Site settings")
        ),
    ]);
