import { randomBytes, createHash } from "node:crypto";
import { Router, Response } from "express";
import { db } from "@workspace/db";
import { mpOauthStatesTable } from "@workspace/db/schema";
import { and, eq, gt } from "drizzle-orm";
import { requireAdmin, type AuthRequest } from "../../lib/authMiddleware";
import { getMpAppConfig } from "../../lib/mp/config";
import {
  disconnectMp,
  exchangeAuthorizationCode,
  getConnectedMpIntegration,
  saveMpTokens,
} from "../../lib/mp/tokens";
import { countFundadoresPaid } from "../../lib/acesso/activateMpPurchase";
import { FUNDADORES_CAP } from "../../lib/acesso/periodo";

const router = Router();

function base64Url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// GET /api/admin/mercadopago/status
router.get("/status", requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const cfg = getMpAppConfig();
    const integration = await getConnectedMpIntegration();
    const fundadores = await countFundadoresPaid();
    return res.json({
      appConfigured: cfg.configured,
      redirectUri: cfg.redirectUri,
      connected: Boolean(integration),
      mpUserId: integration?.mpUserId ?? null,
      publicKeyConfigured: Boolean(integration?.publicKey || process.env.MP_PUBLIC_KEY),
      expiresAt: integration?.expiresAt?.toISOString() ?? null,
      connectedAt: integration?.connectedAt?.toISOString() ?? null,
      fundadoresPaid: fundadores,
      fundadoresCap: FUNDADORES_CAP,
      fundadoresRestantes: Math.max(0, FUNDADORES_CAP - fundadores),
      edicaoEspecialAtiva: fundadores < FUNDADORES_CAP,
    });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao consultar status Mercado Pago" });
  }
});

// GET /api/admin/mercadopago/oauth/start
router.get("/oauth/start", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const cfg = getMpAppConfig();
    if (!cfg.configured) {
      return res.status(400).json({
        error: "Configure MP_CLIENT_ID e MP_CLIENT_SECRET no servidor.",
      });
    }

    const state = base64Url(randomBytes(24));
    const codeVerifier = base64Url(randomBytes(32));
    const codeChallenge = base64Url(createHash("sha256").update(codeVerifier).digest());
    const expiraEm = new Date(Date.now() + 15 * 60 * 1000);

    await db.insert(mpOauthStatesTable).values({
      state,
      codeVerifier,
      expiraEm,
    });

    const url = new URL("https://auth.mercadopago.com/authorization");
    url.searchParams.set("client_id", cfg.clientId);
    url.searchParams.set("response_type", "code");
    url.searchParams.set("platform_id", "mp");
    url.searchParams.set("state", state);
    url.searchParams.set("redirect_uri", cfg.redirectUri);
    url.searchParams.set("code_challenge", codeChallenge);
    url.searchParams.set("code_challenge_method", "S256");

    return res.json({ url: url.toString() });
  } catch (error) {
    req.log?.error({ error }, "Erro ao iniciar OAuth MP");
    return res.status(500).json({ error: "Erro ao iniciar conexão Mercado Pago" });
  }
});

// GET /api/admin/mercadopago/oauth/callback
router.get("/oauth/callback", async (req: AuthRequest, res: Response) => {
  const cfg = getMpAppConfig();
  const code = String(req.query.code ?? "").trim();
  const state = String(req.query.state ?? "").trim();
  const errorParam = String(req.query.error ?? "").trim();

  const redirectOk = `${cfg.publicUrl}/admin?aba=pagamentos&mp=connected`;
  const redirectFail = `${cfg.publicUrl}/admin?aba=pagamentos&mp=error`;

  try {
    if (errorParam || !code || !state) {
      return res.redirect(redirectFail);
    }

    const [oauthState] = await db
      .select()
      .from(mpOauthStatesTable)
      .where(
        and(
          eq(mpOauthStatesTable.state, state),
          eq(mpOauthStatesTable.usado, false),
          gt(mpOauthStatesTable.expiraEm, new Date()),
        ),
      )
      .limit(1);

    if (!oauthState) {
      return res.redirect(redirectFail);
    }

    await db
      .update(mpOauthStatesTable)
      .set({ usado: true })
      .where(eq(mpOauthStatesTable.id, oauthState.id));

    await exchangeAuthorizationCode({
      code,
      codeVerifier: oauthState.codeVerifier,
    });

    return res.redirect(redirectOk);
  } catch (error) {
    req.log?.error({ error }, "Erro no callback OAuth MP");
    return res.redirect(redirectFail);
  }
});

// POST /api/admin/mercadopago/disconnect
router.post("/disconnect", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    await disconnectMp();
    return res.json({ ok: true });
  } catch (error) {
    req.log?.error({ error }, "Erro ao desconectar MP");
    return res.status(500).json({ error: "Erro ao desconectar Mercado Pago" });
  }
});

// POST /api/admin/mercadopago/public-key — permite colar public_key no admin
router.post("/public-key", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const publicKey = String(req.body?.publicKey ?? "").trim();
    if (!publicKey) return res.status(400).json({ error: "publicKey obrigatória" });
    const integration = await getConnectedMpIntegration();
    if (!integration) {
      return res.status(400).json({ error: "Conecte o Mercado Pago antes de salvar a public key." });
    }
    await saveMpTokens({
      accessToken: integration.accessToken!,
      refreshToken: integration.refreshToken,
      publicKey,
      mpUserId: integration.mpUserId,
    });
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao salvar public key" });
  }
});

/**
 * Conta própria: cola Access Token + Public Key de produção/teste
 * (Credenciais de produção da app no Developers).
 */
router.post("/credentials", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const accessToken = String(req.body?.accessToken ?? "").trim();
    const publicKey = String(req.body?.publicKey ?? "").trim();
    if (!accessToken || !publicKey) {
      return res.status(400).json({ error: "accessToken e publicKey são obrigatórios" });
    }
    if (!accessToken.startsWith("APP_USR-") && !accessToken.startsWith("TEST-")) {
      return res.status(400).json({ error: "Access Token inválido" });
    }
    if (!publicKey.startsWith("APP_USR-") && !publicKey.startsWith("TEST-")) {
      return res.status(400).json({ error: "Public Key inválida" });
    }

    let mpUserId: string | null = null;
    try {
      const meRes = await fetch("https://api.mercadopago.com/users/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (meRes.ok) {
        const me = (await meRes.json()) as { id?: number };
        if (me.id != null) mpUserId = String(me.id);
      } else {
        return res.status(400).json({ error: "Access Token rejeitado pelo Mercado Pago" });
      }
    } catch {
      return res.status(400).json({ error: "Não foi possível validar o Access Token" });
    }

    await saveMpTokens({
      accessToken,
      publicKey,
      mpUserId,
      refreshToken: null,
      expiresIn: 180 * 24 * 60 * 60,
    });

    return res.json({ ok: true, mpUserId });
  } catch (error) {
    req.log?.error({ error }, "Erro ao salvar credenciais MP");
    return res.status(500).json({ error: "Erro ao salvar credenciais" });
  }
});

export default router;
