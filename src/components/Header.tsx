interface HeaderProps {
  ticker?: string;
  tickerHref?: string;
}

export default function Header({ ticker, tickerHref }: HeaderProps) {
  const fecha = new Intl.DateTimeFormat("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const fechaCapitalizada = fecha.charAt(0).toUpperCase() + fecha.slice(1);
  const fechaCorta = new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <header className="font-ui">
      {/* Barra superior: fecha + ticker */}
      <div className="flex flex-col gap-1.5 bg-white px-4 py-2.5 text-[12px] text-n33-text sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-1 sm:py-3 sm:text-[15px] lg:px-12">
        <span className="shrink-0 italic sm:hidden">{fechaCorta}</span>
        <span className="hidden shrink-0 italic sm:inline">{fechaCapitalizada}</span>
        {ticker && (
          <div className="flex min-w-0 flex-1 items-center">
            <strong className="shrink-0 font-bold">
              <span className="sm:hidden">Info al momento: </span>
              <span className="hidden sm:inline">Información al momento: </span>
            </strong>
            <div className="ticker-viewport min-w-0 flex-1">
              {tickerHref ? (
                <a href={tickerHref} className="ticker-track hover:text-n33-blue">
                  {ticker}
                </a>
              ) : (
                <span className="ticker-track">{ticker}</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Barra azul */}
      <div className="bg-n33-blue">
        <div className="mx-auto flex max-w-360 flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:gap-x-6 sm:px-6 md:py-6 lg:px-12">
          <a href="/" className="shrink-0">
            <img
              src="/brand/logo-header.svg"
              alt="Noticias 33"
              className="h-7 w-auto sm:h-9 md:h-11"
            />
          </a>
          <button
            type="button"
            className="hidden shrink-0 cursor-pointer items-center gap-1.5 text-lg font-medium text-white sm:flex md:text-xl"
          >
            Nacional
            <svg viewBox="0 0 12 8" className="mt-0.5 h-2 w-3" fill="none" aria-hidden="true">
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
            className="relative order-last w-full min-w-0 sm:order-none sm:max-w-157.75 sm:flex-1"
          >
            <input
              type="search"
              name="q"
              placeholder="Buscar noticias..."
              className="h-10 w-full rounded-[13px] bg-white px-4 pr-11 text-sm font-light text-n33-text transition-shadow duration-200 placeholder:text-black/25 focus:outline-none focus:ring-2 focus:ring-white/60 sm:px-5 sm:text-base lg:placeholder:opacity-0"
            />
            <span className="pointer-events-none absolute top-1/2 left-5 hidden -translate-y-1/2 text-base font-light text-black/25 lg:block">
              Busca noticias por país, estado, ciudad, tipo, el clima, tipo de cambio
            </span>
            <button
              type="submit"
              aria-label="Buscar"
              className="absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer text-n33-pink transition-transform duration-200 hover:scale-110"
            >
              <svg viewBox="0 0 20 20" className="size-5" fill="none" aria-hidden="true">
                <circle cx="8.5" cy="8.5" r="5.75" stroke="currentColor" strokeWidth="2" />
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
            className="ml-auto shrink-0 cursor-pointer text-white transition-transform duration-200 hover:scale-110 sm:ml-0"
          >
            <svg viewBox="0 0 38 25" className="h-5 w-8 md:h-6 md:w-9" fill="none" aria-hidden="true">
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
