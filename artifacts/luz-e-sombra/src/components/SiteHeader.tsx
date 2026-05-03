import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Home, Target, Hash, History, Shield, LogOut, UserCircle, Layers, Map, Flame, Users2, GraduationCap, Bell } from "lucide-react";
import { useNotificacoesCount } from "@/hooks/useNotificacoesCount";

export default function SiteHeader() {
  const [location, navigate] = useLocation();
  const { user, status, logout } = useAuth();

  const isPublicPage = location === "/" || location === "/login" || location === "/admin/login";
  if (isPublicPage || status !== "authenticated" || !user) return null;

  const isAdmin = Boolean(user.isAdmin);
  const primeiroNome = (user.nome || "Usuário").split(" ")[0];
  const { count: notiCount } = useNotificacoesCount();

  const links = [
    { href: "/dashboard",        label: "Início",      icon: Home       },
    { href: "/comunidade",       label: "Comunidade",  icon: Users2     },
    { href: "/cursos",           label: "Cursos",      icon: GraduationCap },
    { href: "/jornada",          label: "Jornada",     icon: Map        },
    { href: "/missoes",          label: "Missões",     icon: Flame      },
    { href: "/avaliacao",        label: "Avaliação",   icon: Target     },
    { href: "/numerologia",      label: "Numerologia", icon: Hash       },
    { href: "/traco-de-carater", label: "Traço",       icon: Layers     },
    { href: "/historico",        label: "Histórico",   icon: History    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (href: string) =>
    href === "/dashboard" ? location === "/dashboard" : location.startsWith(href);

  return (
    <header
      className="sticky top-0 z-40 hidden md:block"
      style={{
        background: "linear-gradient(160deg, #1a1208 0%, #1e1812 60%, #2f251b 100%)",
        borderBottom: "1px solid rgba(200,165,107,0.12)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">

          {/* Brand */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-3 group shrink-0"
          >
            <div
              className="w-px h-6 transition-opacity group-hover:opacity-100 opacity-60"
              style={{ background: "linear-gradient(to bottom, transparent, #c8a56b, transparent)" }}
            />
            <span
              className="font-tan-mon-cheri text-base tracking-wide"
              style={{ color: "#f7f2ec" }}
            >
              Da Sombra à Luz
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="flex items-center gap-0.5 overflow-x-auto">
            {links.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <button
                  key={href}
                  type="button"
                  onClick={() => navigate(href)}
                  className="relative flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all rounded-lg shrink-0"
                  style={{ color: active ? "#c8a56b" : "rgba(247,242,236,0.45)" }}
                  onMouseEnter={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(247,242,236,0.8)";
                  }}
                  onMouseLeave={e => {
                    if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(247,242,236,0.45)";
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-px rounded-full"
                      style={{ background: "#c8a56b" }}
                    />
                  )}
                </button>
              );
            })}
            {isAdmin && (
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="relative flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all rounded-lg ml-1 shrink-0"
                style={{
                  color: location.startsWith("/admin") ? "#c8a56b" : "rgba(200,165,107,0.45)",
                  border: "1px solid rgba(200,165,107,0.2)",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,107,0.4)";
                  (e.currentTarget as HTMLElement).style.color = "#c8a56b";
                }}
                onMouseLeave={e => {
                  if (!location.startsWith("/admin")) {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,107,0.2)";
                    (e.currentTarget as HTMLElement).style.color = "rgba(200,165,107,0.45)";
                  }
                }}
              >
                <Shield className="w-3.5 h-3.5" />
                Admin
              </button>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate("/notificacoes")}
              className="relative flex items-center justify-center w-8 h-8 rounded-lg transition-all"
              title="Notificações"
              style={{ color: location === "/notificacoes" ? "#c8a56b" : "rgba(247,242,236,0.45)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#c8a56b"; }}
              onMouseLeave={e => {
                if (location !== "/notificacoes") (e.currentTarget as HTMLElement).style.color = "rgba(247,242,236,0.45)";
              }}
            >
              <Bell className="w-4 h-4" />
              {notiCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 min-w-[16px] h-4 flex items-center justify-center rounded-full text-[9px] font-bold px-0.5"
                  style={{ background: "#c8a56b", color: "#130f09" }}
                >
                  {notiCount > 99 ? "99+" : notiCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate("/perfil")}
              className="flex items-center gap-2 rounded-lg px-2 py-1 transition-all"
              title="Meu Perfil"
              style={{ color: location === "/perfil" ? "#c8a56b" : "rgba(247,242,236,0.55)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#c8a56b"; }}
              onMouseLeave={e => {
                if (location !== "/perfil") (e.currentTarget as HTMLElement).style.color = "rgba(247,242,236,0.55)";
              }}
            >
              <UserCircle className="w-4 h-4" />
              <span className="text-xs font-medium">{primeiroNome}</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all"
              style={{ color: "rgba(247,242,236,0.4)", border: "1px solid rgba(200,165,107,0.12)" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = "#c8a56b";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,107,0.35)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = "rgba(247,242,236,0.4)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,107,0.12)";
              }}
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
