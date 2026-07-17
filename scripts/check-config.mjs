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
let ok = true;

console.log("=== N33 — verificación de configuración ===\n");

for (const key of ["STRAPI_URL"]) {
  if (!env[key]) {
    console.log(`✗ Falta ${key} en .env`);
    ok = false;
  } else {
    console.log(`✓ ${key}`);
  }
}

if (env.STRAPI_TOKEN) {
  console.log("✓ STRAPI_TOKEN");
} else {
  console.log("○ STRAPI_TOKEN (opcional con permisos Public activos)");
}

const strapiUrl = env.STRAPI_URL?.replace(/\/$/, "");
if (strapiUrl) {
  try {
    const headers = { Accept: "application/json" };
    if (env.STRAPI_TOKEN) {
      headers.Authorization = `Bearer ${env.STRAPI_TOKEN}`;
    }
    const res = await fetch(
      `${strapiUrl}/api/noticias?pagination[pageSize]=1&populate[0]=categoria`,
      { headers },
    );
    if (res.ok) {
      console.log(`\n✓ Strapi API responde (${res.status})`);
    } else if (res.status === 403) {
      console.log(
        `\n⚠ Strapi responde 403 — activa permisos Public en Noticia/Categoría`,
      );
      console.log("  → Settings → Users & Permissions → Roles → Public");
    } else {
      console.log(`\n✗ Strapi API error ${res.status}`);
      ok = false;
    }
  } catch (e) {
    console.log(`\n✗ No se pudo conectar a Strapi: ${e.message}`);
    console.log("  → ¿Está corriendo? cd cms && npm run develop");
    ok = false;
  }
}

console.log(
  ok
    ? "\n✓ Configuración lista"
    : "\n✗ Revisa los puntos marcados arriba (ver docs/STRAPI.md)",
);
process.exit(ok ? 0 : 1);
