/**
 * Jornada curada: 60 dias × 4 missões (total 100 XP/dia).
 * Ciclos são apenas orientação interna — não expostos ao usuário.
 * XP: prática respiração/meditação 20 · observação 25 · ação 30 · reflexão 25
 */

export type MissaoCurada = { titulo: string; xp: number };

const R = 25;
const O = 30;
const P = 20;
const E = 25;

/** Índice 0 = "Dia 1" da curadoria (dia 0 desde criadoEm); comprimento deve ser 60. */
export const MISSOES_POR_DIA: ReadonlyArray<ReadonlyArray<MissaoCurada>> = [
  // Ciclo 1 — Despertar (interno) · dias 1–15
  [
    { titulo: "Respire fundo 3 vezes antes de sair da cama", xp: P },
    { titulo: "Observe 3 sensações físicas no seu corpo agora", xp: R },
    { titulo: "Anote 1 coisa que está antecipando com tensão hoje", xp: O },
    { titulo: "Antes de dormir, nomeie 1 emoção que sentiu hoje", xp: E },
  ],
  [
    { titulo: "Faça 5 minutos de respiração abdominal lenta", xp: P },
    { titulo: "Identifique um gatilho que ativou seu sistema nervoso hoje", xp: R },
    { titulo: "Beba um copo d'água em silêncio, sem celular", xp: O },
    { titulo: "Escreva sem filtro por 3 minutos sobre como você está se sentindo", xp: E },
  ],
  [
    { titulo: "Sente-se em silêncio por 3 minutos e observe seus pensamentos passarem", xp: P },
    { titulo: "Quando sentir pressa, pare por 10 segundos antes de agir", xp: R },
    { titulo: "Perceba sua postura 3 vezes ao longo do dia", xp: O },
    { titulo: "Descreva 1 situação de hoje usando apenas fatos, sem julgamento", xp: E },
  ],
  [
    { titulo: "Medite 5 minutos focando na sensação do ar entrando e saindo", xp: P },
    { titulo: "Identifique um padrão de comportamento que você repetiu hoje", xp: R },
    { titulo: "Faça uma refeição sem tela, prestando atenção ao sabor", xp: O },
    { titulo: 'Escreva: "Hoje eu me senti sobrecarregado quando..."', xp: E },
  ],
  [
    { titulo: "Pratique 5 minutos de escaneamento corporal do pé à cabeça", xp: P },
    { titulo: "Observe se você comparou a si mesmo com alguém hoje", xp: R },
    { titulo: "Antes de responder uma mensagem difícil, espere 2 minutos", xp: O },
    { titulo: "Liste 3 coisas pequenas que funcionaram bem hoje", xp: E },
  ],
  [
    { titulo: "Observe o ritmo natural da sua respiração por 5 minutos", xp: P },
    { titulo: 'Perceba quando disse "sim" querendo dizer "não"', xp: R },
    { titulo: "Faça uma caminhada de 5 minutos apenas presente", xp: O },
    { titulo: "Descreva como seu corpo reage quando você está ansioso", xp: E },
  ],
  [
    { titulo: "Medite 5 minutos relaxando conscientemente cada parte do corpo", xp: P },
    { titulo: "Escreva sobre algo que você evitou fazer nesta semana", xp: R },
    { titulo: "Faça uma atividade do piloto automático com atenção total", xp: O },
    { titulo: "O que mais te surpreendeu sobre você nesta primeira semana?", xp: E },
  ],
  [
    { titulo: "Faça 5 minutos de respiração 4-7-8", xp: P },
    { titulo: "Perceba em qual situação você se fechou emocionalmente hoje", xp: R },
    { titulo: "Converse com alguém praticando escuta total", xp: O },
    { titulo: 'Escreva: "O que me faz sentir em paz é..."', xp: E },
  ],
  [
    { titulo: "Medite 5 minutos focando nos sons ao redor", xp: P },
    { titulo: "Identifique um pensamento recorrente que apareceu hoje", xp: R },
    { titulo: "Tire 10 minutos longe de qualquer tela", xp: O },
    { titulo: "Escreva sobre uma situação da qual se arrepende sem julgamento", xp: E },
  ],
  [
    { titulo: "Observe pensamentos como nuvens passando por 5 minutos", xp: P },
    { titulo: "Quando sentir irritação, nomeie-a antes de agir", xp: R },
    { titulo: "Identifique uma crença sobre si mesmo que talvez não seja verdade", xp: O },
    { titulo: "Qual foi o momento de maior tensão hoje?", xp: E },
  ],
  [
    { titulo: "Pratique 5 minutos de respiração quadrada", xp: P },
    { titulo: "Observe quando usou o celular para fugir de desconfortos", xp: R },
    { titulo: "Escreva 3 qualidades que reconhece em si mesmo", xp: O },
    { titulo: "Que emoção você mais evita sentir?", xp: E },
  ],
  [
    { titulo: "Medite 6 minutos sentindo gratidão no peito", xp: P },
    { titulo: "Perceba uma vez que reagiu por medo em vez de escolha", xp: R },
    { titulo: "Faça algo gentil por alguém sem esperar retorno", xp: O },
    { titulo: 'Escreva: "Estou trabalhando em mim porque..."', xp: E },
  ],
  [
    { titulo: "Faça 6 minutos de meditação focando em segurança interna", xp: P },
    { titulo: "Identifique um padrão recorrente percebido nessas semanas", xp: R },
    { titulo: 'Pratique dizer "não" para algo pequeno', xp: O },
    { titulo: "O que você descobriu sobre si mesmo até aqui?", xp: E },
  ],
  [
    { titulo: "Faça 6 minutos de body scan focando em tensões", xp: P },
    { titulo: "Perceba um momento em que se colocou em segundo plano", xp: R },
    { titulo: "Escreva uma carta para sua versão futura", xp: O },
    { titulo: "Quais foram os maiores aprendizados deste ciclo?", xp: E },
  ],
  [
    { titulo: "Faça uma meditação livre de 7 minutos", xp: P },
    { titulo: "Escreva sobre a diferença entre como se sentia no início e agora", xp: R },
    { titulo: "Compartilhe algo aprendido sobre você com alguém confiável", xp: O },
    { titulo: "Reconheça sua evolução até aqui", xp: E },
  ],
  // Ciclo 2 — Ancoragem (interno) · dias 16–30
  [
    { titulo: "Medite 7 minutos expandindo sua atenção para o ambiente", xp: P },
    { titulo: "Identifique qual emoção surge quando perde o controle", xp: R },
    { titulo: "Crie um pequeno ritual antes do trabalho", xp: O },
    { titulo: 'Escreva: "Quando me sinto incompreendido, eu..."', xp: E },
  ],
  [
    { titulo: "Faça meditação de compaixão por alguém difícil", xp: P },
    { titulo: "Observe sinais do corpo antes dos pensamentos", xp: R },
    { titulo: "Realize uma tarefa simples com atenção total", xp: O },
    { titulo: "Descreva um medo que influencia suas decisões", xp: E },
  ],
  [
    { titulo: "Visualize um lugar seguro durante 7 minutos", xp: P },
    { titulo: "Perceba quando buscou validação externa", xp: R },
    { titulo: "Faça uma pausa consciente de 5 minutos no meio do dia", xp: O },
    { titulo: "O que você faz quando se sente rejeitado?", xp: E },
  ],
  [
    { titulo: 'Respire repetindo mentalmente: "Estou seguro"', xp: P },
    { titulo: "Identifique um comportamento usado para evitar intimidade", xp: R },
    { titulo: "Passe 5 minutos em contato com natureza", xp: O },
    { titulo: "Escreva sobre um padrão difícil em um relacionamento", xp: E },
  ],
  [
    { titulo: "Medite focando nos batimentos do coração", xp: P },
    { titulo: "Observe quando minimizou seus sentimentos", xp: R },
    { titulo: "Faça algo criativo sem se preocupar com resultado", xp: O },
    { titulo: "Qual foi o padrão mais importante identificado até agora?", xp: E },
  ],
  [
    { titulo: "Faça escaneamento emocional no corpo", xp: P },
    { titulo: "Observe sua imagem no espelho sem julgamento", xp: R },
    { titulo: "Retome contato com alguém importante", xp: O },
    { titulo: "Que versão de você está emergindo?", xp: E },
  ],
  [
    { titulo: "Visualize calma em uma situação difícil", xp: P },
    { titulo: "Observe quando agiu por obrigação e não por escolha", xp: R },
    { titulo: "Escreva 3 limites que deseja fortalecer", xp: O },
    { titulo: "Qual necessidade emocional está por trás do seu estresse?", xp: E },
  ],
  [
    { titulo: "Observe a diferença entre pensar e existir", xp: P },
    { titulo: "Identifique uma suposição feita sobre alguém sem confirmação", xp: R },
    { titulo: "Passe 10 minutos sem fazer nada", xp: O },
    { titulo: 'Escreva: "Segurança emocional para mim é..."', xp: E },
  ],
  [
    { titulo: "Faça respiração alternada por 8 minutos", xp: P },
    { titulo: "Perceba quando se sentiu mais vivo hoje", xp: R },
    { titulo: "Faça algo que adiou por medo de falhar", xp: O },
    { titulo: "O que você precisa perdoar em si mesmo?", xp: E },
  ],
  [
    { titulo: "Faça meditação de autocompaixão", xp: P },
    { titulo: "Observe quando foi duro consigo mesmo", xp: R },
    { titulo: "Escreva uma carta de apoio para si", xp: O },
    { titulo: "Seu autocuidado atual realmente funciona?", xp: E },
  ],
  [
    { titulo: "Faça body scan focando em mãos e pés", xp: P },
    { titulo: "Identifique uma crença que dificulta pedir ajuda", xp: R },
    { titulo: "Peça ajuda em algo pequeno", xp: O },
    { titulo: "O que mudou na sua reação ao estresse?", xp: E },
  ],
  [
    { titulo: "Defina uma intenção emocional para o dia", xp: P },
    { titulo: "Observe quando usou humor para evitar algo sério", xp: R },
    { titulo: "Faça uma descarga mental escrevendo tudo que pesa", xp: O },
    { titulo: "O que deseja mudar em suas relações?", xp: E },
  ],
  [
    { titulo: "Solte pensamentos sem se apegar a eles", xp: P },
    { titulo: "Observe como reage à vergonha", xp: R },
    { titulo: "Faça algo que cuide do seu corpo", xp: O },
    { titulo: "Quais emoções mais te assustam?", xp: E },
  ],
  [
    { titulo: "Visualize uma conversa difícil acontecendo bem", xp: P },
    { titulo: "Identifique onde mais resiste à mudança", xp: R },
    { titulo: "Compartilhe algo que normalmente guardaria", xp: O },
    { titulo: "Qual padrão emocional deseja transformar?", xp: E },
  ],
  [
    { titulo: "Faça uma meditação livre de 10 minutos", xp: P },
    { titulo: "Revise os últimos 30 dias profundamente", xp: R },
    { titulo: "Escreva 3 formas concretas de mudança", xp: O },
    { titulo: "O que deseja aprofundar no próximo ciclo?", xp: E },
  ],
  // Ciclo 3 — Aprofundamento (interno) · dias 31–45
  [
    { titulo: "Medite focando nas sensações internas sem nomeá-las", xp: P },
    { titulo: "Identifique a origem de um padrão emocional", xp: R },
    { titulo: "Passe 15 minutos sem consumir conteúdo", xp: O },
    { titulo: "Escreva sobre um medo nunca verbalizado", xp: E },
  ],
  [
    { titulo: "Observe a qualidade da sua atenção", xp: P },
    { titulo: "Perceba onde você se sente um personagem social", xp: R },
    { titulo: "Escreva sobre sua versão mais autêntica", xp: O },
    { titulo: "O que você faz para se sentir suficiente?", xp: E },
  ],
  [
    { titulo: "Faça meditação de compaixão pela sua criança interior", xp: P },
    { titulo: "Observe necessidades emocionais antigas ainda presentes", xp: R },
    { titulo: "Faça algo que sua versão mais jovem adoraria", xp: O },
    { titulo: 'Complete: "O que eu precisava ouvir quando criança era..."', xp: E },
  ],
  [
    { titulo: 'Pergunte mentalmente: "Quem observa meus pensamentos?"', xp: P },
    { titulo: "Identifique seu papel recorrente nos conflitos", xp: R },
    { titulo: "Tente sair desse papel durante uma tensão", xp: O },
    { titulo: "O que aconteceria se você baixasse suas defesas?", xp: E },
  ],
  [
    { titulo: "Imagine seu coração se expandindo a cada expiração", xp: P },
    { titulo: "Observe julgamentos feitos hoje", xp: R },
    { titulo: "Escreva sobre uma qualidade que admira mas não se permite viver", xp: O },
    { titulo: "O que está ficando mais fácil de perceber em você?", xp: E },
  ],
  [
    { titulo: "Observe emoções como eventos passageiros", xp: P },
    { titulo: "Reflita sobre uma sensação de traição ou quebra de confiança", xp: R },
    { titulo: 'Complete: "Confiar em mim significa..."', xp: O },
    { titulo: "O que você precisa para se sentir digno de amor?", xp: E },
  ],
  [
    { titulo: "Faça respiração compassiva", xp: P },
    { titulo: "Observe como sua raiva se manifesta", xp: R },
    { titulo: "Escreva uma carta sem enviar para alguém", xp: O },
    { titulo: "O que sua raiva tenta proteger?", xp: E },
  ],
  [
    { titulo: "Medite com os olhos levemente abertos", xp: P },
    { titulo: "Observe quando usou produtividade para fugir de emoções", xp: R },
    { titulo: "Passe 15 minutos apenas existindo", xp: O },
    { titulo: "O que descanso significa para você?", xp: E },
  ],
  [
    { titulo: 'Pergunte: "O que precisa ser cuidado em mim hoje?"', xp: P },
    { titulo: "Observe quando ultrapassou seus limites", xp: R },
    { titulo: "Escreva sobre colocar suas necessidades em primeiro lugar", xp: O },
    { titulo: "Quem mais reflete algo que você não gosta em si?", xp: E },
  ],
  [
    { titulo: "Sente-se em presença pura por 10 minutos", xp: P },
    { titulo: "Observe como sua relação com emoções mudou", xp: R },
    { titulo: "Escreva sobre uma versão sua que está ficando para trás", xp: O },
    { titulo: "Descreva a nova versão que está surgindo", xp: E },
  ],
  [
    { titulo: "Faça meditação focando em perdão", xp: P },
    { titulo: "Identifique algo que ainda não perdoou em si mesmo", xp: R },
    { titulo: 'Complete 5 vezes: "Eu me perdoo por..."', xp: O },
    { titulo: "O que ressentimentos te custam?", xp: E },
  ],
  [
    { titulo: "Visualize você em paz daqui a 1 ano", xp: P },
    { titulo: "Identifique o medo que mais governa suas decisões", xp: R },
    { titulo: "Faça uma ação guiada por valor e não por medo", xp: O },
    { titulo: "O que faria se soubesse que não poderia errar?", xp: E },
  ],
  [
    { titulo: "Observe o espaço entre pensamentos", xp: P },
    { titulo: "Perceba quando minimizou uma conquista sua", xp: R },
    { titulo: "Liste 5 conquistas concretas desta evolução", xp: O },
    { titulo: "O que você ainda acredita ser impossível mudar?", xp: E },
  ],
  [
    { titulo: "Observe a diferença entre pensar e sentir", xp: P },
    { titulo: "Identifique um relacionamento onde não está sendo autêntico", xp: R },
    { titulo: "Escreva o que nunca conseguiu dizer nesse relacionamento", xp: O },
    { titulo: "O que impede você de ser mais verdadeiro?", xp: E },
  ],
  [
    { titulo: "Faça uma meditação livre guiada apenas por você", xp: P },
    { titulo: "Reflita sobre o momento mais desafiador desta evolução", xp: R },
    { titulo: "Identifique 3 padrões profundos que está transformando", xp: O },
    { titulo: "O que muda na sua vida daqui em diante?", xp: E },
  ],
  // Ciclo 4 — Integração viva (interno) · dias 46–60
  [
    { titulo: "Leve presença para cada interação do dia", xp: P },
    { titulo: "Em uma conversa difícil, pause antes de responder", xp: R },
    { titulo: "Escreva sobre uma relação que melhorou", xp: O },
    { titulo: "Qual valor quer sustentar daqui em diante?", xp: E },
  ],
  [
    { titulo: "Observe com compaixão seu ritmo atual de vida", xp: P },
    { titulo: "Perceba como reage quando sua paz é testada", xp: R },
    { titulo: "Faça algo alinhado com quem está se tornando", xp: O },
    { titulo: "Qual a diferença prática entre reagir e responder?", xp: E },
  ],
  [
    { titulo: "Medite com gratidão pela sua evolução", xp: P },
    { titulo: "Identifique uma situação onde aplicou algo aprendido", xp: R },
    { titulo: "Compartilhe uma mudança real com alguém próximo", xp: O },
    { titulo: "Como lidaria hoje com algo que antes te desestruturava?", xp: E },
  ],
  [
    { titulo: "Observe a qualidade do seu silêncio interno", xp: P },
    { titulo: "Perceba onde ainda mantém aparências", xp: R },
    { titulo: 'Complete: "Quando estou alinhado comigo, eu..."', xp: O },
    { titulo: "O que você quer parar de fingir para si mesmo?", xp: E },
  ],
  [
    { titulo: "Permita-se receber cuidado e amor conscientemente", xp: P },
    { titulo: "Observe como se relaciona consigo mesmo hoje", xp: R },
    { titulo: "Faça algo exclusivamente para cuidar de si", xp: O },
    { titulo: "Qual relação melhorou por causa da sua transformação?", xp: E },
  ],
  [
    { titulo: "Observe o que permanece quando você para de fazer", xp: P },
    { titulo: "Identifique uma situação onde ainda perde autorregulação", xp: R },
    { titulo: "Crie um plano simples para lidar melhor com isso", xp: O },
    { titulo: "Como pretende praticar pedir ajuda daqui em diante?", xp: E },
  ],
  [
    { titulo: "Envie mentalmente compaixão para alguém em conflito com você", xp: P },
    { titulo: "Pratique escuta ativa em uma conversa", xp: R },
    { titulo: "Reflita sobre o que a outra pessoa pode estar sentindo", xp: O },
    { titulo: "Como deseja ser lembrado pelas pessoas próximas?", xp: E },
  ],
  [
    { titulo: "Observe o prazer de simplesmente estar presente", xp: P },
    { titulo: "Perceba quando viveu no futuro ansioso", xp: R },
    { titulo: "Faça algo apenas porque te dá prazer", xp: O },
    { titulo: "O que aprendeu sobre descanso e prazer?", xp: E },
  ],
  [
    { titulo: "Carregue compaixão durante todo o dia", xp: P },
    { titulo: "Observe quando foi mais compassivo com outros do que consigo", xp: R },
    { titulo: 'Complete: "Eu me trato com compaixão quando..."', xp: O },
    { titulo: "Como seria se você se tratasse como trata quem ama?", xp: E },
  ],
  [
    { titulo: "Faça uma meditação de preparação para consolidação da nova versão", xp: P },
    { titulo: "Escreva sobre quem você era no início e quem é agora", xp: R },
    { titulo: "Quais hábitos deseja manter permanentemente?", xp: O },
    { titulo: "O que deseja deixar para trás definitivamente?", xp: E },
  ],
  [
    { titulo: "Perceba o quanto se sente mais firme internamente", xp: P },
    { titulo: "Pense em alguém que poderia se beneficiar dessa evolução", xp: R },
    { titulo: 'Complete: "O maior aprendizado sobre mim foi..."', xp: O },
    { titulo: "Como deseja continuar evoluindo daqui em diante?", xp: E },
  ],
  [
    { titulo: "Reconheça tudo que atravessou até aqui", xp: P },
    { titulo: "Escreva sobre sua maior transformação interna", xp: R },
    { titulo: "Faça algo simbólico representando quem está se tornando", xp: O },
    { titulo: "Que presença deseja sustentar daqui em diante?", xp: E },
  ],
  [
    { titulo: "Faça uma meditação de integração sem objetivos", xp: P },
    { titulo: "Observe os momentos mais importantes da sua evolução", xp: R },
    { titulo: "Releia a carta escrita para sua versão futura", xp: O },
    { titulo: "O quanto você cresceu desde aquela escrita?", xp: E },
  ],
  [
    { titulo: "Faça uma meditação de amor próprio", xp: P },
    { titulo: "Escreva sobre o padrão mais importante transformado", xp: R },
    { titulo: "Agradeça pessoas que impactaram sua evolução", xp: O },
    { titulo: "O que sua constância revela sobre você?", xp: E },
  ],
  [
    { titulo: "Faça uma meditação de integração em silêncio", xp: P },
    { titulo: "Responda a carta escrita para sua versão futura", xp: R },
    { titulo: "Liste 10 mudanças concretas percebidas em você", xp: O },
    { titulo: "A evolução emocional não termina. Como sua prática continuará a partir daqui?", xp: E },
  ],
];

if (MISSOES_POR_DIA.length !== 60) {
  throw new Error(`MISSOES_POR_DIA deve ter 60 dias, tem ${MISSOES_POR_DIA.length}`);
}
for (let d = 0; d < 60; d++) {
  const dia = MISSOES_POR_DIA[d]!;
  if (dia.length !== 4) throw new Error(`Dia ${d + 1}: esperado 4 missões`);
  const sum = dia.reduce((s, m) => s + m.xp, 0);
  if (sum !== 100) throw new Error(`Dia ${d + 1}: XP total deve ser 100, tem ${sum}`);
}
