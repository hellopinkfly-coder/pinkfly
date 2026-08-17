"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { newsletter } from "@/config/content";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/shared/Reveal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { newsletterSchema } from "@/lib/validations";

type Status = "idle" | "loading" | "success" | "error";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = newsletterSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <Section id="newsletter">
      <Reveal className="mx-auto max-w-3xl overflow-hidden rounded-[var(--pf-radius-2xl)] border border-[var(--pf-border)] bg-[var(--pf-surface)] px-6 py-14 text-center shadow-[var(--pf-shadow-md)] sm:px-14">
        <h2 className="pf-h2 mx-auto mt-4 max-w-xl">{newsletter.headline}</h2>
        <p className="mx-auto mt-4 max-w-md text-[var(--pf-text)]">
          {newsletter.subhead}
        </p>

        {status === "success" ? (
          <p className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--pf-accent-soft)] px-5 py-3 text-sm font-medium text-[var(--pf-accent-hover)]">
            <CheckCircle2 size={18} />
            You&apos;re in. Welcome to Oinkfly.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <div className="flex-1 text-left">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <Input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                placeholder={newsletter.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? "newsletter-error" : undefined}
              />
            </div>
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "…" : newsletter.cta}
              {status !== "loading" && <ArrowRight size={16} />}
            </Button>
          </form>
        )}

        {error && (
          <p
            id="newsletter-error"
            className="mt-3 text-sm text-[var(--pf-accent-hover)]"
            role="alert"
          >
            {error}
          </p>
        )}
      </Reveal>
    </Section>
  );
}
