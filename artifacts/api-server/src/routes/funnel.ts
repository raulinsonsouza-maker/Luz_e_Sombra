import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { Router, Request, Response } from "express";
import { db } from "@workspace/db";
import {
  usuariosTable,
  comprasCaktoTable,
  comprasMpTable,
  gamificacaoTable,
} from "@workspace/db/schema";
import { desc, eq } from "drizzle-orm";
import { parseBody, funnelRegisterSchema } from "../lib/schemas";
import { signToken } from "./auth";
import { sendCheckoutWelcomeEmail } from "../lib/email";
import { syncKommoOnRegister } from "../lib/kommo";
import { nextPurchaseVariant } from "../lib/acesso/activateMpPurchase";
import { PRECO_OFERTA, isAccessExpired } from "../lib/acesso/periodo";

const router = Router();

function usernameFromEmail(email: string): string {
  const local = email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, ".")
    .replace(/\.+/g, ".")
    .replace(/^\.+|\.+$/g, "")
    .slice(0, 24);
  return local || "usuario";
}

async function uniqueUsername(base: string): Promise<string> {
  let candidate = base;
  let n = 0;
  while (n < 100) {
    const [existing] = await db
      .select({ id: usuariosTable.id })
      .from(usuariosTable)
      .where(eq(usuariosTable.username, candidate))
      .limit(1);
    if (!existing) return candidate;
    n += 1;
    candidate = `${base.slice(0, 20)}${n}`;
  }
  return `${base.slice(0, 16)}${randomUUID().slice(0, 8)}`;
}

async function findCheckoutToken(usuarioId: number): Promise<string | null> {
  const [mp] = await db
    .select({ checkoutToken: comprasMpTable.checkoutToken, status: comprasMpTable.status })
    .from(comprasMpTable)
    .where(eq(comprasMpTable.usuarioId, usuarioId))
    .orderBy(desc(comprasMpTable.criadoEm))
    .limit(1);
  if (mp) return mp.checkoutToken;
  const [cakto] = await db
    .select({ checkoutToken: comprasCaktoTable.checkoutToken })
    .from(comprasCaktoTable)
    .where(eq(comprasCaktoTable.usuarioId, usuarioId))
    .limit(1);
  return cakto?.checkoutToken ?? null;
}

// GET /api/funnel/checkout-token-by-email?email=...
router.get("/checkout-token-by-email", async (req: Request, res: Response) => {
  try {
    const email = String(req.query.email ?? "")
      .trim()
      .toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "E-mail inválido" });
    }

    const [usuario] = await db
      .select({
        id: usuariosTable.id,
        statusAcesso: usuariosTable.statusAcesso,
        ativo: usuariosTable.ativo,
        acessoAte: usuariosTable.acessoAte,
      })
      .from(usuariosTable)
      .where(eq(usuariosTable.email, email))
      .limit(1);

    if (!usuario) {
      return res.status(404).json({ error: "E-mail não encontrado" });
    }

    if (
      usuario.ativo &&
      usuario.statusAcesso === "active" &&
      !isAccessExpired(usuario.acessoAte)
    ) {
      return res.json({ status: "active", checkoutToken: null });
    }

    const checkoutToken = await findCheckoutToken(usuario.id);
    return res.json({
      status: usuario.statusAcesso,
      checkoutToken,
    });
  } catch (error) {
    req.log.error({ error }, "Erro ao buscar checkout token por e-mail");
    return res.status(500).json({ error: "Erro ao buscar checkout" });
  }
});

// GET /api/funnel/check-email?email=...
router.get("/check-email", async (req: Request, res: Response) => {
  try {
    const email = String(req.query.email ?? "")
      .trim()
      .toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "E-mail inválido" });
    }

    const [existing] = await db
      .select({
        id: usuariosTable.id,
        ativo: usuariosTable.ativo,
        statusAcesso: usuariosTable.statusAcesso,
        acessoAte: usuariosTable.acessoAte,
      })
      .from(usuariosTable)
      .where(eq(usuariosTable.email, email))
      .limit(1);

    if (!existing) {
      return res.json({ available: true });
    }

    if (
      existing.ativo &&
      existing.statusAcesso === "active" &&
      !isAccessExpired(existing.acessoAte)
    ) {
      return res.json({
        available: false,
        status: "active",
        message: "Este e-mail já possui acesso. Faça login.",
      });
    }

    const checkoutToken = await findCheckoutToken(existing.id);
    if (checkoutToken) {
      return res.json({
        available: false,
        status: "pending",
        checkoutToken,
        message: "Este e-mail já está cadastrado. Continue o pagamento ou faça login.",
      });
    }

    return res.json({
      available: false,
      status: "registered",
      message: "E-mail já cadastrado. Faça login ou use outro e-mail.",
    });
  } catch (error) {
    req.log.error({ error }, "Erro ao verificar e-mail do funil");
    return res.status(500).json({ error: "Erro ao verificar e-mail" });
  }
});

// POST /api/funnel/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const parsed = parseBody(funnelRegisterSchema, req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error, detalhes: parsed.detalhes });
    }

    const { nome, email, telefone, senha, variant, utm } = parsed.data;
    const emailNorm = email.trim().toLowerCase();

    const [emailExisting] = await db
      .select({
        id: usuariosTable.id,
        ativo: usuariosTable.ativo,
        statusAcesso: usuariosTable.statusAcesso,
        acessoAte: usuariosTable.acessoAte,
      })
      .from(usuariosTable)
      .where(eq(usuariosTable.email, emailNorm))
      .limit(1);

    if (emailExisting) {
      if (
        emailExisting.ativo &&
        emailExisting.statusAcesso === "active" &&
        !isAccessExpired(emailExisting.acessoAte)
      ) {
        return res.status(409).json({ error: "Este e-mail já possui acesso ativo. Faça login." });
      }
      const pendingToken = await findCheckoutToken(emailExisting.id);
      if (pendingToken) {
        return res.json({
          checkoutToken: pendingToken,
          userId: emailExisting.id,
          existing: true,
        });
      }
      return res.status(409).json({
        error: "E-mail já cadastrado. Tente fazer login ou use outro e-mail.",
      });
    }

    const usernameBase = usernameFromEmail(emailNorm);
    const username = await uniqueUsername(usernameBase);
    const senhaHash = await bcrypt.hash(senha, 10);
    const checkoutToken = randomUUID();
    const mpVariant = await nextPurchaseVariant();

    const [novoUsuario] = await db
      .insert(usuariosTable)
      .values({
        username,
        senha: senhaHash,
        nome: nome.trim(),
        email: emailNorm,
        telefone: telefone?.trim() || null,
        ativo: false,
        statusAcesso: "pending",
        primeiroAcesso: true,
        isAdmin: false,
      })
      .returning({ id: usuariosTable.id });

    await db.insert(gamificacaoTable).values({ usuarioId: novoUsuario.id });

    const utmFields = {
      utmSource: utm?.source ?? null,
      utmMedium: utm?.medium ?? null,
      utmCampaign: utm?.campaign ?? null,
      utmContent: utm?.content ?? null,
      utmTerm: utm?.term ?? null,
    };

    await db.insert(comprasMpTable).values({
      usuarioId: novoUsuario.id,
      checkoutToken,
      status: "pending",
      variant: mpVariant,
      valor: PRECO_OFERTA,
      ...utmFields,
    });

    // Dual-write legado para Kommo / admin compras antigo
    await db.insert(comprasCaktoTable).values({
      usuarioId: novoUsuario.id,
      checkoutToken,
      status: "pending",
      variant: variant || mpVariant,
      valor: PRECO_OFERTA,
      ...utmFields,
    });

    sendCheckoutWelcomeEmail(
      {
        usuarioId: novoUsuario.id,
        nome: nome.trim(),
        email: emailNorm,
        checkoutToken,
      },
      req.log,
    );

    syncKommoOnRegister(
      {
        usuarioId: novoUsuario.id,
        nome: nome.trim(),
        email: emailNorm,
        telefone: telefone.trim(),
        checkoutToken,
        utm,
      },
      req.log,
    );

    return res.status(201).json({
      checkoutToken,
      userId: novoUsuario.id,
      username,
    });
  } catch (error) {
    req.log.error({ error }, "Erro no registro do funil");
    return res.status(500).json({ error: "Erro ao criar cadastro" });
  }
});

async function loadCheckoutByToken(token: string) {
  const [mpRow] = await db
    .select({
      compraStatus: comprasMpTable.status,
      variant: comprasMpTable.variant,
      usuario: usuariosTable,
    })
    .from(comprasMpTable)
    .innerJoin(usuariosTable, eq(comprasMpTable.usuarioId, usuariosTable.id))
    .where(eq(comprasMpTable.checkoutToken, token))
    .limit(1);

  if (mpRow) {
    return {
      nome: mpRow.usuario.nome,
      email: mpRow.usuario.email,
      telefone: mpRow.usuario.telefone,
      variant: mpRow.variant,
      status: mpRow.compraStatus,
      ativo: mpRow.usuario.ativo,
      statusAcesso: mpRow.usuario.statusAcesso,
      acessoAte: mpRow.usuario.acessoAte,
      usuario: mpRow.usuario,
      provider: "mercadopago" as const,
    };
  }

  const [caktoRow] = await db
    .select({
      compraStatus: comprasCaktoTable.status,
      variant: comprasCaktoTable.variant,
      usuario: usuariosTable,
    })
    .from(comprasCaktoTable)
    .innerJoin(usuariosTable, eq(comprasCaktoTable.usuarioId, usuariosTable.id))
    .where(eq(comprasCaktoTable.checkoutToken, token))
    .limit(1);

  if (caktoRow) {
    return {
      nome: caktoRow.usuario.nome,
      email: caktoRow.usuario.email,
      telefone: caktoRow.usuario.telefone,
      variant: caktoRow.variant,
      status: caktoRow.compraStatus,
      ativo: caktoRow.usuario.ativo,
      statusAcesso: caktoRow.usuario.statusAcesso,
      acessoAte: caktoRow.usuario.acessoAte,
      usuario: caktoRow.usuario,
      provider: "cakto" as const,
    };
  }
  return null;
}

// GET /api/funnel/checkout-info?token=...
router.get("/checkout-info", async (req: Request, res: Response) => {
  try {
    const token = String(req.query.token ?? "").trim();
    if (!token) return res.status(400).json({ error: "Token obrigatório" });

    const row = await loadCheckoutByToken(token);
    if (!row) return res.status(404).json({ error: "Checkout não encontrado" });

    return res.json({
      nome: row.nome,
      email: row.email,
      telefone: row.telefone,
      variant: row.variant,
      status: row.status,
      provider: row.provider,
    });
  } catch (error) {
    req.log.error({ error }, "Erro ao buscar checkout-info");
    return res.status(500).json({ error: "Erro ao buscar checkout" });
  }
});

// GET /api/funnel/checkout-status?token=...
router.get("/checkout-status", async (req: Request, res: Response) => {
  try {
    const token = String(req.query.token ?? "").trim();
    if (!token) return res.status(400).json({ error: "Token obrigatório" });

    const row = await loadCheckoutByToken(token);
    if (!row) return res.status(404).json({ error: "Checkout não encontrado" });

    const acessoOk =
      row.statusAcesso === "active" &&
      row.ativo &&
      !isAccessExpired(row.acessoAte);
    const ready = row.status === "paid" && acessoOk;

    return res.json({
      ready,
      status: row.status,
      statusAcesso: row.statusAcesso,
    });
  } catch (error) {
    req.log.error({ error }, "Erro no checkout-status");
    return res.status(500).json({ error: "Erro ao verificar status" });
  }
});

// POST /api/funnel/complete-checkout
router.post("/complete-checkout", async (req: Request, res: Response) => {
  try {
    const checkoutToken = String(req.body?.checkoutToken ?? "").trim();
    if (!checkoutToken) {
      return res.status(400).json({ error: "checkoutToken obrigatório" });
    }

    const row = await loadCheckoutByToken(checkoutToken);
    if (!row) return res.status(404).json({ error: "Checkout não encontrado" });

    const usuario = row.usuario;
    const acessoOk =
      usuario.statusAcesso === "active" &&
      usuario.ativo &&
      !isAccessExpired(usuario.acessoAte);

    if (row.status !== "paid" || !acessoOk) {
      return res.status(402).json({ error: "pagamento_pendente" });
    }

    const token = signToken({
      id: usuario.id,
      username: usuario.username,
      nome: usuario.nome,
      email: usuario.email,
      primeiroAcesso: usuario.primeiroAcesso,
      isAdmin: usuario.isAdmin,
      dataNascimento: usuario.dataNascimento,
    });

    return res.json({
      token,
      user: {
        id: usuario.id,
        username: usuario.username,
        nome: usuario.nome,
        email: usuario.email,
        primeiroAcesso: usuario.primeiroAcesso,
        isAdmin: usuario.isAdmin,
        dataNascimento: usuario.dataNascimento,
        fotoPerfil: usuario.fotoPerfil,
        acessoInicio: usuario.acessoInicio?.toISOString() ?? null,
        acessoAte: usuario.acessoAte?.toISOString() ?? null,
        garantiaAte: usuario.garantiaAte?.toISOString() ?? null,
      },
    });
  } catch (error) {
    req.log.error({ error }, "Erro no complete-checkout");
    return res.status(500).json({ error: "Erro ao concluir checkout" });
  }
});

export default router;
