import type { WPPost } from "../lib/wordpress";
import Chip from "./Chip";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function postUrl(post: WPPost): string {
  return `/noticias/${post.slug}/`;
}

function fechaLarga(iso: string): string {
  return new Intl.DateTimeFormat("es", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

/** Noticia principal: imagen grande, listón, titular grande y autor. */
export function HeroNews({ post }: { post: WPPost }) {
  return (
    <article>
      <a href={postUrl(post)} className="group block">
        {post.featuredImage && (
          <img
            src={post.featuredImage.source_url}
            alt={post.featuredImage.alt_text}
            className="aspect-[16/7] w-full object-cover"
          />
        )}
        <div className="mt-4 flex flex-wrap items-center gap-4">
          {post.categories[0] && <Chip label={post.categories[0].name} />}
          <span className="font-ui text-sm font-light text-n33-text">
            Por: {post.author} · {fechaLarga(post.date)}
          </span>
        </div>
        <h1 className="mt-3 font-ui text-3xl font-bold leading-tight text-black group-hover:text-n33-blue md:text-[2.6rem]">
          {stripHtml(post.title)}
        </h1>
        <p className="mt-4 max-w-[52rem] font-body text-sm leading-[1.55] text-black">
          {stripHtml(post.excerpt)}
        </p>
      </a>
    </article>
  );
}

/** Noticia destacada de sección (bloque "Local" del mockup). */
export function FeatureNews({ post }: { post: WPPost }) {
  return (
    <article>
      <a
        href={postUrl(post)}
        className="group grid gap-6 md:grid-cols-[minmax(0,394px)_1fr]"
      >
        {post.featuredImage && (
          <img
            src={post.featuredImage.source_url}
            alt={post.featuredImage.alt_text}
            className="aspect-[394/341] w-full object-cover"
          />
        )}
        <div>
          {post.categories[0] && <Chip label={post.categories[0].name} />}
          <h2 className="mt-3 font-ui text-[1.36rem] font-bold uppercase leading-snug text-black group-hover:text-n33-blue">
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
export function NewsRow({ post }: { post: WPPost }) {
  return (
    <article>
      <a
        href={postUrl(post)}
        className="group grid grid-cols-[155px_1fr] items-start gap-4"
      >
        {post.featuredImage ? (
          <img
            src={post.featuredImage.source_url}
            alt={post.featuredImage.alt_text}
            className="aspect-[155/87] w-full object-cover"
          />
        ) : (
          <div className="aspect-[155/87] w-full bg-n33-ad" />
        )}
        <div>
          <div className="flex flex-wrap items-center gap-3">
            {post.categories[0] && <Chip label={post.categories[0].name} />}
            <h3 className="font-ui text-sm font-bold uppercase leading-tight text-black group-hover:text-n33-blue">
              {stripHtml(post.title)}
            </h3>
          </div>
          <p className="mt-2 line-clamp-4 font-body text-xs leading-[1.55] text-black">
            {stripHtml(post.excerpt)}
          </p>
        </div>
      </a>
    </article>
  );
}

/** Fila dentro del panel azul de relevancia media-baja (texto blanco). */
export function PanelNews({ post }: { post: WPPost }) {
  return (
    <article>
      <a
        href={postUrl(post)}
        className="group grid items-start gap-8 md:grid-cols-[286px_1fr]"
      >
        {post.featuredImage ? (
          <img
            src={post.featuredImage.source_url}
            alt={post.featuredImage.alt_text}
            className="aspect-[286/161] w-full object-cover"
          />
        ) : (
          <div className="aspect-[286/161] w-full bg-white/20" />
        )}
        <div>
          {post.categories[0] && (
            <Chip label={post.categories[0].name} light />
          )}
          <h3 className="mt-3 font-ui text-[19px] font-bold uppercase leading-snug text-white group-hover:underline">
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
