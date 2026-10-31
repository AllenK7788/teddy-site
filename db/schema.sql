-- Run this once in Neon's SQL Editor (console.neon.tech → your project →
-- SQL Editor) to set up Teddy's Progress tables and seed the starting data.

CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started',
  progress_pct INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS updates (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  skill_id TEXT NOT NULL REFERENCES skills(id),
  status TEXT NOT NULL,
  note TEXT NOT NULL,
  author_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO skills (id, name, description, status, progress_pct, sort_order) VALUES
  ('skill-1', 'Using an e-wallet independently', 'Paying without counting change or doing math under pressure.', 'in_progress', 60, 1),
  ('skill-2', 'Asking for help when lost', 'Reaching out to a person or his AI assistant instead of freezing.', 'not_started', 0, 2),
  ('skill-3', 'Managing his own schedule', 'Getting to class and tasks on time without reminders.', 'not_started', 0, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO updates (date, skill_id, status, note, author_email)
SELECT '2026-11-01', 'skill-1', 'in_progress',
  'Project kicked off: three skills defined with his teacher for this 6-month term. Starting with the e-wallet skill since that habit is already partly in place.',
  NULL
WHERE NOT EXISTS (SELECT 1 FROM updates WHERE note LIKE 'Project kicked off:%');
