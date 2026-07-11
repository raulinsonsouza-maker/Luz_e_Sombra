import { useState, useEffect, useRef } from "react";
import {
  Users, Plus, Edit2, Trash2, Check, X, Loader2, Search, CheckCircle, AlertCircle,
  MessageSquare, GraduationCap, FileText, Youtube, ImageIcon, BookOpen,
  ChevronDown, ChevronUp, Eye, EyeOff, LayoutDashboard, Shield, TrendingUp,
  UserCheck, Layers, Heart, Flame, Sparkles, Star, Sun, Bell, type LucideIcon,
} from "lucide-react";
import { apiFetch } from "@/lib/auth";
import { AuthenticatedImage } from "@/components/AuthenticatedImage";
import { getVideoEmbedUrl } from "@/lib/mediaEmbed";
import { toastApiError } from "@/lib/apiError";
import {
  BG, CARD, CARD_S, INPUT_ST, SELECT_ST, C, OPT, REACTIONS,
  type ShowMsg, type Usuario, type FormValues, emptyForm,
  validarFormularioUsuario, timeAgo, type Post, type ComentarioEngajamento,
  type Aula, type Curso, type CursoDetalhe, type Stats,
} from "./shared";

export function DashboardTab({ showMsg }: { showMsg: (t: "sucesso" | "erro", msg: string) => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [notiTitulo, setNotiTitulo] = useState("");
  const [notiMensagem, setNotiMensagem] = useState("");
  const [notiTipo, setNotiTipo] = useState("geral");
  const [notiLink, setNotiLink] = useState("");
  const [enviandoNoti, setEnviandoNoti] = useState(false);
  const [notiResposta, setNotiResposta] = useState<{ tipo: "sucesso" | "erro"; msg: string } | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [sr, ur] = await Promise.all([apiFetch("/usuarios/stats"), apiFetch("/usuarios")]);
        if (sr.ok) setStats(await sr.json());
        if (ur.ok) { const all: Usuario[] = await ur.json(); setRecentUsers(all.slice(0, 6)); }
      } catch {
        toastApiError();
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleEnviarNotificacao(e: React.FormEvent) {
    e.preventDefault();
    setEnviandoNoti(true); setNotiResposta(null);
    try {
      const res = await apiFetch("/notificacoes/enviar", {
        method: "POST",
        body: JSON.stringify({
          titulo: notiTitulo.trim(),
          mensagem: notiMensagem.trim(),
          tipo: notiTipo,
          link: notiLink.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotiResposta({ tipo: "sucesso", msg: `Enviado para ${data.enviadas} usuário(s) com sucesso!` });
        setNotiTitulo(""); setNotiMensagem(""); setNotiLink(""); setNotiTipo("geral");
      } else {
        setNotiResposta({ tipo: "erro", msg: data.error || "Erro ao enviar" });
      }
    } catch {
      setNotiResposta({ tipo: "erro", msg: "Erro ao enviar notificação" });
    }
    setEnviandoNoti(false);
  }

  const statCards = stats ? [
    { label: "Total de Usuários", value: stats.usuarios.total, sub: `${stats.usuarios.ativos} ativos`, Icon: Users, color: "#c8a56b" },
    { label: "Usuários Ativos", value: stats.usuarios.ativos, sub: `${Math.round((stats.usuarios.ativos / Math.max(stats.usuarios.total, 1)) * 100)}% do total`, Icon: UserCheck, color: "#4ade80" },
    { label: "Publicações", value: stats.posts, sub: "na comunidade", Icon: MessageSquare, color: "#60a5fa" },
    { label: "Reações", value: stats.reacoes, sub: "em publicações", Icon: Heart, color: "#e85555" },
    { label: "Cursos", value: stats.cursos, sub: "criados", Icon: GraduationCap, color: "#a78bfa" },
    { label: "Análises Traço", value: stats.analiseTraco, sub: "concluídas", Icon: Layers, color: "#9c7742" },
  ] : [];

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => <div key={i} className="h-28 rounded-2xl animate-pulse" style={{ background: "rgba(200,165,107,0.05)" }} />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs tracking-[0.25em] uppercase mb-1" style={{ color: "rgba(200,165,107,0.45)" }}>Visão Geral</p>
        <h2 className="font-tan-mon-cheri text-3xl md:text-4xl" style={{ color: C.text }}>Dashboard</h2>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards.map(({ label, value, sub, Icon, color }) => (
          <div key={label} className="p-5 rounded-2xl" style={CARD_S}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <TrendingUp className="w-3.5 h-3.5 mt-1.5" style={{ color: "rgba(200,165,107,0.25)" }} />
            </div>
            <p className="font-tan-mon-cheri text-3xl mb-0.5" style={{ color: C.text }}>{value.toLocaleString("pt-BR")}</p>
            <p className="text-xs font-semibold mb-0.5" style={{ color: C.gold }}>{label}</p>
            <p className="text-xs" style={{ color: C.muted }}>{sub}</p>
          </div>
        ))}
      </div>

      {/* Recent users */}
      <div className="rounded-2xl overflow-hidden" style={CARD_S}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(200,165,107,0.1)" }}>
          <p className="text-xs tracking-[0.2em] uppercase" style={{ color: "rgba(200,165,107,0.45)" }}>Usuários</p>
          <h3 className="font-semibold" style={{ color: C.text }}>Cadastros Recentes</h3>
        </div>
        {recentUsers.length === 0
          ? <p className="text-center py-8 text-sm" style={{ color: C.muted }}>Nenhum usuário ainda.</p>
          : recentUsers.map((u, i) => (
            <div key={u.id} className="flex items-center justify-between gap-3 px-6 py-3.5"
              style={{ borderTop: i > 0 ? "1px solid rgba(200,165,107,0.07)" : undefined }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: "rgba(200,165,107,0.12)", color: C.gold, border: "1px solid rgba(200,165,107,0.2)" }}>
                  {u.nome?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: C.text }}>{u.nome}</p>
                  <p className="text-xs" style={{ color: C.muted }}>@{u.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded-full"
                  style={u.ativo
                    ? { background: "rgba(74,222,128,0.09)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)" }
                    : { background: "rgba(248,113,113,0.09)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}>
                  {u.ativo ? "Ativo" : "Inativo"}
                </span>
                <span className="text-xs hidden sm:inline" style={{ color: C.dim }}>{u._count.avaliacoes} avaliações</span>
              </div>
            </div>
          ))
        }
      </div>

      {/* Enviar Notificação */}
      <div className="rounded-2xl overflow-hidden" style={CARD_S}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid rgba(200,165,107,0.1)" }}>
          <p className="text-xs tracking-[0.2em] uppercase" style={{ color: "rgba(200,165,107,0.45)" }}>Mensagem Global</p>
          <h3 className="font-semibold" style={{ color: C.text }}>Enviar Notificação</h3>
        </div>
        <form onSubmit={handleEnviarNotificacao} className="p-5 space-y-3">
          {notiResposta && (
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
              style={notiResposta.tipo === "sucesso"
                ? { background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80" }
                : { background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}>
              {notiResposta.msg}
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: C.muted }}>Título *</label>
            <input value={notiTitulo} onChange={e => setNotiTitulo(e.target.value)} required
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={INPUT_ST} placeholder="Ex: Novo conteúdo disponível" />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: C.muted }}>Mensagem *</label>
            <textarea value={notiMensagem} onChange={e => setNotiMensagem(e.target.value)} required rows={3}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={INPUT_ST} placeholder="Escreva a mensagem para todos os usuários..." />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: C.muted }}>Tipo</label>
              <select value={notiTipo} onChange={e => setNotiTipo(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={SELECT_ST}>
                <option value="geral" style={OPT}>Geral</option>
                <option value="comunidade" style={OPT}>Comunidade</option>
                <option value="sistema" style={OPT}>Sistema</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: C.muted }}>Link (opcional)</label>
              <input value={notiLink} onChange={e => setNotiLink(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                style={INPUT_ST} placeholder="/comunidade" />
            </div>
          </div>
          <button type="submit" disabled={enviandoNoti}
            className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}>
            <Bell className="w-4 h-4" />
            {enviandoNoti ? "Enviando..." : "Enviar para todos os usuários"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Usuários Tab ───────────────────────────────────────────────────────────────
