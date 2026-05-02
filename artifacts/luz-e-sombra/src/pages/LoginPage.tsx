import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Sparkles, LogIn, AlertCircle, Loader2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    const result = await login(username.trim().toLowerCase(), password);
    if (result.ok) {
      navigate("/");
    } else {
      setErro(result.error || "Usuário ou senha inválidos");
      setCarregando(false);
    }
  }

  return (
    <div className="luxury-shell flex items-center justify-center py-12 px-4">
      <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-6">
        <div className="luxury-card-strong p-10 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-brand-bronze to-brand-gold rounded-full mb-6">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="luxury-title font-tan-mon-cheri text-5xl mb-3">Da Sombra à Luz</h1>
            <p className="text-brand-medium leading-relaxed">
              Plataforma premium para guiar sua jornada de autoconhecimento, clareza e transformação.
            </p>
          </div>
          <div className="mt-8">
            <p className="text-sm text-brand-medium mb-2">Ambiente seguro</p>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 border border-brand-gold/30 bg-brand-gold/10 text-sm text-brand-dark">
              <ShieldCheck className="w-4 h-4" />
              Autenticação protegida para usuários e administradores
            </div>
          </div>
        </div>

        <div className="luxury-card-strong p-8">
          <h2 className="text-2xl font-semibold text-brand-dark mb-1">Entrar na sua conta</h2>
          <p className="text-sm text-brand-medium mb-6">Acesse suas avaliações e recursos personalizados.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-brand-dark mb-2">
                Usuário
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="luxury-input"
                placeholder="Digite seu usuário"
                required
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-brand-dark mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="luxury-input"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {erro && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl animate-fadeIn">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{erro}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="w-full luxury-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {carregando ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Entrar</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-brand-gold/20">
            <p className="text-center text-sm text-brand-medium">
              Área administrativa?{" "}
              <button
                onClick={() => navigate("/admin/login")}
                className="text-brand-bronze hover:underline font-medium"
              >
                Clique aqui
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
