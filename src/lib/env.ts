import {
  WP_URL,
  WP_USER,
  WP_APP_PASSWORD,
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  ACCESS_CODE,
  ADMIN_CODE,
} from "astro:env/server";

const ASTRO_ENV: Record<string, string | undefined> = {
  WP_URL,
  WP_USER,
  WP_APP_PASSWORD,
  SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
  ACCESS_CODE,
  ADMIN_CODE,
};

/** Lee variables de entorno en runtime (Vercel) y en desarrollo (.env). */
export function env(name: string): string | undefined {
  return ASTRO_ENV[name] ?? process.env[name];
}

export function wpUrl(): string {
  return (env("WP_URL") ?? "").replace(/\/$/, "");
}
