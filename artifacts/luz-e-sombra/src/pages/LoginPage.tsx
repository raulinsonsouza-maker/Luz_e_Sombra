import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { LogIn, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { LP_PORTAL_NAME, LP_JOURNEY_NAME } from "@/lib/lpConfig";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [pagamentoPendente, setPagamentoPendente] = useState(false);
  const [checkoutToken, setCheckoutToken] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function resolverCheckoutToken(emailOuUser: string): Promise<string | null> {
    const trimmed = emailOuUser.trim().toLowerCase();
    if (!trimmed.includes("@")) return null;
    try {
      const res = await fetch(
        `/api/funnel/checkout-token-by-email?email=${encodeURIComponent(trimmed)}`,
      );
      if (!res.ok) return null;
      const data = await res.json();
      return data.checkoutToken ?? null;
    } catch {
      return null;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setPagamentoPendente(false);
    setCheckoutToken(null);
    setCarregando(true);
    const result = await login(username.trim().toLowerCase(), password);
    if (result.ok) {
      navigate(result.primeiroAcesso ? "/jornada/traco" : "/dashboard");
      return;
    }
    if (result.code === "pagamento_pendente") {
      setPagamentoPendente(true);
      let token = result.checkoutToken ?? null;
      if (!token) {
        token = await resolverCheckoutToken(username);
      }
      setCheckoutToken(token);
      setErro("Seu pagamento ainda não foi confirmado. Continue o checkout para liberar o acesso.");
    } else if (result.code === "acesso_revogado") {
      setErro(
        result.error ||
          "Seu acesso foi encerrado por reembolso ou estorno. Fale com o suporte em contato@portaliluminando.com.br.",
      );
    } else {
      setErro(result.error || "Usuário ou senha inválidos");
    }
    setCarregando(false);
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — dark luxury */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-16 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #1e1812 0%, #2f251b 50%, #3d2f1f 100%)" }}
      >
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #c8a56b 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #c8a56b 0%, transparent 70%)" }}
        />

        <div className="relative z-10">
          <div
            className="w-12 h-0.5 mb-8"
            style={{ background: "linear-gradient(90deg, #c8a56b, transparent)" }}
          />
          <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-2"
            style={{ color: "#c8a56b" }}>
            {LP_PORTAL_NAME}
          </p>
        </div>

        <div className="relative z-10">
          <h1
            className="font-tan-mon-cheri leading-tight mb-6"
            style={{ fontSize: "clamp(2.8rem, 4vw, 4rem)", color: "#f7f2ec" }}
          >
            {LP_JOURNEY_NAME}
          </h1>
          <p style={{ color: "rgba(200,165,107,0.75)", lineHeight: "1.8", maxWidth: "340px" }}>
            Continue sua trilha de autoconhecimento com clareza e propósito.
          </p>

          <div className="flex items-center gap-4 mt-10">
            <div className="w-8 h-px" style={{ background: "#c8a56b" }} />
            <span className="text-xs tracking-[0.2em] uppercase"
              style={{ color: "rgba(200,165,107,0.5)" }}>
              9 análises · Trilha guiada
            </span>
          </div>
        </div>

        <div className="relative z-10">
          <blockquote
            className="font-tan-mon-cheri text-lg leading-relaxed"
            style={{ color: "rgba(247,242,236,0.45)" }}
          >
            "Da sombra nasce a luz, e da consciência nasce a transformação."
          </blockquote>
        </div>
      </div>

      <div
        className="flex-1 flex items-center justify-center px-6 py-12"
        style={{ background: "linear-gradient(135deg, #fdf8f2 0%, #faf6ee 100%)" }}
      >
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-10">
            <h1 className="font-tan-mon-cheri text-3xl text-brand-dark mb-1">
              {LP_PORTAL_NAME}
            </h1>
            <p className="text-brand-medium text-sm">{LP_JOURNEY_NAME}</p>
          </div>

          <div>
            <h2 className="font-tan-mon-cheri text-3xl text-brand-dark mb-2">
              Bem-vindo(a)
            </h2>
            <p className="text-brand-medium mb-10 text-sm leading-relaxed">
              Acesse sua conta para continuar sua jornada.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="block text-xs font-semibold tracking-widest uppercase text-brand-medium mb-2"
                >
                  Usuário
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="luxury-input"
                  placeholder="Seu usuário ou e-mail"
                  required
                  autoComplete="username"
                  autoFocus
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold tracking-widest uppercase text-brand-medium mb-2"
                >
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="luxury-input pr-12"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-medium hover:text-brand-bronze transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword
                      ? <EyeOff className="w-4 h-4" />
                      : <Eye className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link href="/esqueci-senha" className="text-xs font-medium text-brand-medium hover:text-brand-bronze transition-colors">
                  Esqueci minha senha
                </Link>
              </div>

              {erro && (
                <div className="flex items-start gap-3 p-4 rounded-xl animate-fadeIn"
                  style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-red-700">{erro}</p>
                    {pagamentoPendente && checkoutToken && (
                      <Link
                        href={`/checkout?token=${encodeURIComponent(checkoutToken)}&from=control`}
                        className="text-sm font-semibold mt-2 inline-block underline"
                        style={{ color: "#9c7742" }}
                      >
                        Continuar pagamento
                      </Link>
                    )}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={carregando}
                  className="w-full luxury-btn-primary disabled:opacity-50 disabled:cursor-not-allowed py-3.5"
                >
                  {carregando ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Entrando...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Entrar</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-10 pt-8 border-t border-brand-gold/15 text-center">
              <p className="text-xs tracking-widest uppercase text-brand-medium/50">
                {LP_PORTAL_NAME} · Área privada
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
