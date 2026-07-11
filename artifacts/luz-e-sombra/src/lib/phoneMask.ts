/** Mantém só dígitos (máx. 11 para celular BR). */
export function digitsOnlyPhone(value: string): string {
  return value.replace(/\D/g, "").slice(0, 11);
}

/** Formata enquanto digita: (DD) 9XXXX-XXXX ou (DD) XXXX-XXXX */
export function formatBrazilPhone(value: string): string {
  const digits = digitsOnlyPhone(value);
  if (!digits) return "";

  const ddd = digits.slice(0, 2);
  const rest = digits.slice(2);
  const isMobile = rest.startsWith("9") || digits.length > 10;

  if (digits.length <= 2) return `(${digits}`;

  if (digits.length <= 6) {
    return `(${ddd}) ${rest}`;
  }

  if (isMobile) {
    if (digits.length <= 10) {
      return `(${ddd}) ${rest.slice(0, 5)}${rest.length > 5 ? `-${rest.slice(5)}` : ""}`;
    }
    return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5, 9)}`;
  }

  if (digits.length <= 10) {
    return `(${ddd}) ${rest.slice(0, 4)}${rest.length > 4 ? `-${rest.slice(4)}` : ""}`;
  }

  return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4, 8)}`;
}

export function isValidBrazilPhone(value: string): boolean {
  const digits = digitsOnlyPhone(value);
  return digits.length === 10 || digits.length === 11;
}
