import type { LucideIcon } from "lucide-react";
import {
  Home,
  Users2,
  GraduationCap,
  Map,
  Flame,
  Target,
  Hash,
  Layers,
  History,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description?: string;
}

/** Destinos principais — sempre visíveis no desktop. */
export const NAV_PRIMARY: NavItem[] = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/jornada", label: "Jornada", icon: Map, description: "Sua trilha de auto-conhecimento" },
  { href: "/comunidade", label: "Comunidade", icon: Users2 },
  { href: "/cursos", label: "Cursos", icon: GraduationCap, description: "Trilhas guiadas (em breve)" },
];

/** Ferramentas e avaliações — agrupadas no menu «Explorar». */
export const NAV_TOOLS: NavItem[] = [
  { href: "/jornada/traco", label: "Traço de Caráter", icon: Layers, description: "Leitura corporal Reich/Lowen" },
  { href: "/jornada/roda", label: "Avaliação", icon: Target, description: "Roda da Vida e diagnósticos" },
  { href: "/jornada/numerologia", label: "Numerologia", icon: Hash, description: "Mapa numerológico pessoal" },
  { href: "/missoes", label: "Missões", icon: Flame, description: "Desafios e gamificação" },
  { href: "/historico", label: "Histórico", icon: History, description: "Resultados anteriores" },
];

export function isNavActive(location: string, href: string): boolean {
  return href === "/dashboard" ? location === "/dashboard" : location.startsWith(href);
}

export function isToolsGroupActive(location: string): boolean {
  return NAV_TOOLS.some((item) => isNavActive(location, item.href));
}

export function isChromelessRoute(location: string): boolean {
  return (
    location === "/" ||
    location === "/vsl" ||
    location === "/checkout" ||
    location === "/acesso-pos-compra" ||
    location === "/login" ||
    location === "/esqueci-senha" ||
    location === "/redefinir-senha" ||
    location === "/admin/login" ||
    location.startsWith("/admin")
  );
}
