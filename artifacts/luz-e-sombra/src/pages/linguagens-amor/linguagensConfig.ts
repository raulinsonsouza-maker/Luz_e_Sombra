import type { LucideIcon } from "lucide-react";
import {
  MessageCircleHeart,
  Clock,
  Gift,
  HandHeart,
  Hand,
} from "lucide-react";
import type { LinguagemAmor } from "@workspace/cinco-linguagens-amor";

export interface LinguagemVisual {
  icon: LucideIcon;
  cor: string;
  corBg: string;
  corBorder: string;
  apelido: string;
}

export const LINGUAGEM_VISUAL: Record<LinguagemAmor, LinguagemVisual> = {
  palavras: {
    icon: MessageCircleHeart,
    cor: "#e8a0b4",
    corBg: "rgba(232,160,180,0.1)",
    corBorder: "rgba(232,160,180,0.28)",
    apelido: "A voz que valida",
  },
  tempo: {
    icon: Clock,
    cor: "#6b9fd4",
    corBg: "rgba(107,159,212,0.1)",
    corBorder: "rgba(107,159,212,0.28)",
    apelido: "A presença plena",
  },
  presentes: {
    icon: Gift,
    cor: "#c8a56b",
    corBg: "rgba(200,165,107,0.12)",
    corBorder: "rgba(200,165,107,0.3)",
    apelido: "O gesto que marca",
  },
  servicos: {
    icon: HandHeart,
    cor: "#7bc49a",
    corBg: "rgba(123,196,154,0.1)",
    corBorder: "rgba(123,196,154,0.28)",
    apelido: "O cuidado na prática",
  },
  toque: {
    icon: Hand,
    cor: "#d4846a",
    corBg: "rgba(212,132,106,0.1)",
    corBorder: "rgba(212,132,106,0.28)",
    apelido: "O corpo que acolhe",
  },
};
