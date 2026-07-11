import type { Logger } from "pino";
import { getEmailConfig } from "./config";
import { sendTransactionalEmail } from "./mailer";
import { paymentPendingReminderEmail, journeyNudgeEmail } from "./templates";

export async function sendPaymentPendingReminderEmail(
  params: { usuarioId: number; nome: string; email: string; checkoutToken: string },
  log?: Logger,
): Promise<void> {
  const { publicUrl } = getEmailConfig();
  const checkoutUrl = `${publicUrl}/checkout?token=${encodeURIComponent(params.checkoutToken)}`;
  const { subject, html } = paymentPendingReminderEmail({
    nome: params.nome,
    checkoutUrl,
  });

  await sendTransactionalEmail(
    {
      to: params.email,
      subject,
      html,
      template: "payment_pending_reminder",
      usuarioId: params.usuarioId,
      meta: { checkoutToken: params.checkoutToken },
    },
    log,
  );
}

export async function sendJourneyNudgeEmail(
  params: {
    usuarioId: number;
    nome: string;
    email: string;
    moduloTitulo: string;
    jornadaUrl: string;
  },
  log?: Logger,
): Promise<void> {
  const { publicUrl } = getEmailConfig();
  const href = params.jornadaUrl.startsWith("http")
    ? params.jornadaUrl
    : `${publicUrl}${params.jornadaUrl}`;
  const { subject, html } = journeyNudgeEmail({
    nome: params.nome,
    moduloTitulo: params.moduloTitulo,
    jornadaUrl: href,
  });

  await sendTransactionalEmail(
    {
      to: params.email,
      subject,
      html,
      template: "journey_nudge",
      usuarioId: params.usuarioId,
    },
    log,
  );
}
