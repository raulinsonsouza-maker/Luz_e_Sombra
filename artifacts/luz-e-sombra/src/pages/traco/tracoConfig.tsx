import type { ReactNode } from "react";
import { User, Camera, ArrowRight } from "lucide-react";

export type TipoFoto = "rosto" | "corpo-frente" | "corpo-lado";

export interface EstruturasPct {
  esquizoide: number;
  oral: number;
  psicopata: number;
  masoquista: number;
  rigido: number;
}

export const ESTRUTURAS_CONFIG: Record<
  keyof EstruturasPct,
  { nome: string; descricaoCurta: string; descricaoLonga: string; cor: string; corBg: string; corBorder: string }
> = {
  esquizoide: {
    nome: "Esquizóide",
    descricaoCurta: "Criatividade e imaginação. Você vive muito por dentro e enxerga o que ainda não está visível.",
    descricaoLonga:
      "No Esquizoide, a fase é a gestação e a dor é a rejeição. O talento é criar e imaginar. Você não precisa virar uma pessoa mais extrovertida. Precisa trazer, aos poucos, essa riqueza para o contato real. A leitura completa mostra como isso acontece no seu corpo e no seu dia.",
    cor: "#9b8fde",
    corBg: "rgba(155,143,222,0.08)",
    corBorder: "rgba(155,143,222,0.3)",
  },
  oral: {
    nome: "Oral",
    descricaoCurta: "Comunicação e afeto. Você sente o outro e cria vínculo com facilidade.",
    descricaoLonga:
      "No Oral, a fase é a amamentação e a dor é o abandono. O talento é falar, cuidar e aproximar. O caminho não é deixar de sentir. É aprender a receber também, sem se esvaziar. A análise detalhada descreve esse movimento na sua vida.",
    cor: "#5b9bd5",
    corBg: "rgba(91,155,213,0.08)",
    corBorder: "rgba(91,155,213,0.3)",
  },
  psicopata: {
    nome: "Psicopata",
    descricaoCurta: "Liderança e negociação. Você organiza o espaço e move as pessoas.",
    descricaoLonga:
      "No Psicopata, a fase vai de 1 a 2,5 anos e a dor é de manipulação e controle. O talento é liderar e negociar. Força, aqui, não pede controle o tempo todo. A leitura longa mostra onde isso te protege e onde te afasta.",
    cor: "#e07b39",
    corBg: "rgba(224,123,57,0.08)",
    corBorder: "rgba(224,123,57,0.3)",
  },
  masoquista: {
    nome: "Masoquista",
    descricaoCurta: "Planejamento, resistência e força. Você sustenta o que os outros soltam.",
    descricaoLonga:
      "No Masoquista, a fase é o desfralde e a dor é a humilhação e a crítica. O talento é planejar, resistir e permanecer. Você não precisa carregar tudo para ter valor. A análise detalhada mostra essa força e o custo de usá-la o tempo inteiro.",
    cor: "#6db96d",
    corBg: "rgba(109,185,109,0.08)",
    corBorder: "rgba(109,185,109,0.3)",
  },
  rigido: {
    nome: "Rígido",
    descricaoCurta: "Execução, dinamismo e capricho. Você entrega e mantém o padrão.",
    descricaoLonga:
      "No Rígido, a fase vai de 3,5 a 5 anos e a dor é a traição e a exclusão afetiva. O talento é executar com precisão. Competência não exige esconder o que você sente. A leitura completa aprofunda esse jeito de funcionar.",
    cor: "#c8a56b",
    corBg: "rgba(200,165,107,0.08)",
    corBorder: "rgba(200,165,107,0.3)",
  },
};

export const FOTOS_CONFIG: Record<TipoFoto, { label: string; instrucoes: string[]; icon: ReactNode }> = {
  rosto: {
    label: "Foto do Rosto",
    instrucoes: [
      "Fundo neutro (branco ou bege), boa iluminação frontal",
      "Expressão neutra e relaxada, olhando para a câmera",
      "Enquadre do pescoço até o topo da cabeça",
    ],
    icon: <User className="w-7 h-7" />,
  },
  "corpo-frente": {
    label: "Corpo, vista frontal",
    instrucoes: [
      "Em pé, corpo inteiro visível (cabeça a pés)",
      "Roupa justa ou mínima para permitir leitura corporal",
      "Posição natural, sem forçar postura",
    ],
    icon: <Camera className="w-7 h-7" />,
  },
  "corpo-lado": {
    label: "Corpo, vista lateral",
    instrucoes: [
      "Perfil completo, da cabeça aos pés",
      "Posição natural de pé, braços soltos ao lado",
      "Iluminação que destaque contorno e postura",
    ],
    icon: <ArrowRight className="w-7 h-7" />,
  },
};
