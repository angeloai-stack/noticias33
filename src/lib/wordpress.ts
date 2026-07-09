/**
 * Cliente para la API REST de WordPress (headless CMS de Noticias33).
 * Usa la API nativa de WordPress: {WP_URL}/wp-json/wp/v2 — no requiere plugins.
 */

const WP_URL = import.meta.env.WP_URL?.replace(/\/$/, "") ?? "";
const API = `${WP_URL}/wp-json/wp/v2`;

export interface WPImage {
  source_url: string;
  alt_text: string;
}

export interface WPCategory {
  id: number;
  slug: string;
  name: string;
  description: string;
  count: number;
}

export interface WPPost {
  id: number;
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  categories: WPCategory[];
  featuredImage: WPImage | null;
}

/** Normaliza la respuesta cruda de la API (con _embed) a nuestro modelo. */
function mapPost(raw: any): WPPost {
  const media = raw._embedded?.["wp:featuredmedia"]?.[0];
  const terms: any[] = raw._embedded?.["wp:term"]?.flat() ?? [];
  return {
    id: raw.id,
    slug: raw.slug,
    date: raw.date,
    title: raw.title?.rendered ?? "",
    excerpt: raw.excerpt?.rendered ?? "",
    content: raw.content?.rendered ?? "",
    author: raw._embedded?.author?.[0]?.name ?? "Redacción N33",
    categories: terms
      .filter((t) => t?.taxonomy === "category")
      .map((t) => ({
        id: t.id,
        slug: t.slug,
        name: t.name,
        description: "",
        count: 0,
      })),
    featuredImage: media?.source_url
      ? { source_url: media.source_url, alt_text: media.alt_text ?? "" }
      : null,
  };
}

async function wpFetch<T>(path: string): Promise<T | null> {
  if (!WP_URL) {
    console.warn("[wordpress] WP_URL no está configurada en .env");
    return null;
  }
  try {
    const res = await fetch(`${API}${path}`);
    if (!res.ok) {
      console.warn(`[wordpress] ${res.status} en ${path}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[wordpress] No se pudo conectar a ${API}${path}:`, err);
    return null;
  }
}

/** Últimas noticias, opcionalmente filtradas por categoría. */
export async function getPosts(
  opts: { perPage?: number; page?: number; categoryId?: number } = {},
): Promise<WPPost[]> {
  const params = new URLSearchParams({
    _embed: "true",
    per_page: String(opts.perPage ?? 12),
    page: String(opts.page ?? 1),
  });
  if (opts.categoryId) params.set("categories", String(opts.categoryId));
  const raw = await wpFetch<any[]>(`/posts?${params}`);
  return raw?.map(mapPost) ?? [];
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const raw = await wpFetch<any[]>(
    `/posts?slug=${encodeURIComponent(slug)}&_embed=true`,
  );
  return raw?.[0] ? mapPost(raw[0]) : null;
}

/** Categorías con al menos una noticia publicada. */
export async function getCategories(): Promise<WPCategory[]> {
  const raw = await wpFetch<any[]>(`/categories?per_page=100&hide_empty=true`);
  return (
    raw?.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description ?? "",
      count: c.count ?? 0,
    })) ?? []
  );
}

export async function getCategoryBySlug(
  slug: string,
): Promise<WPCategory | null> {
  const cats = await getCategories();
  return cats.find((c) => c.slug === slug) ?? null;
}
