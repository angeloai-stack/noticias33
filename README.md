# Noticias33 (N33)

Portal de noticias con **Astro 7** + **Strapi 5** + Tailwind. Los editores publican en el panel de Strapi; el sitio consume la API REST.

## Inicio rápido

```bash
# 1. CMS Strapi
cd cms && npm run develop
# → http://localhost:1337/admin (crear cuenta admin)

# 2. Frontend Astro (otra terminal)
cp .env.example .env   # agregar STRAPI_TOKEN
npm install
npm run check:config
npm run dev
# → http://localhost:4321
```

Guía completa: **[docs/STRAPI.md](docs/STRAPI.md)**

## Comandos

| Comando | Acción |
|---|---|
| `npm run dev` | Sitio Astro (localhost:4321) |
| `npm run cms:dev` | Panel Strapi (localhost:1337/admin) |
| `npm run check:config` | Verificar Strapi + `.env` |
| `npm run build` | Build SSR para Vercel |

## Variables (.env)

| Variable | Uso |
|---|---|
| `STRAPI_URL` | URL del CMS |
| `STRAPI_TOKEN` | Token read-only para Astro |
| `STRAPI_ADMIN_URL` | URL del panel (redirección `/publicar`) |

## Deploy

- **Astro** → Vercel (`STRAPI_URL`, `STRAPI_TOKEN`)
- **Strapi** → [Render](docs/RENDER.md) + **Supabase PostgreSQL** ([guía](docs/SUPABASE.md))

Producción: https://noticias33.vercel.app
