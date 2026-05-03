import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import {
  Users, Plus, Edit2, Trash2, Check, X, Loader2, Search, CheckCircle, AlertCircle,
  MessageSquare, GraduationCap, FileText, Youtube, ImageIcon, BookOpen,
  ChevronDown, ChevronUp, Eye, EyeOff, LayoutDashboard, Shield, TrendingUp,
  UserCheck, Layers, Heart, Flame, Sparkles, Star, Sun, Bell, type LucideIcon,
} from "lucide-react";
import { apiFetch } from "@/lib/auth";
import { AuthenticatedImage } from "@/components/AuthenticatedImage";
import { getVideoEmbedUrl } from "@/lib/mediaEmbed";

// ── Design tokens ──────────────────────────────────────────────────────────────
const BG = "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)";
const CARD: React.CSSProperties = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.12)" };
const CARD_S: React.CSSProperties = { background: "rgba(200,165,107,0.05)", border: "1.5px solid rgba(200,165,107,0.2)" };
const INPUT_ST: React.CSSProperties = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(200,165,107,0.25)", color: "#f7f2ec" };
const SELECT_ST: React.CSSProperties = { background: "#1e1812", border: "1px solid rgba(200,165,107,0.25)", color: "#f7f2ec" };
const C = { text: "#f7f2ec", muted: "rgba(247,242,236,0.45)", gold: "#c8a56b", bronze: "#9c7742", dim: "rgba(247,242,236,0.25)" };
const OPT: React.CSSProperties = { background: "#1e1812" };

// ── Reaction config ────────────────────────────────────────────────────────────
const REACTIONS: { key: string; icon: LucideIcon; color: string; label: string }[] = [
  { key: "❤️", icon: Heart,    color: "#e85555", label: "Amor" },
  { key: "🔥", icon: Flame,    color: "#e86c2b", label: "Fogo" },
  { key: "💫", icon: Sparkles, color: "#c8a56b", label: "Magia" },
  { key: "🙏", icon: Sun,      color: "#f0c040", label: "Gratidão" },
  { key: "✨", icon: Star,     color: "#c8a56b", label: "Inspiração" },
];

// ── Types ──────────────────────────────────────────────────────────────────────
interface Usuario {
  id: number; username: string; nome: string; email: string | null;
  dataNascimento: string | null; primeiroAcesso: boolean; ativo: boolean;
  isAdmin: boolean; criadoEm: string; _count: { avaliacoes: number };
}
type FormValues = { username: string; senha: string; nome: string; email: string; dataNascimento: string; isAdmin: boolean };
const emptyForm: FormValues = { username: "", senha: "", nome: "", email: "", dataNascimento: "", isAdmin: false };

interface Post {
  id: number; tipo: string; conteudo: string; mediaUrl: string | null; criadoEm: string;
  autorNome: string; reacoes: Record<string, number>;
}
interface Aula {
  id: number; titulo: string; descricao: string | null; videoUrl: string | null;
  conteudo: string | null; ordem: number; duracaoMin: number | null;
}
interface Curso {
  id: number; titulo: string; descricao: string; imagemUrl: string | null;
  categoria: string | null; nivel: string | null; publicado: boolean;
  aulasCount: number; aulasConcluidasCount: number;
}
interface CursoDetalhe extends Curso { aulas: Aula[] }
interface Stats {
  usuarios: { total: number; ativos: number };
  posts: number; reacoes: number; cursos: number; analiseTraco: number;
}
type Tab = "dashboard" | "usuarios" | "comunidade" | "cursos";

// ── Main ───────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [, navigate] = useLocation();
  const { user, status } = useAuth();
  const [aba, setAba] = useState<Tab>("dashboard");
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") navigate("/admin/login");
    else if (status === "authenticated" && !user?.isAdmin) navigate("/admin/login");
  }, [status, user]);

  function showMsg(tipo: "sucesso" | "erro", texto: string) {
    setMensagem({ tipo, texto });
    setTimeout(() => setMensagem(null), 4500);
  }

  if (status === "loading") {
    return (
      <div style={{ background: BG, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: C.gold }} />
      </div>
    );
  }

  const TABS: { key: Tab; label: string; icon: LucideIcon }[] = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "usuarios", label: "Usuários", icon: Users },
    { key: "comunidade", label: "Comunidade", icon: MessageSquare },
    { key: "cursos", label: "Cursos", icon: GraduationCap },
  ];

  return (
    <div style={{ background: BG, minHeight: "100vh" }}>
      {/* Sticky header + nav */}
      <div className="sticky top-0 z-20 backdrop-blur-md" style={{ borderBottom: "1px solid rgba(200,165,107,0.12)", background: "rgba(19,15,9,0.9)" }}>
        <div className="max-w-7xl mx-auto px-5 pt-3 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl font-tan-mon-cheri text-sm"
              style={{ background: "linear-gradient(135deg, rgba(200,165,107,0.15), rgba(156,119,66,0.05))", border: "1px solid rgba(200,165,107,0.3)", color: C.gold, letterSpacing: "0.04em" }}>
              SL
            </div>
            <div className="hidden sm:block">
              <p className="text-xs tracking-[0.2em] uppercase leading-none mb-0.5" style={{ color: "rgba(200,165,107,0.45)" }}>Painel</p>
              <h1 className="font-tan-mon-cheri text-lg leading-none" style={{ color: C.gold }}>Administração</h1>
            </div>
          </div>

          {/* Toast */}
          {mensagem && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium flex-1 justify-center"
              style={mensagem.tipo === "sucesso"
                ? { background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80" }
                : { background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}>
              {mensagem.tipo === "sucesso" ? <CheckCircle className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
              <span className="truncate">{mensagem.texto}</span>
            </div>
          )}

          {/* User */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl shrink-0"
            style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.15)" }}>
            <Shield className="w-3.5 h-3.5" style={{ color: C.bronze }} />
            <span className="text-xs" style={{ color: C.muted }}>{user?.nome?.split(" ")[0] || user?.username}</span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="max-w-7xl mx-auto px-5 flex overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setAba(key)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all shrink-0 relative"
              style={{ color: aba === key ? C.gold : "rgba(247,242,236,0.3)" }}>
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
              {aba === key && <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-t-full" style={{ background: C.gold }} />}
            </button>
          ))}
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {aba === "dashboard"  && <DashboardTab showMsg={showMsg} />}
        {aba === "usuarios"   && <UsuariosTab showMsg={showMsg} />}
        {aba === "comunidade" && <ComunidadeTab showMsg={showMsg} />}
        {aba === "cursos"     && <CursosTab showMsg={showMsg} />}
      </div>
    </div>
  );
}

// ── Dashboard Tab ──────────────────────────────────────────────────────────────
function DashboardTab({ showMsg }: { showMsg: (t: "sucesso" | "erro", msg: string) => void }) {
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
      } catch {}
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
function UsuariosTab({ showMsg }: { showMsg: (t: "sucesso" | "erro", msg: string) => void }) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [usuarioParaDeletar, setUsuarioParaDeletar] = useState<Usuario | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 8;
  const [novoUsuario, setNovoUsuario] = useState<FormValues>(emptyForm);

  useEffect(() => { buscarUsuarios(); }, []);

  async function buscarUsuarios() {
    setCarregando(true);
    try { const res = await apiFetch("/usuarios"); if (res.ok) setUsuarios(await res.json()); } catch {}
    setCarregando(false);
  }

  function fecharModal() { setMostrarModal(false); setUsuarioEditando(null); setNovoUsuario(emptyForm); }

  function abrirEdicao(u: Usuario) {
    setUsuarioEditando(u);
    setNovoUsuario({ username: u.username, senha: "", nome: u.nome, email: u.email || "", dataNascimento: u.dataNascimento || "", isAdmin: u.isAdmin });
    setMostrarModal(true);
  }

  async function criarUsuario(e: React.FormEvent) {
    e.preventDefault(); setSalvando(true);
    try {
      const res = await apiFetch("/usuarios", { method: "POST", body: JSON.stringify({ ...novoUsuario, username: novoUsuario.username.trim().toLowerCase() }) });
      const data = await res.json();
      if (res.ok) { showMsg("sucesso", "Usuário criado!"); fecharModal(); buscarUsuarios(); }
      else showMsg("erro", data.error || "Erro ao criar usuário");
    } catch { showMsg("erro", "Erro ao criar usuário"); }
    setSalvando(false);
  }

  async function salvarEdicao(e: React.FormEvent) {
    e.preventDefault(); if (!usuarioEditando) return; setSalvando(true);
    try {
      const payload: Record<string, unknown> = { nome: novoUsuario.nome, email: novoUsuario.email, dataNascimento: novoUsuario.dataNascimento, isAdmin: novoUsuario.isAdmin };
      if (novoUsuario.senha) payload.senha = novoUsuario.senha;
      const res = await apiFetch(`/usuarios/${usuarioEditando.id}`, { method: "PUT", body: JSON.stringify(payload) });
      const data = await res.json();
      if (res.ok) { showMsg("sucesso", "Usuário atualizado!"); fecharModal(); buscarUsuarios(); }
      else showMsg("erro", data.error || "Erro ao atualizar");
    } catch { showMsg("erro", "Erro ao atualizar usuário"); }
    setSalvando(false);
  }

  async function toggleAtivo(u: Usuario) {
    try { const res = await apiFetch(`/usuarios/${u.id}`, { method: "PUT", body: JSON.stringify({ ativo: !u.ativo }) }); if (res.ok) buscarUsuarios(); } catch {}
  }

  async function deletarUsuario(id: number) {
    try {
      const res = await apiFetch(`/usuarios/${id}`, { method: "DELETE" });
      if (res.ok) { showMsg("sucesso", "Usuário deletado!"); setUsuarioParaDeletar(null); buscarUsuarios(); }
      else { const data = await res.json(); showMsg("erro", data.error || "Erro ao deletar"); }
    } catch { showMsg("erro", "Erro ao deletar"); }
  }

  const usuariosFiltrados = usuarios.filter(u =>
    u.username.includes(busca.toLowerCase()) || u.nome.toLowerCase().includes(busca.toLowerCase()) || (u.email || "").toLowerCase().includes(busca.toLowerCase())
  );
  const totalPaginas = Math.max(1, Math.ceil(usuariosFiltrados.length / itensPorPagina));
  const pagina = Math.min(paginaAtual, totalPaginas);
  const usuariosPaginados = usuariosFiltrados.slice((pagina - 1) * itensPorPagina, pagina * itensPorPagina);

  const ic = "w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all disabled:opacity-50";

  if (carregando) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin" style={{ color: C.gold }} /></div>;

  return (
    <>
      <div className="space-y-4">
        {/* Search + new */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.muted }} />
            <input value={busca} onChange={e => { setBusca(e.target.value); setPaginaAtual(1); }}
              className={`${ic} pl-9`} style={INPUT_ST} placeholder="Buscar usuário, nome ou email" />
          </div>
          <button onClick={() => setMostrarModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}>
            <Plus className="w-4 h-4" /> Novo Usuário
          </button>
        </div>

        {/* Table */}
        <div className="rounded-2xl overflow-hidden" style={CARD_S}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "rgba(200,165,107,0.05)", borderBottom: "1px solid rgba(200,165,107,0.12)" }}>
                  {["Usuário / Nome", "Email", "Aval.", "Status", "Role", "Ações"].map(h => (
                    <th key={h} className={`px-5 py-4 text-xs font-semibold tracking-widest uppercase ${["Aval.", "Status", "Role", "Ações"].includes(h) ? "text-center" : "text-left"}`}
                      style={{ color: "rgba(200,165,107,0.6)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usuariosPaginados.map((u, i) => (
                  <tr key={u.id}
                    style={{ borderTop: i > 0 ? "1px solid rgba(200,165,107,0.07)" : undefined }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(200,165,107,0.04)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium" style={{ color: C.text }}>{u.nome}</p>
                      <p className="text-xs" style={{ color: C.muted }}>@{u.username}</p>
                    </td>
                    <td className="px-5 py-4 text-xs" style={{ color: C.muted }}>{u.email || "—"}</td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
                        style={{ background: "rgba(200,165,107,0.1)", color: C.gold }}>
                        {u._count.avaliacoes}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button onClick={() => toggleAtivo(u)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors"
                        style={u.ativo
                          ? { background: "rgba(74,222,128,0.09)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)" }
                          : { background: "rgba(248,113,113,0.09)", color: "#f87171", border: "1px solid rgba(248,113,113,0.2)" }}>
                        {u.ativo ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {u.ativo ? "Ativo" : "Inativo"}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-center">
                      {u.isAdmin
                        ? <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: "rgba(200,165,107,0.12)", color: C.gold, border: "1px solid rgba(200,165,107,0.25)" }}>Admin</span>
                        : <span style={{ color: C.dim }} className="text-xs">—</span>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => abrirEdicao(u)} className="p-2 rounded-lg transition-all"
                          style={{ color: C.bronze }}
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(200,165,107,0.12)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setUsuarioParaDeletar(u)} className="p-2 rounded-lg transition-all"
                          style={{ color: "rgba(248,113,113,0.5)" }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.08)"; (e.currentTarget as HTMLElement).style.color = "#f87171"; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(248,113,113,0.5)"; }}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {usuariosFiltrados.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-20" style={{ color: C.gold }} />
                <p className="text-sm" style={{ color: C.muted }}>Nenhum usuário encontrado</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between rounded-xl px-4 py-3" style={CARD}>
            <p className="text-xs" style={{ color: C.muted }}>Página {pagina} de {totalPaginas} · {usuariosFiltrados.length} usuários</p>
            <div className="flex gap-2">
              <button onClick={() => setPaginaAtual(p => Math.max(1, p - 1))} disabled={pagina === 1}
                className="px-4 py-1.5 rounded-lg text-sm disabled:opacity-30 transition-all"
                style={{ border: "1px solid rgba(200,165,107,0.2)", color: C.muted }}>Anterior</button>
              <button onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}
                className="px-4 py-1.5 rounded-lg text-sm disabled:opacity-30 transition-all"
                style={{ border: "1px solid rgba(200,165,107,0.2)", color: C.muted }}>Próxima</button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit modal */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="p-8 max-w-md w-full max-h-[90vh] overflow-y-auto rounded-2xl"
            style={{ background: "linear-gradient(160deg, #1e1812, #2f251b)", border: "1px solid rgba(200,165,107,0.25)" }}>
            <h2 className="font-tan-mon-cheri text-2xl mb-6" style={{ color: C.text }}>{usuarioEditando ? "Editar Usuário" : "Novo Usuário"}</h2>
            <form onSubmit={usuarioEditando ? salvarEdicao : criarUsuario} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: C.muted }}>Usuário *</label>
                <input type="text" required={!usuarioEditando} disabled={!!usuarioEditando} value={novoUsuario.username}
                  onChange={e => setNovoUsuario({ ...novoUsuario, username: e.target.value.trim().toLowerCase() })}
                  className={ic} style={INPUT_ST} placeholder="username" />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: C.muted }}>
                  Senha {usuarioEditando ? "(em branco para não alterar)" : "*"}
                </label>
                <input type="password" required={!usuarioEditando} value={novoUsuario.senha}
                  onChange={e => setNovoUsuario({ ...novoUsuario, senha: e.target.value })}
                  className={ic} style={INPUT_ST} placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: C.muted }}>Nome Completo *</label>
                <input type="text" required value={novoUsuario.nome}
                  onChange={e => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
                  className={ic} style={INPUT_ST} placeholder="Nome Completo" />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: C.muted }}>Email</label>
                <input type="email" value={novoUsuario.email}
                  onChange={e => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
                  className={ic} style={INPUT_ST} placeholder="email@exemplo.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: C.muted }}>Data de Nascimento</label>
                <input type="date" value={novoUsuario.dataNascimento}
                  onChange={e => setNovoUsuario({ ...novoUsuario, dataNascimento: e.target.value })}
                  className={ic} style={INPUT_ST} />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={novoUsuario.isAdmin} onChange={e => setNovoUsuario({ ...novoUsuario, isAdmin: e.target.checked })}
                  className="w-4 h-4 rounded" style={{ accentColor: C.gold }} />
                <span className="text-sm" style={{ color: C.text }}>Administrador</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={fecharModal}
                  className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
                  style={{ border: "1px solid rgba(200,165,107,0.25)", color: C.muted }}>Cancelar</button>
                <button type="submit" disabled={salvando}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold disabled:opacity-50 transition-all"
                  style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}>
                  {salvando ? (usuarioEditando ? "Salvando..." : "Criando...") : (usuarioEditando ? "Salvar" : "Criar")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {usuarioParaDeletar && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="p-8 max-w-sm w-full rounded-2xl"
            style={{ background: "linear-gradient(160deg, #1e1812, #2f251b)", border: "1px solid rgba(200,165,107,0.2)" }}>
            <h3 className="font-tan-mon-cheri text-xl mb-2" style={{ color: C.text }}>Confirmar exclusão</h3>
            <p className="text-sm mb-6 leading-relaxed" style={{ color: C.muted }}>
              Excluir <strong style={{ color: C.text }}>{usuarioParaDeletar.username}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setUsuarioParaDeletar(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ border: "1px solid rgba(200,165,107,0.2)", color: C.muted }}>Cancelar</button>
              <button onClick={() => deletarUsuario(usuarioParaDeletar.id)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ background: "rgba(220,38,38,0.8)" }}>Excluir</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Comunidade Tab ─────────────────────────────────────────────────────────────
function ComunidadeTab({ showMsg }: { showMsg: (t: "sucesso" | "erro", msg: string) => void }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [criando, setCriando] = useState(false);
  const [novoTipo, setNovoTipo] = useState<"texto" | "imagem" | "video">("texto");
  const [novoConteudo, setNovoConteudo] = useState("");
  const [novoMediaUrl, setNovoMediaUrl] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [notificar, setNotificar] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { buscarPosts(); }, []);

  async function buscarPosts() {
    setLoading(true);
    try { const res = await apiFetch("/comunidade"); if (res.ok) setPosts(await res.json()); } catch {}
    setLoading(false);
  }

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    if (novoTipo === "texto" && !novoConteudo.trim()) { showMsg("erro", "Escreva o conteúdo."); return; }
    if (novoTipo === "imagem" && !uploadFile) { showMsg("erro", "Selecione uma imagem."); return; }
    if (novoTipo === "video" && !novoMediaUrl.trim()) { showMsg("erro", "Cole o link do YouTube ou Vimeo."); return; }
    setEnviando(true);
    try {
      let mediaUrl: string | undefined;
      if (novoTipo === "imagem" && uploadFile) {
        const urlRes = await apiFetch("/comunidade/upload-url", { method: "POST" });
        if (!urlRes.ok) throw new Error("Erro ao gerar URL");
        const { uploadURL, objectPath } = await urlRes.json();
        const up = await fetch(uploadURL, { method: "PUT", body: uploadFile, headers: { "Content-Type": uploadFile.type || "image/jpeg" } });
        if (!up.ok) throw new Error("Falha no upload");
        mediaUrl = objectPath;
      } else if (novoTipo === "video") {
        mediaUrl = novoMediaUrl.trim() || undefined;
      }
      const texto = novoConteudo.trim() || " ";
      const res = await apiFetch("/comunidade", { method: "POST", body: JSON.stringify({ tipo: novoTipo, conteudo: texto, mediaUrl, notificar }) });
      if (res.ok) {
        showMsg("sucesso", "Publicação criada!");
        setNovoConteudo(""); setNovoMediaUrl(""); setUploadFile(null);
        if (fileRef.current) fileRef.current.value = "";
        setCriando(false); await buscarPosts();
      } else { const d = await res.json(); showMsg("erro", d.error || "Erro ao publicar"); }
    } catch { showMsg("erro", "Erro ao criar publicação"); }
    setEnviando(false);
  }

  async function handleDeletar(id: number) {
    if (!confirm("Deletar esta publicação?")) return;
    try { const res = await apiFetch(`/comunidade/${id}`, { method: "DELETE" }); if (res.ok) { showMsg("sucesso", "Publicação deletada!"); setPosts(prev => prev.filter(p => p.id !== id)); } }
    catch { showMsg("erro", "Erro ao deletar"); }
  }

  const ic = "w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase mb-0.5" style={{ color: "rgba(200,165,107,0.45)" }}>Admin</p>
          <h2 className="font-tan-mon-cheri text-2xl md:text-3xl" style={{ color: C.text }}>Comunidade</h2>
        </div>
        <button onClick={() => setCriando(!criando)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}>
          <Plus className="w-4 h-4" /> Nova publicação
        </button>
      </div>

      {/* Create form */}
      {criando && (
        <form onSubmit={handleCriar} className="p-5 rounded-2xl space-y-4" style={CARD_S}>
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.6)" }}>Nova Publicação</p>
          <div className="flex gap-2 flex-wrap">
            {(["texto", "imagem", "video"] as const).map(t => (
              <button key={t} type="button" onClick={() => { setNovoTipo(t); setUploadFile(null); setNovoMediaUrl(""); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                style={novoTipo === t
                  ? { background: "rgba(200,165,107,0.2)", color: C.gold, border: "1px solid rgba(200,165,107,0.4)" }
                  : { background: "transparent", color: C.muted, border: "1px solid rgba(200,165,107,0.15)" }}>
                {t === "texto" && <FileText className="w-3 h-3" />}
                {t === "imagem" && <ImageIcon className="w-3 h-3" />}
                {t === "video" && <Youtube className="w-3 h-3" />}
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <textarea value={novoConteudo} onChange={e => setNovoConteudo(e.target.value)} required={novoTipo === "texto"} rows={3}
            className={ic} style={INPUT_ST}
            placeholder={novoTipo === "texto" ? "Conteúdo da publicação…" : novoTipo === "imagem" ? "Legenda opcional…" : "Comentário opcional sobre o vídeo…"} />
          {novoTipo === "imagem" && (
            <div>
              <input ref={fileRef} type="file" accept="image/*" onChange={e => setUploadFile(e.target.files?.[0] || null)} className="hidden" id="adm-upload-img" />
              <label htmlFor="adm-upload-img" className="flex flex-col items-center justify-center gap-1 w-full py-6 rounded-xl text-sm cursor-pointer"
                style={{ border: "2px dashed rgba(200,165,107,0.35)", color: C.bronze }}>
                <ImageIcon className="w-6 h-6 opacity-70" />
                <span>{uploadFile ? uploadFile.name : "Toque ou selecione uma imagem"}</span>
                <span className="text-[10px] opacity-60">JPG, PNG, WebP</span>
              </label>
            </div>
          )}
          {novoTipo === "video" && (
            <div className="space-y-1">
              <input type="url" value={novoMediaUrl} onChange={e => setNovoMediaUrl(e.target.value)}
                className={ic} style={INPUT_ST} placeholder="https://youtube.com/…, youtu.be/… ou vimeo.com/…" />
              <p className="text-[10px]" style={{ color: C.dim }}>YouTube (incl. Shorts) e Vimeo são incorporados automaticamente.</p>
            </div>
          )}
          {/* Notificar usuários */}
          <label
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => setNotificar(v => !v)}
          >
            <div
              className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all"
              style={{
                border: notificar ? "none" : "1.5px solid rgba(200,165,107,0.35)",
                background: notificar ? "linear-gradient(135deg, #c8a56b, #9c7742)" : "transparent",
              }}
            >
              {notificar && <Check className="w-3 h-3" style={{ color: "#1a1208" }} />}
            </div>
            <span className="text-xs font-medium" style={{ color: C.muted }}>
              Notificar todos os usuários sobre esta publicação
            </span>
          </label>

          <div className="flex gap-3">
            <button type="button" onClick={() => setCriando(false)}
              className="flex-1 py-2 rounded-xl text-sm" style={{ border: "1px solid rgba(200,165,107,0.2)", color: C.muted }}>Cancelar</button>
            <button type="submit" disabled={enviando}
              className="flex-1 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}>
              {enviando ? "Publicando..." : "Publicar"}
            </button>
          </div>
        </form>
      )}

      {/* Posts list */}
      {loading
        ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" style={{ color: C.gold }} /></div>
        : posts.length === 0
          ? <div className="text-center py-12 rounded-2xl" style={CARD}>
              <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-20" style={{ color: C.gold }} />
              <p className="text-sm" style={{ color: C.muted }}>Nenhuma publicação ainda.</p>
            </div>
          : (
            <div className="space-y-3">
              {posts.map(p => {
                const totalReacoes = Object.values(p.reacoes ?? {}).reduce((a, b) => a + b, 0);
                return (
                  <div key={p.id} className="rounded-2xl overflow-hidden" style={CARD_S}>
                    {/* Media header */}
                    {p.tipo === "imagem" && p.mediaUrl && (
                      <div className="max-h-52 overflow-hidden" style={{ borderBottom: "1px solid rgba(200,165,107,0.1)" }}>
                        <AuthenticatedImage
                          apiPath={`/comunidade/${p.id}/imagem`}
                          alt=""
                          className="w-full h-48"
                          imgClassName="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                    {p.tipo === "video" && p.mediaUrl && getVideoEmbedUrl(p.mediaUrl) && (
                      <div className="aspect-video max-h-56 bg-black" style={{ borderBottom: "1px solid rgba(200,165,107,0.1)" }}>
                        <iframe src={getVideoEmbedUrl(p.mediaUrl)!} className="w-full h-full" title="preview" allowFullScreen />
                      </div>
                    )}
                    {p.tipo === "video" && p.mediaUrl && !getVideoEmbedUrl(p.mediaUrl) && (
                      <div className="px-4 py-3 flex items-center gap-2"
                        style={{ background: "rgba(200,165,107,0.04)", borderBottom: "1px solid rgba(200,165,107,0.1)" }}>
                        <Youtube className="w-5 h-5 shrink-0" style={{ color: "rgba(200,165,107,0.5)" }} />
                        <a href={p.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-xs truncate underline" style={{ color: C.gold }}>{p.mediaUrl}</a>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-3 p-4">
                      <div className="flex-1 min-w-0">
                        {/* Meta */}
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: "rgba(200,165,107,0.1)", color: C.bronze }}>{p.tipo}</span>
                          <span className="text-xs" style={{ color: C.dim }}>{new Date(p.criadoEm).toLocaleDateString("pt-BR")}</span>
                          {p.autorNome && <span className="text-xs" style={{ color: C.dim }}>· {p.autorNome}</span>}
                        </div>

                        {/* Content */}
                        <p className="text-sm leading-relaxed line-clamp-2 mb-2" style={{ color: "rgba(247,242,236,0.8)" }}>{p.conteudo}</p>

                        {/* Reactions (SVG icons) */}
                        {totalReacoes > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {REACTIONS.filter(r => (p.reacoes[r.key] ?? 0) > 0).map(({ key, icon: Icon, color, label }) => (
                              <span key={key} title={label}
                                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                                style={{ background: "rgba(200,165,107,0.07)", border: "1px solid rgba(200,165,107,0.15)" }}>
                                <Icon className="w-3 h-3" style={{ color }} />
                                <span style={{ color: C.muted }}>{p.reacoes[key]}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <button onClick={() => handleDeletar(p.id)}
                        className="p-2 rounded-lg shrink-0 transition-all"
                        style={{ color: "rgba(248,113,113,0.4)" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.08)"; (e.currentTarget as HTMLElement).style.color = "#f87171"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(248,113,113,0.4)"; }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
      }
    </div>
  );
}

// ── Cursos Tab ─────────────────────────────────────────────────────────────────
function CursosTab({ showMsg }: { showMsg: (t: "sucesso" | "erro", msg: string) => void }) {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [criandoCurso, setCriandoCurso] = useState(false);
  const [cursoAberto, setCursoAberto] = useState<number | null>(null);
  const [cursoDetalhe, setCursoDetalhe] = useState<CursoDetalhe | null>(null);
  const [loadingDetalhe, setLoadingDetalhe] = useState(false);
  const [novoCurso, setNovoCurso] = useState({ titulo: "", descricao: "", categoria: "", nivel: "todos", imagemUrl: "" });
  const [capaArquivoNovo, setCapaArquivoNovo] = useState<File | null>(null);
  const [capaUrlEdicao, setCapaUrlEdicao] = useState("");
  const [capaArquivoEdicao, setCapaArquivoEdicao] = useState<File | null>(null);
  const [salvandoCapa, setSalvandoCapa] = useState(false);
  const [enviandoCurso, setEnviandoCurso] = useState(false);
  const [novaAula, setNovaAula] = useState({ titulo: "", descricao: "", videoUrl: "", conteudo: "", duracaoMin: "", ordem: "0" });
  const [criandoAula, setCriandoAula] = useState(false);
  const [enviandoAula, setEnviandoAula] = useState(false);
  const capaNovoRef = useRef<HTMLInputElement>(null);
  const capaEdicaoRef = useRef<HTMLInputElement>(null);

  useEffect(() => { buscarCursos(); }, []);

  useEffect(() => {
    if (cursoDetalhe) {
      setCapaUrlEdicao(cursoDetalhe.imagemUrl || "");
      setCapaArquivoEdicao(null);
      if (capaEdicaoRef.current) capaEdicaoRef.current.value = "";
    }
  }, [cursoDetalhe?.id]);

  async function buscarCursos() {
    setLoading(true);
    try { const res = await apiFetch("/cursos"); if (res.ok) setCursos(await res.json()); } catch {}
    setLoading(false);
  }

  async function abrirCurso(id: number) {
    if (cursoAberto === id) { setCursoAberto(null); setCursoDetalhe(null); return; }
    setCursoAberto(id); setLoadingDetalhe(true);
    try { const res = await apiFetch(`/cursos/${id}`); if (res.ok) setCursoDetalhe(await res.json()); } catch {}
    setLoadingDetalhe(false);
  }

  async function enviarCapaUpload(file: File): Promise<string | null> {
    const urlRes = await apiFetch("/cursos/upload-url", { method: "POST" });
    if (!urlRes.ok) return null;
    const { uploadURL, objectPath } = await urlRes.json();
    const up = await fetch(uploadURL, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type || "image/jpeg" },
    });
    return up.ok ? objectPath : null;
  }

  async function handleCriarCurso(e: React.FormEvent) {
    e.preventDefault(); setEnviandoCurso(true);
    try {
      let imagemUrl = novoCurso.imagemUrl.trim() || null;
      if (capaArquivoNovo) {
        const path = await enviarCapaUpload(capaArquivoNovo);
        if (!path) { showMsg("erro", "Falha no upload da capa."); setEnviandoCurso(false); return; }
        imagemUrl = path;
      }
      const res = await apiFetch("/cursos", {
        method: "POST",
        body: JSON.stringify({
          titulo: novoCurso.titulo,
          descricao: novoCurso.descricao,
          categoria: novoCurso.categoria,
          nivel: novoCurso.nivel,
          imagemUrl: imagemUrl || "",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg("sucesso", "Curso criado!");
        setNovoCurso({ titulo: "", descricao: "", categoria: "", nivel: "todos", imagemUrl: "" });
        setCapaArquivoNovo(null);
        if (capaNovoRef.current) capaNovoRef.current.value = "";
        setCriandoCurso(false);
        buscarCursos();
      }
      else showMsg("erro", data.error || "Erro ao criar curso");
    } catch { showMsg("erro", "Erro ao criar curso"); }
    setEnviandoCurso(false);
  }

  async function handleSalvarCapa(cursoId: number) {
    setSalvandoCapa(true);
    try {
      let imagemUrl = capaUrlEdicao.trim() || null;
      if (capaArquivoEdicao) {
        const path = await enviarCapaUpload(capaArquivoEdicao);
        if (!path) { showMsg("erro", "Falha no upload da capa."); setSalvandoCapa(false); return; }
        imagemUrl = path;
      }
      const res = await apiFetch(`/cursos/${cursoId}`, { method: "PUT", body: JSON.stringify({ imagemUrl }) });
      if (res.ok) {
        showMsg("sucesso", "Capa atualizada!");
        setCapaArquivoEdicao(null);
        if (capaEdicaoRef.current) capaEdicaoRef.current.value = "";
        buscarCursos();
        const det = await apiFetch(`/cursos/${cursoId}`);
        if (det.ok) {
          const d = await det.json() as CursoDetalhe;
          setCursoDetalhe(d);
          setCapaUrlEdicao(d.imagemUrl || "");
        }
      } else {
        const d = await res.json().catch(() => ({}));
        showMsg("erro", (d as { error?: string }).error || "Erro ao salvar capa");
      }
    } catch { showMsg("erro", "Erro ao salvar capa"); }
    setSalvandoCapa(false);
  }

  async function togglePublicado(curso: Curso) {
    try {
      const res = await apiFetch(`/cursos/${curso.id}`, { method: "PUT", body: JSON.stringify({ publicado: !curso.publicado }) });
      if (res.ok) { showMsg("sucesso", `Curso ${!curso.publicado ? "publicado" : "despublicado"}!`); buscarCursos(); if (cursoAberto === curso.id) abrirCurso(curso.id); }
    } catch { showMsg("erro", "Erro ao atualizar"); }
  }

  async function handleDeletarCurso(id: number) {
    if (!confirm("Deletar este curso e todas as aulas?")) return;
    try { const res = await apiFetch(`/cursos/${id}`, { method: "DELETE" }); if (res.ok) { showMsg("sucesso", "Curso deletado!"); if (cursoAberto === id) { setCursoAberto(null); setCursoDetalhe(null); } buscarCursos(); } }
    catch { showMsg("erro", "Erro ao deletar"); }
  }

  async function handleCriarAula(e: React.FormEvent, cursoId: number) {
    e.preventDefault(); setEnviandoAula(true);
    try {
      const res = await apiFetch(`/cursos/${cursoId}/aulas`, {
        method: "POST",
        body: JSON.stringify({ ...novaAula, ordem: parseInt(novaAula.ordem) || 0, duracaoMin: parseInt(novaAula.duracaoMin) || null }),
      });
      const data = await res.json();
      if (res.ok) { showMsg("sucesso", "Aula criada!"); setNovaAula({ titulo: "", descricao: "", videoUrl: "", conteudo: "", duracaoMin: "", ordem: "0" }); setCriandoAula(false); abrirCurso(cursoId); }
      else showMsg("erro", data.error || "Erro ao criar aula");
    } catch { showMsg("erro", "Erro ao criar aula"); }
    setEnviandoAula(false);
  }

  async function handleDeletarAula(aulaId: number, cursoId: number) {
    if (!confirm("Deletar esta aula?")) return;
    try { const res = await apiFetch(`/cursos/aulas/${aulaId}`, { method: "DELETE" }); if (res.ok) { showMsg("sucesso", "Aula deletada!"); abrirCurso(cursoId); } }
    catch { showMsg("erro", "Erro ao deletar aula"); }
  }

  const ic = "w-full px-4 py-2.5 rounded-xl text-sm outline-none";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase mb-0.5" style={{ color: "rgba(200,165,107,0.45)" }}>Admin</p>
          <h2 className="font-tan-mon-cheri text-2xl md:text-3xl" style={{ color: C.text }}>Cursos</h2>
        </div>
        <button onClick={() => setCriandoCurso(!criandoCurso)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}>
          <Plus className="w-4 h-4" /> Novo Curso
        </button>
      </div>

      {/* Create course form */}
      {criandoCurso && (
        <form onSubmit={handleCriarCurso} className="p-5 rounded-2xl space-y-4" style={CARD_S}>
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.6)" }}>Novo Curso</p>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>Título *</label>
            <input required value={novoCurso.titulo} onChange={e => setNovoCurso({ ...novoCurso, titulo: e.target.value })} className={ic} style={INPUT_ST} placeholder="Título do curso" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>Descrição *</label>
            <textarea required value={novoCurso.descricao} onChange={e => setNovoCurso({ ...novoCurso, descricao: e.target.value })} rows={2} className={`${ic} resize-none`} style={INPUT_ST} placeholder="Descrição breve" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>Categoria</label>
              <input value={novoCurso.categoria} onChange={e => setNovoCurso({ ...novoCurso, categoria: e.target.value })} className={ic} style={INPUT_ST} placeholder="Ex: Bioenergia" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>Nível</label>
              <select value={novoCurso.nivel} onChange={e => setNovoCurso({ ...novoCurso, nivel: e.target.value })} className={ic} style={SELECT_ST}>
                <option value="todos" style={OPT}>Todos</option>
                <option value="iniciante" style={OPT}>Iniciante</option>
                <option value="intermediario" style={OPT}>Intermediário</option>
                <option value="avancado" style={OPT}>Avançado</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold" style={{ color: C.muted }}>Capa do curso (opcional)</label>
            <p className="text-[10px] leading-relaxed" style={{ color: C.dim }}>
              Envie uma imagem chamativa ou cole uma URL pública (HTTPS). Se enviar arquivo, ele substitui a URL.
            </p>
            <input ref={capaNovoRef} type="file" accept="image/*" className="hidden" id="capa-novo-curso"
              onChange={e => setCapaArquivoNovo(e.target.files?.[0] || null)} />
            <label htmlFor="capa-novo-curso" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs cursor-pointer"
              style={{ border: "1px dashed rgba(200,165,107,0.35)", color: C.bronze }}>
              <ImageIcon className="w-4 h-4" />
              {capaArquivoNovo ? capaArquivoNovo.name : "Upload de imagem da capa"}
            </label>
            <input value={novoCurso.imagemUrl} onChange={e => setNovoCurso({ ...novoCurso, imagemUrl: e.target.value })}
              className={ic} style={INPUT_ST} placeholder="Ou URL da imagem (https://…)" type="url" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setCriandoCurso(false)} className="flex-1 py-2 rounded-xl text-sm"
              style={{ border: "1px solid rgba(200,165,107,0.2)", color: C.muted }}>Cancelar</button>
            <button type="submit" disabled={enviandoCurso} className="flex-1 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}>
              {enviandoCurso ? "Criando..." : "Criar Curso"}
            </button>
          </div>
        </form>
      )}

      {/* Course list */}
      {loading
        ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" style={{ color: C.gold }} /></div>
        : cursos.length === 0
          ? <div className="text-center py-12 rounded-2xl" style={CARD}>
              <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-20" style={{ color: C.gold }} />
              <p className="text-sm" style={{ color: C.muted }}>Nenhum curso criado ainda.</p>
            </div>
          : (
            <div className="space-y-3">
              {cursos.map(curso => (
                <div key={curso.id} className="rounded-2xl overflow-hidden" style={CARD_S}>
                  {/* Course row */}
                  <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => abrirCurso(curso.id)}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(200,165,107,0.03)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={curso.publicado
                            ? { background: "rgba(74,222,128,0.09)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)" }
                            : { background: "rgba(200,165,107,0.1)", color: C.bronze }}>
                          {curso.publicado ? "Publicado" : "Rascunho"}
                        </span>
                        {curso.categoria && <span className="text-xs" style={{ color: C.muted }}>{curso.categoria}</span>}
                      </div>
                      <p className="font-semibold text-sm" style={{ color: C.text }}>{curso.titulo}</p>
                      <p className="text-xs mt-0.5" style={{ color: C.muted }}>{curso.aulasCount} aula{curso.aulasCount !== 1 ? "s" : ""}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={e => { e.stopPropagation(); togglePublicado(curso); }}
                        className="p-1.5 rounded-lg transition-colors" style={{ color: C.muted }}
                        title={curso.publicado ? "Despublicar" : "Publicar"}
                        onMouseEnter={e => (e.currentTarget.style.color = C.gold)}
                        onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
                        {curso.publicado ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={e => { e.stopPropagation(); handleDeletarCurso(curso.id); }}
                        className="p-1.5 rounded-lg transition-colors" style={{ color: "rgba(248,113,113,0.4)" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(248,113,113,0.4)")}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span style={{ color: C.muted }}>
                        {cursoAberto === curso.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </div>
                  </div>

                  {/* Aulas */}
                  {cursoAberto === curso.id && (
                    <div className="px-4 pb-4 pt-2 space-y-3" style={{ borderTop: "1px solid rgba(200,165,107,0.1)" }}>
                      <div className="p-4 rounded-xl space-y-3" style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.12)" }}>
                        <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.55)" }}>Capa na vitrine</p>
                        <div className="h-28 rounded-lg overflow-hidden relative bg-black/30">
                          {cursoDetalhe?.imagemUrl?.trim() && /^https?:\/\//i.test(cursoDetalhe.imagemUrl) ? (
                            <img src={cursoDetalhe.imagemUrl} alt="" className="w-full h-full object-cover" />
                          ) : cursoDetalhe?.imagemUrl ? (
                            <AuthenticatedImage
                              apiPath={`/cursos/${curso.id}/capa`}
                              alt=""
                              className="w-full h-full"
                              imgClassName="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px]" style={{ color: C.dim }}>Sem capa</div>
                          )}
                        </div>
                        <input ref={capaEdicaoRef} type="file" accept="image/*" className="hidden" id={`capa-edt-${curso.id}`}
                          onChange={e => setCapaArquivoEdicao(e.target.files?.[0] || null)} />
                        <label htmlFor={`capa-edt-${curso.id}`} className="block text-center py-2 rounded-lg text-xs cursor-pointer"
                          style={{ border: "1px dashed rgba(200,165,107,0.35)", color: C.bronze }}>
                          {capaArquivoEdicao ? capaArquivoEdicao.name : "Nova imagem (upload)"}
                        </label>
                        <input type="url" value={capaUrlEdicao} onChange={e => setCapaUrlEdicao(e.target.value)}
                          className={ic} style={INPUT_ST} placeholder="Ou URL https://…" />
                        <button type="button" disabled={salvandoCapa} onClick={() => handleSalvarCapa(curso.id)}
                          className="w-full py-2 rounded-xl text-xs font-semibold disabled:opacity-50"
                          style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}>
                          {salvandoCapa ? "Salvando capa…" : "Salvar capa"}
                        </button>
                      </div>
                      {loadingDetalhe
                        ? <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin" style={{ color: C.gold }} /></div>
                        : cursoDetalhe?.aulas.map((aula, i) => (
                          <div key={aula.id} className="flex items-center gap-3 p-3 rounded-xl"
                            style={{ background: "rgba(200,165,107,0.03)", border: "1px solid rgba(200,165,107,0.1)" }}>
                            <BookOpen className="w-4 h-4 shrink-0" style={{ color: C.muted }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs" style={{ color: C.dim }}>Aula {i + 1}</p>
                              <p className="text-sm font-medium truncate" style={{ color: C.text }}>{aula.titulo}</p>
                            </div>
                            <button onClick={() => handleDeletarAula(aula.id, curso.id)}
                              className="p-1.5 rounded-lg shrink-0 transition-colors" style={{ color: "rgba(248,113,113,0.4)" }}
                              onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
                              onMouseLeave={e => (e.currentTarget.style.color = "rgba(248,113,113,0.4)")}>
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      }

                      {!criandoAula
                        ? (
                          <button onClick={() => setCriandoAula(true)}
                            className="flex items-center gap-2 text-sm transition-colors"
                            style={{ color: C.muted }}
                            onMouseEnter={e => (e.currentTarget.style.color = C.gold)}
                            onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
                            <Plus className="w-3.5 h-3.5" /> Adicionar aula
                          </button>
                        ) : (
                          <form onSubmit={e => handleCriarAula(e, curso.id)} className="space-y-3 p-4 rounded-xl"
                            style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.15)" }}>
                            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.6)" }}>Nova Aula</p>
                            <div>
                              <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>Título *</label>
                              <input required value={novaAula.titulo} onChange={e => setNovaAula({ ...novaAula, titulo: e.target.value })} className={ic} style={INPUT_ST} placeholder="Título da aula" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>Descrição</label>
                              <input value={novaAula.descricao} onChange={e => setNovaAula({ ...novaAula, descricao: e.target.value })} className={ic} style={INPUT_ST} placeholder="Descrição breve" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>URL do Vídeo</label>
                                <input type="url" value={novaAula.videoUrl} onChange={e => setNovaAula({ ...novaAula, videoUrl: e.target.value })} className={ic} style={INPUT_ST} placeholder="https://youtu.be/..." />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>Duração (min)</label>
                                <input type="number" min="0" value={novaAula.duracaoMin} onChange={e => setNovaAula({ ...novaAula, duracaoMin: e.target.value })} className={ic} style={INPUT_ST} placeholder="15" />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>Ordem</label>
                              <input type="number" min="0" value={novaAula.ordem} onChange={e => setNovaAula({ ...novaAula, ordem: e.target.value })} className={ic} style={INPUT_ST} placeholder="0" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>Conteúdo / Texto</label>
                              <textarea value={novaAula.conteudo} onChange={e => setNovaAula({ ...novaAula, conteudo: e.target.value })} rows={3}
                                className={`${ic} resize-none`} style={INPUT_ST} placeholder="Texto da aula (opcional)..." />
                            </div>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => setCriandoAula(false)}
                                className="flex-1 py-2 rounded-xl text-sm"
                                style={{ border: "1px solid rgba(200,165,107,0.2)", color: C.muted }}>Cancelar</button>
                              <button type="submit" disabled={enviandoAula}
                                className="flex-1 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
                                style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}>
                                {enviandoAula ? "Salvando..." : "Salvar Aula"}
                              </button>
                            </div>
                          </form>
                        )
                      }
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
      }
    </div>
  );
}
