import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db, usuariosTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "luz-e-sombra-secret-key-2024";
const JWT_EXPIRES_IN = "30d";

export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as any);
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username e senha são obrigatórios" });
    }

    const usernameNorm = String(username).trim().toLowerCase();
    const [usuario] = await db
      .select()
      .from(usuariosTable)
      .where(eq(usuariosTable.username, usernameNorm))
      .limit(1);

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ error: "Usuário ou senha inválidos" });
    }

    const senhaValida = await bcrypt.compare(String(password), usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "Usuário ou senha inválidos" });
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

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ error: "Usuário não encontrado ou inativo" });
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
      },
    });
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
});

export default router;
