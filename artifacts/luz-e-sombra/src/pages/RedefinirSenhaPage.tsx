import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { KeyRound, Loader2, ArrowLeft, CheckCircle2, Eye, EyeOff, LogIn } from "lucide-react";
import { LP_PORTAL_NAME, LP_JOURNEY_NAME } from "@/lib/lpConfig";
import { apiFetch } from "@/lib/auth";
import { PASSWORD_HINT, validatePassword } from "@/lib/passwordPolicy";

export default function RedefinirSenhaPage() {
  const [, navigate] = useLocation();
  const token = useMemo(() => new URLSearchParams(window.location.search).get("token") ?? "", []);

  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    const pwdErr = validatePassword(novaSenha);
    if (pwdErr) {
      setErro(pwdErr);
      return;
    }
    if (novaSenha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }
    if (!token) {
      setErro("Link inválido. Solicite um novo e-mail de redefinição.");
      return;
    }

    setCarregando(true);
    try {
      const res = await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, novaSenha }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErro(data.error || "Não foi possível redefinir a senha.");
        return;
      }
      setSucesso(true);
      setTimeout(() => navigate("/login"), 4000);
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ background: "linear-gradient(160deg, #faf8f4 0%, #f0ebe3 100%)" }}>
        <div className="w-full max-w-md luxury-card p-8 text-center">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-brand-medium mb-2">{LP_PORTAL_NAME}</p>
          <h1 className="font-tan-mon-cheri text-2xl text-brand-dark mb-3">Link inválido</h1>
          <p className="text-sm text-brand-medium/80 mb-6 leading-relaxed">
            Este link expirou ou está incompleto. Solicite um novo e-mail de redefinição de senha.
          </p>
          <Link href="/esqueci-senha" className="luxury-btn-primary inline-flex">Solicitar novo link</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(160deg, #faf8f4 0%, #f0ebe3 100%)" }}>
      <div className="w-full max-w-md">
        <Link href="/login" className="inline-flex items-center gap-2 text-sm mb-6 text-brand-medium hover:text-brand-bronze transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao login
        </Link>

        <div className="luxury-card p-8">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-brand-medium mb-1">{LP_PORTAL_NAME}</p>
          <p className="text-xs text-brand-medium/60 mb-3">{LP_JOURNEY_NAME}</p>
          <h1 className="font-tan-mon-cheri text-3xl text-brand-dark mb-2">Nova senha</h1>
          <p className="text-sm text-brand-medium/70 mb-8">
            Crie uma senha forte para acessar sua conta no {LP_PORTAL_NAME}.
          </p>

          {sucesso ? (
            <div className="space-y-5">
              <div className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: "rgba(93,185,122,0.08)", border: "1px solid rgba(93,185,122,0.2)" }}>
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-brand-dark font-medium mb-1">Senha redefinida com sucesso!</p>
                  <p className="text-sm text-brand-medium/80">
                    Você receberá um e-mail de confirmação. Redirecionando para o login...
                  </p>
                </div>
              </div>
              <Link href="/login" className="w-full luxury-btn-primary inline-flex justify-center py-3.5">
                <LogIn className="w-4 h-4" />
                Ir para o login agora
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="novaSenha" className="block text-xs font-semibold tracking-widest uppercase text-brand-medium mb-2">
                  Nova senha
                </label>
                <div className="relative">
                  <input
                    id="novaSenha"
                    type={showPassword ? "text" : "password"}
                    value={novaSenha}
                    onChange={(e) => setNovaSenha(e.target.value)}
                    className="luxury-input pr-12"
                    required
                    autoComplete="new-password"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-medium hover:text-brand-bronze"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-brand-medium/60 mt-2">{PASSWORD_HINT}</p>
              </div>

              <div>
                <label htmlFor="confirmar" className="block text-xs font-semibold tracking-widest uppercase text-brand-medium mb-2">
                  Confirmar senha
                </label>
                <input
                  id="confirmar"
                  type={showPassword ? "text" : "password"}
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  className="luxury-input"
                  required
                  autoComplete="new-password"
                />
              </div>

              {erro && <p className="text-sm text-red-600" role="alert">{erro}</p>}

              <button type="submit" disabled={carregando} className="w-full luxury-btn-primary disabled:opacity-50 py-3.5">
                {carregando ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    Salvar nova senha
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
