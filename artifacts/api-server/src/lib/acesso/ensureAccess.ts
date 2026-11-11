import { db } from "@workspace/db";
import { usuariosTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { diasRestantes, isAccessExpired } from "./periodo";

export type AccessSnapshot = {
  statusAcesso: string;
  ativo: boolean;
  acessoInicio: Date | null;
  acessoAte: Date | null;
  garantiaAte: Date | null;
  diasRestantes: number | null;
  expired: boolean;
};

/**
 * Avalia e, se necessário, marca statusAcesso=expired (lazy).
 * Legado sem acessoAte continua válido enquanto ativo/active.
 */
export async function ensureAccessValid(usuario: {
  id: number;
  ativo: boolean;
  statusAcesso: string;
  acessoInicio?: Date | null;
  acessoAte?: Date | null;
  garantiaAte?: Date | null;
  isAdmin?: boolean;
}): Promise<AccessSnapshot> {
  const acessoInicio = usuario.acessoInicio ?? null;
  const acessoAte = usuario.acessoAte ?? null;
  const garantiaAte = usuario.garantiaAte ?? null;

  if (usuario.isAdmin) {
    return {
      statusAcesso: usuario.statusAcesso,
      ativo: true,
      acessoInicio,
      acessoAte,
      garantiaAte,
      diasRestantes: diasRestantes(acessoAte),
      expired: false,
    };
  }

  if (usuario.statusAcesso === "revoked" || !usuario.ativo) {
    return {
      statusAcesso: usuario.statusAcesso === "revoked" ? "revoked" : usuario.statusAcesso,
      ativo: false,
      acessoInicio,
      acessoAte,
      garantiaAte,
      diasRestantes: diasRestantes(acessoAte),
      expired: false,
    };
  }

  if (isAccessExpired(acessoAte)) {
    if (usuario.statusAcesso !== "expired") {
      await db
        .update(usuariosTable)
        .set({ statusAcesso: "expired", ativo: false, atualizadoEm: new Date() })
        .where(eq(usuariosTable.id, usuario.id));
    }
    return {
      statusAcesso: "expired",
      ativo: false,
      acessoInicio,
      acessoAte,
      garantiaAte,
      diasRestantes: 0,
      expired: true,
    };
  }

  return {
    statusAcesso: usuario.statusAcesso,
    ativo: usuario.ativo,
    acessoInicio,
    acessoAte,
    garantiaAte,
    diasRestantes: diasRestantes(acessoAte),
    expired: false,
  };
}

export function accessFieldsForClient(snap: AccessSnapshot) {
  return {
    acessoInicio: snap.acessoInicio ? snap.acessoInicio.toISOString() : null,
    acessoAte: snap.acessoAte ? snap.acessoAte.toISOString() : null,
    garantiaAte: snap.garantiaAte ? snap.garantiaAte.toISOString() : null,
    diasRestantes: snap.diasRestantes,
    statusAcesso: snap.statusAcesso,
  };
}
