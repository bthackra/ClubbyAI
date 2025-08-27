export function ok<T>(data: T) { return Response.json({ ok: true, data }); }
export function err(message: string, status = 400) {
  return new Response(JSON.stringify({ ok: false, error: message }), { status, headers: { "content-type": "application/json" }});
}
