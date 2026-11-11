import type { TemperamentoCodigo } from "@workspace/temperamento-v1";
import type { AreaVidaId } from "./tipos";

/** Como o temperamento aparece em cada área da roda. */
export const CONTEUDO_TEMPERAMENTO: Record<AreaVidaId, Record<TemperamentoCodigo, string>> = {
  "plenitudeFelicidade": {
    "COLERICO": "No colérico, a alegria costuma ficar em segundo plano enquanto houver algo a conquistar. A plenitude vira prêmio do fim, e o fim sempre se afasta.",
    "SANGUINEO": "No sanguíneo, a alegria depende de gente e de movimento. Sozinho ou sem novidade, a satisfação murcha mesmo com a vida aparentemente cheia.",
    "MELANCOLICO": "No melancólico, a plenitude exige que tudo faça sentido. Se falta perfeição, a alegria simples parece pequena demais para merecer espaço.",
    "FLEUMATICO": "No fleumático, a paz externa pode mascarar uma alegria baixa. Evitar conflito não é o mesmo que se sentir vivo por dentro."
  },
  "espiritualidade": {
    "COLERICO": "O colérico busca sentido na ação. Sem um propósito claro, a espiritualidade parece perda de tempo, e o silêncio vira desconforto.",
    "SANGUINEO": "O sanguíneo se conecta no calor do encontro e da emoção compartilhada. A prática sozinha pede disciplina que ainda não virou hábito.",
    "MELANCOLICO": "O melancólico aprofunda fácil o mistério, e pode intelectualizar a fé até ela virar só ideia, sem corpo e sem cotidiano.",
    "FLEUMATICO": "O fleumático sente o sagrado na quietude. O risco é nunca escolher uma prática, esperando que a conexão venha sem compromisso."
  },
  "saudeDisposicao": {
    "COLERICO": "O colérico exige do corpo como se ele aguentasse tudo. Cansaço vira fraqueza a ignorar, até o corpo cobrar a conta.",
    "SANGUINEO": "O sanguíneo cuida quando está animado e esquece quando a rotina esfria. Saúde pede repetição sem plateia.",
    "MELANCOLICO": "O melancólico pesquisa o cuidado ideal e atrasa o começo. Enquanto busca o método perfeito, o sono e o movimento esperam.",
    "FLEUMATICO": "O fleumático evita mudanças bruscas no corpo. O cuidado suave funciona, desde que não vire desculpa para não se mexer."
  },
  "desenvolvimentoIntelectual": {
    "COLERICO": "O colérico aprende para aplicar e vencer. Se o estudo não vira resultado rápido, a paciência some.",
    "SANGUINEO": "O sanguíneo aprende no diálogo e na novidade. Sem troca viva, o livro sozinho cansa depressa.",
    "MELANCOLICO": "O melancólico aprofunda com prazer. O risco é acumular saber sem levar para a vida prática.",
    "FLEUMATICO": "O fleumático prefere aprender sem pressão. Funciona bem se houver um ritmo gentil e constante, não só intenção."
  },
  "equilibrioEmocional": {
    "COLERICO": "No colérico, a emoção vira impulso de ação. Irritação e urgência aparecem antes da escuta interior.",
    "SANGUINEO": "No sanguíneo, o humor sobe e desce com o ambiente. A estabilidade pede âncora interna, não só companhia.",
    "MELANCOLICO": "No melancólico, a emoção é intensa e analisada. Pode ficar preso no labirinto do sentir sem sair para o gesto.",
    "FLEUMATICO": "No fleumático, a emoção é engolida para manter a paz. O que não se nomeia acumula e vaza depois."
  },
  "familia": {
    "COLERICO": "Na família, o colérico quer resolver rápido. Pode mandar demais e escutar de menos quem precisa de tempo.",
    "SANGUINEO": "Na família, o sanguíneo aquece o clima e foge do peso. Conversas difíceis pedem mais presença do que charme.",
    "MELANCOLICO": "Na família, o melancólico sente cada ferida com nitidez. Pode cobrar uma profundidade que o outro ainda não aguenta.",
    "FLEUMATICO": "Na família, o fleumático evita briga e engole. A paz aparente custa intimidade verdadeira."
  },
  "desenvolvimentoAmoroso": {
    "COLERICO": "No amor, o colérico lidera e decide. Parceria pede abrir mão do controle e ouvir o ritmo do outro.",
    "SANGUINEO": "No amor, o sanguíneo traz calor e leveza. A profundidade pede ficar quando a novidade passa.",
    "MELANCOLICO": "No amor, o melancólico entrega intensidade e ideal. A decepção dói alto quando a realidade não alcança o sonho.",
    "FLEUMATICO": "No amor, o fleumático é leal e estável. Pode deixar de pedir o que precisa para não perturbar."
  },
  "vidaSocial": {
    "COLERICO": "Na vida social, o colérico escolhe redes úteis e objetivos. Amizade sem função parece desperdício, e isso empobrece o vínculo.",
    "SANGUINEO": "Na vida social, o sanguíneo brilha e conecta fácil. O desafio é cultivar poucos vínculos profundos, não só muitos encontros.",
    "MELANCOLICO": "Na vida social, o melancólico prefere poucos e verdadeiros. Pode se isolar esperando a conexão perfeita.",
    "FLEUMATICO": "Na vida social, o fleumático é agradável e discreto. Pode ficar na periferia do grupo sem nunca se mostrar de fato."
  },
  "realizacaoProposito": {
    "COLERICO": "No propósito, o colérico quer impacto visível. Se a missão não vira conquista, a frustração sobe rápido.",
    "SANGUINEO": "No propósito, o sanguíneo precisa de sentido compartilhado. Sozinho, a chama apaga mais fácil.",
    "MELANCOLICO": "No propósito, o melancólico busca significado profundo. Pode adiar o começo até ter certeza absoluta.",
    "FLEUMATICO": "No propósito, o fleumático sustenta o caminho longo. O risco é acomodar num sentido pequeno demais para a alma."
  },
  "recursosFinanceiros": {
    "COLERICO": "No dinheiro, o colérico arrisca e acelera. Sem freio, a ousadia vira aperto.",
    "SANGUINEO": "No dinheiro, o sanguíneo gasta no prazer do agora. Plano e reserva pedem um adulto interno mais firme.",
    "MELANCOLICO": "No dinheiro, o melancólico planeja e teme errar. Pode congelar decisões por análise demais.",
    "FLEUMATICO": "No dinheiro, o fleumático evita drama. Pode deixar a situação andar no automático sem construir de propósito."
  },
  "contribuicaoSocial": {
    "COLERICO": "Na contribuição, o colérico quer resultado mensurável. Cuidado para o serviço não virar só projeto de ego.",
    "SANGUINEO": "Na contribuição, o sanguíneo anima gente. A constância do compromisso é o que transforma animação em impacto.",
    "MELANCOLICO": "Na contribuição, o melancólico escolhe causas com sentido. Pode esperar o engajamento perfeito e nunca começar.",
    "FLEUMATICO": "Na contribuição, o fleumático ajuda sem alarde. Vale tornar o gesto regular, não só espontâneo."
  },
  "criatividadeHobbyDiversao": {
    "COLERICO": "No lazer, o colérico só para quando a lista acaba, e a lista nunca acaba. Brincar parece improdutivo, e por isso some.",
    "SANGUINEO": "No lazer, o sanguíneo se diverte fácil em grupo. Sozinho, precisa lembrar que criar também é nutrir.",
    "MELANCOLICO": "No lazer, o melancólico cria com profundidade. Pode transformar hobby em obra a aperfeiçoar e perder o prazer.",
    "FLEUMATICO": "No lazer, o fleumático gosta do conforto quieto. Pode confundir descanso passivo com o jogo que renova a alma."
  }
};

export const GESTO_TEMPERAMENTO: Record<TemperamentoCodigo, string> = {
  COLERICO: "Antes de acelerar, pare dois minutos e sinta o corpo. Só depois escolha o próximo passo.",
  SANGUINEO: "Escolha um gesto pequeno e faça sem plateia, no mesmo horário, por sete dias.",
  MELANCOLICO: "Defina o bom o bastante e comece hoje, mesmo imperfeito.",
  FLEUMATICO: "Diga em voz alta, com calma, uma necessidade sua que você vinha engolindo.",
};
