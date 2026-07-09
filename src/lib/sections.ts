/**
 * Secciones fijas del sitio, tal como aparecen en el mockup de Figma
 * (menú superior, nodo 48:156). Cada una tiene su página /categoria/{slug}/
 * y se llena con la categoría de WordPress cuyo nombre o slug coincida.
 */

export interface Section {
  name: string;
  slug: string;
}

export const SECTIONS: Section[] = [
  { name: "Editorial", slug: "editorial" },
  { name: "Estatal", slug: "estatal" },
  { name: "Nacional", slug: "nacional" },
  { name: "EE.UU", slug: "ee-uu" },
  { name: "Política", slug: "politica" },
  { name: "Global", slug: "global" },
  { name: "Deportes", slug: "deportes" },
  { name: "Sociales", slug: "sociales" },
  { name: "Tecnología", slug: "tecnologia" },
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
