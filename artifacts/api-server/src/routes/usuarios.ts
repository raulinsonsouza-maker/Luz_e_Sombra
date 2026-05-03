import { Router, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "@workspace/db";
import { usuariosTable, avaliacoesTable, comunidadeTable, reacoesTable, cursosTable, analiseTracoTable } from "@workspace/db/schema";
import { eq, count, sql } from "drizzle-orm";
import { requireAuth, requireAdmin, AuthRequest } from "../lib/authMiddleware";
import { ObjectStorageService } from "../lib/objectStorage";

const router = Router();
const objectStorage = new ObjectStorageService();

function validarUsername(u: string): boolean {
  return /^[a-z0-9._-]{3,30}$/.test(u);
}
function validarSenha(s: string): boolean {
  return s.length >= 6;
}
function validarEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

// POST /api/usuarios/me/foto-perfil/upload-url — get presigned upload URL
router.post("/me/foto-perfil/upload-url", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const uploadURL = await objectStorage.getObjectEntityUploadURL();
    const objectPath = objectStorage.normalizeObjectEntityPath(uploadURL);
    return res.json({ uploadURL, objectPath });
  } catch (err) {
    req.log.error({ err }, "Erro ao gerar URL de upload de foto");
    return res.status(500).json({ error: "Erro ao gerar URL de upload" });
  }
});

// PUT /api/usuarios/me/foto-perfil — save objectPath after upload
router.put("/me/foto-perfil", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { objectPath } = req.body as { objectPath?: string };
    if (!objectPath?.startsWith("/objects/")) {
      return res.status(400).json({ error: "objectPath inválido" });
    }
    await db.update(usuariosTable)
      .set({ fotoPerfil: objectPath, atualizadoEm: new Date() })
      .where(eq(usuariosTable.id, req.user!.id));
    return res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Erro ao salvar foto de perfil");
    return res.status(500).json({ error: "Erro ao salvar foto de perfil" });
  }
});

// GET /api/usuarios/me/foto-perfil/view — stream profile photo
router.get("/me/foto-perfil/view", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const [usuario] = await db
      .select({ fotoPerfil: usuariosTable.fotoPerfil })
      .from(usuariosTable)
      .where(eq(usuariosTable.id, req.user!.id))
      .limit(1);

    if (!usuario?.fotoPerfil) return res.status(404).json({ error: "Sem foto de perfil" });

    const file = await objectStorage.getObjectEntityFile(usuario.fotoPerfil);
    const response = await objectStorage.downloadObject(file, 3600);
    const buffer = Buffer.from(await response.arrayBuffer());
    res.set("Content-Type", response.headers.get("content-type") || "image/jpeg");
    res.set("Cache-Control", "private, max-age=3600");
    return res.send(buffer);
  } catch (err) {
    req.log.error({ err }, "Erro ao carregar foto de perfil");
    return res.status(404).json({ error: "Foto não encontrada" });
  }
});

// PUT /api/usuarios/me — update own profile (name, birth date, password)
router.put("/me", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { nome, dataNascimento, senhaAtual, novaSenha } = req.body as {
      nome?: unknown; dataNascimento?: unknown;
      senhaAtual?: unknown; novaSenha?: unknown;
    };
    const updates: UsuarioUpdates = {};

    if (nome !== undefined) {
      const nomeNorm = String(nome ?? "").trim();
      if (!nomeNorm) return res.status(400).json({ error: "Nome não pode ser vazio" });
      updates.nome = nomeNorm;
    }

    if (dataNascimento !== undefined) {
      updates.dataNascimento = typeof dataNascimento === "string" ? dataNascimento || null : null;
    }

    if (novaSenha !== undefined && novaSenha !== "") {
      if (!senhaAtual) {
        return res.status(400).json({ error: "Senha atual é obrigatória para alterar a senha" });
      }
      const [currentUser] = await db.select().from(usuariosTable).where(eq(usuariosTable.id, req.user!.id)).limit(1);
      if (!currentUser) return res.status(404).json({ error: "Usuário não encontrado" });
      const senhaCorreta = await bcrypt.compare(String(senhaAtual), currentUser.senha);
      if (!senhaCorreta) return res.status(400).json({ error: "Senha atual incorreta" });
      const novaSenhaStr = String(novaSenha);
      if (!validarSenha(novaSenhaStr)) return res.status(400).json({ error: "Nova senha inválida. Use pelo menos 6 caracteres." });
      updates.senha = await bcrypt.hash(novaSenhaStr, 10);
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "Nenhum dado para atualizar" });
    }

    updates.atualizadoEm = new Date();

    const [updated] = await db.update(usuariosTable)
      .set(updates)
      .where(eq(usuariosTable.id, req.user!.id))
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
    req.log.error({ error }, "Erro ao atualizar perfil");
    return res.status(500).json({ error: "Erro ao atualizar perfil" });
  }
});

// PUT /api/usuarios/primeiro-acesso/me — MUST be before /:id to avoid route collision
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
    const { username, senha, nome, email, dataNascimento, isAdmin } = req.body as {
      username: unknown; senha: unknown; nome: unknown;
      email: unknown; dataNascimento: unknown; isAdmin: unknown;
    };
    const usernameNorm = String(username ?? "").trim().toLowerCase();
    const nomeNorm = String(nome ?? "").trim();
    const senhaNorm = String(senha ?? "");
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
      dataNascimento: typeof dataNascimento === "string" ? dataNascimento || null : null,
      isAdmin: isAdmin === true,
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
  } catch (error) {
    req.log.error({ error }, "Erro ao criar usuário");
    if (
      error instanceof Error &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code === "23505"
    ) {
      return res.status(400).json({ error: "Username ou email já cadastrado." });
    }
    return res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

type UsuarioUpdates = {
  nome?: string;
  email?: string | null;
  dataNascimento?: string | null;
  ativo?: boolean;
  isAdmin?: boolean;
  primeiroAcesso?: boolean;
  senha?: string;
  atualizadoEm?: Date;
};

// PUT /api/usuarios/:id - Admin only
router.put("/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const usuarioId = parseInt(String(req.params.id), 10);
    if (isNaN(usuarioId)) return res.status(400).json({ error: "ID inválido" });

    const { nome, email, dataNascimento, ativo, isAdmin, senha, novaSenha, primeiroAcesso } = req.body as {
      nome?: unknown; email?: unknown; dataNascimento?: unknown;
      ativo?: unknown; isAdmin?: unknown; senha?: unknown;
      novaSenha?: unknown; primeiroAcesso?: unknown;
    };
    const updates: UsuarioUpdates = {};

    if (nome !== undefined) {
      const nomeNorm = String(nome).trim();
      if (!nomeNorm) return res.status(400).json({ error: "Nome não pode ser vazio" });
      updates.nome = nomeNorm;
    }
    if (email !== undefined) {
      const emailNorm = String(email ?? "").trim().toLowerCase();
      if (emailNorm && !validarEmail(emailNorm)) return res.status(400).json({ error: "Email inválido" });
      updates.email = emailNorm || null;
    }
    if (dataNascimento !== undefined) {
      updates.dataNascimento = typeof dataNascimento === "string" ? dataNascimento || null : null;
    }
    if (typeof ativo === "boolean") updates.ativo = ativo;
    if (typeof isAdmin === "boolean") {
      if (req.user!.id === usuarioId && !isAdmin) {
        return res.status(400).json({ error: "Você não pode remover seu próprio acesso de administrador" });
      }
      updates.isAdmin = isAdmin;
    }
    if (typeof primeiroAcesso === "boolean") updates.primeiroAcesso = primeiroAcesso;

    const senhaParaAtualizar = senha ?? novaSenha;
    if (senhaParaAtualizar !== undefined && senhaParaAtualizar !== null && senhaParaAtualizar !== "") {
      const senhaStr = String(senhaParaAtualizar);
      if (!validarSenha(senhaStr)) return res.status(400).json({ error: "Senha inválida. Use pelo menos 6 caracteres." });
      updates.senha = await bcrypt.hash(senhaStr, 10);
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
    const usuarioId = parseInt(String(req.params.id), 10);
    if (isNaN(usuarioId)) return res.status(400).json({ error: "ID inválido" });
    if (req.user!.id === usuarioId) return res.status(400).json({ error: "Você não pode deletar seu próprio usuário" });

    await db.delete(usuariosTable).where(eq(usuariosTable.id, usuarioId));
    return res.json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    req.log.error({ error }, "Erro ao deletar usuário");
    return res.status(500).json({ error: "Erro ao deletar usuário" });
  }
});

// GET /api/usuarios/stats — dashboard stats (admin only)
router.get("/stats", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const [usersAgg, postsAgg, reactionsAgg, cursosAgg, analiseAgg] = await Promise.all([
      db.select({
        total: sql<number>`count(*)::int`,
        ativos: sql<number>`sum(case when ativo then 1 else 0 end)::int`,
      }).from(usuariosTable).where(eq(usuariosTable.isAdmin, false)),
      db.select({ total: sql<number>`count(*)::int` }).from(comunidadeTable),
      db.select({ total: sql<number>`count(*)::int` }).from(reacoesTable),
      db.select({ total: sql<number>`count(*)::int` }).from(cursosTable),
      db.select({ total: sql<number>`count(*)::int` }).from(analiseTracoTable),
    ]);
    return res.json({
      usuarios: { total: usersAgg[0]?.total ?? 0, ativos: usersAgg[0]?.ativos ?? 0 },
      posts: postsAgg[0]?.total ?? 0,
      reacoes: reactionsAgg[0]?.total ?? 0,
      cursos: cursosAgg[0]?.total ?? 0,
      analiseTraco: analiseAgg[0]?.total ?? 0,
    });
  } catch (err) {
    req.log.error({ err }, "Erro ao buscar stats");
    return res.status(500).json({ error: "Erro ao buscar estatísticas" });
  }
});

export default router;
