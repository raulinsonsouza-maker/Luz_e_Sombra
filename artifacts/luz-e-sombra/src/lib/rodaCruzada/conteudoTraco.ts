import type { EstruturaTraco } from "@workspace/traco-narrativa";
import type { AreaVidaId } from "./tipos";

/** Como o traço principal aparece em cada área da roda. */
export const CONTEUDO_TRACO: Record<AreaVidaId, Record<EstruturaTraco, string>> = {
  "plenitudeFelicidade": {
    "esquizoide": "No traço esquizóide, a alegria pode ficar longe do corpo. Você entende a vida, e ainda assim a vivência plena parece acontecer um passo ao lado.",
    "oral": "No traço oral, a plenitude depende de ser nutrido por fora. Se falta cuidado alheio, o vazio aparece rápido e a alegria some.",
    "psicopata": "No traço psicopata, a satisfação costuma vir do impacto e do controle. Sem conquista, a sensação de estar vivo enfraquece.",
    "masoquista": "No traço masoquista, a alegria pode ser adiada em nome do dever. Você segura o prazer até 'merecer', e esse dia atrasa.",
    "rigido": "No traço rígido, a plenitude passa pelo acerto e pela imagem. Errar ou relaxar ameaça a alegria que só aparece quando está tudo no lugar."
  },
  "espiritualidade": {
    "esquizoide": "No esquizóide, o espiritual pode ser refúgio da mente. O convite é baixar a experiência para o corpo e o cotidiano.",
    "oral": "No oral, a conexão espiritual busca consolo e pertencimento. Sem vínculo caloroso, a prática esfria.",
    "psicopata": "No psicopata, o sagrado pode virar missão de poder ou liderança. Vale perguntar se há entrega, não só direção.",
    "masoquista": "No masoquista, a espiritualidade pode misturar fé com sacrifício. Cuidado para o serviço não virar autoabandono.",
    "rigido": "No rígido, a espiritualidade pede ordem e correção. O mistério, porém, também mora no que não se controla."
  },
  "saudeDisposicao": {
    "esquizoide": "No esquizóide, o corpo pode parecer distante. Sintomas chegam atrasados porque a atenção vive mais na cabeça.",
    "oral": "No oral, o corpo pede nutrição e descanso reais. Sem acolhimento, a energia cai e o desejo de ser cuidado sobe.",
    "psicopata": "No psicopata, o corpo é instrumento de conquista. Limite e cansaço são ignorados até quebrarem o ritmo.",
    "masoquista": "No masoquista, o corpo aguenta demais. A tensão vira hábito, e o alívio parece luxo indevido.",
    "rigido": "No rígido, o corpo precisa parecer competente. Prazer e frouxidão assustam, mesmo quando o descanso é necessário."
  },
  "desenvolvimentoIntelectual": {
    "esquizoide": "No esquizóide, a mente é território seguro. Aprender alimenta, e pode afastar ainda mais do sentir.",
    "oral": "No oral, o aprendizado floresce com mentoria e troca. Sozinho, o estudo vira mais um pedido de presença.",
    "psicopata": "No psicopata, o conhecimento vale se aumenta influência. Saber sem poder parece inútil.",
    "masoquista": "No masoquista, estudar pode ser mais uma obrigação bem cumprida. Falta espaço para curiosidade sem mérito.",
    "rigido": "No rígido, o intelecto busca excelência. Errar no aprendizado dói, e isso trava experimentação."
  },
  "equilibrioEmocional": {
    "esquizoide": "No esquizóide, a emoção é observada de longe. Sentir de perto ainda assusta, mesmo quando a vida pede presença.",
    "oral": "No oral, a emoção pede colo. Sem resposta, surge urgência, tristeza ou necessidade intensa de contato.",
    "psicopata": "No psicopata, a emoção é dosada para manter o comando. Vulnerabilidade parece risco de perder posição.",
    "masoquista": "No masoquista, a emoção fica retida. Há muito por dentro, e pouco direito interno de expressar.",
    "rigido": "No rígido, a emoção precisa ser apropriada. Raiva, desejo e medo só passam se forem 'certos'."
  },
  "familia": {
    "esquizoide": "Na família, o esquizóide se protege com distância. Proximidade demais parece invasão.",
    "oral": "Na família, o oral busca nutrição e medo de abandono. A relação oscila entre apegar e sentir falta.",
    "psicopata": "Na família, o psicopata organiza e dirige. Pode amar pelo cuidado prático e falhar na escuta macia.",
    "masoquista": "Na família, o masoquista carrega demais. Ser útil vira identidade, e o próprio desejo some.",
    "rigido": "Na família, o rígido cobra e se cobra. O afeto passa por desempenho, não só por presença."
  },
  "desenvolvimentoAmoroso": {
    "esquizoide": "No amor, o esquizóide deseja e teme a fusão. Chega perto e afasta quando a intimidade esquenta.",
    "oral": "No amor, o oral precisa sentir que é escolhido. Sem sinais claros de cuidado, a insegurança cresce.",
    "psicopata": "No amor, o psicopata conquista e resiste a depender. Entregar o controle é o exercício mais difícil.",
    "masoquista": "No amor, o masoquista aguenta o que dói para manter o vínculo. Pedir e limitar ainda assusta.",
    "rigido": "No amor, o rígido quer relação correta e admirável. A espontaneidade do desejo pede permissão interna."
  },
  "vidaSocial": {
    "esquizoide": "Na vida social, o esquizóide escolhe a margem. Observa o grupo e demora a entrar com o peito aberto.",
    "oral": "Na vida social, o oral busca pertencimento caloroso. Rejeição, mesmo leve, ecoa fundo.",
    "psicopata": "Na vida social, o psicopata ocupa espaço e lidera. Amizade horizontal, sem status, pede humildade.",
    "masoquista": "Na vida social, o masoquista serve ao grupo. Pode ser querido e ainda se sentir invisível por dentro.",
    "rigido": "Na vida social, o rígido mede imagem e adequação. Soltar o controle social é o caminho da intimidade."
  },
  "realizacaoProposito": {
    "esquizoide": "No propósito, o esquizóide cria mundos internos ricos. O desafio é encarnar a visão no mundo real.",
    "oral": "No propósito, o oral precisa de apoio para sustentar o caminho. Sem rede, desiste mais cedo.",
    "psicopata": "No propósito, o psicopata quer deixar marca. Sem impacto visível, o sentido parece insuficiente.",
    "masoquista": "No propósito, o masoquista se dedica e se sacrifica. Vale perguntar se a missão também te nutre.",
    "rigido": "No propósito, o rígido busca vocação bem feita. Pode adiar o chamado até sentir que está pronto o bastante."
  },
  "recursosFinanceiros": {
    "esquizoide": "No dinheiro, o esquizóide pode se desconectar do prático. Contas e corpo material pedem presença.",
    "oral": "No dinheiro, o oral sente escassez afetiva misturada com material. Segurança financeira vira pedido de cuidado.",
    "psicopata": "No dinheiro, o psicopata busca poder e autonomia. Perder controle financeiro ameaça a identidade.",
    "masoquista": "No dinheiro, o masoquista aguenta aperto em silêncio. Pedir ajuda ou renegociar ainda pesa.",
    "rigido": "No dinheiro, o rígido quer ordem e prestígio. O medo de falhar trava risco saudável e criação de riqueza."
  },
  "contribuicaoSocial": {
    "esquizoide": "Na contribuição, o esquizóide oferece visão e ideia. Falta às vezes o calor do contato humano contínuo.",
    "oral": "Na contribuição, o oral doa para pertencer. Cuidado para não se esvaziar servindo sem receber.",
    "psicopata": "Na contribuição, o psicopata organiza e lidera causas. O ego precisa ceder espaço ao serviço real.",
    "masoquista": "Na contribuição, o masoquista se entrega. Sem limite, a doação vira apagamento.",
    "rigido": "Na contribuição, o rígido quer fazer certo. Pode julgar demais e doar de menos com espontaneidade."
  },
  "criatividadeHobbyDiversao": {
    "esquizoide": "No lazer, o esquizóide cria mundos internos. O corpo e o jogo compartilhado ainda pedem convite.",
    "oral": "No lazer, o oral se diverte com companhia. Sozinho, o prazer pede estímulo externo para acender.",
    "psicopata": "No lazer, o psicopata compete ou performa. Brincar sem vencer ainda é exercício de liberdade.",
    "masoquista": "No lazer, o masoquista sente culpa por parar. Prazer puro parece indevido enquanto houver dever.",
    "rigido": "No lazer, o rígido só relaxa se for produtivo ou exemplar. O inútil sagrado ainda assusta."
  }
};

export const GESTO_TRACO: Record<EstruturaTraco, string> = {
  esquizoide: "Traga a atenção para o corpo por um minuto: pés no chão, respiração no peito, sem fugir para a ideia.",
  oral: "Peça com clareza uma coisa que você precisa a alguém de confiança. Uma frase só.",
  psicopata: "Abra mão de controlar um desfecho hoje. Deixe o outro decidir uma parte.",
  masoquista: "Diga não a um pedido que pesa demais. Proteja um pedaço do seu prazer.",
  rigido: "Faça algo imperfeito de propósito e deixe assim. Observe a ansiedade passar.",
};

/** Mapa área → campo de dinamicaFuncional do traço. */
export const AREA_PARA_DINAMICA: Partial<Record<AreaVidaId, "trabalho" | "relacoes" | "estresse" | "decisoes" | "energia" | "sombra">> = {
  realizacaoProposito: "trabalho",
  recursosFinanceiros: "trabalho",
  desenvolvimentoAmoroso: "relacoes",
  familia: "relacoes",
  vidaSocial: "relacoes",
  equilibrioEmocional: "decisoes",
  saudeDisposicao: "energia",
  plenitudeFelicidade: "energia",
  espiritualidade: "sombra",
  criatividadeHobbyDiversao: "energia",
};
