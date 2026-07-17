import type { Article } from "../lib/content";
import { categoryHref } from "../lib/sections";
import Chip from "./Chip";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function postUrl(post: Article): string {
  return `/noticias/${post.slug}/`;
}

function fechaLarga(iso: string): string {
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/** Primeros N párrafos del contenido, en texto plano. */
function firstParagraphs(html: string, n: number): string[] {
  const matches = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => stripHtml(m[1]))
    .filter((t) => t.length > 0);
  return matches.slice(0, n);
}

interface CardProps {
  post: Article;
  /** Retraso del fade-up al aparecer en pantalla, en ms (para escalonar). */
  delay?: number;
}

function revealProps(delay?: number) {
  return {
    "data-reveal": true,
    style: delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined,
  };
}

/** Noticia principal: imagen grande con listón rosa, avatar y autor
 *  sobrepuestos; titular grande y dos párrafos debajo (como el mockup). */
export function HeroNews({ post, delay }: CardProps) {
  const parrafos = firstParagraphs(post.content, 2);
  if (parrafos.length === 0) parrafos.push(stripHtml(post.excerpt));

  return (
    <article {...revealProps(delay)}>
      <a href={postUrl(post)} className="group block">
        {post.featuredImage && (
          <div className="relative overflow-hidden">
            <img
              src={post.featuredImage.source_url}
              alt={post.featuredImage.alt_text}
              className="aspect-video w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 md:aspect-16/7"
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-4 bg-linear-to-t from-black/50 to-transparent p-4">
              {post.categories[0] && (
                <Chip
                  label={post.categories[0].name}
                  variant="pink"
                  href={categoryHref(
                    post.categories[0].name,
                    post.categories[0].slug,
                  )}
                />
              )}
              <span className="flex items-center gap-2.5 font-ui text-sm font-light text-white sm:text-base">
                {post.authorAvatar && (
                  <img
                    src={post.authorAvatar}
                    alt=""
                    className="size-8 rounded-full border border-white/60 sm:size-9"
                  />
                )}
                Por: {post.author}
              </span>
            </div>
          </div>
        )}
        <h1 className="mt-4 font-ui text-2xl font-bold leading-tight text-black transition-colors duration-300 group-hover:text-n33-blue sm:text-3xl md:text-[2.6rem]">
          {stripHtml(post.title)}
        </h1>
        <div className="mt-4 flex flex-col gap-5">
          {parrafos.map((texto, i) => (
            <p
              key={`${post.id}-p-${i}`}
              className="max-w-208 font-body text-sm leading-[1.55] text-black"
            >
              {texto}
            </p>
          ))}
        </div>
      </a>
    </article>
  );
}

/** Noticia destacada de sección (bloque "Local" del mockup). */
export function FeatureNews({ post, delay }: CardProps) {
  return (
    <article {...revealProps(delay)}>
      <a
        href={postUrl(post)}
        className="group grid gap-4 sm:gap-6 md:grid-cols-[minmax(0,394px)_1fr]"
      >
        {post.featuredImage && (
          <div className="overflow-hidden">
            <img
              src={post.featuredImage.source_url}
              alt={post.featuredImage.alt_text}
              className="aspect-[394/341] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        )}
        <div>
          {post.categories[0] && (
            <Chip
              label={post.categories[0].name}
              href={categoryHref(
                post.categories[0].name,
                post.categories[0].slug,
              )}
            />
          )}
          <h2 className="mt-3 font-ui text-base font-bold uppercase leading-snug text-black transition-colors duration-300 group-hover:text-n33-blue sm:text-lg md:text-[1.36rem]">
            {stripHtml(post.title)}
          </h2>
          <p className="mt-4 font-ui text-base font-light leading-normal text-black">
            {stripHtml(post.excerpt)}
          </p>
        </div>
      </a>
    </article>
  );
}

/** Fila compacta: miniatura + listón + titular en mayúsculas + resumen. */
export function NewsRow({ post, delay }: CardProps) {
  return (
    <article {...revealProps(delay)}>
      <a
        href={postUrl(post)}
        className="group grid grid-cols-[92px_1fr] items-start gap-3 sm:grid-cols-[155px_1fr] sm:gap-4"
      >
        {post.featuredImage ? (
          <div className="overflow-hidden">
            <img
              src={post.featuredImage.source_url}
              alt={post.featuredImage.alt_text}
              className="aspect-[155/87] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          </div>
        ) : (
          <div className="aspect-[155/87] w-full bg-n33-ad" />
        )}
        <div className="min-w-0">
          {post.categories[0] && (
            <Chip
              label={post.categories[0].name}
              href={categoryHref(
                post.categories[0].name,
                post.categories[0].slug,
              )}
            />
          )}
          <h3 className="mt-2 font-ui text-[13px] font-bold uppercase leading-tight text-black transition-colors duration-300 group-hover:text-n33-blue sm:mt-0 sm:text-sm">
            {stripHtml(post.title)}
          </h3>
          <p className="mt-1.5 line-clamp-3 font-body text-xs leading-[1.5] text-black sm:mt-2 sm:line-clamp-4 sm:leading-[1.55]">
            {stripHtml(post.excerpt)}
          </p>
        </div>
      </a>
    </article>
  );
}

/** Fila dentro del panel azul de relevancia media-baja (texto blanco). */
export function PanelNews({ post, delay }: CardProps) {
  return (
    <article {...revealProps(delay)}>
      <a
        href={postUrl(post)}
        className="group grid items-start gap-4 sm:gap-5 md:grid-cols-[286px_1fr] md:gap-8"
      >
        {post.featuredImage ? (
          <div className="overflow-hidden">
            <img
              src={post.featuredImage.source_url}
              alt={post.featuredImage.alt_text}
              className="aspect-[286/161] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
            />
          </div>
        ) : (
          <div className="aspect-[286/161] w-full bg-white/20" />
        )}
        <div>
          {post.categories[0] && (
            <Chip
              label={post.categories[0].name}
              variant="light"
              href={categoryHref(
                post.categories[0].name,
                post.categories[0].slug,
              )}
            />
          )}
          <h3 className="mt-2 font-ui text-base font-bold uppercase leading-snug text-white transition-colors duration-300 group-hover:text-white/80 sm:mt-3 sm:text-[19px]">
            {stripHtml(post.title)}
          </h3>
          <p className="mt-3 line-clamp-4 max-w-[566px] font-body text-xs leading-[1.55] text-white">
            {stripHtml(post.excerpt)}
          </p>
        </div>
      </a>
    </article>
  );
}
