import { useState } from "react";
import { useLocation } from "wouter";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { getStoredUtms } from "@/lib/utm";
import { trackLpEvent, type LpVariant } from "@/lib/lpAnalytics";
import { toastApiError } from "@/lib/apiError";
import { digitsOnlyPhone, formatBrazilPhone, isValidBrazilPhone } from "@/lib/phoneMask";
import { PASSWORD_HINT, validatePassword } from "@/lib/passwordPolicy";

interface Props {
  open: boolean;
  onClose: () => void;
  variant: LpVariant;
}

type EmailStatus = "idle" | "checking" | "available" | "unavailable";

export default function SignupModal({ open, onClose, variant }: Props) {
  const [, navigate] = useLocation();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle");
  const [emailErro, setEmailErro] = useState<string | null>(null);
  const [pendingCheckoutToken, setPendingCheckoutToken] = useState<string | null>(null);

  if (!open) return null;

  async function verificarEmail(): Promise<{
    available: boolean;
    message?: string;
    checkoutToken?: string;
  }> {
    const emailNorm = email.trim().toLowerCase();
    if (!emailNorm || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
      setEmailStatus("idle");
      setEmailErro(null);
      setPendingCheckoutToken(null);
      return { available: false, message: "Informe um e-mail válido." };
    }

    setEmailStatus("checking");
    setEmailErro(null);
    setPendingCheckoutToken(null);

    try {
      const res = await fetch(`/api/funnel/check-email?email=${encodeURIComponent(emailNorm)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setEmailStatus("idle");
        return { available: false, message: data.error || "Não foi possível verificar o e-mail." };
      }
      if (data.available) {
        setEmailStatus("available");
        return { available: true };
      }
      setEmailStatus("unavailable");
      const message = data.message || "Este e-mail já está cadastrado.";
      setEmailErro(message);
      if (data.checkoutToken) {
        setPendingCheckoutToken(data.checkoutToken);
      }
      return {
        available: false,
        message,
        checkoutToken: data.checkoutToken,
      };
    } catch {
      setEmailStatus("idle");
      return { available: false, message: "Erro ao verificar e-mail. Tente novamente." };
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const emailCheck =
      emailStatus === "available"
        ? { available: true as const }
        : await verificarEmail();

    if (!emailCheck.available) {
      if (emailCheck.checkoutToken) {
        onClose();
        navigate(`/checkout?token=${encodeURIComponent(emailCheck.checkoutToken)}&from=${variant}`);
        return;
      }
      toast.error(emailCheck.message || "Este e-mail já está cadastrado.");
      return;
    }

    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }

    const senhaErro = validatePassword(senha);
    if (senhaErro) {
      toast.error(senhaErro);
      return;
    }

    if (!isValidBrazilPhone(telefone)) {
      toast.error("Informe um celular válido com DDD.");
      return;
    }

    setEnviando(true);
    trackLpEvent("signup_start", variant);

    try {
      const res = await fetch("/api/funnel/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim().toLowerCase(),
          telefone: digitsOnlyPhone(telefone),
          senha,
          variant,
          utm: getStoredUtms(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Erro ao cadastrar.");
        setEnviando(false);
        return;
      }

      trackLpEvent("signup_complete", variant);
      try {
        sessionStorage.setItem("pending_checkout_token", data.checkoutToken);
      } catch {
        /* ignore */
      }
      onClose();
      navigate(`/checkout?token=${encodeURIComponent(data.checkoutToken)}&from=${variant}`);
    } catch {
      toastApiError("Erro de conexão. Tente novamente.");
      setEnviando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl p-7 relative"
        style={{ background: "#1e1812", border: "1px solid rgba(200,165,107,0.25)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg transition-opacity hover:opacity-70"
          style={{ color: "rgba(247,242,236,0.5)" }}
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        <h2 className="font-tan-mon-cheri text-2xl mb-1" style={{ color: "#f7f2ec" }}>
          Crie seu acesso
        </h2>
        <p className="text-xs mb-6" style={{ color: "rgba(247,242,236,0.45)" }}>
          Preencha seus dados para continuar ao pagamento seguro.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label htmlFor="nome" className="block text-xs mb-1.5 font-medium" style={{ color: "rgba(247,242,236,0.5)" }}>
              Nome completo *
            </label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: "rgba(15,12,9,0.8)",
                border: "1px solid rgba(200,165,107,0.2)",
                color: "#f7f2ec",
              }}
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs mb-1.5 font-medium" style={{ color: "rgba(247,242,236,0.5)" }}>
              E-mail *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailStatus("idle");
                setEmailErro(null);
                setPendingCheckoutToken(null);
              }}
              onBlur={verificarEmail}
              required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: "rgba(15,12,9,0.8)",
                border: `1px solid ${emailErro ? "rgba(220,80,80,0.6)" : "rgba(200,165,107,0.2)"}`,
                color: "#f7f2ec",
              }}
              placeholder="seu@email.com"
            />
            {emailStatus === "checking" && (
              <p className="text-xs mt-1" style={{ color: "rgba(247,242,236,0.4)" }}>
                Verificando e-mail...
              </p>
            )}
            {emailErro && (
              <p className="text-xs mt-1" style={{ color: "#e88" }}>
                {emailErro}
                {pendingCheckoutToken && " Clique em continuar para retomar o pagamento."}
              </p>
            )}
            {emailStatus === "available" && (
              <p className="text-xs mt-1" style={{ color: "#8c8" }}>
                E-mail disponível.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="telefone" className="block text-xs mb-1.5 font-medium" style={{ color: "rgba(247,242,236,0.5)" }}>
              Celular *
            </label>
            <input
              id="telefone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={telefone}
              onChange={(e) => setTelefone(formatBrazilPhone(e.target.value))}
              required
              maxLength={16}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: "rgba(15,12,9,0.8)",
                border: "1px solid rgba(200,165,107,0.2)",
                color: "#f7f2ec",
              }}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div>
            <label htmlFor="senha" className="block text-xs mb-1.5 font-medium" style={{ color: "rgba(247,242,236,0.5)" }}>
              Senha *
            </label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: "rgba(15,12,9,0.8)",
                border: "1px solid rgba(200,165,107,0.2)",
                color: "#f7f2ec",
              }}
              placeholder="Mínimo 8 caracteres"
            />
            <p className="text-xs mt-1" style={{ color: "rgba(247,242,236,0.35)" }}>
              {PASSWORD_HINT}
            </p>
          </div>

          <div>
            <label htmlFor="confirmar" className="block text-xs mb-1.5 font-medium" style={{ color: "rgba(247,242,236,0.5)" }}>
              Confirmar senha *
            </label>
            <input
              id="confirmar"
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{
                background: "rgba(15,12,9,0.8)",
                border: "1px solid rgba(200,165,107,0.2)",
                color: "#f7f2ec",
              }}
              placeholder="Repita a senha"
            />
          </div>

          <button
            type="submit"
            disabled={enviando || emailStatus === "checking"}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm mt-2 disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #9c7742 0%, #c8a56b 50%, #9c7742 100%)",
              color: "#fff",
            }}
          >
            {enviando ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Cadastrando...
              </>
            ) : pendingCheckoutToken ? (
              "Continuar pagamento"
            ) : (
              "Continuar para pagamento"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
