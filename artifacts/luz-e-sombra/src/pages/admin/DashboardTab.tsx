import { useState, useEffect } from "react";
import {
  Users, Loader2, MessageSquare, GraduationCap, Layers, Bell, CalendarDays,
  CreditCard, type LucideIcon,
} from "lucide-react";
import { apiFetch } from "@/lib/auth";
import { toastApiError } from "@/lib/apiError";
import { CARD, CARD_S, INPUT_ST, C, type ShowMsg, type Stats } from "./shared";

type Atalho = { label: string; tabHint: string; Icon: LucideIcon; onClick?: () => void };

export function DashboardTab({
  showMsg,
  onIrPara,
}: {
  showMsg: ShowMsg;
  onIrPara?: (aba: string) => void;
}) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [funnel, setFunnel] = useState<{ pagos: number; pendentes: number; taxaConversao: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [notiTitulo, setNotiTitulo] = useState("");
  const [notiMensagem, setNotiMensagem] = useState("");
  const [enviandoNoti, setEnviandoNoti] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [sr, fr] = await Promise.all([
          apiFetch("/usuarios/stats"),
          apiFetch("/admin/funnel-stats"),
        ]);
        if (sr.ok) setStats(await sr.json());
        if (fr.ok) {
          const f = await fr.json();
          setFunnel({
            pagos: f.pagos ?? 0,
            pendentes: f.pendentes ?? 0,
            taxaConversao: f.taxaConversao ?? 0,
          });
        }
      } catch {
        toastApiError();
      }
      setLoading(false);
    }
    void load();
  }, []);

  async function handleEnviarNotificacao(e: React.FormEvent) {
    e.preventDefault();
    if (!notiTitulo.trim() || !notiMensagem.trim()) {
      showMsg("erro", "Preencha título e mensagem.");
      return;
    }
    setEnviandoNoti(true);
    try {
      const res = await apiFetch("/notificacoes/enviar", {
        method: "POST",
        body: JSON.stringify({
          titulo: notiTitulo.trim(),
          mensagem: notiMensagem.trim(),
          tipo: "geral",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg("sucesso", `Aviso enviado para ${data.enviadas} pessoas.`);
        setNotiTitulo("");
        setNotiMensagem("");
      } else {
        showMsg("erro", data.error || "Não foi possível enviar.");
      }
    } catch {
      showMsg("erro", "Não foi possível enviar.");
    }
    setEnviandoNoti(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.gold }} />
      </div>
    );
  }

  const cards = [
    { label: "Membros", value: stats?.usuarios.ativos ?? 0, Icon: Users },
    { label: "Compras pagas", value: funnel?.pagos ?? 0, Icon: CreditCard },
    { label: "Pendentes", value: funnel?.pendentes ?? 0, Icon: CreditCard },
    { label: "Posts", value: stats?.posts ?? 0, Icon: MessageSquare },
    { label: "Cursos", value: stats?.cursos ?? 0, Icon: GraduationCap },
    { label: "Traços", value: stats?.analiseTraco ?? 0, Icon: Layers },
  ];

  const atalhos: Atalho[] = [
    { label: "Conteúdo do dia", tabHint: "conteudoDia", Icon: CalendarDays },
    { label: "Comunidade", tabHint: "comunidade", Icon: MessageSquare },
    { label: "Compras", tabHint: "compras", Icon: CreditCard },
    { label: "Usuários", tabHint: "usuarios", Icon: Users },
  ];

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {cards.map(({ label, value, Icon }) => (
          <div key={label} className="rounded-2xl p-4" style={CARD_S}>
            <div className="flex items-center justify-between mb-3">
              <Icon className="w-4 h-4" style={{ color: C.gold }} />
            </div>
            <p className="font-tan-mon-cheri text-3xl leading-none mb-1" style={{ color: C.text }}>
              {value.toLocaleString("pt-BR")}
            </p>
            <p className="text-xs" style={{ color: C.muted }}>{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {atalhos.map(({ label, tabHint, Icon }) => (
          <button
            key={tabHint}
            type="button"
            onClick={() => onIrPara?.(tabHint)}
            className="rounded-xl px-3 py-3 text-left flex items-center gap-2.5"
            style={CARD}
          >
            <Icon className="w-4 h-4 shrink-0" style={{ color: C.gold }} />
            <span className="text-xs font-semibold" style={{ color: C.text }}>{label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={(e) => void handleEnviarNotificacao(e)} className="rounded-2xl p-4 space-y-3" style={CARD}>
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4" style={{ color: C.gold }} />
          <p className="text-sm font-semibold" style={{ color: C.text }}>Avisar membros</p>
        </div>
        <input
          value={notiTitulo}
          onChange={(e) => setNotiTitulo(e.target.value)}
          placeholder="Título"
          className="w-full rounded-xl px-3 py-2.5 text-sm outline-none"
          style={INPUT_ST}
        />
        <textarea
          value={notiMensagem}
          onChange={(e) => setNotiMensagem(e.target.value)}
          placeholder="Mensagem curta"
          rows={3}
          className="w-full rounded-xl px-3 py-2.5 text-sm outline-none resize-y"
          style={INPUT_ST}
        />
        <button
          type="submit"
          disabled={enviandoNoti}
          className="px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
        >
          {enviandoNoti ? "Enviando…" : "Enviar aviso"}
        </button>
      </form>
    </div>
  );
}
