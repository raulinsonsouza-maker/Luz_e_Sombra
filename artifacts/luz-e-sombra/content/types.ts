export interface FaqItem {
  q: string;
  a: string;
}

export interface ContentSection {
  heading: string;
  body: string[];
}

export interface AnalysisPageContent {
  slug: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  /** Resposta objetiva no topo */
  directAnswer: string;
  definition: string;
  sections: ContentSection[];
  methodology: string[];
  howItWorks: string[];
  discoveries: string[];
  examples: string[];
  limitations: string[];
  faq: FaqItem[];
  relatedPaths: { href: string; label: string }[];
  updatedAt: string;
}

export interface ArticleContent {
  slug: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  cluster:
    | "autoconhecimento"
    | "personalidade"
    | "relacionamentos"
    | "desenvolvimento"
    | "numerologia"
    | "experiencia";
  directAnswer: string;
  sections: ContentSection[];
  examples: string[];
  faq: FaqItem[];
  relatedPaths: { href: string; label: string }[];
  externalSources?: { label: string; url: string }[];
  publishedAt: string;
  updatedAt: string;
  imageAlt: string;
}
