import { Router, Response } from "express";
import { ObjectStorageService } from "../lib/objectStorage";

const router = Router();
const objectStorage = new ObjectStorageService();

router.put("/:uploadId", async (req, res: Response) => {
  try {
    const uploadId = req.params.uploadId;
    const token = String(req.query.token || "");
    const body = req.body;
    const fileBuffer = Buffer.isBuffer(body) ? body : Buffer.from([]);
    if (!uploadId || !token) {
      return res.status(400).json({ error: "Upload inválido" });
    }
    if (fileBuffer.length === 0) {
      return res.status(400).json({ error: "Arquivo não enviado" });
    }
    await objectStorage.saveUploadedObject(uploadId, token, fileBuffer);
    return res.status(200).send("ok");
  } catch (err) {
    req.log?.error({ err }, "Erro ao processar upload");
    return res.status(400).json({ error: "Falha ao processar upload" });
  }
});

export default router;
