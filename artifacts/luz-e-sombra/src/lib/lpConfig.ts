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

export const LP_PRODUCT_NAME = "Portal iluminando";
export const LP_PRODUCT_TAGLINE = "Da Sombra à Luz — autoconhecimento em clareza prática";
export const LP_PRICE = 57.9;
export const LP_PRICE_INSTALLMENTS = 3;
export const LP_PRICE_INSTALLMENT_VALUE = 21.19;
export const LP_PRICE_ORIGINAL = 97;
export const LP_PRICE_PERIOD = "";
export const LP_BILLING_LABEL = "Pagamento único";
export const LP_GUARANTEE_DAYS = 7;
export const LP_CTA_PRIMARY = "Quero meu acesso agora";
export const LP_CTA_NAV = "Começar agora";

/** Copy exclusiva da LP VSL (/vsl) */
export const VSL_COPY = {
  navCta: "Quero começar",
  eyebrow: "Para quem sente que repete os mesmos padrões",
  headline: "Existe um mapa de quem você é.",
  subheadline:
    "Assista ao vídeo e veja como cruzar traço corporal, temperamentos, relações e 12 áreas da vida — com clareza prática em minutos, não em anos de tentativa e erro.",
  gateTitle: "A oferta aparece em instantes",
  gateDesc:
    "Continue assistindo. Em poucos segundos você libera o plano completo, o que está incluso e como ativar seu acesso hoje.",
  unlockHint: "Pronto — role e veja tudo que você recebe",
  playerLocked: "Assista para liberar a oferta completa",
  playerProgress: (percent: number) =>
    percent > 0 ? `Assista mais ${percent}% do vídeo para liberar` : "Desbloqueando...",
};

export const LP_SECTIONS = {
  modules: {
    eyebrow: "Dentro da plataforma",
    title: "Não é avaliação genérica.",
    titleAccent: "São 9 lentes sobre você.",
    subtitle:
      "Cada ferramenta responde uma pergunta diferente — e juntas montam o retrato mais completo que você já teve de si.",
  },
  howItWorks: {
    eyebrow: "Como começar",
    title: "Três passos. Sem complicação.",
    steps: [
      {
        step: "01",
        title: "Assista o método",
        desc: "O vídeo acima mostra como tudo se conecta — e por que funciona quando outras abordagens falham.",
      },
      {
        step: "02",
        title: "Ative seu acesso",
        desc: "R$ 57,90 à vista ou 3x de R$ 21,19 no cartão. Checkout seguro e acesso após confirmação do pagamento.",
      },
      {
        step: "03",
        title: "Receba sua primeira leitura",
        desc: "Em cerca de 15 minutos você já tem diagnóstico personalizado na mão. Sem julgamento, no seu ritmo.",
      },
    ],
  },
  testimonials: {
    eyebrow: "Quem já saiu do automático",
    title: "Clareza que aparece rápido",
  },
  offer: {
    eyebrow: "Para quem assistiu até aqui",
    title: "Investimento único",
    titleAccent: "na clareza que você adia",
    subtitle: "Pagamento único. 7 dias de garantia total.",
    footnote: "PIX ou cartão · Acesso após confirmação · Garantia de 7 dias",
  },
  finalCta: {
    title: "Da próxima vez que você se perguntar",
    titleAccent: "por que repito isso?",
    body: "Você já terá um mapa — não só mais uma dúvida. A escolha é sua. O sistema está pronto.",
  },
  faq: {
    eyebrow: "Ainda com dúvida?",
    title: "Respostas diretas",
  },
} as const;

/** Copy das seções na LP controle (/) — tom mais editorial */
export const CONTROL_SECTIONS = {
  modules: {
    eyebrow: "Tudo que está incluso",
    title: "9 ferramentas.",
    titleAccent: "Uma jornada completa.",
    subtitle: "Cada módulo ilumina uma dimensão diferente de quem você é.",
  },
  howItWorks: {
    eyebrow: "Como funciona",
    title: "Simples. Profundo.",
    titleAccent: "Transformador.",
    steps: [
      {
        step: "01",
        title: "Assista e entenda",
        desc: "Veja como a plataforma funciona e o que você vai descobrir sobre si.",
      },
      {
        step: "02",
        title: "Garanta seu acesso",
        desc: "Checkout rápido. Login imediato após a confirmação do pagamento.",
      },
      {
        step: "03",
        title: "Comece sua jornada",
        desc: "Primeira avaliação em 15 minutos. Clareza real, no seu ritmo.",
      },
    ],
  },
  testimonials: {
    eyebrow: "Quem já passou por aqui",
    title: "Resultados reais",
  },
  offer: {
    eyebrow: "Oferta especial",
    title: `Acesso completo ao ${LP_PRODUCT_NAME}`,
    titleAccent: "",
    subtitle: `${LP_BILLING_LABEL}. Acesso completo após confirmação do pagamento.`,
    footnote: "PIX ou cartão · Acesso após pagamento · Garantia de 7 dias",
  },
  finalCta: {
    title: "Sua jornada começa",
    titleAccent: "com uma escolha",
    body: "A clareza que você busca está mais próxima do que imagina. Cada avaliação é um passo consciente.",
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

/** URL do checkout Cakto (Portal iluminando) */
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
    desc: "O que seu corpo revela sobre seu caráter — padrões que você repete sem perceber, lidos por fotos e Reich/Lowen.",
  },
  {
    icon: FlaskConical,
    title: "Temperamento",
    desc: "Por que você reage, decide e se relaciona do jeito que reage — e o que muda quando você entende isso.",
  },
  {
    icon: Heart,
    title: "Linguagens do Amor",
    desc: "Como você pede afeto, como demonstra e por que certas relações parecem nunca funcionar do seu jeito.",
  },
  {
    icon: Target,
    title: "Roda da Vida",
    desc: "Raio-x honesto de 12 áreas: onde sua energia está, onde você se sabota e o que pede atenção agora.",
  },
  {
    icon: Hash,
    title: "Numerologia",
    desc: "Missão, talentos e ciclos da sua data de nascimento — traduzidos em reflexão e ação concreta.",
  },
  {
    icon: Map,
    title: "Jornada gamificada",
    desc: "Trilha guiada com XP e missões diárias para você não parar no meio — constância sem peso.",
  },
  {
    icon: GraduationCap,
    title: "Cursos e minicursos",
    desc: "Vídeos integrados à jornada para aprofundar cada etapa no momento certo.",
  },
  {
    icon: Users2,
    title: "Comunidade",
    desc: "Pessoas na mesma fase de transformação — você não caminha sozinho(a) nesse processo.",
  },
  {
    icon: Sparkles,
    title: "Quem Sou Eu",
    desc: "Síntese final: numerologia + traço + roda da vida cruzados em um retrato integrado de quem você é.",
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
    q: "Preciso entender de numerologia ou terapia corporal?",
    a: "Não. A plataforma guia cada passo com perguntas claras e interpretações prontas. Você responde com honestidade — o sistema faz o resto.",
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
  "9 ferramentas de autoconhecimento desbloqueadas",
  "Diagnósticos personalizados — nada genérico",
  "48+ interpretações exclusivas por pontuação",
  "Histórico para acompanhar sua evolução",
  "Missões diárias e trilha gamificada",
  "Atualizações e suporte inclusos no acesso",
];

export function formatLpPriceLabel(): string {
  return `${formatLpPrice(LP_PRICE)} à vista ou ${LP_PRICE_INSTALLMENTS}x de ${formatLpPrice(LP_PRICE_INSTALLMENT_VALUE)}`;
}

export function formatLpPrice(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
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
  if (checkoutToken) url.searchParams.set("ref", checkoutToken);
  return url.toString();
}
