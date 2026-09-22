// /visa/guide/* — the PDF, only after the email box on /visa. No reader cookie: back to the box.
export async function onRequest({ request, env }) {
  const cookie = request.headers.get('cookie') || '';
  if (!/(?:^|;\s*)reader=1(?:;|$)/.test(cookie)) {
    return Response.redirect(new URL('/visa/#read', request.url).toString(), 302);
  }
  const res = await env.ASSETS.fetch(request);
  const out = new Response(res.body, res);
  out.headers.set('x-robots-tag', 'noindex');
  out.headers.set('cache-control', 'private, max-age=3600');
  return out;
}
