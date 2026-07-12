import { useLocation } from "wouter";
import type { LucideIcon } from "lucide-react";
import { Home, Map, Users2, User, GraduationCap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { isChromelessRoute } from "@/lib/navConfig";

const NAV_LEFT: { href: string; label: string; icon: typeof Home }[] = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/comunidade", label: "Comunidade", icon: Users2 },
];

const NAV_RIGHT: { href: string; label: string; icon: typeof Home }[] = [
  { href: "/cursos", label: "Cursos", icon: GraduationCap },
  { href: "/perfil", label: "Perfil", icon: User },
];

function isNavActive(location: string, href: string) {
  return href === "/dashboard" ? location === href : location.startsWith(href);
}

export default function BottomNav() {
  const [location, navigate] = useLocation();
  const { user, status } = useAuth();

  if (isChromelessRoute(location) || status !== "authenticated" || !user) return null;

  const jornadaActive = location.startsWith("/jornada");

  function SideItem({ href, label, icon: Icon }: { href: string; label: string; icon: LucideIcon }) {
    const active = isNavActive(location, href);
    return (
      <button
        type="button"
        onClick={() => navigate(href)}
        className="flex flex-col items-center justify-end gap-0.5 w-full max-w-full px-0.5 py-1 rounded-xl transition-all relative min-w-0"
      >
        {active && (
          <span
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
            style={{ background: "#c8a56b" }}
          />
        )}
        <Icon
          className="w-5 h-5 transition-all"
          style={{ color: active ? "#c8a56b" : "rgba(247,242,236,0.3)", strokeWidth: active ? 2.2 : 1.6 }}
        />
        <span
          className="text-[9px] font-medium tracking-wide transition-all text-center leading-tight px-0.5"
          style={{ color: active ? "#c8a56b" : "rgba(247,242,236,0.3)" }}
        >
          {label}
        </span>
      </button>
    );
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: "linear-gradient(to top, #130f09 0%, #1a1208 60%, #1e1812 100%)",
        borderTop: "1px solid rgba(200,165,107,0.18)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.5)",
      }}
    >
      <div className="max-w-lg mx-auto flex items-end pt-2 pb-4 px-1">
        {NAV_LEFT.map((item) => (
          <div key={item.href} className="flex-1 flex justify-center items-end min-w-0">
            <SideItem href={item.href} label={item.label} icon={item.icon} />
          </div>
        ))}

        <div className="flex-1 flex justify-center items-end min-w-0 pb-0.5">
          <div className="-mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => navigate("/jornada")}
              className="rounded-full flex flex-col items-center justify-center gap-0.5 transition-transform active:scale-95 leading-none"
              aria-current={jornadaActive ? "page" : undefined}
              style={{
                width: 64,
                height: 64,
                paddingTop: 8,
                paddingBottom: 6,
                background: jornadaActive
                  ? "linear-gradient(145deg, #d4b87a 0%, #c8a56b 45%, #8a6a3a 100%)"
                  : "linear-gradient(145deg, #2a2218 0%, #1e1812 55%, #161008 100%)",
                border: jornadaActive ? "2px solid rgba(255,230,180,0.45)" : "2px solid rgba(200,165,107,0.55)",
                boxShadow: jornadaActive
                  ? "0 0 0 1px rgba(200,165,107,0.35), 0 8px 28px rgba(200,165,107,0.35)"
                  : "0 6px 22px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <Map
                className="w-[22px] h-[22px] shrink-0"
                style={{
                  color: jornadaActive ? "#1a1208" : "#c8a56b",
                  strokeWidth: jornadaActive ? 2.4 : 2,
                }}
              />
              <span
                className="text-[8px] font-bold tracking-wide"
                style={{
                  color: jornadaActive ? "#1a1208" : "rgba(200,165,107,0.92)",
                  letterSpacing: "0.04em",
                }}
              >
                Jornada
              </span>
            </button>
          </div>
        </div>

        {NAV_RIGHT.map((item) => (
          <div key={item.href} className="flex-1 flex justify-center items-end min-w-0">
            <SideItem href={item.href} label={item.label} icon={item.icon} />
          </div>
        ))}
      </div>
    </nav>
  );
}
