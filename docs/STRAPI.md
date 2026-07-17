# Guía Strapi — Noticias 33

Sigue estos pasos en orden. El CMS vive en la carpeta `cms/`; el sitio público sigue en Astro.

---

## Paso 1 — Arrancar Strapi (local)

```bash
cd cms
npm run develop
```

1. Abre http://localhost:1337/admin
2. Crea tu cuenta de **Super Admin** (solo la primera vez)
3. Strapi creará automáticamente las **12 categorías** y permisos públicos al iniciar

> Si usas Node 25 y falla, prueba con Node 22 LTS (`nvm use 22`).

---

## Paso 2 — Crear token de API

1. En Strapi: **Settings → API Tokens → Create new API Token**
2. Nombre: `astro-read`, tipo **Read-only**
3. Copia el token al `.env` de la raíz del proyecto:

```env
STRAPI_URL=http://localhost:1337
STRAPI_ADMIN_URL=http://localhost:1337/admin
STRAPI_TOKEN=el-token-read-only
```

---

## Paso 3 — Verificar conexión Astro ↔ Strapi

En otra terminal, desde la raíz:

```bash
npm run check:config
npm run dev
```

Abre http://localhost:4321 — deberías ver el sitio (vacío hasta que haya noticias).

---

## Paso 4 — Publicar noticias (editores)

Los redactores **no usan Astro**. Entran al panel de Strapi:

- Local: http://localhost:1337/admin
- Producción: `https://tu-cms.com/admin`

En Astro, `/publicar` redirige al admin de Strapi.

### Crear una noticia

1. **Content Manager → Noticia → Create new entry**
2. Completa:
   - **Título** (genera el slug automático)
   - **Resumen** — texto corto para la portada
   - **Cuerpo** — editor visual (negritas, enlaces, imágenes)
   - **Imagen destacada** — arrastra una foto
   - **Categoría** — elige una sección
   - **Autor nombre** — opcional
3. Clic en **Publish**

La noticia aparece en el sitio al instante (SSR, sin rebuild).

---

## Paso 5 — Usuarios editoriales

**Settings → Administration panel → Users**

| Rol Strapi | Uso |
|---|---|
| **Author** | Escribe borradores |
| **Editor** | Publica y edita todo |
| **Super Admin** | Configura categorías y usuarios |

Para redactores no técnicos, crea cuentas con rol **Editor**.

---

## Paso 6 — Desplegar Strapi en producción (PostgreSQL)

En producción **no uses SQLite**. Usa PostgreSQL.

Guía Supabase (recomendada): **[docs/SUPABASE.md](docs/SUPABASE.md)**  
Referencia general PostgreSQL: **[docs/POSTGRES.md](docs/POSTGRES.md)**

Resumen:

1. Exporta contenido local: `npm run cms:export`
2. Crea proyecto en [Supabase](https://supabase.com/dashboard) y copia `DATABASE_URL` (Session pooler)
3. Configura `cms/.env` con Supabase (plantilla: `cms/.env.supabase.example`)
4. Importa: `npm run cms:import`
5. Despliega Strapi (Railway/Render) apuntando a Supabase
6. Conecta Vercel con `STRAPI_URL`, `STRAPI_TOKEN`, `STRAPI_ADMIN_URL`

Variables mínimas en el hosting de Strapi:

```
HOST=0.0.0.0
PORT=1337
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://...
APP_KEYS=...
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
JWT_SECRET=...
```

Luego en **Vercel** (solo Astro):

```
STRAPI_URL=https://cms.tudominio.com
STRAPI_TOKEN=token-read-only
STRAPI_ADMIN_URL=https://cms.tudominio.com/admin
```

Redeploy Astro después de agregar las variables.

---

## Solución de problemas

| Problema | Solución |
|---|---|
| Sitio vacío | ¿Hay noticias **Published** en Strapi? |
| Error 403 en API | Revisa permisos **Public** en Noticia/Categoría |
| HTTP 500 en Vercel | Falta `STRAPI_URL` o `STRAPI_TOKEN` en Vercel |
| Imágenes rotas | `STRAPI_URL` debe apuntar al mismo host donde están los uploads |

---

## Estructura del content model

**Categoría:** nombre, slug, descripción  
**Noticia:** título, slug, resumen, cuerpo (rich text), imagen destacada, categoría, autor

Los slugs de categoría coinciden con las secciones del menú (`politica`, `deportes`, `gobierno`, etc.).
