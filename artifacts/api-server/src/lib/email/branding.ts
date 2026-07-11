/** Nomes oficiais — alinhados ao frontend (lpConfig). */
export const EMAIL_PORTAL_NAME = "Portal Iluminando";
export const EMAIL_JOURNEY_NAME = "Jornada Da Sombra à Luz";
export const EMAIL_SUPPORT = "contato@portaliluminando.com.br";

export function primeiroNome(nome: string): string {
  return nome.trim().split(/\s+/)[0] || nome.trim();
}
