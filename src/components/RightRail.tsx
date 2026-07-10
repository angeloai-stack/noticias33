import Chip from "./Chip";

/**
 * Carril derecho de la portada (mockup 6:8): reels/video con su texto,
 * clima de la semana en Baja California y espacios de publicidad.
 * El video y el mapa son placeholders del mockup hasta conectar sus
 * fuentes reales (reels de redes y servicio de clima).
 */
export default function RightRail() {
  return (
    <aside className="flex flex-col gap-8">
      {/* Reels / video */}
      <section data-reveal>
        <div className="group relative mx-auto w-full max-w-[233px] cursor-pointer overflow-hidden lg:mx-0">
          <img
            src="/brand/reels-still.png"
            alt="Video: reportaje de Noticias 33"
            className="aspect-[233/413] w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 48 48"
              className="size-12 opacity-0 drop-shadow transition-opacity duration-300 group-hover:opacity-90"
              aria-hidden="true"
            >
              <circle cx="24" cy="24" r="24" fill="#fff" />
              <path d="M19 15v18l15-9z" fill="var(--color-n33-pink)" />
            </svg>
          </span>
        </div>
        <p className="mt-4 font-ui text-base font-light leading-normal text-black">
          Alejandro Ramírez acudió a los juzgados penales y laborales de
          Tijuana para solicitar una revisión de las medidas cautelares
          impuestas a Máximo “N”, a quien señala como responsable de un ataque
          ocurrido en septiembre de 2024.
        </p>
      </section>

      {/* Clima de la semana */}
      <section data-reveal>
        <img
          src="/brand/clima-bc.png"
          alt="Mapa del clima de Baja California"
          className="w-full"
        />
        <div className="mt-3">
          <Chip label="Clima" />
        </div>
        <h3 className="mt-3 font-ui text-[19px] font-bold uppercase leading-snug text-black">
          Clima para esta semana en Baja California
        </h3>
      </section>

      {/* Publicidad */}
      <div className="flex h-92 items-center justify-center rounded-xl bg-n33-ad">
        <span className="text-lg">Publicidad</span>
      </div>
      <div className="flex h-92 items-center justify-center rounded-xl bg-n33-ad">
        <span className="text-lg">Publicidad</span>
      </div>
    </aside>
  );
}
