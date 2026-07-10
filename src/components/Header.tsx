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
      <div className="flex flex-wrap items-center gap-x-8 gap-y-1 bg-white px-6 py-3 text-[15px] text-n33-text lg:px-12">
        <span className="italic">{fechaCapitalizada}</span>
        {ticker && (
          <p className="min-w-0 flex-1 truncate">
            <strong className="font-bold">Información al momento: </strong>
            {ticker}
          </p>
        )}
      </div>

      {/* Barra azul: logo + edición + buscador */}
      <div className="bg-n33-blue">
        <div className="mx-auto flex max-w-360 flex-wrap items-center gap-x-10 gap-y-4 px-6 py-6 lg:px-12">
          <a href="/" className="shrink-0">
            <img
              src="/brand/logo-header.svg"
              alt="Noticias 33"
              className="h-9 w-auto md:h-11"
            />
          </a>
          <span className="text-xl font-medium text-white">Nacional</span>
          <form
            action="/buscar"
            method="get"
            className="min-w-55 max-w-157.75 flex-1"
          >
            <input
              type="search"
              name="q"
              placeholder="Busca noticias por país, estado, ciudad, tipo, el clima, tipo de cambio"
              className="h-10 w-full rounded-[13px] bg-white px-5 text-base font-light text-n33-text placeholder:text-black/25 focus:outline-none"
            />
          </form>
        </div>
      </div>
    </header>
  );
}
