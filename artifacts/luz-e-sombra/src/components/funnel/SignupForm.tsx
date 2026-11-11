import { useState } from "react";
import { Link } from "wouter";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getStoredUtms } from "@/lib/utm";
import { trackLpEvent, type LpVariant } from "@/lib/lpAnalytics";
import { toastApiError } from "@/lib/apiError";
import { digitsOnlyPhone, formatBrazilPhone, isValidBrazilPhone } from "@/lib/phoneMask";
import { PASSWORD_HINT, validatePassword } from "@/lib/passwordPolicy";
import { LP_JOURNEY_NAME, LP_PORTAL_NAME } from "@/lib/lpConfig";
import { safeSessionStorage } from "@/lib/safeStorage";

interface Props {
  variant: LpVariant;
  onRegistered: (checkoutToken: string) => void;
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

export default function SignupForm({ variant, onRegistered }: Props) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [emailStatus, setEmailStatus] = useState<EmailStatus>("idle");
  const [emailErro, setEmailErro] = useState<string | null>(null);
  const [emailPending, setEmailPending] = useState(false);
  const [telefoneErro, setTelefoneErro] = useState<string | null>(null);

  const senhasDiferentes = confirmarSenha.length > 0 && senha !== confirmarSenha;
  const nomeInvalido = nome.trim().length > 0 && nome.trim().length < 2;

  async function verificarEmail(): Promise<{
    available: boolean;
    message?: string;
  }> {
    const emailNorm = email.trim().toLowerCase();
    if (!emailNorm || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNorm)) {
      setEmailStatus("idle");
      setEmailErro(null);
      setEmailPending(false);
      return { available: false, message: "Informe um e-mail válido." };
    }

    setEmailStatus("checking");
    setEmailErro(null);
    setEmailPending(false);

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
      const pending = data.status === "pending";
      setEmailPending(pending);
      const message =
        data.message ||
        (pending
          ? "Este e-mail já está cadastrado. Entre para continuar o pagamento."
          : "Este e-mail já está cadastrado. Faça login.");
      setEmailErro(message);
      return { available: false, message };
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
      toast.error(emailCheck.message || "Este e-mail já está cadastrado. Faça login.");
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
        safeSessionStorage().setItem("pending_checkout_token", data.checkoutToken);
      } catch {
        /* ignore */
      }
      onRegistered(String(data.checkoutToken));
    } catch {
      toastApiError("Erro de conexão. Tente novamente.");
      setEnviando(false);
    }
  }

  return (
    <div>
      <h3 className="font-tan-mon-cheri text-xl mb-1" style={{ color: "#f7f2ec" }}>
        Comece sua jornada
      </h3>
      <p className="text-xs mb-6 leading-relaxed" style={{ color: "rgba(247,242,236,0.45)" }}>
        Cadastre-se para acessar a {LP_JOURNEY_NAME} no {LP_PORTAL_NAME}.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="signup-nome" className={labelClass} style={labelColor}>
            Nome completo *
          </label>
          <input
            id="signup-nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            autoComplete="name"
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
          <label htmlFor="signup-email" className={labelClass} style={labelColor}>
            E-mail *
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailStatus("idle");
              setEmailErro(null);
              setEmailPending(false);
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
            <div className="mt-1.5 space-y-2" role="alert">
              <p className="text-xs leading-relaxed" style={{ color: "#e88" }}>
                {emailErro}
              </p>
              {emailPending && (
                <Link
                  href="/login"
                  className="inline-flex text-xs font-semibold underline-offset-2 hover:underline"
                  style={{ color: "#c8a56b" }}
                >
                  Entrar para continuar o pagamento
                </Link>
              )}
            </div>
          )}
          {emailStatus === "available" && (
            <p className="text-xs mt-1.5" style={{ color: "#8c8" }}>
              E-mail disponível.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="signup-telefone" className={labelClass} style={labelColor}>
            Celular (WhatsApp) *
          </label>
          <input
            id="signup-telefone"
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
          id="signup-senha"
          label="Senha *"
          value={senha}
          onChange={setSenha}
          placeholder="Crie uma senha segura"
          autoComplete="new-password"
          hint={PASSWORD_HINT}
        />

        <LpPasswordInput
          id="signup-confirmar"
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
          ) : (
            "Continuar para pagamento"
          )}
        </button>

        <p className="text-[11px] text-center leading-relaxed pt-1" style={{ color: "rgba(247,242,236,0.28)" }}>
          Ao continuar, você concorda em receber comunicações sobre sua inscrição e pagamento.
        </p>
      </form>
    </div>
  );
}
