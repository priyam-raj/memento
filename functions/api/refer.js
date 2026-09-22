// POST /api/refer — the "Want the former officer on your case?" form on /my-usa-visa-rejection-story.
// Checks Turnstile, then logs the email to the referrals list (once per email).
// 204 = logged (or an invalid email the browser should have caught); 403 = verification failed,
// so the page can ask the person to try again instead of silently dropping the referral.
import { ensureTable, validEmail } from './_db.js';
import { verifyTurnstile } from './_turnstile.js';

export async function onRequestPost({ request, env }) {
  const form = await request.formData();
  const email = validEmail(form.get('email'));
  if (!email) return new Response(null, { status: 204 });
  if (!(await verifyTurnstile(request, env, form.get('cf-turnstile-response'), 'referral'))) {
    return new Response(null, { status: 403 });
  }

  try {
    await ensureTable(env);
    await env.DB.prepare(
      'INSERT OR IGNORE INTO referrals (created_at, email, note, page, ip_country) VALUES (?1, ?2, ?3, ?4, ?5)'
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
