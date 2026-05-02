import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Users, Plus, Edit2, Trash2, Check, X, Loader2, Search, CheckCircle, AlertCircle } from "lucide-react";
import { apiFetch } from "@/lib/auth";

interface Usuario {
  id: number;
  username: string;
  nome: string;
  email: string | null;
  dataNascimento: string | null;
  primeiroAcesso: boolean;
  ativo: boolean;
  isAdmin: boolean;
  criadoEm: string;
  _count: { avaliacoes: number };
}

type FormValues = { username: string; senha: string; nome: string; email: string; dataNascimento: string; isAdmin: boolean };
const emptyForm: FormValues = { username: "", senha: "", nome: "", email: "", dataNascimento: "", isAdmin: false };

export default function AdminPage() {
  const [, navigate] = useLocation();
  const { user, status } = useAuth();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);
  const [usuarioParaDeletar, setUsuarioParaDeletar] = useState<Usuario | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [busca, setBusca] = useState("");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 8;
  const [novoUsuario, setNovoUsuario] = useState<FormValues>(emptyForm);

  useEffect(() => {
    if (status === "unauthenticated") navigate("/admin/login");
    else if (status === "authenticated") {
      if (!user?.isAdmin) navigate("/admin/login");
      else buscarUsuarios();
    }
  }, [status, user]);

  async function buscarUsuarios() {
    try {
      const res = await apiFetch("/usuarios");
      if (res.ok) setUsuarios(await res.json());
    } catch {}
    setCarregando(false);
  }

  function fecharModal() {
    setMostrarModal(false);
    setUsuarioEditando(null);
    setNovoUsuario(emptyForm);
  }

  function abrirEdicao(u: Usuario) {
    setUsuarioEditando(u);
    setNovoUsuario({ username: u.username, senha: "", nome: u.nome, email: u.email || "", dataNascimento: u.dataNascimento || "", isAdmin: u.isAdmin });
    setMostrarModal(true);
  }

  async function criarUsuario(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    try {
      const res = await apiFetch("/usuarios", {
        method: "POST",
        body: JSON.stringify({ ...novoUsuario, username: novoUsuario.username.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (res.ok) {
        setMensagem({ tipo: "sucesso", texto: "Usuário criado com sucesso!" });
        fecharModal();
        buscarUsuarios();
      } else {
        setMensagem({ tipo: "erro", texto: data.error || "Erro ao criar usuário" });
      }
    } catch {
      setMensagem({ tipo: "erro", texto: "Erro ao criar usuário" });
    }
    setSalvando(false);
    setTimeout(() => setMensagem(null), 4000);
  }

  async function salvarEdicao(e: React.FormEvent) {
    e.preventDefault();
    if (!usuarioEditando) return;
    setSalvando(true);
    try {
      const payload: Record<string, unknown> = {
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        dataNascimento: novoUsuario.dataNascimento,
        isAdmin: novoUsuario.isAdmin,
      };
      if (novoUsuario.senha) payload.senha = novoUsuario.senha;
      const res = await apiFetch(`/usuarios/${usuarioEditando.id}`, { method: "PUT", body: JSON.stringify(payload) });
      const data = await res.json();
      if (res.ok) {
        setMensagem({ tipo: "sucesso", texto: "Usuário atualizado!" });
        fecharModal();
        buscarUsuarios();
      } else {
        setMensagem({ tipo: "erro", texto: data.error || "Erro ao atualizar" });
      }
    } catch {
      setMensagem({ tipo: "erro", texto: "Erro ao atualizar usuário" });
    }
    setSalvando(false);
    setTimeout(() => setMensagem(null), 4000);
  }

  async function toggleAtivo(u: Usuario) {
    try {
      const res = await apiFetch(`/usuarios/${u.id}`, { method: "PUT", body: JSON.stringify({ ativo: !u.ativo }) });
      if (res.ok) buscarUsuarios();
    } catch {}
  }

  async function deletarUsuario(id: number) {
    try {
      const res = await apiFetch(`/usuarios/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMensagem({ tipo: "sucesso", texto: "Usuário deletado!" });
        setUsuarioParaDeletar(null);
        buscarUsuarios();
      } else {
        const data = await res.json();
        setMensagem({ tipo: "erro", texto: data.error || "Erro ao deletar" });
      }
    } catch {
      setMensagem({ tipo: "erro", texto: "Erro ao deletar usuário" });
    }
    setTimeout(() => setMensagem(null), 4000);
  }

  const usuariosFiltrados = usuarios.filter(u =>
    u.username.includes(busca.toLowerCase()) ||
    u.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(busca.toLowerCase())
  );
  const totalPaginas = Math.max(1, Math.ceil(usuariosFiltrados.length / itensPorPagina));
  const pagina = Math.min(paginaAtual, totalPaginas);
  const usuariosPaginados = usuariosFiltrados.slice((pagina - 1) * itensPorPagina, pagina * itensPorPagina);

  if (status === "loading" || carregando) {
    return <div className="luxury-shell flex items-center justify-center"><Loader2 className="w-10 h-10 text-brand-bronze animate-spin" /></div>;
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm text-brand-dark outline-none transition-all"
    + " disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-brand-gold/5";
  const inputStyle = { border: "1.5px solid rgba(200,165,107,0.35)", background: "#fff" };

  return (
    <div className="luxury-shell py-10 px-4">
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-brand-medium mb-1">Administração</p>
              <h1 className="font-tan-mon-cheri text-4xl md:text-5xl text-brand-dark">Gerenciar Usuários</h1>
              <p className="text-brand-medium mt-1 text-sm">{usuariosFiltrados.length} usuário{usuariosFiltrados.length !== 1 ? "s" : ""}</p>
            </div>
            <button onClick={() => setMostrarModal(true)} className="luxury-btn-primary">
              <Plus className="w-4 h-4" />
              Novo Usuário
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="luxury-card-strong p-4">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 text-brand-medium absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={busca}
              onChange={e => { setBusca(e.target.value); setPaginaAtual(1); }}
              className="luxury-input pl-9"
              placeholder="Buscar por usuário, nome ou email"
            />
          </div>
        </div>

        {/* Table */}
        <div className="luxury-card-strong overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "rgba(200,165,107,0.06)", borderBottom: "1px solid rgba(200,165,107,0.15)" }}>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-widest uppercase text-brand-medium">Usuário</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-widest uppercase text-brand-medium">Nome</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold tracking-widest uppercase text-brand-medium">Email</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold tracking-widest uppercase text-brand-medium">Aval.</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold tracking-widest uppercase text-brand-medium">Status</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold tracking-widest uppercase text-brand-medium">Role</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold tracking-widest uppercase text-brand-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuariosPaginados.map((u, i) => (
                  <tr key={u.id}
                    className="transition-colors"
                    style={{ borderTop: i > 0 ? "1px solid rgba(200,165,107,0.1)" : undefined }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(200,165,107,0.03)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-brand-dark text-sm">{u.username}</div>
                      {u.primeiroAcesso && <span className="text-xs text-brand-medium opacity-60">Primeiro acesso pendente</span>}
                    </td>
                    <td className="px-6 py-4 text-brand-darker text-sm">{u.nome}</td>
                    <td className="px-6 py-4 text-brand-medium text-xs">{u.email || "—"}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ background: "rgba(200,165,107,0.12)", color: "#5f4a2f" }}>
                        {u._count.avaliacoes}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => toggleAtivo(u)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors"
                        style={u.ativo
                          ? { background: "rgba(34,197,94,0.08)", color: "#15803d", border: "1px solid rgba(34,197,94,0.2)" }
                          : { background: "rgba(239,68,68,0.06)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.2)" }}>
                        {u.ativo ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {u.ativo ? "Ativo" : "Inativo"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {u.isAdmin
                        ? <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold"
                            style={{ background: "rgba(200,165,107,0.15)", color: "#9c7742", border: "1px solid rgba(200,165,107,0.3)" }}>
                            Admin
                          </span>
                        : <span className="text-brand-medium text-xs opacity-40">—</span>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => abrirEdicao(u)} title="Editar"
                          className="p-2 rounded-lg transition-colors hover:bg-brand-gold/15 text-brand-bronze">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setUsuarioParaDeletar(u)} title="Deletar"
                          className="p-2 rounded-lg transition-colors hover:bg-red-50 text-red-400">
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
                <Users className="w-10 h-10 text-brand-medium mx-auto mb-3 opacity-20" />
                <p className="text-brand-medium text-sm">Nenhum usuário encontrado</p>
              </div>
            )}
          </div>
        </div>

        {totalPaginas > 1 && (
          <div className="flex items-center justify-between luxury-card p-3">
            <p className="text-xs text-brand-medium">Página {pagina} de {totalPaginas}</p>
            <div className="flex gap-2">
              <button onClick={() => setPaginaAtual(p => Math.max(1, p - 1))} disabled={pagina === 1}
                className="luxury-btn-secondary px-3 py-1.5 text-sm disabled:opacity-40">Anterior</button>
              <button onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))} disabled={pagina === totalPaginas}
                className="luxury-btn-secondary px-3 py-1.5 text-sm disabled:opacity-40">Próxima</button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit modal */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="luxury-card-strong p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="font-tan-mon-cheri text-2xl text-brand-dark mb-6">
              {usuarioEditando ? "Editar Usuário" : "Novo Usuário"}
            </h2>
            <form onSubmit={usuarioEditando ? salvarEdicao : criarUsuario} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-brand-medium mb-1.5">Usuário *</label>
                <input type="text" required={!usuarioEditando} disabled={!!usuarioEditando}
                  value={novoUsuario.username}
                  onChange={e => setNovoUsuario({ ...novoUsuario, username: e.target.value.trim().toLowerCase() })}
                  className={inputClass} style={inputStyle} placeholder="username" />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-brand-medium mb-1.5">
                  Senha {usuarioEditando ? "(em branco para não alterar)" : "*"}
                </label>
                <input type="password" required={!usuarioEditando}
                  value={novoUsuario.senha}
                  onChange={e => setNovoUsuario({ ...novoUsuario, senha: e.target.value })}
                  className={inputClass} style={inputStyle} placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-brand-medium mb-1.5">Nome Completo *</label>
                <input type="text" required value={novoUsuario.nome}
                  onChange={e => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
                  className={inputClass} style={inputStyle} placeholder="Nome Completo" />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-brand-medium mb-1.5">Email</label>
                <input type="email" value={novoUsuario.email}
                  onChange={e => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
                  className={inputClass} style={inputStyle} placeholder="email@exemplo.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-brand-medium mb-1.5">Data de Nascimento</label>
                <input type="date" value={novoUsuario.dataNascimento}
                  onChange={e => setNovoUsuario({ ...novoUsuario, dataNascimento: e.target.value })}
                  className={inputClass} style={inputStyle} />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" id="isAdmin" checked={novoUsuario.isAdmin}
                  onChange={e => setNovoUsuario({ ...novoUsuario, isAdmin: e.target.checked })}
                  className="w-4 h-4 rounded accent-brand-bronze" />
                <span className="text-sm text-brand-dark">Administrador</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={fecharModal}
                  className="flex-1 py-3 rounded-xl border font-medium text-sm transition-all text-brand-dark"
                  style={{ borderColor: "rgba(200,165,107,0.3)" }}>
                  Cancelar
                </button>
                <button type="submit" disabled={salvando} className="flex-1 luxury-btn-primary disabled:opacity-50">
                  {salvando ? (usuarioEditando ? "Salvando..." : "Criando...") : (usuarioEditando ? "Salvar" : "Criar")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {usuarioParaDeletar && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="luxury-card-strong p-8 max-w-sm w-full">
            <h3 className="font-tan-mon-cheri text-xl text-brand-dark mb-2">Confirmar exclusão</h3>
            <p className="text-sm text-brand-medium mb-6 leading-relaxed">
              Tem certeza que deseja excluir o usuário <strong className="text-brand-dark">{usuarioParaDeletar.username}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setUsuarioParaDeletar(null)}
                className="flex-1 py-2.5 rounded-xl border text-brand-dark font-medium text-sm"
                style={{ borderColor: "rgba(200,165,107,0.3)" }}>
                Cancelar
              </button>
              <button onClick={() => deletarUsuario(usuarioParaDeletar.id)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl text-sm transition-colors">
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
