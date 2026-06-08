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
    descricaoCurta: "Vive no reino das ideias. Criativo, sensível e profundamente introspectivo.",
    descricaoLonga:
      "A estrutura Esquizóide carrega uma inteligência singular e uma visão de mundo única. Estas pessoas habitam o universo das ideias com brilhantismo, possuem profundidade filosófica e uma criatividade que nasce da solidão como fonte. O desafio está em trazer essa riqueza interior para o contato real com o mundo.",
    cor: "#9b8fde",
    corBg: "rgba(155,143,222,0.08)",
    corBorder: "rgba(155,143,222,0.3)",
  },
  oral: {
    nome: "Oral",
    descricaoCurta: "Profundamente humano. Sente, conecta e nutre com o coração aberto.",
    descricaoLonga:
      "A estrutura Oral tem uma capacidade extraordinária de sentir o outro. São pessoas que nutrem, que se importam genuinamente, que constroem vínculos de calor real. A saudade, a melancolia e o desejo de pertencer fazem parte de uma riqueza emocional sem igual. O caminho é aprender a receber tanto quanto oferecem.",
    cor: "#5b9bd5",
    corBg: "rgba(91,155,213,0.08)",
    corBorder: "rgba(91,155,213,0.3)",
  },
  psicopata: {
    nome: "Psicopata",
    descricaoCurta: "Natural na liderança. Estratégico, persuasivo e orientado ao poder.",
    descricaoLonga:
      "A estrutura Psicopata possui um magnetismo e uma capacidade de influência raros. São líderes natos, estrategistas brilhantes, com uma visão clara do que querem. O desafio está em abrir o coração para a vulnerabilidade e descobrir que a força real não precisa de controle.",
    cor: "#e07b39",
    corBg: "rgba(224,123,57,0.08)",
    corBorder: "rgba(224,123,57,0.3)",
  },
  masoquista: {
    nome: "Masoquista",
    descricaoCurta: "Resiliente e leal. Suporta tudo com uma força interna impressionante.",
    descricaoLonga:
      "A estrutura Masoquista carrega uma lealdade, uma resistência e uma capacidade de suportar que poucos possuem. Estas pessoas são presença certa nas horas difíceis, têm profundidade emocional e uma força que nasce da dor transformada. O caminho é aprender que a vida também pode ser leveza e expansão, não só resistência.",
    cor: "#6db96d",
    corBg: "rgba(109,185,109,0.08)",
    corBorder: "rgba(109,185,109,0.3)",
  },
  rigido: {
    nome: "Rígido",
    descricaoCurta: "Estruturado e realizador. Busca excelência com disciplina e presença.",
    descricaoLonga:
      "A estrutura Rígida possui organização, comprometimento e uma capacidade de realizar que inspira. São pessoas confiáveis, prezam a qualidade em tudo que fazem e têm uma presença impactante. O caminho é abrir espaço para o coração, deixar o controle de lado e permitir ser tocado pela vida.",
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
