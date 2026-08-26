import { ArrowUpRight } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ImageFrame } from "@/components/shared/ImageFrame";
import { Reveal } from "@/components/shared/Reveal";
import {
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
  TwitterIcon,
} from "@/components/shared/SocialIcons";
import type { HomeContent } from "@/lib/cms/content";
import type { SocialPlatform } from "@/lib/social";

/**
 * The social wall, above the footer.
 *
 * Each card is the post's own picture with a platform badge; clicking it
 * opens the post itself in a new tab. Editors add a card by pasting the
 * post's URL in Sanity — see `sanity/schemas/objects/socialPost.ts`.
 */

const badges: Partial<
  Record<SocialPlatform, { icon: typeof InstagramIcon; label: string }>
> = {
  instagram: { icon: InstagramIcon, label: "Instagram" },
  youtube: { icon: YoutubeIcon, label: "YouTube" },
  linkedin: { icon: LinkedinIcon, label: "LinkedIn" },
  twitter: { icon: TwitterIcon, label: "X" },
};

export function SocialWall({ content }: { content: HomeContent["social"] }) {
  if (content.posts.length === 0) return null;

  return (
    <Section id="social">
      <SectionHeading
        eyebrow={content.heading.eyebrow}
        title={content.heading.headline}
        intro={content.heading.intro}
      />

      <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
        {content.posts.map((post, i) => {
          const badge = badges[post.platform];

          return (
            <Reveal key={`${post.url}-${i}`} delay={i * 0.06}>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-[var(--pf-radius-lg)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--pf-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--pf-bg)]"
              >
                <div className="relative">
                  <ImageFrame
                    src={post.image.src}
                    alt={post.image.alt}
                    aspect="aspect-square"
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="rounded-[var(--pf-radius-lg)]"
                  />

                  {badge && (
                    <span
                      className="pointer-events-none absolute left-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm"
                      aria-hidden
                    >
                      <badge.icon size={16} />
                    </span>
                  )}

                  <span
                    className="pointer-events-none absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[var(--pf-heading)] opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                    aria-hidden
                  >
                    <ArrowUpRight size={16} />
                  </span>
                </div>

                {post.caption && (
                  <p className="mt-3 text-sm leading-snug text-[var(--pf-body)] transition-colors duration-200 group-hover:text-[var(--pf-accent)]">
                    {post.caption}
                    <span className="sr-only">
                      {badge ? ` — opens on ${badge.label}` : " — opens in a new tab"}
                    </span>
                  </p>
                )}
              </a>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
