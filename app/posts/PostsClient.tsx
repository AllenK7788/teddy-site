"use client";

import { useMemo, useState } from "react";

export type Post = {
  day: number;
  date: string;
  weekday: string;
  type: "Core" | "Repurpose" | string;
  pillar: string;
  format: string;
  platforms: string;
  caption: string;
  notes: string;
  referenceImage?: string;
};

const PLATFORM_CHIPS = ["All", "TikTok", "Instagram", "YouTube", "Facebook", "LINE"];
const TYPE_CHIPS = ["All", "Core", "Repurpose"];

function copyToClipboard(text: string): Promise<void> {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
}

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const safe = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${safe})`, "ig"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark
        key={i}
        className="bg-clay/25 text-ink dark:bg-clay-dark/35 dark:text-ink-dark rounded-sm"
      >
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function PostsClient({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [platform, setPlatform] = useState("All");
  const [copiedDay, setCopiedDay] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (type !== "All" && p.type !== type) return false;
      if (platform !== "All" && !p.platforms.toLowerCase().includes(platform.toLowerCase()))
        return false;
      if (!q) return true;
      const haystack = `${p.pillar} ${p.caption} ${p.format} ${p.platforms} ${p.date} ${p.weekday} day ${p.day}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [posts, query, type, platform]);

  async function handleCopy(p: Post) {
    try {
      await copyToClipboard(p.caption);
      setCopiedDay(p.day);
      setTimeout(() => setCopiedDay((d) => (d === p.day ? null : d)), 1600);
    } catch {
      // Clipboard unavailable — fail quietly, the caption is still selectable/visible.
    }
  }

  return (
    <div className="min-h-screen bg-paper text-ink dark:bg-paper-dark dark:text-ink-dark font-body">
      <header className="border-b border-line dark:border-line-dark px-6 py-8 sm:px-10">
        <p className="text-sm uppercase tracking-[0.2em] text-clay dark:text-clay-dark">
          Teddy's 30 Days
        </p>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl">Content calendar</h1>
        <p className="mt-2 max-w-2xl text-ink/70 dark:text-ink-dark/70">
          Every post, topic, and ready-to-use caption for the month — searchable, filterable,
          and one click from copied.
        </p>
      </header>

      <div className="sticky top-0 z-10 border-b border-line bg-paper/95 px-6 py-4 backdrop-blur sm:px-10 dark:border-line-dark dark:bg-paper-dark/95">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search captions, topics, days…"
            className="w-full rounded-full border border-line bg-paper px-4 py-2 text-sm outline-none focus:border-clay sm:max-w-xs dark:border-line-dark dark:bg-paper-dark dark:focus:border-clay-dark"
          />
          <div className="flex flex-wrap gap-2">
            {TYPE_CHIPS.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  type === t
                    ? "border-clay bg-clay text-paper dark:border-clay-dark dark:bg-clay-dark dark:text-paper-dark"
                    : "border-line text-ink/70 hover:border-clay dark:border-line-dark dark:text-ink-dark/70 dark:hover:border-clay-dark"
                }`}
              >
                {t}
              </button>
            ))}
            <span className="mx-1 w-px self-stretch bg-line dark:bg-line-dark" />
            {PLATFORM_CHIPS.map((pl) => (
              <button
                key={pl}
                onClick={() => setPlatform(pl)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  platform === pl
                    ? "border-moss bg-moss text-paper dark:border-moss-dark dark:bg-moss-dark dark:text-paper-dark"
                    : "border-line text-ink/70 hover:border-moss dark:border-line-dark dark:text-ink-dark/70 dark:hover:border-moss-dark"
                }`}
              >
                {pl}
              </button>
            ))}
          </div>
        </div>
        <p className="mx-auto mt-2 max-w-5xl text-xs text-ink/50 dark:text-ink-dark/50">
          Showing {filtered.length} of {posts.length} posts
        </p>
      </div>

      <main className="mx-auto max-w-5xl px-6 py-8 sm:px-10">
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-ink/60 dark:text-ink-dark/60">
            No posts match that search.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {filtered.map((p) => (
              <article
                key={p.day}
                className="flex flex-col rounded-2xl border border-line bg-white/60 p-5 shadow-sm dark:border-line-dark dark:bg-white/5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl text-clay dark:text-clay-dark">
                    Day {p.day}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      p.type === "Core"
                        ? "bg-moss/15 text-moss dark:bg-moss-dark/20 dark:text-moss-dark"
                        : "bg-line text-ink/60 dark:bg-line-dark dark:text-ink-dark/60"
                    }`}
                  >
                    {p.type}
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink/50 dark:text-ink-dark/50">
                  {p.date} · {p.weekday}
                </p>
                <h2 className="mt-3 font-display text-lg leading-snug">
                  {highlight(p.pillar, query)}
                </h2>
                <p className="mt-1 text-xs text-ink/60 dark:text-ink-dark/60">
                  {p.format} · {p.platforms}
                </p>
                {p.referenceImage && (
                  <a
                    href={p.referenceImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 block overflow-hidden rounded-xl border border-line dark:border-line-dark"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.referenceImage}
                      alt={`Shoot reference for Day ${p.day}: ${p.pillar}`}
                      className="aspect-[27/40] w-full object-cover object-top"
                      loading="lazy"
                    />
                    <span className="block bg-line/60 px-3 py-1.5 text-center text-[11px] font-medium uppercase tracking-wide text-ink/60 dark:bg-line-dark/60 dark:text-ink-dark/60">
                      Shoot reference · tap to view full size
                    </span>
                  </a>
                )}
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/90 dark:text-ink-dark/90">
                  {highlight(p.caption, query)}
                </p>
                {p.notes && (
                  <p className="mt-3 border-t border-line pt-3 text-xs italic text-ink/50 dark:border-line-dark dark:text-ink-dark/50">
                    {p.notes}
                  </p>
                )}
                <button
                  onClick={() => handleCopy(p)}
                  className="mt-4 self-start rounded-full border border-clay px-4 py-1.5 text-xs font-medium text-clay transition hover:bg-clay hover:text-paper dark:border-clay-dark dark:text-clay-dark dark:hover:bg-clay-dark dark:hover:text-paper-dark"
                >
                  {copiedDay === p.day ? "Copied ✓" : "Copy caption"}
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
