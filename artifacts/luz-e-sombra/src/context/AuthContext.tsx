import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, getStoredUser, getToken, clearAuth, setAuth, apiFetch } from "@/lib/auth";
import { clearTracoSessionStorage } from "@/lib/tracoFormStorage";

interface AuthContextType {
  user: User | null;
  status: "loading" | "authenticated" | "unauthenticated";
  login: (username: string, password: string) => Promise<{
    ok: boolean;
    error?: string;
    code?: string;
    checkoutToken?: string | null;
    primeiroAcesso?: boolean;
  }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setStatus("unauthenticated");
      return;
    }
    try {
      const res = await apiFetch("/auth/session");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setAuth(token, data.user);
        setStatus("authenticated");
      } else {
        clearAuth();
        setUser(null);
        setStatus("unauthenticated");
      }
    } catch {
      const stored = getStoredUser();
      if (stored) {
        setUser(stored);
        setStatus("authenticated");
      } else {
        clearAuth();
        setUser(null);
        setStatus("unauthenticated");
      }
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setAuth(data.token, data.user);
        setUser(data.user);
        setStatus("authenticated");
        return { ok: true, primeiroAcesso: data.user?.primeiroAcesso === true };
      }
      if (res.status === 402) {
        return {
          ok: false,
          error: data.error || "Pagamento pendente.",
          code: "pagamento_pendente",
          checkoutToken: data.checkoutToken ?? null,
        };
      }
      if (res.status === 403 && data.code === "acesso_revogado") {
        return {
          ok: false,
          error: data.error || "Acesso encerrado.",
          code: "acesso_revogado",
        };
      }
      return { ok: false, error: data.error || "Erro ao fazer login" };
    } catch {
      return { ok: false, error: "Erro de conexão. Tente novamente." };
    }
  }, []);

  const logout = useCallback(() => {
    clearTracoSessionStorage();
    clearAuth();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      const token = getToken();
      if (token) setAuth(token, updated);
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, login, logout, refreshUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
