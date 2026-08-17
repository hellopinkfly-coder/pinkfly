import Link from "next/link";
import { siteConfig, footerNav } from "@/config/site";
import {
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/components/shared/SocialIcons";
import { OinkflyWordmark } from "@/components/brand/OinkflyMark";
import { Container } from "./Container";

const socialLinks = [
  { icon: InstagramIcon, href: siteConfig.socials.instagram, label: "Instagram" },
  { icon: LinkedinIcon, href: siteConfig.socials.linkedin, label: "LinkedIn" },
  { icon: TwitterIcon, href: siteConfig.socials.twitter, label: "Twitter (X)" },
  { icon: YoutubeIcon, href: siteConfig.socials.youtube, label: "YouTube" },
];

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

export function Footer() {
  return (
    <footer className="pf-on-surface mt-16 border-t border-[var(--pf-border)] bg-[var(--pf-surface)]">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" aria-label="Oinkfly — home" className="rounded-full">
              <OinkflyWordmark className="text-xl" markSize={28} />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-[var(--pf-text)]">
              India&apos;s community for ambitious women founders. A flagship
              initiative by {siteConfig.parent}.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--pf-border)] text-[var(--pf-text)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--pf-accent)] hover:text-[var(--pf-accent)]"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-wider text-[var(--pf-heading)]">
              Explore
            </h3>
            <ul className="mt-4 space-y-3">
              {footerNav.explore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[var(--pf-text)] transition-colors hover:text-[var(--pf-accent)]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-wider text-[var(--pf-heading)]">
              Connect
            </h3>
            <ul className="mt-4 space-y-3">
              {footerNav.connect.map((item) =>
                isExternal(item.href) ? (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--pf-text)] transition-colors hover:text-[var(--pf-accent)]"
                    >
                      {item.label}
                    </a>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-[var(--pf-text)] transition-colors hover:text-[var(--pf-accent)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[var(--pf-border)] pt-8 text-xs text-[var(--pf-muted)] sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. A {siteConfig.parent}{" "}
            initiative.
          </p>
          <p>Built for women told to be realistic.</p>
        </div>
      </Container>
    </footer>
  );
}
