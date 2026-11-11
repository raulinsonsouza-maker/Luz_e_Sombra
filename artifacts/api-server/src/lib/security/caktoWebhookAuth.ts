/** Secret Cakto só por header; nunca aceitar webhook sem secret configurado. */
export function verifyCaktoWebhookSecret(
  headerSecret: string | undefined,
  configuredSecret: string,
): boolean {
  const secret = configuredSecret.trim();
  if (!secret) return false;
  if (!headerSecret) return false;
  return headerSecret === secret;
}
