import { useLocation } from "wouter";
import { Home, Map, Users2, GraduationCap, User, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNotificacoesCount } from "@/hooks/useNotificacoesCount";

const ITEMS = [
  { href: "/dashboard",      label: "Início",     icon: Home },
  { href: "/comunidade",     label: "Comunidade", icon: Users2 },
  { href: "/cursos",         label: "Cursos",     icon: GraduationCap },
  { href: "/jornada",        label: "Jornada",    icon: Map },
  { href: "/notificacoes",   label: "Alertas",    icon: Bell },
  { href: "/perfil",         label: "Perfil",     icon: User },
];

export default function BottomNav() {
  const [location, navigate] = useLocation();
  const { user, status } = useAuth();
  const { count: notiCount } = useNotificacoesCount();

  const isPublicPage =
    location === "/" || location === "/login" || location === "/admin/login";

  if (isPublicPage || status !== "authenticated" || !user) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: "linear-gradient(to top, #130f09 0%, #1a1208 60%, #1e1812 100%)",
        borderTop: "1px solid rgba(200,165,107,0.18)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.5)",
      }}
    >
      <div className="flex items-center justify-around px-1 pt-2 pb-4">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard" ? location === href : location.startsWith(href);
          const isBell = href === "/notificacoes";
          return (
            <button
              key={href}
              onClick={() => navigate(href)}
              className="flex flex-col items-center gap-0.5 px-1 py-1 rounded-xl transition-all relative"
              style={{ minWidth: 40 }}
            >
              {active && (
                <span
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                  style={{ background: "#c8a56b" }}
                />
              )}
              <div className="relative">
                <Icon
                  className="w-5 h-5 transition-all"
                  style={{ color: active ? "#c8a56b" : "rgba(247,242,236,0.3)", strokeWidth: active ? 2.2 : 1.6 }}
                />
                {isBell && notiCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 min-w-[14px] h-3.5 flex items-center justify-center rounded-full text-[8px] font-bold px-0.5"
                    style={{ background: "#c8a56b", color: "#130f09" }}
                  >
                    {notiCount > 9 ? "9+" : notiCount}
                  </span>
                )}
              </div>
              <span
                className="text-[9px] font-medium tracking-wide transition-all"
                style={{ color: active ? "#c8a56b" : "rgba(247,242,236,0.3)" }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
