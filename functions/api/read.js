// POST /api/read — the "enter your email to read the guide" form on /visa.
// Logs the email to the readers list, sets a cookie that unlocks /visa/guide/*, and redirects
// straight to the PDF. It's a plain form POST (target=_blank), so it works without JavaScript.
import { ensureTable, validEmail } from './_db.js';

const GUIDE = '/visa/guide/rejected-then-approved.pdf';

export async function onRequestPost({ request, env }) {
  const form = await request.formData();
  const email = validEmail(form.get('email'));
  if (!email) return Response.redirect(new URL('/visa/#read', request.url).toString(), 303);

  try {
    await ensureTable(env);
    await env.DB.prepare(
      'INSERT INTO readers (created_at, email, page, ip_country) VALUES (?1, ?2, ?3, ?4)'
    ).bind(
      new Date().toISOString(),
      email,
      String(form.get('page') || '').slice(0, 500),
      request.headers.get('cf-ipcountry') || ''
    ).run();
  } catch (err) {
    // never block a reader on a logging failure
    console.error('read:', err);
  }

  return new Response(null, {
    status: 303,
    headers: {
      location: GUIDE,
      'set-cookie': 'reader=1; Path=/visa/guide; Max-Age=31536000; Secure; HttpOnly; SameSite=Lax',
    },
  });
}
