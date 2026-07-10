import { useEffect, useState } from "react";
import { SECTIONS } from "../lib/sections";

/**
 * Barra de secciones con menú desplegable (nodo 48:130 del mockup):
 * plegado muestra las secciones en fila con un botón "+"; desplegado
 * muestra las subcategorías de cada sección en columnas y un botón "x".
 */
export default function NavMenu() {
  const [open, setOpen] = useState(false);

  // El botón hamburguesa del header (estático) también abre/cierra el menú
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("#n33-menu-toggle")) {
        setOpen((o) => !o);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <nav className="bg-white font-ui shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <div className="mx-auto flex max-w-360 items-start gap-4 px-4 py-3 sm:gap-8 sm:px-6 sm:py-3.5 lg:px-12">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className={`-m-2 shrink-0 cursor-pointer p-2 transition-transform duration-300 ${
            open ? "rotate-90" : "rotate-0"
          }`}
        >
          {open ? (
            <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
              <circle cx="12" cy="12" r="12" fill="var(--color-n33-pink)" />
              <path
                d="M8 8l8 8M16 8l-8 8"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
              <circle cx="12" cy="12" r="12" fill="var(--color-n33-blue)" />
              <path
                d="M12 6.5v11M6.5 12h11"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

        {open ? (
          <div className="menu-panel-enter grid flex-1 grid-cols-2 gap-x-4 gap-y-6 pb-4 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-9">
            {SECTIONS.map((section) => (
              <div key={section.slug}>
                <a
                  href={`/categoria/${section.slug}/`}
                  className="link-underline text-base font-bold text-n33-blue sm:text-lg"
                >
                  {section.name}
                </a>
                <ul className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                  {section.subsections.map((sub) => (
                    <li key={sub}>
                      <a
                        href={`/categoria/${section.slug}/`}
                        className="text-sm leading-tight text-n33-blue transition-colors duration-200 hover:text-n33-pink sm:text-[15px]"
                      >
                        {sub}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-1 items-center gap-6 overflow-x-auto scrollbar-none sm:gap-8 lg:justify-center">
            {SECTIONS.map((section) => (
              <a
                key={section.slug}
                href={`/categoria/${section.slug}/`}
                className="link-underline whitespace-nowrap text-base font-bold text-n33-blue sm:text-lg"
              >
                {section.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
