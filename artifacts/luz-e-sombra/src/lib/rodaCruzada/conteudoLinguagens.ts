import type { LinguagemAmor } from "@workspace/cinco-linguagens-amor";
import type { AreaVidaId } from "./tipos";

export const NOME_LINGUAGEM: Record<string, string> = {
  palavras: "palavras de afirmação",
  tempo: "tempo de qualidade",
  presentes: "presentes",
  servicos: "atos de serviço",
  toque: "toque físico",
};

export const AREAS_LINGUAGEM: AreaVidaId[] = [
  "desenvolvimentoAmoroso",
  "familia",
  "vidaSocial",
  "plenitudeFelicidade",
];

/** Como a linguagem principal de receber aparece nas áreas relacionais. */
export const CONTEUDO_LINGUAGEM_RECEBER: Partial<
  Record<AreaVidaId, Partial<Record<LinguagemAmor, string>>>
> = {
  "desenvolvimentoAmoroso": {
    "palavras": "No amor, você se sente amado quando ouve reconhecimento claro. Sem palavras, o afeto pode parecer ausente mesmo quando existe.",
    "tempo": "No amor, presença sem distração vale mais que qualquer gesto grande. Tempo de verdade é o idioma que te alcança.",
    "presentes": "No amor, o presente simbólico diz 'eu penso em você'. Objetos pequenos carregam prova de cuidado.",
    "servicos": "No amor, ajuda prática fala alto. Quando alguém facilita sua vida, você sente o carinho no corpo.",
    "toque": "No amor, o corpo confirma o vínculo. Sem toque, a proximidade emocional fica incompleta."
  },
  "familia": {
    "palavras": "Na família, elogio e reconhecimento abrem portas. Crítica sem afeto verbal fecha o peito rápido.",
    "tempo": "Na família, estar junto de verdade importa mais que resolver tudo. Presença cura o que discurso não alcança.",
    "presentes": "Na família, gestos concretos e lembranças tangíveis aquecem. O cuidado ganha forma.",
    "servicos": "Na família, você sente amor quando alguém divide o peso prático do dia a dia.",
    "toque": "Na família, um abraço no tempo certo desarma defesa. O corpo relaxa antes da conversa."
  },
  "vidaSocial": {
    "palavras": "Nas amizades, ser visto em palavras importa. Um reconhecimento sincero fortalece o pertencimento.",
    "tempo": "Nas amizades, o encontro com atenção plena nutre mais que muitos contatos rasos.",
    "presentes": "Nas amizades, um gesto pensado mostra que você importa na vida do outro.",
    "servicos": "Nas amizades, ajuda concreta cria confiança. Quem aparece na prática vira gente de verdade.",
    "toque": "Nas amizades, o contato físico acolhedor (quando desejado) confirma vínculo sem precisar de discurso."
  },
  "plenitudeFelicidade": {
    "palavras": "Sua alegria sobe quando a vida, ou alguém, nomeia o que é bom em você. Silêncio demais seca a plenitude.",
    "tempo": "Sua alegria pede presença real: momentos em que você está inteiro, sem pressa de produzir.",
    "presentes": "Pequenos símbolos de cuidado acendem satisfação. A vida fica mais doce quando há gesto concreto.",
    "servicos": "Sentir que a vida 'ajuda' (ou que alguém alivia sua carga) aumenta a sensação de plenitude.",
    "toque": "Contato seguro e calor humano elevam sua alegria de um jeito que ideia sozinha não alcança."
  }
};

export function textoDesalinhamentoArea(area: AreaVidaId, textoBase: string): string | null {
  if (area !== "desenvolvimentoAmoroso" && area !== "familia" && area !== "vidaSocial") return null;
  return `Nesta área, o desalinhamento entre como você ama e como gosta de receber fica mais visível. ${textoBase}`;
}
