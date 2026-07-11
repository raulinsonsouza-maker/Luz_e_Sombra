import { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { apiFetch } from "@/lib/auth";
import { CARD, C, timeAgo, type ShowMsg } from "./shared";

interface CompraRow {
  id: number;
  usuarioId: number;
  checkoutToken: string;
  status: string;
  variant: string;
  valor: string | null;
  metodoPagamento: string | null;
  utmSource: string | null;
  utmCampaign: string | null;
  criadoEm: string;
  pagoEm: string | null;
  nome: string;
  email: string | null;
  statusAcesso: string;
  ativo: boolean;
}

const STATUS_STYLE: Record<string, { color: string; label: string }> = {
  pending: { color: "#fbbf24", label: "Pendente" },
  paid: { color: "#4ade80", label: "Pago" },
  refunded: { color: "#f87171", label: "Revogado" },
};

export function ComprasTab({ showMsg }: { showMsg: ShowMsg }) {
  const [rows, setRows] = useState<CompraRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [acaoId, setAcaoId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await apiFetch("/admin/compras");
      if (res.ok) setRows(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function alterarAcesso(usuarioId: number, acao: "grant" | "revoke") {
    setAcaoId(usuarioId);
    try {
      const res = await apiFetch(`/admin/usuarios/${usuarioId}/acesso`, {
        method: "POST",
        body: JSON.stringify({ acao }),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg("sucesso", acao === "grant" ? "Acesso concedido" : "Acesso revogado");
        load();
      } else {
        showMsg("erro", data.error || "Erro na operação");
      }
    } catch {
      showMsg("erro", "Erro de conexão");
    }
    setAcaoId(null);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.gold }} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold" style={{ color: C.text }}>Compras Cakto</h2>
        <button type="button" onClick={load} className="text-xs flex items-center gap-1" style={{ color: C.gold }}>
          <RefreshCw className="w-3.5 h-3.5" /> Atualizar
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl" style={CARD}>
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(200,165,107,0.12)" }}>
              {["Cliente", "Status", "UTM", "Data", "Ações"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider" style={{ color: C.muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const st = STATUS_STYLE[r.status] ?? { color: C.muted, label: r.status };
              return (
                <tr key={r.id} style={{ borderBottom: "1px solid rgba(200,165,107,0.06)" }}>
                  <td className="px-4 py-3">
                    <p className="font-medium" style={{ color: C.text }}>{r.nome}</p>
                    <p className="text-xs" style={{ color: C.muted }}>{r.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ color: st.color, background: `${st.color}18` }}>
                      {st.label}
                    </span>
                    <p className="text-[10px] mt-1" style={{ color: C.dim }}>{r.statusAcesso}</p>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: C.muted }}>
                    {r.utmSource || "—"}
                    {r.utmCampaign && <span className="block text-[10px]">{r.utmCampaign}</span>}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: C.muted }}>
                    {timeAgo(r.criadoEm)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {!r.ativo && (
                        <button
                          type="button"
                          disabled={acaoId === r.usuarioId}
                          onClick={() => alterarAcesso(r.usuarioId, "grant")}
                          className="text-xs px-2 py-1 rounded-lg flex items-center gap-1"
                          style={{ background: "rgba(74,222,128,0.1)", color: "#4ade80" }}
                        >
                          <CheckCircle className="w-3 h-3" /> Conceder
                        </button>
                      )}
                      {r.ativo && (
                        <button
                          type="button"
                          disabled={acaoId === r.usuarioId}
                          onClick={() => alterarAcesso(r.usuarioId, "revoke")}
                          className="text-xs px-2 py-1 rounded-lg flex items-center gap-1"
                          style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}
                        >
                          <XCircle className="w-3 h-3" /> Revogar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="text-center py-10 text-sm" style={{ color: C.muted }}>Nenhuma compra registrada.</p>
        )}
      </div>
    </div>
  );
}
