// Shared: make sure both lists exist before the first read or write.
//   referrals — people who asked for the former officer's booking link
//   readers   — people who entered an email to open the guide
// One row per email per list: repeats are ignored, so the referral sheet never double-counts.
const TABLES = ['referrals', 'readers'];
const schema = (name) => `CREATE TABLE IF NOT EXISTS ${name} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL,
  email TEXT NOT NULL,
  note TEXT,
  page TEXT,
  ip_country TEXT
)`;
const unique = (name) => `CREATE UNIQUE INDEX IF NOT EXISTS ${name}_email ON ${name}(email)`;

export async function ensureTable(env) {
  await env.DB.batch(TABLES.flatMap((t) => [env.DB.prepare(schema(t)), env.DB.prepare(unique(t))]));
}

export function validEmail(raw) {
  const email = String(raw || '').trim().toLowerCase().slice(0, 254);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '';
}
