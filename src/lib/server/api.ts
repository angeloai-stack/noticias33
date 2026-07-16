export function json(data: unknown, status = 200): Response {
  return Response.json(data, { status });
}

export function unauthorized(message = "No autorizado"): Response {
  return json({ error: message }, 401);
}

export function badRequest(message: string): Response {
  return json({ error: message }, 400);
}

export function serverError(message: string): Response {
  return json({ error: message }, 500);
}
