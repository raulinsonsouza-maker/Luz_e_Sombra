import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../lib/authMiddleware";
import { db, fotosTracoTable, analiseTracoTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { ObjectStorageService } from "../lib/objectStorage";

const router = Router();
const objectStorage = new ObjectStorageService();

const TIPOS_FOTO = ["rosto", "corpo-frente", "corpo-lado"] as const;
type TipoFoto = (typeof TIPOS_FOTO)[number];

// ── GET /traco/fotos — list photos ────────────────────────────────────────────
router.get("/fotos", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const fotos = await db
      .select()
      .from(fotosTracoTable)
      .where(eq(fotosTracoTable.usuarioId, req.user!.id));
    return res.json(fotos);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao buscar fotos" });
  }
});

// ── POST /traco/fotos/upload-url — request presigned URL ─────────────────────
router.post("/fotos/upload-url", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { tipo } = req.body as { tipo: TipoFoto };
    if (!TIPOS_FOTO.includes(tipo)) {
      return res.status(400).json({ error: "Tipo de foto inválido. Use: rosto, corpo-frente ou corpo-lado" });
    }
    const uploadURL = await objectStorage.getObjectEntityUploadURL();
    const objectPath = objectStorage.normalizeObjectEntityPath(uploadURL);
    return res.json({ uploadURL, objectPath });
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao gerar URL de upload" });
  }
});

// ── POST /traco/fotos — save photo metadata ───────────────────────────────────
router.post("/fotos", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { tipo, objectPath } = req.body as { tipo: TipoFoto; objectPath: string };
    if (!TIPOS_FOTO.includes(tipo)) {
      return res.status(400).json({ error: "Tipo de foto inválido" });
    }
    if (!objectPath?.startsWith("/objects/")) {
      return res.status(400).json({ error: "objectPath inválido" });
    }

    // Delete existing photo of this type for this user
    await db
      .delete(fotosTracoTable)
      .where(and(eq(fotosTracoTable.usuarioId, req.user!.id), eq(fotosTracoTable.tipo, tipo)));

    const [foto] = await db
      .insert(fotosTracoTable)
      .values({ usuarioId: req.user!.id, tipo, objectPath })
      .returning();

    return res.json(foto);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao salvar foto" });
  }
});

// ── DELETE /traco/fotos/:id — delete a photo ──────────────────────────────────
router.delete("/fotos/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [foto] = await db
      .select()
      .from(fotosTracoTable)
      .where(and(eq(fotosTracoTable.id, id), eq(fotosTracoTable.usuarioId, req.user!.id)));
    if (!foto) return res.status(404).json({ error: "Foto não encontrada" });

    await db.delete(fotosTracoTable).where(eq(fotosTracoTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao remover foto" });
  }
});

// ── GET /traco/fotos/:id/view — proxy photo from GCS ─────────────────────────
router.get("/fotos/:id/view", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [foto] = await db
      .select()
      .from(fotosTracoTable)
      .where(and(eq(fotosTracoTable.id, id), eq(fotosTracoTable.usuarioId, req.user!.id)));
    if (!foto) return res.status(404).json({ error: "Foto não encontrada" });

    const file = await objectStorage.getObjectEntityFile(foto.objectPath);
    const response = await objectStorage.downloadObject(file, 3600);
    const buffer = Buffer.from(await response.arrayBuffer());
    res.set("Content-Type", response.headers.get("content-type") || "image/jpeg");
    res.set("Cache-Control", "private, max-age=3600");
    return res.send(buffer);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao carregar foto" });
  }
});

// ── POST /traco/analisar — save pre-computed analysis (no AI credits) ─────────
// The analysis is computed client-side using our local biomechanical engine.
// This endpoint simply receives the computed resultado and persists it to the DB.
router.post("/analisar", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { resultado } = req.body as { resultado?: Record<string, unknown> };

    if (!resultado || typeof resultado !== "object") {
      return res.status(400).json({
        error: "Resultado da análise não fornecido. A análise deve ser enviada pelo cliente.",
      });
    }

    // Basic structure validation
    const r = resultado as Record<string, unknown>;
    if (!r.estruturas || !r.estruturaPrincipal || !r.estruturaSecundaria) {
      return res.status(400).json({ error: "Resultado da análise incompleto ou inválido." });
    }

    // Validate percentages sum to 100
    const est = r.estruturas as Record<string, number>;
    const sum = Object.values(est).reduce((a: number, b) => a + Number(b), 0);
    if (Math.abs(sum - 100) > 2) {
      return res.status(400).json({ error: "Percentagens inválidas: devem somar 100." });
    }

    // Upsert: one analysis per user
    const existing = await db
      .select()
      .from(analiseTracoTable)
      .where(eq(analiseTracoTable.usuarioId, req.user!.id));

    let analise;
    if (existing.length > 0) {
      [analise] = await db
        .update(analiseTracoTable)
        .set({ resultado, criadoEm: new Date() })
        .where(eq(analiseTracoTable.id, existing[0].id))
        .returning();
    } else {
      [analise] = await db
        .insert(analiseTracoTable)
        .values({ usuarioId: req.user!.id, resultado })
        .returning();
    }

    return res.json(analise);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao salvar análise. Tente novamente." });
  }
});

// ── GET /traco/analise — get latest analysis ──────────────────────────────────
router.get("/analise", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const [analise] = await db
      .select()
      .from(analiseTracoTable)
      .where(eq(analiseTracoTable.usuarioId, req.user!.id));
    return res.json(analise ?? null);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao buscar análise" });
  }
});

export default router;
