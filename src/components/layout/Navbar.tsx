"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { mainNav } from "@/config/site";
import { useScrolled } from "@/hooks/useScrollDirection";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { OinkflyWordmark } from "@/components/brand/OinkflyMark";
import { Container } from "./Container";
import { DURATION, EASE } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-[var(--pf-ease)]",
        scrolled ? "py-2" : "py-4"
      )}
    >
      <Container>
        <nav
          className={cn(
            "flex items-center justify-between rounded-full px-4 py-2.5 transition-all duration-300 ease-[var(--pf-ease)] sm:px-6",
            scrolled
              ? "pf-glass shadow-[var(--pf-shadow-sm)]"
              : "border border-transparent"
          )}
          aria-label="Primary"
        >
          <Link href="/" aria-label="Oinkfly — home" className="rounded-full">
            <OinkflyWordmark className="text-lg" markSize={24} />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-8 lg:flex">
            {mainNav.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "whitespace-nowrap text-sm transition-colors duration-200 hover:text-[var(--pf-accent)]",
                      active
                        ? "text-[var(--pf-accent)]"
                        : "text-[var(--pf-text)]"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <Button href="/#join" size="sm">
              Join Oinkfly
            </Button>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-1 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[var(--pf-heading)]"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </Container>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: DURATION.fast, ease: EASE }}
            className="lg:hidden"
          >
            <Container className="mt-2">
              <div className="pf-glass flex flex-col gap-1 rounded-[var(--pf-radius-xl)] p-4 shadow-[var(--pf-shadow-md)]">
                {mainNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 text-[var(--pf-heading)] transition-colors hover:bg-[var(--pf-surface-muted)]"
                  >
                    {item.label}
                  </Link>
                ))}
                <Button
                  href="/#join"
                  className="mt-2 w-full"
                  onClick={() => setOpen(false)}
                >
                  Join Oinkfly
                </Button>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
