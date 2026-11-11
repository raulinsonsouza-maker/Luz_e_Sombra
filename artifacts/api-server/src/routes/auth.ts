import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@workspace/db";
import {
  usuariosTable,
  passwordResetTokensTable,
  comprasCaktoTable,
  comprasMpTable,
} from "@workspace/db/schema";
import { eq, and, isNull, gt, desc } from "drizzle-orm";
import { parseBody, forgotPasswordSchema, resetPasswordSchema } from "../lib/schemas";
import {
  generateResetToken,
  getResetTokenExpiry,
  hashResetToken,
  isResetRateLimited,
  recordResetRequest,
} from "../lib/passwordReset";
import { sendPasswordResetEmail, sendPasswordChangedEmail } from "../lib/email";
import { accessFieldsForClient, ensureAccessValid } from "../lib/acesso/ensureAccess";
import {
  constantLoginDelay,
  loginAbuseGuard,
  rateLimit,
} from "../lib/security/rateLimit";

const loginGuard = loginAbuseGuard();

async function resolveCheckoutToken(usuarioId: number): Promise<string | null> {
  const [mp] = await db
    .select({ checkoutToken: comprasMpTable.checkoutToken })
    .from(comprasMpTable)
    .where(and(eq(comprasMpTable.usuarioId, usuarioId), eq(comprasMpTable.status, "pending")))
    .orderBy(desc(comprasMpTable.criadoEm))
    .limit(1);
  if (mp?.checkoutToken) return mp.checkoutToken;
  const [cakto] = await db
    .select({ checkoutToken: comprasCaktoTable.checkoutToken })
    .from(comprasCaktoTable)
    .where(and(eq(comprasCaktoTable.usuarioId, usuarioId), eq(comprasCaktoTable.status, "pending")))
    .orderBy(desc(comprasCaktoTable.criadoEm))
    .limit(1);
  return cakto?.checkoutToken ?? null;
}

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required but was not set.");
}
const jwtSecret: string = JWT_SECRET;
const JWT_EXPIRES_IN = "30d";

interface JwtPayload {
  id: number;
  username: string;
  nome: string;
  email: string | null;
  primeiroAcesso: boolean;
  isAdmin: boolean;
  dataNascimento: string | null;
  iat?: number;
  exp?: number;
}

export function signToken(payload: Omit<JwtPayload, "iat" | "exp">): string {
  return jwt.sign(payload, jwtSecret, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, jwtSecret) as unknown as JwtPayload;
}

// POST /api/auth/login
router.post(
  "/login",
  rateLimit({ name: "auth-login-ip", windowMs: 15 * 60 * 1000, max: 60 }),
  loginGuard.middleware,
  async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username e senha são obrigatórios" });
    }

    const usernameNorm = String(username).trim().toLowerCase();
    // Compat: body.email também conta para a chave de abuso
    if (!req.body.email) req.body.email = usernameNorm;
    const isEmail = usernameNorm.includes("@");
    const [usuario] = await db
      .select()
      .from(usuariosTable)
      .where(
        isEmail
          ? eq(usuariosTable.email, usernameNorm)
          : eq(usuariosTable.username, usernameNorm),
      )
      .limit(1);

    if (!usuario) {
      loginGuard.recordFailure(req);
      await constantLoginDelay();
      return res.status(401).json({ error: "Usuário ou senha inválidos" });
    }

    const senhaValida = await bcrypt.compare(String(password), usuario.senha);
    if (!senhaValida) {
      loginGuard.recordFailure(req);
      await constantLoginDelay();
      return res.status(401).json({ error: "Usuário ou senha inválidos" });
    }
    loginGuard.recordSuccess(req);

    if (!usuario.isAdmin) {
      if (usuario.statusAcesso === "pending" || (!usuario.ativo && usuario.statusAcesso === "pending")) {
        const checkoutToken = await resolveCheckoutToken(usuario.id);
        return res.status(402).json({
          error: "pagamento_pendente",
          code: "pagamento_pendente",
          checkoutToken,
        });
      }

      const access = await ensureAccessValid(usuario);
      if (access.statusAcesso === "revoked") {
        return res.status(403).json({
          error: "Seu acesso foi encerrado por reembolso ou estorno. Entre em contato com o suporte se precisar de ajuda.",
          code: "acesso_revogado",
        });
      }
      if (access.expired || access.statusAcesso === "expired") {
        return res.status(403).json({
          error: "Seu período de acesso de 6 meses terminou.",
          code: "acesso_expirado",
          ...accessFieldsForClient(access),
        });
      }
      if (!access.ativo) {
        if (access.statusAcesso === "pending") {
          const checkoutToken = await resolveCheckoutToken(usuario.id);
          return res.status(402).json({
            error: "pagamento_pendente",
            code: "pagamento_pendente",
            checkoutToken,
          });
        }
        return res.status(401).json({ error: "Usuário ou senha inválidos" });
      }
    }

    const access = await ensureAccessValid(usuario);
    const accessFields = accessFieldsForClient(access);

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
        ...accessFields,
      },
    });
  } catch (error) {
    req.log.error({ error }, "Erro no login");
    return res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// GET /api/auth/session
router.get("/session", async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Não autenticado" });
    }
    const token = authHeader.slice(7);
    const decoded = verifyToken(token);

    // Refresh user data from DB
    const [usuario] = await db
      .select()
      .from(usuariosTable)
      .where(eq(usuariosTable.id, decoded.id))
      .limit(1);

    if (!usuario) {
      return res.status(401).json({ error: "Usuário não encontrado ou inativo" });
    }

    const access = await ensureAccessValid(usuario);
    if (!usuario.isAdmin) {
      if (access.expired || access.statusAcesso === "expired") {
        return res.status(403).json({
          error: "Seu período de acesso terminou.",
          code: "acesso_expirado",
          ...accessFieldsForClient(access),
        });
      }
      if (!access.ativo) {
        return res.status(401).json({ error: "Usuário não encontrado ou inativo" });
      }
    }

    return res.json({
      user: {
        id: usuario.id,
        username: usuario.username,
        nome: usuario.nome,
        email: usuario.email,
        primeiroAcesso: usuario.primeiroAcesso,
        isAdmin: usuario.isAdmin,
        dataNascimento: usuario.dataNascimento,
        fotoPerfil: usuario.fotoPerfil,
        ...accessFieldsForClient(access),
      },
    });
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
});

const FORGOT_PASSWORD_OK = {
  message: "Se o e-mail estiver cadastrado, você receberá um link para redefinir a senha.",
};

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req: Request, res: Response) => {
  try {
    const parsed = parseBody(forgotPasswordSchema, req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error, detalhes: parsed.detalhes });
    }

    const email = parsed.data.email;

    if (isResetRateLimited(email)) {
      return res.json(FORGOT_PASSWORD_OK);
    }

    const [usuario] = await db
      .select({
        id: usuariosTable.id,
        nome: usuariosTable.nome,
        email: usuariosTable.email,
      })
      .from(usuariosTable)
      .where(eq(usuariosTable.email, email))
      .limit(1);

    if (!usuario?.email) {
      return res.json(FORGOT_PASSWORD_OK);
    }

    recordResetRequest(email);
    const rawToken = generateResetToken();
    const tokenHash = hashResetToken(rawToken);

    await db.insert(passwordResetTokensTable).values({
      usuarioId: usuario.id,
      tokenHash,
      expiresAt: getResetTokenExpiry(),
    });

    sendPasswordResetEmail(
      {
        usuarioId: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        token: rawToken,
      },
      req.log,
    );

    return res.json(FORGOT_PASSWORD_OK);
  } catch (error) {
    req.log.error({ error }, "Erro em forgot-password");
    return res.status(500).json({ error: "Erro ao processar solicitação" });
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", async (req: Request, res: Response) => {
  try {
    const parsed = parseBody(resetPasswordSchema, req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error, detalhes: parsed.detalhes });
    }

    const { token, novaSenha } = parsed.data;
    const tokenHash = hashResetToken(token);

    const [row] = await db
      .select({
        tokenId: passwordResetTokensTable.id,
        usuarioId: passwordResetTokensTable.usuarioId,
        nome: usuariosTable.nome,
        email: usuariosTable.email,
      })
      .from(passwordResetTokensTable)
      .innerJoin(usuariosTable, eq(passwordResetTokensTable.usuarioId, usuariosTable.id))
      .where(
        and(
          eq(passwordResetTokensTable.tokenHash, tokenHash),
          isNull(passwordResetTokensTable.usedAt),
          gt(passwordResetTokensTable.expiresAt, new Date()),
        ),
      )
      .limit(1);

    if (!row?.email) {
      return res.status(400).json({ error: "Link inválido ou expirado. Solicite um novo e-mail." });
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10);

    await db
      .update(usuariosTable)
      .set({ senha: senhaHash, atualizadoEm: new Date() })
      .where(eq(usuariosTable.id, row.usuarioId));

    await db
      .update(passwordResetTokensTable)
      .set({ usedAt: new Date() })
      .where(eq(passwordResetTokensTable.id, row.tokenId));

    sendPasswordChangedEmail(
      { usuarioId: row.usuarioId, nome: row.nome, email: row.email },
      req.log,
    );

    return res.json({ ok: true, message: "Senha redefinida com sucesso." });
  } catch (error) {
    req.log.error({ error }, "Erro em reset-password");
    return res.status(500).json({ error: "Erro ao redefinir senha" });
  }
});

export default router;
