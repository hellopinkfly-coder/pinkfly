import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig, footerNav } from "@/config/site";
import {
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/components/shared/SocialIcons";
import { Container } from "./Container";

const socialLinks = [
  { icon: InstagramIcon, href: siteConfig.socials.instagram, label: "Instagram" },
  { icon: LinkedinIcon, href: siteConfig.socials.linkedin, label: "LinkedIn" },
  { icon: TwitterIcon, href: siteConfig.socials.twitter, label: "Twitter (X)" },
  { icon: YoutubeIcon, href: siteConfig.socials.youtube, label: "YouTube" },
];

const linkGroups = [footerNav.join, footerNav.about, footerNav.policies];

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

function FooterLink({ href, label }: { href: string; label: string }) {
  const className =
    "text-sm text-[var(--pf-text)] transition-colors hover:text-[var(--pf-accent)]";

  return isExternal(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {label}
    </a>
  ) : (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t border-[var(--pf-border)] bg-[var(--pf-surface)]">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Brand — description, socials, contact */}
          <div className="max-w-sm">
            <Link
              href="/"
              className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-[var(--pf-heading)]"
            >
              Pink<span className="text-[var(--pf-accent)]">Fly</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-[var(--pf-text)]">
              India&apos;s most trusted community for ambitious women
              entrepreneurs. A flagship initiative by {siteConfig.parent}.
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

            <address className="mt-6 space-y-2.5 text-sm not-italic text-[var(--pf-text)]">
              <p className="flex items-start gap-2.5">
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-[var(--pf-accent)]"
                />
                <span>{siteConfig.address.join(", ")}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail size={16} className="shrink-0 text-[var(--pf-accent)]" />
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="transition-colors hover:text-[var(--pf-accent)]"
                >
                  {siteConfig.contactEmail}
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone size={16} className="shrink-0 text-[var(--pf-accent)]" />
                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="transition-colors hover:text-[var(--pf-accent)]"
                >
                  {siteConfig.phone}
                </a>
              </p>
            </address>
          </div>

          {/* Link groups — Join / About / Policies */}
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-[family-name:var(--font-display)] text-sm font-bold uppercase tracking-wider text-[var(--pf-heading)]">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((item) => (
                  <li key={item.href}>
                    <FooterLink href={item.href} label={item.label} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom strip */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[var(--pf-border)] pt-8 text-xs text-[var(--pf-muted)] sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p>
            Powered by{" "}
            <span className="font-bold text-[var(--pf-heading)]">
              {siteConfig.parent}
            </span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
