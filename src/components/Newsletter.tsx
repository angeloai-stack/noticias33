/** Banner "Síguenos para mantenerte informado" con formulario de suscripción. */
export default function Newsletter() {
  return (
    <section
      className="relative overflow-hidden bg-n33-pink bg-cover bg-center"
      style={{ backgroundImage: "url(/brand/siguenos-banner.jpg)" }}
    >
      <div className="mx-auto max-w-360 px-6 py-16 lg:px-12">
        <p className="font-ui font-bold uppercase leading-none text-white">
          <span className="block text-2xl md:text-3xl">
            Síguenos para mantenerte
          </span>
          <span className="block text-5xl md:text-7xl">informado</span>
        </p>

        <form className="mt-8 flex max-w-[349px] flex-col gap-2.5">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            className="h-[33px] rounded-[3px] bg-white px-4 font-ui text-xs font-light text-n33-text placeholder:text-black/40 focus:outline-none"
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo"
            className="h-[33px] rounded-[3px] bg-white px-4 font-ui text-xs font-light text-n33-text placeholder:text-black/40 focus:outline-none"
          />
          <input
            type="tel"
            name="telefono"
            placeholder="Teléfono"
            className="h-[33px] rounded-[3px] bg-white px-4 font-ui text-xs font-light text-n33-text placeholder:text-black/40 focus:outline-none"
          />
          <button
            type="submit"
            className="mx-auto mt-4 h-[33px] w-[237px] cursor-pointer rounded-[9px] bg-n33-pink font-ui text-[10px] font-bold uppercase text-white hover:brightness-110"
          >
            Suscríbete a nuestro newsletter
          </button>
        </form>
      </div>
    </section>
  );
}
