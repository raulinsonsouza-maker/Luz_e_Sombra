import { CATALOGO, preencher } from "@workspace/copy-voz";
import { EMAIL_JOURNEY_NAME, EMAIL_PORTAL_NAME, EMAIL_SUPPORT, primeiroNome } from "../branding";
import { renderEmailLayout, p, strong, link } from "./layout";

export function checkoutWelcomeEmail(params: {
  nome: string;
  checkoutUrl: string;
  loginUrl: string;
}): { subject: string; html: string } {
  const nome = primeiroNome(params.nome);
  const bodyHtml = [
    p(`Olá, ${strong(nome)}.`),
    p(preencher(CATALOGO.email.cadastroCriado, {
      jornada: strong(EMAIL_JOURNEY_NAME),
      portal: strong(EMAIL_PORTAL_NAME),
    })),
    p(CATALOGO.email.faltaPagamento),
  ].join("");

  return {
    subject: CATALOGO.email.boasVindasAssunto,
    html: renderEmailLayout({
      preheader: preencher(CATALOGO.email.preheaderPagamento, { jornada: EMAIL_JOURNEY_NAME }),
      title: CATALOGO.email.quaseLa,
      bodyHtml,
      ctaLabel: CATALOGO.email.ctaPagamento,
      ctaHref: params.checkoutUrl,
      footerNote: `${CATALOGO.email.rodapeJaPagou} ${link(params.loginUrl, "portaliluminando.com.br/login")}.`,
    }),
  };
}

export function accessGrantedEmail(params: {
  nome: string;
  email: string;
  loginUrl: string;
  jornadaUrl: string;
}): { subject: string; html: string } {
  const nome = primeiroNome(params.nome);
  const bodyHtml = [
    p(`Olá, ${strong(nome)}.`),
    p(preencher(CATALOGO.email.pagamentoConfirmado, { portal: strong(EMAIL_PORTAL_NAME) })),
    p(preencher(CATALOGO.email.comoEntrar, { email: strong(params.email) })),
    p(preencher(CATALOGO.email.comecePeloTraco, { jornada: strong(EMAIL_JOURNEY_NAME) })),
  ].join("");

  return {
    subject: CATALOGO.email.acessoAssunto,
    html: renderEmailLayout({
      preheader: preencher(CATALOGO.email.preheaderAcesso, { jornada: EMAIL_JOURNEY_NAME }),
      title: CATALOGO.email.acessoLiberado,
      bodyHtml,
      ctaLabel: CATALOGO.email.ctaConta,
      ctaHref: params.loginUrl,
      secondaryCtaLabel: CATALOGO.email.ctaTraco,
      secondaryCtaHref: params.jornadaUrl,
      footerNote: `Precisa de ajuda? Escreva para ${link(`mailto:${EMAIL_SUPPORT}`, EMAIL_SUPPORT)}.`,
    }),
  };
}

export function accessRevokedEmail(params: {
  nome: string;
  suporteEmail: string;
}): { subject: string; html: string } {
  const nome = primeiroNome(params.nome);
  const bodyHtml = [
    p(`Olá, ${strong(nome)}.`),
    p(preencher(CATALOGO.email.acessoEncerrado, { portal: strong(EMAIL_PORTAL_NAME) })),
    p(preencher(CATALOGO.email.seFoiEngano, { suporte: strong(params.suporteEmail) })),
  ].join("");

  return {
    subject: CATALOGO.email.acessoEncerradoAssunto,
    html: renderEmailLayout({
      preheader: CATALOGO.email.preheaderEncerrado,
      title: CATALOGO.email.tituloEncerrado,
      bodyHtml,
      footerNote: CATALOGO.email.rodapeDuvida,
    }),
  };
}

export function passwordResetEmail(params: {
  nome: string;
  resetUrl: string;
}): { subject: string; html: string } {
  const nome = primeiroNome(params.nome);
  const bodyHtml = [
    p(`Olá, ${strong(nome)}.`),
    p(preencher(CATALOGO.email.pedidoSenha, { portal: strong(EMAIL_PORTAL_NAME) })),
    p(CATALOGO.email.linkValido),
    p(CATALOGO.email.ignoreSeNaoPediu),
  ].join("");

  return {
    subject: CATALOGO.email.senhaAssunto,
    html: renderEmailLayout({
      preheader: CATALOGO.email.preheaderSenha,
      title: CATALOGO.email.tituloSenha,
      bodyHtml,
      ctaLabel: CATALOGO.email.ctaSenha,
      ctaHref: params.resetUrl,
      footerNote: `Dúvidas? ${link(`mailto:${EMAIL_SUPPORT}`, EMAIL_SUPPORT)}`,
    }),
  };
}

export function passwordChangedEmail(params: {
  nome: string;
  loginUrl: string;
}): { subject: string; html: string } {
  const nome = primeiroNome(params.nome);
  const bodyHtml = [
    p(`Olá, ${strong(nome)}.`),
    p(preencher(CATALOGO.email.senhaAlterada, { portal: strong(EMAIL_PORTAL_NAME) })),
    p(CATALOGO.email.seNaoFoiVoce),
  ].join("");

  return {
    subject: CATALOGO.email.senhaAlteradaAssunto,
    html: renderEmailLayout({
      preheader: CATALOGO.email.preheaderSenhaAlterada,
      title: CATALOGO.email.tituloSenhaAlterada,
      bodyHtml,
      ctaLabel: CATALOGO.email.ctaLogin,
      ctaHref: params.loginUrl,
      footerNote: `Precisa de ajuda? ${link(`mailto:${EMAIL_SUPPORT}`, EMAIL_SUPPORT)}`,
    }),
  };
}

export function paymentPendingReminderEmail(params: {
  nome: string;
  checkoutUrl: string;
  loginUrl: string;
}): { subject: string; html: string } {
  const nome = primeiroNome(params.nome);
  const bodyHtml = [
    p(`Olá, ${strong(nome)}.`),
    p(preencher(CATALOGO.email.pixPendente, { jornada: strong(EMAIL_JOURNEY_NAME) })),
    p(CATALOGO.email.pixOrientacao),
  ].join("");

  return {
    subject: CATALOGO.email.pixAssunto,
    html: renderEmailLayout({
      preheader: CATALOGO.email.preheaderPix,
      title: CATALOGO.email.tituloPix,
      bodyHtml,
      ctaLabel: CATALOGO.email.ctaPagamento,
      ctaHref: params.checkoutUrl,
      footerNote: `Já pagou? Acesse em ${link(params.loginUrl, "portaliluminando.com.br/login")} com seu e-mail e senha.`,
    }),
  };
}

export function journeyNudgeEmail(params: {
  nome: string;
  moduloTitulo: string;
  jornadaUrl: string;
  loginUrl: string;
}): { subject: string; html: string } {
  const nome = primeiroNome(params.nome);
  const bodyHtml = [
    p(`Olá, ${strong(nome)}.`),
    p(preencher(CATALOGO.email.aindaNaoComecou, { jornada: strong(EMAIL_JOURNEY_NAME) })),
    p(preencher(CATALOGO.email.comecePorModulo, { modulo: strong(params.moduloTitulo) })),
  ].join("");

  return {
    subject: CATALOGO.email.jornadaAssunto,
    html: renderEmailLayout({
      preheader: CATALOGO.email.preheaderJornada,
      title: CATALOGO.email.tituloJornada,
      bodyHtml,
      ctaLabel: CATALOGO.email.ctaJornada,
      ctaHref: params.jornadaUrl,
      secondaryCtaLabel: CATALOGO.email.ctaFazerLogin,
      secondaryCtaHref: params.loginUrl,
    }),
  };
}
