import { renderEmailLayout, p, strong } from "./layout";

export function checkoutWelcomeEmail(params: {
  nome: string;
  checkoutUrl: string;
}): { subject: string; html: string } {
  const primeiroNome = params.nome.split(" ")[0] || params.nome;
  const bodyHtml = [
    p(`Olá, ${strong(primeiroNome)}.`),
    p(
      "Seu cadastro na Jornada Da Sombra à Luz foi criado com sucesso. Falta apenas concluir o pagamento para liberar o acesso completo ao Portal Iluminando.",
    ),
    p(
      "Você terá uma trilha guiada com análises integradas — Traço de Caráter, Temperamento, Linguagens do Amor, Roda da Vida e Numerologia.",
    ),
  ].join("");

  return {
    subject: "Continue seu pagamento — Portal Iluminando",
    html: renderEmailLayout({
      preheader: "Finalize o pagamento para acessar a Jornada Da Sombra à Luz.",
      title: "Quase lá",
      bodyHtml,
      ctaLabel: "Continuar pagamento",
      ctaHref: params.checkoutUrl,
      footerNote: "Se você já pagou, aguarde alguns instantes e acesse com o e-mail e a senha que cadastrou.",
    }),
  };
}

export function accessGrantedEmail(params: {
  nome: string;
  email: string;
  loginUrl: string;
  jornadaUrl: string;
}): { subject: string; html: string } {
  const primeiroNome = params.nome.split(" ")[0] || params.nome;
  const bodyHtml = [
    p(`Olá, ${strong(primeiroNome)}.`),
    p("Seu pagamento foi confirmado e seu acesso ao Portal Iluminando está liberado."),
    p(
      `Entre com o e-mail ${strong(params.email)} e a senha que você definiu no cadastro.`,
    ),
    p("Recomendamos começar pela primeira etapa da jornada: Traço de Caráter."),
  ].join("");

  return {
    subject: "Acesso liberado — Portal Iluminando",
    html: renderEmailLayout({
      preheader: "Seu acesso à Jornada Da Sombra à Luz foi liberado.",
      title: "Bem-vindo à jornada",
      bodyHtml,
      ctaLabel: "Começar pelo Traço de Caráter",
      ctaHref: params.jornadaUrl,
      footerNote: `Também pode entrar pelo login: ${params.loginUrl}`,
    }),
  };
}

export function accessRevokedEmail(params: {
  nome: string;
  suporteEmail: string;
}): { subject: string; html: string } {
  const primeiroNome = params.nome.split(" ")[0] || params.nome;
  const bodyHtml = [
    p(`Olá, ${strong(primeiroNome)}.`),
    p(
      "Informamos que o acesso à sua conta no Portal Iluminando foi encerrado em razão de reembolso ou estorno do pagamento.",
    ),
    p(
      `Se acredita que isso foi um engano ou precisa de ajuda, fale conosco em ${strong(params.suporteEmail)}.`,
    ),
  ].join("");

  return {
    subject: "Atualização sobre seu acesso — Portal Iluminando",
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
  const primeiroNome = params.nome.split(" ")[0] || params.nome;
  const bodyHtml = [
    p(`Olá, ${strong(primeiroNome)}.`),
    p("Recebemos um pedido para redefinir a senha da sua conta no Portal Iluminando."),
    p("O link abaixo expira em 1 hora. Se você não solicitou isso, ignore este e-mail."),
  ].join("");

  return {
    subject: "Redefinir sua senha — Portal Iluminando",
    html: renderEmailLayout({
      preheader: "Redefina sua senha do Portal Iluminando.",
      title: "Redefinir senha",
      bodyHtml,
      ctaLabel: "Criar nova senha",
      ctaHref: params.resetUrl,
    }),
  };
}

export function passwordChangedEmail(params: {
  nome: string;
  loginUrl: string;
}): { subject: string; html: string } {
  const primeiroNome = params.nome.split(" ")[0] || params.nome;
  const bodyHtml = [
    p(`Olá, ${strong(primeiroNome)}.`),
    p("Sua senha do Portal Iluminando foi alterada com sucesso."),
    p("Se você não fez essa alteração, entre em contato conosco imediatamente."),
  ].join("");

  return {
    subject: "Senha alterada — Portal Iluminando",
    html: renderEmailLayout({
      preheader: "Sua senha foi alterada com sucesso.",
      title: "Senha atualizada",
      bodyHtml,
      ctaLabel: "Fazer login",
      ctaHref: params.loginUrl,
    }),
  };
}
