"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { join } from "@/config/content";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { JOIN_STAGES, joinSchema } from "@/lib/validations";
import type { Region } from "@/lib/region";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";
type Fields = "name" | "email" | "city" | "stage" | "about";
type FieldErrors = Partial<Record<Fields, string>>;

const EMPTY = { name: "", email: "", city: "", stage: "", about: "" };

/**
 * The membership form.
 *
 * Five fields, one of them optional — enough for the team to make a useful
 * introduction, short enough to finish in a sitting. It posts to /api/join,
 * which forwards to the CRM when a webhook is configured.
 *
 * The region travels with the submission so leads route to the right team,
 * exactly as the Google Form's `crmSegment` tag was meant to.
 */
export function JoinForm({ region }: { region: Region }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  function update(field: Fields, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    // Clear a field's error as soon as the visitor starts fixing it.
    setErrors((e) => (e[field] ? { ...e, [field]: undefined } : e));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = joinSchema.safeParse({
      ...form,
      about: form.about || undefined,
      regionSlug: region.slug,
    });

    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as Fields;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    setStatus("loading");
    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm(EMPTY);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-start gap-3">
        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--pf-accent-soft)] px-4 py-2 text-sm font-bold text-[var(--pf-accent-hover)]">
          <CheckCircle2 size={18} aria-hidden />
          {join.form.successTitle}
        </span>
        <p className="max-w-md text-base leading-relaxed text-[var(--pf-text)]">
          {join.form.successBody}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" htmlFor="join-name" error={errors.name}>
          <Input
            id="join-name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            autoComplete="name"
            placeholder="Ananya Rao"
            aria-invalid={!!errors.name}
          />
        </Field>

        <Field label="Email" htmlFor="join-email" error={errors.email}>
          <Input
            id="join-email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            autoComplete="email"
            placeholder="you@yourbrand.com"
            aria-invalid={!!errors.email}
          />
        </Field>

        <Field label="City" htmlFor="join-city" error={errors.city}>
          <Input
            id="join-city"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            autoComplete="address-level2"
            placeholder="Bengaluru"
            aria-invalid={!!errors.city}
          />
        </Field>

        <div className="flex flex-col gap-1.5">
          <Select
            label="Where you are"
            id="join-stage"
            value={form.stage}
            onChange={(e) => update("stage", e.target.value)}
            aria-invalid={!!errors.stage}
          >
            <option value="">Choose one…</option>
            {JOIN_STAGES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
          {errors.stage && <ErrorText>{errors.stage}</ErrorText>}
        </div>
      </div>

      <Field
        label="What are you building? (optional)"
        htmlFor="join-about"
        error={errors.about}
      >
        <textarea
          id="join-about"
          value={form.about}
          onChange={(e) => update("about", e.target.value)}
          rows={3}
          aria-invalid={!!errors.about}
          placeholder="A line or two helps us make the right introductions."
          className={cn(
            "w-full rounded-[var(--pf-radius-lg)] border border-[var(--pf-border-strong)] bg-[var(--pf-surface)] px-5 py-3.5 text-sm text-[var(--pf-heading)] placeholder:text-[var(--pf-muted)] transition-colors focus:border-[var(--pf-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--pf-accent)]/20"
          )}
        />
      </Field>

      {status === "error" && (
        <ErrorText role="alert">
          Something went wrong. Please try again, or email{" "}
          {region.email ?? "hello@pinkfly.community"}.
        </ErrorText>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" size="lg" disabled={status === "loading"}>
          {status === "loading" ? "Sending…" : join.form.submit}
          {status !== "loading" && <ArrowRight size={18} />}
        </Button>
        <p className="text-sm text-[var(--pf-muted)]">{join.form.reassurance}</p>
      </div>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--pf-muted)]"
      >
        {label}
      </label>
      {children}
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
}

function ErrorText({
  children,
  role,
}: {
  children: React.ReactNode;
  role?: string;
}) {
  return (
    <span role={role ?? "alert"} className="text-xs text-[var(--pf-accent-hover)]">
      {children}
    </span>
  );
}
