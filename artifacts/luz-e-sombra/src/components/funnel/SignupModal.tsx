import { useState } from "react";
import { useLocation } from "wouter";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { getStoredUtms } from "@/lib/utm";
import { trackLpEvent, type LpVariant } from "@/lib/lpAnalytics";
import { toastApiError } from "@/lib/apiError";
import { digitsOnlyPhone, formatBrazilPhone, isValidBrazilPhone } from "@/lib/phoneMask";

interface Props {
  open: boolean;
  onClose: () => void;
  variant: LpVariant;
}

export default function SignupModal({ open, onClose, variant }: Props) {
  const [, navigate] = useLocation();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [enviando, setEnviando] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      toast.error("As senhas não coincidem.");
      return;
    }
    if (senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
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
          email: email.trim(),
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
          {[
            { id: "nome", label: "Nome completo *", type: "text" as const, value: nome, set: setNome, placeholder: "Seu nome" },
            { id: "email", label: "E-mail *", type: "email" as const, value: email, set: setEmail, placeholder: "seu@email.com" },
            { id: "senha", label: "Senha *", type: "password" as const, value: senha, set: setSenha, placeholder: "Mínimo 6 caracteres" },
            { id: "confirmar", label: "Confirmar senha *", type: "password" as const, value: confirmarSenha, set: setConfirmarSenha, placeholder: "Repita a senha" },
          ].map(({ id, label, type, value, set, placeholder }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-xs mb-1.5 font-medium" style={{ color: "rgba(247,242,236,0.5)" }}>
                {label}
              </label>
              <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => set(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: "rgba(15,12,9,0.8)",
                  border: "1px solid rgba(200,165,107,0.2)",
                  color: "#f7f2ec",
                }}
                placeholder={placeholder}
              />
            </div>
          ))}

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

          <button
            type="submit"
            disabled={enviando}
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
            ) : (
              "Continuar para pagamento"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
