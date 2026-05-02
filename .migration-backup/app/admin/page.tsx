'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Users, Plus, Edit2, Trash2, Check, X, Loader2, Search } from 'lucide-react'

interface Usuario {
  id: number
  username: string
  nome: string
  email: string | null
  dataNascimento: string | null
  primeiroAcesso: boolean
  ativo: boolean
  isAdmin: boolean
  criadoEm: string
  _count: {
    avaliacoes: number
  }
}

export default function GerenciarUsuariosPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [carregando, setCarregando] = useState(true)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null)
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null)
  const [usuarioParaDeletar, setUsuarioParaDeletar] = useState<Usuario | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [busca, setBusca] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const itensPorPagina = 8

  // Novo usuário
  const [novoUsuario, setNovoUsuario] = useState({
    username: '',
    senha: '',
    nome: '',
    email: '',
    dataNascimento: '',
    isAdmin: false,
  })

  function normalizarUsername(valor: string) {
    return valor.trim().toLowerCase()
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    } else if (status === 'authenticated') {
      if (!(session?.user as any)?.isAdmin) {
        router.push('/admin/login')
      } else {
        buscarUsuarios()
      }
    }
  }, [status, session, router])

  async function buscarUsuarios() {
    try {
      const response = await fetch('/api/usuarios')
      if (response.ok) {
        const data = await response.json()
        setUsuarios(data)
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
    } finally {
      setCarregando(false)
    }
  }

  async function criarUsuario(e: React.FormEvent) {
    e.preventDefault()
    setSalvando(true)

    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...novoUsuario,
          username: normalizarUsername(novoUsuario.username),
          nome: novoUsuario.nome.trim(),
          email: novoUsuario.email.trim(),
        })
      })

      if (response.ok) {
        setMostrarModal(false)
        setNovoUsuario({
          username: '',
          senha: '',
          nome: '',
          email: '',
          dataNascimento: '',
          isAdmin: false,
        })
        buscarUsuarios()
        setMensagem({ tipo: 'sucesso', texto: 'Usuário salvo com sucesso.' })
      } else {
        const erro = await response.json()
        setMensagem({ tipo: 'erro', texto: erro.error || 'Erro ao criar usuário.' })
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
      setMensagem({ tipo: 'erro', texto: 'Erro ao criar usuário.' })
    } finally {
      setSalvando(false)
    }
  }

  async function toggleAtivo(usuario: Usuario) {
    try {
      const response = await fetch(`/api/usuarios/${usuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ativo: !usuario.ativo })
      })

      if (response.ok) {
        buscarUsuarios()
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
    }
  }

  function abrirEdicao(usuario: Usuario) {
    setUsuarioEditando(usuario)
    setNovoUsuario({
      username: usuario.username,
      senha: '',
      nome: usuario.nome,
      email: usuario.email || '',
      dataNascimento: usuario.dataNascimento || '',
      isAdmin: usuario.isAdmin,
    })
    setMostrarModal(true)
  }

  async function salvarEdicao(e: React.FormEvent) {
    e.preventDefault()
    if (!usuarioEditando) return
    
    setSalvando(true)

    try {
      const dadosAtualizacao: any = {
        nome: novoUsuario.nome.trim(),
        email: novoUsuario.email.trim(),
        dataNascimento: novoUsuario.dataNascimento,
        isAdmin: novoUsuario.isAdmin,
      }

      if (novoUsuario.senha) {
        dadosAtualizacao.senha = novoUsuario.senha
      }

      const response = await fetch(`/api/usuarios/${usuarioEditando.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosAtualizacao)
      })

      if (response.ok) {
        setMostrarModal(false)
        setUsuarioEditando(null)
        setNovoUsuario({
          username: '',
          senha: '',
          nome: '',
          email: '',
          dataNascimento: '',
          isAdmin: false,
        })
        buscarUsuarios()
        setMensagem({ tipo: 'sucesso', texto: 'Usuário atualizado com sucesso.' })
      } else {
        const erro = await response.json()
        setMensagem({ tipo: 'erro', texto: erro.error || 'Erro ao atualizar usuário.' })
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error)
      setMensagem({ tipo: 'erro', texto: 'Erro ao atualizar usuário.' })
    } finally {
      setSalvando(false)
    }
  }

  async function deletarUsuario(id: number) {
    try {
      const response = await fetch(`/api/usuarios/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        buscarUsuarios()
        setMensagem({ tipo: 'sucesso', texto: 'Usuário deletado com sucesso.' })
        setUsuarioParaDeletar(null)
      } else {
        const erro = await response.json()
        setMensagem({ tipo: 'erro', texto: erro.error || 'Erro ao deletar usuário.' })
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      setMensagem({ tipo: 'erro', texto: 'Erro ao deletar usuário.' })
    }
  }

  if (status === 'loading' || carregando) {
    return (
      <div className="luxury-shell flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-bronze animate-spin" />
      </div>
    )
  }

  const usuariosFiltrados = usuarios.filter((u) => {
    const q = busca.toLowerCase().trim()
    if (!q) return true
    return (
      u.username.toLowerCase().includes(q) ||
      u.nome.toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    )
  })
  const totalPaginas = Math.max(1, Math.ceil(usuariosFiltrados.length / itensPorPagina))
  const pagina = Math.min(paginaAtual, totalPaginas)
  const inicio = (pagina - 1) * itensPorPagina
  const usuariosPaginados = usuariosFiltrados.slice(inicio, inicio + itensPorPagina)

  return (
    <div className="luxury-shell py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          {mensagem && (
            <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${
              mensagem.tipo === 'sucesso'
                ? 'border-green-300 bg-green-50 text-green-800'
                : 'border-red-300 bg-red-50 text-red-800'
            }`}>
              {mensagem.texto}
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-bronze to-brand-gold rounded-full flex items-center justify-center shadow-luxury">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="font-tan-mon-cheri text-5xl text-brand-dark">
                  Gerenciar Usuários
                </h1>
                <p className="text-brand-medium">
                  {usuariosFiltrados.length} usuário{usuariosFiltrados.length !== 1 ? 's' : ''} encontrado{usuariosFiltrados.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <button
              onClick={() => setMostrarModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-brand-bronze to-brand-gold text-white font-semibold rounded-xl hover:from-brand-dark hover:to-brand-medium transition-all shadow-lg hover:shadow-xl flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2"
            >
              <Plus className="w-5 h-5" />
              Novo Usuário
            </button>
          </div>
        </div>

        <div className="luxury-card-strong p-4 md:p-6 mb-4">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-brand-medium absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={busca}
              onChange={(e) => {
                setBusca(e.target.value)
                setPaginaAtual(1)
              }}
              className="luxury-input pl-9"
              placeholder="Buscar por usuário, nome ou email"
            />
          </div>
        </div>

        {/* Lista de Usuários */}
        <div className="luxury-card-strong overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-brand-gold/10 to-brand-bronze/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-dark">Usuário</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-dark">Nome</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brand-dark">Email</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-brand-dark">Avaliações</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-brand-dark">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-brand-dark">Admin</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-brand-dark">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gold/20">
                {usuariosPaginados.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-brand-gold/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-brand-dark">{usuario.username}</div>
                      {usuario.primeiroAcesso && (
                        <span className="text-xs text-brand-medium">Primeiro acesso</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-brand-darker">{usuario.nome}</td>
                    <td className="px-6 py-4 text-brand-darker text-sm">{usuario.email || '-'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-brand-gold/20 text-brand-dark text-sm font-semibold">
                        {usuario._count.avaliacoes}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => toggleAtivo(usuario)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                          usuario.ativo
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {usuario.ativo ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        {usuario.ativo ? 'Ativo' : 'Inativo'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {usuario.isAdmin ? (
                        <span className="inline-flex px-3 py-1 rounded-full bg-brand-bronze/20 text-brand-bronze text-xs font-semibold">
                          Admin
                        </span>
                      ) : (
                        <span className="text-brand-medium text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => abrirEdicao(usuario)}
                          className="p-2 text-brand-bronze hover:bg-brand-gold/20 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                          title="Editar"
                          aria-label={`Editar usuário ${usuario.username}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setUsuarioParaDeletar(usuario)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                          title="Deletar"
                          aria-label={`Deletar usuário ${usuario.username}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {usuariosFiltrados.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-brand-medium mx-auto mb-4 opacity-50" />
                <p className="text-brand-medium">Nenhum usuário encontrado</p>
              </div>
            )}
          </div>
        </div>

        {totalPaginas > 1 && (
          <div className="flex items-center justify-between mt-4 luxury-card p-3">
            <p className="text-sm text-brand-medium">
              Página {pagina} de {totalPaginas}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className="luxury-btn-secondary px-3 py-2 disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
                disabled={pagina === totalPaginas}
                className="luxury-btn-secondary px-3 py-2 disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Criar/Editar Usuário */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="luxury-card-strong p-8 max-w-md w-full">
            <h2 className="text-2xl font-semibold text-brand-dark mb-6">
              {usuarioEditando ? 'Editar Usuário' : 'Novo Usuário'}
            </h2>

            <form onSubmit={usuarioEditando ? salvarEdicao : criarUsuario} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Usuário *</label>
                <input
                  type="text"
                  required={!usuarioEditando}
                  disabled={!!usuarioEditando}
                  value={novoUsuario.username}
                  onChange={(e) => setNovoUsuario({ ...novoUsuario, username: normalizarUsername(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="username"
                />
                <p className="text-xs text-brand-medium mt-1">
                  Use apenas letras minúsculas, números, ponto, hífen ou underline.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">
                  Senha {usuarioEditando ? '(deixe em branco para não alterar)' : '*'}
                </label>
                <input
                  type="password"
                  required={!usuarioEditando}
                  value={novoUsuario.senha}
                  onChange={(e) => setNovoUsuario({ ...novoUsuario, senha: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold"
                  placeholder="••••••••"
                />
                <p className="text-xs text-brand-medium mt-1">
                  Mínimo de 6 caracteres.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={novoUsuario.nome}
                  onChange={(e) => setNovoUsuario({ ...novoUsuario, nome: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold"
                  placeholder="Nome Completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Email</label>
                <input
                  type="email"
                  value={novoUsuario.email}
                  onChange={(e) => setNovoUsuario({ ...novoUsuario, email: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-dark mb-1">Data de Nascimento</label>
                <input
                  type="date"
                  value={novoUsuario.dataNascimento}
                  onChange={(e) => setNovoUsuario({ ...novoUsuario, dataNascimento: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isAdmin"
                  checked={novoUsuario.isAdmin}
                  onChange={(e) => setNovoUsuario({ ...novoUsuario, isAdmin: e.target.checked })}
                  className="w-4 h-4 text-brand-bronze border-brand-gold/30 rounded focus:ring-brand-gold"
                />
                <label htmlFor="isAdmin" className="text-sm text-brand-dark">
                  Administrador
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setMostrarModal(false)
                    setUsuarioEditando(null)
                    setNovoUsuario({
                      username: '',
                      senha: '',
                      nome: '',
                      email: '',
                      dataNascimento: '',
                      isAdmin: false,
                    })
                  }}
                  className="flex-1 px-4 py-3 border-2 border-brand-gold/30 text-brand-dark font-semibold rounded-xl hover:bg-brand-gold/10 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-brand-bronze to-brand-gold text-white font-semibold rounded-xl hover:from-brand-dark hover:to-brand-medium transition-all disabled:opacity-50"
                >
                  {salvando ? (usuarioEditando ? 'Salvando...' : 'Criando...') : (usuarioEditando ? 'Salvar' : 'Criar')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmação de exclusão */}
      {usuarioParaDeletar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full border-2 border-red-200">
            <h3 className="text-xl font-semibold text-brand-dark mb-3">Confirmar exclusão</h3>
            <p className="text-sm text-brand-darker mb-6">
              Tem certeza que deseja excluir o usuário <strong>{usuarioParaDeletar.username}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setUsuarioParaDeletar(null)}
                className="flex-1 px-4 py-2 border-2 border-brand-gold/30 text-brand-dark font-semibold rounded-xl hover:bg-brand-gold/10 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={() => deletarUsuario(usuarioParaDeletar.id)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all"
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
