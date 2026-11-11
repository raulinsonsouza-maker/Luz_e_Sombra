/** Constantes da oferta atual (pagamento único time-boxed). */
export const ACESSO_MESES = 6;
export const GARANTIA_DIAS = 7;
export const FUNDADORES_CAP = 111;
export const PRECO_OFERTA = "111.11";
export const PRECO_OFERTA_NUM = 111.11;

/** Soma meses calendário; se o dia não existir no mês alvo, usa o último dia. */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date.getTime());
  const day = result.getDate();
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(day, lastDay));
  return result;
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setDate(result.getDate() + days);
  return result;
}

export function computeAccessWindow(pagoEm: Date = new Date()): {
  acessoInicio: Date;
  acessoAte: Date;
  garantiaAte: Date;
} {
  const acessoInicio = new Date(pagoEm.getTime());
  return {
    acessoInicio,
    acessoAte: addMonths(acessoInicio, ACESSO_MESES),
    garantiaAte: addDays(acessoInicio, GARANTIA_DIAS),
  };
}

export function diasRestantes(acessoAte: Date | null | undefined, now: Date = new Date()): number | null {
  if (!acessoAte) return null;
  const ms = acessoAte.getTime() - now.getTime();
  if (ms <= 0) return 0;
  return Math.ceil(ms / (24 * 60 * 60 * 1000));
}

export function isAccessExpired(
  acessoAte: Date | null | undefined,
  now: Date = new Date(),
): boolean {
  if (!acessoAte) return false;
  return now.getTime() >= acessoAte.getTime();
}

export function formatDatePt(date: Date): string {
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}
