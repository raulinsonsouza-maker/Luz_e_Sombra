import { Router, type Request, type Response } from "express";
import { getWhatsAppConfig } from "../../lib/whatsapp/config";
import { verifyWhatsAppSignature, sendWhatsAppText } from "../../lib/whatsapp/client";
import { setWhatsAppOptOutByPhone } from "../../lib/whatsapp/outbound";

const router = Router();

type RawBodyRequest = Request & { rawBody?: Buffer };

/** GET — verificação do webhook (Meta challenge). */
router.get("/whatsapp", (req: Request, res: Response) => {
  const cfg = getWhatsAppConfig();
  const mode = String(req.query["hub.mode"] ?? "");
  const token = String(req.query["hub.verify_token"] ?? "");
  const challenge = String(req.query["hub.challenge"] ?? "");

  if (mode === "subscribe" && cfg.verifyToken && token === cfg.verifyToken) {
    req.log?.info("WhatsApp webhook verificado");
    return res.status(200).send(challenge);
  }

  return res.status(403).json({ error: "Verify token inválido" });
});

/** POST — status de entrega + opt-out ("parar"). */
router.post("/whatsapp", async (req: RawBodyRequest, res: Response) => {
  const signature = req.header("x-hub-signature-256") ?? undefined;
  const raw = req.rawBody;
  if (raw && !verifyWhatsAppSignature(raw, signature)) {
    req.log?.warn("WhatsApp webhook assinatura inválida");
    res.status(401).json({ error: "Assinatura inválida" });
    return;
  }

  // Sempre 200 rápido para a Meta
  res.status(200).json({ ok: true });

  try {
    const body = req.body as {
      object?: string;
      entry?: Array<{
        changes?: Array<{
          value?: {
            messages?: Array<{
              from?: string;
              type?: string;
              text?: { body?: string };
            }>;
            statuses?: unknown[];
          };
        }>;
      }>;
    };

    if (body.object !== "whatsapp_business_account") {
      return;
    }

    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        const messages = change.value?.messages ?? [];
        for (const msg of messages) {
          if (msg.type !== "text" || !msg.from || !msg.text?.body) continue;
          const text = msg.text.body.trim().toLowerCase();
          if (text === "parar" || text === "stop" || text === "sair" || text === "cancelar") {
            const n = await setWhatsAppOptOutByPhone(msg.from, true);
            req.log?.info({ from: msg.from, updated: n }, "WhatsApp opt-out registrado");
            try {
              await sendWhatsAppText({
                to: msg.from,
                text: "Ok — você não receberá mais mensagens do Portal Iluminando neste WhatsApp. Se mudar de ideia, fale com o suporte.",
                log: req.log,
              });
            } catch {
              /* ignore ack failure */
            }
          }
        }
      }
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    req.log?.error({ errMsg }, "Erro processando webhook WhatsApp");
  }
});

export default router;
