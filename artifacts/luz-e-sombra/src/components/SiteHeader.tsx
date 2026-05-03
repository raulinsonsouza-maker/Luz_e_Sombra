import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Home, Target, Hash, History, Shield, LogOut, Menu, X, UserCircle, Layers } from "lucide-react";

export default function SiteHeader() {
  const [location, navigate] = useLocation();
  const { user, status, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isPublicPage = location === "/" || location === "/login" || location === "/admin/login";
  if (isPublicPage || status !== "authenticated" || !user) return null;

  const isAdmin = Boolean(user.isAdmin);
  const primeiroNome = (user.nome || "Usuário").split(" ")[0];

  const links = [
    { href: "/dashboard", label: "Início", icon: Home },
    { href: "/avaliacao", label: "Avaliação", icon: Target },
    { href: "/numerologia", label: "Numerologia", icon: Hash },
    { href: "/traco-de-carater", label: "Traço", icon: Layers },
    { href: "/historico", label: "Histórico", icon: History },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (href: string) =>
    href === "/dashboard" ? location === "/dashboard" : location.startsWith(href);

  return (
    <>
      <header
        className="sticky top-0 z-40"
        style={{
          background: "linear-gradient(160deg, #1e1812 0%, #2f251b 60%, #3d2f1f 100%)",
          borderBottom: "1px solid rgba(200,165,107,0.15)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">

            {/* Brand */}
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-3 group"
            >
              <div
                className="w-px h-7 transition-opacity group-hover:opacity-100 opacity-70"
                style={{ background: "linear-gradient(to bottom, transparent, #c8a56b, transparent)" }}
              />
              <span
                className="font-tan-mon-cheri text-lg tracking-wide transition-colors"
                style={{ color: "#f7f2ec" }}
              >
                Da Sombra à Luz
              </span>
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {links.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <button
                    key={href}
                    type="button"
                    onClick={() => navigate(href)}
                    className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-lg"
                    style={{
                      color: active ? "#c8a56b" : "rgba(247,242,236,0.5)",
                    }}
                    onMouseEnter={e => {
                      if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(247,242,236,0.85)";
                    }}
                    onMouseLeave={e => {
                      if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(247,242,236,0.5)";
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                    {active && (
                      <span
                        className="absolute bottom-0 left-4 right-4 h-px rounded-full"
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
                  className="relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-lg ml-1"
                  style={{
                    color: location.startsWith("/admin") ? "#c8a56b" : "rgba(200,165,107,0.5)",
                    border: "1px solid rgba(200,165,107,0.25)",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,107,0.5)";
                    (e.currentTarget as HTMLElement).style.color = "#c8a56b";
                  }}
                  onMouseLeave={e => {
                    if (!location.startsWith("/admin")) {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,107,0.25)";
                      (e.currentTarget as HTMLElement).style.color = "rgba(200,165,107,0.5)";
                    }
                  }}
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </button>
              )}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/perfil")}
                className="hidden lg:flex items-center gap-3 rounded-lg px-2 py-1 transition-all"
                title="Meu Perfil"
                style={{ color: location === "/perfil" ? "#c8a56b" : "rgba(247,242,236,0.6)" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = "#c8a56b";
                }}
                onMouseLeave={e => {
                  if (location !== "/perfil") (e.currentTarget as HTMLElement).style.color = "rgba(247,242,236,0.6)";
                }}
              >
                <div className="w-px h-5" style={{ background: "rgba(200,165,107,0.2)" }} />
                <UserCircle className="w-4 h-4" />
                <div className="text-right">
                  <p className="text-xs" style={{ color: "rgba(200,165,107,0.5)", letterSpacing: "0.1em" }}>
                    Olá,
                  </p>
                  <p className="text-sm font-medium" style={{ color: "inherit" }}>
                    {primeiroNome}
                  </p>
                </div>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all"
                style={{ color: "rgba(247,242,236,0.45)", border: "1px solid rgba(200,165,107,0.15)" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = "#c8a56b";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,107,0.4)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = "rgba(247,242,236,0.45)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,107,0.15)";
                }}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sair</span>
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg"
                style={{ color: "rgba(247,242,236,0.6)", border: "1px solid rgba(200,165,107,0.2)" }}
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div
            className="md:hidden border-t"
            style={{ borderColor: "rgba(200,165,107,0.15)", background: "rgba(30,24,18,0.98)" }}
          >
            <div className="px-4 py-3 space-y-1">
              {links.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <button
                    key={`m-${href}`}
                    type="button"
                    onClick={() => { setMobileOpen(false); navigate(href); }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all"
                    style={{
                      color: active ? "#c8a56b" : "rgba(247,242,236,0.55)",
                      background: active ? "rgba(200,165,107,0.08)" : "transparent",
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => { setMobileOpen(false); navigate("/perfil"); }}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all"
                style={{
                  color: location === "/perfil" ? "#c8a56b" : "rgba(247,242,236,0.55)",
                  background: location === "/perfil" ? "rgba(200,165,107,0.08)" : "transparent",
                }}
              >
                <UserCircle className="w-4 h-4" />
                Meu Perfil
              </button>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => { setMobileOpen(false); navigate("/admin"); }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium"
                  style={{ color: "rgba(200,165,107,0.7)", border: "1px solid rgba(200,165,107,0.2)" }}
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
