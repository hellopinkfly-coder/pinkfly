"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

/**
 * Light / dark toggle. The initial theme is applied pre-paint by the inline
 * script in layout.tsx; this component syncs UI state and persists changes.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current =
      (document.documentElement.getAttribute("data-theme") as Theme) || "light";
    setTheme(current);
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("pf-theme", next);
    } catch {
      /* storage unavailable — session-only toggle still works */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--pf-border-strong)] text-[var(--pf-heading)] transition-all duration-200 hover:border-[var(--pf-accent)] hover:text-[var(--pf-accent)]",
        className
      )}
    >
      {/* Render nothing icon-specific until mounted to avoid mismatch */}
      {mounted && (theme === "dark" ? <Sun size={18} /> : <Moon size={18} />)}
    </button>
  );
}
