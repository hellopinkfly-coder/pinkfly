/**
 * Social post links, and the thumbnail behind them.
 *
 * The section is a wall of link cards: an editor pastes the URL of a post and
 * it appears on the homepage, opening the real post when clicked.
 *
 * Where a thumbnail can be derived from the URL alone it is — YouTube serves a
 * stable still for every video id, so a YouTube link needs nothing else. The
 * others (Instagram above all) do not expose a thumbnail without an
 * authenticated API call, so those cards carry an image the editor supplies.
 * That keeps the section a pure build-time render: no runtime scraping, no
 * tokens, nothing that can rate-limit or go stale mid-request.
 */
export type SocialPlatform =
  | "instagram"
  | "youtube"
  | "linkedin"
  | "twitter"
  | "facebook"
  | "link";

/** Reads the platform off the URL's host, so an editor never has to pick one. */
export function platformFromUrl(url: string): SocialPlatform {
  let host: string;
  try {
    host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "link";
  }

  if (host.endsWith("instagram.com")) return "instagram";
  if (host.endsWith("youtube.com") || host === "youtu.be") return "youtube";
  if (host.endsWith("linkedin.com")) return "linkedin";
  if (host === "x.com" || host.endsWith("twitter.com")) return "twitter";
  if (host.endsWith("facebook.com") || host === "fb.watch") return "facebook";
  return "link";
}

/**
 * The video id in any of the shapes YouTube hands out: `watch?v=`, `youtu.be/`,
 * `/shorts/`, `/embed/` and `/live/`.
 */
export function youtubeId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
  const id =
    host === "youtu.be"
      ? parsed.pathname.slice(1)
      : parsed.searchParams.get("v") ??
        /^\/(?:shorts|embed|live)\/([^/]+)/.exec(parsed.pathname)?.[1] ??
        null;

  return id && /^[\w-]{6,20}$/.test(id) ? id : null;
}

/**
 * A thumbnail derived from the URL, or null when the platform does not expose
 * one — in which case the card falls back to the image on the document.
 */
export function thumbnailFromUrl(url: string): string | null {
  const id = youtubeId(url);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
}
