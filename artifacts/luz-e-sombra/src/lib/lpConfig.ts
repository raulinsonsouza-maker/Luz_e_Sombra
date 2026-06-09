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
export const VSL_UNLOCK_KEY = "vsl_unlocked";

export const LP_PRODUCT_NAME = "Da Sombra à Luz";
export const LP_PRODUCT_TAGLINE = "Plataforma completa de autoconhecimento";
export const LP_PRICE = 97;
export const LP_PRICE_ORIGINAL = 197;
export const LP_GUARANTEE_DAYS = 7;

/** Preencher quando integrar com Cakto. Ex.: https://pay.cakto.com.br/xxx */
export const CAKTO_CHECKOUT_URL = "";

export interface LpModuleItem {
  icon: LucideIcon;
  title: string;
  desc: string;
}

export const LP_MODULES: LpModuleItem[] = [
  {
    icon: Layers,
    title: "Traço de Caráter",
    desc: "Leitura corporal Reich/Lowen com análise por fotos e diagnóstico personalizado.",
  },
  {
    icon: FlaskConical,
    title: "Temperamento",
    desc: "Descubra como você reage, decide e se relaciona no dia a dia.",
  },
  {
    icon: Heart,
    title: "Linguagens do Amor",
    desc: "Como você pede afeto, como demonstra e o que muda nas suas relações.",
  },
  {
    icon: Target,
    title: "Roda da Vida",
    desc: "Raio-x honesto de 12 áreas com interpretações exclusivas por pontuação.",
  },
  {
    icon: Hash,
    title: "Numerologia",
    desc: "Missão, talentos e padrões a partir da sua data de nascimento.",
  },
  {
    icon: Map,
    title: "Jornada gamificada",
    desc: "Trilha guiada com XP, missões e evolução passo a passo.",
  },
  {
    icon: GraduationCap,
    title: "Cursos e minicursos",
    desc: "Conteúdo em vídeo integrado à sua jornada de autoconhecimento.",
  },
  {
    icon: Users2,
    title: "Comunidade",
    desc: "Conecte-se com pessoas na mesma fase de transformação.",
  },
  {
    icon: Sparkles,
    title: "Quem Sou Eu",
    desc: "Síntese integrada cruzando numerologia, traço e roda da vida.",
  },
];

export const LP_TESTIMONIALS = [
  {
    name: "Mariana S.",
    role: "Empreendedora, 34 anos",
    text: "Em uma semana entendi padrões que vinha repetindo há anos. A Roda da Vida me mostrou exatamente onde estava me sabotando.",
  },
  {
    name: "Ricardo L.",
    role: "Profissional de TI, 41 anos",
    text: "O Traço de Caráter foi surpreendente. Pela primeira vez vi uma leitura que fazia sentido com o que eu sinto no corpo.",
  },
  {
    name: "Camila F.",
    role: "Psicóloga, 29 anos",
    text: "Uso com meus pacientes como ferramenta complementar. A jornada gamificada mantém o engajamento de forma leve.",
  },
];

export const LP_FAQ = [
  {
    q: "Como recebo o acesso após a compra?",
    a: "Assim que o pagamento for confirmado, você recebe por e-mail os dados de login para acessar a plataforma imediatamente.",
  },
  {
    q: "Quanto tempo leva para ver resultados?",
    a: "A primeira avaliação leva cerca de 15 minutos. Muitos usuários relatam clareza já na primeira sessão.",
  },
  {
    q: "Meus dados ficam privados?",
    a: "Sim. Suas avaliações, fotos e resultados são exclusivamente seus. Não compartilhamos informações com terceiros.",
  },
  {
    q: "E se não gostar?",
    a: `Você tem ${LP_GUARANTEE_DAYS} dias de garantia incondicional. Se não fizer sentido para você, devolvemos 100% do valor.`,
  },
];

export const LP_INCLUDED_ITEMS = [
  "Acesso vitalício à plataforma completa",
  "Todos os módulos de autoconhecimento",
  "Interpretações personalizadas (48+ combinações)",
  "Histórico de evolução ilimitado",
  "Atualizações futuras inclusas",
  "Suporte por e-mail",
];

export function formatLpPrice(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function buildCaktoUrl(nome: string, email: string, telefone?: string): string {
  if (!CAKTO_CHECKOUT_URL) return "";
  const url = new URL(CAKTO_CHECKOUT_URL);
  url.searchParams.set("name", nome);
  url.searchParams.set("email", email);
  if (telefone) url.searchParams.set("phone", telefone);
  return url.toString();
}
