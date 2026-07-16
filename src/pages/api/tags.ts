import type { APIRoute } from "astro";
import { badRequest, json, serverError, unauthorized } from "../../lib/server/api";
import { CmsError, guard, log, tagId } from "../../lib/server/cms";

export const GET: APIRoute = async ({ request, url }) => {
  if (!guard(request)) return unauthorized();

  const name = url.searchParams.get("name")?.trim();
  if (!name) return badRequest("Tag requerido");

  try {
    return json({ id: await tagId(name) });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error de tags";
    const step = e instanceof CmsError ? e.step : "tags";
    await log({ status: "error", error_message: message, error_step: step });
    return serverError(message);
  }
};
