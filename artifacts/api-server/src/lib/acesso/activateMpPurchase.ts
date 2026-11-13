import { db } from "@workspace/db";
import {
  comprasMpTable,
  comprasCaktoTable,
  usuariosTable,
} from "@workspace/db/schema";
import { and, count, desc, eq } from "drizzle-orm";
import type { Logger } from "pino";
import { sendAccessGrantedEmail, sendAccessRevokedEmail } from "../email";
import { queueSendAccessGrantedWhatsApp } from "../whatsapp";
import {
  FUNDADORES_CAP,
  computeAccessWindow,
} from "./periodo";

export async function countFundadoresPaid(): Promise<number> {
  const [row] = await db
    .select({ total: count() })
    .from(comprasMpTable)
    .where(and(eq(comprasMpTable.status, "paid"), eq(comprasMpTable.variant, "fundadores")));
  return Number(row?.total ?? 0);
}

export async function nextPurchaseVariant(): Promise<"fundadores" | "lancamento"> {
  const used = await countFundadoresPaid();
  return used < FUNDADORES_CAP ? "fundadores" : "lancamento";
}

export async function activateMpPurchase(params: {
  checkoutToken?: string | null;
  email?: string | null;
  mpPaymentId?: string | null;
  paymentMethod?: string | null;
  pagoEm?: Date;
  log?: Logger;
}): Promise<number | null> {
  let compraId: number | null = null;
  let usuarioId: number | null = null;
  let alreadyPaid = false;

  if (params.checkoutToken) {
    const [byToken] = await db
      .select({
        id: comprasMpTable.id,
        usuarioId: comprasMpTable.usuarioId,
        status: comprasMpTable.status,
        variant: comprasMpTable.variant,
      })
      .from(comprasMpTable)
      .where(eq(comprasMpTable.checkoutToken, params.checkoutToken))
      .limit(1);
    if (byToken) {
      compraId = byToken.id;
      usuarioId = byToken.usuarioId;
      alreadyPaid = byToken.status === "paid";
    }
  }

  if (!usuarioId && params.mpPaymentId) {
    const [byPayment] = await db
      .select({
        id: comprasMpTable.id,
        usuarioId: comprasMpTable.usuarioId,
        status: comprasMpTable.status,
      })
      .from(comprasMpTable)
      .where(eq(comprasMpTable.mpPaymentId, params.mpPaymentId))
      .limit(1);
    if (byPayment) {
      compraId = byPayment.id;
      usuarioId = byPayment.usuarioId;
      alreadyPaid = byPayment.status === "paid";
    }
  }

  if (!usuarioId && params.email) {
    const [user] = await db
      .select({ id: usuariosTable.id })
      .from(usuariosTable)
      .where(eq(usuariosTable.email, params.email.trim().toLowerCase()))
      .limit(1);
    if (user) {
      usuarioId = user.id;
      const [compra] = await db
        .select({ id: comprasMpTable.id, status: comprasMpTable.status })
        .from(comprasMpTable)
        .where(eq(comprasMpTable.usuarioId, user.id))
        .orderBy(desc(comprasMpTable.criadoEm))
        .limit(1);
      if (compra) {
        compraId = compra.id;
        alreadyPaid = compra.status === "paid";
      }
    }
  }

  if (!usuarioId) return null;

  // Idempotente: se já pago, não alonga o prazo.
  if (alreadyPaid) {
    if (params.mpPaymentId && compraId) {
      await db
        .update(comprasMpTable)
        .set({
          mpPaymentId: params.mpPaymentId,
          metodoPagamento: params.paymentMethod ?? undefined,
          atualizadoEm: new Date(),
        })
        .where(eq(comprasMpTable.id, compraId));
    }
    return usuarioId;
  }

  const pagoEm = params.pagoEm ?? new Date();
  const window = computeAccessWindow(pagoEm);
  const variant = await nextPurchaseVariant();

  await db
    .update(usuariosTable)
    .set({
      ativo: true,
      statusAcesso: "active",
      acessoInicio: window.acessoInicio,
      acessoAte: window.acessoAte,
      garantiaAte: window.garantiaAte,
      atualizadoEm: new Date(),
    })
    .where(eq(usuariosTable.id, usuarioId));

  if (compraId) {
    await db
      .update(comprasMpTable)
      .set({
        status: "paid",
        mpPaymentId: params.mpPaymentId ?? undefined,
        metodoPagamento: params.paymentMethod ?? undefined,
        pagoEm,
        variant,
        acessoInicio: window.acessoInicio,
        acessoAte: window.acessoAte,
        garantiaAte: window.garantiaAte,
        atualizadoEm: new Date(),
      })
      .where(eq(comprasMpTable.id, compraId));
  }

  // Espelha status na compra Cakto legada (mesmo token) para admin antigo.
  if (params.checkoutToken) {
    await db
      .update(comprasCaktoTable)
      .set({
        status: "paid",
        metodoPagamento: params.paymentMethod ?? undefined,
        pagoEm,
        atualizadoEm: new Date(),
      })
      .where(eq(comprasCaktoTable.checkoutToken, params.checkoutToken));
  }

  const [usuario] = await db
    .select({
      id: usuariosTable.id,
      nome: usuariosTable.nome,
      email: usuariosTable.email,
      telefone: usuariosTable.telefone,
    })
    .from(usuariosTable)
    .where(eq(usuariosTable.id, usuarioId))
    .limit(1);

  if (usuario?.email) {
    sendAccessGrantedEmail(
      {
        usuarioId: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        acessoAte: window.acessoAte,
      },
      params.log,
    );
    queueSendAccessGrantedWhatsApp(
      {
        usuarioId: usuario.id,
        nome: usuario.nome,
        telefone: usuario.telefone,
        checkoutToken: params.checkoutToken ?? undefined,
        mpPaymentId: params.mpPaymentId ?? null,
        compraId,
      },
      params.log,
    );
  }

  return usuarioId;
}

export async function revokeMpPurchase(params: {
  checkoutToken?: string | null;
  email?: string | null;
  mpPaymentId?: string | null;
  log?: Logger;
}): Promise<{ usuarioId: number; email: string | null; nome: string } | null> {
  let usuarioId: number | null = null;
  let checkoutToken: string | null = params.checkoutToken ?? null;

  if (params.checkoutToken) {
    const [byToken] = await db
      .select({ usuarioId: comprasMpTable.usuarioId })
      .from(comprasMpTable)
      .where(eq(comprasMpTable.checkoutToken, params.checkoutToken))
      .limit(1);
    if (byToken) usuarioId = byToken.usuarioId;
  }

  if (!usuarioId && params.mpPaymentId) {
    const [byPayment] = await db
      .select({
        usuarioId: comprasMpTable.usuarioId,
        checkoutToken: comprasMpTable.checkoutToken,
      })
      .from(comprasMpTable)
      .where(eq(comprasMpTable.mpPaymentId, params.mpPaymentId))
      .limit(1);
    if (byPayment) {
      usuarioId = byPayment.usuarioId;
      checkoutToken = byPayment.checkoutToken;
    }
  }

  if (!usuarioId && params.email) {
    const [user] = await db
      .select({ id: usuariosTable.id })
      .from(usuariosTable)
      .where(eq(usuariosTable.email, params.email.trim().toLowerCase()))
      .limit(1);
    if (user) usuarioId = user.id;
  }

  if (!usuarioId) return null;

  const [usuario] = await db
    .select({ id: usuariosTable.id, email: usuariosTable.email, nome: usuariosTable.nome })
    .from(usuariosTable)
    .where(eq(usuariosTable.id, usuarioId))
    .limit(1);

  if (!usuario) return null;

  await db
    .update(usuariosTable)
    .set({
      ativo: false,
      statusAcesso: "revoked",
      atualizadoEm: new Date(),
    })
    .where(eq(usuariosTable.id, usuarioId));

  await db
    .update(comprasMpTable)
    .set({ status: "refunded", atualizadoEm: new Date() })
    .where(eq(comprasMpTable.usuarioId, usuarioId));

  if (checkoutToken) {
    await db
      .update(comprasCaktoTable)
      .set({ status: "refunded", atualizadoEm: new Date() })
      .where(eq(comprasCaktoTable.checkoutToken, checkoutToken));
  }

  if (usuario.email) {
    sendAccessRevokedEmail(
      { usuarioId: usuario.id, nome: usuario.nome, email: usuario.email },
      params.log,
    );
  }

  return { usuarioId: usuario.id, email: usuario.email, nome: usuario.nome };
}
