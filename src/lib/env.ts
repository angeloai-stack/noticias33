import { STRAPI_URL, STRAPI_ADMIN_URL } from "astro:env/server";

/** STRAPI_TOKEN se lee de process.env (puede estar vacío con permisos Public). */
export function env(name: string): string | undefined {
  if (name === "STRAPI_URL") return STRAPI_URL ?? process.env.STRAPI_URL;
  if (name === "STRAPI_ADMIN_URL") {
    return STRAPI_ADMIN_URL ?? process.env.STRAPI_ADMIN_URL;
  }
  return process.env[name];
}

export function strapiUrl(): string {
  return (env("STRAPI_URL") ?? "").replace(/\/$/, "");
}

export function strapiAdminUrl(): string {
  return (env("STRAPI_ADMIN_URL") ?? `${strapiUrl()}/admin`).replace(/\/$/, "");
}
