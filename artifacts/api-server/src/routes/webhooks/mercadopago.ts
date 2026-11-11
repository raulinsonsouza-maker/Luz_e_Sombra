import { Router, Request, Response } from "express";
import { handleMpWebhook } from "../payments/mp";

const router = Router();

// POST /api/webhooks/mercadopago
router.post("/mercadopago", async (req: Request, res: Response) => {
  return handleMpWebhook(req, res);
});

// GET também (MP às vezes valida)
router.get("/mercadopago", async (req: Request, res: Response) => {
  return handleMpWebhook(req, res);
});

export default router;
