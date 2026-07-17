# Migración a PostgreSQL — Noticias 33

Guía para pasar de SQLite (desarrollo) a PostgreSQL (producción).

## Resumen

| Entorno | Base de datos | Archivo / servicio |
|---|---|---|
| Desarrollo local | SQLite | `cms/.tmp/data.db` |
| Producción | PostgreSQL | **Supabase** ([guía](SUPABASE.md)), Neon, Railway, etc. |

Las **imágenes** siguen en `cms/public/uploads/` (local) o en almacenamiento cloud en producción (S3, Cloudinary).

---

## Opción A — Exportar contenido local e importar en PostgreSQL (recomendado)

### 1. Exportar desde SQLite (con Strapi corriendo en local)

```bash
cd cms
npm run export -- --no-encrypt -f ../backups/n33-backup
```

Se crea `backups/n33-backup.tar.gz` con noticias, categorías, usuarios y medios.

### 2. Crear base PostgreSQL

**Supabase** (recomendado para N33): sigue **[docs/SUPABASE.md](SUPABASE.md)** paso a paso.

**O local con Docker** (prueba):

```bash
docker compose -f docker-compose.postgres.yml up -d
```

URL local: `postgresql://n33:n33_local_dev@localhost:5432/n33_cms`

### 3. Configurar Strapi para PostgreSQL

En `cms/.env` (producción o prueba local):

```env
HOST=0.0.0.0
PORT=1337

# Mantén los mismos APP_KEYS y secrets del .env actual en producción
APP_KEYS=...
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
JWT_SECRET=...
TRANSFER_TOKEN_SALT=...
ENCRYPTION_KEY=...

DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://usuario:password@host:5432/n33_cms
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

Comenta o elimina las líneas de SQLite.

### 4. Primera arrancada (crea tablas vacías)

```bash
cd cms
npm run build
npm run start
```

Crea tu admin si es instalación nueva, o continúa al paso 5.

### 5. Importar el backup

Detén Strapi y ejecuta:

```bash
cd cms
npm run import -- -f ../backups/n33-backup.tar.gz
npm run start
```

Verifica en el admin que categorías y noticias estén presentes.

---

## Opción B — PostgreSQL vacío + bootstrap (sin migrar SQLite)

Si en local aún no tienes mucho contenido:

1. Configura `DATABASE_CLIENT=postgres` + `DATABASE_URL`
2. `npm run build && npm run start`
3. El bootstrap en `cms/src/index.ts` crea categorías y noticias demo automáticamente
4. Publica contenido nuevo desde el panel

---

## Desplegar Strapi en Railway

1. Sube el repo a GitHub (carpeta `cms/` como root del servicio o monorepo)
2. Railway → **New Service** → conecta el repo
3. **Root directory:** `cms`
4. **Build command:** `npm install && npm run build`
5. **Start command:** `npm run start`
6. Añade plugin **PostgreSQL** al proyecto y vincula `DATABASE_URL` al servicio Strapi
7. Variables obligatorias (copia de tu `cms/.env` local):

```
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_URL=${{Postgres.DATABASE_URL}}
APP_KEYS=...
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
JWT_SECRET=...
TRANSFER_TOKEN_SALT=...
ENCRYPTION_KEY=...
```

8. Genera dominio público → ej. `https://n33-cms-production.up.railway.app`

---

## Conectar Astro (Vercel) al Strapi en producción

En [Vercel → Environment Variables](https://vercel.com):

```
STRAPI_URL=https://tu-cms.railway.app
STRAPI_ADMIN_URL=https://tu-cms.railway.app/admin
STRAPI_TOKEN=token-read-only-de-strapi
```

Crea el token en Strapi prod: **Settings → API Tokens → Read-only**.

Redeploy Astro.

---

## Imágenes en producción

En Railway el disco es **efímero**: al redeploy pueden perderse archivos en `public/uploads/`.

Opciones:

1. **Strapi Cloud** — incluye almacenamiento gestionado
2. **Plugin S3 / Cloudinary** — [Strapi Upload providers](https://docs.strapi.io/cms/configurations/media-library-providers)
3. **Railway Volume** — montar volumen persistente en `/app/public/uploads`

Para un medio de noticias, **Cloudinary** o **S3** es lo más fiable.

---

## Comandos útiles

```bash
# Exportar backup
cd cms && npm run export -- --no-encrypt -f ../backups/n33-$(date +%Y%m%d)

# Importar backup
cd cms && npm run import -- -f ../backups/n33-backup.tar.gz

# Probar Postgres local
docker compose -f docker-compose.postgres.yml up -d
```

---

## Checklist producción

- [ ] PostgreSQL creado y `DATABASE_URL` configurada
- [ ] Secrets (`APP_KEYS`, JWT, etc.) únicos para producción
- [ ] Contenido importado o republicado
- [ ] API Token read-only para Astro
- [ ] Permisos **Public** en Noticia y Categoría
- [ ] `STRAPI_*` en Vercel
- [ ] Almacenamiento de imágenes persistente (S3/Cloudinary/volumen)
- [ ] Redeploy Astro
