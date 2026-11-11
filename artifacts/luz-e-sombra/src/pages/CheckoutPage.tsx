import { useEffect } from "react";
import { useLocation } from "wouter";

/** Legado: redireciona para o checkout embutido na landing. */
export default function CheckoutPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      navigate(`/?checkout=${encodeURIComponent(token)}#checkout`, { replace: true });
    } else {
      navigate("/#checkout", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0c09" }}>
      <p className="text-sm" style={{ color: "rgba(247,242,236,0.5)" }}>
        Redirecionando para o checkout...
      </p>
    </div>
  );
}
