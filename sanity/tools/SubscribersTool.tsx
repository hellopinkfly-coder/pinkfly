"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useClient } from "sanity";
import { DownloadIcon, UsersIcon } from "@sanity/icons";
import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Spinner,
  Stack,
  Text,
  TextInput,
} from "@sanity/ui";

/**
 * Newsletter subscribers, as a table you can read and download.
 *
 * The Studio's own document list is built for editing one thing at a time:
 * to see two hundred addresses you scroll two hundred rows, and to get them
 * out you copy them by hand. This is the other shape — every address on one
 * screen, searchable, and a button that hands you a CSV.
 *
 * It reads through the Studio's own client, so it needs no API route and no
 * token: whoever is logged into the Studio can see this, and nobody else can.
 * An endpoint returning every subscriber's address would have been one
 * guessed URL away from leaking the whole list.
 *
 * Supabase is still the list itself. This reads the mirror written when
 * someone subscribes, which can drift if rows are added or deleted in
 * Supabase directly — said plainly on screen rather than left to be
 * discovered.
 */

type Subscriber = {
  _id: string;
  email?: string;
  source?: string;
  subscribedAt?: string;
  welcomeEmailed?: boolean;
};

const QUERY = `*[_type == "newsletterSubscriber"] | order(subscribedAt desc) {
  _id, email, source, subscribedAt, welcomeEmailed
}`;

/** One CSV field: quoted, with quotes doubled, so a comma cannot split it. */
function csvField(value: string | undefined) {
  const text = value ?? "";
  return `"${text.replace(/"/g, '""')}"`;
}

function toCsv(rows: Subscriber[]) {
  const header = ["Email", "Signed up from", "Subscribed", "Welcome email sent"];
  const body = rows.map((row) =>
    [
      csvField(row.email),
      csvField(row.source === "popup" ? "Welcome popup" : row.source === "form" ? "Page form" : ""),
      csvField(row.subscribedAt),
      csvField(row.welcomeEmailed ? "yes" : "no"),
    ].join(",")
  );
  return [header.map(csvField).join(","), ...body].join("\n");
}

export function SubscribersTool() {
  // The published perspective: a subscriber is never a draft, and asking for
  // drafts would just return the same rows twice.
  const client = useClient({ apiVersion: "2024-10-01" });
  const [rows, setRows] = useState<Subscriber[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const load = useCallback(() => {
    setError(null);
    client
      .fetch<Subscriber[]>(QUERY)
      .then(setRows)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : String(e))
      );
  }, [client]);

  useEffect(load, [load]);

  const filtered = useMemo(() => {
    if (!rows) return [];
    const needle = query.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((row) => row.email?.toLowerCase().includes(needle));
  }, [rows, query]);

  function download() {
    // Built and handed over in the browser — the addresses never travel
    // anywhere they were not already.
    const blob = new Blob([toCsv(filtered)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `pinkfly-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Box padding={4}>
      <Stack space={4}>
        <Flex align="center" gap={3} wrap="wrap">
          <Heading size={2}>Newsletter subscribers</Heading>
          <Box flex={1} />
          <Button
            icon={DownloadIcon}
            text={
              query.trim()
                ? `Download these ${filtered.length}`
                : `Download CSV (${rows?.length ?? 0})`
            }
            tone="primary"
            disabled={!rows || filtered.length === 0}
            onClick={download}
          />
          <Button text="Refresh" mode="ghost" onClick={load} />
        </Flex>

        <Text size={1} muted>
          Written here when someone subscribes on the site. The list itself
          lives in Supabase — an address added or removed there directly will
          not show up here.
        </Text>

        <TextInput
          placeholder="Search by email…"
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          onClear={() => setQuery("")}
          clearButton={query.length > 0}
        />

        {error && (
          <Card padding={4} radius={2} tone="critical">
            <Text size={1}>Could not load subscribers: {error}</Text>
          </Card>
        )}

        {!rows && !error && (
          <Flex align="center" gap={3} padding={4}>
            <Spinner muted />
            <Text size={1} muted>
              Loading…
            </Text>
          </Flex>
        )}

        {rows && filtered.length === 0 && (
          <Card padding={4} radius={2} tone="transparent" border>
            <Text size={1} muted>
              {rows.length === 0
                ? "Nobody has subscribed yet."
                : "No address matches that."}
            </Text>
          </Card>
        )}

        {filtered.length > 0 && (
          <Card radius={2} border overflow="auto">
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Email", "From", "Subscribed", "Welcomed"].map((label) => (
                    <th
                      key={label}
                      style={{
                        textAlign: "left",
                        padding: "10px 14px",
                        borderBottom: "1px solid var(--card-border-color)",
                        position: "sticky",
                        top: 0,
                        background: "var(--card-bg-color)",
                      }}
                    >
                      <Text size={1} weight="semibold">
                        {label}
                      </Text>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row._id}>
                    <td style={cell}>
                      <Text size={1}>{row.email}</Text>
                    </td>
                    <td style={cell}>
                      <Text size={1} muted>
                        {row.source === "popup"
                          ? "Popup"
                          : row.source === "form"
                            ? "Page form"
                            : "—"}
                      </Text>
                    </td>
                    <td style={cell}>
                      <Text size={1} muted>
                        {row.subscribedAt
                          ? new Date(row.subscribedAt).toLocaleString("en-GB")
                          : "—"}
                      </Text>
                    </td>
                    <td style={cell}>
                      <Text size={1} muted>
                        {row.welcomeEmailed ? "Yes" : "No"}
                      </Text>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </Stack>
    </Box>
  );
}

const cell: React.CSSProperties = {
  padding: "10px 14px",
  borderBottom: "1px solid var(--card-border-color)",
  verticalAlign: "top",
};

/** Registered in sanity.config.ts as a top-level Studio tool. */
export const subscribersTool = {
  name: "subscribers",
  title: "Subscribers",
  icon: UsersIcon,
  component: SubscribersTool,
};
