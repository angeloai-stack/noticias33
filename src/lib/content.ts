/** Modelo de contenido compartido entre Strapi y el frontend Astro. */

export interface ArticleImage {
  source_url: string;
  alt_text: string;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string;
  count: number;
}

export interface Article {
  id: number;
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar: string | null;
  categories: Category[];
  featuredImage: ArticleImage | null;
}
