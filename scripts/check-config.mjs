import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, ".env");

function loadEnv() {
  if (!existsSync(envPath)) return {};
  const env = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    env[trimmed.slice(0, i).trim()] = trimmed.slice(i + 1).trim();
  }
  return env;
}

const env = loadEnv();
const required = ["WP_URL", "WP_USER", "WP_APP_PASSWORD", "ACCESS_CODE", "ADMIN_CODE"];
const optional = ["SUPABASE_URL", "SUPABASE_SERVICE_KEY"];

let ok = true;

console.log("=== N33 — verificación de configuración ===\n");

for (const key of required) {
  if (!env[key]) {
    console.log(`✗ Falta ${key} en .env`);
    ok = false;
  } else {
    console.log(`✓ ${key}`);
  }
}

for (const key of optional) {
  console.log(env[key] ? `✓ ${key}` : `○ ${key} (opcional, necesario para /admin)`);
}

const wpUrl = env.WP_URL?.replace(/\/$/, "");
if (wpUrl) {
  try {
    const res = await fetch(`${wpUrl}/wp-json/wp/v2/posts?per_page=1`);
    console.log(res.ok ? `\n✓ WordPress API responde (${res.status})` : `\n✗ WordPress API error ${res.status}`);
    if (!res.ok) ok = false;
  } catch (e) {
    console.log(`\n✗ No se pudo conectar a WordPress: ${e.message}`);
    ok = false;
  }

  if (env.WP_USER && env.WP_APP_PASSWORD) {
    const auth = Buffer.from(`${env.WP_USER}:${env.WP_APP_PASSWORD}`).toString("base64");
    const res = await fetch(`${wpUrl}/wp-json/wp/v2/users/me`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    console.log(
      res.ok
        ? "✓ Credenciales WordPress válidas (publicación habilitada)"
        : `✗ Credenciales WordPress inválidas (${res.status})`,
    );
    if (!res.ok) ok = false;
  }
}

if (env.SUPABASE_URL && env.SUPABASE_SERVICE_KEY) {
  const res = await fetch(
    `${env.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/publicaciones_log?select=id&limit=1`,
    {
      headers: {
        apikey: env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
      },
    },
  );
  if (res.ok) {
    console.log("✓ Supabase conectado (tabla publicaciones_log accesible)");
  } else {
    const body = await res.text();
    console.log(`✗ Supabase error ${res.status}: ${body.slice(0, 120)}`);
    console.log("  → Ejecuta supabase/schema.sql en el SQL Editor de Supabase");
    ok = false;
  }
} else {
  console.log("\n○ Supabase no configurado — /admin no mostrará historial");
}

console.log(ok ? "\n✓ Configuración lista" : "\n✗ Revisa los puntos marcados arriba");
process.exit(ok ? 0 : 1);
