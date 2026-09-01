import type { StructureResolver } from "sanity/structure";

/**
 * Studio navigation.
 *
 * Pages are singletons — one document each, opened directly rather than as a
 * list you have to click into. Collections stay as lists, because PinkFly
 * adds and removes those over time.
 */
const SINGLETONS: [type: string, title: string][] = [
  ["homePage", "Homepage"],
  ["aboutPage", "About"],
  ["joinPage", "Join Community"],
  ["eventsPage", "Events"],
  ["knowledgeBasePage", "Knowledge Base"],
];

/**
 * Collection lists hide the documents left behind by the id migration.
 *
 * Those ids contain a dot, which Sanity reads as a path — and documents in a
 * path are private, so the site cannot see them. They were copied to
 * dot-free ids; the originals remain only because deleting a document inside
 * a path needs a higher-privileged token than the one that ran the migration.
 * They are dead weight, not content, so the Studio does not list them.
 */
const VISIBLE = 'count(string::split(_id, ".")) == 1';

const collection = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
  S.listItem()
    .title(title)
    .id(type)
    .schemaType(type)
    .child(S.documentTypeList(type).title(title).filter(`_type == $type && ${VISIBLE}`).params({ type }));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("PinkFly")
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
      collection(S, "event", "Events"),
      collection(S, "kbEntry", "Knowledge Base entries"),
      collection(S, "teamMember", "Team"),
      collection(S, "testimonial", "Testimonials"),
      collection(S, "initiative", "Initiatives"),
      S.documentTypeListItem("partner").title("Partners"),
      S.divider(),
      collection(S, "policyPage", "Policy pages"),
      collection(S, "region", "Regions"),
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
