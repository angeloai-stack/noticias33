import type { APIRoute } from "astro";
import { json, serverError, unauthorized } from "../../lib/server/api";
import { guard, logs } from "../../lib/server/cms";

export const GET: APIRoute = async ({ request, url }) => {
  if (!guard(request, true)) return unauthorized();

  try {
    return json(await logs(url.searchParams));
  } catch (e) {
    return serverError(e instanceof Error ? e.message : "Error al leer historial");
  }
};
