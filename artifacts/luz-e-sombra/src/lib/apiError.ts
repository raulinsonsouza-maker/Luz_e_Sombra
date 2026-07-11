import { toast } from "sonner";

/** Exibe toast de erro de API/rede; use no lugar de `catch {}` vazio. */
export function toastApiError(fallback = "Não foi possível carregar os dados. Tente novamente."): void {
  toast.error(fallback);
}
