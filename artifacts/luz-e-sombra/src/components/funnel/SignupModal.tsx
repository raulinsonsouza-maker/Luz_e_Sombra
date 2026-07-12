import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Eye, EyeOff, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { getStoredUtms } from "@/lib/utm";
import { trackLpEvent, type LpVariant } from "@/lib/lpAnalytics";
import { toastApiError } from "@/lib/apiError";
import { digitsOnlyPhone, formatBrazilPhone, isValidBrazilPhone } from "@/lib/phoneMask";
import { PASSWORD_HINT, validatePassword } from "@/lib/passwordPolicy";
import { LP_JOURNEY_NAME, LP_PORTAL_NAME } from "@/lib/lpConfig";

interface Props {
  open: boolean;
  onClose: () => void;
  variant: LpVariant;
}

type EmailStatus = "idle" | "checking" | "available" | "unavailable";

const inputClass =
  "w-full px-4 py-3 rounded-xl text-sm outline-none transition-[border-color,box-shadow] focus:border-[rgba(200,165,107,0.55)] focus:ring-2 focus:ring-[rgba(200,165,107,0.15)]";

const inputStyle = {
  background: "rgba(15,12,9,0.8)",
  border: "1px solid rgba(200,165,107,0.2)",
  color: "#f7f2ec",
} as const;

const labelClass = "block text-xs mb-1.5 font-medium tracking-wide";
const labelColor = { color: "rgba(247,242,236,0.55)" } as const;

function borderForError(hasError: boolean) {
  return hasError ? "1px solid rgba(220,80,80,0.65)" : inputStyle.border;
}

type LpPasswordInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete: "new-password";
  hasError?: boolean;
  hint?: string;
};

function LpPasswordInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
  hasError = false,
  hint,
}: LpPasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className={labelClass} style={labelColor}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          minLength={8}
          autoComplete={autoComplete}
          className={`${inputClass} pr-12`}
          style={{ ...inputStyle, border: borderForError(hasError) }}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md transition-opacity hover:opacity-80"
          style={{ color: "rgba(247,242,236,0.45)" }}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          tabIndex={-1}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {hint && (
        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "rgba(247,242,236,0.35)" }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function resetFormState(setters: {
  setNome: (v: string) => void;
  setEmail: (v: string) => void;
  setTelefone: (v: string) => void;
  setSenha: (v: string) => void;
  setConfirmarSenha: (v: string) => void;
  setEnviando: (v: boolean) => void;
  setEmailStatus: (v: EmailStatus) => void;
  setEmailErro: (v: string | null) => void;
  setPendingCheckoutToken: (v: string | null) => void;
}) {
  setters.setNome("");
  setters.setEmail("");
  setters.setTelefone("");
  setters.setSenha("");
  setters.setConfirmarSenha("");
  setters.setEnviando(false);
  setters.setEmailStatus("idle");
  setters.setEmailErro(null);
  setters.setPendingCheckoutToken(null);
}

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
  const [telefoneErro, setTelefoneErro] = useState<string | null>(null);

  const senhasDiferentes = confirmarSenha.length > 0 && senha !== confirmarSenha;
  const nomeInvalido = nome.trim().length > 0 && nome.trim().length < 2;

  useEffect(() => {
    if (!open) {
      resetFormState({
        setNome,
        setEmail,
        setTelefone,
        setSenha,
        setConfirmarSenha,
        setEnviando,
        setEmailStatus,
        setEmailErro,
        setPendingCheckoutToken,
      });
      setTelefoneErro(null);
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

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

  function validarTelefone(): boolean {
    if (!telefone.trim()) {
      setTelefoneErro(null);
      return false;
    }
    if (!isValidBrazilPhone(telefone)) {
      setTelefoneErro("Informe um celular válido com DDD (11 dígitos).");
      return false;
    }
    setTelefoneErro(null);
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (nome.trim().length < 2) {
      toast.error("Informe seu nome completo.");
      return;
    }

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

    if (!validarTelefone()) {
      toast.error("Informe um celular válido com DDD.");
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(0,0,0,0.78)" }}
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-md max-h-[min(92vh,720px)] overflow-y-auto rounded-2xl p-6 sm:p-7 relative shadow-2xl"
        style={{ background: "#1e1812", border: "1px solid rgba(200,165,107,0.25)" }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-modal-title"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg transition-opacity hover:opacity-70"
          style={{ color: "rgba(247,242,236,0.5)" }}
          aria-label="Fechar cadastro"
        >
          <X size={18} />
        </button>

        <h2
          id="signup-modal-title"
          className="font-tan-mon-cheri text-2xl mb-1 pr-8"
          style={{ color: "#f7f2ec" }}
        >
          Comece sua jornada
        </h2>
        <p className="text-xs mb-6 leading-relaxed" style={{ color: "rgba(247,242,236,0.45)" }}>
          Cadastre-se para acessar a {LP_JOURNEY_NAME} no {LP_PORTAL_NAME}.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="nome" className={labelClass} style={labelColor}>
              Nome completo *
            </label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              autoComplete="name"
              autoFocus
              className={inputClass}
              style={{ ...inputStyle, border: borderForError(nomeInvalido) }}
              placeholder="Como você quer ser chamada"
            />
            {nomeInvalido && (
              <p className="text-xs mt-1.5" style={{ color: "#e88" }}>
                Informe pelo menos 2 caracteres.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className={labelClass} style={labelColor}>
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
              autoComplete="email"
              inputMode="email"
              className={inputClass}
              style={{ ...inputStyle, border: borderForError(!!emailErro) }}
              placeholder="seu@email.com"
            />
            {emailStatus === "checking" && (
              <p className="text-xs mt-1.5 flex items-center gap-1.5" style={{ color: "rgba(247,242,236,0.4)" }}>
                <Loader2 size={12} className="animate-spin" />
                Verificando e-mail...
              </p>
            )}
            {emailErro && (
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "#e88" }} role="alert">
                {emailErro}
                {pendingCheckoutToken && " Clique em continuar para retomar o pagamento."}
              </p>
            )}
            {emailStatus === "available" && (
              <p className="text-xs mt-1.5" style={{ color: "#8c8" }}>
                E-mail disponível.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="telefone" className={labelClass} style={labelColor}>
              Celular (WhatsApp) *
            </label>
            <input
              id="telefone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={telefone}
              onChange={(e) => {
                setTelefone(formatBrazilPhone(e.target.value));
                setTelefoneErro(null);
              }}
              onBlur={validarTelefone}
              required
              maxLength={16}
              className={inputClass}
              style={{ ...inputStyle, border: borderForError(!!telefoneErro) }}
              placeholder="(00) 00000-0000"
            />
            {telefoneErro ? (
              <p className="text-xs mt-1.5" style={{ color: "#e88" }} role="alert">
                {telefoneErro}
              </p>
            ) : (
              <p className="text-xs mt-1.5" style={{ color: "rgba(247,242,236,0.32)" }}>
                Usamos para enviar o link de pagamento e atualizações da jornada.
              </p>
            )}
          </div>

          <LpPasswordInput
            id="senha"
            label="Senha *"
            value={senha}
            onChange={setSenha}
            placeholder="Crie uma senha segura"
            autoComplete="new-password"
            hint={PASSWORD_HINT}
          />

          <LpPasswordInput
            id="confirmar"
            label="Confirmar senha *"
            value={confirmarSenha}
            onChange={setConfirmarSenha}
            placeholder="Repita a senha"
            autoComplete="new-password"
            hasError={senhasDiferentes}
          />
          {senhasDiferentes && (
            <p className="text-xs -mt-2" style={{ color: "#e88" }} role="alert">
              As senhas não coincidem.
            </p>
          )}

          <button
            type="submit"
            disabled={enviando || emailStatus === "checking" || senhasDiferentes || nomeInvalido}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm mt-1 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
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

          <p className="text-[11px] text-center leading-relaxed pt-1" style={{ color: "rgba(247,242,236,0.28)" }}>
            Ao continuar, você concorda em receber comunicações sobre sua inscrição e pagamento.
          </p>
        </form>
      </div>
    </div>
  );
}
