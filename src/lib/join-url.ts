import type { SiteContent } from "@/lib/cms/content";
import { regionPath, type Region } from "@/lib/region";

/**
 * Where "join" leads, for every button on the site that says so.
 *
 * It was worked out inline in ten places — `region.form.googleFormUrl ||
 * site.joinFormUrl` — which is fine until the answer changes. When the
 * WhatsApp community link arrived it only reached the one button whose line
 * was edited, so the header went to the community while the closing band on
 * every page still opened a form. One function now answers it everywhere.
 *
 * The order is most specific first:
 *
 *  1. the WhatsApp community, when one is set in Site settings — an editor
 *     who pastes that link has decided people should land in the room;
 *  2. the region's own registration form;
 *  3. the site-wide registration form;
 *  4. nothing, which each caller renders as "registration opens shortly"
 *     rather than as a dead button.
 */
export function joinUrl(site: SiteContent, region: Region): string {
  return site.whatsappCommunityUrl || region.form.googleFormUrl || site.joinFormUrl || "";
}

/**
 * A call to action's destination, with "join" resolved.
 *
 * Buttons that say join carry `/join` in the Studio — the page that explains
 * the community and then offers the way in. Once there is a community room
 * to send people to, that page is a stop on the way rather than the
 * destination, so a CTA pointing at it resolves to `joinUrl` instead. Any
 * other href is a link the editor meant literally and is left alone.
 */
export function ctaHref(href: string, join: string, region: Region): string {
  const path = href.trim().replace(/\/+$/, "");
  const isJoin = path === "/join" || path === "#join" || path.endsWith("/join");
  if (isJoin && join) return join;
  return regionPath(region, href);
}
