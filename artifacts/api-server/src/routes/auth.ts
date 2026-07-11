import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@workspace/db";
import { usuariosTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

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
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username e senha são obrigatórios" });
    }

    const usernameNorm = String(username).trim().toLowerCase();
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
      return res.status(401).json({ error: "Usuário ou senha inválidos" });
    }

    const senhaValida = await bcrypt.compare(String(password), usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "Usuário ou senha inválidos" });
    }

    if (!usuario.ativo) {
      if (usuario.statusAcesso === "pending") {
        return res.status(402).json({ error: "pagamento_pendente" });
      }
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
        fotoPerfil: usuario.fotoPerfil,
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

    if (!usuario.ativo) {
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
        fotoPerfil: usuario.fotoPerfil,
      },
    });
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
});

export default router;
