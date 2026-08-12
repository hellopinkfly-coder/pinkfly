"use client";

import Link from "next/link";
import { siteConfig, footerNav, policyNav } from "@/config/site";
import {
  InstagramIcon,
  LinkedinIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/components/shared/SocialIcons";
import { LogoMark } from "@/components/shared/Logo";
import { regionPath, type Region } from "@/lib/region";
import { Container } from "./Container";

const socialLinks = [
  { icon: InstagramIcon, href: siteConfig.socials.instagram, label: "Instagram" },
  { icon: YoutubeIcon, href: siteConfig.socials.youtube, label: "YouTube" },
  { icon: LinkedinIcon, href: siteConfig.socials.linkedin, label: "LinkedIn" },
  { icon: TwitterIcon, href: siteConfig.socials.twitter, label: "X" },
];

const isExternal = (href: string) => /^https?:\/\//.test(href);

/**
 * Site footer, built to the wireframe: brand + socials + address on the left,
 * two link columns to the right, and the Noboru World credit on its own line
 * beneath a rule. Address and phone come from the active region config.
 */
export function Footer({ region }: { region: Region }) {
  const columns = [footerNav.community, footerNav.company];

  return (
    <footer className="mt-20 border-t border-[var(--pf-border)] bg-[var(--pf-surface)]">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand, socials, address */}
          <div className="max-w-sm">
            <Link href={regionPath(region, "/")} aria-label="Pink Fly — home">
              <LogoMark size="md" />
            </Link>

            <div className="mt-5 flex gap-2.5">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Pink Fly on ${label}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--pf-border)] text-[var(--pf-text)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--pf-accent)] hover:text-[var(--pf-accent)]"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>

            <address className="mt-6 not-italic text-sm leading-relaxed text-[var(--pf-text)]">
              <span className="block font-bold text-[var(--pf-heading)]">
                Pink Fly {region.slug === "global" ? "" : region.shortName}
              </span>
              {region.address ? (
                region.address.map((line) => <span key={line} className="block">{line}</span>)
              ) : (
                <span className="block text-[var(--pf-muted)]">
                  Address coming soon
                </span>
              )}
              {region.phone ? (
                <a
                  href={`tel:${region.phone.replace(/[^\d+]/g, "")}`}
                  className="mt-2 block transition-colors hover:text-[var(--pf-accent)]"
                >
                  {region.phone}
                </a>
              ) : (
                <span className="mt-2 block text-[var(--pf-muted)]">
                  Phone coming soon
                </span>
              )}
              <a
                href={`mailto:${region.email ?? siteConfig.contactEmail}`}
                className="mt-1 block transition-colors hover:text-[var(--pf-accent)]"
              >
                {region.email ?? siteConfig.contactEmail}
              </a>
            </address>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h2 className="font-[family-name:var(--font-display)] text-xs font-bold uppercase tracking-[0.16em] text-[var(--pf-heading)]">
                {column.title}
              </h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((item) => {
                  const href = isExternal(item.href)
                    ? item.href
                    : regionPath(region, item.href.split("#")[0]) +
                      (item.href.includes("#") ? `#${item.href.split("#")[1]}` : "");
                  return (
                    <li key={item.label}>
                      <Link
                        href={href}
                        className="text-sm text-[var(--pf-text)] transition-colors hover:text-[var(--pf-accent)]"
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-[var(--pf-border)] pt-8 text-xs text-[var(--pf-muted)] sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p>
              © {new Date().getFullYear()} {siteConfig.name}. All rights
              reserved.
            </p>
            {policyNav.map((item) => (
              <Link
                key={item.href}
                href={regionPath(region, item.href)}
                className="transition-colors hover:text-[var(--pf-accent)]"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <p>
            Powered by{" "}
            <a
              href={siteConfig.parentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[var(--pf-text)] transition-colors hover:text-[var(--pf-accent)]"
            >
              {siteConfig.parent}
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}
