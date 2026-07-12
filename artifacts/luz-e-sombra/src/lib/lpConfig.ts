import type { LucideIcon } from "lucide-react";
import {
  Layers,
  FlaskConical,
  Heart,
  Target,
  Hash,
  Map,
  GraduationCap,
  Users2,
  Sparkles,
} from "lucide-react";

export const LP_VIDEO_URL = "https://youtu.be/t_0-OV_MzVM?si=J5LYzhiBpat1WDPz";
export const LP_VIDEO_ID = "t_0-OV_MzVM";
export const LP_GATE_SECONDS = 20;
export const LP_GATE_PERCENT = 80;
export const VSL_UNLOCK_KEY = "vsl_unlocked";

export const LP_PORTAL_NAME = "Portal Iluminando";
export const LP_JOURNEY_NAME = "Jornada Da Sombra à Luz";
export const LP_JOURNEY_TAGLINE =
  "Uma trilha guiada com 9 análises para sair do automático e ganhar clareza sobre quem você é.";
export const LP_PRODUCT_NAME = LP_JOURNEY_NAME;
export const LP_PRODUCT_TAGLINE = LP_JOURNEY_TAGLINE;
export const LP_CHECKOUT_SUBTITLE = `Acesso completo no ${LP_PORTAL_NAME}`;
export const LP_PRICE = 57.9;
export const LP_PRICE_INSTALLMENTS = 3;
export const LP_PRICE_INSTALLMENT_VALUE = 21.19;
export const LP_PRICE_ORIGINAL = 97;
export const LP_PRICE_PERIOD = "";
export const LP_BILLING_LABEL = "Pagamento único";
export const LP_GUARANTEE_DAYS = 7;
export const LP_CTA_PRIMARY = "Começar minha jornada";
export const LP_CTA_NAV = "Começar jornada";
export const LP_CTA_LOGIN = "Entrar";

/** Copy do hero da LP controle (/) */
export const LP_HERO = {
  badge: "Trilha guiada de autoconhecimento",
  headlineLine1: "Jornada",
  headlineLine2: "Da Sombra",
  headlineAccent: "à Luz",
  subline:
    "Nove análises profundas — traço, temperamento, roda da vida e mais — conectadas num único mapa para você parar de repetir padrões e agir com clareza.",
  bullets: [
    "Diagnósticos personalizados, nada genérico",
    "Trilha gamificada passo a passo",
    "Primeira leitura em cerca de 15 minutos",
  ],
  priceTeaser: "A partir de R$ 57,90 · pagamento único",
} as const;

/** Copy exclusiva da LP VSL (/vsl) */
export const VSL_COPY = {
  navCta: "Começar jornada",
  eyebrow: LP_PORTAL_NAME,
  headline: "Veja como a Jornada Da Sombra à Luz conecta suas análises.",
  subheadline:
    "Assista ao vídeo e entenda como traço corporal, temperamentos, relações e 12 áreas da vida se cruzam numa trilha guiada — com clareza prática em minutos.",
  gateTitle: "A oferta aparece em instantes",
  gateDesc:
    "Continue assistindo. Em poucos segundos você libera o que está incluso na jornada e como ativar seu acesso hoje.",
  unlockHint: "Pronto — role e veja tudo que você recebe",
  playerLocked: "Assista para liberar a oferta completa",
  playerProgress: (percent: number) =>
    percent > 0 ? `Assista mais ${percent}% do vídeo para liberar` : "Desbloqueando...",
};

export const LP_SECTIONS = {
  modules: {
    eyebrow: "Etapas da jornada",
    title: "9 análises integradas.",
    titleAccent: "Um mapa de quem você é.",
    subtitle:
      "Cada etapa responde uma pergunta diferente — e juntas compõem a Jornada Da Sombra à Luz no Portal Iluminando.",
  },
  howItWorks: {
    eyebrow: "Como começar",
    title: "Três passos. Sem complicação.",
    steps: [
      {
        step: "01",
        title: "Assista o método",
        desc: "O vídeo mostra como as análises se conectam na jornada — e por que isso funciona quando outras abordagens falham.",
      },
      {
        step: "02",
        title: "Ative sua jornada",
        desc: "R$ 57,90 à vista ou 3x de R$ 21,19 no cartão. Checkout seguro e acesso no Portal Iluminando após confirmação.",
      },
      {
        step: "03",
        title: "Faça sua primeira análise",
        desc: "Em cerca de 15 minutos você já tem diagnóstico personalizado na trilha. Sem julgamento, no seu ritmo.",
      },
    ],
  },
  testimonials: {
    eyebrow: "Quem já saiu do automático",
    title: "Clareza que aparece rápido",
  },
  offer: {
    eyebrow: "Para quem assistiu até aqui",
    title: LP_JOURNEY_NAME,
    titleAccent: "no Portal Iluminando",
    subtitle: "Pagamento único. 7 dias de garantia total.",
    footnote: "PIX ou cartão · Acesso após confirmação · Garantia de 7 dias",
  },
  finalCta: {
    title: "Da próxima vez que você se perguntar",
    titleAccent: "por que repito isso?",
    body: "Você já terá um mapa na jornada — não só mais uma dúvida. A escolha é sua.",
  },
  faq: {
    eyebrow: "Ainda com dúvida?",
    title: "Respostas diretas",
  },
} as const;

/** Copy das seções na LP controle (/) — tom mais editorial */
export const CONTROL_SECTIONS = {
  modules: {
    eyebrow: "Etapas da jornada",
    title: "9 análises que se conectam",
    titleAccent: "numa trilha guiada.",
    subtitle:
      "Cada etapa ilumina uma dimensão de quem você é — todas levam você da sombra à luz.",
  },
  howItWorks: {
    eyebrow: "Como funciona",
    title: "Cadastre-se, percorra,",
    titleAccent: "transforme-se.",
    steps: [
      {
        step: "01",
        title: "Garanta sua jornada",
        desc: "Cadastro rápido e pagamento seguro. Acesso ao Portal Iluminando após confirmação.",
      },
      {
        step: "02",
        title: "Percorra as análises",
        desc: "Traço, temperamento, roda da vida e mais — na ordem da trilha, no seu ritmo.",
      },
      {
        step: "03",
        title: "Ganhe clareza integrada",
        desc: "Cada resultado conversa com o próximo. Em minutos você vê padrões que antes pareciam aleatórios.",
      },
    ],
  },
  testimonials: {
    eyebrow: "Quem já passou por aqui",
    title: "Resultados reais",
  },
  offer: {
    eyebrow: "O que você está comprando",
    title: LP_JOURNEY_NAME,
    titleAccent: "",
    subtitle: `${LP_BILLING_LABEL} · Acesso no ${LP_PORTAL_NAME} após confirmação do pagamento.`,
    footnote: "PIX ou cartão · Acesso após pagamento · Garantia de 7 dias",
  },
  finalCta: {
    title: "Sua jornada da sombra à luz",
    titleAccent: "começa com uma escolha",
    body: "Nove análises integradas esperando por você. Cada passo é consciência — não mais automático.",
  },
  faq: {
    eyebrow: "Perguntas frequentes",
    title: "Tire suas dúvidas",
  },
} as const;

export type LpSectionVariant = "control" | "vsl";

export function getLpSections(variant: LpSectionVariant = "control") {
  return variant === "vsl" ? LP_SECTIONS : CONTROL_SECTIONS;
}

/** URL do checkout Cakto */
export const CAKTO_CHECKOUT_URL =
  import.meta.env.VITE_CAKTO_CHECKOUT_URL || "https://pay.cakto.com.br/3dr2icy_975648";

export interface LpModuleItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export const LP_MODULES: LpModuleItem[] = [
  {
    icon: Layers,
    title: "Traço de Caráter",
    desc: "Etapa da jornada: o que seu corpo revela sobre padrões que você repete — lidos por fotos e Reich/Lowen.",
  },
  {
    icon: FlaskConical,
    title: "Temperamento",
    desc: "Etapa da jornada: por que você reage e se relaciona do jeito que reage — e o que muda ao entender isso.",
  },
  {
    icon: Heart,
    title: "Linguagens do Amor",
    desc: "Etapa da jornada: como você pede e demonstra afeto — e por que certas relações não fluem do seu jeito.",
  },
  {
    icon: Target,
    title: "Roda da Vida",
    desc: "Etapa da jornada: raio-x de 12 áreas — onde sua energia está, onde você se sabota e o que pede atenção agora.",
  },
  {
    icon: Hash,
    title: "Numerologia",
    desc: "Etapa da jornada: missão, talentos e ciclos da sua data de nascimento em reflexão e ação concreta.",
  },
  {
    icon: Map,
    title: "Trilha gamificada",
    desc: "A jornada guiada com XP e missões diárias — constância sem peso, passo a passo.",
  },
  {
    icon: GraduationCap,
    title: "Aprofundamentos",
    desc: "Conteúdos integrados à trilha para aprofundar cada etapa no momento certo (em breve).",
  },
  {
    icon: Users2,
    title: "Comunidade",
    desc: "Etapa da jornada: pessoas na mesma fase de transformação — você não caminha sozinho(a).",
  },
  {
    icon: Sparkles,
    title: "Quem Sou Eu",
    desc: "Síntese final da jornada: numerologia, traço e roda da vida cruzados num retrato integrado.",
  },
];

export const LP_TESTIMONIALS = [
  {
    name: "Mariana S.",
    role: "Empreendedora, 34 anos",
    text: "Em uma semana vi onde estava me sabotando — trabalho, relações, energia. Pela primeira vez não foi 'achismo': a Roda mostrou com números e interpretação que doía de tão certa.",
  },
  {
    name: "Ricardo L.",
    role: "Profissional de TI, 41 anos",
    text: "Sempre achei autoconhecimento 'floreado'. O Traço de Caráter me pegou: leitura corporal que bateu com o que eu sinto no dia a dia. Isso não tinha acontecido antes.",
  },
  {
    name: "Camila F.",
    role: "Psicóloga, 29 anos",
    text: "Indico como complemento. O que mais impressiona é a integração: temperamentos, linguagens do amor, roda — tudo conversando. E a jornada gamificada mantém o paciente engajado.",
  },
];

export const LP_FAQ = [
  {
    q: "O que exatamente estou comprando?",
    a: `A ${LP_JOURNEY_NAME} — uma trilha com 9 análises integradas no ${LP_PORTAL_NAME}. Não são ferramentas soltas: é um percurso guiado da sombra à luz.`,
  },
  {
    q: "Preciso entender de numerologia ou terapia corporal?",
    a: "Não. A jornada guia cada passo com perguntas claras e interpretações prontas. Você responde com honestidade — o sistema faz o resto.",
  },
  {
    q: "Como recebo o acesso depois de comprar?",
    a: "Assim que o pagamento for confirmado (PIX ou cartão), você entra automaticamente na plataforma com o e-mail e senha que cadastrou.",
  },
  {
    q: "Posso parcelar?",
    a: `Sim. No cartão você pode pagar em até ${LP_PRICE_INSTALLMENTS}x de ${formatLpPrice(LP_PRICE_INSTALLMENT_VALUE)} ou ${formatLpPrice(LP_PRICE)} à vista.`,
  },
  {
    q: "Quanto tempo até eu ver algo concreto?",
    a: "A primeira leitura leva cerca de 15 minutos. A maioria das pessoas relata clareza já na primeira sessão — especialmente na Roda da Vida e no Temperamento.",
  },
  {
    q: "Meus dados e fotos ficam privados?",
    a: "Sim. Avaliações, fotos e resultados são só seus. Não vendemos nem compartilhamos com terceiros.",
  },
  {
    q: "E se não fizer sentido para mim?",
    a: `Você tem ${LP_GUARANTEE_DAYS} dias de garantia incondicional. Não gostou? Devolvemos 100% do valor, sem perguntas.`,
  },
];

export const LP_INCLUDED_ITEMS = [
  `Acesso completo à ${LP_JOURNEY_NAME}`,
  "9 análises integradas na trilha guiada",
  "Diagnósticos personalizados — nada genérico",
  "48+ interpretações exclusivas por pontuação",
  "Histórico para acompanhar sua evolução",
  `Portal ${LP_PORTAL_NAME} com missões e suporte inclusos`,
];

export function formatLpPriceLabel(): string {
  return `${formatLpPrice(LP_PRICE)} à vista ou ${LP_PRICE_INSTALLMENTS}x de ${formatLpPrice(LP_PRICE_INSTALLMENT_VALUE)}`;
}

export function formatLpPrice(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function buildCaktoReturnUrl(checkoutToken: string): string {
  const base =
    import.meta.env.VITE_PUBLIC_URL ||
    (typeof window !== "undefined" ? window.location.origin : "https://portaliluminando.com.br");
  return `${base}/acesso-pos-compra?token=${encodeURIComponent(checkoutToken)}`;
}

export function buildCaktoUrl(
  nome: string,
  email: string,
  telefone?: string,
  checkoutToken?: string,
): string {
  if (!CAKTO_CHECKOUT_URL) return "";
  const url = new URL(CAKTO_CHECKOUT_URL);
  url.searchParams.set("name", nome);
  url.searchParams.set("email", email);
  if (telefone) url.searchParams.set("phone", telefone);
  if (checkoutToken) {
    url.searchParams.set("ref", checkoutToken);
    url.searchParams.set("success_url", buildCaktoReturnUrl(checkoutToken));
  }
  return url.toString();
}
