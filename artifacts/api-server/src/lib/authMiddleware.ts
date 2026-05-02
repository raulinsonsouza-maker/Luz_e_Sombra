import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../routes/auth";
import { db, usuariosTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    nome: string;
    email: string | null;
    primeiroAcesso: boolean;
    isAdmin: boolean;
    dataNascimento: string | null;
  };
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Não autorizado" });
    }
    const token = authHeader.slice(7);
    const decoded = verifyToken(token);

    const [usuario] = await db
      .select()
      .from(usuariosTable)
      .where(eq(usuariosTable.id, decoded.id))
      .limit(1);

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ error: "Usuário não encontrado ou inativo" });
    }

    req.user = {
      id: usuario.id,
      username: usuario.username,
      nome: usuario.nome,
      email: usuario.email,
      primeiroAcesso: usuario.primeiroAcesso,
      isAdmin: usuario.isAdmin,
      dataNascimento: usuario.dataNascimento,
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
}

export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  await requireAuth(req, res, () => {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ error: "Acesso negado. Apenas administradores." });
    }
    next();
  });
}
