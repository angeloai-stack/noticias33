import { useState } from "react";
import { SECTIONS } from "../lib/sections";

/**
 * Barra de secciones con menú desplegable (nodo 48:130 del mockup):
 * plegado muestra las secciones en fila con un botón "+"; desplegado
 * muestra las subcategorías de cada sección en columnas y un botón "x".
 */
export default function NavMenu() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white font-ui shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
      <div className="mx-auto flex max-w-360 items-start gap-8 px-6 py-3.5 lg:px-12">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="mt-0.5 shrink-0 cursor-pointer"
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
          <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-8 pb-4 sm:grid-cols-3 lg:grid-cols-9">
            {SECTIONS.map((section) => (
              <div key={section.slug}>
                <a
                  href={`/categoria/${section.slug}/`}
                  className="text-lg font-bold text-n33-blue hover:underline"
                >
                  {section.name}
                </a>
                <ul className="mt-4 space-y-3">
                  {section.subsections.map((sub) => (
                    <li key={sub}>
                      <a
                        href={`/categoria/${section.slug}/`}
                        className="text-[15px] leading-tight text-n33-blue hover:underline"
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
          <div className="flex flex-1 items-center gap-8 overflow-x-auto lg:justify-center">
            {SECTIONS.map((section) => (
              <a
                key={section.slug}
                href={`/categoria/${section.slug}/`}
                className="whitespace-nowrap text-lg font-bold text-n33-blue hover:underline"
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
