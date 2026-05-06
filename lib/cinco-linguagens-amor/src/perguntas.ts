import type { LinguagemAmor, ParForcado } from "./types.js";

/** IDs dos 30 pares (forçada escolha). */
export const CODIGOS_PAR = [
  "P01", "P02", "P03", "P04", "P05", "P06", "P07", "P08", "P09", "P10",
  "P11", "P12", "P13", "P14", "P15", "P16", "P17", "P18", "P19", "P20",
  "P21", "P22", "P23", "P24", "P25", "P26", "P27", "P28", "P29", "P30",
] as const;

export type CodigoPar = (typeof CODIGOS_PAR)[number];

/** Pares com textos em PT-BR (estilo inspirado no teste de escolha forçada). */
export const PARES_FORCADOS: ParForcado[] = [
  { id: "P01", textoA: "Valorizo um elogio sincero.", textoB: "Valorizo tempo a sós com a pessoa.", linguagemA: "palavras", linguagemB: "tempo" },
  { id: "P02", textoA: "Um presente surpresa me emociona.", textoB: "Quando alguém faz algo por mim sem eu pedir.", linguagemA: "presentes", linguagemB: "servicos" },
  { id: "P03", textoA: "Um abraço firme fala mais que mil palavras.", textoB: "Ouvir \"estou orgulhoso(a) de você\" me fortalece.", linguagemA: "toque", linguagemB: "palavras" },
  { id: "P04", textoA: "Conversar sem pressa é meu jeito de me sentir amado(a).", textoB: "Receber algo simbólico mostra que pensaram em mim.", linguagemA: "tempo", linguagemB: "presentes" },
  { id: "P05", textoA: "Ajuda prática no dia a dia pesa muito.", textoB: "Prefiro carinho físico do que discursos longos.", linguagemA: "servicos", linguagemB: "toque" },
  { id: "P06", textoA: "Notas e mensagens carinhosas marcam meu dia.", textoB: "Planejar um encontro só nosso importa mais.", linguagemA: "palavras", linguagemB: "tempo" },
  { id: "P07", textoA: "Quando me trazem algo especial de viagem.", textoB: "Quando ouço reconhecimento pelo que fiz.", linguagemA: "presentes", linguagemB: "palavras" },
  { id: "P08", textoA: "Colocar a mesa ou resolver um problema por mim.", textoB: "Segurar minha mão em público.", linguagemA: "servicos", linguagemB: "toque" },
  { id: "P09", textoA: "Atividade juntos (passeio, jogo) renova meu vínculo.", textoB: "Um presente simples, bem escolhido.", linguagemA: "tempo", linguagemB: "presentes" },
  { id: "P10", textoA: "Ouvir \"você é importante para mim\".", textoB: "Que façam um favor que eu estava adiando.", linguagemA: "palavras", linguagemB: "servicos" },
  { id: "P11", textoA: "Carinho leve no dia a dia.", textoB: "Tempo de qualidade sem celular.", linguagemA: "toque", linguagemB: "tempo" },
  { id: "P12", textoA: "Flores ou algo que mostre lembrança.", textoB: "Elogio específico sobre minha ação.", linguagemA: "presentes", linguagemB: "palavras" },
  { id: "P13", textoA: "Conversa profunda 1:1.", textoB: "Gestos de cuidado físico.", linguagemA: "tempo", linguagemB: "toque" },
  { id: "P14", textoA: "Resolver algo técnico ou burocrático por mim.", textoB: "Surpresa simbólica (nem precisa ser cara).", linguagemA: "servicos", linguagemB: "presentes" },
  { id: "P15", textoA: "Feedbacks positivos frequentes.", textoB: "Presença em momentos difíceis.", linguagemA: "palavras", linguagemB: "tempo" },
  { id: "P16", textoA: "Presentes em datas significativas.", textoB: "Serviço contínuo (apoio real).", linguagemA: "presentes", linguagemB: "servicos" },
  { id: "P17", textoA: "Toque reconfortante quando estou ansioso(a).", textoB: "Palavras que validam minhas emoções.", linguagemA: "toque", linguagemB: "palavras" },
  { id: "P18", textoA: "Agenda dedicada a nós.", textoB: "Pequenos mimos inesperados.", linguagemA: "tempo", linguagemB: "presentes" },
  { id: "P19", textoA: "Fazer tarefas para aliviar minha carga.", textoB: "Proximidade física ao dormir/acordar.", linguagemA: "servicos", linguagemB: "toque" },
  { id: "P20", textoA: "Reconhecimento em público.", textoB: "Ritual nosso (café, caminhada semanal).", linguagemA: "palavras", linguagemB: "tempo" },
  { id: "P21", textoA: "Objeto que representa um momento.", textoB: "Massagem ou carinho ao final do dia.", linguagemA: "presentes", linguagemB: "toque" },
  { id: "P22", textoA: "Tempo sem interrupções.", textoB: "Ajuda com filhos/tarefas domésticas.", linguagemA: "tempo", linguagemB: "servicos" },
  { id: "P23", textoA: "Cartas ou mensagens longas.", textoB: "Presentes com significado pessoal.", linguagemA: "palavras", linguagemB: "presentes" },
  { id: "P24", textoA: "Cuidado físico quando estou doente.", textoB: "Elogio pelo meu esforço.", linguagemA: "toque", linguagemB: "palavras" },
  { id: "P25", textoA: "Planejar um date.", textoB: "Consertar algo que me irritava.", linguagemA: "tempo", linguagemB: "servicos" },
  { id: "P26", textoA: "Surpresa com algo que comentei despretensiosamente.", textoB: "Dizer \"obrigado(a)\" de forma calorosa e específica.", linguagemA: "presentes", linguagemB: "palavras" },
  { id: "P27", textoA: "Beijo de despedida.", textoB: "Companhia em silêncio confortável.", linguagemA: "toque", linguagemB: "tempo" },
  { id: "P28", textoA: "Fazer compras ou filas por mim.", textoB: "Lembrança simbólica do que gosto.", linguagemA: "servicos", linguagemB: "presentes" },
  { id: "P29", textoA: "Palavras gentis em momentos bobos.", textoB: "Postura de encostar/abraçar.", linguagemA: "palavras", linguagemB: "toque" },
  { id: "P30", textoA: "Finalizar o dia juntos, só conversando.", textoB: "Um gesto prático que poupa meu tempo.", linguagemA: "tempo", linguagemB: "servicos" },
];

export function parPorId(id: string): ParForcado | undefined {
  return PARES_FORCADOS.find((p) => p.id === id);
}

/** Labels para UI */
export const LABEL_LINGUAGEM: Record<LinguagemAmor, string> = {
  palavras: "Palavras de afirmação",
  tempo: "Tempo de qualidade",
  presentes: "Presentes",
  servicos: "Atos de serviço",
  toque: "Toque físico",
};
