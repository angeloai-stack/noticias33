import type { Core } from "@strapi/strapi";

/** Categorías iniciales alineadas con N33 (secciones Figma + editoriales). */
const SEED_CATEGORIAS = [
  { nombre: "Editorial", slug: "editorial" },
  { nombre: "Estatal", slug: "estatal" },
  { nombre: "Nacional", slug: "nacional" },
  { nombre: "EE.UU.", slug: "ee-uu" },
  { nombre: "Política", slug: "politica" },
  { nombre: "Global", slug: "global" },
  { nombre: "Deportes", slug: "deportes" },
  { nombre: "Sociales", slug: "sociales" },
  { nombre: "Tecnología", slug: "tecnologia" },
  { nombre: "Gobierno", slug: "gobierno" },
  { nombre: "Clima", slug: "clima" },
  { nombre: "Policiaca", slug: "policiaca" },
];

const PUBLIC_ACTIONS = [
  "api::noticia.noticia.find",
  "api::noticia.noticia.findOne",
  "api::categoria.categoria.find",
  "api::categoria.categoria.findOne",
];

async function enablePublicPermissions(strapi: Core.Strapi) {
  const publicRole = await strapi.db.query("plugin::users-permissions.role").findOne({
    where: { type: "public" },
    populate: ["permissions"],
  });
  if (!publicRole) return;

  const existing = new Set(
    (publicRole.permissions ?? []).map((p: { action: string }) => p.action),
  );

  for (const action of PUBLIC_ACTIONS) {
    if (existing.has(action)) continue;
    await strapi.db.query("plugin::users-permissions.permission").create({
      data: { action, role: publicRole.id },
    });
  }
}

async function seedCategorias(strapi: Core.Strapi) {
  for (const item of SEED_CATEGORIAS) {
    const found = await strapi.db.query("api::categoria.categoria").findOne({
      where: { slug: item.slug },
    });
    if (found) continue;
    await strapi.db.query("api::categoria.categoria").create({
      data: item,
    });
  }
}

const DEMO_NOTICIAS = [
  {
    titulo: "Gobierno anuncia nuevo plan de infraestructura en Baja California",
    slug: "plan-infraestructura-bc",
    resumen:
      "Autoridades presentaron un paquete de obras para carreteras, agua potable y espacios públicos en las siete delegaciones.",
    cuerpo:
      "<p>El gobierno estatal dio a conocer un plan de infraestructura que contempla inversión en vialidades, agua potable y rehabilitación de espacios públicos.</p><p>Las obras iniciarán en el segundo semestre del año, según fuentes oficiales.</p>",
    categoriaSlug: "gobierno",
  },
  {
    titulo: "Política local: debate por presupuesto municipal",
    slug: "debate-presupuesto-municipal",
    resumen:
      "Regidores discuten prioridades de gasto para seguridad, alumbrado y programas sociales en la frontera.",
    cuerpo:
      "<p>El cabildo municipal abrió el debate sobre el presupuesto 2026, con propuestas enfocadas en seguridad pública y servicios básicos.</p>",
    categoriaSlug: "politica",
  },
  {
    titulo: "Deportes: equipo fronterizo suma triunfo en la liga estatal",
    slug: "triunfo-liga-estatal",
    resumen:
      "Con gol en los minutos finales, el conjunto local se mantiene en zona de clasificación.",
    cuerpo:
      "<p>El equipo representativo de la región ganó 2-1 en partido correspondiente a la jornada 12 de la liga estatal.</p>",
    categoriaSlug: "deportes",
  },
  {
    titulo: "Clima: frente frío traerá temperaturas bajas este fin de semana",
    slug: "frente-frio-fin-de-semana",
    resumen:
      "La dependencia estatal recomienda abrigarse y tomar precauciones en zonas serranas.",
    cuerpo:
      "<p>Se espera descenso de temperaturas en Baja California por la entrada de un nuevo frente frío.</p>",
    categoriaSlug: "clima",
  },
];

async function seedDemoNoticias(strapi: Core.Strapi) {
  const count = await strapi.db.query("api::noticia.noticia").count();
  if (count > 0) return;

  for (const item of DEMO_NOTICIAS) {
    const categoria = await strapi.db.query("api::categoria.categoria").findOne({
      where: { slug: item.categoriaSlug },
    });

    await strapi.db.query("api::noticia.noticia").create({
      data: {
        titulo: item.titulo,
        slug: item.slug,
        resumen: item.resumen,
        cuerpo: item.cuerpo,
        autorNombre: "Redacción N33",
        publishedAt: new Date(),
        ...(categoria ? { categoria: categoria.id } : {}),
      },
    });
  }

  strapi.log.info("[N33] Noticias de demostración creadas para el frontend Astro");
}

export default {
  register() {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await enablePublicPermissions(strapi);
    await seedCategorias(strapi);
    await seedDemoNoticias(strapi);
  },
};
