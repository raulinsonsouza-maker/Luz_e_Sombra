import { db } from "@workspace/db";
import { integracoesPagamentoTable } from "@workspace/db/schema";
import { desc, eq } from "drizzle-orm";
import { getMpAppConfig } from "./config";

const PROVIDER = "mercadopago";

export async function getConnectedMpIntegration() {
  const [row] = await db
    .select()
    .from(integracoesPagamentoTable)
    .where(eq(integracoesPagamentoTable.provider, PROVIDER))
    .orderBy(desc(integracoesPagamentoTable.atualizadoEm))
    .limit(1);
  if (!row || row.status !== "connected" || !row.accessToken) return null;
  return row;
}

async function exchangeToken(body: Record<string, string>) {
  const res = await fetch("https://api.mercadopago.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as Record<string, unknown>;
  if (!res.ok) {
    const message = typeof data.message === "string" ? data.message : "Falha OAuth Mercado Pago";
    throw new Error(message);
  }
  return data;
}

export async function saveMpTokens(params: {
  accessToken: string;
  refreshToken?: string | null;
  publicKey?: string | null;
  mpUserId?: string | null;
  expiresIn?: number | null;
}) {
  const expiresAt =
    params.expiresIn && Number.isFinite(params.expiresIn)
      ? new Date(Date.now() + Number(params.expiresIn) * 1000)
      : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);

  const existing = await getConnectedMpIntegration();
  const values = {
    provider: PROVIDER,
    accessToken: params.accessToken,
    refreshToken: params.refreshToken ?? null,
    publicKey: params.publicKey ?? existing?.publicKey ?? null,
    mpUserId: params.mpUserId ?? existing?.mpUserId ?? null,
    expiresAt,
    connectedAt: existing?.connectedAt ?? new Date(),
    status: "connected",
    atualizadoEm: new Date(),
  };

  if (existing) {
    const [updated] = await db
      .update(integracoesPagamentoTable)
      .set(values)
      .where(eq(integracoesPagamentoTable.id, existing.id))
      .returning();
    return updated;
  }

  const [created] = await db.insert(integracoesPagamentoTable).values(values).returning();
  return created;
}

export async function disconnectMp() {
  const existing = await getConnectedMpIntegration();
  if (!existing) return;
  await db
    .update(integracoesPagamentoTable)
    .set({
      status: "disconnected",
      accessToken: null,
      refreshToken: null,
      atualizadoEm: new Date(),
    })
    .where(eq(integracoesPagamentoTable.id, existing.id));
}

export async function refreshMpAccessTokenIfNeeded(): Promise<string | null> {
  const integration = await getConnectedMpIntegration();
  if (!integration?.accessToken) return null;

  const expiresAt = integration.expiresAt?.getTime() ?? 0;
  const needsRefresh = !expiresAt || expiresAt - Date.now() < 7 * 24 * 60 * 60 * 1000;
  if (!needsRefresh || !integration.refreshToken) {
    return integration.accessToken;
  }

  const cfg = getMpAppConfig();
  if (!cfg.configured) return integration.accessToken;

  try {
    const data = await exchangeToken({
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      grant_type: "refresh_token",
      refresh_token: integration.refreshToken,
    });
    const accessToken = String(data.access_token ?? "");
    if (!accessToken) return integration.accessToken;
    await saveMpTokens({
      accessToken,
      refreshToken: typeof data.refresh_token === "string" ? data.refresh_token : integration.refreshToken,
      publicKey: integration.publicKey,
      mpUserId: integration.mpUserId,
      expiresIn: typeof data.expires_in === "number" ? data.expires_in : null,
    });
    return accessToken;
  } catch {
    return integration.accessToken;
  }
}

export async function exchangeAuthorizationCode(params: {
  code: string;
  codeVerifier?: string | null;
}) {
  const cfg = getMpAppConfig();
  if (!cfg.configured) throw new Error("MP_CLIENT_ID/MP_CLIENT_SECRET não configurados");

  const body: Record<string, string> = {
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
    grant_type: "authorization_code",
    code: params.code,
    redirect_uri: cfg.redirectUri,
  };
  if (params.codeVerifier) body.code_verifier = params.codeVerifier;

  const data = await exchangeToken(body);
  const accessToken = String(data.access_token ?? "");
  if (!accessToken) throw new Error("OAuth sem access_token");

  let publicKey: string | null = null;
  let mpUserId: string | null =
    data.user_id != null ? String(data.user_id) : null;

  try {
    const meRes = await fetch("https://api.mercadopago.com/users/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (meRes.ok) {
      const me = (await meRes.json()) as Record<string, unknown>;
      if (me.id != null) mpUserId = String(me.id);
    }
  } catch {
    /* opcional */
  }

  // Public key: apps do vendedor costumam expor via /v1/applications ou credentials no painel.
  // Tentamos endpoint de credentials do usuário.
  try {
    const credRes = await fetch("https://api.mercadopago.com/users/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (credRes.ok) {
      const me = (await credRes.json()) as { id?: number };
      if (me.id) mpUserId = String(me.id);
    }
  } catch {
    /* ignore */
  }

  // Fallback: env VITE/MP_PUBLIC_KEY se o OAuth não devolver
  publicKey = process.env.MP_PUBLIC_KEY?.trim() || null;

  await saveMpTokens({
    accessToken,
    refreshToken: typeof data.refresh_token === "string" ? data.refresh_token : null,
    publicKey,
    mpUserId,
    expiresIn: typeof data.expires_in === "number" ? data.expires_in : null,
  });

  return { accessToken, mpUserId, publicKey };
}

export { exchangeToken };
