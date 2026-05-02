import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import { User, Calendar, Lock, CheckCircle, AlertCircle } from "lucide-react";

export default function MeuPerfilPage() {
  const { user, updateUser } = useAuth();

  const [nome, setNome] = useState(user?.nome ?? "");
  const [dataNascimento, setDataNascimento] = useState(user?.dataNascimento ?? "");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (novaSenha && novaSenha !== confirmarSenha) {
      setErrorMsg("A nova senha e a confirmação não coincidem.");
      return;
    }

    const body: Record<string, string> = {};
    if (nome.trim() !== (user?.nome ?? "").trim()) body.nome = nome.trim();
    if (dataNascimento !== (user?.dataNascimento ?? "")) body.dataNascimento = dataNascimento;
    if (novaSenha) {
      body.senhaAtual = senhaAtual;
      body.novaSenha = novaSenha;
    }

    if (Object.keys(body).length === 0) {
      setErrorMsg("Nenhuma alteração detectada.");
      return;
    }

    setSaving(true);
    try {
      const res = await apiFetch("/usuarios/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Erro ao salvar perfil.");
      } else {
        updateUser(data);
        setSuccessMsg("Perfil atualizado com sucesso!");
        setSenhaAtual("");
        setNovaSenha("");
        setConfirmarSenha("");
      }
    } catch {
      setErrorMsg("Erro de conexão. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="luxury-shell">
      <div className="max-w-lg mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/15 border border-brand-gold/30 mb-4">
            <User className="w-8 h-8 text-brand-bronze" />
          </div>
          <h1 className="text-2xl font-bold text-brand-dark">Meu Perfil</h1>
          <p className="text-brand-medium text-sm mt-1">Atualize seus dados pessoais</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="luxury-card p-6 space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-brand-gold/20">
              <User className="w-4 h-4 text-brand-bronze" />
              <span className="text-sm font-semibold text-brand-dark uppercase tracking-wide">Dados Pessoais</span>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-brand-dark" htmlFor="nome">
                Nome completo
              </label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="luxury-input w-full"
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-brand-dark" htmlFor="dataNascimento">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-brand-bronze" />
                  Data de nascimento
                </span>
              </label>
              <input
                id="dataNascimento"
                type="date"
                value={dataNascimento}
                onChange={e => setDataNascimento(e.target.value)}
                className="luxury-input w-full"
              />
              <p className="text-xs text-brand-medium">Usada para cálculos de numerologia.</p>
            </div>
          </div>

          <div className="luxury-card p-6 space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-brand-gold/20">
              <Lock className="w-4 h-4 text-brand-bronze" />
              <span className="text-sm font-semibold text-brand-dark uppercase tracking-wide">Alterar Senha</span>
            </div>
            <p className="text-xs text-brand-medium -mt-2">Deixe em branco para manter a senha atual.</p>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-brand-dark" htmlFor="senhaAtual">
                Senha atual
              </label>
              <input
                id="senhaAtual"
                type="password"
                value={senhaAtual}
                onChange={e => setSenhaAtual(e.target.value)}
                className="luxury-input w-full"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-brand-dark" htmlFor="novaSenha">
                Nova senha
              </label>
              <input
                id="novaSenha"
                type="password"
                value={novaSenha}
                onChange={e => setNovaSenha(e.target.value)}
                className="luxury-input w-full"
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-brand-dark" htmlFor="confirmarSenha">
                Confirmar nova senha
              </label>
              <input
                id="confirmarSenha"
                type="password"
                value={confirmarSenha}
                onChange={e => setConfirmarSenha(e.target.value)}
                className="luxury-input w-full"
                placeholder="Repita a nova senha"
                autoComplete="new-password"
              />
            </div>
          </div>

          {successMsg && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
              <CheckCircle className="w-4 h-4 shrink-0" />
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="luxury-btn-primary w-full disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar alterações"}
          </button>
        </form>
      </div>
    </div>
  );
}
