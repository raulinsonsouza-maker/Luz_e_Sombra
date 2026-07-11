import fs from "fs";
import path from "path";

const src = fs.readFileSync("artifacts/luz-e-sombra/src/pages/AdminPage.tsx", "utf8");
const lines = src.split(/\r?\n/);

const sections = [
  ["DashboardTab", 214, 395],
  ["UsuariosTab", 396, 718],
  ["ComunidadeTab", 719, 946],
  ["EngajamentoTab", 947, 1127],
  ["ModulosJornadaTab", 1128, 1303],
  ["CursosTab", 1305, 1768],
];

const tabImports = `import { useState, useEffect, useRef } from "react";
import {
  Users, Plus, Edit2, Trash2, Check, X, Loader2, Search, CheckCircle, AlertCircle,
  MessageSquare, GraduationCap, FileText, Youtube, ImageIcon, BookOpen,
  ChevronDown, ChevronUp, Eye, EyeOff, LayoutDashboard, Shield, TrendingUp,
  UserCheck, Layers, Heart, Flame, Sparkles, Star, Sun, Bell, type LucideIcon,
} from "lucide-react";
import { apiFetch } from "@/lib/auth";
import { AuthenticatedImage } from "@/components/AuthenticatedImage";
import { getVideoEmbedUrl } from "@/lib/mediaEmbed";
import { toastApiError } from "@/lib/apiError";
import {
  BG, CARD, CARD_S, INPUT_ST, SELECT_ST, C, OPT, REACTIONS,
  type ShowMsg, type Usuario, type FormValues, emptyForm,
  validarFormularioUsuario, timeAgo, type Post, type ComentarioEngajamento,
  type Aula, type Curso, type CursoDetalhe, type Stats,
} from "./shared";
`;

const dir = "artifacts/luz-e-sombra/src/pages/admin";
fs.mkdirSync(dir, { recursive: true });

let sharedBody = lines.slice(13, 115).join("\n");
sharedBody = sharedBody
  .replace("function timeAgo", "export function timeAgo")
  .replace("function validarUsernameAdmin", "export function validarUsernameAdmin")
  .replace("function validarSenhaAdmin", "export function validarSenhaAdmin")
  .replace("function validarEmailAdmin", "export function validarEmailAdmin")
  .replace("function validarFormularioUsuario", "export function validarFormularioUsuario")
  .replace("const emptyForm", "export const emptyForm")
  .replace("const BG", "export const BG")
  .replace("const CARD", "export const CARD")
  .replace("const CARD_S", "export const CARD_S")
  .replace("const INPUT_ST", "export const INPUT_ST")
  .replace("const SELECT_ST", "export const SELECT_ST")
  .replace("const C", "export const C")
  .replace("const OPT", "export const OPT")
  .replace("const REACTIONS", "export const REACTIONS")
  .replace("interface Usuario", "export interface Usuario")
  .replace("type FormValues", "export type FormValues")
  .replace("interface Post", "export interface Post")
  .replace("interface ComentarioEngajamento", "export interface ComentarioEngajamento")
  .replace("interface Aula", "export interface Aula")
  .replace("interface Curso", "export interface Curso")
  .replace("interface CursoDetalhe", "export interface CursoDetalhe")
  .replace("interface Stats", "export interface Stats")
  .replace("type Tab", "export type Tab");

const shared = `import type { LucideIcon } from "lucide-react";
import { Heart, Flame, Sparkles, Star, Sun } from "lucide-react";

export type ShowMsg = (tipo: "sucesso" | "erro", texto: string) => void;

${sharedBody}
`;

fs.writeFileSync(path.join(dir, "shared.ts"), shared);

for (const [name, start, end] of sections) {
  let body = lines.slice(start, end + 1).join("\n");
  body = body.replace(/^function (\w+)/, "export function $1");
  if (name === "ModulosJornadaTab") {
    body =
      "export interface ModuloJornadaLinha {\n  slug: string;\n  tituloIntro: string;\n  descricaoIntro: string;\n  videoIntroUrl: string | null;\n  cursoVinculadoId: number | null;\n  ordem: number;\n}\n\n" +
      body;
  }
  fs.writeFileSync(path.join(dir, `${name}.tsx`), `${tabImports}\n${body}\n`);
}

const mainImports = `import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import {
  Users, MessageSquare, GraduationCap, LayoutDashboard, Shield, Layers, Bell, Loader2, CheckCircle, AlertCircle, type LucideIcon,
} from "lucide-react";
import { BG, C, type Tab } from "./admin/shared";
import { DashboardTab } from "./admin/DashboardTab";
import { UsuariosTab } from "./admin/UsuariosTab";
import { ComunidadeTab } from "./admin/ComunidadeTab";
import { EngajamentoTab } from "./admin/EngajamentoTab";
import { ModulosJornadaTab } from "./admin/ModulosJornadaTab";
import { CursosTab } from "./admin/CursosTab";
`;

const main = `${mainImports}\n${lines.slice(116, 212).join("\n")}\n`;
fs.writeFileSync("artifacts/luz-e-sombra/src/pages/AdminPage.tsx", main);
console.log("Admin split done");
