import { useEffect, useState } from "react";
import { Loader2, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { apiFetch } from "@/lib/auth";
import { CARD, C, timeAgo } from "./shared";

interface WebhookRow {
  id: number;
  eventId: string;
  eventType: string;
  payload: unknown;
  processadoEm: string;
}

export function WebhooksTab() {
  const [rows, setRows] = useState<WebhookRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandido, setExpandido] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await apiFetch("/admin/webhooks");
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
        <h2 className="text-lg font-semibold" style={{ color: C.text }}>Webhooks Cakto</h2>
        <button type="button" onClick={load} className="text-xs flex items-center gap-1" style={{ color: C.gold }}>
          <RefreshCw className="w-3.5 h-3.5" /> Atualizar
        </button>
      </div>

      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.id} className="rounded-xl overflow-hidden" style={CARD}>
            <button
              type="button"
              className="w-full flex items-center justify-between px-4 py-3 text-left"
              onClick={() => setExpandido(expandido === r.id ? null : r.id)}
            >
              <div>
                <p className="text-sm font-medium" style={{ color: C.text }}>{r.eventType}</p>
                <p className="text-xs" style={{ color: C.muted }}>
                  {r.eventId.slice(0, 24)}… · {timeAgo(r.processadoEm)}
                </p>
              </div>
              {expandido === r.id ? <ChevronUp className="w-4 h-4" style={{ color: C.gold }} /> : <ChevronDown className="w-4 h-4" style={{ color: C.muted }} />}
            </button>
            {expandido === r.id && (
              <pre className="px-4 pb-4 text-[10px] overflow-x-auto max-h-64" style={{ color: C.muted }}>
                {JSON.stringify(r.payload, null, 2)}
              </pre>
            )}
          </div>
        ))}
        {rows.length === 0 && (
          <p className="text-center py-10 text-sm" style={{ color: C.muted }}>Nenhum webhook recebido.</p>
        )}
      </div>
    </div>
  );
}
