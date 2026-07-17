import Chip from "./Chip";
import type { Article } from "../lib/content";
import { categoryHref } from "../lib/sections";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

interface RightRailProps {
  latestPosts?: Article[];
}

/**
 * Carril derecho de la portada: últimas noticias del CMS, clima y publicidad.
 */
export default function RightRail({ latestPosts = [] }: RightRailProps) {
  return (
    <aside className="flex flex-col gap-8 border-t border-n33-ad pt-8 lg:border-t-0 lg:pt-0">
      {latestPosts.length > 0 && (
        <section data-reveal>
          <h2 className="font-ui text-lg font-bold uppercase text-n33-blue">
            Últimas noticias
          </h2>
          <ul className="mt-4 space-y-4">
            {latestPosts.map((post) => (
              <li key={post.id}>
                <a
                  href={`/noticias/${post.slug}/`}
                  className="group block font-ui text-sm leading-snug text-black transition-colors hover:text-n33-blue"
                >
                  {stripHtml(post.title)}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section data-reveal>
        <img
          src="/brand/clima-bc.png"
          alt="Mapa del clima de Baja California"
          className="w-full"
        />
        <div className="mt-3">
          <Chip label="Clima" href={categoryHref("Clima", "clima")} />
        </div>
        <h3 className="mt-3 font-ui text-[19px] font-bold uppercase leading-snug text-black">
          Clima para esta semana en Baja California
        </h3>
      </section>

      <div className="flex h-92 items-center justify-center rounded-xl bg-n33-ad">
        <span className="text-lg">Publicidad</span>
      </div>
      <div className="flex h-92 items-center justify-center rounded-xl bg-n33-ad">
        <span className="text-lg">Publicidad</span>
      </div>
    </aside>
  );
}
