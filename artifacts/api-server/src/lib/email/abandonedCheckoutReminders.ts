import { db } from "@workspace/db";
import { comprasMpTable, usuariosTable } from "@workspace/db/schema";
import { and, eq, isNull, lt } from "drizzle-orm";
import type { Logger } from "pino";
import { logger } from "../logger";
import { sendPaymentPendingReminderEmail } from "./retention";

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;
const CRON_INTERVAL_MS = 5 * 60 * 1000;

export async function runAbandonedCheckoutEmailReminders(
  log: Logger = logger,
): Promise<{ sent2h: number; sent24h: number }> {
  const now = Date.now();
  const threshold2h = new Date(now - TWO_HOURS_MS);
  const threshold24h = new Date(now - TWENTY_FOUR_HOURS_MS);

  const rows = await db
    .select({
      compraId: comprasMpTable.id,
      checkoutToken: comprasMpTable.checkoutToken,
      criadoEm: comprasMpTable.criadoEm,
      emailReminder2hSentAt: comprasMpTable.emailReminder2hSentAt,
      emailReminder24hSentAt: comprasMpTable.emailReminder24hSentAt,
      usuarioId: usuariosTable.id,
      nome: usuariosTable.nome,
      email: usuariosTable.email,
      statusAcesso: usuariosTable.statusAcesso,
    })
    .from(comprasMpTable)
    .innerJoin(usuariosTable, eq(comprasMpTable.usuarioId, usuariosTable.id))
    .where(
      and(
        eq(comprasMpTable.status, "pending"),
        eq(usuariosTable.statusAcesso, "pending"),
        lt(comprasMpTable.criadoEm, threshold2h),
      ),
    );

  let sent2h = 0;
  let sent24h = 0;

  for (const row of rows) {
    if (!row.email) continue;
    const created = row.criadoEm?.getTime() ?? 0;
    let sent2hLocal = Boolean(row.emailReminder2hSentAt);

    if (!sent2hLocal && created <= threshold2h.getTime()) {
      try {
        await sendPaymentPendingReminderEmail(
          {
            usuarioId: row.usuarioId,
            nome: row.nome,
            email: row.email,
            checkoutToken: row.checkoutToken,
          },
          log,
        );
        await db
          .update(comprasMpTable)
          .set({
            emailReminder2hSentAt: new Date(),
            emailPendingReminderSentAt: new Date(),
            atualizadoEm: new Date(),
          })
          .where(eq(comprasMpTable.id, row.compraId));
        sent2hLocal = true;
        sent2h++;
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        log.error({ errMsg, usuarioId: row.usuarioId }, "Falha lembrete e-mail abandono 2h");
      }
    }

    if (!row.emailReminder24hSentAt && created <= threshold24h.getTime() && sent2hLocal) {
      try {
        await sendPaymentPendingReminderEmail(
          {
            usuarioId: row.usuarioId,
            nome: row.nome,
            email: row.email,
            checkoutToken: row.checkoutToken,
          },
          log,
        );
        await db
          .update(comprasMpTable)
          .set({
            emailReminder24hSentAt: new Date(),
            emailReminder2hSentAt: new Date(),
            atualizadoEm: new Date(),
          })
          .where(eq(comprasMpTable.id, row.compraId));
        sent24h++;
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error);
        log.error({ errMsg, usuarioId: row.usuarioId }, "Falha lembrete e-mail abandono 24h");
      }
    }
  }

  if (sent2h > 0 || sent24h > 0) {
    log.info({ sent2h, sent24h }, "Cron lembretes e-mail abandono concluído");
  }

  return { sent2h, sent24h };
}

/** Marca dedup do lembrete imediato pós-PIX (evita spam a cada retry). */
export async function markImmediatePendingReminderSent(checkoutToken: string): Promise<void> {
  await db
    .update(comprasMpTable)
    .set({ emailPendingReminderSentAt: new Date(), atualizadoEm: new Date() })
    .where(
      and(
        eq(comprasMpTable.checkoutToken, checkoutToken),
        isNull(comprasMpTable.emailPendingReminderSentAt),
      ),
    );
}

export async function wasImmediatePendingReminderSent(checkoutToken: string): Promise<boolean> {
  const [row] = await db
    .select({ sent: comprasMpTable.emailPendingReminderSentAt })
    .from(comprasMpTable)
    .where(eq(comprasMpTable.checkoutToken, checkoutToken))
    .limit(1);
  return Boolean(row?.sent);
}

let cronTimer: ReturnType<typeof setInterval> | null = null;
let cronRunning = false;

export function startAbandonedCheckoutEmailCron(log: Logger = logger): void {
  if (cronTimer) return;
  const tick = async () => {
    if (cronRunning) return;
    cronRunning = true;
    try {
      await runAbandonedCheckoutEmailReminders(log);
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      log.error({ errMsg }, "Erro no cron lembretes e-mail abandono");
    } finally {
      cronRunning = false;
    }
  };
  void tick();
  cronTimer = setInterval(tick, CRON_INTERVAL_MS);
  log.info({ intervalMs: CRON_INTERVAL_MS }, "Cron lembretes e-mail abandono iniciado");
}
