# Noticias33 (N33)

Portal de noticias con [Astro 7](https://astro.build) + **React** + **Tailwind CSS 4** como frontend, **WordPress** como CMS headless y **Supabase** para la bitácora editorial. El diseño sigue el mockup de Figma [N33 Mockup](https://www.figma.com/design/xNC9ZNBF5Mqi8fzRcHzI0t/N33-Mockup).

El sitio se despliega en **modo SSR** con el adaptador `@astrojs/vercel`: el contenido se obtiene de WordPress en cada solicitud, sin rebuilds manuales al publicar noticias.

## Arquitectura

```
Lectura (público)
  Visitante → Astro (Vercel SSR) → WordPress REST API (/wp-json/wp/v2)

Escritura (editorial)
  Redactor → /publicar → API Astro → WordPress (publicar)
                                    → Supabase (log en publicaciones_log)
  Admin    → /admin   → API Astro → Supabase (consultar logs)
```

- **WordPress** gestiona entradas, categorías, medios y tags. No requiere plugins: se usa la API REST nativa.
- **Astro** renderiza el sitio público y expone rutas API para el panel editorial.
- **Supabase** almacena el historial de publicaciones (éxitos y errores).

## Requisitos

- Node.js **22.12** o superior (Vercel usa Node 24 en producción)
- WordPress accesible por HTTPS con entradas publicadas
- Cuenta de Supabase (solo para `/admin` y logs de publicación)

## Configuración local

1. Copia `.env.example` a `.env` y completa las variables:

   | Variable | Uso |
   | --- | --- |
   | `WP_URL` | URL del WordPress (lectura y publicación) |
   | `WP_USER` | Usuario WP con permiso de publicar |
   | `WP_APP_PASSWORD` | Contraseña de aplicación de WordPress |
   | `ACCESS_CODE` | Clave para `/publicar` y APIs de redacción |
   | `ADMIN_CODE` | Clave para `/admin` y API de logs |
   | `SUPABASE_URL` | URL del proyecto Supabase |
   | `SUPABASE_SERVICE_KEY` | Service role key (solo servidor) |

2. Instala dependencias:

   ```bash
   npm install
   ```

3. Verifica la conexión con WordPress y Supabase:

   ```bash
   npm run check:config
   ```

4. Si usas el panel `/admin`, ejecuta `supabase/schema.sql` en el SQL Editor de Supabase para crear la tabla `publicaciones_log`.

5. Arranca el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   En segundo plano (recomendado en Cursor):

   ```bash
   astro dev --background
   astro dev status
   astro dev logs
   astro dev stop
   ```

6. Abre http://localhost:4321

## Comandos

| Comando | Acción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en `localhost:4321` |
| `npm run build` | Build SSR para Vercel en `./dist/` |
| `npm run preview` | Previsualiza el build localmente |
| `npm run check:config` | Verifica `.env`, WordPress y Supabase |
| `npm run setup:vercel-env` | Sube variables de `.env` a Vercel (requiere `VERCEL_TOKEN`) |
| `npm run setup:vercel-env:ps` | Igual que arriba, script PowerShell |

## Rutas del sitio

| Ruta | Descripción |
| --- | --- |
| `/` | Portada con bloques de noticias desde WordPress |
| `/noticias/[slug]/` | Detalle de una noticia |
| `/categoria/[slug]/` | Listado por sección (Figma) o categoría WP (p. ej. `gobierno`, `clima`) |
| `/buscar?q=...` | Búsqueda de noticias |
| `/publicar` | Panel de redacción (requiere `ACCESS_CODE`) |
| `/admin` | Historial de publicaciones en Supabase (requiere `ADMIN_CODE`) |

### APIs internas

Todas requieren el header `x-n33-code` con la clave correspondiente:

| Endpoint | Método | Clave |
| --- | --- | --- |
| `/api/categorias` | GET | `ACCESS_CODE` |
| `/api/tags?name=...` | GET | `ACCESS_CODE` |
| `/api/media` | POST | `ACCESS_CODE` |
| `/api/publicar` | POST | `ACCESS_CODE` |
| `/api/logs` | GET | `ADMIN_CODE` |

## Navegación y categorías

El menú y el footer siguen las **9 secciones del mockup** definidas en `src/lib/sections.ts` (Editorial, Estatal, Nacional, EE.UU., Política, Global, Deportes, Sociales, Tecnología).

Cada sección se enlaza con la categoría de WordPress cuyo nombre o slug coincida. Las categorías WP que no tienen sección Figma equivalente (por ejemplo **Gobierno** o **Clima**) también tienen página propia en `/categoria/{slug}/`.

## Deploy en Vercel

1. Conecta el repositorio en [Vercel](https://vercel.com).
2. Configura las **7 variables de entorno** del servidor (las mismas del `.env`, sin `VERCEL_TOKEN` en producción).
3. Despliega:

   ```bash
   npx vercel login
   npx vercel --prod
   ```

   O sube variables automáticamente desde `.env` (con token válido en `.env.local`):

   ```bash
   npm run setup:vercel-env
   ```

**Importante:** las variables deben existir en Vercel antes del deploy. Sin `WP_URL` el sitio muestra "No se pudieron cargar noticias".

## Estructura del proyecto

```
public/brand/              # Logos e imágenes de marca (Figma)
scripts/
├── check-config.mjs       # Verificación de .env, WP y Supabase
└── push-vercel-env.mjs    # Sincroniza env vars con Vercel
supabase/
└── schema.sql             # Tabla publicaciones_log
src/
├── lib/
│   ├── wordpress.ts       # Cliente REST de WordPress (lectura)
│   ├── sections.ts        # Secciones del mockup + enlaces de categoría
│   ├── env.ts             # Lectura de variables en runtime
│   └── server/
│       ├── cms.ts         # Publicación en WP + logs Supabase
│       └── api.ts         # Respuestas JSON uniformes para APIs
├── styles/global.css      # Tailwind + tokens (#1f5faa, #f33d5b)
├── layouts/Base.astro     # Shell: header, menú, footer, ticker
├── components/
│   ├── Header.tsx         # Fecha, ticker, buscador, menú hamburguesa
│   ├── NavMenu.tsx        # Secciones Figma + panel desplegable
│   ├── Footer.tsx
│   ├── cards.tsx          # HeroNews, FeatureNews, NewsRow, PanelNews
│   ├── RightRail.tsx      # Últimas noticias, clima, publicidad
│   ├── Publisher.tsx      # Formulario /publicar
│   └── AdminLogs.tsx      # Panel /admin
└── pages/
    ├── index.astro
    ├── buscar.astro
    ├── publicar.astro
    ├── admin.astro
    ├── noticias/[slug].astro
    ├── categoria/[slug].astro
    └── api/               # categorias, tags, media, publicar, logs
```

## Seguridad

- Las claves (`WP_*`, `SUPABASE_*`, `ACCESS_CODE`, `ADMIN_CODE`) son **solo del servidor**. No uses prefijo `PUBLIC_` ni las subas al repositorio.
- `.env` y `.env.local` están en `.gitignore`.
- Cambia los códigos de ejemplo (`1111` / `2222`) antes de producción.
- Las imágenes subidas en `/api/media` se validan en servidor (tipo `image/*`, máximo 5 MB).

## Notas

- Las imágenes destacadas se sirven desde WordPress; el dominio del CMS debe ser accesible públicamente.
- El contenido HTML de las noticias proviene de WordPress y se renderiza tal cual en las páginas de detalle.
- Producción de referencia: https://noticias33.vercel.app
