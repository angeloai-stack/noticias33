import { FOOTER_SECTION_NAMES, findSection } from "../lib/sections";

const SECONDARY_LINKS = [
  "Contacto",
  "Sobre nosotros",
  "Términos de uso",
  "Política de privacidad",
];

export default function Footer() {
  const year = new Date().getFullYear();
  const links = FOOTER_SECTION_NAMES.map((name) => {
    const section = findSection(name);
    return { name, href: section ? `/categoria/${section.slug}/` : "/" };
  });

  return (
    <footer className="bg-n33-pink font-ui text-white">
      <div className="mx-auto max-w-360 px-6 py-12 lg:px-12">
        <nav className="flex flex-wrap gap-x-10 gap-y-2 text-[1.2rem] font-bold">
          {links.map((link) => (
            <a key={link.name} href={link.href} className="hover:underline">
              {link.name}
            </a>
          ))}
        </nav>

        <hr className="my-6 border-white/60" />

        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <nav className="flex flex-wrap gap-x-10 gap-y-2 text-[1.2rem] font-light">
              {SECONDARY_LINKS.map((name) => (
                <a key={name} href="#" className="hover:underline">
                  {name}
                </a>
              ))}
            </nav>
            <img
              src="/brand/logo-footer.png"
              alt="N33"
              className="mt-10 h-24 w-auto"
            />
          </div>
          <img
            src="/brand/social-icons.svg"
            alt="Redes sociales de Noticias 33"
            className="mt-auto h-10 w-auto"
          />
        </div>

        <div className="mt-10 flex flex-wrap justify-between gap-4 text-[1.1rem] font-light">
          <span>® Noticias 33 · www.noticias33.com · {year}</span>
          <span>Todos los derechos reservados</span>
        </div>
      </div>
    </footer>
  );
}
