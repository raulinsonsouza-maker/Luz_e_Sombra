import { Router, type Request, type Response } from "express";
import { getWhatsAppConfig } from "../../lib/whatsapp/config";
import { verifyWhatsAppSignature, sendWhatsAppText } from "../../lib/whatsapp/client";
import {
  markJaPagueiByPhone,
  setWhatsAppComunidadeOptInByPhone,
  setWhatsAppOptOutByPhone,
} from "../../lib/whatsapp/outbound";

const router = Router();

type RawBodyRequest = Request & { rawBody?: Buffer };

router.get("/whatsapp", (req: Request, res: Response) => {
  const cfg = getWhatsAppConfig();
  const mode = String(req.query["hub.mode"] ?? "");
  const token = String(req.query["hub.verify_token"] ?? "");
  const challenge = String(req.query["hub.challenge"] ?? "");

  if (mode === "subscribe" && cfg.verifyToken && token === cfg.verifyToken) {
    req.log?.info("WhatsApp webhook verificado");
    return res.status(200).send(challenge);
  }

  return res.status(403).json({ error: "Verify token invalido" });
});

router.post("/whatsapp", async (req: RawBodyRequest, res: Response) => {
  const signature = req.header("x-hub-signature-256") ?? undefined;
  const raw = req.rawBody;
  if (raw && !verifyWhatsAppSignature(raw, signature)) {
    req.log?.warn("WhatsApp webhook assinatura invalida");
    res.status(401).json({ error: "Assinatura invalida" });
    return;
  }

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
              button?: { text?: string; payload?: string };
              interactive?: {
                type?: string;
                button_reply?: { id?: string; title?: string };
                list_reply?: { id?: string; title?: string };
              };
            }>;
          };
        }>;
      }>;
    };

    if (body.object !== "whatsapp_business_account") {
      return;
    }

    for (const entry of body.entry ?? []) {
      for (const change of entry.changes ?? []) {
        for (const msg of change.value?.messages ?? []) {
          if (!msg.from) continue;

          let text = "";
          if (msg.type === "text" && msg.text?.body) {
            text = msg.text.body.trim().toLowerCase();
          } else if (msg.type === "button") {
            text = (msg.button?.payload || msg.button?.text || "").trim().toLowerCase();
          } else if (msg.type === "interactive") {
            text = (
              msg.interactive?.button_reply?.title ||
              msg.interactive?.button_reply?.id ||
              msg.interactive?.list_reply?.title ||
              ""
            )
              .trim()
              .toLowerCase();
          }

          if (!text) continue;

          if (
            text === "parar" ||
            text === "stop" ||
            text === "sair" ||
            text === "cancelar" ||
            text === "pare"
          ) {
            const n = await setWhatsAppOptOutByPhone(msg.from, true);
            req.log?.info({ from: msg.from, updated: n }, "WhatsApp opt-out");
            await sendWhatsAppText({
              to: msg.from,
              text: "Ok — voce nao recebera mais mensagens do Portal Iluminando neste WhatsApp.",
              log: req.log,
            }).catch(() => undefined);
          } else if (
            text === "parar posts" ||
            text === "parar comunidade" ||
            text === "parar posts." ||
            text.includes("parar post")
          ) {
            const n = await setWhatsAppComunidadeOptInByPhone(msg.from, false);
            req.log?.info({ from: msg.from, updated: n }, "WhatsApp comunidade opt-out");
            await sendWhatsAppText({
              to: msg.from,
              text: "Ok — paramos os avisos de novas publicacoes da comunidade.",
              log: req.log,
            }).catch(() => undefined);
          } else if (text === "ja paguei" || text === "já paguei" || text.includes("paguei")) {
            const n = await markJaPagueiByPhone(msg.from);
            req.log?.info({ from: msg.from, updated: n }, "WhatsApp Ja paguei");
            await sendWhatsAppText({
              to: msg.from,
              text: "Obrigado! Assim que o pagamento for confirmado, seu acesso e liberado automaticamente.",
              log: req.log,
            }).catch(() => undefined);
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
