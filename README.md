# Noticias33 (N33)

Portal de noticias construido con [Astro](https://astro.build) + **React** + **Tailwind CSS** como frontend y **WordPress** como CMS headless. El diseño sigue el mockup de Figma "N33 Mockup".

## Arquitectura

- **WordPress** funciona solo como gestor de contenido (los redactores publican ahí).
- **Astro** consume la API REST nativa de WordPress (`/wp-json/wp/v2`) y genera el sitio público como HTML estático — rápido y seguro, sin exponer WordPress al público.

```
Redactores → WordPress (CMS) → API REST → Astro (build) → Sitio estático
```

## Requisitos

- Node.js 22.12 o superior
- Una instalación de WordPress accesible por HTTP(S) con entradas publicadas
  (no requiere plugins: se usa la API REST nativa)

## Configuración

1. Copia `.env.example` a `.env` y coloca la URL de tu WordPress:

   ```
   WP_URL=https://tu-wordpress.com
   ```

2. Instala dependencias y arranca el servidor de desarrollo:

   ```
   npm install
   npm run dev
   ```

3. Abre http://localhost:4321

## Comandos

| Comando           | Acción                                       |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Servidor de desarrollo en `localhost:4321`   |
| `npm run build`   | Genera el sitio estático en `./dist/`        |
| `npm run preview` | Previsualiza el build antes de publicar      |

## Estructura

```
public/brand/                 # Logos e imágenes de marca exportados del Figma
src/
├── lib/wordpress.ts          # Cliente de la API REST de WordPress
├── styles/global.css         # Tailwind + tokens del diseño (azul #1f5faa, rosa #f33d5b)
├── layouts/Base.astro        # Shell HTML; obtiene categorías y ticker para el header
├── components/               # Componentes React + Tailwind
│   ├── Header.tsx            # Fecha + ticker, barra azul con logo y buscador, menú
│   ├── Footer.tsx            # Footer rosa con secciones y redes
│   ├── Newsletter.tsx        # Banner "Síguenos" con formulario de suscripción
│   ├── Chip.tsx              # Listón de categoría
│   └── cards.tsx             # HeroNews, FeatureNews, NewsRow, PanelNews
└── pages/
    ├── index.astro           # Portada por niveles de relevancia (como el mockup)
    ├── noticias/[slug].astro # Detalle de una noticia
    └── categoria/[slug].astro# Noticias por categoría
```

## Notas importantes

- El sitio es **estático**: el contenido se obtiene de WordPress en el momento
  del `build`. Para publicar noticias nuevas hay que reconstruir el sitio
  (en hosts como Netlify/Vercel se automatiza con un *webhook* desde WordPress,
  por ejemplo con el plugin "WP Webhooks" al publicar una entrada).
- Si se necesita contenido en tiempo real sin rebuilds, se puede cambiar a
  renderizado en servidor (SSR) añadiendo un adaptador de Astro
  (`npx astro add node`, `vercel`, `netlify`, etc.).
- Las imágenes destacadas se sirven directamente desde WordPress; el dominio
  del CMS debe ser accesible públicamente para que se vean.
