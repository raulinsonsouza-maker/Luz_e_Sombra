import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import {
  Users, MessageSquare, GraduationCap, LayoutDashboard, Shield, Layers, Bell, Loader2, CheckCircle, AlertCircle,
  CreditCard, Webhook, Mail, type LucideIcon,
} from "lucide-react";
import { BG, C, type Tab } from "./admin/shared";
import { DashboardTab } from "./admin/DashboardTab";
import { UsuariosTab } from "./admin/UsuariosTab";
import { ComunidadeTab } from "./admin/ComunidadeTab";
import { EngajamentoTab } from "./admin/EngajamentoTab";
import { ModulosJornadaTab } from "./admin/ModulosJornadaTab";
import { CursosTab } from "./admin/CursosTab";
import { ComprasTab } from "./admin/ComprasTab";
import { WebhooksTab } from "./admin/WebhooksTab";
import { EmailsTab } from "./admin/EmailsTab";

// ── Main ───────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [, navigate] = useLocation();
  const { user, status } = useAuth();
  const [aba, setAba] = useState<Tab>("dashboard");
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") navigate("/admin/login");
    else if (status === "authenticated" && !user?.isAdmin) navigate("/admin/login");
  }, [status, user]);

  function showMsg(tipo: "sucesso" | "erro", texto: string) {
    setMensagem({ tipo, texto });
    setTimeout(() => setMensagem(null), 4500);
  }

  if (status === "loading") {
    return (
      <div style={{ background: BG, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="w-10 h-10 animate-spin" style={{ color: C.gold }} />
      </div>
    );
  }

  const TABS: { key: Tab; label: string; icon: LucideIcon }[] = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "usuarios", label: "Usuários", icon: Users },
    { key: "compras", label: "Compras", icon: CreditCard },
    { key: "webhooks", label: "Webhooks", icon: Webhook },
    { key: "emails", label: "E-mails", icon: Mail },
    { key: "comunidade", label: "Comunidade", icon: MessageSquare },
    { key: "engajamento", label: "Engajamento", icon: Bell },
    { key: "modulosJornada", label: "Módulos da Jornada", icon: Layers },
    { key: "cursos", label: "Cursos", icon: GraduationCap },
  ];

  return (
    <div style={{ background: BG, minHeight: "100vh" }}>
      {/* Sticky header + nav */}
      <div className="sticky top-0 z-20 backdrop-blur-md" style={{ borderBottom: "1px solid rgba(200,165,107,0.12)", background: "rgba(19,15,9,0.9)" }}>
        <div className="max-w-7xl mx-auto px-5 pt-3 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl font-semibold text-sm"
              style={{ background: "linear-gradient(135deg, rgba(200,165,107,0.15), rgba(156,119,66,0.05))", border: "1px solid rgba(200,165,107,0.3)", color: C.gold, letterSpacing: "0.04em" }}>
              SL
            </div>
            <div className="hidden sm:block">
              <p className="text-xs tracking-[0.2em] uppercase leading-none mb-0.5" style={{ color: "rgba(200,165,107,0.45)" }}>Painel</p>
              <h1 className="font-tan-mon-cheri text-lg leading-none" style={{ color: C.gold }}>Administração</h1>
            </div>
          </div>

          {/* Toast */}
          {mensagem && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium flex-1 justify-center"
              style={mensagem.tipo === "sucesso"
                ? { background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80" }
                : { background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}>
              {mensagem.tipo === "sucesso" ? <CheckCircle className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
              <span className="truncate">{mensagem.texto}</span>
            </div>
          )}

          {/* User */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl shrink-0"
            style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.15)" }}>
            <Shield className="w-3.5 h-3.5" style={{ color: C.bronze }} />
            <span className="text-xs" style={{ color: C.muted }}>{user?.nome?.split(" ")[0] || user?.username}</span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="max-w-7xl mx-auto px-5 flex overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setAba(key)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all shrink-0 relative"
              style={{ color: aba === key ? C.gold : "rgba(247,242,236,0.3)" }}>
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
              {aba === key && <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-t-full" style={{ background: C.gold }} />}
            </button>
          ))}
        </div>
      </div>

      {/* Page content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {aba === "dashboard"  && <DashboardTab showMsg={showMsg} />}
        {aba === "usuarios"   && <UsuariosTab showMsg={showMsg} />}
        {aba === "compras"    && <ComprasTab showMsg={showMsg} />}
        {aba === "webhooks"   && <WebhooksTab />}
        {aba === "emails"     && <EmailsTab />}
        {aba === "comunidade" && <ComunidadeTab showMsg={showMsg} />}
        {aba === "engajamento" && <EngajamentoTab showMsg={showMsg} />}
        {aba === "modulosJornada" && <ModulosJornadaTab showMsg={showMsg} />}
        {aba === "cursos"     && <CursosTab showMsg={showMsg} />}
      </div>
    </div>
  );
}
