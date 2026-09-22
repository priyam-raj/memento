// /my-usa-visa-rejection-story/guide/* — the PDF, only after the email box.
// No reader cookie: back to the box, with gate=1 so the page shows the form even to a returning reader.
export async function onRequest({ request, env }) {
  const cookie = request.headers.get('cookie') || '';
  if (!/(?:^|;\s*)reader=1(?:;|$)/.test(cookie)) {
    return Response.redirect(new URL('/my-usa-visa-rejection-story/?gate=1#read', request.url).toString(), 302);
  }
  const res = await env.ASSETS.fetch(request);
  const out = new Response(res.body, res);
  out.headers.set('x-robots-tag', 'noindex');
  out.headers.set('cache-control', 'private, max-age=3600');
  return out;
}
