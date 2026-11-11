import { useRoute, Redirect } from "wouter";
import { getArticleBySlug } from "@/content/artigos";
import BlogArticleView from "@/components/public/BlogArticleView";

export default function BlogPostPage() {
  const [, params] = useRoute("/blog/:slug");
  const content = params?.slug ? getArticleBySlug(params.slug) : undefined;
  if (!content) return <Redirect to="/blog" />;
  return <BlogArticleView content={content} />;
}
