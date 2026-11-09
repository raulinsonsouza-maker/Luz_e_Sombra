import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import {
  Users, MessageSquare, GraduationCap, LayoutDashboard, Shield, Layers, Bell, Loader2, CheckCircle, AlertCircle,
  CreditCard, Webhook, Mail, CalendarDays, Menu, X, type LucideIcon,
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
import { ConteudoDiaTab } from "./admin/ConteudoDiaTab";

type NavItem = { key: Tab; label: string; icon: LucideIcon };
type NavGroup = { titulo: string; itens: NavItem[] };

const NAV: NavGroup[] = [
  {
    titulo: "Visão geral",
    itens: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    titulo: "Pessoas e vendas",
    itens: [
      { key: "usuarios", label: "Usuários", icon: Users },
      { key: "compras", label: "Compras", icon: CreditCard },
      { key: "webhooks", label: "Webhooks", icon: Webhook },
      { key: "emails", label: "E-mails", icon: Mail },
    ],
  },
  {
    titulo: "Conteúdo",
    itens: [
      { key: "conteudoDia", label: "Conteúdo do dia", icon: CalendarDays },
      { key: "comunidade", label: "Comunidade", icon: MessageSquare },
      { key: "engajamento", label: "Engajamento", icon: Bell },
      { key: "modulosJornada", label: "Módulos", icon: Layers },
      { key: "cursos", label: "Cursos", icon: GraduationCap },
    ],
  },
];

export default function AdminPage() {
  const [, navigate] = useLocation();
  const { user, status } = useAuth();
  const [aba, setAba] = useState<Tab>("dashboard");
  const [menuAberto, setMenuAberto] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") navigate("/admin/login");
    else if (status === "authenticated" && !user?.isAdmin) navigate("/admin/login");
  }, [status, user]);

  useEffect(() => {
    setMenuAberto(false);
  }, [aba]);

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

  const tituloAba =
    NAV.flatMap((g) => g.itens).find((i) => i.key === aba)?.label ?? "Administração";

  function NavButtons({ compact = false }: { compact?: boolean }) {
    return (
      <nav className="flex flex-col gap-5">
        {NAV.map((grupo) => (
          <div key={grupo.titulo}>
            <p
              className="px-3 mb-2 text-[10px] font-semibold tracking-[0.18em] uppercase"
              style={{ color: "rgba(200,165,107,0.4)" }}
            >
              {grupo.titulo}
            </p>
            <div className="flex flex-col gap-0.5">
              {grupo.itens.map(({ key, label, icon: Icon }) => {
                const ativo = aba === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setAba(key)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors"
                    style={{
                      background: ativo ? "rgba(200,165,107,0.12)" : "transparent",
                      color: ativo ? C.gold : "rgba(247,242,236,0.55)",
                      border: ativo ? "1px solid rgba(200,165,107,0.28)" : "1px solid transparent",
                    }}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className={compact ? "truncate" : ""}>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ background: BG }}>
      {/* Sidebar desktop */}
      <aside
        className="hidden lg:flex w-60 shrink-0 flex-col sticky top-0 h-screen border-r"
        style={{
          background: "rgba(19,15,9,0.96)",
          borderColor: "rgba(200,165,107,0.12)",
        }}
      >
        <div className="px-4 pt-5 pb-4 border-b" style={{ borderColor: "rgba(200,165,107,0.1)" }}>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-9 h-9 rounded-xl font-semibold text-sm shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(200,165,107,0.15), rgba(156,119,66,0.05))",
                border: "1px solid rgba(200,165,107,0.3)",
                color: C.gold,
              }}
            >
              SL
            </div>
            <div className="min-w-0">
              <p className="text-[10px] tracking-[0.2em] uppercase leading-none mb-1" style={{ color: "rgba(200,165,107,0.45)" }}>
                Painel
              </p>
              <h1 className="font-tan-mon-cheri text-base leading-none truncate" style={{ color: C.gold }}>
                Administração
              </h1>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <NavButtons />
        </div>

        <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(200,165,107,0.1)" }}>
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.15)" }}
          >
            <Shield className="w-3.5 h-3.5 shrink-0" style={{ color: C.bronze }} />
            <span className="text-xs truncate" style={{ color: C.muted }}>
              {user?.nome?.split(" ")[0] || user?.username}
            </span>
          </div>
        </div>
      </aside>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <header
          className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 lg:px-6"
          style={{
            background: "rgba(19,15,9,0.92)",
            borderBottom: "1px solid rgba(200,165,107,0.1)",
            backdropFilter: "blur(10px)",
          }}
        >
          <button
            type="button"
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl"
            style={{ border: "1px solid rgba(200,165,107,0.2)", color: C.gold }}
            onClick={() => setMenuAberto(true)}
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] tracking-[0.16em] uppercase lg:hidden" style={{ color: C.muted }}>
              Administração
            </p>
            <h2 className="font-tan-mon-cheri text-xl truncate" style={{ color: C.text }}>
              {tituloAba}
            </h2>
          </div>

          {mensagem && (
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium max-w-sm"
              style={mensagem.tipo === "sucesso"
                ? { background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80" }
                : { background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}
            >
              {mensagem.tipo === "sucesso" ? <CheckCircle className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
              <span className="truncate">{mensagem.texto}</span>
            </div>
          )}

          <div
            className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl shrink-0"
            style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.15)" }}
          >
            <Shield className="w-3.5 h-3.5" style={{ color: C.bronze }} />
            <span className="text-xs" style={{ color: C.muted }}>{user?.nome?.split(" ")[0] || user?.username}</span>
          </div>
        </header>

        {mensagem && (
          <div
            className="sm:hidden mx-4 mt-3 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
            style={mensagem.tipo === "sucesso"
              ? { background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", color: "#4ade80" }
              : { background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)", color: "#f87171" }}
          >
            {mensagem.tipo === "sucesso" ? <CheckCircle className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
            <span className="truncate">{mensagem.texto}</span>
          </div>
        )}

        <main className="flex-1 px-4 py-5 lg:px-6 lg:py-6 max-w-7xl w-full mx-auto">
          {aba === "dashboard" && <DashboardTab showMsg={showMsg} />}
          {aba === "usuarios" && <UsuariosTab showMsg={showMsg} />}
          {aba === "compras" && <ComprasTab showMsg={showMsg} />}
          {aba === "webhooks" && <WebhooksTab />}
          {aba === "emails" && <EmailsTab />}
          {aba === "comunidade" && <ComunidadeTab showMsg={showMsg} />}
          {aba === "engajamento" && <EngajamentoTab showMsg={showMsg} />}
          {aba === "modulosJornada" && <ModulosJornadaTab showMsg={showMsg} />}
          {aba === "cursos" && <CursosTab showMsg={showMsg} />}
          {aba === "conteudoDia" && <ConteudoDiaTab showMsg={showMsg} />}
        </main>
      </div>

      {/* Drawer mobile */}
      {menuAberto && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.65)" }}
            aria-label="Fechar menu"
            onClick={() => setMenuAberto(false)}
          />
          <aside
            className="absolute left-0 top-0 bottom-0 w-[min(18rem,86vw)] flex flex-col"
            style={{ background: "#16110c", borderRight: "1px solid rgba(200,165,107,0.15)" }}
          >
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
              <p className="font-tan-mon-cheri text-lg" style={{ color: C.gold }}>Menu</p>
              <button
                type="button"
                onClick={() => setMenuAberto(false)}
                className="w-9 h-9 flex items-center justify-center"
                style={{ color: C.muted }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 pb-6">
              <NavButtons compact />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
