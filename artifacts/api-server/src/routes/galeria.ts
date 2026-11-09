import { Router, type Response } from "express";
import { eq } from "drizzle-orm";
import { db, galeriaImagensTable } from "@workspace/db";
import { requireAdmin, type AuthRequest } from "../lib/authMiddleware";
import { ObjectStorageService } from "../lib/objectStorage";
import {
  invalidateGaleriaCache,
  listarGaleriaAtiva,
  proximaOrdemGaleria,
  softDeleteGaleria,
} from "../lib/galeriaAcervo";

const router = Router();
const objectStorage = new ObjectStorageService();

/** GET /api/galeria — lista acervo ativo (admin) */
router.get("/", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const itens = await listarGaleriaAtiva();
    return res.json({ total: itens.length, itens });
  } catch (err) {
    req.log?.error({ err }, "Erro ao listar galeria");
    return res.status(500).json({ error: "Erro ao listar galeria" });
  }
});

/** POST /api/galeria/upload-url */
router.post("/upload-url", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const uploadURL = await objectStorage.getObjectEntityUploadURL();
    const objectPath = objectStorage.normalizeObjectEntityPath(uploadURL);
    return res.json({ uploadURL, objectPath });
  } catch (err) {
    req.log?.error({ err }, "Erro ao gerar URL de upload (galeria)");
    return res.status(500).json({ error: "Erro ao gerar URL de upload" });
  }
});

/** POST /api/galeria — registra imagem já enviada ao storage */
router.post("/", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const path = String((req.body as { path?: string })?.path ?? "").trim();
    if (!path.startsWith("/objects/")) {
      return res.status(400).json({ error: "Path de upload inválido" });
    }
    const exists = await objectStorage.objectExists(path);
    if (!exists) {
      return res.status(400).json({ error: "Arquivo não encontrado no storage" });
    }
    const ordem = await proximaOrdemGaleria();
    const [row] = await db
      .insert(galeriaImagensTable)
      .values({
        ordem,
        origem: "upload",
        path,
        ativo: true,
      })
      .returning();
    invalidateGaleriaCache();
    return res.status(201).json({
      id: row!.id,
      ordem: row!.ordem,
      origem: row!.origem,
      path: row!.path,
      url: `/api/galeria/${row!.id}/imagem`,
      thumbUrl: `/api/galeria/${row!.id}/imagem`,
      ativo: true,
    });
  } catch (err) {
    req.log?.error({ err }, "Erro ao registrar imagem na galeria");
    return res.status(500).json({ error: "Erro ao salvar imagem" });
  }
});

/** DELETE /api/galeria/:id — remove upload do ciclo (soft) */
router.delete("/:id", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });
    try {
      const ok = await softDeleteGaleria(id);
      if (!ok) return res.status(404).json({ error: "Imagem não encontrada" });
      return res.json({ ok: true });
    } catch (e) {
      if (e instanceof Error && e.message === "estatico") {
        return res.status(400).json({ error: "Imagens do banco estático não podem ser removidas" });
      }
      throw e;
    }
  } catch (err) {
    req.log?.error({ err }, "Erro ao remover imagem da galeria");
    return res.status(500).json({ error: "Erro ao remover imagem" });
  }
});

/** GET /api/galeria/:id/imagem — pública */
router.get("/:id/imagem", async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });

    const [row] = await db
      .select()
      .from(galeriaImagensTable)
      .where(eq(galeriaImagensTable.id, id))
      .limit(1);

    if (!row || !row.ativo) {
      return res.status(404).json({ error: "Imagem não encontrada" });
    }

    if (row.origem === "estatico" || row.path.startsWith("/imagens-dia/")) {
      const target = row.path.replace(/\.png$/i, ".jpg");
      return res.redirect(302, target);
    }

    const file = await objectStorage.getObjectEntityFile(row.path);
    const response = await objectStorage.downloadObject(file, 3600);
    const buffer = Buffer.from(await response.arrayBuffer());
    res.set("Content-Type", response.headers.get("content-type") || "image/jpeg");
    res.set("Cache-Control", "public, max-age=3600");
    return res.send(buffer);
  } catch (err) {
    req.log?.error({ err }, "Erro ao servir imagem da galeria");
    return res.status(500).json({ error: "Erro ao carregar imagem" });
  }
});

export default router;
