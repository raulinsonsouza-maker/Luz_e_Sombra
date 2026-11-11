import { safeLocalStorage } from "@/lib/safeStorage";

export interface User {
  id: number;
  username: string;
  nome: string;
  email: string | null;
  primeiroAcesso: boolean;
  isAdmin: boolean;
  dataNascimento: string | null;
  fotoPerfil: string | null;
  acessoInicio?: string | null;
  acessoAte?: string | null;
  garantiaAte?: string | null;
  diasRestantes?: number | null;
  statusAcesso?: string;
}

const TOKEN_KEY = "luz_e_sombra_token";
const USER_KEY = "luz_e_sombra_user";

export function getToken(): string | null {
  try {
    return safeLocalStorage().getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getStoredUser(): User | null {
  try {
    const s = safeLocalStorage().getItem(USER_KEY);
    if (!s) return null;
    return JSON.parse(s) as User;
  } catch {
    return null;
  }
}

export function setAuth(token: string, user: User) {
  try {
    const store = safeLocalStorage();
    store.setItem(TOKEN_KEY, token);
    store.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    /* WebView sem storage */
  }
}

export function clearAuth() {
  try {
    const store = safeLocalStorage();
    store.removeItem(TOKEN_KEY);
    store.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
}

export function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const headers = {
    "Content-Type": "application/json",
    ...authHeaders(),
    ...(options.headers || {}),
  };
  return fetch(`/api${path}`, { ...options, headers });
}

/** GET com Bearer (sem forçar Content-Type — uso em imagens/binários autenticados). */
export function apiFetchGet(path: string): Promise<Response> {
  return fetch(`/api${path}`, { headers: { ...authHeaders() } as HeadersInit });
}
