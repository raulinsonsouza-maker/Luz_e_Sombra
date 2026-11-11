/** Valida data ISO YYYY-MM-DD para cadastro / numerologia. */
export function isValidDataNascimento(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  if (
    Number.isNaN(dt.getTime()) ||
    dt.getUTCFullYear() !== y ||
    dt.getUTCMonth() !== m - 1 ||
    dt.getUTCDate() !== d
  ) {
    return false;
  }
  const today = new Date();
  const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  if (dt.getTime() > todayUtc) return false;
  if (y < 1900) return false;
  return true;
}

/** Só dígitos da data (máx. 8 → DDMMAAAA). */
export function digitsOnlyDate(value: string): string {
  return value.replace(/\D/g, "").slice(0, 8);
}

/** Formata enquanto digita: DD/MM/AAAA */
export function formatBrazilDate(value: string): string {
  const digits = digitsOnlyDate(value);
  if (!digits) return "";
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/** ISO YYYY-MM-DD → DD/MM/AAAA (exibição). */
export function isoToBrazilDate(iso: string | null | undefined): string {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/** DD/MM/AAAA → ISO YYYY-MM-DD, ou "" se incompleto/inválido. */
export function brazilDateToIso(value: string): string {
  const digits = digitsOnlyDate(value);
  if (digits.length !== 8) return "";
  const d = digits.slice(0, 2);
  const m = digits.slice(2, 4);
  const y = digits.slice(4, 8);
  const iso = `${y}-${m}-${d}`;
  return isValidDataNascimento(iso) ? iso : "";
}

/** True se o texto BR está completo e válido. */
export function isValidBrazilDate(value: string): boolean {
  return brazilDateToIso(value) !== "";
}
