import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Home, Target, Calendar, History, Shield, LogOut, Menu, X } from "lucide-react";

export default function SiteHeader() {
  const [location, navigate] = useLocation();
  const { user, status, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isPublicPage = location === "/login" || location === "/admin/login";
  if (isPublicPage || status !== "authenticated" || !user) return null;

  const isAdmin = Boolean(user.isAdmin);
  const primeiroNome = (user.nome || "Usuário").split(" ")[0];

  const links = [
    { href: "/", label: "Início", icon: Home },
    { href: "/avaliacao", label: "Avaliação", icon: Target },
    { href: "/numerologia", label: "Numerologia", icon: Calendar },
    { href: "/historico", label: "Histórico", icon: History },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-brand-gold/25 bg-white/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-3 text-brand-dark hover:text-brand-bronze transition-colors"
          >
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full overflow-hidden shadow-luxury">
              <img src="/logo-luxury.svg" alt="Logo Da Sombra à Luz" width={40} height={40} />
            </div>
            <div className="text-left">
              <p className="text-base font-semibold leading-none">Da Sombra à Luz</p>
              <p className="text-xs text-brand-medium">Experiência Premium</p>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-2 rounded-2xl border border-brand-gold/20 bg-white/80 p-1">
            {links.map(({ href, label, icon: Icon }) => {
              const active = location === href || (href !== "/" && location.startsWith(href));
              return (
                <button
                  key={href}
                  type="button"
                  onClick={() => navigate(href)}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? "bg-brand-gold/25 text-brand-dark border border-brand-gold/40 shadow-sm"
                      : "text-brand-medium hover:text-brand-dark hover:bg-brand-gold/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
            {isAdmin && (
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  location.startsWith("/admin")
                    ? "bg-purple-100 text-purple-700 border border-purple-200 shadow-sm"
                    : "text-purple-700 hover:bg-purple-50"
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden lg:block text-right">
              <p className="text-xs text-brand-medium">Olá,</p>
              <p className="text-sm font-semibold text-brand-dark">{primeiroNome}</p>
            </div>
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-brand-gold/30 text-brand-dark"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-brand-gold/40 text-brand-dark hover:bg-brand-gold/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden mt-3 rounded-2xl border border-brand-gold/20 bg-white/95 p-2 space-y-1">
            {links.map(({ href, label, icon: Icon }) => {
              const active = location === href || (href !== "/" && location.startsWith(href));
              return (
                <button
                  key={`m-${href}`}
                  type="button"
                  onClick={() => { setMobileOpen(false); navigate(href); }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm w-full ${
                    active ? "bg-brand-gold/20 text-brand-dark" : "text-brand-medium"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
            {isAdmin && (
              <button
                type="button"
                onClick={() => { setMobileOpen(false); navigate("/admin"); }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-purple-700 bg-purple-50 w-full"
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
