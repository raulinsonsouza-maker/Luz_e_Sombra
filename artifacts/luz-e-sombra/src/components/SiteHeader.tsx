import type { ReactNode } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import {
  Shield,
  LogOut,
  UserCircle,
  Bell,
  ChevronDown,
  Compass,
} from "lucide-react";
import { useNotificacoesCount } from "@/hooks/useNotificacoesCount";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NAV_PRIMARY,
  NAV_TOOLS,
  isNavActive,
  isToolsGroupActive,
  isChromelessRoute,
} from "@/lib/navConfig";
import { LP_PORTAL_NAME } from "@/lib/lpConfig";

const GOLD = "#c8a56b";
const TEXT = "#f7f2ec";
const MUTED = "rgba(247,242,236,0.45)";
const BORDER = "rgba(200,165,107,0.12)";

function NavButton({
  active,
  onClick,
  children,
  className = "",
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium transition-colors rounded-lg ${className}`}
      style={{ color: active ? GOLD : MUTED }}
      onMouseEnter={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(247,242,236,0.82)";
      }}
      onMouseLeave={(e) => {
        if (!active) (e.currentTarget as HTMLElement).style.color = MUTED;
      }}
    >
      {children}
      {active && (
        <span
          className="absolute bottom-0 left-3 right-3 h-px rounded-full"
          style={{ background: GOLD }}
        />
      )}
    </button>
  );
}

export default function SiteHeader() {
  const [location, navigate] = useLocation();
  const { user, status, logout } = useAuth();
  const { count: notiCount } = useNotificacoesCount();

  if (isChromelessRoute(location) || status !== "authenticated" || !user) return null;

  const isAdmin = Boolean(user.isAdmin);
  const primeiroNome = (user.nome || "Usuário").split(" ")[0];
  const toolsActive = isToolsGroupActive(location);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      className="sticky top-0 z-40 hidden md:block"
      style={{
        background: "linear-gradient(160deg, #1a1208 0%, #1e1812 60%, #2f251b 100%)",
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between gap-6 h-16 min-h-16">

          {/* Brand */}
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 group shrink-0"
          >
            <div
              className="w-px h-7 transition-opacity group-hover:opacity-100 opacity-60"
              style={{ background: `linear-gradient(to bottom, transparent, ${GOLD}, transparent)` }}
            />
            <span className="font-tan-mon-cheri text-base tracking-wide" style={{ color: TEXT }}>
              {LP_PORTAL_NAME}
            </span>
          </button>

          {/* Desktop nav — primário + explorar */}
          <nav className="flex items-center justify-center gap-1">
            {NAV_PRIMARY.map(({ href, label, icon: Icon }) => {
              const active = isNavActive(location, href);
              return (
                <NavButton key={href} active={active} onClick={() => navigate(href)}>
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </NavButton>
              );
            })}

            <div
              className="w-px h-5 mx-1 shrink-0"
              style={{ background: "rgba(200,165,107,0.15)" }}
              aria-hidden
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="relative flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium transition-colors rounded-lg outline-none"
                  style={{ color: toolsActive ? GOLD : MUTED }}
                >
                  <Compass className="w-3.5 h-3.5" />
                  Explorar
                  <ChevronDown className="w-3 h-3 opacity-60" />
                  {toolsActive && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-px rounded-full"
                      style={{ background: GOLD }}
                    />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                sideOffset={10}
                className="min-w-[15rem] border-0 p-2 shadow-xl"
                style={{
                  background: "linear-gradient(160deg, #1e1812 0%, #2a2118 100%)",
                  border: `1px solid rgba(200,165,107,0.18)`,
                }}
              >
                <DropdownMenuLabel
                  className="text-[10px] tracking-widest uppercase font-medium px-2 py-1"
                  style={{ color: "rgba(200,165,107,0.55)" }}
                >
                  Ferramentas
                </DropdownMenuLabel>
                {NAV_TOOLS.map(({ href, label, icon: Icon, description }) => {
                  const active = isNavActive(location, href);
                  return (
                    <DropdownMenuItem
                      key={href}
                      onClick={() => navigate(href)}
                      className="flex flex-col items-start gap-0.5 rounded-lg px-3 py-2.5 cursor-pointer border-0 focus:bg-transparent"
                      style={{
                        background: active ? "rgba(200,165,107,0.1)" : "transparent",
                      }}
                    >
                      <span className="flex items-center gap-2 text-xs font-medium" style={{ color: active ? GOLD : TEXT }}>
                        <Icon className="w-3.5 h-3.5" style={{ color: active ? GOLD : "rgba(200,165,107,0.7)" }} />
                        {label}
                      </span>
                      {description && (
                        <span className="text-[10px] pl-5 leading-snug" style={{ color: "rgba(247,242,236,0.38)" }}>
                          {description}
                        </span>
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {isAdmin && (
              <>
                <div
                  className="w-px h-5 mx-1 shrink-0"
                  style={{ background: "rgba(200,165,107,0.15)" }}
                  aria-hidden
                />
                <NavButton
                  active={location.startsWith("/admin")}
                  onClick={() => navigate("/admin")}
                  className="!px-2.5"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </NavButton>
              </>
            )}
          </nav>

          {/* Utilitários */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => navigate("/notificacoes")}
              className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
              title="Notificações"
              style={{ color: location === "/notificacoes" ? GOLD : MUTED }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = GOLD; }}
              onMouseLeave={(e) => {
                if (location !== "/notificacoes") (e.currentTarget as HTMLElement).style.color = MUTED;
              }}
            >
              <Bell className="w-4 h-4" />
              {notiCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center rounded-full text-[9px] font-bold px-0.5"
                  style={{ background: GOLD, color: "#130f09" }}
                >
                  {notiCount > 99 ? "99+" : notiCount}
                </span>
              )}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors outline-none"
                  style={{ color: location === "/perfil" ? GOLD : "rgba(247,242,236,0.6)" }}
                >
                  <UserCircle className="w-4 h-4" />
                  <span className="text-xs font-medium max-w-[7rem] truncate">{primeiroNome}</span>
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={10}
                className="min-w-[10rem] border-0 p-1.5 shadow-xl"
                style={{
                  background: "linear-gradient(160deg, #1e1812 0%, #2a2118 100%)",
                  border: `1px solid rgba(200,165,107,0.18)`,
                }}
              >
                <DropdownMenuItem
                  onClick={() => navigate("/perfil")}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs cursor-pointer"
                  style={{ color: location === "/perfil" ? GOLD : TEXT }}
                >
                  <UserCircle className="w-3.5 h-3.5" />
                  Meu perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator style={{ background: "rgba(200,165,107,0.12)" }} />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs cursor-pointer"
                  style={{ color: "rgba(247,242,236,0.55)" }}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
