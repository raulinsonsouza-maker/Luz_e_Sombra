import { db } from "@workspace/db";
import { comprasMpTable, usuariosTable } from "@workspace/db/schema";
import { and, eq, isNull, ne, or, sql } from "drizzle-orm";
import type { Logger } from "pino";
import { getWhatsAppConfig, isWhatsAppConfigured } from "./config";
import { sendWhatsAppTemplate } from "./client";
import { firstNameFromFullName, toWhatsAppRecipient } from "./phone";
import { WA_TEMPLATES } from "./templates";

function checkoutUrl(token: string): string {
  const { publicUrl } = getWhatsAppConfig();
  return `${publicUrl}/checkout?token=${encodeURIComponent(token)}`;
}

function loginUrl(): string {
  return `${getWhatsAppConfig().publicUrl}/login`;
}

async function loadUserPhone(usuarioId: number): Promise<{
  telefone: string | null;
  nome: string;
  email: string | null;
  optOut: boolean;
} | null> {
  const [row] = await db
    .select({
      telefone: usuariosTable.telefone,
      nome: usuariosTable.nome,
      email: usuariosTable.email,
      optOut: usuariosTable.whatsappOptOut,
    })
    .from(usuariosTable)
    .where(eq(usuariosTable.id, usuarioId))
    .limit(1);
  if (!row) return null;
  return {
    telefone: row.telefone,
    nome: row.nome,
    email: row.email,
    optOut: row.optOut,
  };
}

async function markCompraFlag(
  checkoutToken: string,
  flag: "waWelcomeSentAt" | "waPixPendingSentAt" | "waReminder2hSentAt" | "waReminder24hSentAt" | "waAccessGrantedSentAt",
): Promise<void> {
  await db
    .update(comprasMpTable)
    .set({ [flag]: new Date(), atualizadoEm: new Date() })
    .where(eq(comprasMpTable.checkoutToken, checkoutToken));
}

export async function sendWelcomeWhatsApp(
  params: {
    usuarioId: number;
    nome: string;
    telefone: string;
    checkoutToken: string;
  },
  log?: Logger,
): Promise<boolean> {
  if (!isWhatsAppConfigured()) return false;

  const user = await loadUserPhone(params.usuarioId);
  if (user?.optOut) {
    log?.debug({ usuarioId: params.usuarioId }, "WhatsApp opt-out — boas-vindas ignorada");
    return false;
  }

  const to = toWhatsAppRecipient(params.telefone);
  if (!to) {
    log?.warn({ usuarioId: params.usuarioId }, "Telefone inválido para WhatsApp");
    return false;
  }

  const [compra] = await db
    .select({ sent: comprasMpTable.waWelcomeSentAt })
    .from(comprasMpTable)
    .where(eq(comprasMpTable.checkoutToken, params.checkoutToken))
    .limit(1);
  if (compra?.sent) return false;

  await sendWhatsAppTemplate({
    to,
    template: WA_TEMPLATES.boasVindas,
    bodyParams: [firstNameFromFullName(params.nome), checkoutUrl(params.checkoutToken)],
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
  },
  log?: Logger,
): Promise<boolean> {
  if (!isWhatsAppConfigured()) return false;

  const user = await loadUserPhone(params.usuarioId);
  if (user?.optOut) return false;

  const to = toWhatsAppRecipient(params.telefone ?? user?.telefone);
  if (!to) return false;

  const [compra] = await db
    .select({ sent: comprasMpTable.waPixPendingSentAt })
    .from(comprasMpTable)
    .where(eq(comprasMpTable.checkoutToken, params.checkoutToken))
    .limit(1);
  if (compra?.sent) return false;

  await sendWhatsAppTemplate({
    to,
    template: WA_TEMPLATES.pixPendente,
    bodyParams: [firstNameFromFullName(params.nome), checkoutUrl(params.checkoutToken)],
    log,
  });
  await markCompraFlag(params.checkoutToken, "waPixPendingSentAt");
  return true;
}

export async function sendAccessGrantedWhatsApp(
  params: {
    usuarioId: number;
    nome: string;
    email: string;
    telefone?: string | null;
    checkoutToken?: string;
  },
  log?: Logger,
): Promise<boolean> {
  if (!isWhatsAppConfigured()) return false;

  const user = await loadUserPhone(params.usuarioId);
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

  await sendWhatsAppTemplate({
    to,
    template: WA_TEMPLATES.acessoLiberado,
    bodyParams: [firstNameFromFullName(params.nome), params.email, loginUrl()],
    log,
  });

  if (params.checkoutToken) {
    await markCompraFlag(params.checkoutToken, "waAccessGrantedSentAt");
  }
  return true;
}

export type NotifyKind = "curso" | "comunidade" | "dia";

const NOTIFY_TEMPLATE: Record<NotifyKind, (typeof WA_TEMPLATES)[keyof typeof WA_TEMPLATES]> = {
  curso: WA_TEMPLATES.avisoCurso,
  comunidade: WA_TEMPLATES.avisoComunidade,
  dia: WA_TEMPLATES.avisoDia,
};

/**
 * Dispara template Marketing para assinantes ativos com telefone e sem opt-out.
 */
export async function notifyActiveSubscribersWhatsApp(
  params: {
    kind: NotifyKind;
    titulo: string;
    detalhe?: string;
    link?: string;
    /** Se definido, envia só para este usuário (ainda precisa estar active). */
    usuarioId?: number;
  },
  log?: Logger,
): Promise<{ sent: number; skipped: number; errors: number }> {
  if (!isWhatsAppConfigured()) {
    return { sent: 0, skipped: 0, errors: 0 };
  }

  const { publicUrl } = getWhatsAppConfig();
  const link = params.link?.trim() || publicUrl;
  const detalhe = (params.detalhe?.trim() || params.titulo).slice(0, 200);
  const template = NOTIFY_TEMPLATE[params.kind];

  const conditions = [
    eq(usuariosTable.statusAcesso, "active"),
    eq(usuariosTable.ativo, true),
    eq(usuariosTable.whatsappOptOut, false),
    eq(usuariosTable.isAdmin, false),
    sql`${usuariosTable.telefone} IS NOT NULL AND length(trim(${usuariosTable.telefone})) > 0`,
    or(isNull(usuariosTable.acessoAte), sql`${usuariosTable.acessoAte} > NOW()`)!,
  ];

  if (params.usuarioId) {
    conditions.push(eq(usuariosTable.id, params.usuarioId));
  }

  const usuarios = await db
    .select({
      id: usuariosTable.id,
      nome: usuariosTable.nome,
      telefone: usuariosTable.telefone,
    })
    .from(usuariosTable)
    .where(and(...conditions));

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
        template,
        bodyParams: [firstNameFromFullName(u.nome), params.titulo.slice(0, 200), `${detalhe}\n${link}`.slice(0, 1024)],
        log,
      });
      sent++;
    } catch (error) {
      errors++;
      const errMsg = error instanceof Error ? error.message : String(error);
      log?.error({ errMsg, usuarioId: u.id }, "Falha notificação WhatsApp assinante");
    }
  }

  log?.info({ kind: params.kind, sent, skipped, errors }, "Broadcast WhatsApp assinantes concluído");
  return { sent, skipped, errors };
}

export function queueSendWelcomeWhatsApp(
  params: {
    usuarioId: number;
    nome: string;
    telefone: string;
    checkoutToken: string;
  },
  log?: Logger,
): void {
  sendWelcomeWhatsApp(params, log).catch((error) => {
    const errMsg = error instanceof Error ? error.message : String(error);
    log?.error({ errMsg, usuarioId: params.usuarioId }, "Falha WhatsApp boas-vindas");
  });
}

export function queueSendPixPendingWhatsApp(
  params: {
    usuarioId: number;
    nome: string;
    telefone?: string | null;
    checkoutToken: string;
  },
  log?: Logger,
): void {
  sendPixPendingWhatsApp(params, log).catch((error) => {
    const errMsg = error instanceof Error ? error.message : String(error);
    log?.error({ errMsg, usuarioId: params.usuarioId }, "Falha WhatsApp PIX pendente");
  });
}

export function queueSendAccessGrantedWhatsApp(
  params: {
    usuarioId: number;
    nome: string;
    email: string;
    telefone?: string | null;
    checkoutToken?: string;
  },
  log?: Logger,
): void {
  sendAccessGrantedWhatsApp(params, log).catch((error) => {
    const errMsg = error instanceof Error ? error.message : String(error);
    log?.error({ errMsg, usuarioId: params.usuarioId }, "Falha WhatsApp acesso liberado");
  });
}

export async function setWhatsAppOptOutByPhone(waIdDigits: string, optOut: boolean): Promise<number> {
  // Match telefone armazenado em vários formatos
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
