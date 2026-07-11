import { Resend } from "resend";
import { db } from "@workspace/db";
import { emailEnviosTable } from "@workspace/db/schema";
import { getEmailConfig, isEmailConfigured } from "./config";
import type { SendTransactionalEmailParams } from "./types";
import {
  checkoutWelcomeEmail,
  accessGrantedEmail,
  accessRevokedEmail,
  passwordResetEmail,
  passwordChangedEmail,
} from "./templates";
import type { Logger } from "pino";

let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    const { apiKey } = getEmailConfig();
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

async function logEmailEnvio(params: {
  usuarioId?: number | null;
  destinatario: string;
  template: string;
  assunto: string;
  status: "sent" | "failed" | "skipped";
  resendId?: string | null;
  erro?: string | null;
  meta?: Record<string, unknown>;
}): Promise<void> {
  try {
    await db.insert(emailEnviosTable).values({
      usuarioId: params.usuarioId ?? null,
      destinatario: params.destinatario,
      template: params.template,
      assunto: params.assunto,
      status: params.status,
      resendId: params.resendId ?? null,
      erro: params.erro ?? null,
      meta: params.meta ?? null,
    });
  } catch {
    /* logging must not break main flow */
  }
}

export async function sendTransactionalEmail(
  params: SendTransactionalEmailParams,
  log?: Logger,
): Promise<void> {
  const config = getEmailConfig();

  if (!isEmailConfigured()) {
    await logEmailEnvio({
      usuarioId: params.usuarioId,
      destinatario: params.to,
      template: params.template,
      assunto: params.subject,
      status: "skipped",
      meta: { reason: "email_disabled_or_missing_api_key", ...params.meta },
    });
    log?.warn({ template: params.template, to: params.to }, "E-mail ignorado (EMAIL_ENABLED ou API key ausente)");
    return;
  }

  try {
    const result = await getResend().emails.send({
      from: config.from,
      to: params.to,
      subject: params.subject,
      html: params.html,
      replyTo: config.replyTo,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }

    await logEmailEnvio({
      usuarioId: params.usuarioId,
      destinatario: params.to,
      template: params.template,
      assunto: params.subject,
      status: "sent",
      resendId: result.data?.id ?? null,
      meta: params.meta,
    });
    log?.info({ template: params.template, to: params.to, resendId: result.data?.id }, "E-mail enviado");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await logEmailEnvio({
      usuarioId: params.usuarioId,
      destinatario: params.to,
      template: params.template,
      assunto: params.subject,
      status: "failed",
      erro: message,
      meta: params.meta,
    });
    log?.error({ error, template: params.template, to: params.to }, "Falha ao enviar e-mail");
  }
}

export function sendCheckoutWelcomeEmail(
  params: { usuarioId: number; nome: string; email: string; checkoutToken: string },
  log?: Logger,
): void {
  const { publicUrl } = getEmailConfig();
  const checkoutUrl = `${publicUrl}/checkout?token=${encodeURIComponent(params.checkoutToken)}`;
  const loginUrl = `${publicUrl}/login`;
  const { subject, html } = checkoutWelcomeEmail({ nome: params.nome, checkoutUrl, loginUrl });

  void sendTransactionalEmail(
    {
      to: params.email,
      subject,
      html,
      template: "checkout_welcome",
      usuarioId: params.usuarioId,
      meta: { checkoutToken: params.checkoutToken },
    },
    log,
  );
}

export function sendAccessGrantedEmail(
  params: { usuarioId: number; nome: string; email: string },
  log?: Logger,
): void {
  const { publicUrl } = getEmailConfig();
  const { subject, html } = accessGrantedEmail({
    nome: params.nome,
    email: params.email,
    loginUrl: `${publicUrl}/login`,
    jornadaUrl: `${publicUrl}/jornada/traco`,
  });

  void sendTransactionalEmail(
    {
      to: params.email,
      subject,
      html,
      template: "access_granted",
      usuarioId: params.usuarioId,
    },
    log,
  );
}

export function sendAccessRevokedEmail(
  params: { usuarioId: number; nome: string; email: string },
  log?: Logger,
): void {
  const { replyTo } = getEmailConfig();
  const suporteEmail = replyTo ?? "contato@portaliluminando.com.br";
  const { subject, html } = accessRevokedEmail({ nome: params.nome, suporteEmail });

  void sendTransactionalEmail(
    {
      to: params.email,
      subject,
      html,
      template: "access_revoked",
      usuarioId: params.usuarioId,
    },
    log,
  );
}

export function sendPasswordResetEmail(
  params: { usuarioId: number; nome: string; email: string; token: string },
  log?: Logger,
): void {
  const { publicUrl } = getEmailConfig();
  const resetUrl = `${publicUrl}/redefinir-senha?token=${encodeURIComponent(params.token)}`;
  const { subject, html } = passwordResetEmail({ nome: params.nome, resetUrl });

  void sendTransactionalEmail(
    {
      to: params.email,
      subject,
      html,
      template: "password_reset",
      usuarioId: params.usuarioId,
    },
    log,
  );
}

export function sendPasswordChangedEmail(
  params: { usuarioId: number; nome: string; email: string },
  log?: Logger,
): void {
  const { publicUrl } = getEmailConfig();
  const { subject, html } = passwordChangedEmail({
    nome: params.nome,
    loginUrl: `${publicUrl}/login`,
  });

  void sendTransactionalEmail(
    {
      to: params.email,
      subject,
      html,
      template: "password_changed",
      usuarioId: params.usuarioId,
    },
    log,
  );
}
