import { useState } from "react";
import { Link } from "wouter";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { LP_PORTAL_NAME } from "@/lib/lpConfig";
import { apiFetch } from "@/lib/auth";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);
    try {
      const res = await apiFetch("/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErro(data.error || "Não foi possível enviar o e-mail. Tente novamente.");
        return;
      }
      setEnviado(true);
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setCarregando(false);
    }
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
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-brand-medium mb-2">{LP_PORTAL_NAME}</p>
          <h1 className="font-tan-mon-cheri text-3xl text-brand-dark mb-2">Esqueci minha senha</h1>
          <p className="text-sm text-brand-medium/70 mb-8">
            Informe o e-mail do cadastro. Se existir uma conta, enviaremos um link para redefinir a senha.
          </p>

          {enviado ? (
            <div className="flex items-start gap-3 p-4 rounded-xl"
              style={{ background: "rgba(93,185,122,0.08)", border: "1px solid rgba(93,185,122,0.2)" }}>
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-brand-dark font-medium mb-1">Verifique seu e-mail</p>
                <p className="text-sm text-brand-medium/80">
                  Se o e-mail estiver cadastrado, você receberá um link válido por 1 hora.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold tracking-widest uppercase text-brand-medium mb-2">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="luxury-input"
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>

              {erro && <p className="text-sm text-red-600">{erro}</p>}

              <button type="submit" disabled={carregando} className="w-full luxury-btn-primary disabled:opacity-50 py-3.5">
                {carregando ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    Enviar link
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
