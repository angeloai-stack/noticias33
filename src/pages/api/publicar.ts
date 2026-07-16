import type { APIRoute } from "astro";
import { badRequest, json, serverError, unauthorized } from "../../lib/server/api";
import { guard, log, publish } from "../../lib/server/cms";

export const POST: APIRoute = async ({ request }) => {
  if (!guard(request)) return unauthorized();

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return badRequest("JSON inválido");
  }

  const title = String(body.title ?? "").trim();
  const content = String(body.content ?? "").trim();
  const categoryId = Number(body.categoryId);

  if (!title || !content || !categoryId) {
    return badRequest("Título, cuerpo y categoría son obligatorios");
  }

  const payload = {
    title,
    content,
    excerpt: body.excerpt ? String(body.excerpt) : undefined,
    categoryId,
    tags: Array.isArray(body.tags)
      ? body.tags.map((tag) => Number(tag)).filter(Boolean)
      : [],
    featuredMediaId: body.featuredMediaId ? Number(body.featuredMediaId) : undefined,
  };

  try {
    const result = await publish(payload);
    await log({ status: "success", title, wp_url: result.url });
    return json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Error al publicar";
    await log({ status: "error", title, error_message: message, error_step: "publicar" });
    return serverError(message);
  }
};
