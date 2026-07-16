import type { APIRoute } from "astro";
import { badRequest, json, serverError, unauthorized } from "../../lib/server/api";
import { CmsError, guard, log, uploadMedia } from "../../lib/server/cms";

export const POST: APIRoute = async ({ request }) => {
  if (!guard(request)) return unauthorized();

  try {
    const file = (await request.formData()).get("file");
    if (!(file instanceof File)) return badRequest("Imagen requerida");
    return json(await uploadMedia(file));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error de imagen";
    const step = e instanceof CmsError ? e.step : "media";
    await log({ status: "error", error_message: message, error_step: step });
    return serverError(message);
  }
};
