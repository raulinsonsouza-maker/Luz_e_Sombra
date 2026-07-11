import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import { Heart, Flame, Sparkles, Star, Sun } from "lucide-react";

export type ShowMsg = (tipo: "sucesso" | "erro", texto: string) => void;

// ── Design tokens ──────────────────────────────────────────────────────────────
export const BG = "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)";
export const CARD: CSSProperties = { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.12)" };
export const CARD_S: CSSProperties = { background: "rgba(200,165,107,0.05)", border: "1.5px solid rgba(200,165,107,0.2)" };
export const INPUT_ST: CSSProperties = { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(200,165,107,0.25)", color: "#f7f2ec" };
export const SELECT_ST: CSSProperties = { background: "#1e1812", border: "1px solid rgba(200,165,107,0.25)", color: "#f7f2ec" };
export const C = { text: "#f7f2ec", muted: "rgba(247,242,236,0.45)", gold: "#c8a56b", bronze: "#9c7742", dim: "rgba(247,242,236,0.25)" };
export const OPT: CSSProperties = { background: "#1e1812" };

// ── Reaction config ────────────────────────────────────────────────────────────
export const REACTIONS: { key: string; icon: LucideIcon; color: string; label: string }[] = [
  { key: "❤️", icon: Heart,    color: "#e85555", label: "Amor" },
  { key: "🔥", icon: Flame,    color: "#e86c2b", label: "Fogo" },
  { key: "💫", icon: Sparkles, color: "#c8a56b", label: "Magia" },
  { key: "🙏", icon: Sun,      color: "#f0c040", label: "Gratidão" },
  { key: "✨", icon: Star,     color: "#c8a56b", label: "Inspiração" },
];

// ── Types ──────────────────────────────────────────────────────────────────────
export interface Usuario {
  id: number; username: string; nome: string; email: string | null;
  dataNascimento: string | null; primeiroAcesso: boolean; ativo: boolean;
  isAdmin: boolean; criadoEm: string; _count: { avaliacoes: number };
}
export type FormValues = { username: string; senha: string; nome: string; email: string; dataNascimento: string; isAdmin: boolean };
export const emptyForm: FormValues = { username: "", senha: "", nome: "", email: "", dataNascimento: "", isAdmin: false };

export function validarUsernameAdmin(u: string): string | null {
  const norm = u.trim().toLowerCase();
  if (!norm) return "Usuário é obrigatório.";
  if (!/^[a-z0-9._-]{3,30}$/.test(norm)) {
    return "Usuário inválido: 3 a 30 caracteres, só minúsculas, números, ponto, hífen ou underline.";
  }
  return null;
}

export function validarSenhaAdmin(s: string, obrigatoria: boolean): string | null {
  if (!s) return obrigatoria ? "Senha é obrigatória." : null;
  if (s.length < 6) return "Senha deve ter pelo menos 6 caracteres.";
  return null;
}

export function validarEmailAdmin(e: string): string | null {
  const norm = e.trim().toLowerCase();
  if (!norm) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(norm)) return "Email inválido.";
  return null;
}

export function validarFormularioUsuario(values: FormValues, editando: boolean): string | null {
  const usernameErr = validarUsernameAdmin(values.username);
  if (usernameErr) return usernameErr;
  const senhaErr = validarSenhaAdmin(values.senha, !editando);
  if (senhaErr) return senhaErr;
  if (!values.nome.trim()) return "Nome completo é obrigatório.";
  const emailErr = validarEmailAdmin(values.email);
  if (emailErr) return emailErr;
  return null;
}

export interface Post {
  id: number; tipo: string; conteudo: string; mediaUrl: string | null; criadoEm: string;
  autorNome: string; reacoes: Record<string, number>;
}
export interface ComentarioEngajamento {
  id: number;
  publicacaoId: number;
  conteudo: string;
  criadoEm: string;
  autorId: number;
  autorNome: string;
  autorAdmin: boolean;
  publicacaoTipo: "texto" | "imagem" | "video";
  publicacaoConteudo: string;
  publicacaoAutorId: number;
}
export interface Aula {
  id: number; titulo: string; descricao: string | null; videoUrl: string | null;
  conteudo: string | null; ordem: number; duracaoMin: number | null;
}
export interface Curso {
  id: number; titulo: string; descricao: string; imagemUrl: string | null;
  categoria: string | null; nivel: string | null; moduloJornada: string | null; publicado: boolean;
  aulasCount: number; aulasConcluidasCount: number;
}
export interface CursoDetalhe extends Curso { aulas: Aula[] }
export interface Stats {
  usuarios: { total: number; ativos: number };
  posts: number; reacoes: number; cursos: number; analiseTraco: number;
}
export type Tab = "dashboard" | "usuarios" | "comunidade" | "engajamento" | "modulosJornada" | "cursos" | "compras" | "webhooks" | "emails";

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} h`;
  const days = Math.floor(hrs / 24);
  return `${days} d`;
}
