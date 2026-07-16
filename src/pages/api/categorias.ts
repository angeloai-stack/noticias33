import type { APIRoute } from "astro";
import { unauthorized, json, serverError } from "../../lib/server/api";
import { categories, guard } from "../../lib/server/cms";

export const GET: APIRoute = async ({ request }) => {
  if (!guard(request)) return unauthorized();
  try {
    const items = await categories();
    return json(items.map((c: { id: number; name: string }) => ({ id: c.id, name: c.name })));
  } catch (e) {
    return serverError(e instanceof Error ? e.message : "No se pudieron cargar categorías");
  }
};
