import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { apiFetch } from "@/lib/auth";
import { CARD, C, timeAgo } from "./shared";

interface EmailRow {
  id: number;
  destinatario: string;
  template: string;
  assunto: string;
  status: string;
  erro: string | null;
  criadoEm: string;
}

const STATUS_COLOR: Record<string, string> = {
  sent: "#4ade80",
  failed: "#f87171",
  skipped: "#fbbf24",
};

export function EmailsTab() {
  const [rows, setRows] = useState<EmailRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await apiFetch("/admin/emails");
      if (res.ok) setRows(await res.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

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
        <h2 className="text-lg font-semibold" style={{ color: C.text }}>E-mails enviados</h2>
        <button type="button" onClick={load} className="text-xs flex items-center gap-1" style={{ color: C.gold }}>
          <RefreshCw className="w-3.5 h-3.5" /> Atualizar
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl" style={CARD}>
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(200,165,107,0.12)" }}>
              {["Destinatário", "Template", "Status", "Quando"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs uppercase tracking-wider" style={{ color: C.muted }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid rgba(200,165,107,0.06)" }}>
                <td className="px-4 py-3">
                  <p className="text-xs" style={{ color: C.text }}>{r.destinatario}</p>
                  <p className="text-[10px] truncate max-w-[200px]" style={{ color: C.dim }}>{r.assunto}</p>
                </td>
                <td className="px-4 py-3 text-xs font-mono" style={{ color: C.bronze }}>{r.template}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-semibold" style={{ color: STATUS_COLOR[r.status] ?? C.muted }}>
                    {r.status}
                  </span>
                  {r.erro && <p className="text-[10px] mt-0.5 max-w-xs truncate" style={{ color: "#f87171" }}>{r.erro}</p>}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: C.muted }}>{timeAgo(r.criadoEm)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="text-center py-10 text-sm" style={{ color: C.muted }}>Nenhum e-mail registrado.</p>
        )}
      </div>
    </div>
  );
}
