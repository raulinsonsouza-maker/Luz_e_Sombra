import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Bell, CheckCheck, ChevronRight, MessageSquare, Layers, Info } from "lucide-react";
import { apiFetch } from "@/lib/auth";
import { toastApiError } from "@/lib/apiError";
import { useNotificacoesCount } from "@/hooks/useNotificacoesCount";
import MobileTopBar from "@/components/MobileTopBar";
import PageIntroHeader from "@/components/PageIntroHeader";

type Notificacao = {
  id: number;
  titulo: string;
  mensagem: string;
  tipo: string;
  lida: boolean;
  link: string | null;
  criadoEm: string;
};

const BG = "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)";
const GOLD = "#c8a56b";
const TEXT = "#f7f2ec";
const MUTED = "rgba(247,242,236,0.45)";

function TipoIcon({ tipo }: { tipo: string }) {
  if (tipo === "comunidade") return <MessageSquare className="w-4 h-4" style={{ color: "#60a5fa" }} />;
  if (tipo === "sistema") return <Layers className="w-4 h-4" style={{ color: "#c8a56b" }} />;
  return <Info className="w-4 h-4" style={{ color: "#9c7742" }} />;
}

function formatarTempo(dt: string) {
  const diff = Date.now() - new Date(dt).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "agora";
  if (m < 60) return `${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d`;
  return new Date(dt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export default function NotificacoesPage() {
  const [, navigate] = useLocation();
  const [notifs, setNotifs] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const { refetch: refetchCount } = useNotificacoesCount();

  useEffect(() => { buscar(); }, []);

  async function buscar() {
    setLoading(true);
    try {
      const res = await apiFetch("/notificacoes");
      if (res.ok) setNotifs(await res.json());
    } catch {
      toastApiError();
    }
    setLoading(false);
  }

  async function marcarTodasLidas() {
    try {
      await apiFetch("/notificacoes/marcar-lidas", { method: "POST" });
      setNotifs(prev => prev.map(n => ({ ...n, lida: true })));
      refetchCount();
    } catch {
      toastApiError();
    }
  }

  const naoLidas = notifs.filter(n => !n.lida).length;

  return (
    <div className="min-h-screen pb-28" style={{ background: BG }}>
      <MobileTopBar />
      <div className="px-4 pt-8 pb-6 max-w-2xl mx-auto">
        <PageIntroHeader eyebrow="Central de" titulo="Notificações" className="mb-3" />
        <div className="flex items-end justify-between flex-wrap gap-3">
          {naoLidas > 0 && (
            <button
              onClick={marcarTodasLidas}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg mb-1 transition-all"
              style={{ color: GOLD, border: "1px solid rgba(200,165,107,0.25)" }}
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Marcar todas como lidas
            </button>
          )}
        </div>
        {naoLidas > 0 && (
          <p className="text-sm mt-1" style={{ color: MUTED }}>
            {naoLidas} {naoLidas === 1 ? "não lida" : "não lidas"}
          </p>
        )}
        {!loading && notifs.length > 0 && naoLidas === 0 && (
          <p className="text-sm mt-1" style={{ color: MUTED }}>Todas lidas.</p>
        )}
      </div>

      <div className="px-4 max-w-2xl mx-auto space-y-2">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: "rgba(200,165,107,0.05)" }} />
          ))
        ) : notifs.length === 0 ? (
          <div className="text-center py-20">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" style={{ color: GOLD }} />
            <p className="font-medium" style={{ color: TEXT }}>Nenhuma notificação</p>
            <p className="text-sm mt-1" style={{ color: MUTED }}>Você está em dia com tudo.</p>
          </div>
        ) : (
          notifs.map(n => (
            <div
              key={n.id}
              className="flex items-start gap-3 p-4 rounded-2xl transition-all"
              style={{
                background: n.lida ? "rgba(255,255,255,0.02)" : "rgba(200,165,107,0.07)",
                border: n.lida ? "1px solid rgba(200,165,107,0.1)" : "1.5px solid rgba(200,165,107,0.25)",
                cursor: n.link ? "pointer" : "default",
              }}
              onClick={() => { if (n.link) navigate(n.link); }}
            >
              <div className="flex flex-col items-center gap-1.5 pt-1 shrink-0">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: n.lida ? "transparent" : GOLD }}
                />
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(200,165,107,0.08)", border: "1px solid rgba(200,165,107,0.15)" }}
                >
                  <TipoIcon tipo={n.tipo} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold" style={{ color: n.lida ? MUTED : TEXT }}>{n.titulo}</p>
                  <span className="text-xs shrink-0" style={{ color: "rgba(247,242,236,0.25)" }}>
                    {formatarTempo(n.criadoEm)}
                  </span>
                </div>
                <p className="text-sm mt-0.5 leading-relaxed" style={{ color: MUTED }}>{n.mensagem}</p>
              </div>

              {n.link && (
                <ChevronRight className="w-4 h-4 shrink-0 mt-1" style={{ color: "rgba(200,165,107,0.3)" }} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
