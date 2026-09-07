import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase, used for one thing only: storing newsletter subscribers.
 *
 * The project URL and the publishable key are public by design — they ship in
 * any browser bundle that talks to Supabase, and what they may do is decided
 * by the row level security policies on the table, not by keeping them
 * secret. So they live here with an environment override, and a fresh
 * checkout behaves like production. A secret service-role key must never
 * appear in this file.
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://ajusvogruservkfcwaho.supabase.co";

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "sb_publishable_QlBEHtwakNeKH_bKyfeYJQ_d0wVA1s-";

/** The table the subscribe form writes to. */
export const NEWSLETTER_TABLE = "newsletter_subscribers";

let client: SupabaseClient | null = null;

/**
 * One client, created on first use.
 *
 * `persistSession` is off because nothing here signs anyone in — the form
 * writes one row as an anonymous visitor and that is all.
 */
export function supabase(): SupabaseClient {
  client ??= createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
