import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import {
  Users, MessageSquare, GraduationCap, LayoutDashboard, Shield, Layers, Bell, Loader2, CheckCircle, AlertCircle,
  CreditCard, Webhook, Mail, CalendarDays, Menu, X, Settings, PanelLeftClose, PanelLeft, Images, UserCircle, LogOut, type LucideIcon,
} from "lucide-react";
import { LOGO_CLARO } from "@/lib/marca";
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
import { GaleriaTab } from "./admin/GaleriaTab";
import { PerfilAdminTab } from "./admin/PerfilAdminTab";

type NavItem = { key: Tab; label: string; icon: LucideIcon };
type NavGroup = { titulo: string; itens: NavItem[] };

const NAV_OPERACIONAL: NavGroup[] = [
  {
    titulo: "Início",
    itens: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { key: "perfil", label: "Perfil", icon: UserCircle },
    ],
  },
  {
    titulo: "Pessoas",
    itens: [
      { key: "usuarios", label: "Usuários", icon: Users },
      { key: "compras", label: "Compras", icon: CreditCard },
    ],
  },
  {
    titulo: "Conteúdo",
    itens: [
      { key: "conteudoDia", label: "Conteúdo do dia", icon: CalendarDays },
      { key: "galeria", label: "Galeria", icon: Images },
      { key: "comunidade", label: "Comunidade", icon: MessageSquare },
      { key: "engajamento", label: "Engajamento", icon: Bell },
      { key: "modulosJornada", label: "Módulos", icon: Layers },
      { key: "cursos", label: "Cursos", icon: GraduationCap },
    ],
  },
];

const NAV_CONFIG: NavItem[] = [
  { key: "webhooks", label: "Webhooks", icon: Webhook },
  { key: "emails", label: "E-mails", icon: Mail },
];

const TODAS_ABAS: NavItem[] = [
  ...NAV_OPERACIONAL.flatMap((g) => g.itens),
  ...NAV_CONFIG,
];

const ABAS_VALIDAS = new Set<string>(TODAS_ABAS.map((i) => i.key));

function lerAbaDaUrl(): Tab {
  try {
    const v = new URLSearchParams(window.location.search).get("aba");
    if (v && ABAS_VALIDAS.has(v)) return v as Tab;
  } catch {
    /* ignore */
  }
  return "dashboard";
}

function escreverAbaNaUrl(tab: Tab) {
  try {
    const url = new URL(window.location.href);
    if (tab === "dashboard") url.searchParams.delete("aba");
    else url.searchParams.set("aba", tab);
    const next = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState(window.history.state, "", next);
  } catch {
    /* ignore */
  }
}

export default function AdminPage() {
  const [, navigate] = useLocation();
  const { user, status } = useAuth();
  const [aba, setAbaState] = useState<Tab>(() => lerAbaDaUrl());
  const [menuAberto, setMenuAberto] = useState(false);
  const [recolhido, setRecolhido] = useState(false);
  const [configAberta, setConfigAberta] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  function setAba(tab: Tab) {
    setAbaState(tab);
    escreverAbaNaUrl(tab);
  }

  useEffect(() => {
    if (status === "unauthenticated") navigate("/admin/login");
    else if (status === "authenticated" && !user?.isAdmin) navigate("/admin/login");
  }, [status, user]);

  useEffect(() => {
    setMenuAberto(false);
  }, [aba]);

  useEffect(() => {
    if (NAV_CONFIG.some((i) => i.key === aba)) setConfigAberta(true);
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

  const tituloAba = TODAS_ABAS.find((i) => i.key === aba)?.label ?? "Administração";
  const configAtiva = NAV_CONFIG.some((i) => i.key === aba);

  function ItemBotao({ item, soIcone = false }: { item: NavItem; soIcone?: boolean }) {
    const Icon = item.icon;
    const ativo = aba === item.key;
    return (
      <button
        key={item.key}
        type="button"
        title={item.label}
        onClick={() => setAba(item.key)}
        className={`flex items-center rounded-xl text-left text-sm transition-colors ${soIcone ? "justify-center w-10 h-10 mx-auto" : "gap-3 px-3 py-2.5 w-full"}`}
        style={{
          background: ativo ? "rgba(200,165,107,0.12)" : "transparent",
          color: ativo ? C.gold : "rgba(247,242,236,0.55)",
          border: ativo ? "1px solid rgba(200,165,107,0.28)" : "1px solid transparent",
        }}
      >
        <Icon className="w-4 h-4 shrink-0" />
        {!soIcone && <span className="truncate">{item.label}</span>}
      </button>
    );
  }

  function NavOperacional({ soIcone = false }: { soIcone?: boolean }) {
    return (
      <nav className={`flex flex-col ${soIcone ? "gap-2" : "gap-5"}`}>
        {NAV_OPERACIONAL.map((grupo) => (
          <div key={grupo.titulo}>
            {!soIcone && (
              <p className="px-3 mb-2 text-[10px] font-semibold tracking-[0.18em] uppercase" style={{ color: "rgba(200,165,107,0.4)" }}>
                {grupo.titulo}
              </p>
            )}
            <div className={`flex flex-col ${soIcone ? "gap-1" : "gap-0.5"}`}>
              {grupo.itens.map((item) => (
                <ItemBotao key={item.key} item={item} soIcone={soIcone} />
              ))}
            </div>
          </div>
        ))}
      </nav>
    );
  }

  function NavConfig({ soIcone = false }: { soIcone?: boolean }) {
    if (soIcone) {
      return (
        <div className="flex flex-col gap-1">
          {NAV_CONFIG.map((item) => (
            <ItemBotao key={item.key} item={item} soIcone />
          ))}
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-0.5">
        {NAV_CONFIG.map((item) => (
          <ItemBotao key={item.key} item={item} />
        ))}
      </div>
    );
  }

  const larguraAside = recolhido ? "w-[4.5rem]" : "w-60";

  return (
    <div className="min-h-screen flex" style={{ background: BG }}>
      <aside
        className={`hidden lg:flex ${larguraAside} shrink-0 flex-col sticky top-0 h-screen border-r transition-[width] duration-200`}
        style={{ background: "rgba(19,15,9,0.96)", borderColor: "rgba(200,165,107,0.12)" }}
      >
        <div
          className={`border-b h-[53px] flex items-center shrink-0 ${recolhido ? "justify-center px-2" : "px-4"}`}
          style={{ borderColor: "rgba(200,165,107,0.1)" }}
        >
          <img
            src={LOGO_CLARO}
            alt="Portal Iluminando"
            className={recolhido ? "h-8 w-auto max-w-[2.75rem] object-contain object-center" : "h-8 w-auto max-w-[9.5rem] object-contain"}
          />
        </div>

        <div className={`flex-1 overflow-y-auto py-4 ${recolhido ? "px-2" : "px-3"}`}>
          <NavOperacional soIcone={recolhido} />
        </div>

        <div className={`border-t space-y-2 ${recolhido ? "px-2 py-3" : "px-3 py-3"}`} style={{ borderColor: "rgba(200,165,107,0.1)" }}>
          {!recolhido && configAberta && (
            <div className="mb-1">
              <p className="px-3 mb-2 text-[10px] font-semibold tracking-[0.18em] uppercase" style={{ color: "rgba(200,165,107,0.4)" }}>
                Configurações
              </p>
              <NavConfig />
            </div>
          )}
          {recolhido && configAberta && <NavConfig soIcone />}

          <button
            type="button"
            title="Configurações"
            onClick={() => {
              setConfigAberta((v) => !v);
              if (!configAberta) setAba("webhooks");
            }}
            className={`flex items-center rounded-xl text-sm w-full ${recolhido ? "justify-center w-10 h-10 mx-auto" : "gap-3 px-3 py-2.5"}`}
            style={{
              background: configAtiva || configAberta ? "rgba(200,165,107,0.12)" : "transparent",
              color: configAtiva || configAberta ? C.gold : "rgba(247,242,236,0.55)",
              border: configAtiva || configAberta ? "1px solid rgba(200,165,107,0.28)" : "1px solid transparent",
            }}
          >
            <Settings className="w-4 h-4 shrink-0" />
            {!recolhido && <span>Configurações</span>}
          </button>

          {!recolhido && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.15)" }}
            >
              <Shield className="w-3.5 h-3.5 shrink-0" style={{ color: C.bronze }} />
              <span className="text-xs truncate" style={{ color: C.muted }}>
                {user?.nome?.split(" ")[0] || user?.username}
              </span>
            </div>
          )}

          <button
            type="button"
            title="Sair do admin"
            onClick={() => navigate("/dashboard")}
            className={`flex items-center rounded-xl text-sm w-full ${recolhido ? "justify-center w-10 h-10 mx-auto" : "gap-3 px-3 py-2.5"}`}
            style={{
              color: "rgba(247,242,236,0.7)",
              background: "rgba(200,165,107,0.08)",
              border: "1px solid rgba(200,165,107,0.2)",
            }}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!recolhido && <span>Sair do admin</span>}
          </button>

          <button
            type="button"
            title={recolhido ? "Expandir menu" : "Recolher menu"}
            onClick={() => setRecolhido((v) => !v)}
            className={`flex items-center rounded-xl text-sm w-full ${recolhido ? "justify-center w-10 h-10 mx-auto" : "gap-3 px-3 py-2"}`}
            style={{ color: "rgba(247,242,236,0.45)" }}
          >
            {recolhido ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            {!recolhido && <span className="text-xs">Recolher</span>}
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <header
          className="sticky top-0 z-20 h-[53px] flex items-center gap-3 px-4 lg:px-6"
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
            <h2 className="font-tan-mon-cheri text-xl truncate" style={{ color: C.text }}>
              {tituloAba}
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shrink-0"
            style={{
              color: "#e8d5b0",
              background: "rgba(200,165,107,0.1)",
              border: "1px solid rgba(200,165,107,0.25)",
            }}
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair
          </button>

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

        <main className={`flex-1 w-full mx-auto ${aba === "conteudoDia" ? "px-3 py-4 lg:px-5 lg:py-5 max-w-[1400px]" : "px-4 py-5 lg:px-6 lg:py-6 max-w-7xl"}`}>
          {aba === "dashboard" && <DashboardTab showMsg={showMsg} onIrPara={(t) => setAba(t as Tab)} />}
          {aba === "usuarios" && <UsuariosTab showMsg={showMsg} />}
          {aba === "compras" && <ComprasTab showMsg={showMsg} />}
          {aba === "webhooks" && <WebhooksTab />}
          {aba === "emails" && <EmailsTab />}
          {aba === "comunidade" && <ComunidadeTab showMsg={showMsg} />}
          {aba === "engajamento" && <EngajamentoTab showMsg={showMsg} />}
          {aba === "modulosJornada" && <ModulosJornadaTab showMsg={showMsg} />}
          {aba === "cursos" && <CursosTab showMsg={showMsg} />}
          {aba === "conteudoDia" && <ConteudoDiaTab showMsg={showMsg} />}
          {aba === "galeria" && <GaleriaTab showMsg={showMsg} />}
          {aba === "perfil" && <PerfilAdminTab showMsg={showMsg} />}
        </main>
      </div>

      {menuAberto && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" className="absolute inset-0" style={{ background: "rgba(0,0,0,0.65)" }} aria-label="Fechar menu" onClick={() => setMenuAberto(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[min(18rem,86vw)] flex flex-col" style={{ background: "#16110c", borderRight: "1px solid rgba(200,165,107,0.15)" }}>
            <div className="flex items-center justify-between px-4 pt-4 pb-3">
              <img src={LOGO_CLARO} alt="Portal Iluminando" className="h-8 w-auto" />
              <button type="button" onClick={() => setMenuAberto(false)} className="w-9 h-9 flex items-center justify-center" style={{ color: C.muted }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 pb-4">
              <NavOperacional />
              <div className="mt-6">
                <p className="px-3 mb-2 text-[10px] font-semibold tracking-[0.18em] uppercase" style={{ color: "rgba(200,165,107,0.4)" }}>
                  Configurações
                </p>
                <NavConfig />
              </div>
            </div>
            <div className="px-3 pb-5 border-t pt-3" style={{ borderColor: "rgba(200,165,107,0.1)" }}>
              <button
                type="button"
                onClick={() => {
                  setMenuAberto(false);
                  navigate("/dashboard");
                }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm"
                style={{
                  color: "rgba(247,242,236,0.7)",
                  background: "rgba(200,165,107,0.08)",
                  border: "1px solid rgba(200,165,107,0.2)",
                }}
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Sair do admin
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
