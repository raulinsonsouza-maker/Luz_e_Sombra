/** Só dígitos. */
export function digitsOnlyCpf(value: string): string {
  return value.replace(/\D/g, "");
}

export function formatCpf(value: string): string {
  const d = digitsOnlyCpf(value).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function isValidCpf(raw: string): boolean {
  const cpf = digitsOnlyCpf(raw);
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  const calc = (base: string, factor: number) => {
    let total = 0;
    for (let i = 0; i < base.length; i++) total += Number(base[i]) * (factor - i);
    const rest = (total * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  const d1 = calc(cpf.slice(0, 9), 10);
  const d2 = calc(cpf.slice(0, 10), 11);
  return d1 === Number(cpf[9]) && d2 === Number(cpf[10]);
}

export const PENDING_CHECKOUT_CPF_KEY = "pending_checkout_cpf";
