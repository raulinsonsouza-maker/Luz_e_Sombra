import { db } from "@workspace/db";
import { comprasMpTable, usuariosTable } from "@workspace/db/schema";
import { and, eq, isNull, ne, or, sql } from "drizzle-orm";
import type { Logger } from "pino";
import { PRECO_OFERTA_NUM } from "../acesso/periodo";
import { getWhatsAppConfig, isWhatsAppConfigured } from "./config";
import {
  sendWhatsAppPixOrderDetails,
  sendWhatsAppTemplate,
  sendWhatsAppText,
} from "./client";
import { firstNameFromFullName, toWhatsAppRecipient } from "./phone";
import { WA_TEMPLATES } from "./templates";

function checkoutTokenSuffix(token: string): string {
  return encodeURIComponent(token);
}

async function loadUser(usuarioId: number) {
  const [row] = await db
    .select({
      telefone: usuariosTable.telefone,
      nome: usuariosTable.nome,
      email: usuariosTable.email,
      optOut: usuariosTable.whatsappOptOut,
      comunidadeOptIn: usuariosTable.whatsappComunidadeOptIn,
    })
    .from(usuariosTable)
    .where(eq(usuariosTable.id, usuarioId))
    .limit(1);
  return row ?? null;
}

async function markCompraFlag(
  checkoutToken: string,
  flag:
    | "waWelcomeSentAt"
    | "waPixPendingSentAt"
    | "waReminder2hSentAt"
    | "waReminder24hSentAt"
    | "waAccessGrantedSentAt",
  extra?: Partial<{ pixCopiaECola: string | null; mpPaymentId: string | null }>,
): Promise<void> {
  await db
    .update(comprasMpTable)
    .set({ [flag]: new Date(), atualizadoEm: new Date(), ...extra })
    .where(eq(comprasMpTable.checkoutToken, checkoutToken));
}

export async function closeWhatsAppRemindersOnPaid(checkoutToken: string): Promise<void> {
  const now = new Date();
  const [row] = await db
    .select({
      wa2: comprasMpTable.waReminder2hSentAt,
      wa24: comprasMpTable.waReminder24hSentAt,
    })
    .from(comprasMpTable)
    .where(eq(comprasMpTable.checkoutToken, checkoutToken))
    .limit(1);
  if (!row) return;
  await db
    .update(comprasMpTable)
    .set({
      waReminder2hSentAt: row.wa2 ?? now,
      waReminder24hSentAt: row.wa24 ?? now,
      atualizadoEm: now,
    })
    .where(eq(comprasMpTable.checkoutToken, checkoutToken));
}

/** Cadastro iniciado (MARKETING) — nao e boas-vindas de membro. */
export async function sendCadastroIniciadoWhatsApp(
  params: {
    usuarioId: number;
    nome: string;
    telefone: string;
    checkoutToken: string;
  },
  log?: Logger,
): Promise<boolean> {
  if (!isWhatsAppConfigured()) return false;
  const user = await loadUser(params.usuarioId);
  if (user?.optOut) return false;

  const to = toWhatsAppRecipient(params.telefone);
  if (!to) return false;

  const [compra] = await db
    .select({ sent: comprasMpTable.waWelcomeSentAt })
    .from(comprasMpTable)
    .where(eq(comprasMpTable.checkoutToken, params.checkoutToken))
    .limit(1);
  if (compra?.sent) return false;

  await sendWhatsAppTemplate({
    to,
    template: WA_TEMPLATES.cadastroIniciado,
    bodyParams: [firstNameFromFullName(params.nome)],
    urlButtons: [{ index: 0, suffix: checkoutTokenSuffix(params.checkoutToken) }],
    log,
  });
  await markCompraFlag(params.checkoutToken, "waWelcomeSentAt");
  return true;
}

export async function sendPixPendingWhatsApp(
  params: {
    usuarioId: number;
    nome: string;
    telefone?: string | null;
    checkoutToken: string;
    mpPaymentId: string;
    pixCopiaECola?: string | null;
    valor?: string | null;
  },
  log?: Logger,
): Promise<boolean> {
  if (!isWhatsAppConfigured()) return false;
  const user = await loadUser(params.usuarioId);
  if (user?.optOut) return false;

  const to = toWhatsAppRecipient(params.telefone ?? user?.telefone);
  if (!to) return false;

  const [compra] = await db
    .select({
      sent: comprasMpTable.waPixPendingSentAt,
      pix: comprasMpTable.pixCopiaECola,
      valor: comprasMpTable.valor,
    })
    .from(comprasMpTable)
    .where(eq(comprasMpTable.checkoutToken, params.checkoutToken))
    .limit(1);
  if (compra?.sent) return false;

  const pixCode = (params.pixCopiaECola || compra?.pix || "").trim();
  const pedido = params.mpPaymentId || "pendente";
  const amount = Number.parseFloat(params.valor || compra?.valor || String(PRECO_OFERTA_NUM));

  // Template UTILITY com botao URL + QR Ja paguei (PAYMENT_REQUEST nao liberado nesta WABA)
  await sendWhatsAppTemplate({
    to,
    template: WA_TEMPLATES.pixPendente,
    bodyParams: [firstNameFromFullName(params.nome), pedido],
    urlButtons: [{ index: 0, suffix: checkoutTokenSuffix(params.checkoutToken) }],
    log,
  });

  if (pixCode) {
    const orderOk = await sendWhatsAppPixOrderDetails({
      to,
      referenceId: `mp-${params.mpPaymentId}`.slice(0, 60),
      pixCode,
      amountBrl: Number.isFinite(amount) ? amount : PRECO_OFERTA_NUM,
      bodyText: `Pedido ${pedido} — Portal Iluminando. Use o botao para copiar o codigo Pix.`,
      log,
    });
    if (!orderOk.ok) {
      await sendWhatsAppText({
        to,
        text: `Codigo Pix copia e cola (pedido ${pedido}):\n\n${pixCode}\n\nOu abra o checkout no Portal Iluminando.`,
        log,
      }).catch(() => undefined);
    }
  }

  await markCompraFlag(params.checkoutToken, "waPixPendingSentAt", {
    pixCopiaECola: pixCode || null,
    mpPaymentId: params.mpPaymentId,
  });
  return true;
}

export async function sendAcessoAtivadoWhatsApp(
  params: {
    usuarioId: number;
    nome: string;
    telefone?: string | null;
    checkoutToken?: string;
    mpPaymentId?: string | null;
    compraId?: number | null;
  },
  log?: Logger,
): Promise<boolean> {
  if (!isWhatsAppConfigured()) return false;
  const user = await loadUser(params.usuarioId);
  if (user?.optOut) return false;

  const to = toWhatsAppRecipient(params.telefone ?? user?.telefone);
  if (!to) return false;

  if (params.checkoutToken) {
    const [compra] = await db
      .select({ sent: comprasMpTable.waAccessGrantedSentAt })
      .from(comprasMpTable)
      .where(eq(comprasMpTable.checkoutToken, params.checkoutToken))
      .limit(1);
    if (compra?.sent) return false;
  }

  const pedido =
    params.mpPaymentId?.trim() ||
    (params.compraId != null ? String(params.compraId) : "confirmado");

  await sendWhatsAppTemplate({
    to,
    template: WA_TEMPLATES.acessoAtivado,
    bodyParams: [firstNameFromFullName(params.nome), pedido],
    // botao URL estatico /login — sem parametro dinamico no template
    log,
  });

  if (params.checkoutToken) {
    await markCompraFlag(params.checkoutToken, "waAccessGrantedSentAt");
    await closeWhatsAppRemindersOnPaid(params.checkoutToken);
  }
  return true;
}

export async function notifyComunidadeNovaPostagemWhatsApp(
  params: {
    titulo: string;
    postId: number;
  },
  log?: Logger,
): Promise<{ sent: number; skipped: number; errors: number }> {
  if (!isWhatsAppConfigured()) {
    return { sent: 0, skipped: 0, errors: 0 };
  }

  const titulo = params.titulo.slice(0, 200);
  const pathSuffix = `comunidade`; // deep link simples; postId no body

  const usuarios = await db
    .select({
      id: usuariosTable.id,
      nome: usuariosTable.nome,
      telefone: usuariosTable.telefone,
    })
    .from(usuariosTable)
    .where(
      and(
        eq(usuariosTable.statusAcesso, "active"),
        eq(usuariosTable.ativo, true),
        eq(usuariosTable.isAdmin, false),
        eq(usuariosTable.whatsappOptOut, false),
        eq(usuariosTable.whatsappComunidadeOptIn, true),
        sql`${usuariosTable.telefone} IS NOT NULL AND length(trim(${usuariosTable.telefone})) > 0`,
        or(isNull(usuariosTable.acessoAte), sql`${usuariosTable.acessoAte} > NOW()`)!,
      ),
    );

  let sent = 0;
  let skipped = 0;
  let errors = 0;

  for (const u of usuarios) {
    const to = toWhatsAppRecipient(u.telefone);
    if (!to) {
      skipped++;
      continue;
    }
    try {
      await sendWhatsAppTemplate({
        to,
        template: WA_TEMPLATES.comunidadeNovaPostagem,
        bodyParams: [firstNameFromFullName(u.nome), `${titulo} (#${params.postId})`],
        urlButtons: [{ index: 0, suffix: pathSuffix }],
        log,
      });
      sent++;
    } catch (error) {
      errors++;
      log?.error(
        { errMsg: error instanceof Error ? error.message : String(error), usuarioId: u.id },
        "Falha WhatsApp comunidade",
      );
    }
  }

  log?.info({ sent, skipped, errors, postId: params.postId }, "Broadcast comunidade WhatsApp");
  return { sent, skipped, errors };
}

/** @deprecated use notifyComunidadeNovaPostagemWhatsApp */
export async function notifyActiveSubscribersWhatsApp(
  params: {
    kind: "curso" | "comunidade" | "dia";
    titulo: string;
    detalhe?: string;
    link?: string;
    usuarioId?: number;
  },
  log?: Logger,
): Promise<{ sent: number; skipped: number; errors: number }> {
  if (params.kind === "comunidade") {
    return notifyComunidadeNovaPostagemWhatsApp(
      { titulo: params.titulo, postId: 0 },
      log,
    );
  }
  log?.warn({ kind: params.kind }, "Broadcast generico descontinuado na Fase 1 Letícia");
  return { sent: 0, skipped: 0, errors: 0 };
}

export function queueSendCadastroIniciadoWhatsApp(
  params: {
    usuarioId: number;
    nome: string;
    telefone: string;
    checkoutToken: string;
  },
  log?: Logger,
): void {
  sendCadastroIniciadoWhatsApp(params, log).catch((error) => {
    log?.error(
      { errMsg: error instanceof Error ? error.message : String(error), usuarioId: params.usuarioId },
      "Falha WhatsApp cadastro iniciado",
    );
  });
}

/** Alias legado */

export function queueSendPixPendingWhatsApp(
  params: {
    usuarioId: number;
    nome: string;
    telefone?: string | null;
    checkoutToken: string;
    mpPaymentId: string;
    pixCopiaECola?: string | null;
    valor?: string | null;
  },
  log?: Logger,
): void {
  sendPixPendingWhatsApp(params, log).catch((error) => {
    log?.error(
      { errMsg: error instanceof Error ? error.message : String(error), usuarioId: params.usuarioId },
      "Falha WhatsApp PIX pendente",
    );
  });
}

export function queueSendAcessoAtivadoWhatsApp(
  params: {
    usuarioId: number;
    nome: string;
    telefone?: string | null;
    checkoutToken?: string;
    mpPaymentId?: string | null;
    compraId?: number | null;
  },
  log?: Logger,
): void {
  sendAcessoAtivadoWhatsApp(params, log).catch((error) => {
    log?.error(
      { errMsg: error instanceof Error ? error.message : String(error), usuarioId: params.usuarioId },
      "Falha WhatsApp acesso ativado",
    );
  });
}

/** Alias legado */

export async function setWhatsAppOptOutByPhone(waIdDigits: string, optOut: boolean): Promise<number> {
  const digits = waIdDigits.replace(/\D/g, "");
  const withoutCountry = digits.startsWith("55") ? digits.slice(2) : digits;

  const result = await db
    .update(usuariosTable)
    .set({ whatsappOptOut: optOut, atualizadoEm: new Date() })
    .where(
      and(
        ne(usuariosTable.whatsappOptOut, optOut),
        or(
          sql`regexp_replace(coalesce(${usuariosTable.telefone}, ''), '\\D', '', 'g') = ${digits}`,
          sql`regexp_replace(coalesce(${usuariosTable.telefone}, ''), '\\D', '', 'g') = ${withoutCountry}`,
          sql`regexp_replace(coalesce(${usuariosTable.telefone}, ''), '\\D', '', 'g') = ${`55${withoutCountry}`}`,
        ),
      ),
    )
    .returning({ id: usuariosTable.id });

  return result.length;
}

export async function setWhatsAppComunidadeOptInByPhone(
  waIdDigits: string,
  optIn: boolean,
): Promise<number> {
  const digits = waIdDigits.replace(/\D/g, "");
  const withoutCountry = digits.startsWith("55") ? digits.slice(2) : digits;

  const result = await db
    .update(usuariosTable)
    .set({ whatsappComunidadeOptIn: optIn, atualizadoEm: new Date() })
    .where(
      and(
        ne(usuariosTable.whatsappComunidadeOptIn, optIn),
        or(
          sql`regexp_replace(coalesce(${usuariosTable.telefone}, ''), '\\D', '', 'g') = ${digits}`,
          sql`regexp_replace(coalesce(${usuariosTable.telefone}, ''), '\\D', '', 'g') = ${withoutCountry}`,
          sql`regexp_replace(coalesce(${usuariosTable.telefone}, ''), '\\D', '', 'g') = ${`55${withoutCountry}`}`,
        ),
      ),
    )
    .returning({ id: usuariosTable.id });

  return result.length;
}

export async function markJaPagueiByPhone(waIdDigits: string): Promise<number> {
  const digits = waIdDigits.replace(/\D/g, "");
  const withoutCountry = digits.startsWith("55") ? digits.slice(2) : digits;
  const now = new Date();

  const users = await db
    .select({ id: usuariosTable.id })
    .from(usuariosTable)
    .where(
      or(
        sql`regexp_replace(coalesce(${usuariosTable.telefone}, ''), '\\D', '', 'g') = ${digits}`,
        sql`regexp_replace(coalesce(${usuariosTable.telefone}, ''), '\\D', '', 'g') = ${withoutCountry}`,
        sql`regexp_replace(coalesce(${usuariosTable.telefone}, ''), '\\D', '', 'g') = ${`55${withoutCountry}`}`,
      ),
    );

  let updated = 0;
  for (const u of users) {
    const r = await db
      .update(comprasMpTable)
      .set({
        waReminder2hSentAt: now,
        waReminder24hSentAt: now,
        atualizadoEm: now,
      })
      .where(and(eq(comprasMpTable.usuarioId, u.id), eq(comprasMpTable.status, "pending")))
      .returning({ id: comprasMpTable.id });
    updated += r.length;
  }
  return updated;
}

/** Alias legado (funnel / activateMpPurchase / cakto) */
export const queueSendWelcomeWhatsApp = queueSendCadastroIniciadoWhatsApp;
export const queueSendAccessGrantedWhatsApp = queueSendAcessoAtivadoWhatsApp;
