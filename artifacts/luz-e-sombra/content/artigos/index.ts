import { ARTICLES } from "./data";
import type { ArticleContent } from "../types";

export { ARTICLES };

export function getArticleBySlug(slug: string): ArticleContent | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getArticleByPath(p: string): ArticleContent | undefined {
  const path = p.replace(/\/$/, "") || "/";
  return ARTICLES.find((a) => a.path === path);
}

export function articlesByCluster(cluster: ArticleContent["cluster"]) {
  return ARTICLES.filter((a) => a.cluster === cluster);
}
