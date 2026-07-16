import { getSecret } from "astro:env/server";

/** Lee variables de entorno en runtime (Vercel) y en desarrollo (.env). */
export function env(name: string): string | undefined {
  try {
    const value = getSecret(name);
    if (value) return value;
  } catch {
    // Fuera del runtime de Astro
  }
  return process.env[name];
}

export function wpUrl(): string {
  return (env("WP_URL") ?? "").replace(/\/$/, "");
}
