import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "@/lib/auth";
import { useAuth } from "@/context/AuthContext";

let _count = 0;
const _listeners = new Set<(n: number) => void>();

function broadcast(n: number) {
  _count = n;
  _listeners.forEach(fn => fn(n));
}

export async function fetchNotificacoesCount() {
  try {
    const res = await apiFetch("/notificacoes/nao-lidas-count");
    if (res.ok) {
      const data = await res.json();
      broadcast(data.count ?? 0);
    }
  } catch {}
}

export function useNotificacoesCount() {
  const { status } = useAuth();
  const [count, setCount] = useState(_count);

  useEffect(() => {
    _listeners.add(setCount);
    return () => { _listeners.delete(setCount); };
  }, []);

  const refetch = useCallback(() => fetchNotificacoesCount(), []);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetchNotificacoesCount();
    const interval = setInterval(fetchNotificacoesCount, 60_000);
    return () => clearInterval(interval);
  }, [status]);

  return { count, refetch };
}
