/**
 * Uma frase por dia do mês (31 entradas). O índice usa o dia civil atual (1–31).
 */
const MENSAGENS: readonly string[] = [
  "Cada passo conta. Continue.",
  "A luz nasce de quem aceita a sombra.",
  "Hoje é tempo de presença, não pressa.",
  "Respire fundo: você já está no caminho.",
  "Pequena constância vence grandes saltos vazios.",
  "Observe sem julgar. Curiosidade abre portas.",
  "O que você evita costuma pedir atenção gentil.",
  "Seja honesto consigo: é o começo da liberdade.",
  "Um hábito novo começa com uma escolha só de hoje.",
  "Deixe a perfeição de lado; busque verdade.",
  "Seu ritmo é válido. Comparação rouba energia.",
  "Nomeie o que sente: nomear já acalma.",
  "Cuide do corpo como casa da sua mente.",
  "Escute o cansaço. Ele também é mensagem.",
  "Uma conversa sincera vale mais que cem planos.",
  "Gratidão simples muda o tom do dia.",
  "O que você nutre, cresce: escolha com intenção.",
  "Limites claros são forma de amor-próprio.",
  "Devagar também é avançar.",
  "Celebre microvitórias: elas constroem história.",
  "A sombra não é punição; é mapa do que curar.",
  "Pergunte: o que me serve hoje, de verdade?",
  "Menos ruído, mais silêncio útil.",
  "Recomeçar não apaga o que você já viveu.",
  "Ternura com você não é fraqueza.",
  "Compaixão firme pede coragem, não desculpa.",
  "Feche ciclos que só pedem energia.",
  "Abra espaço para o que alinha com seus valores.",
  "Seu valor não depende da opinião de hoje.",
  "Confie no processo. Ele revela camadas.",
  "Da sombra à luz: um dia de cada vez.",
];

export function mensagemDoDia(d: Date = new Date()): string {
  const dia = d.getDate();
  const idx = Math.min(Math.max(dia, 1), 31) - 1;
  return MENSAGENS[idx] ?? MENSAGENS[0];
}
