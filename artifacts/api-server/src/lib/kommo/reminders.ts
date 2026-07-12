import { db } from "@workspace/db";
import { comprasCaktoTable, usuariosTable } from "@workspace/db/schema";
import { and, eq, isNotNull } from "drizzle-orm";
import type { Logger } from "pino";
import { logger } from "../logger";
import { getKommoConfig, isKommoConfigured } from "./config";
import { sendKommoWhatsApp } from "./dispatch";
import { buildPixLembrete24hMessage, buildPixLembrete2hMessage } from "./messages";

function hoursToMs(hours: number): number {
  return hours * 60 * 60 * 1000;
}

function buildCheckoutUrl(checkoutToken: string): string {
  const { publicUrl } = getKommoConfig();
  return `${publicUrl}/checkout?token=${encodeURIComponent(checkoutToken)}`;
}

export async function runKommoPixReminders(log: Logger = logger): Promise<{ sent2h: number; sent24h: number }> {
  if (!isKommoConfigured()) {
    return { sent2h: 0, sent24h: 0 };
  }

  const cfg = getKommoConfig();
  if (!cfg.useTalksApi || !cfg.reminderCronEnabled) {
    return { sent2h: 0, sent24h: 0 };
  }

  const now = Date.now();
  const threshold2h = now - hoursToMs(cfg.reminder2hHours);
  const threshold24h = now - hoursToMs(cfg.reminder24hHours);

  const rows = await db
    .select({
      compraId: comprasCaktoTable.id,
      usuarioId: comprasCaktoTable.usuarioId,
      checkoutToken: comprasCaktoTable.checkoutToken,
      kommoLeadId: comprasCaktoTable.kommoLeadId,
      kommoContactId: comprasCaktoTable.kommoContactId,
      kommoLastSyncAt: comprasCaktoTable.kommoLastSyncAt,
      kommoReminder2hSentAt: comprasCaktoTable.kommoReminder2hSentAt,
      kommoReminder24hSentAt: comprasCaktoTable.kommoReminder24hSentAt,
      nome: usuariosTable.nome,
      email: usuariosTable.email,
    })
    .from(comprasCaktoTable)
    .innerJoin(usuariosTable, eq(comprasCaktoTable.usuarioId, usuariosTable.id))
    .where(
      and(
        eq(comprasCaktoTable.status, "pending"),
        eq(comprasCaktoTable.kommoLastEvent, "pending"),
        isNotNull(comprasCaktoTable.kommoLeadId),
        isNotNull(comprasCaktoTable.kommoLastSyncAt),
      ),
    );

  let sent2h = 0;
  let sent24h = 0;

  for (const row of rows) {
    const leadId = row.kommoLeadId;
    const pendingSince = row.kommoLastSyncAt?.getTime();
    if (!leadId || !pendingSince) continue;

    const checkoutUrl = buildCheckoutUrl(row.checkoutToken);
    const ctx = { nome: row.nome, checkoutUrl, email: row.email ?? undefined };

    if (!row.kommoReminder2hSentAt && pendingSince <= threshold2h) {
      try {
        await sendKommoWhatsApp({
          leadId,
          contactId: row.kommoContactId,
          text: buildPixLembrete2hMessage(ctx),
          log,
        });
        await db
          .update(comprasCaktoTable)
          .set({ kommoReminder2hSentAt: new Date(), atualizadoEm: new Date() })
          .where(eq(comprasCaktoTable.id, row.compraId));
        sent2h++;
        log.info({ usuarioId: row.usuarioId, kommoLeadId: leadId }, "Lembrete PIX 2h enviado via Talks API");
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        log.error({ errMsg, usuarioId: row.usuarioId, kommoLeadId: leadId }, "Falha lembrete PIX 2h");
      }
    }

    if (!row.kommoReminder24hSentAt && pendingSince <= threshold24h) {
      try {
        await sendKommoWhatsApp({
          leadId,
          contactId: row.kommoContactId,
          text: buildPixLembrete24hMessage(ctx),
          log,
        });
        await db
          .update(comprasCaktoTable)
          .set({ kommoReminder24hSentAt: new Date(), atualizadoEm: new Date() })
          .where(eq(comprasCaktoTable.id, row.compraId));
        sent24h++;
        log.info({ usuarioId: row.usuarioId, kommoLeadId: leadId }, "Lembrete PIX 24h enviado via Talks API");
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        log.error({ errMsg, usuarioId: row.usuarioId, kommoLeadId: leadId }, "Falha lembrete PIX 24h");
      }
    }
  }

  if (sent2h > 0 || sent24h > 0) {
    log.info({ sent2h, sent24h }, "Cron lembretes PIX Kommo concluído");
  }

  return { sent2h, sent24h };
}

let cronTimer: ReturnType<typeof setInterval> | null = null;
let cronRunning = false;

export function startKommoReminderCron(log: Logger = logger): void {
  if (cronTimer) return;

  const cfg = getKommoConfig();
  if (!isKommoConfigured() || !cfg.reminderCronEnabled || !cfg.useTalksApi) {
    log.debug("Cron lembretes PIX Kommo desabilitado");
    return;
  }

  const tick = () => {
    if (cronRunning) return;
    cronRunning = true;
    void runKommoPixReminders(log)
      .catch((error) => {
        const errMsg = error instanceof Error ? error.message : String(error);
        log.error({ errMsg }, "Erro no cron lembretes PIX Kommo");
      })
      .finally(() => {
        cronRunning = false;
      });
  };

  tick();
  cronTimer = setInterval(tick, cfg.reminderCronIntervalMs);
  log.info(
    { intervalMs: cfg.reminderCronIntervalMs, reminder2hHours: cfg.reminder2hHours, reminder24hHours: cfg.reminder24hHours },
    "Cron lembretes PIX Kommo iniciado",
  );
}

export function stopKommoReminderCron(): void {
  if (cronTimer) {
    clearInterval(cronTimer);
    cronTimer = null;
  }
}

/** Para testes: força envio de lembretes elegíveis ignorando thresholds (usa 0h). */
export async function runKommoPixRemindersForced(log: Logger = logger): Promise<{ sent2h: number; sent24h: number }> {
  const prev2h = process.env.KOMMO_REMINDER_2H_HOURS;
  const prev24h = process.env.KOMMO_REMINDER_24H_HOURS;
  process.env.KOMMO_REMINDER_2H_HOURS = "0";
  process.env.KOMMO_REMINDER_24H_HOURS = "0";
  try {
    return await runKommoPixReminders(log);
  } finally {
    if (prev2h === undefined) delete process.env.KOMMO_REMINDER_2H_HOURS;
    else process.env.KOMMO_REMINDER_2H_HOURS = prev2h;
    if (prev24h === undefined) delete process.env.KOMMO_REMINDER_24H_HOURS;
    else process.env.KOMMO_REMINDER_24H_HOURS = prev24h;
  }
}
