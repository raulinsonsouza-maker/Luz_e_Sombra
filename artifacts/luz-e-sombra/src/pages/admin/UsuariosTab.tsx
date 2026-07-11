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

export function UsuariosTab({ showMsg }: { showMsg: (t: "sucesso" | "erro", msg: string) => void }) {
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
  const [erroModal, setErroModal] = useState<string | null>(null);
  const [fichaUsuario, setFichaUsuario] = useState<Usuario | null>(null);
  const [fichaDados, setFichaDados] = useState<Record<string, unknown> | null>(null);
  const [fichaCarregando, setFichaCarregando] = useState(false);

  useEffect(() => { buscarUsuarios(); }, []);

  async function buscarUsuarios() {
    setCarregando(true);
    try { const res = await apiFetch("/usuarios"); if (res.ok) setUsuarios(await res.json()); } catch { toastApiError(); }
    setCarregando(false);
  }

  function abrirNovoUsuario() {
    setUsuarioEditando(null);
    setNovoUsuario(emptyForm);
    setErroModal(null);
    setMostrarModal(true);
  }

  function fecharModal() {
    setMostrarModal(false);
    setUsuarioEditando(null);
    setNovoUsuario(emptyForm);
    setErroModal(null);
  }

  async function abrirFicha(u: Usuario) {
    setFichaUsuario(u);
    setFichaDados(null);
    setFichaCarregando(true);
    try {
      const res = await apiFetch(`/admin/usuarios/${u.id}/ficha`);
      if (res.ok) setFichaDados(await res.json());
    } catch {
      showMsg("erro", "Erro ao carregar ficha");
    }
    setFichaCarregando(false);
  }

  function abrirEdicao(u: Usuario) {
    setUsuarioEditando(u);
    setNovoUsuario({ username: u.username, senha: "", nome: u.nome, email: u.email || "", dataNascimento: u.dataNascimento || "", isAdmin: u.isAdmin });
    setErroModal(null);
    setMostrarModal(true);
  }

  async function criarUsuario(e: React.FormEvent) {
    e.preventDefault();
    const erroLocal = validarFormularioUsuario(novoUsuario, false);
    if (erroLocal) {
      setErroModal(erroLocal);
      return;
    }
    setErroModal(null);
    setSalvando(true);
    try {
      const res = await apiFetch("/usuarios", { method: "POST", body: JSON.stringify({ ...novoUsuario, username: novoUsuario.username.trim().toLowerCase() }) });
      const data = await res.json();
      if (res.ok) { showMsg("sucesso", "Usuário criado!"); fecharModal(); buscarUsuarios(); }
      else {
        const msg = data.error || "Erro ao criar usuário";
        setErroModal(msg);
        showMsg("erro", msg);
      }
    } catch {
      const msg = "Erro ao criar usuário";
      setErroModal(msg);
      showMsg("erro", msg);
    }
    setSalvando(false);
  }

  async function salvarEdicao(e: React.FormEvent) {
    e.preventDefault();
    if (!usuarioEditando) return;
    const erroLocal = validarFormularioUsuario(novoUsuario, true);
    if (erroLocal) {
      setErroModal(erroLocal);
      return;
    }
    setErroModal(null);
    setSalvando(true);
    try {
      const payload: Record<string, unknown> = { nome: novoUsuario.nome, email: novoUsuario.email, dataNascimento: novoUsuario.dataNascimento, isAdmin: novoUsuario.isAdmin };
      if (novoUsuario.senha) payload.senha = novoUsuario.senha;
      const res = await apiFetch(`/usuarios/${usuarioEditando.id}`, { method: "PUT", body: JSON.stringify(payload) });
      const data = await res.json();
      if (res.ok) { showMsg("sucesso", "Usuário atualizado!"); fecharModal(); buscarUsuarios(); }
      else {
        const msg = data.error || "Erro ao atualizar";
        setErroModal(msg);
        showMsg("erro", msg);
      }
    } catch {
      const msg = "Erro ao atualizar usuário";
      setErroModal(msg);
      showMsg("erro", msg);
    }
    setSalvando(false);
  }

  async function toggleAtivo(u: Usuario) {
    try { const res = await apiFetch(`/usuarios/${u.id}`, { method: "PUT", body: JSON.stringify({ ativo: !u.ativo }) }); if (res.ok) buscarUsuarios(); } catch { toastApiError("Não foi possível atualizar o usuário."); }
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
          <button onClick={abrirNovoUsuario}
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
                        <button onClick={() => abrirFicha(u)} className="p-2 rounded-lg transition-all"
                          style={{ color: C.gold }}
                          title="Ficha 360"
                          onMouseEnter={e => (e.currentTarget.style.background = "rgba(200,165,107,0.12)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                          <FileText className="w-3.5 h-3.5" />
                        </button>
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
            {erroModal && (
              <div className="mb-4 flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm"
                style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)", color: "#f87171" }}>
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{erroModal}</span>
              </div>
            )}
            <form onSubmit={usuarioEditando ? salvarEdicao : criarUsuario} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: C.muted }}>Usuário *</label>
                <input type="text" required={!usuarioEditando} disabled={!!usuarioEditando} value={novoUsuario.username}
                  onChange={e => { setErroModal(null); setNovoUsuario({ ...novoUsuario, username: e.target.value.trim().toLowerCase() }); }}
                  className={ic} style={INPUT_ST} placeholder="username" autoComplete="off" />
                <p className="text-[11px] mt-1.5 leading-snug" style={{ color: C.dim }}>
                  Minúsculas, números, ponto, hífen ou underline. Mínimo 3 caracteres.
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: C.muted }}>
                  Senha {usuarioEditando ? "(em branco para não alterar)" : "*"}
                </label>
                <input type="password" required={!usuarioEditando} minLength={usuarioEditando ? undefined : 6} value={novoUsuario.senha}
                  onChange={e => { setErroModal(null); setNovoUsuario({ ...novoUsuario, senha: e.target.value }); }}
                  className={ic} style={INPUT_ST} placeholder="••••••••" autoComplete="new-password" />
                <p className="text-[11px] mt-1.5 leading-snug" style={{ color: C.dim }}>
                  Mínimo 6 caracteres.
                </p>
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

      {/* Ficha 360 */}
      {fichaUsuario && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-2xl"
            style={{ background: "linear-gradient(160deg, #1e1812, #2f251b)", border: "1px solid rgba(200,165,107,0.25)" }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-tan-mon-cheri text-xl" style={{ color: C.text }}>Ficha 360 — {fichaUsuario.nome}</h2>
              <button type="button" onClick={() => { setFichaUsuario(null); setFichaDados(null); }} style={{ color: C.muted }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            {fichaCarregando ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin" style={{ color: C.gold }} /></div>
            ) : fichaDados ? (
              <div className="space-y-4 text-sm">
                <div className="rounded-xl p-4" style={CARD}>
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: C.muted }}>Conta</p>
                  <p style={{ color: C.text }}>{String((fichaDados.usuario as { email?: string })?.email ?? "—")}</p>
                  <p className="text-xs mt-1" style={{ color: C.muted }}>
                    Status: {(fichaDados.usuario as { statusAcesso?: string })?.statusAcesso} ·{" "}
                    {(fichaDados.usuario as { ativo?: boolean })?.ativo ? "ativo" : "inativo"}
                  </p>
                </div>
                {fichaDados.compra != null && (
                  <div className="rounded-xl p-4" style={CARD}>
                    <p className="text-xs uppercase tracking-wider mb-2" style={{ color: C.muted }}>Compra</p>
                    <p style={{ color: C.text }}>
                      {(fichaDados.compra as { status?: string }).status} · UTM {(fichaDados.compra as { utmSource?: string }).utmSource || "—"}
                    </p>
                  </div>
                )}
                <div className="rounded-xl p-4" style={CARD}>
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: C.muted }}>Jornada</p>
                  <p style={{ color: C.text }}>
                    {(fichaDados.jornada as { totalAnalises?: number })?.totalAnalises ?? 0} análises concluídas
                  </p>
                </div>
                <div className="rounded-xl p-4" style={CARD}>
                  <p className="text-xs uppercase tracking-wider mb-2" style={{ color: C.muted }}>Últimos e-mails</p>
                  <ul className="space-y-1">
                    {((fichaDados.emails as { template: string; status: string }[]) ?? []).slice(0, 5).map((e, i) => (
                      <li key={i} className="text-xs flex justify-between" style={{ color: C.muted }}>
                        <span>{e.template}</span>
                        <span>{e.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p style={{ color: C.muted }}>Não foi possível carregar a ficha.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ── Comunidade Tab ─────────────────────────────────────────────────────────────
