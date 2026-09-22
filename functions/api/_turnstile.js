// Cloudflare Turnstile: verify a widget token server-side before anything is stored.
// Fails closed: missing config, a network error or any mismatch returns false.
//   TURNSTILE_SECRET    Pages secret (the widget's secret key)
//   TURNSTILE_HOSTNAMES comma-separated frontend hostnames this deployment accepts (production: priyamraj.com)
const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(request, env, token, expectedAction) {
  const hostnames = new Set(
    String(env.TURNSTILE_HOSTNAMES || '')
      .split(',')
      .map((h) => h.trim())
      .filter(Boolean),
  );
  if (!env.TURNSTILE_SECRET || hostnames.size === 0) return false;
  if (typeof token !== 'string' || token.length === 0 || token.length > 2048) return false;

  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token });
  const ip = request.headers.get('cf-connecting-ip');
  if (ip) body.set('remoteip', ip);

  try {
    const r = await fetch(SITEVERIFY, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body,
      signal: AbortSignal.timeout(10_000),
    });
    if (!r.ok) return false;
    const result = await r.json();
    return result.success === true && result.action === expectedAction && hostnames.has(result.hostname);
  } catch {
    return false;
  }
}
