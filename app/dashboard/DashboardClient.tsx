"use client";

import { useState, useTransition } from "react";
import type { Skill, UpdateEntry } from "@/lib/db";

const STATUS_LABEL: Record<string, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  done: "Done",
};

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function DashboardClient({
  skills,
  updates,
  userEmail,
}: {
  skills: Skill[];
  updates: UpdateEntry[];
  userEmail: string;
}) {
  const [liveUpdates, setLiveUpdates] = useState(updates);
  const [showForm, setShowForm] = useState(false);
  const [skillId, setSkillId] = useState(skills[0]?.id ?? "");
  const [status, setStatus] = useState("in_progress");
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const overall = skills.length
    ? Math.round(skills.reduce((sum, s) => sum + s.progress_pct, 0) / skills.length)
    : 0;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) {
      setMsg("Add a short note first.");
      return;
    }
    startTransition(async () => {
      setMsg("Saving…");
      const res = await fetch("/api/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillId, status, note: note.trim() }),
      });
      if (!res.ok) {
        setMsg("Could not save — try again.");
        return;
      }
      const refreshed = await fetch("/api/updates").then((r) => r.json());
      setLiveUpdates(refreshed);
      setNote("");
      setMsg("Saved.");
      setShowForm(false);
    });
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-14">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-4xl font-semibold text-ink">Teddy&rsquo;s Progress</h1>
        <p className="max-w-xl text-sm leading-relaxed text-ink/65">
          A private, running record of Teddy&rsquo;s 6-month independence project. Signed in as{" "}
          <span className="font-medium text-ink">{userEmail}</span> &middot;{" "}
          <a href="/api/auth/signout" className="underline hover:text-clay">
            sign out
          </a>
        </p>
        <span className="mt-1 inline-flex w-fit items-center rounded-full bg-clay/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-clay">
          Overall {overall}% through the project
        </span>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {skills.map((s) => (
          <div key={s.id} className="rounded-2xl border border-line bg-white/60 p-5">
            <h3 className="text-sm font-semibold text-ink">{s.name}</h3>
            <p className="mt-1 min-h-[34px] text-xs leading-relaxed text-ink/60">{s.description}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-moss transition-all"
                style={{ width: `${s.progress_pct}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="rounded-full bg-line px-2 py-0.5 text-ink/60">
                {STATUS_LABEL[s.status] ?? s.status}
              </span>
              <span className="font-display text-lg text-ink">{s.progress_pct}%</span>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-10 rounded-2xl border border-line bg-white/60 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">Progress log</h2>
            <p className="mt-1 text-xs text-ink/60">
              Dated entries, most recent first. Anyone signed in here can add a note.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="rounded-full border border-clay px-4 py-1.5 text-xs font-medium text-clay hover:bg-clay hover:text-white"
          >
            + Add update
          </button>
        </div>

        {showForm && (
          <form onSubmit={submit} className="mt-5 flex flex-col gap-3 border-t border-dashed border-line pt-5">
            <label className="flex flex-col gap-1 text-xs text-ink/60">
              Skill
              <select
                value={skillId}
                onChange={(e) => setSkillId(e.target.value)}
                className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink"
              >
                {skills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-ink/60">
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink"
              >
                <option value="not_started">Not started</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-ink/60">
              What happened
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Short, honest note — what Teddy did, tried, or is still working on."
                className="min-h-[72px] rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink"
              />
            </label>
            <button
              type="submit"
              disabled={isPending}
              className="w-fit rounded-full bg-clay px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Save update
            </button>
            {msg && <p className="text-xs text-ink/60">{msg}</p>}
          </form>
        )}

        <div className="mt-5 flex flex-col">
          {liveUpdates.length === 0 && (
            <p className="py-6 text-center text-sm italic text-ink/50">No entries yet.</p>
          )}
          {liveUpdates.map((u, i) => {
            const skill = skills.find((s) => s.id === u.skill_id);
            return (
              <div
                key={u.id}
                className={`grid grid-cols-[90px_1fr] gap-4 py-4 ${i > 0 ? "border-t border-line" : ""}`}
              >
                <div className="pt-0.5 text-xs text-ink/50">{fmtDate(u.date)}</div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wide text-clay">
                    {skill?.name ?? u.skill_id}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-ink">{u.note}</p>
                  {u.author_email && (
                    <span className="mt-1 block text-xs text-ink/50">&mdash; {u.author_email}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <p className="mt-8 text-center text-xs text-ink/45">
        This page updates live when a new entry is saved — no need to refresh.
      </p>
    </main>
  );
}
