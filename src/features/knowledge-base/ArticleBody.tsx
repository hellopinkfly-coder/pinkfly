import Image from "next/image";
import { Download, FileText } from "lucide-react";
import { RichText } from "@/components/shared/RichText";
import type { KbBlock } from "@/data/knowledge-base";

/**
 * A Knowledge Base entry's body, in the order the editor arranged it.
 *
 * Paragraphs carry the prose; between them an editor can place a picture, a
 * video or a file to download, and each renders at the article's measure so
 * the reading rhythm holds.
 */
export function ArticleBody({ blocks }: { blocks: KbBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.kind) {
          case "paragraph":
            return <p key={i}>{block.text}</p>;

          case "rich":
            return <RichText key={i} value={block.value as never} />;

          case "image":
            return (
              // Wider than the text it sits in: the picture breaks out of the
              // reading measure on larger screens, so it carries weight
              // without the prose losing its line length.
              <figure key={i} className="my-11 lg:-mx-16 xl:-mx-24">
                <div className="relative aspect-[3/2] overflow-hidden rounded-[var(--pf-radius-lg)]">
                  <Image
                    src={block.src}
                    alt={block.alt}
                    fill
                    sizes="(max-width: 1024px) 92vw, 1000px"
                    className="object-cover"
                  />
                </div>
                {block.caption && (
                  <figcaption className="mt-3 text-sm text-[var(--pf-muted)] lg:mx-16 xl:mx-24">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "video":
            return <VideoBlock key={i} url={block.url} title={block.title} />;

          case "file":
            return (
              <a
                key={i}
                href={block.url}
                download
                className="group my-9 flex items-center gap-4 rounded-[var(--pf-radius-lg)] border border-[var(--pf-border)] bg-[var(--pf-surface-muted)] px-5 py-4 no-underline transition-colors hover:border-[var(--pf-accent)]/40"
              >
                <FileText
                  size={22}
                  aria-hidden
                  className="shrink-0 text-[var(--pf-accent)]"
                />
                <span className="flex min-w-0 flex-col">
                  <span className="font-bold text-[var(--pf-heading)]">
                    {block.title}
                  </span>
                  <span className="text-sm text-[var(--pf-muted)]">
                    {[block.description, block.sizeLabel]
                      .filter(Boolean)
                      .join(" · ") || "Download"}
                  </span>
                </span>
                <Download
                  size={18}
                  aria-hidden
                  className="ml-auto shrink-0 text-[var(--pf-muted)] transition-colors group-hover:text-[var(--pf-accent)]"
                />
              </a>
            );
        }
      })}
    </>
  );
}

/**
 * A video, however the editor linked it.
 *
 * YouTube and Vimeo links are pasted from the browser bar, which is not an
 * embeddable URL, so they are converted to one. Anything else is played
 * directly — a link to an .mp4 is a perfectly good video.
 */
function VideoBlock({ url, title }: { url: string; title?: string }) {
  const embed = embedUrl(url);

  return (
    <figure className="my-11 lg:-mx-16 xl:-mx-24">
      <div className="relative aspect-video overflow-hidden rounded-[var(--pf-radius-lg)] bg-black">
        {embed ? (
          <iframe
            src={embed}
            title={title ?? "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video src={url} controls className="absolute inset-0 h-full w-full" />
        )}
      </div>
      {title && (
        <figcaption className="mt-3 text-sm text-[var(--pf-muted)] lg:mx-16 xl:mx-24">
          {title}
        </figcaption>
      )}
    </figure>
  );
}

/** The embeddable form of a YouTube or Vimeo link, or null for anything else. */
function embedUrl(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "");

  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (host === "youtube.com" || host === "m.youtube.com") {
    if (parsed.pathname.startsWith("/embed/")) return parsed.toString();
    const id = parsed.searchParams.get("v");
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (host === "vimeo.com") {
    const id = parsed.pathname.split("/").filter(Boolean)[0];
    return id && /^\d+$/.test(id) ? `https://player.vimeo.com/video/${id}` : null;
  }

  return null;
}
