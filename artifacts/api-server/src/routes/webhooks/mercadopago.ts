import { Router, Request, Response } from "express";
import { handleMpWebhook } from "../payments/mp";

const router = Router();

// POST /api/webhooks/mercadopago — único caminho de processamento
router.post("/mercadopago", async (req: Request, res: Response) => {
  return handleMpWebhook(req, res);
});

// GET: health/challenge estático — não processa pagamento
router.get("/mercadopago", async (_req: Request, res: Response) => {
  return res.status(200).json({ ok: true });
});

export default router;
