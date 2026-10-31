import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export type Skill = {
  id: string;
  name: string;
  description: string;
  status: "not_started" | "in_progress" | "done";
  progress_pct: number;
};

export type UpdateEntry = {
  id: number;
  date: string;
  skill_id: string;
  status: string;
  note: string;
  author_email: string | null;
  created_at: string;
};

export async function getSkills(): Promise<Skill[]> {
  const rows = await sql`
    SELECT id, name, description, status, progress_pct
    FROM skills
    ORDER BY sort_order
  `;
  return rows as Skill[];
}

export async function getUpdates(): Promise<UpdateEntry[]> {
  const rows = await sql`
    SELECT id, date::text, skill_id, status, note, author_email, created_at
    FROM updates
    ORDER BY date DESC, id DESC
  `;
  return rows as UpdateEntry[];
}

export async function addUpdate(input: {
  skillId: string;
  status: string;
  note: string;
  authorEmail: string;
}) {
  await sql`
    INSERT INTO updates (date, skill_id, status, note, author_email)
    VALUES (CURRENT_DATE, ${input.skillId}, ${input.status}, ${input.note}, ${input.authorEmail})
  `;

  // The person adding a note can also move the official tracker forward,
  // but only toward progress (never backward) and only to a known status.
  if (input.status === "in_progress" || input.status === "done") {
    const pct = input.status === "done" ? 100 : 50;
    await sql`
      UPDATE skills
      SET status = ${input.status},
          progress_pct = GREATEST(progress_pct, ${pct})
      WHERE id = ${input.skillId}
    `;
  }
}
