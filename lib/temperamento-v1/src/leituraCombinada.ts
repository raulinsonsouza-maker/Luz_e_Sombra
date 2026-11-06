import type { TemperamentoCodigo } from "./types";
import { NOME_TEMPERAMENTO } from "./interpretacao";
import { TEMPERAMENTOS } from "./types";

const MIUDO: Record<TemperamentoCodigo, string> = {
  COLERICO: "colérico",
  SANGUINEO: "sanguíneo",
  MELANCOLICO: "melancólico",
  FLEUMATICO: "fleumático",
};

const NUCLEO: Record<TemperamentoCodigo, [string, string]> = {
  SANGUINEO: [
    "O que mais marca você é a gente. A sala muda quando você entra: a conversa anda, o clima sobe, alguém que estava calado acaba falando. O que te acende é contato, novidade e a sensação de que a vida está acontecendo agora. Sozinho por muito tempo, ou preso na mesma tarefa, você murcha. Não é frescura. É o jeito como a sua energia volta.",
    "Por baixo do bom humor tem uma necessidade simples: ser bem recebido. Você quer que as pessoas gostem de estar com você, e faz isso com história, risada e presença. O talento é abrir portas. O exagero é abrir dez e não atravessar nenhuma até o fim.",
  ],
  COLERICO: [
    "O que mais marca você é o resultado. Se a conversa não anda, você corta. Se ninguém decide, você decide. O que te acende é ver a coisa sair do lugar, de preferência hoje. Lentidão, enrolação e gente que fala sem concluir te irritam de verdade.",
    "Por baixo da pressa tem uma necessidade de comando: sentir que a sua vontade move o que está parado. Isso faz de você a pessoa que destrava. Também faz você passar por cima de quem precisava de mais um minuto.",
  ],
  MELANCOLICO: [
    "O que mais marca você é o cuidado. Antes de falar, você olha o detalhe, o risco e o que pode sair errado. O que te acende é fazer direito e entender o porquê. Pressa sem critério e conversa rasa te cansam mais do que um trabalho difícil.",
    "Por baixo da exigência tem uma necessidade de sentido. Você quer que as coisas sejam verdadeiras, não só bonitas por fora. O talento é ver o que os outros deixam passar. O exagero é pensar tanto que a hora de agir passa.",
  ],
  FLEUMATICO: [
    "O que mais marca você é a calma. Enquanto os outros sobem o tom, você segura. O que te acende é paz, uma rotina que funciona e gente que não briga para provar ponto. Conflito te desgasta mais do que trabalho pesado.",
    "Por baixo da paciência tem uma necessidade de harmonia. Você sustenta o que os outros abandonam no meio. O talento é ser o chão da casa e do grupo. O exagero é engolir o que precisava ser dito para não estragar o clima.",
  ],
};

/** A ordem importa: sanguíneo com traço colérico não é o mesmo que colérico com traço sanguíneo. */
const PAR: Record<string, [string, string, string]> = {
  SANGUINEO_COLERICO: [
    "Você é primeiro uma pessoa de gente, e logo depois uma pessoa de resultado. O sanguíneo abre a porta com calor. O colérico empurra a conversa até virar decisão. Juntos, isso dá alguém persuasivo: fala com gosto, convence sem parecer frio e não se contenta em só animar a sala. Você quer que as pessoas venham, e quer que alguma coisa saia dali.",
    "No dia a dia isso aparece assim: você puxa o grupo, conta a ideia com brilho e, se a roda enrolar, corta e pede o próximo passo. Você delega o detalhe chato com naturalidade, porque a sua energia está no contato e na meta, não na planilha. Sem gente e sem movimento, você entedia rápido. Com os dois, você lidera de um jeito que os outros aceitam, porque sentem afeto junto com direção.",
    "O cuidado é a língua. O sanguíneo fala antes de pensar, o colérico fala para ganhar. Os dois juntos podem ferir sem perceber: uma piada afiada, um esquecimento de algo que a pessoa contou, uma cobrança no meio do carinho. A raiva passa rápido em você. Em quem recebeu, às vezes fica. O amadurecimento aqui não é ficar quieto. É lembrar que convencer também é escutar até o fim.",
  ],
  SANGUINEO_MELANCOLICO: [
    "Você é primeiro calor e depois profundidade. Por fora, as pessoas veem alguém leve, que chega sorrindo e puxa assunto. Por dentro, você sente mais do que mostra, e uma crítica ou um detalhe fora do lugar pode descer fundo mesmo depois de a conversa já ter virado risada.",
    "Esse par oscila. Num dia você quer todo mundo em volta. No outro, a parte melancólica pede silêncio e acha a própria festa rasa. Quem convive com você pode achar que o humor mudou sem aviso. Não mudou o fundo: mudou qual dos dois jeitos está no comando naquela hora. O sanguíneo busca acolhida. O melancólico busca que aquilo seja verdadeiro.",
    "Quando os dois trabalham juntos, você comunica coisa séria de um jeito que as pessoas conseguem ouvir. Você humaniza o que seria só análise. O risco é a autocrítica usar o seu charme como máscara: todo mundo acha que você está bem, e você está remoendo. Falar o peso enquanto ele ainda é pequeno evita o tombo depois.",
  ],
  SANGUINEO_FLEUMATICO: [
    "Você é primeiro presença alegre, e a calma entra para não deixar essa alegria atropelar ninguém. O sanguíneo quer a roda. O fleumático não quer briga. O resultado é uma pessoa que anima sem humilhar, que ajuda com gosto e que prefere o caminho gentil mesmo quando poderia forçar.",
    "As pessoas se sentem seguras com você porque o clima fica bom e ninguém é empurrado. Você é ótimo para receber, apresentar, cuidar de um grupo e desarmar uma sala tensa. No trabalho, o risco é outro: a parte que gosta de gente pode ganhar do que precisa ser entregue, e a parte calma não cobra o prazo. A tarefa fica gostosa e incompleta.",
    "O amadurecimento é escolher uma coisa chata e ir até o fim sem negociar com o humor do dia. A sua bondade já está pronta. O que falta, às vezes, é um limite: dizer não para um convite, ou dizer sim para um compromisso sem graça que só você pode fechar.",
  ],
  COLERICO_SANGUINEO: [
    "Você é primeiro resultado, e o calor vem para a meta não parecer uma ordem. Diferente de quem anima e depois cobra, você já entra querendo o fim da história. A parte sanguínea torna isso suportável: você sabe falar com gente, desarmar um clima e convencer, não só mandar.",
    "Por isso você lidera com mais flexibilidade do que um colérico puro. Você ainda fica impaciente, ainda acha que está certo, ainda empurra o ritmo. Mas você também para para rir, ouve um pouco e entende que gente não é obstáculo, é o meio pelo qual a coisa acontece. A raiva sobe rápido e, em você, costuma descer rápido. O problema é a frase que saiu no pico.",
    "O talento maduro dessa combinação é iniciar e também carregar as pessoas até a entrega, sem transformá-las em ferramenta. O exagero é virar o centro de tudo: a ideia, o prazo e o humor da sala. Quando alguém discorda, a parte colérica quer ganhar e a sanguínea quer continuar gostada. As duas puxam. Ganhar a discussão e perder a pessoa é o preço que essa combinação paga quando não se vigia.",
  ],
  COLERICO_MELANCOLICO: [
    "Você junta vontade de fazer com vontade de fazer direito. A parte colérica não espera. A melancólica não aceita qualquer caminho. Por dentro, isso é um cabo de guerra: uma voz diz 'já vai', a outra diz 'ainda não está bom'. Quando as duas se alinham, você pensa com profundidade e executa com força. Pouca gente segura as duas pontas.",
    "No trabalho isso vira padrão alto e entrega real. Você vê o furo, decide e cobra. Nas relações, o mesmo padrão pesa: você corrige rápido, espera o mesmo nível dos outros e se frustra quando eles não enxergam o que para você é óbvio. A crítica sai como ajuda. Chega como dureza.",
    "O amadurecimento é escolher onde a excelência vale o atraso, e onde 'bom o bastante' já destrava a vida. A sua mente estratégica não precisa ganhar todas as conversas. Precisa de um critério dito em voz alta, para a outra pessoa saber o que é suficiente e para você poder descansar da própria exigência.",
  ],
  COLERICO_FLEUMATICO: [
    "Você quer que ande, mas não quer viver em guerra. O colérico dá a direção. O fleumático segura o tom e pensa no longo prazo. Por isso você organiza, planeja e leva projeto até o fim melhor do que quem só explode e troca de meta. A pressa existe, e ela aprendeu a usar constância.",
    "As pessoas te veem firme e confiável. Em crise, você assume. No dia comum, você prefere time a palco. O risco é guardar mágoa. A parte calma não explode na hora, a parte que manda não esquece quem atrasou. A amargura fica quieta e depois sai como frieza, ironia ou um controle que você chama de organização.",
    "O caminho maduro é falar o incômodo enquanto ele ainda é pequeno, no seu tom baixo, sem esperar a raiva justificar a conversa. Você não precisa virar barulhento. Precisa não transformar paz em conta não paga.",
  ],
  MELANCOLICO_SANGUINEO: [
    "Você é primeiro profundidade, e a expressão vem para essa profundidade não ficar presa. Você pensa, sente e, quando confia, comunica de um jeito que envolve. As pessoas recebem conteúdo com calor, não um relatório frio. Esse é um dos pares mais capazes de ensinar, criar e tocar alguém de verdade.",
    "O movimento interno oscila. A parte melancólica quer poucos e fundo. A sanguínea quer plateia, novidade e alívio. Você pode estar no centro de uma roda e, uma hora depois, precisar sumir. Não é falsidade. São duas necessidades legítimas se revezando. Quem te ama precisa ouvir isso antes, senão lê a saída como rejeição.",
    "O risco é a autocrítica usar o charme. Você anima os outros e se cobra em silêncio. Ou o contrário: a empolgação te faz prometer uma entrega caprichada que a parte exigente depois não consegue soltar. Combinar o que é 'pronto' antes de prometer protege os dois jeitos.",
  ],
  MELANCOLICO_COLERICO: [
    "Você pensa fundo e, quando fecha o julgamento, age com força. A parte melancólica investiga. A colérica não fica no estudo: ela quer o efeito. Por isso você é bom em problema difícil, diagnóstico e conserto. Você não se contenta em entender. Você quer que mude.",
    "A tensão é o tempo. Uma parte pede mais análise. A outra se irrita com a própria demora e então dispara. Às vezes a decisão sai tarde e dura. Nas relações, isso aparece como padrão alto mais impaciência: você viu o erro, esperou, e quando fala já vem cobrança junto com a razão.",
    "O amadurecimento é separar os dois momentos em voz alta: 'ainda estou olhando' e 'agora eu decidi'. Assim você não pune os outros pela espera que foi sua, e não usa a pressa para fugir de um detalhe que realmente importava.",
  ],
  MELANCOLICO_FLEUMATICO: [
    "Você quer fazer direito e quer paz ao mesmo tempo. A parte melancólica vê o furo, o risco, o que está incompleto. A fleumática pede que isso não vire briga. O resultado é uma pessoa criteriosa, leal com poucos, organizada por dentro e pouco barulhenta por fora. Você antecipa problema melhor do que a maioria, e demora a colocar o corpo na solução.",
    "No íntimo, você funciona com lista, mesmo quando a lista está só na cabeça. Precisa de tempo sozinho para pensar, de informação antes de mudar de plano, e de um círculo pequeno onde não precise se explicar o tempo todo. Gente agressiva te faz recuar. Você não perde o argumento: você sai da sala e continua pensando nele de madrugada.",
    "O risco é a preocupação quieta. Você concorda por fora, carrega por dentro e se culpa por coisas que nem eram suas. Uma frase cedo, dita no seu tom calmo, vale mais do que uma noite inteira revisando a conversa. O seu cuidado já é grande. Falta deixá-lo chegar no outro antes de virar peso só seu.",
  ],
  FLEUMATICO_SANGUINEO: [
    "Você é primeiro paz, e a alegria entra para essa paz não virar distância. As pessoas sentem um colo: você escuta, não compete, e ainda assim sabe animar quando o clima pede. Você não toma a sala. Você deixa a sala boa.",
    "O sanguíneo aqui não é o motor, é o tempero. Ele te tira de casa, te faz rir, te aproxima. O fleumático escolhe o ritmo e evita o conflito. Juntos, você é ótimo amigo e péssimo em conversa difícil. O problema cresce no silêncio enquanto você mantém o sorriso.",
    "O amadurecimento é uma frase honesta no meio do carinho, não no lugar dele. Você não precisa virar duro. Precisa avisar o incômodo enquanto ainda cabe numa conversa curta. Quem te procura pela calma também aguenta ouvir um limite, se o limite vier sem ataque.",
  ],
  FLEUMATICO_COLERICO: [
    "Você é primeiro estabilidade, e a firmeza aparece quando a paz está ameaçada. No dia comum você espera, medeia e não faz drama. Quando algo importante emperra, a parte colérica levanta: você decide, cobra e restaura a ordem. Quem só te viu calmo se surpreende. Não é outro você. É o segundo jeito entrando para proteger o primeiro.",
    "Esse par sustenta processo longo. Você não precisa de holofote e não troca de meta toda semana. O risco é a conta silenciosa. Você cede várias vezes, a irritação acumula, e a cobrança sai tarde, maior do que o fato. Ou você controla o ambiente 'para ninguém brigar', e chama isso de cuidado.",
    "Fale cedo, ainda no tom baixo. A sua firmeza fica mais limpa quando não precisa de raiva para ter permissão de existir. Você já sabe manter. Aprender a corrigir no meio do caminho é o que impede a explosão do fim.",
  ],
  FLEUMATICO_MELANCOLICO: [
    "Você é primeiro constância, e o critério entra para essa constância não virar acomodação. Por fora, calma. Por dentro, uma avaliação fina do que está bom e do que está torto. Você não briga para provar. Você observa, ajusta devagar e sofre quando o nível cai.",
    "A diferença para quem é melancólico primeiro: você não começa pela preocupação. Você começa tentando manter tudo estável. A exigência vem depois, em geral em silêncio, como um incômodo de que poderia estar melhor. Por isso as pessoas te acham fácil, e você se acha atrasado.",
    "O passo maduro é dizer uma preocupação enquanto ela ainda é pequena, e definir o que é suficiente para você poder descansar. A sua lealdade já segura a casa. O critério não precisa virar uma noite em claro para merecer ser falado.",
  ],
};

const VOZ: Record<TemperamentoCodigo, { terceiro: string; quarto: string }> = {
  SANGUINEO: {
    terceiro:
      "O sanguíneo não manda na sua vida, mas pesa. Ele aparece quando o ambiente pede leveza: uma visita, uma ideia nova, a vontade de sair do sério. Se você o ignora por muito tempo, a rotina fica correta e sem gosto.",
    quarto:
      "O sanguíneo é a voz mais baixa. Ele entra no alívio: uma piada no meio da tensão, um convite que você quase recusa, o dia em que você decide não levar tudo tão a sério. É pouco, e ainda assim salva o clima.",
  },
  COLERICO: {
    terceiro:
      "O colérico não é o seu primeiro movimento, mas ele decide vários finais. Quando a conversa enrola ou alguém falta com o combinado, essa parte cobra, corta e pede prazo. Sem ela, você anima ou analisa e não fecha.",
    quarto:
      "O colérico aparece pouco, em geral quando você está no limite. Aí a pressa e a irritação surpreendem quem te achava só leve ou só calmo. Não deixe essa voz só para a explosão. Use um pedaço dela no meio da semana, numa decisão pequena.",
  },
  MELANCOLICO: {
    terceiro:
      "O melancólico entra quando o assunto importa de verdade. Ele te faz olhar o detalhe, a consequência e o que não foi dito. Sem essa parte, você seria mais rápido e mais raso. Com ela, você capricha e às vezes trava.",
    quarto:
      "O melancólico é um sussurro. Ele aparece de noite, numa crítica que ficou, num 'será que ficou bom'. Não deixe essa voz virar julgamento de tudo. Deixe ela cuidar só do que realmente pede cuidado.",
  },
  FLEUMATICO: {
    terceiro:
      "O fleumático é o freio. Ele segura a briga, lembra que a outra pessoa também cansa e te pede para não decidir no pico. Sem ele, o seu jeito principal passaria por cima. Com ele, você espera um pouco, às vezes um pouco demais.",
    quarto:
      "O fleumático quase não aparece no palco, mas segura a casa. É a parte que não responde no ato, que mantém a rotina quando o resto de você quer reagir. Escute ela antes de mandar a mensagem no calor.",
  },
};

const RELACAO: Record<string, string> = {
  SANGUINEO_COLERICO:
    "Em relação, você chega fácil e conduz. As pessoas se aproximam pelo calor e depois sentem o ritmo que você impõe. O vínculo fica bom quando o outro tem espaço para discordar sem perder o seu afeto. Fica ruim quando a pessoa vira plateia do seu plano.",
  SANGUINEO_MELANCOLICO:
    "Em relação, você é quente na chegada e fundo na permanência. Você precisa de resposta, de olhar, de sentir que foi escolhido de verdade. Se o outro só curte a parte leve, você se sente usado. Se você só mostra a parte leve, o outro não tem como te acompanhar no peso.",
  SANGUINEO_FLEUMATICO:
    "Em relação, você é bom de estar junto. O conflito é que você evita. O amor aqui cresce na constância, não só na festa. Uma conversa difícil, feita com o seu jeito gentil, aproxima mais do que mais um programa.",
  COLERICO_SANGUINEO:
    "Em relação, você cuida fazendo: resolve, decide, anima. O outro pode se sentir amparado e, ao mesmo tempo, sem voz. Perguntar antes de arrumar a vida da pessoa é o gesto que transforma a sua força em parceria.",
  COLERICO_MELANCOLICO:
    "Em relação, você é leal e exigente. Você vê o que pode melhorar na pessoa que ama, e diz. O cuidado vira cobrança quando não vem com um reconhecimento do que já está bom. Elogio específico, no seu vocabulário, vale ouro.",
  COLERICO_FLEUMATICO:
    "Em relação, você é estável e pouco teatral. Você demonstra no cumprimento, não no discurso. O outro às vezes precisa ouvir o que você sente, não só ver o que você resolveu. Uma frase por semana evita que a casa vire só gestão.",
  MELANCOLICO_SANGUINEO:
    "Em relação, você quer profundidade e também quer ser uma boa companhia. Você some para pensar e volta com afeto. Avise a saída. Quem fica do lado lê silêncio como distância, e você muitas vezes só estava digerindo.",
  MELANCOLICO_COLERICO:
    "Em relação, você testa se pode confiar e, quando confia, se entrega com seriedade. A decepção dói e vira distância ou lição. Dizer a mágoa na primeira vez, antes de montar o caso, salva vínculos que a sua razão já teria encerrado.",
  MELANCOLICO_FLEUMATICO:
    "Em relação, você é fiel, quieto e atento. Você percebe a mudança de tom antes de todo mundo e demora a nomear. O outro se sente acolhido e, às vezes, sem saber o que você precisa. Peça uma coisa concreta. Você sabe pedir para os outros. Peça para você.",
  FLEUMATICO_SANGUINEO:
    "Em relação, você é o lugar seguro com um sorriso. As pessoas desabafam e saem leves. O risco é você sair cheio. O vínculo fica adulto quando você também traz um assunto seu, não só sustenta o do outro.",
  FLEUMATICO_COLERICO:
    "Em relação, você evita guerra até não dar mais. Aí a firmeza aparece inteira e o outro diz que não viu vir. O combinado é simples: um aviso no meio, no seu tom, antes da conta fechar.",
  FLEUMATICO_MELANCOLICO:
    "Em relação, você é constante e seletivo. Poucos entram, e esses poucos são levados a sério. Você pode passar anos engolindo um incômodo pequeno. Traga um por mês. A paz que você protege fica mais verdadeira.",
};

const PRESSAO: Record<TemperamentoCodigo, string> = {
  SANGUINEO: "você fala mais, promete mais e foge do que ficou pesado",
  COLERICO: "você acelera, corta gente e trata sentimento como atraso",
  MELANCOLICO: "você trava, revisa e se culpa por um detalhe",
  FLEUMATICO: "você se cala, adia e chama a fuga de paciência",
};

const PASSO: Record<string, [string, string, string, string]> = {
  SANGUINEO_COLERICO: [
    "Nesta semana, feche uma coisa que você começou com empolgação. Só uma, até o fim.",
    "Antes de cobrar alguém, repita o que a pessoa disse. Uma frase. Aí você pede o prazo.",
    "Quando a piada sair afiada, volte nela no mesmo dia. Corrigir cedo cabe no seu calor.",
    "O que eu abri com brilho e ainda não terminei?",
  ],
  SANGUINEO_MELANCOLICO: [
    "Escolha uma pessoa e conte o peso de verdade, não só a versão engraçada.",
    "Defina o que é 'pronto' antes de prometer uma entrega caprichada.",
    "Se a autocrítica passar de uma hora, escreva três linhas e pare. O resto é ruminação.",
    "O que eu estou sentindo e ainda visto de bom humor?",
  ],
  SANGUINEO_FLEUMATICO: [
    "Diga um não gentil esta semana, para um convite ou uma tarefa que não é sua.",
    "Bloqueie um horário sem graça para a pendência que você empurra com simpatia.",
    "Traga uma conversa difícil em tom baixo, antes de ela virar clima estranho.",
    "Onde eu estou sendo agradável no lugar de ser claro?",
  ],
  COLERICO_SANGUINEO: [
    "Antes da próxima decisão que mexe com alguém, faça uma pergunta e espere a resposta inteira.",
    "Separe o que é urgente do que só está alto na sua cabeça. Risque um dos dois.",
    "Elogie uma pessoa pelo que ela fez, sem emendar a correção na mesma frase.",
    "Quem eu tratei como meio para a minha meta nesta semana?",
  ],
  COLERICO_MELANCOLICO: [
    "Escreva o critério de 'chega' antes de começar. Quando bater nele, entregue.",
    "Corrija uma coisa por conversa. O resto vira lista para outro dia.",
    "Reconheça em voz alta um acerto alheio que a sua exigência teria pulado.",
    "Onde eu estou atrasando a vida à espera de um nível que ninguém combinou?",
  ],
  COLERICO_FLEUMATICO: [
    "Diga um incômodo enquanto ele ainda cabe numa frase calma.",
    "Entregue uma decisão que você está segurando 'para manter a paz'.",
    "Revise se o seu controle é cuidado ou se é medo de soltar o comando.",
    "O que eu estou cobrando tarde demais?",
  ],
  MELANCOLICO_SANGUINEO: [
    "Avise quando for se recolher. Uma frase basta: 'preciso de um tempo e eu volto'.",
    "Prometa menos do que o seu entusiasmo quer, e entregue o que a sua exigência aguenta.",
    "Mostre um trabalho no meio, não só quando estiver impecável.",
    "O que eu escondo atrás do meu jeito fácil?",
  ],
  MELANCOLICO_COLERICO: [
    "Separe o tempo de olhar do tempo de decidir. Diga em qual dos dois você está.",
    "Fale a mágoa na primeira vez, antes de montar o argumento completo.",
    "Escolha um detalhe para soltar hoje. O resto pode continuar caprichado.",
    "O que eu já entendi e ainda não deixei acontecer?",
  ],
  MELANCOLICO_FLEUMATICO: [
    "Diga uma preocupação pequena em voz alta, no mesmo dia em que ela aparecer.",
    "Marque o que é suficiente neste trabalho e pare quando chegar lá.",
    "Peça uma ajuda concreta, em vez de carregar sozinho para não incomodar.",
    "O que eu estou concordando por fora e carregando por dentro?",
  ],
  FLEUMATICO_SANGUINEO: [
    "Traga um assunto seu numa conversa em que você só escutaria.",
    "Marque a conversa adiada e faça em vinte minutos, sem discurso.",
    "Recuse um favor que te esvazia, com educação e sem história longa.",
    "Onde eu estou leve para não precisar ser honesto?",
  ],
  FLEUMATICO_COLERICO: [
    "Avise no meio, antes da irritação ficar grande.",
    "Tome uma decisão pequena que você vem mediando há dias.",
    "Pergunte se o seu silêncio está sendo lido como acordo.",
    "O que eu vou cobrar tarde se eu não disser hoje?",
  ],
  FLEUMATICO_MELANCOLICO: [
    "Fale um critério seu antes de a decepção acumular.",
    "Encerre uma revisão noturna com um horário. Depois disso, a cama.",
    "Peça mudança numa coisa só, em tom de pedido, não de desculpa.",
    "O que eu acho que não está bom e ainda não disse?",
  ],
};

export interface LeituraDaCombinacao {
  principal: string[];
  combinacao: string[];
  inteira: string[];
  passos: string[];
  pergunta: string;
}

function ordenar(percentuais: Record<TemperamentoCodigo, number>): [TemperamentoCodigo, number][] {
  return [...TEMPERAMENTOS]
    .map((codigo) => [codigo, percentuais[codigo] ?? 0] as [TemperamentoCodigo, number])
    .sort((a, b) => b[1] - a[1]);
}

function chave(a: TemperamentoCodigo, b: TemperamentoCodigo): string {
  return `${a}_${b}`;
}

export function montarLeituraDaCombinacao(opts: {
  primario: TemperamentoCodigo;
  secundario: TemperamentoCodigo;
  percentuais: Record<TemperamentoCodigo, number>;
}): LeituraDaCombinacao {
  const ordem = ordenar(opts.percentuais);
  const primario = ordem[0]?.[0] ?? opts.primario;
  const secundario = ordem[1]?.[0] && ordem[1][0] !== primario ? ordem[1][0] : opts.secundario;
  const terceiro = ordem.find(([codigo]) => codigo !== primario && codigo !== secundario)?.[0] ?? "FLEUMATICO";
  const quarto =
    ordem.find(([codigo]) => codigo !== primario && codigo !== secundario && codigo !== terceiro)?.[0] ?? "MELANCOLICO";

  const par = PAR[chave(primario, secundario)] ?? PAR[chave(secundario, primario)] ?? PAR.SANGUINEO_FLEUMATICO;
  const passosPar = PASSO[chave(primario, secundario)] ?? PASSO[chave(secundario, primario)] ?? PASSO.SANGUINEO_FLEUMATICO;
  const [p1, p2, p3, pergunta] = passosPar;

  const perto = (ordem[1]?.[1] ?? 0) - (ordem[2]?.[1] ?? 0) <= 8;
  const ponte = perto
    ? `${NOME_TEMPERAMENTO[terceiro]} está perto do segundo lugar. Em alguns dias ele disputa o comando com o ${MIUDO[secundario]}.`
    : `${NOME_TEMPERAMENTO[terceiro]} fica atrás, mas não é enfeite.`;

  const principal = [
    ...NUCLEO[primario],
    `Esse é o jeito que mais aparece em você. ${NOME_TEMPERAMENTO[secundario]} vem em seguida e muda o uso desse dom. ${NOME_TEMPERAMENTO[terceiro]} e ${MIUDO[quarto]} também são seus: um entra em horas marcadas, o outro segura um limite. Você não é um rótulo. Você é essa mistura, com um centro claro.`,
  ];

  const combinacao = [
    ...par,
    ponte,
    VOZ[terceiro].terceiro,
    VOZ[quarto].quarto,
    `Lido junto, o ${MIUDO[primario]} dá a direção do dia, o ${MIUDO[secundario]} dá o estilo, o ${MIUDO[terceiro]} corrige a rota e o ${MIUDO[quarto]} evita o excesso. Nenhum dos quatro trabalha sozinho em você.`,
  ];

  const inteira = [
    RELACAO[chave(primario, secundario)] ?? RELACAO[chave(secundario, primario)]!,
    `Sob pressão, a ordem se embaralha. O mais comum é que ${PRESSAO[primario]}. Se a pressão continua, entra ${PRESSAO[secundario]}. ${NOME_TEMPERAMENTO[terceiro]} tenta consertar o estrago, e o ${MIUDO[quarto]} ou segura o impulso ou some. Quem te vê só no dia bom não vê essa sequência. Ela explica várias brigas que pareceram 'do nada'.`,
    `A pessoa inteira é o centro ${MIUDO[primario]} com sotaque ${MIUDO[secundario]}, mais a correção do ${MIUDO[terceiro]} e o freio do ${MIUDO[quarto]}. O dom não está em apagar três para sobrar um. Está em saber qual voz está falando agora, e se ela está ajudando a hora ou só repetindo o hábito.`,
  ];

  return { principal, combinacao, inteira, passos: [p1, p2, p3], pergunta };
}
