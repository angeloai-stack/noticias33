# Strapi en Render.com + Supabase — Noticias 33

Despliega el CMS (`cms/`) en [Render](https://render.com). La base de datos sigue en **Supabase** (ya migrada).

```
Editores → Render (Strapi) → Supabase Postgres
Visitantes → Vercel (Astro) → API de Strapi en Render
```

---

## Requisitos previos

- [ ] Repo en **GitHub** con el código subido
- [ ] Supabase con tablas y contenido importado (ya hecho)
- [ ] Valores de `cms/.env` a mano (secrets + `DATABASE_URL`)

---

## Paso 1 — Crear cuenta y conectar GitHub

1. [render.com](https://render.com) → Sign up (con GitHub)
2. **Account Settings → Connect GitHub** → autoriza el repo `N33`

---

## Paso 2 — Crear Web Service

1. Dashboard → **New +** → **Web Service**
2. Conecta el repositorio **N33**
3. Configura:

| Campo | Valor |
|---|---|
| **Name** | `n33-strapi` (o el que quieras) |
| **Region** | Oregon (US West) — cerca de Supabase |
| **Branch** | `main` |
| **Root Directory** | `cms` |
| **Runtime** | Node |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start` |
| **Instance type** | Free (prueba) o Starter (producción) |

> Alternativa: **New + → Blueprint** si subiste `render.yaml` en la raíz del repo.

---

## Paso 3 — Variables de entorno

En el servicio → **Environment** → **Add Environment Variable**.

Copia **todo** desde tu `cms/.env` local:

```env
NODE_ENV=production
HOST=0.0.0.0

APP_KEYS=...
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
JWT_SECRET=...
TRANSFER_TOKEN_SALT=...
ENCRYPTION_KEY=...

DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://postgres.uusckdsqkvceibpevezs:...@aws-0-us-west-1.pooler.supabase.com:5432/postgres
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

**No configures `PORT`** — Render la asigna automáticamente y Strapi la usa.

Guarda. Render hará el primer deploy (5–10 min la primera vez).

---

## Paso 4 — Verificar el deploy

1. Cuando el estado sea **Live**, abre la URL:  
   `https://n33-strapi.onrender.com` (o la que te asigne Render)
2. Admin: `https://TU-SERVICIO.onrender.com/admin`
3. API de prueba:  
   `https://TU-SERVICIO.onrender.com/api/noticias?status=published`

Si ves noticias en JSON, Strapi + Supabase funcionan en producción.

---

## Paso 5 — API Token para Astro

En Strapi prod (Render):

1. **Settings → API Tokens → Create new API Token**
2. Nombre: `astro-read`, tipo **Read-only**
3. Copia el token

---

## Paso 6 — Conectar Vercel (Astro)

En [Vercel → tu proyecto → Settings → Environment Variables](https://vercel.com):

```env
STRAPI_URL=https://TU-SERVICIO.onrender.com
STRAPI_ADMIN_URL=https://TU-SERVICIO.onrender.com/admin
STRAPI_TOKEN=el-token-read-only
```

**Redeploy** Astro (Deployments → ⋯ → Redeploy).

O desde local (con `VERCEL_TOKEN` en `.env.local`):

```bash
# Actualiza .env raíz con las URLs de Render
npm run setup:vercel-env
```

---

## Plan Free vs Starter

| | Free | Starter (~$7/mes) |
|---|---|---|
| Cold start | Sí (~30 s tras inactividad) | No |
| Disco | Efímero | Efímero |
| Uso editorial | Pruebas | Producción recomendada |

---

## Imágenes (importante)

Render **no guarda** `public/uploads/` entre redeploys. Para fotos de noticias en producción:

- **Cloudinary** (recomendado) — [plugin Strapi](https://docs.strapi.io/cms/configurations/media-library-providers)
- O **Supabase Storage** con provider S3-compatible

---

## Solución de problemas

| Problema | Solución |
|---|---|
| Build falla | Revisa logs; confirma **Root Directory = `cms`** |
| `Application failed to respond` | Falta `HOST=0.0.0.0` |
| Error DB / timeout | Usa Session pooler Supabase (puerto 5432) |
| Admin pide registro otra vez | Normal si es DB nueva; crea Super Admin |
| Sitio Vercel vacío | `STRAPI_URL` debe ser URL de Render, no `localhost` |
| Deploy muy lento | Normal en Free; Strapi build tarda varios minutos |

---

## Comandos útiles (local)

```bash
# Probar Supabase antes de deploy
npm run cms:test-db

# Backup
npm run cms:export
```

---

## Checklist producción

- [ ] Web Service en Render (root `cms`)
- [ ] Variables de entorno copiadas de `cms/.env`
- [ ] Deploy **Live**
- [ ] `/api/noticias?status=published` responde JSON
- [ ] API Token read-only creado
- [ ] `STRAPI_*` en Vercel + redeploy
- [ ] Almacenamiento de imágenes (Cloudinary) — pendiente para fotos reales
