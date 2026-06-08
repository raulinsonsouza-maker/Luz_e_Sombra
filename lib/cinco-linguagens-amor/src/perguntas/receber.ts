import type { ParForcado } from "../types.js";

/** Bloco 1 — como você se sente amado(a). Matriz balanceada: 6 aparições por linguagem. */
export const CODIGOS_RECEBER = [
  "R01", "R02", "R03", "R04", "R05", "R06", "R07", "R08", "R09", "R10",
  "R11", "R12", "R13", "R14", "R15",
] as const;

export type CodigoReceber = (typeof CODIGOS_RECEBER)[number];

export const PARES_RECEBER: ParForcado[] = [
  { id: "R01", bloco: "receber", textoA: "Valorizo um elogio sincero.", textoB: "Valorizo tempo a sós com a pessoa.", linguagemA: "palavras", linguagemB: "tempo" },
  { id: "R02", bloco: "receber", textoA: "Um presente surpresa me emociona.", textoB: "Quando alguém faz algo por mim sem eu pedir.", linguagemA: "presentes", linguagemB: "servicos" },
  { id: "R03", bloco: "receber", textoA: "Um abraço firme fala mais que mil palavras.", textoB: "Ouvir \"estou orgulhoso(a) de você\" me fortalece.", linguagemA: "toque", linguagemB: "palavras" },
  { id: "R04", bloco: "receber", textoA: "Conversar sem pressa é meu jeito de me sentir amado(a).", textoB: "Receber algo simbólico mostra que pensaram em mim.", linguagemA: "tempo", linguagemB: "presentes" },
  { id: "R05", bloco: "receber", textoA: "Ajuda prática no dia a dia pesa muito.", textoB: "Prefiro carinho físico a discursos longos.", linguagemA: "servicos", linguagemB: "toque" },
  { id: "R06", bloco: "receber", textoA: "Notas e mensagens carinhosas marcam meu dia.", textoB: "Flores ou algo que mostre lembrança.", linguagemA: "palavras", linguagemB: "presentes" },
  { id: "R07", bloco: "receber", textoA: "Agenda dedicada a nós.", textoB: "Resolver algo técnico ou burocrático por mim.", linguagemA: "tempo", linguagemB: "servicos" },
  { id: "R08", bloco: "receber", textoA: "Toque reconfortante quando estou ansioso(a).", textoB: "Pequenos mimos inesperados.", linguagemA: "toque", linguagemB: "presentes" },
  { id: "R09", bloco: "receber", textoA: "Ouvir \"você é importante para mim\".", textoB: "Carinho leve no dia a dia.", linguagemA: "palavras", linguagemB: "toque" },
  { id: "R10", bloco: "receber", textoA: "Tempo de qualidade sem celular.", textoB: "Elogio específico sobre minha ação.", linguagemA: "tempo", linguagemB: "palavras" },
  { id: "R11", bloco: "receber", textoA: "Presentes em datas significativas.", textoB: "Proximidade física ao dormir ou acordar.", linguagemA: "presentes", linguagemB: "toque" },
  { id: "R12", bloco: "receber", textoA: "Fazer tarefas para aliviar minha carga.", textoB: "Feedbacks positivos frequentes.", linguagemA: "servicos", linguagemB: "palavras" },
  { id: "R13", bloco: "receber", textoA: "Conversa profunda, só nós dois.", textoB: "Gestos de cuidado físico.", linguagemA: "tempo", linguagemB: "toque" },
  { id: "R14", bloco: "receber", textoA: "Surpresa simbólica (nem precisa ser cara).", textoB: "Serviço contínuo com apoio real.", linguagemA: "presentes", linguagemB: "servicos" },
  { id: "R15", bloco: "receber", textoA: "Consertar algo que me irritava.", textoB: "Ritual nosso (café, caminhada semanal).", linguagemA: "servicos", linguagemB: "tempo" },
];
