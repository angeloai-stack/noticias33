import { useEffect, useState } from "react";
import { SECTIONS } from "../lib/sections";

/**
 * Barra de secciones con menú desplegable (nodo 48:130 del mockup):
 * plegado muestra las secciones en fila con un botón "+"; desplegado
 * muestra las subcategorías de cada sección en columnas y un botón "x".
 */
export default function NavMenu() {
  const [open, setOpen] = useState(false);

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
      <div className="mx-auto flex max-w-360 items-start gap-3 px-4 py-3 sm:gap-5 sm:px-6 sm:py-5 lg:gap-8 lg:px-12">
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
            <svg viewBox="0 0 28 28" className="size-6 sm:size-7 md:size-8" aria-hidden="true">
              <circle cx="14" cy="14" r="14" fill="var(--color-n33-pink)" />
              <path
                d="M9 9l10 10M19 9L9 19"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 28 28" className="size-6 sm:size-7 md:size-8" aria-hidden="true">
              <circle cx="14" cy="14" r="14" fill="var(--color-n33-blue)" />
              <path
                d="M14 8v12M8 14h12"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

        {open ? (
          <div className="menu-panel-enter grid flex-1 grid-cols-1 gap-x-4 gap-y-5 pb-2 min-[420px]:grid-cols-2 sm:grid-cols-3 sm:gap-y-8 lg:grid-cols-9">
            {SECTIONS.map((section) => (
              <div key={section.slug}>
                <a
                  href={`/categoria/${section.slug}/`}
                  className="link-underline text-base font-bold text-n33-blue sm:text-lg md:text-xl"
                >
                  {section.name}
                </a>
                <ul className="mt-3 space-y-2.5 sm:mt-4 sm:space-y-3">
                  {section.subsections.map((sub) => (
                    <li key={sub}>
                      <a
                        href={`/categoria/${section.slug}/`}
                        className="text-[15px] leading-tight text-n33-blue transition-colors duration-200 hover:text-n33-pink md:text-base"
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
          <div className="nav-scroll flex min-h-9 flex-1 items-center gap-5 sm:min-h-10 sm:gap-7 lg:justify-center lg:gap-10">
            {SECTIONS.map((section) => (
              <a
                key={section.slug}
                href={`/categoria/${section.slug}/`}
                className="link-underline shrink-0 snap-start whitespace-nowrap text-base font-bold text-n33-blue sm:text-lg md:text-xl"
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
