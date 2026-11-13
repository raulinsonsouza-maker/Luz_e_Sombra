import { db } from "@workspace/db";
import { comprasMpTable, usuariosTable } from "@workspace/db/schema";
import { and, eq, isNull, lt, or } from "drizzle-orm";
import type { Logger } from "pino";
import { logger } from "../logger";
import { getWhatsAppConfig, isWhatsAppConfigured } from "./config";
import { sendWhatsAppTemplate } from "./client";
import { firstNameFromFullName, toWhatsAppRecipient } from "./phone";
import { WA_TEMPLATES } from "./templates";

function hoursToMs(hours: number): number {
  return hours * 60 * 60 * 1000;
}

function buildCheckoutUrl(checkoutToken: string): string {
  const { publicUrl } = getWhatsAppConfig();
  return `${publicUrl}/checkout?token=${encodeURIComponent(checkoutToken)}`;
}

export async function runWhatsAppCheckoutReminders(
  log: Logger = logger,
): Promise<{ sent2h: number; sent24h: number }> {
  if (!isWhatsAppConfigured()) {
    return { sent2h: 0, sent24h: 0 };
  }

  const cfg = getWhatsAppConfig();
  if (!cfg.reminderCronEnabled) {
    return { sent2h: 0, sent24h: 0 };
  }

  const now = Date.now();
  const threshold2h = new Date(now - hoursToMs(cfg.reminder2hHours));
  const threshold24h = new Date(now - hoursToMs(cfg.reminder24hHours));

  const rows = await db
    .select({
      compraId: comprasMpTable.id,
      checkoutToken: comprasMpTable.checkoutToken,
      criadoEm: comprasMpTable.criadoEm,
      waReminder2hSentAt: comprasMpTable.waReminder2hSentAt,
      waReminder24hSentAt: comprasMpTable.waReminder24hSentAt,
      usuarioId: usuariosTable.id,
      nome: usuariosTable.nome,
      telefone: usuariosTable.telefone,
      optOut: usuariosTable.whatsappOptOut,
    })
    .from(comprasMpTable)
    .innerJoin(usuariosTable, eq(comprasMpTable.usuarioId, usuariosTable.id))
    .where(
      and(
        eq(comprasMpTable.status, "pending"),
        eq(usuariosTable.statusAcesso, "pending"),
        eq(usuariosTable.whatsappOptOut, false),
        lt(comprasMpTable.criadoEm, threshold2h),
        or(isNull(comprasMpTable.waReminder2hSentAt), isNull(comprasMpTable.waReminder24hSentAt)),
      ),
    );

  let sent2h = 0;
  let sent24h = 0;

  for (const row of rows) {
    const to = toWhatsAppRecipient(row.telefone);
    if (!to || row.optOut) continue;

    const created = row.criadoEm?.getTime() ?? 0;
    const checkoutUrl = buildCheckoutUrl(row.checkoutToken);
    const name = firstNameFromFullName(row.nome);

    if (!row.waReminder2hSentAt && created <= threshold2h.getTime()) {
      try {
        await sendWhatsAppTemplate({
          to,
          template: WA_TEMPLATES.lembrete2h,
          bodyParams: [name, checkoutUrl],
          log,
        });
        await db
          .update(comprasMpTable)
          .set({ waReminder2hSentAt: new Date(), atualizadoEm: new Date() })
          .where(eq(comprasMpTable.id, row.compraId));
        sent2h++;
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        log.error({ errMsg, usuarioId: row.usuarioId }, "Falha lembrete WhatsApp 2h");
      }
    }

    const sent2hLocal = Boolean(row.waReminder2hSentAt) || created <= threshold2h.getTime();
    if (!row.waReminder24hSentAt && created <= threshold24h.getTime() && (row.waReminder2hSentAt || sent2hLocal)) {
      // Re-check flag after possible 2h update
      const [fresh] = await db
        .select({
          wa2: comprasMpTable.waReminder2hSentAt,
          wa24: comprasMpTable.waReminder24hSentAt,
        })
        .from(comprasMpTable)
        .where(eq(comprasMpTable.id, row.compraId))
        .limit(1);
      if (fresh?.wa24) continue;
      if (!fresh?.wa2 && !row.waReminder2hSentAt) continue;

      try {
        await sendWhatsAppTemplate({
          to,
          template: WA_TEMPLATES.lembrete24h,
          bodyParams: [name, checkoutUrl],
          log,
        });
        await db
          .update(comprasMpTable)
          .set({
            waReminder24hSentAt: new Date(),
            waReminder2hSentAt: fresh?.wa2 ?? new Date(),
            atualizadoEm: new Date(),
          })
          .where(eq(comprasMpTable.id, row.compraId));
        sent24h++;
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        log.error({ errMsg, usuarioId: row.usuarioId }, "Falha lembrete WhatsApp 24h");
      }
    }
  }

  if (sent2h > 0 || sent24h > 0) {
    log.info({ sent2h, sent24h }, "Cron lembretes WhatsApp abandono concluído");
  }

  return { sent2h, sent24h };
}

let cronTimer: ReturnType<typeof setInterval> | null = null;
let cronRunning = false;

export function startWhatsAppReminderCron(log: Logger = logger): void {
  if (cronTimer) return;

  const cfg = getWhatsAppConfig();
  if (!isWhatsAppConfigured() || !cfg.reminderCronEnabled) {
    log.debug("Cron lembretes WhatsApp desabilitado");
    return;
  }

  const tick = () => {
    if (cronRunning) return;
    cronRunning = true;
    void runWhatsAppCheckoutReminders(log)
      .catch((error) => {
        const errMsg = error instanceof Error ? error.message : String(error);
        log.error({ errMsg }, "Erro no cron lembretes WhatsApp");
      })
      .finally(() => {
        cronRunning = false;
      });
  };

  tick();
  cronTimer = setInterval(tick, cfg.reminderCronIntervalMs);
  log.info(
    {
      intervalMs: cfg.reminderCronIntervalMs,
      reminder2hHours: cfg.reminder2hHours,
      reminder24hHours: cfg.reminder24hHours,
    },
    "Cron lembretes WhatsApp iniciado",
  );
}

export function stopWhatsAppReminderCron(): void {
  if (cronTimer) {
    clearInterval(cronTimer);
    cronTimer = null;
  }
}
