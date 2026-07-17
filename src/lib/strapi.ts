/**
 * Cliente REST de Strapi para Noticias 33.
 * Documentación: https://docs.strapi.io/cms/api/rest
 */

import type { Article, Category } from "./content";
import { categoryHref } from "./sections";
import { env, strapiUrl } from "./env";

interface StrapiMedia {
  url?: string;
  alternativeText?: string | null;
}

interface StrapiCategoria {
  id: number;
  nombre: string;
  slug: string;
  descripcion?: string | null;
}

interface StrapiNoticia {
  id: number;
  titulo: string;
  slug: string;
  resumen?: string | null;
  cuerpo: string;
  publishedAt?: string | null;
  createdAt?: string;
  autorNombre?: string | null;
  imagenDestacada?: StrapiMedia | null;
  categoria?: StrapiCategoria | null;
}

interface StrapiList<T> {
  data: T[];
  meta?: { pagination?: { total?: number } };
}

function mediaUrl(media?: StrapiMedia | null): string | null {
  if (!media?.url) return null;
  if (media.url.startsWith("http")) return media.url;
  return `${strapiUrl()}${media.url}`;
}

function mapCategory(raw: StrapiCategoria, count = 0): Category {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.nombre,
    description: raw.descripcion ?? "",
    count,
  };
}

function mapArticle(raw: StrapiNoticia): Article {
  const imageUrl = mediaUrl(raw.imagenDestacada);
  const category = raw.categoria ? [mapCategory(raw.categoria, 1)] : [];

  return {
    id: raw.id,
    slug: raw.slug,
    date: raw.publishedAt ?? raw.createdAt ?? new Date().toISOString(),
    title: raw.titulo,
    excerpt: raw.resumen ?? "",
    content: raw.cuerpo,
    author: raw.autorNombre ?? "Redacción N33",
    authorAvatar: null,
    categories: category,
    featuredImage: imageUrl
      ? { source_url: imageUrl, alt_text: raw.imagenDestacada?.alternativeText ?? "" }
      : null,
  };
}

async function strapiFetch<T>(path: string, params?: URLSearchParams): Promise<T | null> {
  const base = strapiUrl();
  if (!base) {
    console.warn("[strapi] STRAPI_URL no está configurada");
    return null;
  }

  const query = params?.toString();
  const url = `${base}/api/${path}${query ? `?${query}` : ""}`;
  const headers: Record<string, string> = { Accept: "application/json" };
  const token = env("STRAPI_TOKEN");
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.warn(`[strapi] ${res.status} en /api/${path}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`[strapi] No se pudo conectar a ${url}:`, err);
    return null;
  }
}

function publishedParams(extra?: URLSearchParams): URLSearchParams {
  const params = new URLSearchParams(extra);
  params.set("status", "published");
  params.set("populate[0]", "imagenDestacada");
  params.set("populate[1]", "categoria");
  params.set("sort[0]", "publishedAt:desc");
  return params;
}

/** Últimas noticias publicadas. */
export async function getPosts(
  opts: { perPage?: number; page?: number; categoryId?: number } = {},
): Promise<Article[]> {
  const params = publishedParams();
  params.set("pagination[pageSize]", String(opts.perPage ?? 12));
  params.set("pagination[page]", String(opts.page ?? 1));
  if (opts.categoryId) {
    params.set("filters[categoria][id][$eq]", String(opts.categoryId));
  }

  const raw = await strapiFetch<StrapiList<StrapiNoticia>>("noticias", params);
  return raw?.data?.map(mapArticle) ?? [];
}

export async function getPostBySlug(slug: string): Promise<Article | null> {
  const params = publishedParams();
  params.set("filters[slug][$eq]", slug);
  params.set("pagination[pageSize]", "1");

  const raw = await strapiFetch<StrapiList<StrapiNoticia>>("noticias", params);
  return raw?.data?.[0] ? mapArticle(raw.data[0]) : null;
}

export async function searchPosts(
  query: string,
  opts: { perPage?: number } = {},
): Promise<Article[]> {
  const term = query.trim();
  if (!term) return [];

  const params = publishedParams();
  params.set("pagination[pageSize]", String(opts.perPage ?? 20));
  params.set("filters[$or][0][titulo][$containsi]", term);
  params.set("filters[$or][1][resumen][$containsi]", term);
  params.set("filters[$or][2][cuerpo][$containsi]", term);

  const raw = await strapiFetch<StrapiList<StrapiNoticia>>("noticias", params);
  return raw?.data?.map(mapArticle) ?? [];
}

export async function getAllCategories(): Promise<Category[]> {
  const params = new URLSearchParams({
    "pagination[pageSize]": "100",
    "sort[0]": "nombre:asc",
  });

  const raw = await strapiFetch<StrapiList<StrapiCategoria>>("categorias", params);
  return raw?.data?.map((c) => mapCategory(c)) ?? [];
}

export async function getCategories(): Promise<Category[]> {
  return getAllCategories();
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const params = new URLSearchParams({
    "filters[slug][$eq]": slug,
    "pagination[pageSize]": "1",
  });

  const raw = await strapiFetch<StrapiList<StrapiCategoria>>("categorias", params);
  return raw?.data?.[0] ? mapCategory(raw.data[0]) : null;
}

export function categoryUrl(slug: string): string {
  return categoryHref(slug, slug);
}
