import { useEffect, useRef, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { Check, Loader2, Shield, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  LP_PRODUCT_NAME,
  LP_PRODUCT_TAGLINE,
  LP_INCLUDED_ITEMS,
  LP_PRICE,
  formatLpPrice,
  buildCaktoUrl,
  CAKTO_CHECKOUT_URL,
  LP_GUARANTEE_DAYS,
} from "@/lib/lpConfig";
import { trackLpEvent, type LpVariant } from "@/lib/lpAnalytics";

function variantFromSearch(from: string | null): LpVariant {
  return from === "vsl" ? "vsl" : "control";
}

export default function CheckoutPage() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const from = params.get("from");
  const variant = variantFromSearch(from);

  const trackedStart = useRef(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (trackedStart.current) return;
    trackedStart.current = true;
    trackLpEvent("checkout_start", variant, { from: from ?? "direct" });
  }, [variant, from]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim() || !email.trim()) {
      toast.error("Preencha nome e e-mail.");
      return;
    }

    setEnviando(true);

    const caktoUrl = buildCaktoUrl(nome.trim(), email.trim(), telefone.trim() || undefined);
    if (CAKTO_CHECKOUT_URL && caktoUrl) {
      trackLpEvent("checkout_complete", variant, { provider: "cakto" });
      window.location.href = caktoUrl;
      return;
    }

    await new Promise((r) => setTimeout(r, 1200));
    trackLpEvent("checkout_complete", variant, { provider: "simulated" });
    toast.success("Compra simulada com sucesso! Em breve você receberá o acesso por e-mail.");
    setEnviando(false);
    navigate("/login?compra=simulada");
  }

  return (
    <div className="min-h-screen" style={{ background: "#0f0c09" }}>
      <nav
        className="h-14 flex items-center px-5"
        style={{ borderBottom: "1px solid rgba(200,165,107,0.12)" }}
      >
        <button
          type="button"
          onClick={() => navigate(from === "vsl" ? "/vsl" : "/")}
          className="flex items-center gap-2 text-xs transition-opacity hover:opacity-70"
          style={{ color: "rgba(200,165,107,0.7)" }}
        >
          <ArrowLeft size={14} />
          Voltar
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-5 py-10 grid lg:grid-cols-2 gap-10">
        {/* Resumo */}
        <div>
          <p
            className="text-xs font-bold tracking-[0.3em] uppercase mb-3"
            style={{ color: "rgba(200,165,107,0.6)" }}
          >
            Resumo do pedido
          </p>
          <h1
            className="font-tan-mon-cheri mb-2"
            style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", color: "#f7f2ec", lineHeight: 1.2 }}
          >
            {LP_PRODUCT_NAME}
          </h1>
          <p className="text-sm mb-6" style={{ color: "rgba(247,242,236,0.45)" }}>
            {LP_PRODUCT_TAGLINE}
          </p>

          <div
            className="rounded-2xl p-6 mb-6"
            style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.2)" }}
          >
            <div className="flex items-baseline gap-3 mb-5">
              <span className="font-tan-mon-cheri text-4xl" style={{ color: "#c8a56b" }}>
                {formatLpPrice(LP_PRICE)}
              </span>
              <span className="text-xs" style={{ color: "rgba(247,242,236,0.35)" }}>
                pagamento único
              </span>
            </div>
            <ul className="space-y-2.5">
              {LP_INCLUDED_ITEMS.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check size={14} className="flex-shrink-0 mt-0.5" style={{ color: "#c8a56b" }} />
                  <span className="text-xs" style={{ color: "rgba(247,242,236,0.6)" }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="flex items-start gap-3 p-4 rounded-xl"
            style={{ background: "rgba(200,165,107,0.05)", border: "1px solid rgba(200,165,107,0.12)" }}
          >
            <Shield size={16} className="flex-shrink-0 mt-0.5" style={{ color: "#c8a56b" }} />
            <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.45)" }}>
              Garantia de {LP_GUARANTEE_DAYS} dias. Se não fizer sentido, devolvemos 100% sem burocracia.
            </p>
          </div>
        </div>

        {/* Formulário */}
        <div>
          <div
            className="rounded-2xl p-7"
            style={{ background: "#1e1812", border: "1px solid rgba(200,165,107,0.18)" }}
          >
            <h2 className="font-tan-mon-cheri text-xl mb-6" style={{ color: "#f7f2ec" }}>
              Seus dados
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs mb-1.5 font-medium" style={{ color: "rgba(247,242,236,0.5)" }}>
                  Nome completo *
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-colors focus:ring-1"
                  style={{
                    background: "rgba(15,12,9,0.8)",
                    border: "1px solid rgba(200,165,107,0.2)",
                    color: "#f7f2ec",
                  }}
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="block text-xs mb-1.5 font-medium" style={{ color: "rgba(247,242,236,0.5)" }}>
                  E-mail *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{
                    background: "rgba(15,12,9,0.8)",
                    border: "1px solid rgba(200,165,107,0.2)",
                    color: "#f7f2ec",
                  }}
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-xs mb-1.5 font-medium" style={{ color: "rgba(247,242,236,0.5)" }}>
                  WhatsApp (opcional)
                </label>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
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
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
                style={{
                  background: "linear-gradient(135deg, #9c7742 0%, #c8a56b 50%, #9c7742 100%)",
                  color: "#fff",
                  boxShadow: "0 8px 32px rgba(200,165,107,0.3)",
                }}
              >
                {enviando ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processando...
                  </>
                ) : CAKTO_CHECKOUT_URL ? (
                  "Pagar com Cakto"
                ) : (
                  "Finalizar compra"
                )}
              </button>

              {!CAKTO_CHECKOUT_URL && (
                <p className="text-center text-xs" style={{ color: "rgba(247,242,236,0.25)" }}>
                  Modo simulado — integração Cakto em breve
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
