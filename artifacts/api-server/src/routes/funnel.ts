import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { Router, Request, Response } from "express";
import { db } from "@workspace/db";
import {
  usuariosTable,
  comprasCaktoTable,
  gamificacaoTable,
} from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { parseBody, funnelRegisterSchema } from "../lib/schemas";
import { signToken } from "./auth";
import { sendCheckoutWelcomeEmail } from "../lib/email";

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
      })
      .from(usuariosTable)
      .where(eq(usuariosTable.email, email))
      .limit(1);

    if (!existing) {
      return res.json({ available: true });
    }

    if (existing.ativo && existing.statusAcesso === "active") {
      return res.json({
        available: false,
        status: "active",
        message: "Este e-mail já possui acesso. Faça login.",
      });
    }

    const [pendingCompra] = await db
      .select({ checkoutToken: comprasCaktoTable.checkoutToken })
      .from(comprasCaktoTable)
      .where(eq(comprasCaktoTable.usuarioId, existing.id))
      .limit(1);

    if (pendingCompra) {
      return res.json({
        available: false,
        status: "pending",
        checkoutToken: pendingCompra.checkoutToken,
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
      .select({ id: usuariosTable.id, ativo: usuariosTable.ativo, statusAcesso: usuariosTable.statusAcesso })
      .from(usuariosTable)
      .where(eq(usuariosTable.email, emailNorm))
      .limit(1);

    if (emailExisting) {
      if (emailExisting.ativo && emailExisting.statusAcesso === "active") {
        return res.status(409).json({ error: "Este e-mail já possui acesso ativo. Faça login." });
      }
      const [pendingCompra] = await db
        .select({ checkoutToken: comprasCaktoTable.checkoutToken })
        .from(comprasCaktoTable)
        .where(eq(comprasCaktoTable.usuarioId, emailExisting.id))
        .limit(1);
      if (pendingCompra) {
        return res.json({
          checkoutToken: pendingCompra.checkoutToken,
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
    await db.insert(comprasCaktoTable).values({
      usuarioId: novoUsuario.id,
      checkoutToken,
      status: "pending",
      variant,
      valor: "57.90",
      utmSource: utm?.source ?? null,
      utmMedium: utm?.medium ?? null,
      utmCampaign: utm?.campaign ?? null,
      utmContent: utm?.content ?? null,
      utmTerm: utm?.term ?? null,
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

// GET /api/funnel/checkout-info?token=...
router.get("/checkout-info", async (req: Request, res: Response) => {
  try {
    const token = String(req.query.token ?? "").trim();
    if (!token) return res.status(400).json({ error: "Token obrigatório" });

    const [row] = await db
      .select({
        nome: usuariosTable.nome,
        email: usuariosTable.email,
        telefone: usuariosTable.telefone,
        variant: comprasCaktoTable.variant,
        status: comprasCaktoTable.status,
      })
      .from(comprasCaktoTable)
      .innerJoin(usuariosTable, eq(comprasCaktoTable.usuarioId, usuariosTable.id))
      .where(eq(comprasCaktoTable.checkoutToken, token))
      .limit(1);

    if (!row) return res.status(404).json({ error: "Checkout não encontrado" });

    return res.json({
      nome: row.nome,
      email: row.email,
      telefone: row.telefone,
      variant: row.variant,
      status: row.status,
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

    const [row] = await db
      .select({
        compraStatus: comprasCaktoTable.status,
        ativo: usuariosTable.ativo,
        statusAcesso: usuariosTable.statusAcesso,
      })
      .from(comprasCaktoTable)
      .innerJoin(usuariosTable, eq(comprasCaktoTable.usuarioId, usuariosTable.id))
      .where(eq(comprasCaktoTable.checkoutToken, token))
      .limit(1);

    if (!row) return res.status(404).json({ error: "Checkout não encontrado" });

    const ready = row.compraStatus === "paid" && row.ativo && row.statusAcesso === "active";
    return res.json({
      ready,
      status: row.compraStatus,
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

    const [row] = await db
      .select({
        usuario: usuariosTable,
        compraStatus: comprasCaktoTable.status,
      })
      .from(comprasCaktoTable)
      .innerJoin(usuariosTable, eq(comprasCaktoTable.usuarioId, usuariosTable.id))
      .where(eq(comprasCaktoTable.checkoutToken, checkoutToken))
      .limit(1);

    if (!row) return res.status(404).json({ error: "Checkout não encontrado" });

    const { usuario } = row;
    if (row.compraStatus !== "paid" || !usuario.ativo || usuario.statusAcesso !== "active") {
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
      },
    });
  } catch (error) {
    req.log.error({ error }, "Erro no complete-checkout");
    return res.status(500).json({ error: "Erro ao concluir checkout" });
  }
});

export default router;
