/** Banner "Síguenos para mantenerte informado" con formulario de suscripción. */
export default function Newsletter() {
  return (
    <section className="relative overflow-hidden bg-n33-pink">
      {/* En móvil el banner ancho se recorta mal; se muestra solo desde md.
          Entra con fade-in desde la derecha al llegar a la sección. */}
      <img
        src="/brand/siguenos-banner.jpg"
        alt=""
        aria-hidden="true"
        data-reveal="right"
        className="absolute inset-0 hidden size-full object-cover md:block"
      />
      <div className="relative mx-auto max-w-360 px-4 py-10 sm:px-6 md:py-16 lg:px-12">
        <p className="font-ui font-bold uppercase leading-none text-white">
          <span className="block text-xl sm:text-2xl md:text-3xl">
            Síguenos para mantenerte
          </span>
          <span className="block text-4xl sm:text-5xl md:text-7xl">
            informado
          </span>
        </p>

        <form className="mt-8 flex w-full max-w-87.25 flex-col gap-2.5">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            className="h-9 rounded-[3px] bg-white px-4 font-ui text-sm font-light text-n33-text placeholder:text-black/40 transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-n33-blue/50 md:h-8.25 md:text-xs"
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo"
            className="h-9 rounded-[3px] bg-white px-4 font-ui text-sm font-light text-n33-text placeholder:text-black/40 transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-n33-blue/50 md:h-8.25 md:text-xs"
          />
          <input
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            className="h-9 rounded-[3px] bg-white px-4 font-ui text-sm font-light text-n33-text placeholder:text-black/40 transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-n33-blue/50 md:h-8.25 md:text-xs"
          />
          <button
            type="submit"
            className="mt-4 h-10 w-full cursor-pointer rounded-[9px] bg-n33-pink font-ui text-xs font-bold uppercase text-white ring-1 ring-white/60 transition duration-200 hover:brightness-110 active:scale-95 sm:mx-auto sm:w-59.25 md:h-8.25 md:text-[10px] md:ring-0"
          >
            Suscríbete a nuestro newsletter
          </button>
        </form>
      </div>
    </section>
  );
}
