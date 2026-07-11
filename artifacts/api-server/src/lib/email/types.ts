export type EmailTemplateId =
  | "checkout_welcome"
  | "access_granted"
  | "access_revoked"
  | "password_reset"
  | "password_changed"
  | "payment_pending_reminder"
  | "journey_nudge";

export type EmailSendStatus = "sent" | "failed" | "skipped";

export interface SendTransactionalEmailParams {
  to: string;
  subject: string;
  html: string;
  template: EmailTemplateId;
  usuarioId?: number | null;
  meta?: Record<string, unknown>;
}
