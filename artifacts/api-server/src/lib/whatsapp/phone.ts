/** Mantém só dígitos (máx. 13 com DDI 55). */
export function digitsOnlyPhone(value: string): string {
  return value.replace(/\D/g, "").slice(0, 13);
}

/**
 * Normaliza telefone BR para E.164 (+55...).
 * Aceita (11) 99999-9999, 11999999999, 5511999999999, +5511999999999.
 */
export function normalizeBrazilPhoneE164(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;

  let digits = digitsOnlyPhone(value);
  if (!digits) return null;

  if (digits.startsWith("55") && digits.length >= 12) {
    digits = digits.slice(2);
  }

  if (digits.length !== 10 && digits.length !== 11) {
    return null;
  }

  return `+55${digits}`;
}

/** Cloud API espera dígitos com DDI, sem +. */
export function toWhatsAppRecipient(value: string | null | undefined): string | null {
  const e164 = normalizeBrazilPhoneE164(value);
  if (!e164) return null;
  return e164.replace(/\D/g, "");
}

export function firstNameFromFullName(nome: string): string {
  const trimmed = nome.trim();
  if (!trimmed) return "Cliente";
  return trimmed.split(/\s+/)[0] ?? trimmed;
}
