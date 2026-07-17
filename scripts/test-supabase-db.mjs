/**
 * Prueba conexión a Supabase Postgres leyendo cms/.env
 * Uso: npm run cms:test-db
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const envPath = resolve(root, "cms", ".env");
const require = createRequire(import.meta.url);
const { Client } = require(resolve(root, "cms/node_modules/pg"));

function loadEnv() {
  if (!existsSync(envPath)) {
    console.error("✗ No existe cms/.env");
    process.exit(1);
  }
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
const url = env.DATABASE_URL;

if (!url || url.includes("[YOUR-PASSWORD]") || url.includes("PEGA_PASSWORD")) {
  console.error("✗ Configura DATABASE_URL en cms/.env con tu contraseña real de Supabase.");
  console.error("  Ver docs/SUPABASE.md o cms/.env.supabase.example");
  process.exit(1);
}

const client = new Client({
  connectionString: url,
  ssl: env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
});

try {
  await client.connect();
  const { rows } = await client.query("select version()");
  console.log("✓ Conexión OK a Supabase");
  console.log(`  ${rows[0].version.split(",")[0]}`);
  await client.end();
} catch (err) {
  console.error("✗ Error de conexión:", err.message);
  if (err.message.includes("password authentication failed")) {
    console.error("  → Revisa la contraseña en DATABASE_URL (percent-encode si tiene @ # % etc.)");
  }
  process.exit(1);
}
