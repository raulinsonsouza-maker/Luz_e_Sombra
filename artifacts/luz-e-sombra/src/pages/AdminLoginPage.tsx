import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Shield, Lock, User, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const [, navigate] = useLocation();
  const { login, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(username.trim().toLowerCase(), password);
    if (!result.ok) {
      setError(result.error || "Credenciais inválidas");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("luz_e_sombra_token");
    const session = await fetch("/api/auth/session", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).catch(() => null);

    if (!session?.user?.isAdmin) {
      logout();
      setError("Acesso negado. Apenas administradores podem acessar esta área.");
      setLoading(false);
      return;
    }

    navigate("/admin");
  };

  return (
    <div className="luxury-shell flex items-center justify-center p-4">
      <div className="relative max-w-md w-full">
        <div className="luxury-card-strong overflow-hidden">
          <div className="bg-gradient-to-r from-brand-darker to-brand-dark p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 rounded-full mb-4">
              <Shield className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Área Administrativa</h1>
            <p className="text-amber-100 text-sm">Acesso restrito para gestão do sistema</p>
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-white/10 rounded-full border border-white/20">
              <Lock className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold">Admin Only</span>
            </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Usuário Administrador
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="luxury-input pl-12"
                    placeholder="Digite seu usuário"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="luxury-input pl-12 pr-12"
                    placeholder="Digite sua senha"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl animate-fadeIn">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full luxury-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Verificando...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>Acessar Painel</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-500">
                Apenas usuários com permissões de administrador podem acessar esta área.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full mt-4 text-center text-sm text-brand-bronze hover:text-brand-dark font-medium transition-colors"
              >
                ← Voltar para login de usuários
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-brand-medium text-sm">
            <Shield className="w-4 h-4 text-brand-bronze" />
            <span>Área protegida com autenticação e validação de perfil</span>
          </div>
        </div>
      </div>
    </div>
  );
}
