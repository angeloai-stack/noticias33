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
      <div className="mx-auto max-w-360 px-4 py-8 sm:px-6 md:py-12 lg:px-12">
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-base font-bold sm:gap-x-10 sm:text-[1.2rem]">
          {links.map((link) => (
            <a key={link.name} href={link.href} className="link-underline">
              {link.name}
            </a>
          ))}
        </nav>

        <hr className="my-6 border-white/60" />

        <div className="flex flex-wrap items-start justify-between gap-8">
          <div>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-base font-light sm:gap-x-10 sm:text-[1.2rem]">
              {SECONDARY_LINKS.map((name) => (
                <a key={name} href="#" className="link-underline">
                  {name}
                </a>
              ))}
            </nav>
            <img
              src="/brand/logo-footer.png"
              alt="N33"
              className="mt-8 h-16 w-auto sm:h-20 md:mt-10 md:h-24"
            />
          </div>
          <img
            src="/brand/social-icons.svg"
            alt="Redes sociales de Noticias 33"
            className="mt-auto h-8 w-auto sm:h-10"
          />
        </div>

        <div className="mt-8 flex flex-col gap-2 text-sm font-light sm:flex-row sm:flex-wrap sm:justify-between sm:gap-2 sm:text-base md:mt-10 md:text-[1.1rem]">
          <span>® Noticias 33 · www.noticias33.com · {year}</span>
          <span>Todos los derechos reservados</span>
        </div>
      </div>
    </footer>
  );
}
