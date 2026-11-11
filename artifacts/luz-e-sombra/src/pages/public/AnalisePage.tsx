import { useRoute, Redirect } from "wouter";
import { getAnaliseBySlug } from "@/content/analises";
import AnalysisArticleView from "@/components/public/AnalysisArticleView";

export default function AnalisePage() {
  const [, params] = useRoute("/analises/:slug");
  const content = params?.slug ? getAnaliseBySlug(params.slug) : undefined;
  if (!content) return <Redirect to="/analises" />;
  return <AnalysisArticleView content={content} />;
}
