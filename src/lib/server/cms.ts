import { env, wpUrl } from "../env";

export class CmsError extends Error {
  constructor(
    message: string,
    public step: "media" | "tags" | "publicar",
  ) {
    super(message);
  }
}

function authHeader(user: string, password: string): string {
  const token = Buffer.from(`${user}:${password}`, "utf8").toString("base64");
  return `Basic ${token}`;
}

function credentials() {
  const url = wpUrl();
  const user = env("WP_USER");
  const password = env("WP_APP_PASSWORD");
  if (!url || !user || !password) {
    throw new CmsError(
      "Falta configurar la conexión segura con WordPress.",
      "publicar",
    );
  }
  return { Authorization: authHeader(user, password) };
}

async function wp(path: string, init: RequestInit = {}) {
  const response = await fetch(`${wpUrl()}/wp-json/wp/v2${path}`, {
    ...init,
    headers: { ...credentials(), ...init.headers },
  });
  if (!response.ok) {
    throw new Error(
      (await response.json().catch(() => null))?.message ||
        `WordPress respondió ${response.status}`,
    );
  }
  return response;
}

export async function categories() {
  const response = await fetch(
    `${wpUrl()}/wp-json/wp/v2/categories?per_page=100&hide_empty=false`,
  );
  if (!response.ok) {
    throw new Error(`WordPress respondió ${response.status} al listar categorías`);
  }
  const raw = await response.json();
  if (!Array.isArray(raw)) {
    throw new Error("Respuesta inesperada de WordPress al listar categorías");
  }
  return raw.filter((c: { slug: string }) => c.slug !== "uncategorized");
}

const MAX_MEDIA_BYTES = 5 * 1024 * 1024;

export async function uploadMedia(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new CmsError("Solo se permiten archivos de imagen", "media");
  }
  if (file.size > MAX_MEDIA_BYTES) {
    throw new CmsError("La imagen no puede superar 5 MB", "media");
  }
  try {
    const r = await wp("/media", {
      method: "POST",
      headers: {
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`,
        "Content-Type": file.type || "application/octet-stream",
      },
      body: file,
    });
    const v = await r.json();
    return { id: v.id, url: v.source_url };
  } catch (e) {
    throw new CmsError(
      e instanceof Error ? e.message : "No se pudo subir la imagen",
      "media",
    );
  }
}

export async function tagId(name: string) {
  try {
    const found = await (
      await wp(`/tags?search=${encodeURIComponent(name)}&per_page=100`)
    ).json();
    const same = found.find(
      (t: { name: string }) => t.name.toLowerCase() === name.toLowerCase(),
    );
    if (same) return same.id;
    return (
      await (
        await wp("/tags", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        })
      ).json()
    ).id;
  } catch (e) {
    throw new CmsError(
      e instanceof Error ? e.message : "No se pudo crear el tag",
      "tags",
    );
  }
}

export async function publish(data: {
  title: string;
  excerpt?: string;
  content: string;
  categoryId: number;
  tags: number[];
  featuredMediaId?: number;
}) {
  try {
    const r = await wp("/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        categories: [data.categoryId],
        tags: data.tags,
        featured_media: data.featuredMediaId,
        status: "publish",
      }),
    });
    const v = await r.json();
    return { id: v.id, url: v.link };
  } catch (e) {
    throw new CmsError(
      e instanceof Error ? e.message : "No se pudo publicar la nota",
      "publicar",
    );
  }
}

export async function log(entry: Record<string, unknown>) {
  const supabaseUrl = env("SUPABASE_URL")?.replace(/\/$/, "");
  const supabaseKey = env("SUPABASE_SERVICE_KEY");
  if (!supabaseUrl || !supabaseKey) return;
  await fetch(`${supabaseUrl}/rest/v1/publicaciones_log`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(entry),
  });
}

export async function logs(query: URLSearchParams) {
  const supabaseUrl = env("SUPABASE_URL")?.replace(/\/$/, "");
  const supabaseKey = env("SUPABASE_SERVICE_KEY");
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase no está configurado.");
  }
  const filters = new URLSearchParams({ select: "*", order: "created_at.desc" });
  const status = query.get("status");
  const from = query.get("from");
  const to = query.get("to");
  if (status) filters.set("status", `eq.${status}`);
  if (from && to) {
    filters.set("and", `(created_at.gte.${from},created_at.lte.${to})`);
  } else if (from) {
    filters.set("created_at", `gte.${from}`);
  } else if (to) {
    filters.set("created_at", `lte.${to}`);
  }
  const r = await fetch(`${supabaseUrl}/rest/v1/publicaciones_log?${filters}`, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
  });
  if (!r.ok) throw new Error("No se pudo leer el historial.");
  return r.json();
}

export function guard(request: Request, admin = false) {
  const expected = admin ? env("ADMIN_CODE") : env("ACCESS_CODE");
  return Boolean(expected && request.headers.get("x-n33-code") === expected);
}
