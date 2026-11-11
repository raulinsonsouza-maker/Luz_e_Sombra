import { useEffect, useState } from "react";
import { CreditCard, Loader2, RefreshCw, Unplug } from "lucide-react";
import { apiFetch } from "@/lib/auth";
import { CARD, C, type ShowMsg } from "./shared";

interface MpStatus {
  appConfigured: boolean;
  redirectUri: string;
  connected: boolean;
  mpUserId: string | null;
  publicKeyConfigured: boolean;
  expiresAt: string | null;
  connectedAt: string | null;
  fundadoresPaid: number;
  fundadoresCap: number;
  fundadoresRestantes: number;
  edicaoEspecialAtiva: boolean;
}

export function PagamentosTab({ showMsg }: { showMsg: ShowMsg }) {
  const [status, setStatus] = useState<MpStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [accessToken, setAccessToken] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await apiFetch("/admin/mercadopago/status");
      if (res.ok) setStatus(await res.json());
      else showMsg("erro", "Não foi possível carregar o status do Mercado Pago.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("mp") === "connected") showMsg("sucesso", "Mercado Pago conectado.");
    if (params.get("mp") === "error") showMsg("erro", "Falha ao conectar Mercado Pago.");
    load();
  }, []);

  async function conectar() {
    setBusy(true);
    try {
      const res = await apiFetch("/admin/mercadopago/oauth/start");
      const data = await res.json();
      if (!res.ok || !data.url) {
        showMsg("erro", data.error || "Não foi possível iniciar o OAuth.");
        return;
      }
      window.location.href = data.url;
    } finally {
      setBusy(false);
    }
  }

  async function desconectar() {
    if (!confirm("Desconectar a conta Mercado Pago?")) return;
    setBusy(true);
    try {
      const res = await apiFetch("/admin/mercadopago/disconnect", { method: "POST" });
      if (res.ok) {
        showMsg("sucesso", "Mercado Pago desconectado.");
        await load();
      } else {
        showMsg("erro", "Falha ao desconectar.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function salvarCredenciais() {
    setBusy(true);
    try {
      const res = await apiFetch("/admin/mercadopago/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, publicKey }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        showMsg("sucesso", "Credenciais salvas. Checkout liberado.");
        setAccessToken("");
        setPublicKey("");
        await load();
      } else {
        showMsg("erro", data.error || "Falha ao salvar credenciais.");
      }
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.gold }} />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: C.cream }}>
            Pagamentos
          </h2>
          <p className="text-sm mt-1" style={{ color: "rgba(247,242,236,0.5)" }}>
            Portal-Iluminando · cole as credenciais de produção ou conecte via OAuth.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="p-2 rounded-lg"
          style={{ border: `1px solid ${C.border}`, color: C.gold }}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="rounded-2xl p-5 space-y-4" style={CARD}>
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5" style={{ color: C.gold }} />
          <div>
            <p className="font-medium" style={{ color: C.cream }}>
              Mercado Pago
            </p>
            <p className="text-xs" style={{ color: "rgba(247,242,236,0.45)" }}>
              {status?.connected ? "Conectado" : "Desconectado"}
              {status?.mpUserId ? ` · user ${status.mpUserId}` : ""}
              {status?.publicKeyConfigured ? " · public key ok" : ""}
            </p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(200,165,107,0.7)" }}>
            Credenciais da aplicação
          </p>
          <input
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder="Public Key (APP_USR-...)"
            className="w-full rounded-xl px-3 py-2.5 text-sm bg-transparent outline-none"
            style={{ border: `1px solid ${C.border}`, color: C.cream }}
            autoComplete="off"
          />
          <input
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            placeholder="Access Token (APP_USR-...)"
            className="w-full rounded-xl px-3 py-2.5 text-sm bg-transparent outline-none"
            style={{ border: `1px solid ${C.border}`, color: C.cream }}
            autoComplete="off"
            type="password"
          />
          <button
            type="button"
            disabled={busy || !publicKey.trim() || !accessToken.trim()}
            onClick={salvarCredenciais}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#9c7742,#c8a56b)", color: "#fff" }}
          >
            {busy ? "Salvando..." : "Salvar e ativar checkout"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2" style={{ borderTop: `1px solid ${C.border}` }}>
          {status?.appConfigured && (
            <button
              type="button"
              disabled={busy}
              onClick={conectar}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
              style={{ border: `1px solid ${C.border}`, color: C.gold }}
            >
              Ou conectar via OAuth
            </button>
          )}
          {status?.connected && (
            <button
              type="button"
              disabled={busy}
              onClick={desconectar}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
              style={{ border: `1px solid ${C.border}`, color: "#f87171" }}
            >
              <Unplug className="w-4 h-4" />
              Desconectar
            </button>
          )}
        </div>

        <p className="text-xs break-all" style={{ color: "rgba(247,242,236,0.35)" }}>
          OAuth redirect: {status?.redirectUri}
        </p>
      </div>

      <div className="rounded-2xl p-5" style={CARD}>
        <p className="text-sm font-medium" style={{ color: C.cream }}>
          Membros Fundadores
        </p>
        <p className="text-2xl font-semibold mt-2" style={{ color: C.gold }}>
          {status?.fundadoresPaid ?? 0}
          <span className="text-base font-normal" style={{ color: "rgba(247,242,236,0.45)" }}>
            {" "}/ {status?.fundadoresCap ?? 111}
          </span>
        </p>
        <p className="text-xs mt-2" style={{ color: "rgba(247,242,236,0.45)" }}>
          Badge informativo. A venda continua depois dos 111.
          {status?.edicaoEspecialAtiva
            ? ` Restam ${status.fundadoresRestantes} badges.`
            : " Edição especial encerrada; checkout segue no lançamento."}
        </p>
      </div>
    </div>
  );
}
