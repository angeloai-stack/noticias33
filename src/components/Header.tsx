interface HeaderProps {
  ticker?: string;
}

export default function Header({ ticker }: HeaderProps) {
  const fecha = new Intl.DateTimeFormat("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const fechaCapitalizada = fecha.charAt(0).toUpperCase() + fecha.slice(1);

  return (
    <header className="font-ui">
      {/* Barra superior: fecha + información al momento */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-1 bg-white px-4 py-2.5 text-[13px] text-n33-text sm:px-6 sm:py-3 sm:text-[15px] lg:px-12">
        <span className="hidden italic sm:inline">{fechaCapitalizada}</span>
        {ticker && (
          <p className="ticker-viewport min-w-0 flex-1 whitespace-nowrap">
            <strong className="font-bold">Información al momento: </strong>
            <span className="ticker-track">{ticker}</span>
          </p>
        )}
      </div>

      {/* Barra azul: logo + edición + buscador */}
      <div className="bg-n33-blue">
        <div className="mx-auto flex max-w-360 flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4 sm:gap-x-10 sm:px-6 md:py-6 lg:px-12">
          <a href="/" className="shrink-0">
            <img
              src="/brand/logo-header.svg"
              alt="Noticias 33"
              className="h-8 w-auto sm:h-9 md:h-11"
            />
          </a>
          <button
            type="button"
            className="hidden cursor-pointer items-center gap-1.5 text-xl font-medium text-white sm:flex"
          >
            Nacional
            <svg
              viewBox="0 0 12 8"
              className="mt-0.5 h-2 w-3"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 1.5 6 6.5 11 1.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <form
            action="/buscar"
            method="get"
            className="relative w-full flex-none sm:w-auto sm:min-w-55 sm:max-w-157.75 sm:flex-1"
          >
            <input
              type="search"
              name="q"
              placeholder="Busca noticias por país, estado, ciudad, tipo, el clima, tipo de cambio"
              className="h-10 w-full rounded-[13px] bg-white px-4 pr-11 text-sm font-light text-n33-text transition-shadow duration-200 placeholder:text-black/25 focus:outline-none focus:ring-2 focus:ring-white/60 sm:px-5 sm:text-base"
            />
            <button
              type="submit"
              aria-label="Buscar"
              className="absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer text-n33-pink transition-transform duration-200 hover:scale-110"
            >
              <svg
                viewBox="0 0 20 20"
                className="size-5"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="8.5"
                  cy="8.5"
                  r="5.75"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="m13 13 4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </form>
          <button
            type="button"
            id="n33-menu-toggle"
            aria-label="Abrir menú de secciones"
            className="ml-auto hidden cursor-pointer text-white transition-transform duration-200 hover:scale-110 md:block"
          >
            <svg
              viewBox="0 0 38 25"
              className="h-6 w-9"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 2.5h34M2 12.5h34M2 22.5h34"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
