import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import {
  Users, Plus, Edit2, Trash2, Check, X, Loader2, Search, CheckCircle, AlertCircle,
  MessageSquare, GraduationCap, FileText, Youtube, ImageIcon, BookOpen, ChevronDown, ChevronUp, Eye, EyeOff
} from "lucide-react";
import { apiFetch } from "@/lib/auth";

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

type Tab = "usuarios" | "comunidade" | "cursos";

const EMOJIS_VALIDOS = ["❤️", "🔥", "💫", "🙏", "✨"];

// ── Main ───────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [, navigate] = useLocation();
  const { user, status } = useAuth();
  const [aba, setAba] = useState<Tab>("usuarios");
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") navigate("/admin/login");
    else if (status === "authenticated" && !user?.isAdmin) navigate("/admin/login");
  }, [status, user]);

  function showMsg(tipo: "sucesso" | "erro", texto: string) {
    setMensagem({ tipo, texto });
    setTimeout(() => setMensagem(null), 4000);
  }

  if (status === "loading") {
    return <div className="luxury-shell flex items-center justify-center"><Loader2 className="w-10 h-10 text-brand-bronze animate-spin" /></div>;
  }

  const tabBtn = (t: Tab, label: string, Icon: React.ElementType) => (
    <button
      onClick={() => setAba(t)}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
      style={aba === t
        ? { background: "rgba(200,165,107,0.15)", color: "#9c7742", border: "1.5px solid rgba(200,165,107,0.35)" }
        : { background: "transparent", color: "#7a6040", border: "1.5px solid transparent" }
      }
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="luxury-shell py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-5">

        {mensagem && (
          <div className="flex items-center gap-3 p-4 rounded-xl"
            style={mensagem.tipo === "sucesso"
              ? { background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.25)" }
              : { background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
            {mensagem.tipo === "sucesso"
              ? <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              : <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
            <p className={`text-sm font-medium ${mensagem.tipo === "sucesso" ? "text-green-700" : "text-red-700"}`}>
              {mensagem.texto}
            </p>
          </div>
        )}

        {/* Header */}
        <div className="luxury-card-strong p-6 md:p-8">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-medium mb-1">Painel</p>
          <h1 className="font-tan-mon-cheri text-4xl md:text-5xl text-brand-dark">Administração</h1>
        </div>

        {/* Tabs */}
        <div className="luxury-card-strong p-3 flex gap-2 flex-wrap">
          {tabBtn("usuarios", "Usuários", Users)}
          {tabBtn("comunidade", "Comunidade", MessageSquare)}
          {tabBtn("cursos", "Cursos", GraduationCap)}
        </div>

        {aba === "usuarios" && <UsuariosTab showMsg={showMsg} />}
        {aba === "comunidade" && <ComunidadeTab showMsg={showMsg} />}
        {aba === "cursos" && <CursosTab showMsg={showMsg} />}
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
    try {
      const res = await apiFetch("/usuarios");
      if (res.ok) setUsuarios(await res.json());
    } catch {}
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
    } catch { showMsg("erro", "Erro ao deletar usuário"); }
  }

  const usuariosFiltrados = usuarios.filter(u =>
    u.username.includes(busca.toLowerCase()) || u.nome.toLowerCase().includes(busca.toLowerCase()) || (u.email || "").toLowerCase().includes(busca.toLowerCase())
  );
  const totalPaginas = Math.max(1, Math.ceil(usuariosFiltrados.length / itensPorPagina));
  const pagina = Math.min(paginaAtual, totalPaginas);
  const usuariosPaginados = usuariosFiltrados.slice((pagina - 1) * itensPorPagina, pagina * itensPorPagina);

  const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm text-brand-dark outline-none transition-all disabled:opacity-50";
  const inputStyle = { border: "1.5px solid rgba(200,165,107,0.35)", background: "#fff" };

  if (carregando) return <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-brand-bronze animate-spin" /></div>;

  return (
    <>
      <div className="luxury-card-strong p-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="relative max-w-sm flex-1">
          <Search className="w-4 h-4 text-brand-medium absolute left-3 top-1/2 -translate-y-1/2" />
          <input value={busca} onChange={e => { setBusca(e.target.value); setPaginaAtual(1); }} className="luxury-input pl-9" placeholder="Buscar usuário, nome ou email" />
        </div>
        <button onClick={() => setMostrarModal(true)} className="luxury-btn-primary"><Plus className="w-4 h-4" /> Novo Usuário</button>
      </div>

      <div className="luxury-card-strong overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: "rgba(200,165,107,0.06)", borderBottom: "1px solid rgba(200,165,107,0.15)" }}>
                {["Usuário", "Nome", "Email", "Aval.", "Status", "Role", "Ações"].map(h => (
                  <th key={h} className={`px-6 py-4 text-xs font-semibold tracking-widest uppercase text-brand-medium ${["Aval.", "Status", "Role", "Ações"].includes(h) ? "text-center" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {usuariosPaginados.map((u, i) => (
                <tr key={u.id} className="transition-colors" style={{ borderTop: i > 0 ? "1px solid rgba(200,165,107,0.1)" : undefined }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(200,165,107,0.03)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <td className="px-6 py-4"><div className="font-medium text-brand-dark text-sm">{u.username}</div></td>
                  <td className="px-6 py-4 text-brand-darker text-sm">{u.nome}</td>
                  <td className="px-6 py-4 text-brand-medium text-xs">{u.email || "—"}</td>
                  <td className="px-6 py-4 text-center"><span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(200,165,107,0.12)", color: "#5f4a2f" }}>{u._count.avaliacoes}</span></td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => toggleAtivo(u)} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors"
                      style={u.ativo ? { background: "rgba(34,197,94,0.08)", color: "#15803d", border: "1px solid rgba(34,197,94,0.2)" } : { background: "rgba(239,68,68,0.06)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.2)" }}>
                      {u.ativo ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {u.ativo ? "Ativo" : "Inativo"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {u.isAdmin ? <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "rgba(200,165,107,0.15)", color: "#9c7742", border: "1px solid rgba(200,165,107,0.3)" }}>Admin</span>
                      : <span className="text-brand-medium text-xs opacity-40">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => abrirEdicao(u)} className="p-2 rounded-lg hover:bg-brand-gold/15 text-brand-bronze"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => setUsuarioParaDeletar(u)} className="p-2 rounded-lg hover:bg-red-50 text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {usuariosFiltrados.length === 0 && (
            <div className="text-center py-12"><Users className="w-10 h-10 text-brand-medium mx-auto mb-3 opacity-20" /><p className="text-brand-medium text-sm">Nenhum usuário encontrado</p></div>
          )}
        </div>
      </div>

      {totalPaginas > 1 && (
        <div className="flex items-center justify-between luxury-card p-3">
          <p className="text-xs text-brand-medium">Página {pagina} de {totalPaginas}</p>
          <div className="flex gap-2">
            <button onClick={() => setPaginaAtual(p => Math.max(1, p - 1))} disabled={pagina === 1} className="luxury-btn-secondary px-3 py-1.5 text-sm disabled:opacity-40">Anterior</button>
            <button onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas} className="luxury-btn-secondary px-3 py-1.5 text-sm disabled:opacity-40">Próxima</button>
          </div>
        </div>
      )}

      {/* Create/Edit modal */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="luxury-card-strong p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="font-tan-mon-cheri text-2xl text-brand-dark mb-6">{usuarioEditando ? "Editar Usuário" : "Novo Usuário"}</h2>
            <form onSubmit={usuarioEditando ? salvarEdicao : criarUsuario} className="space-y-4">
              <div><label className="block text-xs font-semibold tracking-widest uppercase text-brand-medium mb-1.5">Usuário *</label>
                <input type="text" required={!usuarioEditando} disabled={!!usuarioEditando} value={novoUsuario.username}
                  onChange={e => setNovoUsuario({ ...novoUsuario, username: e.target.value.trim().toLowerCase() })} className={inputClass} style={inputStyle} placeholder="username" /></div>
              <div><label className="block text-xs font-semibold tracking-widest uppercase text-brand-medium mb-1.5">Senha {usuarioEditando ? "(em branco para não alterar)" : "*"}</label>
                <input type="password" required={!usuarioEditando} value={novoUsuario.senha}
                  onChange={e => setNovoUsuario({ ...novoUsuario, senha: e.target.value })} className={inputClass} style={inputStyle} placeholder="••••••••" /></div>
              <div><label className="block text-xs font-semibold tracking-widest uppercase text-brand-medium mb-1.5">Nome Completo *</label>
                <input type="text" required value={novoUsuario.nome}
                  onChange={e => setNovoUsuario({ ...novoUsuario, nome: e.target.value })} className={inputClass} style={inputStyle} placeholder="Nome Completo" /></div>
              <div><label className="block text-xs font-semibold tracking-widest uppercase text-brand-medium mb-1.5">Email</label>
                <input type="email" value={novoUsuario.email}
                  onChange={e => setNovoUsuario({ ...novoUsuario, email: e.target.value })} className={inputClass} style={inputStyle} placeholder="email@exemplo.com" /></div>
              <div><label className="block text-xs font-semibold tracking-widest uppercase text-brand-medium mb-1.5">Data de Nascimento</label>
                <input type="date" value={novoUsuario.dataNascimento}
                  onChange={e => setNovoUsuario({ ...novoUsuario, dataNascimento: e.target.value })} className={inputClass} style={inputStyle} /></div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={novoUsuario.isAdmin} onChange={e => setNovoUsuario({ ...novoUsuario, isAdmin: e.target.checked })} className="w-4 h-4 rounded accent-brand-bronze" />
                <span className="text-sm text-brand-dark">Administrador</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={fecharModal} className="flex-1 py-3 rounded-xl border font-medium text-sm text-brand-dark" style={{ borderColor: "rgba(200,165,107,0.3)" }}>Cancelar</button>
                <button type="submit" disabled={salvando} className="flex-1 luxury-btn-primary disabled:opacity-50">{salvando ? (usuarioEditando ? "Salvando..." : "Criando...") : (usuarioEditando ? "Salvar" : "Criar")}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {usuarioParaDeletar && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="luxury-card-strong p-8 max-w-sm w-full">
            <h3 className="font-tan-mon-cheri text-xl text-brand-dark mb-2">Confirmar exclusão</h3>
            <p className="text-sm text-brand-medium mb-6 leading-relaxed">Excluir <strong className="text-brand-dark">{usuarioParaDeletar.username}</strong>? Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setUsuarioParaDeletar(null)} className="flex-1 py-2.5 rounded-xl border text-brand-dark font-medium text-sm" style={{ borderColor: "rgba(200,165,107,0.3)" }}>Cancelar</button>
              <button onClick={() => deletarUsuario(usuarioParaDeletar.id)} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl text-sm transition-colors">Excluir</button>
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
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { buscarPosts(); }, []);

  async function buscarPosts() {
    setLoading(true);
    try { const res = await apiFetch("/comunidade"); if (res.ok) setPosts(await res.json()); } catch {}
    setLoading(false);
  }

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault(); if (!novoConteudo.trim()) return; setEnviando(true);
    try {
      let mediaUrl: string | undefined;
      if (novoTipo === "imagem" && uploadFile) {
        const urlRes = await apiFetch("/comunidade/upload-url", { method: "POST" });
        if (!urlRes.ok) throw new Error("Erro ao gerar URL");
        const { uploadURL, objectPath } = await urlRes.json();
        await fetch(uploadURL, { method: "PUT", body: uploadFile, headers: { "Content-Type": uploadFile.type || "image/jpeg" } });
        mediaUrl = objectPath;
      } else if (novoTipo === "video") {
        mediaUrl = novoMediaUrl.trim() || undefined;
      }
      const res = await apiFetch("/comunidade", { method: "POST", body: JSON.stringify({ tipo: novoTipo, conteudo: novoConteudo.trim(), mediaUrl }) });
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

  const inputStyle = { border: "1.5px solid rgba(200,165,107,0.35)", background: "#fff" };

  return (
    <div className="luxury-card-strong p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-tan-mon-cheri text-2xl text-brand-dark">Publicações da Comunidade</h2>
        <button onClick={() => setCriando(!criando)} className="luxury-btn-primary"><Plus className="w-4 h-4" /> Nova publicação</button>
      </div>

      {criando && (
        <form onSubmit={handleCriar} className="rounded-xl p-5 space-y-4" style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.2)" }}>
          <div className="flex gap-2 flex-wrap">
            {(["texto", "imagem", "video"] as const).map(t => (
              <button key={t} type="button" onClick={() => { setNovoTipo(t); setUploadFile(null); setNovoMediaUrl(""); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                style={novoTipo === t ? { background: "rgba(200,165,107,0.2)", color: "#9c7742", border: "1px solid rgba(200,165,107,0.4)" } : { background: "transparent", color: "#9c8060", border: "1px solid rgba(200,165,107,0.2)" }}>
                {t === "texto" && <FileText className="w-3 h-3" />}{t === "imagem" && <ImageIcon className="w-3 h-3" />}{t === "video" && <Youtube className="w-3 h-3" />}
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <textarea value={novoConteudo} onChange={e => setNovoConteudo(e.target.value)} required rows={3}
            className="w-full px-4 py-2.5 rounded-xl text-sm text-brand-dark outline-none resize-none" style={inputStyle} placeholder="Conteúdo da publicação..." />
          {novoTipo === "imagem" && (
            <div>
              <input ref={fileRef} type="file" accept="image/*" onChange={e => setUploadFile(e.target.files?.[0] || null)} className="hidden" id="adm-upload-img" />
              <label htmlFor="adm-upload-img" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm cursor-pointer"
                style={{ border: "1px dashed rgba(200,165,107,0.4)", color: "#9c7742" }}>
                <ImageIcon className="w-4 h-4" />{uploadFile ? uploadFile.name : "Selecionar imagem"}
              </label>
            </div>
          )}
          {novoTipo === "video" && (
            <input type="url" value={novoMediaUrl} onChange={e => setNovoMediaUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm text-brand-dark outline-none" style={inputStyle} placeholder="URL do YouTube" />
          )}
          <div className="flex gap-3">
            <button type="button" onClick={() => setCriando(false)} className="flex-1 py-2 rounded-xl border text-brand-dark text-sm" style={{ borderColor: "rgba(200,165,107,0.3)" }}>Cancelar</button>
            <button type="submit" disabled={enviando} className="flex-1 luxury-btn-primary disabled:opacity-50">{enviando ? "Publicando..." : "Publicar"}</button>
          </div>
        </form>
      )}

      {loading ? <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-brand-bronze animate-spin" /></div>
        : posts.length === 0 ? <p className="text-center text-brand-medium py-8 text-sm">Nenhuma publicação ainda.</p>
        : (
          <div className="space-y-3">
            {posts.map(p => {
              const totalReacoes = Object.values(p.reacoes ?? {}).reduce((a, b) => a + b, 0);
              return (
                <div key={p.id} className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(200,165,107,0.15)", background: "rgba(200,165,107,0.02)" }}>
                  {/* Image preview */}
                  {p.tipo === "imagem" && p.mediaUrl && (
                    <div className="h-32 flex items-center justify-center" style={{ background: "rgba(200,165,107,0.05)", borderBottom: "1px solid rgba(200,165,107,0.1)" }}>
                      <ImageIcon className="w-8 h-8" style={{ color: "rgba(200,165,107,0.3)" }} />
                      <span className="ml-2 text-xs" style={{ color: "rgba(156,119,66,0.5)" }}>Imagem anexada</span>
                    </div>
                  )}
                  {p.tipo === "video" && p.mediaUrl && (
                    <div className="h-20 flex items-center justify-center gap-2" style={{ background: "rgba(200,165,107,0.05)", borderBottom: "1px solid rgba(200,165,107,0.1)" }}>
                      <Youtube className="w-6 h-6" style={{ color: "rgba(200,165,107,0.5)" }} />
                      <span className="text-xs truncate max-w-[200px]" style={{ color: "rgba(156,119,66,0.6)" }}>{p.mediaUrl}</span>
                    </div>
                  )}
                  <div className="flex items-start justify-between gap-3 p-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(200,165,107,0.12)", color: "#9c7742" }}>{p.tipo}</span>
                        <span className="text-xs text-brand-medium">{new Date(p.criadoEm).toLocaleDateString("pt-BR")}</span>
                        {p.autorNome && <span className="text-xs" style={{ color: "rgba(156,119,66,0.6)" }}>por {p.autorNome}</span>}
                      </div>
                      <p className="text-sm text-brand-dark line-clamp-2 mb-2">{p.conteudo}</p>
                      {totalReacoes > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {Object.entries(p.reacoes).sort(([,a],[,b]) => b - a).map(([emoji, count]) => (
                            <span key={emoji} className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(200,165,107,0.08)", border: "1px solid rgba(200,165,107,0.15)", color: "#9c7742" }}>
                              {emoji} {count}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button onClick={() => handleDeletar(p.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
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
  const [enviandoCurso, setEnviandoCurso] = useState(false);

  const [novaAula, setNovaAula] = useState({ titulo: "", descricao: "", videoUrl: "", conteudo: "", duracaoMin: "", ordem: "0" });
  const [criandoAula, setCriandoAula] = useState(false);
  const [enviandoAula, setEnviandoAula] = useState(false);

  useEffect(() => { buscarCursos(); }, []);

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

  async function handleCriarCurso(e: React.FormEvent) {
    e.preventDefault(); setEnviandoCurso(true);
    try {
      const res = await apiFetch("/cursos", { method: "POST", body: JSON.stringify({ ...novoCurso, duracaoMin: undefined }) });
      const data = await res.json();
      if (res.ok) { showMsg("sucesso", "Curso criado!"); setNovoCurso({ titulo: "", descricao: "", categoria: "", nivel: "todos", imagemUrl: "" }); setCriandoCurso(false); buscarCursos(); }
      else showMsg("erro", data.error || "Erro ao criar curso");
    } catch { showMsg("erro", "Erro ao criar curso"); }
    setEnviandoCurso(false);
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
      if (res.ok) {
        showMsg("sucesso", "Aula criada!");
        setNovaAula({ titulo: "", descricao: "", videoUrl: "", conteudo: "", duracaoMin: "", ordem: "0" });
        setCriandoAula(false); abrirCurso(cursoId);
      } else showMsg("erro", data.error || "Erro ao criar aula");
    } catch { showMsg("erro", "Erro ao criar aula"); }
    setEnviandoAula(false);
  }

  async function handleDeletarAula(aulaId: number, cursoId: number) {
    if (!confirm("Deletar esta aula?")) return;
    try { const res = await apiFetch(`/cursos/aulas/${aulaId}`, { method: "DELETE" }); if (res.ok) { showMsg("sucesso", "Aula deletada!"); abrirCurso(cursoId); } }
    catch { showMsg("erro", "Erro ao deletar aula"); }
  }

  const inputStyle = { border: "1.5px solid rgba(200,165,107,0.35)", background: "#fff" };
  const ic = "w-full px-4 py-2.5 rounded-xl text-sm text-brand-dark outline-none";

  return (
    <div className="luxury-card-strong p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-tan-mon-cheri text-2xl text-brand-dark">Gerenciar Cursos</h2>
        <button onClick={() => setCriandoCurso(!criandoCurso)} className="luxury-btn-primary"><Plus className="w-4 h-4" /> Novo Curso</button>
      </div>

      {/* Create course form */}
      {criandoCurso && (
        <form onSubmit={handleCriarCurso} className="rounded-xl p-5 space-y-4" style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.2)" }}>
          <p className="text-xs font-bold tracking-widest uppercase text-brand-medium">Novo Curso</p>
          <div><label className="block text-xs font-semibold text-brand-medium mb-1">Título *</label>
            <input required value={novoCurso.titulo} onChange={e => setNovoCurso({ ...novoCurso, titulo: e.target.value })} className={ic} style={inputStyle} placeholder="Título do curso" /></div>
          <div><label className="block text-xs font-semibold text-brand-medium mb-1">Descrição *</label>
            <textarea required value={novoCurso.descricao} onChange={e => setNovoCurso({ ...novoCurso, descricao: e.target.value })} rows={2} className={`${ic} resize-none`} style={inputStyle} placeholder="Descrição breve" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-semibold text-brand-medium mb-1">Categoria</label>
              <input value={novoCurso.categoria} onChange={e => setNovoCurso({ ...novoCurso, categoria: e.target.value })} className={ic} style={inputStyle} placeholder="Ex: Bioenergia" /></div>
            <div><label className="block text-xs font-semibold text-brand-medium mb-1">Nível</label>
              <select value={novoCurso.nivel} onChange={e => setNovoCurso({ ...novoCurso, nivel: e.target.value })} className={ic} style={inputStyle}>
                <option value="todos">Todos</option><option value="iniciante">Iniciante</option><option value="intermediario">Intermediário</option><option value="avancado">Avançado</option>
              </select></div>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setCriandoCurso(false)} className="flex-1 py-2 rounded-xl border text-brand-dark text-sm" style={{ borderColor: "rgba(200,165,107,0.3)" }}>Cancelar</button>
            <button type="submit" disabled={enviandoCurso} className="flex-1 luxury-btn-primary disabled:opacity-50">{enviandoCurso ? "Criando..." : "Criar Curso"}</button>
          </div>
        </form>
      )}

      {/* Course list */}
      {loading ? <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 text-brand-bronze animate-spin" /></div>
        : cursos.length === 0 ? <p className="text-center text-brand-medium py-8 text-sm">Nenhum curso criado ainda.</p>
        : (
          <div className="space-y-3">
            {cursos.map(curso => (
              <div key={curso.id} className="rounded-xl overflow-hidden" style={{ border: "1px solid rgba(200,165,107,0.15)" }}>
                {/* Course header */}
                <div className="flex items-center gap-3 p-4 cursor-pointer" style={{ background: "rgba(200,165,107,0.02)" }}
                  onClick={() => abrirCurso(curso.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={curso.publicado ? { background: "rgba(34,197,94,0.08)", color: "#15803d", border: "1px solid rgba(34,197,94,0.2)" } : { background: "rgba(200,165,107,0.1)", color: "#9c7742" }}>
                        {curso.publicado ? "Publicado" : "Rascunho"}
                      </span>
                      {curso.categoria && <span className="text-xs text-brand-medium">{curso.categoria}</span>}
                    </div>
                    <p className="font-semibold text-brand-dark">{curso.titulo}</p>
                    <p className="text-xs text-brand-medium mt-0.5">{curso.aulasCount} aula{curso.aulasCount !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={e => { e.stopPropagation(); togglePublicado(curso); }}
                      className="p-1.5 rounded-lg text-brand-medium hover:text-brand-dark transition-colors" title={curso.publicado ? "Despublicar" : "Publicar"}>
                      {curso.publicado ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={e => { e.stopPropagation(); handleDeletarCurso(curso.id); }} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    {cursoAberto === curso.id ? <ChevronUp className="w-4 h-4 text-brand-medium" /> : <ChevronDown className="w-4 h-4 text-brand-medium" />}
                  </div>
                </div>

                {/* Aulas */}
                {cursoAberto === curso.id && (
                  <div className="p-4 pt-0 space-y-3" style={{ borderTop: "1px solid rgba(200,165,107,0.1)" }}>
                    {loadingDetalhe ? <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 text-brand-bronze animate-spin" /></div>
                      : cursoDetalhe?.aulas.map((aula, i) => (
                        <div key={aula.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "rgba(200,165,107,0.03)", border: "1px solid rgba(200,165,107,0.1)" }}>
                          <BookOpen className="w-4 h-4 text-brand-medium shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-brand-medium">Aula {i + 1}</p>
                            <p className="text-sm font-medium text-brand-dark truncate">{aula.titulo}</p>
                          </div>
                          <button onClick={() => handleDeletarAula(aula.id, curso.id)} className="p-1.5 rounded-lg text-red-400 hover:text-red-600 shrink-0"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      ))
                    }

                    {!criandoAula ? (
                      <button onClick={() => setCriandoAula(true)} className="flex items-center gap-2 text-sm text-brand-medium hover:text-brand-dark transition-colors pt-1">
                        <Plus className="w-3.5 h-3.5" /> Adicionar aula
                      </button>
                    ) : (
                      <form onSubmit={e => handleCriarAula(e, curso.id)} className="space-y-3 rounded-xl p-4" style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.15)" }}>
                        <p className="text-xs font-bold tracking-widest uppercase text-brand-medium">Nova Aula</p>
                        <div><label className="block text-xs font-semibold text-brand-medium mb-1">Título *</label>
                          <input required value={novaAula.titulo} onChange={e => setNovaAula({ ...novaAula, titulo: e.target.value })} className={ic} style={inputStyle} placeholder="Título da aula" /></div>
                        <div><label className="block text-xs font-semibold text-brand-medium mb-1">Descrição</label>
                          <input value={novaAula.descricao} onChange={e => setNovaAula({ ...novaAula, descricao: e.target.value })} className={ic} style={inputStyle} placeholder="Descrição breve" /></div>
                        <div className="grid grid-cols-2 gap-3">
                          <div><label className="block text-xs font-semibold text-brand-medium mb-1">URL do Vídeo (YouTube)</label>
                            <input type="url" value={novaAula.videoUrl} onChange={e => setNovaAula({ ...novaAula, videoUrl: e.target.value })} className={ic} style={inputStyle} placeholder="https://youtu.be/..." /></div>
                          <div><label className="block text-xs font-semibold text-brand-medium mb-1">Duração (min)</label>
                            <input type="number" min="0" value={novaAula.duracaoMin} onChange={e => setNovaAula({ ...novaAula, duracaoMin: e.target.value })} className={ic} style={inputStyle} placeholder="15" /></div>
                        </div>
                        <div><label className="block text-xs font-semibold text-brand-medium mb-1">Ordem</label>
                          <input type="number" min="0" value={novaAula.ordem} onChange={e => setNovaAula({ ...novaAula, ordem: e.target.value })} className={ic} style={inputStyle} placeholder="0" /></div>
                        <div><label className="block text-xs font-semibold text-brand-medium mb-1">Conteúdo / Texto</label>
                          <textarea value={novaAula.conteudo} onChange={e => setNovaAula({ ...novaAula, conteudo: e.target.value })} rows={3} className={`${ic} resize-none`} style={inputStyle} placeholder="Texto da aula (opcional)..." /></div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => setCriandoAula(false)} className="flex-1 py-2 rounded-xl border text-brand-dark text-sm" style={{ borderColor: "rgba(200,165,107,0.3)" }}>Cancelar</button>
                          <button type="submit" disabled={enviandoAula} className="flex-1 luxury-btn-primary disabled:opacity-50 text-sm">{enviandoAula ? "Salvando..." : "Salvar Aula"}</button>
                        </div>
                      </form>
                    )}
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
