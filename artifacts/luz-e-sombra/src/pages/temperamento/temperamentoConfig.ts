import type { LucideIcon } from "lucide-react";
import { Zap, Sparkles, Brain, Shield } from "lucide-react";
import type { TemperamentoCodigo, TipoPerfil } from "@workspace/temperamento-v1";

export interface TemperamentoVisual {
  icon: LucideIcon;
  nome: string;
  cor: string;
  corBg: string;
  corBorder: string;
}

export const TEMPERAMENTO_VISUAL: Record<TemperamentoCodigo, TemperamentoVisual> = {
  COLERICO: {
    icon: Zap,
    nome: "Colérico",
    cor: "#e07b39",
    corBg: "rgba(224,123,57,0.12)",
    corBorder: "rgba(224,123,57,0.3)",
  },
  SANGUINEO: {
    icon: Sparkles,
    nome: "Sanguíneo",
    cor: "#e8c547",
    corBg: "rgba(232,197,71,0.1)",
    corBorder: "rgba(232,197,71,0.28)",
  },
  MELANCOLICO: {
    icon: Brain,
    nome: "Melancólico",
    cor: "#9b8fde",
    corBg: "rgba(155,143,222,0.1)",
    corBorder: "rgba(155,143,222,0.28)",
  },
  FLEUMATICO: {
    icon: Shield,
    nome: "Fleumático",
    cor: "#6bada8",
    corBg: "rgba(107,173,168,0.1)",
    corBorder: "rgba(107,173,168,0.28)",
  },
};

export const DIMENSAO_LABEL: Record<string, string> = {
  ENG: "Energia e ritmo",
  SOC: "Sociabilidade",
  DOM: "Liderança e controlo",
  EST: "Estabilidade emocional",
  PRO: "Profundidade analítica",
};

export function labelTipoPerfil(tipo: TipoPerfil | string | undefined): string {
  switch (tipo) {
    case "DUPLO":
      return "Duas forças principais";
    case "DOMINANTE":
      return "Um temperamento claro";
    case "MISTO":
      return "Perfil equilibrado";
    case "ATIPICO":
      return "Temperamento muito marcado";
    default:
      return "Seu mapa";
  }
}
