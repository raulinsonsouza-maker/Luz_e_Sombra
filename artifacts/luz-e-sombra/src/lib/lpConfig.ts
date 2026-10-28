import type { LucideIcon } from "lucide-react";
import { CATALOGO, MARCA, preencher } from "@workspace/copy-voz";
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

export const LP_PORTAL_NAME = MARCA.portal;
export const LP_JOURNEY_NAME = MARCA.jornada;
export const LP_JOURNEY_TAGLINE = CATALOGO.lp.tagline;
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
  ...CATALOGO.lp.hero,
  subline: CATALOGO.lp.heroSubline,
} as const;

/** Copy exclusiva da LP VSL (/vsl) */
export const VSL_COPY = {
  navCta: CATALOGO.lp.vslCopy.navCta,
  eyebrow: LP_PORTAL_NAME,
  headline: CATALOGO.lp.vslCopy.headline,
  subheadline: CATALOGO.lp.vslCopy.subheadline,
  gateTitle: CATALOGO.lp.vslCopy.gateTitle,
  gateDesc: CATALOGO.lp.vslCopy.gateDesc,
  unlockHint: CATALOGO.lp.vslCopy.unlockHint,
  playerLocked: CATALOGO.lp.vslCopy.playerLocked,
  playerProgress: (percent: number) =>
    percent > 0
      ? preencher(CATALOGO.lp.vslCopy.playerProgressMais, { percent })
      : CATALOGO.lp.vslCopy.playerProgressZero,
};

export const LP_SECTIONS = CATALOGO.lp.vsl;

/** Copy das seções na LP controle (/) */
export const CONTROL_SECTIONS = {
  ...CATALOGO.lp.controle,
  offer: {
    ...CATALOGO.lp.controle.offer,
    subtitle: `${LP_BILLING_LABEL} · Acesso no ${LP_PORTAL_NAME} após confirmação do pagamento.`,
  },
};

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

const ICONES_MODULOS: LucideIcon[] = [
  Layers,
  FlaskConical,
  Heart,
  Target,
  Hash,
  Map,
  GraduationCap,
  Users2,
  Sparkles,
];

export const LP_MODULES: LpModuleItem[] = CATALOGO.lp.modulos.map((item, i) => ({
  icon: ICONES_MODULOS[i] ?? Sparkles,
  title: item.title,
  desc: item.desc,
}));

export const LP_TESTIMONIALS = CATALOGO.lp.depoimentos;

export const LP_FAQ = CATALOGO.lp.faq.map((item) => ({
  q: item.q,
  a: preencher(item.a, {
    parcelas: LP_PRICE_INSTALLMENTS,
    parcela: formatLpPrice(LP_PRICE_INSTALLMENT_VALUE),
    avista: formatLpPrice(LP_PRICE),
    garantia: LP_GUARANTEE_DAYS,
  }),
}));

export const LP_INCLUDED_ITEMS = CATALOGO.lp.inclusos;

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
