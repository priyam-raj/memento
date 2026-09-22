// POST /api/refer — logs a referral-form submission from /visa into D1.
// Body: form-encoded email, note, page. Always returns 204 so the page never blocks on us.
import { ensureTable } from './_db.js';

export async function onRequestPost({ request, env }) {
  try {
    const form = await request.formData();
    const email = String(form.get('email') || '').trim().toLowerCase().slice(0, 254);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return new Response(null, { status: 204 });
    await ensureTable(env);
    await env.DB.prepare(
      'INSERT INTO referrals (created_at, email, note, page, ip_country) VALUES (?1, ?2, ?3, ?4, ?5)'
    ).bind(
      new Date().toISOString(),
      email,
      String(form.get('note') || '').slice(0, 200),
      String(form.get('page') || '').slice(0, 500),
      request.headers.get('cf-ipcountry') || ''
    ).run();
  } catch (err) {
    console.error('refer:', err);
  }
  return new Response(null, { status: 204 });
}
