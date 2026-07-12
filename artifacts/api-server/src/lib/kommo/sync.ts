import { db } from "@workspace/db";
import { comprasCaktoTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import type { Logger } from "pino";
import { getKommoConfig, isKommoConfigured, kommoLeadUrl } from "./config";
import { sendKommoWelcome, sendKommoWhatsApp } from "./dispatch";
import { buildAcessoLiberadoMessage, buildPixPendenteMessage } from "./messages";
import { normalizeBrazilPhoneE164 } from "./phone";
import { setLeadCustomFields, updateLeadStage, upsertLeadFromFunnel } from "./leads";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Aguarda o DP disparar boas-vindas e abrir o canal WPP antes de mover para pendente. */
const WELCOME_DP_DELAY_MS = Number.parseInt(process.env.KOMMO_WELCOME_DP_DELAY_MS ?? "12000", 10) || 12000;

export type KommoUtm = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
};

type KommoLastEvent = "registered" | "pending" | "paid" | "revoked";

async function persistKommoSync(
  usuarioId: number,
  data: {
    kommoLeadId: number;
    kommoContactId?: number | null;
    kommoLastEvent: KommoLastEvent;
    resetReminders?: boolean;
  },
): Promise<void> {
  try {
    await db
      .update(comprasCaktoTable)
      .set({
        kommoLeadId: data.kommoLeadId,
        kommoContactId: data.kommoContactId ?? null,
        kommoLastSyncAt: new Date(),
        kommoLastEvent: data.kommoLastEvent,
        ...(data.resetReminders
          ? { kommoReminder2hSentAt: null, kommoReminder24hSentAt: null }
          : {}),
        atualizadoEm: new Date(),
      })
      .where(eq(comprasCaktoTable.usuarioId, usuarioId));
  } catch {
    /* sync persistence must not break main flow */
  }
}

async function getStoredLeadId(usuarioId: number): Promise<number | null> {
  const [row] = await db
    .select({ kommoLeadId: comprasCaktoTable.kommoLeadId })
    .from(comprasCaktoTable)
    .where(eq(comprasCaktoTable.usuarioId, usuarioId))
    .limit(1);
  return row?.kommoLeadId ?? null;
}

async function getStoredKommoEvent(usuarioId: number): Promise<KommoLastEvent | null> {
  const [row] = await db
    .select({ kommoLastEvent: comprasCaktoTable.kommoLastEvent })
    .from(comprasCaktoTable)
    .where(eq(comprasCaktoTable.usuarioId, usuarioId))
    .limit(1);
  const event = row?.kommoLastEvent;
  if (event === "registered" || event === "pending" || event === "paid" || event === "revoked") {
    return event;
  }
  return null;
}

function registerStatusId(): number {
  const cfg = getKommoConfig();
  return cfg.statusNovoCadastro ?? cfg.statusPagamentoPendente ?? 0;
}

function pendingStatusId(): number | null {
  const cfg = getKommoConfig();
  return cfg.statusPagamentoPendente ?? cfg.statusNovoCadastro;
}

function buildUrls(checkoutToken?: string) {
  const { publicUrl } = getKommoConfig();
  const loginUrl = `${publicUrl}/login`;
  const checkoutUrl = checkoutToken
    ? `${publicUrl}/checkout?token=${encodeURIComponent(checkoutToken)}`
    : undefined;
  return { loginUrl, checkoutUrl };
}

async function syncKommoOnRegisterAsync(
  params: {
    usuarioId: number;
    nome: string;
    email: string;
    telefone: string;
    checkoutToken: string;
    utm?: KommoUtm;
  },
  log?: Logger,
): Promise<void> {
  if (!isKommoConfigured()) {
    log?.debug("Kommo desabilitada ou incompleta — sync register ignorado");
    return;
  }

  const phoneE164 = normalizeBrazilPhoneE164(params.telefone);
  if (!phoneE164) {
    log?.warn({ usuarioId: params.usuarioId }, "Telefone inválido para Kommo — sync ignorado");
    return;
  }

  const cfg = getKommoConfig();
  const statusId = registerStatusId();
  if (!statusId) {
    log?.warn("KOMMO_STATUS_NOVO_CADASTRO ou KOMMO_STATUS_PAGAMENTO_PENDENTE não configurado");
    return;
  }

  const { loginUrl, checkoutUrl } = buildUrls(params.checkoutToken);

  const result = await upsertLeadFromFunnel({
    nome: params.nome,
    email: params.email,
    phoneE164,
    statusId,
    customFields: {
      checkoutUrl,
      loginUrl,
      email: params.email,
      usuarioId: params.usuarioId,
    },
  });

  await persistKommoSync(params.usuarioId, {
    kommoLeadId: result.leadId,
    kommoContactId: result.contactId,
    kommoLastEvent: "registered",
  });

  // Boas-vindas: DP (Novo cadastro) abre o WPP no Lite; API só se welcomeViaDp=false.
  if (cfg.triggerBotsViaApi && result.created) {
    if (cfg.welcomeViaDp) {
      log?.debug(
        { usuarioId: params.usuarioId, kommoLeadId: result.leadId, delayMs: WELCOME_DP_DELAY_MS },
        "Boas-vindas via Digital Pipeline — aguardando antes de mover para pendente",
      );
      await sleep(WELCOME_DP_DELAY_MS);
    } else {
      await sendKommoWelcome(result.leadId, log);
    }
  } else if (cfg.triggerBotsViaApi && !result.created) {
    log?.debug(
      { usuarioId: params.usuarioId, kommoLeadId: result.leadId },
      "Lead Kommo já existia — boas-vindas não reenviada",
    );
  }

  const pendingId = cfg.statusPagamentoPendente;
  if (pendingId && result.created) {
    await updateLeadStage(result.leadId, pendingId);
    await persistKommoSync(params.usuarioId, {
      kommoLeadId: result.leadId,
      kommoContactId: result.contactId,
      kommoLastEvent: "pending",
      resetReminders: true,
    });

    if (cfg.triggerBotsViaApi && checkoutUrl) {
      const pixText = buildPixPendenteMessage({
        nome: params.nome,
        checkoutUrl,
        loginUrl,
        email: params.email,
      });
      await sendKommoWhatsApp({
        leadId: result.leadId,
        contactId: result.contactId,
        text: pixText,
        waitForTalk: true,
        log,
      });
    }

    log?.debug(
      { usuarioId: params.usuarioId, kommoLeadId: result.leadId, statusId: pendingId },
      "Lead em Pagamento pendente — PIX e lembretes via Talks API",
    );
  }

  log?.info(
    {
      usuarioId: params.usuarioId,
      kommoLeadId: result.leadId,
      kommoUrl: kommoLeadUrl(cfg.subdomain, result.leadId),
      utm: params.utm,
      created: result.created,
    },
    "Kommo sync register OK",
  );
}

async function syncKommoOnPaymentPaidAsync(
  params: {
    usuarioId: number;
    nome: string;
    email: string;
    telefone?: string | null;
    checkoutToken?: string;
  },
  log?: Logger,
): Promise<void> {
  if (!isKommoConfigured()) return;

  const cfg = getKommoConfig();
  if (!cfg.statusPago) {
    log?.warn("KOMMO_STATUS_PAGO não configurado");
    return;
  }

  let leadId = await getStoredLeadId(params.usuarioId);
  const { loginUrl, checkoutUrl } = buildUrls(params.checkoutToken);

  if (!leadId && params.telefone) {
    const phoneE164 = normalizeBrazilPhoneE164(params.telefone);
    if (phoneE164) {
      const statusId = pendingStatusId() ?? cfg.statusPago;
      const result = await upsertLeadFromFunnel({
        nome: params.nome,
        email: params.email,
        phoneE164,
        statusId,
        customFields: {
          checkoutUrl,
          loginUrl,
          email: params.email,
          usuarioId: params.usuarioId,
        },
      });
      leadId = result.leadId;
      await persistKommoSync(params.usuarioId, {
        kommoLeadId: result.leadId,
        kommoContactId: result.contactId,
        kommoLastEvent: "paid",
      });
    }
  }

  if (!leadId) {
    log?.warn({ usuarioId: params.usuarioId }, "Lead Kommo não encontrado no pagamento");
    return;
  }

  const previousEvent = await getStoredKommoEvent(params.usuarioId);

  await updateLeadStage(leadId, cfg.statusPago);
  await setLeadCustomFields(leadId, {
    loginUrl,
    checkoutUrl,
    email: params.email,
    usuarioId: params.usuarioId,
  });

  await persistKommoSync(params.usuarioId, {
    kommoLeadId: leadId,
    kommoLastEvent: "paid",
  });

  if (cfg.triggerBotsViaApi && previousEvent !== "paid") {
    const acessoText = buildAcessoLiberadoMessage({
      nome: params.nome,
      checkoutUrl,
      loginUrl,
      email: params.email,
    });
    await sendKommoWhatsApp({
      leadId,
      text: acessoText,
      log,
    });
  } else if (cfg.triggerBotsViaApi && previousEvent === "paid") {
    log?.debug({ usuarioId: params.usuarioId, kommoLeadId: leadId }, "Pagamento já sincronizado — WPP não reenviado");
  }

  log?.info(
    { usuarioId: params.usuarioId, kommoLeadId: leadId, kommoUrl: kommoLeadUrl(cfg.subdomain, leadId) },
    "Kommo sync payment paid OK",
  );
}

async function syncKommoOnAccessRevokedAsync(params: { usuarioId: number }, log?: Logger): Promise<void> {
  if (!isKommoConfigured()) return;

  const cfg = getKommoConfig();
  const leadId = await getStoredLeadId(params.usuarioId);
  if (!leadId) {
    log?.debug({ usuarioId: params.usuarioId }, "Sem lead Kommo para revogar");
    return;
  }

  if (cfg.statusPerdido) {
    await updateLeadStage(leadId, cfg.statusPerdido);
  }

  await persistKommoSync(params.usuarioId, {
    kommoLeadId: leadId,
    kommoLastEvent: "revoked",
  });

  log?.info(
    { usuarioId: params.usuarioId, kommoLeadId: leadId, kommoUrl: kommoLeadUrl(cfg.subdomain, leadId) },
    "Kommo sync access revoked OK",
  );
}

export function syncKommoOnRegister(
  params: {
    usuarioId: number;
    nome: string;
    email: string;
    telefone: string;
    checkoutToken: string;
    utm?: KommoUtm;
  },
  log?: Logger,
): void {
  void syncKommoOnRegisterAsync(params, log).catch((error) => {
    const errMsg = error instanceof Error ? error.message : String(error);
    log?.error({ errMsg, usuarioId: params.usuarioId }, "Falha no sync Kommo (register)");
  });
}

export function syncKommoOnPaymentPaid(
  params: {
    usuarioId: number;
    nome: string;
    email: string;
    telefone?: string | null;
    checkoutToken?: string;
  },
  log?: Logger,
): void {
  void syncKommoOnPaymentPaidAsync(params, log).catch((error) => {
    const errMsg = error instanceof Error ? error.message : String(error);
    log?.error({ errMsg, usuarioId: params.usuarioId }, "Falha no sync Kommo (payment paid)");
  });
}

export function syncKommoOnAccessRevoked(params: { usuarioId: number }, log?: Logger): void {
  void syncKommoOnAccessRevokedAsync(params, log).catch((error) => {
    const errMsg = error instanceof Error ? error.message : String(error);
    log?.error({ errMsg, usuarioId: params.usuarioId }, "Falha no sync Kommo (access revoked)");
  });
}
