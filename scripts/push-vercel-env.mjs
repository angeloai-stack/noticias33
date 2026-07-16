import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PROJECT_ID = "prj_isaQ80b1maP9IgLsVCrvFLPx1nn7";
const TEAM_ID = "team_PqvoXmKKJlzPJzRUApWzla1m";

const KEYS = [
  "WP_URL",
  "WP_USER",
  "WP_APP_PASSWORD",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_KEY",
  "ACCESS_CODE",
  "ADMIN_CODE",
];

const TARGETS = ["production", "preview", "development"];

function loadEnvFile(name) {
  const path = resolve(root, name);
  if (!existsSync(path)) return {};
  const env = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    let value = trimmed.slice(i + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[trimmed.slice(0, i).trim()] = value;
  }
  return env;
}

async function vercelApi(path, token, init = {}) {
  const url = `https://api.vercel.com${path}${path.includes("?") ? "&" : "?"}teamId=${TEAM_ID}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error?.message || body.message || `HTTP ${res.status}`);
  }
  return body;
}

async function main() {
  const env = { ...loadEnvFile(".env"), ...loadEnvFile(".env.local") };
  const token = env.VERCEL_TOKEN || process.env.VERCEL_TOKEN;

  if (!token) {
    console.log("Falta VERCEL_TOKEN.\n");
    console.log("1. Crea un token en https://vercel.com/account/tokens");
    console.log("2. Agrégalo a .env.local:\n   VERCEL_TOKEN=vcp_...\n");
    console.log("3. Ejecuta: npm run setup:vercel-env\n");
    process.exit(1);
  }

  try {
    const user = await vercelApi("/v2/user", token);
    console.log(`Cuenta Vercel: ${user.user?.username || user.user?.email}\n`);
  } catch (e) {
    console.log("Token inválido o expirado. Crea uno nuevo en vercel.com/account/tokens\n");
    console.log(String(e.message || e));
    process.exit(1);
  }

  let existing = [];
  try {
    const data = await vercelApi(`/v9/projects/${PROJECT_ID}/env`, token);
    existing = data.envs ?? [];
  } catch (e) {
    console.log("No se pudo leer el proyecto noticias33:", e.message);
    process.exit(1);
  }

  for (const key of KEYS) {
    const value = env[key];
    if (!value) {
      console.log(`○ Omitido ${key}`);
      continue;
    }

    console.log(`→ ${key}...`);
    for (const target of TARGETS) {
      const prev = existing.filter((item) => item.key === key && item.target?.includes(target));
      for (const item of prev) {
        await vercelApi(`/v9/projects/${PROJECT_ID}/env/${item.id}`, token, {
          method: "DELETE",
        });
      }

      await vercelApi(`/v10/projects/${PROJECT_ID}/env`, token, {
        method: "POST",
        body: JSON.stringify({
          key,
          value,
          type: "encrypted",
          target: [target],
        }),
      });
      console.log(`  ✓ ${target}`);
    }
  }

  console.log("\nVariables enviadas. Despliega con:\n  vercel --prod\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
