/**
 * Secciones fijas del sitio, tal como aparecen en el mockup de Figma
 * (menú superior, nodo 48:156). Cada una tiene su página /categoria/{slug}/
 * y se llena con la categoría de WordPress cuyo nombre o slug coincida.
 */

export interface Section {
  name: string;
  slug: string;
  /** Subcategorías del menú desplegable (nodo 48:130 del mockup). */
  subsections: string[];
}

export const SECTIONS: Section[] = [
  {
    name: "Editorial",
    slug: "editorial",
    subsections: ["Editorial", "Columnistas"],
  },
  {
    name: "Estatal",
    slug: "estatal",
    subsections: [
      "Tijuana",
      "Rosarito",
      "Ensenada",
      "San Quintín",
      "Tecate",
      "Mexicali",
      "San Felipe",
    ],
  },
  {
    name: "Nacional",
    slug: "nacional",
    subsections: ["Estados", "Gobierno", "Política", "Seguridad", "Economía"],
  },
  {
    name: "EE.UU",
    slug: "ee-uu",
    subsections: [
      "Política",
      "Economía",
      "Seguridad",
      "Inmigración",
      "California",
      "Comunidad latina",
      "Turismo",
    ],
  },
  {
    name: "Política",
    slug: "politica",
    subsections: [
      "Presidencia",
      "Senado",
      "Cámara de diputados",
      "Poder Judicial",
      "INE",
      "Partidos políticos",
      "Elecciones",
      "Transparencia",
    ],
  },
  {
    name: "Global",
    slug: "global",
    subsections: [
      "América",
      "Europa",
      "Asia",
      "Medio Oriente",
      "Conflictos",
      "Diplomacia",
    ],
  },
  {
    name: "Deportes",
    slug: "deportes",
    subsections: [
      "Fútbol",
      "NFL",
      "NBA",
      "MLB",
      "Boxeo",
      "MMA",
      "Motor",
      "Tenis",
      "Local",
      "Resultados",
    ],
  },
  {
    name: "Sociales",
    slug: "sociales",
    subsections: ["En Sociedad", "Gente", "Eventos", "Lifestyle"],
  },
  {
    name: "Tecnología",
    slug: "tecnologia",
    subsections: [
      "Innovación",
      "Inteligencia Artificial",
      "Gadgets",
      "Software",
      "Apps",
      "Ciencia y Tecnología",
      "Videojuegos",
      "Ciberseguridad",
      "Empresas Tech",
    ],
  },
];

/** Orden de las secciones en el footer del mockup (nodo 7:228). */
export const FOOTER_SECTION_NAMES = [
  "Editorial",
  "Estatal",
  "Nacional",
  "Global",
  "Deportes",
  "Sociales",
  "Tecnología",
  "Política",
];

/** Compara nombres/slugs ignorando acentos, mayúsculas y puntuación. */
export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

/** Sección que corresponde a un nombre o slug (de WordPress), si existe. */
export function findSection(nameOrSlug: string): Section | undefined {
  const target = normalize(nameOrSlug);
  return SECTIONS.find(
    (s) => normalize(s.name) === target || normalize(s.slug) === target,
  );
}

/** Enlace de categoría alineado al menú del mockup (si hay sección equivalente). */
export function sectionHref(nameOrSlug: string): string | undefined {
  const section = findSection(nameOrSlug);
  return section ? `/categoria/${section.slug}/` : undefined;
}

/** Slug URL para categorías de WordPress sin sección Figma equivalente. */
export function wpCategorySlug(nameOrSlug: string): string {
  return nameOrSlug
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Enlace a página de categoría (sección Figma o categoría WP directa). */
export function categoryHref(nameOrSlug: string, wpSlug?: string): string {
  return sectionHref(nameOrSlug) ?? `/categoria/${wpSlug ?? wpCategorySlug(nameOrSlug)}/`;
}
