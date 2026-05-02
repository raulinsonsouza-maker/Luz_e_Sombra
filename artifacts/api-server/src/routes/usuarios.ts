import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import { db, usuariosTable, avaliacoesTable } from "@workspace/db";
import { eq, sql, count } from "drizzle-orm";
import { requireAuth, requireAdmin, AuthRequest } from "../lib/authMiddleware";

const router = Router();

function validarUsername(u: string): boolean {
  return /^[a-z0-9._-]{3,30}$/.test(u);
}
function validarSenha(s: string): boolean {
  return s.length >= 6;
}
function validarEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

// GET /api/usuarios - Admin only
router.get("/", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const usuarios = await db
      .select({
        id: usuariosTable.id,
        username: usuariosTable.username,
        nome: usuariosTable.nome,
        email: usuariosTable.email,
        dataNascimento: usuariosTable.dataNascimento,
        primeiroAcesso: usuariosTable.primeiroAcesso,
        ativo: usuariosTable.ativo,
        isAdmin: usuariosTable.isAdmin,
        criadoEm: usuariosTable.criadoEm,
        avaliacoesCount: count(avaliacoesTable.id),
      })
      .from(usuariosTable)
      .leftJoin(avaliacoesTable, eq(avaliacoesTable.usuarioId, usuariosTable.id))
      .groupBy(usuariosTable.id)
      .orderBy(usuariosTable.criadoEm);

    const result = usuarios.map(u => ({
      ...u,
      _count: { avaliacoes: u.avaliacoesCount }
    }));

    return res.json(result);
  } catch (error) {
    req.log.error({ error }, "Erro ao buscar usuários");
    return res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

// POST /api/usuarios - Admin only
router.post("/", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { username, senha, nome, email, dataNascimento, isAdmin } = req.body;
    const usernameNorm = String(username || "").trim().toLowerCase();
    const nomeNorm = String(nome || "").trim();
    const senhaNorm = String(senha || "");
    const emailNorm = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!usernameNorm || !senhaNorm || !nomeNorm) {
      return res.status(400).json({ error: "Username, senha e nome são obrigatórios" });
    }
    if (!validarUsername(usernameNorm)) {
      return res.status(400).json({ error: "Username inválido. Use 3-30 caracteres: letras minúsculas, números, ponto, hífen ou underline." });
    }
    if (!validarSenha(senhaNorm)) {
      return res.status(400).json({ error: "Senha inválida. Use pelo menos 6 caracteres." });
    }
    if (emailNorm && !validarEmail(emailNorm)) {
      return res.status(400).json({ error: "Email inválido." });
    }

    const [existing] = await db.select().from(usuariosTable).where(eq(usuariosTable.username, usernameNorm)).limit(1);
    if (existing) {
      return res.status(400).json({ error: "Username já está em uso" });
    }

    if (emailNorm) {
      const [emailExisting] = await db.select().from(usuariosTable).where(eq(usuariosTable.email, emailNorm)).limit(1);
      if (emailExisting) {
        return res.status(400).json({ error: "Email já está em uso" });
      }
    }

    const senhaHash = await bcrypt.hash(senhaNorm, 10);
    const [novoUsuario] = await db.insert(usuariosTable).values({
      username: usernameNorm,
      senha: senhaHash,
      nome: nomeNorm,
      email: emailNorm || null,
      dataNascimento: dataNascimento || null,
      isAdmin: isAdmin || false,
    }).returning({
      id: usuariosTable.id,
      username: usuariosTable.username,
      nome: usuariosTable.nome,
      email: usuariosTable.email,
      dataNascimento: usuariosTable.dataNascimento,
      primeiroAcesso: usuariosTable.primeiroAcesso,
      ativo: usuariosTable.ativo,
      isAdmin: usuariosTable.isAdmin,
      criadoEm: usuariosTable.criadoEm,
    });

    return res.status(201).json(novoUsuario);
  } catch (error: any) {
    req.log.error({ error }, "Erro ao criar usuário");
    if (error?.code === "23505") {
      return res.status(400).json({ error: "Username ou email já cadastrado." });
    }
    return res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

// PUT /api/usuarios/:id - Admin only
router.put("/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const usuarioId = parseInt(req.params.id);
    if (isNaN(usuarioId)) return res.status(400).json({ error: "ID inválido" });

    const { nome, email, dataNascimento, ativo, isAdmin, senha, novaSenha, primeiroAcesso } = req.body;
    const updates: any = {};

    if (nome !== undefined) {
      const nomeNorm = String(nome).trim();
      if (!nomeNorm) return res.status(400).json({ error: "Nome não pode ser vazio" });
      updates.nome = nomeNorm;
    }
    if (email !== undefined) {
      const emailNorm = String(email || "").trim().toLowerCase();
      if (emailNorm && !validarEmail(emailNorm)) return res.status(400).json({ error: "Email inválido" });
      updates.email = emailNorm || null;
    }
    if (dataNascimento !== undefined) updates.dataNascimento = dataNascimento || null;
    if (typeof ativo === "boolean") updates.ativo = ativo;
    if (typeof isAdmin === "boolean") {
      if (req.user!.id === usuarioId && !isAdmin) {
        return res.status(400).json({ error: "Você não pode remover seu próprio acesso de administrador" });
      }
      updates.isAdmin = isAdmin;
    }
    if (typeof primeiroAcesso === "boolean") updates.primeiroAcesso = primeiroAcesso;

    const senhaParaAtualizar = senha || novaSenha;
    if (senhaParaAtualizar) {
      if (!validarSenha(String(senhaParaAtualizar))) return res.status(400).json({ error: "Senha inválida. Use pelo menos 6 caracteres." });
      updates.senha = await bcrypt.hash(senhaParaAtualizar, 10);
    }

    updates.atualizadoEm = new Date();

    const [updated] = await db.update(usuariosTable)
      .set(updates)
      .where(eq(usuariosTable.id, usuarioId))
      .returning({
        id: usuariosTable.id,
        username: usuariosTable.username,
        nome: usuariosTable.nome,
        email: usuariosTable.email,
        dataNascimento: usuariosTable.dataNascimento,
        primeiroAcesso: usuariosTable.primeiroAcesso,
        ativo: usuariosTable.ativo,
        isAdmin: usuariosTable.isAdmin,
      });

    if (!updated) return res.status(404).json({ error: "Usuário não encontrado" });
    return res.json(updated);
  } catch (error) {
    req.log.error({ error }, "Erro ao atualizar usuário");
    return res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// DELETE /api/usuarios/:id - Admin only
router.delete("/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const usuarioId = parseInt(req.params.id);
    if (isNaN(usuarioId)) return res.status(400).json({ error: "ID inválido" });
    if (req.user!.id === usuarioId) return res.status(400).json({ error: "Você não pode deletar seu próprio usuário" });

    await db.delete(usuariosTable).where(eq(usuariosTable.id, usuarioId));
    return res.json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    req.log.error({ error }, "Erro ao deletar usuário");
    return res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

// PUT /api/usuarios/primeiro-acesso - Any authenticated user
router.put("/primeiro-acesso/me", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await db.update(usuariosTable)
      .set({ primeiroAcesso: false, atualizadoEm: new Date() })
      .where(eq(usuariosTable.id, req.user!.id));
    return res.json({ success: true });
  } catch (error) {
    req.log.error({ error }, "Erro ao atualizar primeiro acesso");
    return res.status(500).json({ error: "Erro ao atualizar" });
  }
});

export default router;
