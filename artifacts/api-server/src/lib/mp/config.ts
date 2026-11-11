export function getMpAppConfig() {
  const clientId = process.env.MP_CLIENT_ID?.trim() || "";
  const clientSecret = process.env.MP_CLIENT_SECRET?.trim() || "";
  const publicUrl = (process.env.APP_PUBLIC_URL || "http://localhost:8080").replace(/\/$/, "");
  const redirectUri =
    process.env.MP_REDIRECT_URI?.trim() ||
    `${publicUrl}/api/admin/mercadopago/oauth/callback`;
  return {
    clientId,
    clientSecret,
    redirectUri,
    publicUrl,
    configured: Boolean(clientId && clientSecret),
  };
}
