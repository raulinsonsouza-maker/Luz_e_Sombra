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
    p(
      `Seu cadastro na ${strong(EMAIL_JOURNEY_NAME)} foi criado com sucesso no ${strong(EMAIL_PORTAL_NAME)}.`,
    ),
    p(
      "Falta apenas concluir o pagamento para liberar o acesso completo à sua trilha guiada — Traço de Caráter, Temperamento, Linguagens do Amor, Roda da Vida e Numerologia.",
    ),
  ].join("");

  return {
    subject: `Bem-vindo(a) — finalize seu pagamento | ${EMAIL_PORTAL_NAME}`,
    html: renderEmailLayout({
      preheader: `Finalize o pagamento e comece a ${EMAIL_JOURNEY_NAME}.`,
      title: "Quase lá!",
      bodyHtml,
      ctaLabel: "Continuar pagamento",
      ctaHref: params.checkoutUrl,
      footerNote: `Já pagou? Aguarde alguns instantes e acesse com seu e-mail e senha em ${link(params.loginUrl, "portaliluminando.com.br/login")}.`,
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
    p(`Seu pagamento foi confirmado. Seu acesso ao ${strong(EMAIL_PORTAL_NAME)} está liberado.`),
    p(
      `Para entrar, use o e-mail ${strong(params.email)} e a senha que você definiu no cadastro.`,
    ),
    p(
      `Após o login, recomendamos começar pela primeira etapa da ${strong(EMAIL_JOURNEY_NAME)}: Traço de Caráter.`,
    ),
  ].join("");

  return {
    subject: `Pagamento confirmado — bem-vindo(a) ao ${EMAIL_PORTAL_NAME}`,
    html: renderEmailLayout({
      preheader: `Acesso liberado à ${EMAIL_JOURNEY_NAME}. Faça login para começar.`,
      title: "Seu acesso foi liberado",
      bodyHtml,
      ctaLabel: "Acessar minha conta",
      ctaHref: params.loginUrl,
      secondaryCtaLabel: "Começar pelo Traço de Caráter",
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
    p(
      `Informamos que o acesso à sua conta no ${strong(EMAIL_PORTAL_NAME)} foi encerrado em razão de reembolso ou estorno do pagamento.`,
    ),
    p(
      `Se acredita que isso foi um engano ou precisa de ajuda, fale conosco em ${strong(params.suporteEmail)}.`,
    ),
  ].join("");

  return {
    subject: `Atualização sobre seu acesso | ${EMAIL_PORTAL_NAME}`,
    html: renderEmailLayout({
      preheader: "Seu acesso ao Portal Iluminando foi encerrado.",
      title: "Acesso encerrado",
      bodyHtml,
      footerNote: "Estamos à disposição para esclarecer qualquer dúvida.",
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
    p(`Recebemos um pedido para redefinir a senha da sua conta no ${strong(EMAIL_PORTAL_NAME)}.`),
    p(`Clique no botão abaixo para criar uma nova senha. O link é válido por ${strong("1 hora")}.`),
    p("Se você não solicitou isso, ignore este e-mail — sua senha atual permanece a mesma."),
  ].join("");

  return {
    subject: `Redefinir sua senha | ${EMAIL_PORTAL_NAME}`,
    html: renderEmailLayout({
      preheader: "Crie uma nova senha para acessar o Portal Iluminando.",
      title: "Redefinir senha",
      bodyHtml,
      ctaLabel: "Criar nova senha",
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
    p(`Sua senha do ${strong(EMAIL_PORTAL_NAME)} foi alterada com sucesso.`),
    p("Se você não fez essa alteração, entre em contato conosco imediatamente."),
  ].join("");

  return {
    subject: `Senha alterada com sucesso | ${EMAIL_PORTAL_NAME}`,
    html: renderEmailLayout({
      preheader: "Sua senha foi atualizada. Você já pode fazer login.",
      title: "Senha atualizada",
      bodyHtml,
      ctaLabel: "Fazer login",
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
    p(`Notamos que seu pagamento via PIX da ${strong(EMAIL_JOURNEY_NAME)} ainda não foi confirmado.`),
    p("Se você já pagou, aguarde alguns minutos — a confirmação pode levar um pouco. Caso contrário, finalize agora para liberar seu acesso."),
  ].join("");

  return {
    subject: `Seu PIX ainda está pendente | ${EMAIL_PORTAL_NAME}`,
    html: renderEmailLayout({
      preheader: "Finalize seu pagamento PIX para acessar a jornada.",
      title: "Pagamento pendente",
      bodyHtml,
      ctaLabel: "Continuar pagamento",
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
    p(`Seu acesso à ${strong(EMAIL_JOURNEY_NAME)} já está liberado, mas você ainda não começou sua primeira análise.`),
    p(`Recomendamos começar por ${strong(params.moduloTitulo)} — leva cerca de 15 minutos e já traz insights valiosos.`),
  ].join("");

  return {
    subject: `Sua jornada está esperando | ${EMAIL_PORTAL_NAME}`,
    html: renderEmailLayout({
      preheader: "Comece sua primeira análise na jornada.",
      title: "Hora de dar o primeiro passo",
      bodyHtml,
      ctaLabel: "Iniciar minha jornada",
      ctaHref: params.jornadaUrl,
      secondaryCtaLabel: "Fazer login",
      secondaryCtaHref: params.loginUrl,
    }),
  };
}
