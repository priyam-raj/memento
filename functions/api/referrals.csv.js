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
    ? env.DB.prepare("SELECT created_at, email, ip_country FROM referrals WHERE substr(created_at,1,7) = ?1 ORDER BY id").bind(month)
    : env.DB.prepare("SELECT created_at, email, ip_country FROM referrals ORDER BY id");
  const { results } = await stmt.all();

  // Rows are in insertion order so a row never moves once it appears: anything added beside the
  // imported columns in a spreadsheet (e.g. a "Paid" checkbox) stays lined up with its email.
  // The date is written as text Sheets won't auto-convert to a serial number.
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
  const when = (iso) => {
    const d = new Date(iso);
    const [{ value: mo }, , { value: da }, , { value: yr }, , { value: hh }, , { value: mm }] = fmt.formatToParts(d);
    return `${da} ${mo} ${yr} \u00b7 ${hh}:${mm} IST`;
  };
  const cell = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const lines = ['Date,Email,Country'];
  for (const r of results) {
    lines.push([when(r.created_at), r.email, r.ip_country].map(cell).join(','));
  }
  return new Response(lines.join('\n') + '\n', {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex',
    },
  });
}
