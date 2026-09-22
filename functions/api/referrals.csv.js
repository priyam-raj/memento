// GET /api/referrals.csv?key=…[&month=YYYY-MM] — the referral log as CSV, for Google Sheets IMPORTDATA.
// The key is the REFERRALS_KEY secret on the Pages project. Without it: 404, same as a missing page.
import { ensureTable } from './_db.js';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const key = url.searchParams.get('key') || '';
  if (!env.REFERRALS_KEY || key !== env.REFERRALS_KEY) return new Response('Not found', { status: 404 });

  await ensureTable(env);
  const month = url.searchParams.get('month') || '';
  const valid = /^\d{4}-\d{2}$/.test(month);
  const stmt = valid
    ? env.DB.prepare("SELECT created_at, email, note, ip_country FROM referrals WHERE substr(created_at,1,7) = ?1 ORDER BY created_at").bind(month)
    : env.DB.prepare("SELECT created_at, email, note, ip_country FROM referrals ORDER BY created_at");
  const { results } = await stmt.all();

  const cell = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const lines = ['Date,Email,Note,Country'];
  for (const r of results) {
    lines.push([r.created_at.slice(0, 16).replace('T', ' '), r.email, r.note, r.ip_country].map(cell).join(','));
  }
  return new Response(lines.join('\n') + '\n', {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex',
    },
  });
}
