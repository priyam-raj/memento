// Shared: make sure the referrals table exists before the first read or write.
const SCHEMA = `CREATE TABLE IF NOT EXISTS referrals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  email TEXT NOT NULL,
  note TEXT,
  page TEXT,
  ip_country TEXT
)`;

export async function ensureTable(env) {
  await env.DB.prepare(SCHEMA).run();
}
