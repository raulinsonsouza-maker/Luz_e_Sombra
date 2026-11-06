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

const ALTURA_BARRA = 64;

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
        className="flex h-full w-full flex-col items-center justify-center gap-1 px-0.5"
      >
        <span
          className="h-0.5 w-6 rounded-full"
          style={{ background: active ? "#c8a56b" : "transparent" }}
        />
        <Icon
          className="h-5 w-5 shrink-0"
          style={{ color: active ? "#c8a56b" : "rgba(247,242,236,0.3)", strokeWidth: active ? 2.2 : 1.6 }}
        />
        <span
          className="h-3 w-full truncate text-center text-[9px] font-medium leading-none"
          style={{ color: active ? "#c8a56b" : "rgba(247,242,236,0.3)" }}
        >
          {label}
        </span>
      </button>
    );
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 md:hidden"
      style={{
        height: `calc(${ALTURA_BARRA}px + env(safe-area-inset-bottom, 0px))`,
        background: "linear-gradient(to top, #130f09 0%, #1a1208 60%, #1e1812 100%)",
        borderTop: "1px solid rgba(200,165,107,0.18)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.5)",
      }}
    >
      <div className="relative mx-auto grid h-16 max-w-lg grid-cols-5" style={{ height: ALTURA_BARRA }}>
        {NAV_LEFT.map((item) => (
          <div key={item.href} className="h-full min-w-0">
            <SideItem href={item.href} label={item.label} icon={item.icon} />
          </div>
        ))}

        <div className="relative h-full min-w-0">
          <button
            type="button"
            onClick={() => navigate("/jornada")}
            className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center justify-center gap-0.5 rounded-full leading-none"
            aria-current={jornadaActive ? "page" : undefined}
            style={{
              width: 64,
              height: 64,
              bottom: 20,
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
              className="h-[22px] w-[22px] shrink-0"
              style={{
                color: jornadaActive ? "#1a1208" : "#c8a56b",
                strokeWidth: jornadaActive ? 2.4 : 2,
              }}
            />
            <span
              className="text-[8px] font-bold"
              style={{
                color: jornadaActive ? "#1a1208" : "rgba(200,165,107,0.92)",
                letterSpacing: "0.04em",
              }}
            >
              Jornada
            </span>
          </button>
        </div>

        {NAV_RIGHT.map((item) => (
          <div key={item.href} className="h-full min-w-0">
            <SideItem href={item.href} label={item.label} icon={item.icon} />
          </div>
        ))}
      </div>
    </nav>
  );
}
