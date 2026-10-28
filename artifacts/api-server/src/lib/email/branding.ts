import { MARCA } from "@workspace/copy-voz";

/** Nomes oficiais — a mesma fonte da landing. */
export const EMAIL_PORTAL_NAME = MARCA.portal;
export const EMAIL_JOURNEY_NAME = MARCA.jornada;
export const EMAIL_SUPPORT = "contato@portaliluminando.com.br";

export function primeiroNome(nome: string): string {
  return nome.trim().split(/\s+/)[0] || nome.trim();
}
