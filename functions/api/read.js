// POST /api/read — the "enter your email to read the guide" form on /my-usa-visa-rejection-story.
// Checks Turnstile, logs the email to the readers list (once per email), sets a cookie that
// unlocks /my-usa-visa-rejection-story/guide/*, and redirects straight to the PDF.
// It's a plain form POST (target=_blank), so no fetch or client-side state is involved.
import { ensureTable, validEmail } from './_db.js';
import { verifyTurnstile } from './_turnstile.js';

const PAGE = '/my-usa-visa-rejection-story/';
const GUIDE = PAGE + 'guide/rejected-then-approved.pdf';

export async function onRequestPost({ request, env }) {
  const back = (why) => Response.redirect(new URL(`${PAGE}?${why}=1#read`, request.url).toString(), 303);

  const form = await request.formData();
  const email = validEmail(form.get('email'));
  if (!email) return back('gate');
  if (!(await verifyTurnstile(request, env, form.get('cf-turnstile-response'), 'read_guide'))) return back('verify');

  try {
    await ensureTable(env);
    await env.DB.prepare(
      'INSERT OR IGNORE INTO readers (created_at, email, page, ip_country) VALUES (?1, ?2, ?3, ?4)'
    ).bind(
      new Date().toISOString(),
      email,
      String(form.get('page') || '').slice(0, 500),
      request.headers.get('cf-ipcountry') || ''
    ).run();
  } catch (err) {
    // never block a verified reader on a logging failure
    console.error('read:', err);
  }

  return new Response(null, {
    status: 303,
    headers: {
      location: GUIDE,
      'set-cookie': 'reader=1; Path=/my-usa-visa-rejection-story/guide; Max-Age=31536000; Secure; HttpOnly; SameSite=Lax',
    },
  });
}
