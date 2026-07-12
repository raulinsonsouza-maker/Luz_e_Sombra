import { firstNameFromFullName } from "./phone";

export type KommoMessageContext = {
  nome: string;
  checkoutUrl?: string;
  loginUrl?: string;
  email?: string;
};

function firstName(nome: string): string {
  return firstNameFromFullName(nome);
}

export function buildBoasVindasMessage(ctx: KommoMessageContext): string {
  const name = firstName(ctx.nome);
  const checkout = ctx.checkoutUrl ?? "";
  return `Oi, ${name}!

Seu cadastro na Jornada Da Sombra à Luz está confirmado.

Falta só concluir o pagamento para liberar o acesso completo ao Portal Iluminando — trilhas, módulos e acompanhamento da sua evolução.

Enviamos o link por e-mail também.

👇 Finalize seu acesso aqui:
${checkout}`;
}

export function buildPixPendenteMessage(ctx: KommoMessageContext): string {
  const name = firstName(ctx.nome);
  const checkout = ctx.checkoutUrl ?? "";
  return `Oi, ${name}!

Seu cadastro está confirmado — falta só o pagamento para liberar o acesso completo ao Portal Iluminando.

PIX ou cartão: aprovação na hora e você já entra na Jornada Da Sombra à Luz.

👇 Concluir pagamento agora:
${checkout}`;
}

export function buildPixLembrete2hMessage(ctx: KommoMessageContext): string {
  const name = firstName(ctx.nome);
  const checkout = ctx.checkoutUrl ?? "";
  return `${name}, tudo bem?

Sua vaga na Jornada Da Sombra à Luz ainda está reservada.

Se já pagou, pode ignorar — a confirmação às vezes demora alguns minutos.

Se ainda não finalizou, garanta seu acesso agora:

👇 Link do checkout:
${checkout}`;
}

export function buildPixLembrete24hMessage(ctx: KommoMessageContext): string {
  const name = firstName(ctx.nome);
  const checkout = ctx.checkoutUrl ?? "";
  return `Oi, ${name}!

Último lembrete: sua vaga no Portal Iluminando ainda está disponível.

Quem conclui o pagamento hoje tem acesso imediato a todas as trilhas e módulos da jornada.

Não deixa para depois — é só um clique:

👇 Finalizar agora:
${checkout}`;
}

export function buildAcessoLiberadoMessage(ctx: KommoMessageContext): string {
  const name = firstName(ctx.nome);
  const email = ctx.email ?? "";
  const login = ctx.loginUrl ?? "";
  return `${name}, pagamento confirmado!

Seu acesso ao Portal Iluminando está LIBERADO.

Entre com o e-mail ${email} e a senha que você criou.

Dentro do portal: sua jornada completa de autoconhecimento, no seu ritmo.

👇 Acessar agora:
${login}`;
}
