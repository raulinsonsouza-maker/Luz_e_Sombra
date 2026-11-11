import type { TemperamentoCodigo } from "@workspace/temperamento-v1";
import type { EstruturaTraco } from "@workspace/traco-narrativa";
import type { LinguagemAmor } from "@workspace/cinco-linguagens-amor";

export type AreaVidaId =
  | "plenitudeFelicidade"
  | "espiritualidade"
  | "saudeDisposicao"
  | "desenvolvimentoIntelectual"
  | "equilibrioEmocional"
  | "familia"
  | "desenvolvimentoAmoroso"
  | "vidaSocial"
  | "realizacaoProposito"
  | "recursosFinanceiros"
  | "contribuicaoSocial"
  | "criatividadeHobbyDiversao";

export const AREAS_RODA_ORDEM: AreaVidaId[] = [
  "plenitudeFelicidade",
  "espiritualidade",
  "saudeDisposicao",
  "desenvolvimentoIntelectual",
  "equilibrioEmocional",
  "familia",
  "desenvolvimentoAmoroso",
  "vidaSocial",
  "realizacaoProposito",
  "recursosFinanceiros",
  "contribuicaoSocial",
  "criatividadeHobbyDiversao",
];

export const AREA_TITULO: Record<AreaVidaId, string> = {
  plenitudeFelicidade: "Plenitude e Felicidade",
  espiritualidade: "Espiritualidade",
  saudeDisposicao: "Saúde e Disposição",
  desenvolvimentoIntelectual: "Desenvolvimento Intelectual",
  equilibrioEmocional: "Equilíbrio Emocional",
  familia: "Família",
  desenvolvimentoAmoroso: "Relacionamento Amoroso",
  vidaSocial: "Vida Social",
  realizacaoProposito: "Realização e Propósito",
  recursosFinanceiros: "Recursos Financeiros",
  contribuicaoSocial: "Contribuição Social",
  criatividadeHobbyDiversao: "Criatividade, Hobby e Diversão",
};

export type NivelArea = "urgente" | "atencao" | "desenvolvimento" | "excelencia";

export type TemperamentoCruzado = {
  primario: TemperamentoCodigo;
  secundario?: TemperamentoCodigo;
  pontoCego?: string;
  trechoRelacoes?: string;
  trechoTrabalho?: string;
};

export type TracoCruzado = {
  estruturaPrincipal: EstruturaTraco;
  estruturaSecundaria?: EstruturaTraco;
  sinteseHumana?: string;
  dinamicaFuncional?: {
    trabalho?: string;
    relacoes?: string;
    estresse?: string;
    decisoes?: string;
    energia?: string;
    sombra?: string;
  };
};

export type LinguagensCruzadas = {
  receberPrincipal: LinguagemAmor | string;
  receberSecundaria?: LinguagemAmor | string;
  expressarPrincipal: LinguagemAmor | string;
  expressarSecundaria?: LinguagemAmor | string;
  desalinhamento?: { ativo: boolean; texto: string };
  cena?: string;
};

export type ContextoCruzado = {
  temperamento: TemperamentoCruzado | null;
  traco: TracoCruzado | null;
  linguagens: LinguagensCruzadas | null;
};

export type AnaliseAreaRoda = {
  id: AreaVidaId;
  titulo: string;
  valor: number;
  nivel: NivelArea;
  labelNivel: string;
  oQueAcontece: string;
  comoTemperamentoEntra?: string;
  comoTracoEntra?: string;
  comoLinguagensEntram?: string;
  comoMelhorar: string[];
  pergunta: string;
};

export type ResultadoRodaCruzada = {
  abertura: string[];
  analises: AnaliseAreaRoda[];
  fontes: {
    temperamento: boolean;
    traco: boolean;
    linguagens: boolean;
  };
};
