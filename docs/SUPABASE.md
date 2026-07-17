# Strapi + Supabase (PostgreSQL) — Noticias 33

Supabase te da **PostgreSQL en la nube**. Strapi sigue necesitando un **servidor aparte** (Railway, Render, Fly.io, VPS…) que se conecte a esa base.

```
Editores → Strapi (Railway/Render…)  →  Supabase Postgres
Visitantes → Astro (Vercel)          →  API REST de Strapi
```

---

## Paso 1 — Crear proyecto en Supabase

1. Entra en [supabase.com/dashboard](https://supabase.com/dashboard)
2. **New project**
3. Elige región cercana (ej. `West US` si tu audiencia está en México)
4. Genera una **contraseña de base de datos** fuerte y **guárdala** (no la recuperas fácilmente)

---

## Paso 2 — Copiar la connection string

En el proyecto: **Project Settings → Database → Connection string**

| Modo | ¿Cuándo usarlo? |
|---|---|
| **Session pooler** (puerto **5432**) | **Recomendado** para Strapi en producción (IPv4, estable) |
| **Direct** (puerto 5432, host `db.xxx.supabase.co`) | Import/export y primera migración |
| **Transaction pooler** (puerto **6543**) | Evitar con Strapi (prepared statements) |

Copia la URI en formato **URI** (no JDBC). Tu proyecto N33:

```text
postgresql://postgres.uusckdsqkvceibpevezs:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
```

Prueba la conexión después de configurar `cms/.env`:

```bash
npm run cms:test-db
```

> Si la contraseña tiene caracteres especiales (`@`, `#`, `%`…), [codifícala en URL](https://developer.mozilla.org/en-US/docs/Glossary/Percent-encoding).

---

## Paso 3 — Configurar `cms/.env` para Supabase

En **desarrollo** sigue usando SQLite. Para **producción** o prueba contra Supabase, edita `cms/.env`:

```env
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Secrets — genera valores NUEVOS para producción (no reutilices los de local)
APP_KEYS=clave1,clave2,clave3,clave4
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
JWT_SECRET=...
TRANSFER_TOKEN_SALT=...
ENCRYPTION_KEY=...

# Supabase PostgreSQL
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://postgres.[REF]:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

Comenta o elimina las líneas de SQLite (`DATABASE_FILENAME`).

Plantilla: `cms/.env.supabase.example`

---

## Paso 4 — Exportar contenido local (si aún no lo hiciste)

Desde la raíz del repo (con SQLite en local):

```bash
npm run cms:export
```

Genera `backups/n33-backup.tar.gz` (12 categorías, noticias, permisos, usuarios).

---

## Paso 5 — Primera arrancada contra Supabase

```bash
cd cms
npm run build
npm run start
```

La primera vez Strapi **crea las tablas** en Supabase. Puedes comprobarlo en Supabase → **Table Editor** (verás tablas `noticias`, `categorias`, etc.).

Si es instalación nueva, crea tu cuenta Super Admin en `/admin`.

---

## Paso 6 — Importar el backup

Detén Strapi (`Ctrl+C`) y ejecuta:

```bash
npm run cms:import
```

Vuelve a arrancar:

```bash
cd cms && npm run start
```

Verifica en http://localhost:1337/admin que categorías y noticias estén presentes.

> **Tip:** para importaciones grandes, usa temporalmente la **conexión Direct** de Supabase; después vuelve al **Session pooler** en producción.

---

## Paso 7 — Desplegar Strapi (hosting)

Supabase **no ejecuta** Strapi. Despliega la carpeta `cms/` en un servicio con Node.js:

### Render.com

Guía paso a paso: **[docs/RENDER.md](RENDER.md)**

1. [render.com](https://render.com) → **Web Service** → repo GitHub
2. **Root directory:** `cms`
3. **Build:** `npm install && npm run build` · **Start:** `npm run start`
4. Variables = mismas de `cms/.env` (Supabase + secrets)
5. URL pública → configura Vercel

Blueprint opcional en la raíz: `render.yaml`

### Railway (alternativa)

1. [railway.app](https://railway.app) → New Project → **Deploy from GitHub**
2. **Root directory:** `cms`
3. **Build:** `npm install && npm run build`
4. **Start:** `npm run start`
5. Variables de entorno (pega las mismas de `cms/.env`, incluida `DATABASE_URL` de Supabase)
6. Genera dominio público → ej. `https://n33-cms-production.up.railway.app`

### Render / Fly.io

Misma idea: root `cms`, build + start, variables iguales.

---

## Paso 8 — Conectar Astro en Vercel

En [Vercel → Environment Variables](https://vercel.com):

```env
STRAPI_URL=https://tu-cms.railway.app
STRAPI_ADMIN_URL=https://tu-cms.railway.app/admin
STRAPI_TOKEN=token-read-only
```

Crea el token en Strapi prod: **Settings → API Tokens → Read-only**.

Redeploy Astro.

---

## Imágenes en producción

Supabase Postgres **no guarda archivos**. Las fotos de Strapi van a `public/uploads/` en el servidor de Strapi (disco efímero en Railway/Render).

Opciones recomendadas:

| Opción | Notas |
|---|---|
| **Cloudinary** | Plugin Strapi, fácil para medios |
| **Supabase Storage** | Posible con plugin S3-compatible apuntando al bucket |
| **AWS S3** | Estándar en producción |

Guía general: [Strapi Upload providers](https://docs.strapi.io/cms/configurations/media-library-providers)

---

## Solución de problemas

| Error | Causa | Solución |
|---|---|---|
| `ECONNREFUSED` / timeout | URL incorrecta o pooler equivocado | Usa **Session pooler** puerto 5432 |
| `password authentication failed` | Contraseña mal copiada o sin URL-encode | Revisa en Supabase → Reset database password |
| `self signed certificate` | SSL | `DATABASE_SSL=true` y `DATABASE_SSL_REJECT_UNAUTHORIZED=false` |
| `prepared statement already exists` | Transaction pooler (6543) | Cambia a Session (5432) o Direct |
| Tablas no aparecen | Strapi no arrancó con `DATABASE_URL` | Revisa logs; confirma `DATABASE_CLIENT=postgres` |
| Sitio Astro vacío | Sin token o sin Publish | Token read-only + noticias **Published** en Strapi |

---

## Checklist Supabase + producción

- [ ] Proyecto Supabase creado
- [ ] `DATABASE_URL` (Session pooler) en el hosting de Strapi
- [ ] Secrets únicos de producción (`APP_KEYS`, JWT…)
- [ ] Backup importado (`npm run cms:import`)
- [ ] Strapi desplegado con URL pública
- [ ] API Token read-only creado
- [ ] Permisos **Public** en Noticia y Categoría (viene en el backup)
- [ ] `STRAPI_*` configuradas en Vercel
- [ ] Almacenamiento persistente para imágenes (Cloudinary/S3)
- [ ] Redeploy Astro

---

## Comandos rápidos

```bash
# Backup desde SQLite local
npm run cms:export

# Restaurar en Supabase (cms/.env apuntando a Supabase)
npm run cms:import

# Arrancar Strapi contra Supabase
cd cms && npm run build && npm run start
```
