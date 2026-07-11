export function getEmailConfig() {
  const enabled = process.env.EMAIL_ENABLED === "true";
  const apiKey = process.env.RESEND_API_KEY ?? "";
  const from =
    process.env.EMAIL_FROM ?? "Portal Iluminando <onboarding@resend.dev>";
  const replyTo = process.env.EMAIL_REPLY_TO ?? undefined;
  const publicUrl = (process.env.APP_PUBLIC_URL ?? "https://portaliluminando.com.br").replace(
    /\/$/,
    "",
  );
  return { enabled, apiKey, from, replyTo, publicUrl };
}

export function isEmailConfigured(): boolean {
  const { enabled, apiKey } = getEmailConfig();
  return enabled && apiKey.length > 0;
}
