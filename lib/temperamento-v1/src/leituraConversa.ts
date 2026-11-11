import { itemPorId, type CodigoItem, type RespostaSimNao } from "./itens";
import type { TemperamentoCodigo } from "./types";
import { TEMPERAMENTOS } from "./types";

export const FRASE_ASSUMIR =
  "Diante da demora, você toma a iniciativa e busca uma solução.";

export const FRASE_CRITICA =
  "Uma crítica fica com você por vários dias, mesmo quando a conversa já acabou.";

export interface CartaoConversa {
  id: string;
  titulo: string;
  paragrafos: string[];
  perguntas: string[];
  passos: string[];
}

interface CenaItem {
  id: CodigoItem;
  alvo: TemperamentoCodigo;
  reconhecer?: string;
  facilidade?: string;
  relacao?: string;
  trabalho?: string;
  atrapalha?: string;
  experimento?: string;
}

interface FatoOrdem {
  depois: string;
  encontro: string;
  descoberta: string;
  pergunta: string;
  relacao: string;
  trabalho: string;
  atrapalhos: [string, string, string];
  passos: [string, string, string];
  fechamento: string;
}

const NOME: Record<TemperamentoCodigo, string> = {
  SANGUINEO: "sanguíneo",
  COLERICO: "colérico",
  MELANCOLICO: "melancólico",
  FLEUMATICO: "fleumático",
};

const EXPLICACAO: Record<TemperamentoCodigo, string> = {
  SANGUINEO:
    "Sanguíneo: tendência a se animar com gente, conversa e novidade. Muitas vezes você descobre o que pensa enquanto fala.",
  COLERICO:
    "Colérico: tendência a olhar para o que precisa ser feito e começar. O caminho se ajusta no meio.",
  MELANCOLICO:
    "Melancólico: tendência a entender antes de escolher e reparar no que os outros deixam passar.",
  FLEUMATICO:
    "Fleumático: tendência a observar antes de entrar e preferir um ambiente em paz.",
};

const INTRO: Record<TemperamentoCodigo, string> = {
  SANGUINEO:
    "Quando você chega num lugar novo, você olha primeiro as pessoas, o clima e o que dá para conversar. Você descobre o que pensa enquanto fala. A conversa organiza a ideia.",
  COLERICO:
    "Diante de um problema, você procura a saída antes de reunir todos os detalhes. Uma tarefa atrasada vira a pergunta de quem faz o quê e como recuperar o prazo.",
  MELANCOLICO:
    "Diante de uma escolha, você quer o contexto: o que muda na rotina, o que pode falhar e o que combina com o que você valoriza. Uma decisão simples fica maior do que é.",
  FLEUMATICO:
    "Você observa o ambiente antes de participar. Numa discussão em casa, enquanto alguém quer resolver na hora, você espera as pessoas se acalmarem. Não reagir na hora não quer dizer que você não tenha opinião.",
};

const AVISO_ANTIGO =
  "Este desenho vem da proporção das suas respostas anteriores. O que nenhuma pergunta nova cobriu fica como possibilidade: indica o que pode aparecer, não uma cena que você marcou.";

const FACILIDADE: Record<TemperamentoCodigo, string> = {
  SANGUINEO: "Você começa uma conversa e as pessoas ficam mais à vontade.",
  COLERICO: "Você toma a frente quando ninguém decide.",
  MELANCOLICO: "Você percebe um detalhe que melhora o que vai ser entregue.",
  FLEUMATICO: "Você escuta com calma quando as outras pessoas estão apressadas.",
};

const PERGUNTA_JEITO: Record<TemperamentoCodigo, string> = {
  SANGUINEO: "Você consegue continuar valorizando o que começou quando o ânimo passa e ninguém está te incentivando?",
  COLERICO: "Você consegue deixar as coisas acontecerem de um jeito diferente do seu sem sentir que perdeu o controle?",
  MELANCOLICO: "Quantas vezes você deixa de começar, decidir ou concluir porque ainda acha que poderia fazer melhor?",
  FLEUMATICO: "Quantas vezes você deixa de dizer o que realmente quer só para evitar um desconforto?",
};

const CENAS: CenaItem[] = [
  {
    id: "E01",
    alvo: "SANGUINEO",
    reconhecer: "Você consegue iniciar conversas até com pessoas que acabou de conhecer.",
    facilidade: "Você se aproxima e as pessoas entram no assunto.",
  },
  {
    id: "E02",
    alvo: "SANGUINEO",
    reconhecer: "Estar no meio das pessoas te anima mais do que te cansa.",
  },
  {
    id: "E03",
    alvo: "SANGUINEO",
    relacao: "Em casa, você conta o que sentiu e já segue em frente. A outra pessoa ainda está naquele assunto.",
    experimento: "Na próxima discussão, fique mais um minuto no assunto antes de contar outra coisa.",
  },
  {
    id: "E04",
    alvo: "SANGUINEO",
    atrapalha: "Você conta a história e a outra pessoa quase não entra. A conversa termina sem a opinião dela.",
    experimento: "Numa conversa desta semana, conte menos uma frase e pergunte o que a outra pessoa achou.",
  },
  {
    id: "E05",
    alvo: "COLERICO",
    trabalho: "No trabalho, quando a decisão trava, você assume o próximo passo mesmo já estando cheio de tarefa.",
    facilidade: "Quando o grupo está parado, você escolhe o próximo passo.",
  },
  {
    id: "E06",
    alvo: "COLERICO",
    atrapalha: FRASE_ASSUMIR,
    experimento: "Quando alguém demorar, diga que espera e deixe a pessoa terminar o raciocínio.",
  },
  {
    id: "E07",
    alvo: "COLERICO",
    trabalho: "Numa reunião, você fecha o assunto enquanto a outra pessoa ainda está entendendo.",
    experimento: "Escolha uma conversa e termine sem pedir uma conclusão. Só agradeça o que foi dito.",
  },
  {
    id: "E08",
    alvo: "COLERICO",
    relacao: "Em casa, você cobra na hora quando alguém atrasa o combinado. A outra pessoa para de contar o que sentia.",
    experimento: "Na próxima cobrança, pergunte primeiro o que atrasou. A cobrança vem na frase seguinte.",
  },
  {
    id: "N01",
    alvo: "MELANCOLICO",
    trabalho: "Você organiza e prevê problemas por tempo demais, e o prazo anda. A tarefa só fica pronta quando você tem certeza.",
    facilidade: "Olhar antes te evita um passo que você ia querer desfazer.",
  },
  {
    id: "N02",
    alvo: "MELANCOLICO",
    reconhecer: FRASE_CRITICA,
    atrapalha: "Você transforma um comentário sobre a tarefa numa dúvida sobre a sua capacidade.",
    experimento: "Se uma crítica voltar, escreva uma frase sobre o que ela pediu e pare por hoje.",
  },
  {
    id: "N03",
    alvo: "MELANCOLICO",
    trabalho: "No trabalho, você mexe de novo num detalhe de algo que já estava pronto. A entrega atrasa.",
    experimento: "Ao terminar uma atividade, pergunte se você melhora o resultado ou só procura outro detalhe.",
  },
  {
    id: "N04",
    alvo: "MELANCOLICO",
    relacao: "Você espera que a outra pessoa perceba o que você precisa, sem você dizer. O silêncio vira distância.",
    experimento: "Diga uma coisa pequena que te incomodou no mesmo dia, em uma frase.",
  },
  {
    id: "N05",
    alvo: "FLEUMATICO",
    reconhecer: "Você mantém a calma quando as pessoas ao redor estão nervosas.",
    facilidade: "Essa calma segura uma conversa difícil para ela não virar briga.",
  },
  {
    id: "N06",
    alvo: "FLEUMATICO",
    relacao: "Em família, você concorda para evitar briga e o combinado não era o seu.",
    experimento: "Numa conversa em que você discordar, diga a sua posição em uma frase, sem aumentar o tom.",
  },
  {
    id: "N07",
    alvo: "FLEUMATICO",
    reconhecer: "Você gosta de um momento sem pressa e sem ter algo para resolver.",
  },
  {
    id: "N08",
    alvo: "FLEUMATICO",
    relacao: "Você escuta até o fim e o seu próprio assunto fica para depois.",
    facilidade: "As pessoas falam a verdade porque você não interrompe.",
  },
];

const ORDEM: Record<string, FatoOrdem> = {
  SANGUINEO_COLERICO: {
    depois:
      "O colérico entra logo depois e muda o rumo. Você abre com leveza. Em seguida, quer que a ideia saia do papel. Quem entrou para trocar uma ideia percebe que o assunto ganhou um destino.",
    encontro:
      "Numa reunião ou num jantar, você puxa o assunto e as pessoas entram. Pouco depois, você já organiza o próximo passo. A força é juntar gente e fazer a coisa andar.",
    descoberta:
      "O aperto é outro: quem veio só conversar sai com a sensação de que a conversa virou tarefa.",
    pergunta: "Na última vez em que você empolgou alguém com uma ideia, a pessoa saiu com vontade de participar ou com a sensação de que já tinha uma tarefa?",
    relacao:
      "Na convivência, você aproxima e também conduz. O incômodo pede conversa e rumo no mesmo momento. A outra pessoa ainda está sentindo, e você já quer o próximo passo.",
    trabalho:
      "No trabalho, você comunica a ideia e puxa as pessoas com você. Quando o grupo para, você escolhe o próximo passo. O trecho mais difícil é continuar quando a novidade passa e a tarefa pede conclusão.",
    atrapalhos: [
      "A intenção é aproveitar o ânimo enquanto ele está alto. Diante da demora, você toma a iniciativa e busca uma solução. A outra pessoa perde o lugar de pensar junto.",
      "Você começa com muita energia e perde o ritmo quando a tarefa fica repetitiva.",
      "Você lê o silêncio do outro como falta de interesse, e era só um tempo diferente do seu.",
    ],
    passos: [
      "Numa conversa, deixe a pessoa terminar antes de organizar o próximo passo.",
      "Escolha uma tarefa que a conversa já abriu e termine essa antes de começar outra ideia.",
      "Quando algo der certo, registre para você o que você fez, antes de contar para alguém.",
    ],
    fechamento:
      "Você não precisa falar menos para ouvir, nem abrir mão da iniciativa para respeitar o tempo de quem está com você. O instante que importa é aquele em que a conversa deixa de ser encontro e vira tarefa. Aí você escolhe.",
  },
  SANGUINEO_MELANCOLICO: {
    depois:
      "Você pode chegar sorrindo e puxar assunto. Depois, algo que foi dito fica com você, mesmo quando a conversa já tinha acabado bem.",
    encontro:
      "A conversa te anima e, às vezes, é nela que a ideia fica clara. Em seguida, uma frase pode continuar com você, e o entusiasmo encontra a vontade de fazer direito.",
    descoberta:
      "Você não precisa parar de contar o que vive para cuidar do que ficou. Pode escolher o que merece mais uma olhada e o que já pode seguir, sem transformar um comentário numa sentença sobre você.",
    pergunta: "O que te incomodou numa conversa recente e você ainda não falou?",
    relacao:
      "Você pode contar o dia com leveza e, mais tarde, remoer uma frase que a outra pessoa já esqueceu.",
    trabalho:
      "Você pode aceitar uma tarefa no meio da conversa e, depois, achar que ela ainda não está boa o bastante para entregar.",
    atrapalhos: [
      "Você pode prometer no meio da conversa mais do que você consegue caprichar depois.",
      "Você pode rir de um incômodo em vez de dizer o que sentiu.",
      "Você pode revisar a mesma crítica por tempo demais.",
    ],
    passos: [
      "Conte a uma pessoa o que te incomodou, sem transformar isso em piada.",
      "Antes de prometer uma entrega, diga o que já está bom o suficiente.",
      "Se a mesma crítica voltar por mais de uma hora, anote uma frase e pare.",
    ],
    fechamento:
      "Você pode continuar leve com as pessoas e, ao mesmo tempo, falar o que ficou. Uma coisa não apaga a outra.",
  },
  SANGUINEO_FLEUMATICO: {
    depois:
      "Você anima a conversa e ajuda quem está perto. Quando o assunto fica difícil, você muda de tema para ninguém discutir.",
    encontro:
      "O começo é participação: você entra, conta, aproxima. O momento seguinte pode ser a vontade de manter a paz, e o assunto difícil sai da mesa.",
    descoberta:
      "Manter o clima bom é um cuidado. Ele atrapalha quando você evita a conversa desconfortável e, dias depois, o incômodo ainda está lá.",
    pergunta: "Onde você mudou de assunto para não falar o que precisava?",
    relacao:
      "Em família, você pode ser a pessoa que alegra a mesa e também a que não traz o conflito.",
    trabalho:
      "No trabalho, você pode aceitar um pedido para não criar atrito, e a sua tarefa de verdade fica para depois.",
    atrapalhos: [
      "Você pode dizer sim para não estragar o clima.",
      "Você pode empurrar a tarefa sem graça porque a conversa é mais fácil.",
      "Você pode sair de um assunto difícil antes de ele ter um destino.",
    ],
    passos: [
      "Diga não a um pedido que não é seu, em uma frase.",
      "Marque um horário curto para a tarefa que você empurra.",
      "Traga o assunto difícil no mesmo dia, antes de ele virar silêncio.",
    ],
    fechamento:
      "Você pode continuar sendo a pessoa que aproxima os outros e, ainda assim, ficar numa conversa difícil até o fim.",
  },
  COLERICO_SANGUINEO: {
    depois:
      "Você já entra querendo resolver. A fala agradável vem em seguida, para as pessoas aceitarem o que você já tinha em mente.",
    encontro:
      "Você pode olhar primeiro para o que precisa ser resolvido e só depois deixar a conversa agradável. O carinho, nesse jeito, às vezes chega como solução, não como escuta.",
    descoberta:
      "Falar de um jeito bom ajuda as pessoas a ficarem perto. Vale perceber se elas estão escolhendo com você ou só concordando para a tarefa andar.",
    pergunta: "Quem você tratou, nesta semana, como um meio para a tarefa andar?",
    relacao:
      "Numa relação, você pode trazer o assunto já com a solução, e a outra pessoa sente que a conversa era só um aviso.",
    trabalho:
      "No trabalho, você pode fechar o plano e usar a conversa para contar o que já foi decidido.",
    atrapalhos: [
      "Você pode decidir primeiro e chamar de conversa o que já era um aviso.",
      "Você pode achar acordo onde só houve pressa de te agradar.",
      "Você pode corrigir na mesma frase em que elogia.",
    ],
    passos: [
      "Antes da próxima decisão, faça uma pergunta e espere a resposta inteira.",
      "Separe o que é urgente do que só está no topo da sua lista. Risque um dos dois.",
      "Diga um acerto de outra pessoa sem emendar a correção na mesma frase.",
    ],
    fechamento:
      "Você não precisa desistir de resolver para deixar a outra pessoa participar da decisão.",
  },
  COLERICO_MELANCOLICO: {
    depois:
      "Você pode querer resolver agora e, antes de fechar, conferir o detalhe. A decisão sai mais tarde e pode sair mais dura.",
    encontro:
      "A pressa de achar uma saída encontra a vontade de não deixar um detalhe passar. As duas juntas podem atrasar justo o que você queria acelerar.",
    descoberta:
      "Fazer bem feito e fazer agora podem morar juntos. O aprendizado é dizer o que já é suficiente, e entregar quando chegar lá, sem tratar um erro como se dissesse quem você é.",
    pergunta: "O que você ainda não entregou porque ainda não estava do seu jeito?",
    relacao:
      "Em casa, você pode cobrar uma mudança e, na mesma fala, listar o que ainda não está bom.",
    trabalho:
      "No trabalho, você pode segurar uma entrega para ajustar um detalhe, e o prazo passa.",
    atrapalhos: [
      "Você pode corrigir várias coisas na mesma conversa.",
      "Você pode não entregar porque ainda vê um erro pequeno.",
      "Você pode a pessoa do outro lado ouvir só a crítica, não o cuidado.",
    ],
    passos: [
      "Escreva o que é suficiente antes de começar. Quando chegar lá, entregue.",
      "Corrija uma coisa por conversa. Deixe o resto para outro dia.",
      "Diga um acerto que você teria pulado.",
    ],
    fechamento:
      "Você pode continuar exigente e, mesmo assim, soltar o que já está pronto.",
  },
  COLERICO_FLEUMATICO: {
    depois:
      "Você pode organizar a tarefa e seguir até o fim sem discutir na hora. A cobrança vem depois, quando o atraso já ficou grande.",
    encontro:
      "Por fora, a calma de quem não quer briga. Por dentro, a conta do que não foi dito. Quando a pressão sobe, você pode assumir o que era dos outros e cobrar de uma vez.",
    descoberta:
      "Esperar não é o mesmo que concordar. Dividir a tarefa também realiza. O outro só entende o seu limite se você disser no meio do caminho.",
    pergunta: "O que você vai cobrar tarde se não disser hoje?",
    relacao:
      "Numa relação, o silêncio pode parecer acordo. A cobrança tardia parece, para o outro, ter vindo do nada.",
    trabalho:
      "No trabalho, você pode carregar a tarefa sozinho e só então cobrar quem não entrou.",
    atrapalhos: [
      "Você pode engolir o incômodo até ele ficar grande demais.",
      "Você pode a outra pessoa achar que você concordou.",
      "Você pode a cobrança chegar sem aviso.",
    ],
    passos: [
      "Diga o incômodo no dia em que ele aparecer, em uma frase.",
      "Tome uma decisão que você está segurando para não discutir.",
      "Pergunte se o seu silêncio foi entendido como acordo.",
    ],
    fechamento:
      "Você pode continuar firme na tarefa e falar o incômodo enquanto ele ainda é pequeno.",
  },
  MELANCOLICO_SANGUINEO: {
    depois:
      "Você pensa antes de falar. Quando confia, explica de um jeito que as pessoas entendem. Se a conversa fica longa demais, você sai sem avisar.",
    encontro:
      "Você pode pensar bastante antes de falar e, quando confia, contar com vontade. Os dois juntos podem prometer, no meio da conversa, mais do que o seu cuidado consegue sustentar depois.",
    descoberta:
      "Participar não exige que você tenha tudo organizado antes de dizer. Avisar que precisa de um tempo também é um jeito de cuidar da relação.",
    pergunta: "O que você esconde quando está de bom humor com as pessoas?",
    relacao:
      "Com quem você gosta, pode contar bastante e, no dia seguinte, sentir que falou mais do que queria.",
    trabalho:
      "No trabalho, você pode mostrar só o que já está muito bom, e as pessoas não acompanham o caminho.",
    atrapalhos: [
      "Você pode sair de uma conversa sem dizer que vai sair.",
      "Você pode prometer no entusiasmo o que o seu cuidado não vai conseguir entregar no prazo.",
      "Você pode esconder o trabalho até ele parecer impecável.",
    ],
    passos: [
      "Avise quando for sair: preciso de um tempo e eu volto.",
      "Prometa menos do que a conversa te animou a prometer.",
      "Mostre o trabalho no meio, antes de ele estar impecável.",
    ],
    fechamento:
      "Você pode continuar cuidadoso e, ainda assim, deixar as pessoas verem o caminho, não só o fim.",
  },
  MELANCOLICO_COLERICO: {
    depois:
      "Você pode estudar o problema antes de agir. Quando decide, cobra a mudança. Quem esperou pode ouvir a crítica junto com a pressa.",
    encontro:
      "Há um tempo longo de entender o contexto e, de repente, a vontade de que tudo mude agora. Quem esperou pode ouvir, junto, a crítica e a pressa.",
    descoberta:
      "Dizer se você ainda está olhando ou se já decidiu tira o susto. Ouvir uma opinião diferente não tira a sua capacidade de realizar.",
    pergunta: "O que você já entendeu e ainda não deixou acontecer?",
    relacao:
      "Numa relação, a pessoa pode achar que está tudo bem enquanto você junta argumentos, e levar a cobrança de uma vez.",
    trabalho:
      "No trabalho, a espera por certeza pode virar uma cobrança apressada quando o prazo aperta.",
    atrapalhos: [
      "Você pode ficar em silêncio no estudo e duro na hora de cobrar.",
      "Você pode juntar vários incômodos para uma conversa só.",
      "Você pode não soltar um detalhe que já poderia seguir.",
    ],
    passos: [
      "Diga se você ainda está olhando ou se já decidiu.",
      "Fale o incômodo na primeira vez, antes de juntar todos os argumentos.",
      "Solte um detalhe hoje. O resto pode continuar caprichado.",
    ],
    fechamento:
      "Você pode continuar pensando antes e, mesmo assim, avisar as pessoas em que etapa você está.",
  },
  MELANCOLICO_FLEUMATICO: {
    depois:
      "Você pode ver o erro e não falar na hora. Concorda na frente dos outros e continua pensando nisso sozinho.",
    encontro:
      "Você pode ver o detalhe e, ao mesmo tempo, não querer a briga. O que não foi dito continua com você, e a outra pessoa acha que está tudo bem.",
    descoberta:
      "Concordar por fora e revisar por dentro cansa. Uma frase no mesmo dia pode ser mais leve do que uma noite inteira pensando se você deveria ter respondido de outro jeito.",
    pergunta: "O que você concordou na frente dos outros e continuou pensando depois?",
    relacao:
      "Em casa, você pode evitar a briga e guardar uma lista do que não ficou bom.",
    trabalho:
      "No trabalho, você pode aceitar um combinado e seguir corrigindo sozinho o que não disse.",
    atrapalhos: [
      "Você pode carregar sozinho uma tarefa que precisava de uma conversa.",
      "Você pode a revisão da noite não ter hora para acabar.",
      "Você pode o outro achar que você está de acordo.",
    ],
    passos: [
      "Diga uma preocupação pequena no mesmo dia em que ela aparecer.",
      "Marque o que é suficiente neste trabalho e pare quando chegar lá.",
      "Peça uma ajuda concreta, em vez de carregar a tarefa sozinho.",
    ],
    fechamento:
      "Você pode continuar cuidadoso com a paz e, ainda assim, pedir a mudança que já viu.",
  },
  FLEUMATICO_SANGUINEO: {
    depois:
      "Você escuta até o fim e deixa a conversa boa. O assunto que te incomoda não entra.",
    encontro:
      "A calma deixa a conversa fácil, e a vontade de participar fica no que é leve. O que te incomoda continua só com você, e as pessoas podem nem perceber que você precisava de ajuda.",
    descoberta:
      "Escutar é uma força. Ela fica pela metade quando a conversa nunca chega no que é seu. Dizer o que você quer não precisa estragar a paz.",
    pergunta: "Onde você deixou a conversa boa para não falar o que te incomoda?",
    relacao:
      "Com amigos, você pode ser uma companhia agradável e sair sem ter dito o que precisava.",
    trabalho:
      "No trabalho, você pode ajudar no assunto dos outros e adiar o seu.",
    atrapalhos: [
      "Você pode a conversa terminar agradável e incompleta.",
      "Você pode aceitar um favor que te atrapalha.",
      "Você pode adiar a conversa que você já sabe que precisa ter.",
    ],
    passos: [
      "Traga um assunto seu numa conversa em que você só escutaria.",
      "Marque a conversa adiada e faça em vinte minutos.",
      "Recuse um favor que te atrapalha, em uma frase.",
    ],
    fechamento:
      "Você pode continuar escutando bem e também ocupar um pedaço da conversa com o que é seu.",
  },
  FLEUMATICO_COLERICO: {
    depois:
      "Você espera e não discute. Quando a tarefa para, você decide e cobra de uma vez.",
    encontro:
      "Há um tempo em que você espera a poeira baixar e, depois, um corte. Quem estava na calma pode não entender a cobrança, porque não viu o que você já tinha percebido.",
    descoberta:
      "Avisar no meio evita que a firmeza pareça ter vindo do nada. Você pode continuar paciente e, ainda assim, tomar uma posição.",
    pergunta: "O que você vai cobrar de uma vez se não disser hoje?",
    relacao:
      "Numa relação, a paciência longa pode terminar numa frase dura, que junta vários dias.",
    trabalho:
      "No trabalho, você pode segurar a decisão para não criar atrito e, no fim, impor o caminho.",
    atrapalhos: [
      "Você pode a cobrança chegar sem os avisos do meio.",
      "Você pode decidir sozinho o que estava sendo mediado.",
      "Você pode o silêncio ser lido como acordo.",
    ],
    passos: [
      "Avise no meio, antes da cobrança ficar grande.",
      "Tome uma decisão pequena que você está mediando há dias.",
      "Pergunte se o seu silêncio foi lido como acordo.",
    ],
    fechamento:
      "Você pode continuar paciente e, ainda assim, dizer o limite antes de ele estourar.",
  },
  FLEUMATICO_MELANCOLICO: {
    depois:
      "Você mantém a rotina e evita briga. Quando algo fica mal feito, você guarda o incômodo e não pede a mudança.",
    encontro:
      "A rotina segue e o olhar para o detalhe fica com você. A casa ou o trabalho parecem em paz, e você continua vendo o que não ficou bom sem pedir a mudança.",
    descoberta:
      "Pedir uma mudança pequena não desfaz a paz. Mudar também pode fazer parte de uma vida mais tranquila, e dizer não a um pedido não é dizer não à pessoa.",
    pergunta: "O que não ficou bom e você ainda não pediu para mudar?",
    relacao:
      "Em casa, você pode manter a harmonia e guardar, em silêncio, o que gostaria que fosse diferente.",
    trabalho:
      "No trabalho, a rotina segue e um erro pequeno se repete porque ninguém ouviu o seu reparo.",
    atrapalhos: [
      "Você pode não pedir a mudança para não criar onda.",
      "Você pode revisar de noite o que não foi dito de dia.",
      "Você pode pedir desculpa por apontar o que não ficou bom.",
    ],
    passos: [
      "Peça uma mudança em uma coisa só, no mesmo dia.",
      "Pare a revisão da noite num horário marcado.",
      "Diga o que não ficou bom, em uma frase, sem pedir desculpa por dizer.",
    ],
    fechamento:
      "Você pode continuar buscando um ambiente calmo e pedir o ajuste que já viu.",
  },
};

const ABERTURA = [
  "Os temperamentos são uma forma de compreender diferentes tendências do nosso comportamento: como costumamos reagir às situações, expressar emoções, tomar decisões, lidar com mudanças e nos relacionar.",
  "A partir das suas respostas, você conhece o temperamento predominante, as características secundárias e como essas tendências podem aparecer nas relações, no trabalho e no seu processo de autoconhecimento.",
];

const FECHO_COMUM =
  "Conhecer o seu temperamento é o começo. A partir daqui, o convite é observar como essas tendências aparecem no seu dia a dia e ampliar a compreensão sobre si mesmo.";

function chave(a: TemperamentoCodigo, b: TemperamentoCodigo): string {
  return `${a}_${b}`;
}

function ordenar(percentuais: Record<TemperamentoCodigo, number>): TemperamentoCodigo[] {
  return [...TEMPERAMENTOS].sort((a, b) => (percentuais[b] ?? 0) - (percentuais[a] ?? 0));
}

function conta(id: string, respostas: Record<string, RespostaSimNao>): boolean {
  const item = itemPorId(id);
  if (!item) return false;
  const marca = item.direcao === "positiva" ? "sim" : "nao";
  return respostas[id] === marca;
}

function cenasDe(alvos: TemperamentoCodigo[], respostas: Record<string, RespostaSimNao> | undefined, usar: boolean): CenaItem[] {
  if (!usar || !respostas) return [];
  return CENAS.filter((cena) => alvos.includes(cena.alvo) && conta(cena.id, respostas));
}

function textos(cenas: CenaItem[], campo: keyof CenaItem, max: number): string[] {
  const saida: string[] = [];
  for (const cena of cenas) {
    const valor = cena[campo];
    if (typeof valor === "string" && !saida.includes(valor)) saida.push(valor);
    if (saida.length >= max) break;
  }
  return saida;
}

function quaseNao(codigo: TemperamentoCodigo): string {
  if (codigo === "FLEUMATICO") {
    return "Este temperamento quase não apareceu nas suas respostas. Não quer dizer que você não possa usá-lo. Uma pausa, por exemplo, pode ser algo para experimentar, não algo que você já faz.";
  }
  return "Este temperamento quase não apareceu nas suas respostas. Pode ser algo para experimentar, não uma cena que você marcou.";
}

function blocoMenor(
  codigo: TemperamentoCodigo,
  respostas: Record<string, RespostaSimNao> | undefined,
  usar: boolean,
): string[] {
  const nome = NOME[codigo];
  if (!usar) {
    return [`O temperamento ${nome} apareceu com menor intensidade. Você pode reconhecê-lo em algum dia, sem uma cena marcada.`];
  }
  const cenas = cenasDe([codigo], respostas, true);
  const reconhecidos = textos(cenas, "reconhecer", 3);
  if (reconhecidos.length === 0) return [`O temperamento ${nome} ficou baixo. ${quaseNao(codigo)}`];
  return [`O temperamento ${nome} também aparece, em menor intensidade.`, ...reconhecidos];
}

function unicos(textosLista: Array<string | undefined>, max: number): string[] {
  const saida: string[] = [];
  for (const texto of textosLista) {
    if (!texto || saida.includes(texto)) continue;
    saida.push(texto);
    if (saida.length >= max) break;
  }
  return saida;
}

const PERGUNTA_FECHO: Record<string, string> = {
  SANGUINEO_COLERICO: "Onde a conversa leve virou um pedido de decisão antes da outra pessoa terminar?",
  SANGUINEO_MELANCOLICO: "O que você contou com leveza e continuou pensando depois?",
  SANGUINEO_FLEUMATICO: "Qual assunto você tirou da mesa para o clima continuar bom?",
  COLERICO_SANGUINEO: "Quem concordou com você porque a conversa já era um aviso?",
  COLERICO_MELANCOLICO: "O que já estava pronto e você segurou por um detalhe?",
  COLERICO_FLEUMATICO: "O que você vai cobrar tarde se não disser hoje?",
  MELANCOLICO_SANGUINEO: "O que você prometeu no meio da conversa e o cuidado não sustenta?",
  MELANCOLICO_COLERICO: "Você ainda está olhando, ou já decidiu e a outra pessoa não sabe?",
  MELANCOLICO_FLEUMATICO: "O que você concordou na frente dos outros e continuou pensando depois?",
  FLEUMATICO_SANGUINEO: "Onde a conversa ficou boa e o que era seu não entrou?",
  FLEUMATICO_COLERICO: "O que você segurou em silêncio e depois cobrou de uma vez?",
  FLEUMATICO_MELANCOLICO: "O que não ficou bom e você ainda não pediu para mudar?",
};

function montarSanguineoColerico(opts: {
  percentuais: Record<TemperamentoCodigo, number>;
  respostas?: Record<string, RespostaSimNao>;
  usar: boolean;
}): CartaoConversa[] {
  const respostas = opts.respostas;
  const usar = opts.usar;
  const marcadas = cenasDe(["SANGUINEO", "COLERICO", "MELANCOLICO", "FLEUMATICO"], respostas, usar);
  const ordem = ordenar(opts.percentuais);
  const terceiro = ordem[2] ?? "MELANCOLICO";
  const quarto = ordem[3] ?? "FLEUMATICO";
  const fato = ORDEM.SANGUINEO_COLERICO;
  const reconhece = (id: CodigoItem) => marcadas.some((cena) => cena.id === id);
  const doAlvo = (codigo: TemperamentoCodigo) => textos(cenasDe([codigo], respostas, usar), "reconhecer", 3);

  const primeiro = [
    "O sanguíneo é a característica mais presente nas suas respostas.",
    ...(usar ? doAlvo("SANGUINEO") : ["Pelo conjunto, você se aproxima pelas pessoas e pela conversa."]),
  ];

  const menor = (codigo: TemperamentoCodigo, lugar: "terceira" | "quarta") => {
    const nome = NOME[codigo];
    const cenas = doAlvo(codigo);
    const titulo = `O ${nome} aparece como uma ${lugar} tendência nas suas respostas.`;
    if (!usar) return [titulo];
    if (cenas.length === 0) {
      return [titulo, "Nas perguntas desse temperamento, você não marcou um comportamento para destacar."];
    }
    return [titulo, ...cenas];
  };

  const relacoes = [fato.relacao];
  if (reconhece("E03")) relacoes.push("Em casa, você conta o que sentiu e já segue em frente. A outra pessoa ainda está naquele assunto.");
  if (reconhece("E08")) relacoes.push("Em casa, você cobra na hora quando alguém atrasa o combinado. A outra pessoa para de contar o que sentia.");

  const atrapalhos: string[] = [];
  if (!usar) {
    atrapalhos.push("O aperto desta combinação, quando aparece, é a conversa que vira tarefa. Sem uma resposta que marque a cena, isso fica como possibilidade.");
  } else if (reconhece("E06")) {
    atrapalhos.push("A intenção é aproveitar o ânimo enquanto ele está alto. Diante da demora, você toma a iniciativa e busca uma solução. A outra pessoa perde o lugar de pensar junto.");
  } else if (reconhece("E04")) {
    atrapalhos.push("Você conta a história e a outra pessoa quase não entra. A conversa termina sem a opinião dela.");
  }
  for (const cena of marcadas) {
    if (cena.alvo === "SANGUINEO" || cena.alvo === "COLERICO") continue;
    if (cena.atrapalha && !atrapalhos.includes(cena.atrapalha)) atrapalhos.push(cena.atrapalha);
  }
  if (usar && atrapalhos.length === 0) atrapalhos.push("Nenhuma cena de aperto ficou marcada nas suas respostas.");

  return [
    { id: "antes", titulo: "Sobre o seu resultado", paragrafos: ABERTURA, perguntas: [], passos: [] },
    {
      id: "jeitos",
      titulo: "Os quatro temperamentos",
      paragrafos: [
        "Existem quatro temperamentos clássicos. Cada um representa um conjunto de características e maneiras de funcionar. Uma pessoa pode apresentar características de mais de um, em diferentes intensidades.",
        EXPLICACAO.SANGUINEO,
        EXPLICACAO.COLERICO,
        EXPLICACAO.MELANCOLICO,
        EXPLICACAO.FLEUMATICO,
      ],
      perguntas: [],
      passos: [],
    },
    {
      id: "primeiro",
      titulo: "Seu temperamento predominante",
      paragrafos: primeiro,
      perguntas: [PERGUNTA_JEITO.SANGUINEO],
      passos: [],
    },
    { id: "depois", titulo: "Características secundárias", paragrafos: [fato.depois], perguntas: [], passos: [] },
    {
      id: "encontro",
      titulo: "Como essas tendências se combinam",
      paragrafos: [fato.encontro, fato.descoberta],
      perguntas: [fato.pergunta],
      passos: [],
    },
    {
      id: "tambem",
      titulo: "O que também aparece em você",
      paragrafos: [...menor(terceiro, "terceira"), ...menor(quarto, "quarta")],
      perguntas: [],
      passos: [],
    },
    {
      id: "aproveitar",
      titulo: "Suas tendências comportamentais",
      paragrafos: [
        "A força desta combinação é esta: você junta as pessoas e, logo depois, coloca a ideia para andar. Você não fica só na conversa, e também não chega só cobrando.",
      ],
      perguntas: [],
      passos: [],
    },
    { id: "relacoes", titulo: "Nos relacionamentos", paragrafos: relacoes, perguntas: [], passos: [] },
    { id: "trabalho", titulo: "No trabalho", paragrafos: [fato.trabalho], perguntas: [], passos: [] },
    { id: "atrapalha", titulo: "Quando essas tendências atrapalham", paragrafos: atrapalhos, perguntas: [], passos: [] },
    {
      id: "semana",
      titulo: "Para observar nesta semana",
      paragrafos: ["Nesta semana, observe como você reage e experimente uma atitude diferente."],
      perguntas: [],
      passos: [...fato.passos],
    },
    {
      id: "fica",
      titulo: "Para o seu autoconhecimento",
      paragrafos: [fato.fechamento],
      perguntas: [PERGUNTA_FECHO.SANGUINEO_COLERICO],
      passos: [],
    },
  ];
}

export function montarLeituraConversa(opts: {
  primario: TemperamentoCodigo;
  secundario: TemperamentoCodigo;
  percentuais: Record<TemperamentoCodigo, number>;
  respostas?: Record<string, RespostaSimNao>;
  questionarioClaro?: boolean;
}): CartaoConversa[] {
  const ordem = ordenar(opts.percentuais);
  const primario = ordem[0] ?? opts.primario;
  const secundario = ordem[1] && ordem[1] !== primario ? ordem[1] : opts.secundario;
  const resto = ordem.filter((codigo) => codigo !== primario && codigo !== secundario);
  const terceiro = resto[0] ?? "FLEUMATICO";
  const quarto = resto[1] ?? "MELANCOLICO";
  const fato = ORDEM[chave(primario, secundario)] ?? ORDEM[chave(secundario, primario)] ?? ORDEM.SANGUINEO_FLEUMATICO;
  const usar = opts.questionarioClaro === true && !!opts.respostas;
  const respostas = opts.respostas;
  if (primario === "SANGUINEO" && secundario === "COLERICO") {
    return montarSanguineoColerico({ percentuais: opts.percentuais, respostas, usar });
  }
  const doPrimeiro = cenasDe([primario], respostas, usar);
  const todas = cenasDe([primario, secundario, terceiro, quarto], respostas, usar);
  const aviso = usar ? [] : [AVISO_ANTIGO];

  const atrapalhos = usar ? textos(todas, "atrapalha", 3) : [...fato.atrapalhos];
  const cenasAtrapalho = usar ? todas.filter((cena) => cena.atrapalha && atrapalhos.includes(cena.atrapalha)) : [];
  const experimentos = unicos(
    [...cenasAtrapalho.map((cena) => cena.experimento), ...fato.passos],
    3,
  );

  const facilidades = usar
    ? textos(todas, "facilidade", 3)
    : [FACILIDADE[primario], FACILIDADE[secundario]];
  const relacoes = usar ? textos(todas, "relacao", 3) : [fato.relacao];
  const trabalhos = usar ? textos(todas, "trabalho", 3) : [fato.trabalho];
  const fecho = PERGUNTA_FECHO[chave(primario, secundario)] ?? PERGUNTA_FECHO.SANGUINEO_FLEUMATICO;

  return [
    { id: "antes", titulo: "Sobre o seu resultado", paragrafos: ABERTURA, perguntas: [], passos: [] },
    {
      id: "jeitos",
      titulo: "Os quatro temperamentos",
      paragrafos: [
        "Existem quatro temperamentos clássicos. Cada um representa um conjunto de características e maneiras de funcionar. Uma pessoa pode apresentar características de mais de um, em diferentes intensidades.",
        EXPLICACAO.SANGUINEO,
        EXPLICACAO.COLERICO,
        EXPLICACAO.MELANCOLICO,
        EXPLICACAO.FLEUMATICO,
      ],
      perguntas: [],
      passos: [],
    },
    {
      id: "primeiro",
      titulo: "Seu temperamento predominante",
      paragrafos: [
        `O temperamento que mais apareceu nas suas respostas é o ${NOME[primario]}. ${INTRO[primario]}`,
        ...aviso,
        ...textos(doPrimeiro, "reconhecer", 3),
      ],
      perguntas: [PERGUNTA_JEITO[primario]],
      passos: [],
    },
    {
      id: "depois",
      titulo: "Características secundárias",
      paragrafos: [fato.depois],
      perguntas: [],
      passos: [],
    },
    {
      id: "encontro",
      titulo: "Como essas tendências se combinam",
      paragrafos: [fato.encontro, fato.descoberta],
      perguntas: [fato.pergunta],
      passos: [],
    },
    {
      id: "tambem",
      titulo: "O que também aparece em você",
      paragrafos: [...blocoMenor(terceiro, respostas, usar), ...blocoMenor(quarto, respostas, usar)],
      perguntas: [],
      passos: [],
    },
    {
      id: "aproveitar",
      titulo: "Suas tendências comportamentais",
      paragrafos: facilidades.length
        ? facilidades
        : ["As suas respostas não marcaram uma tendência específica para destacar nesta semana."],
      perguntas: [],
      passos: [],
    },
    {
      id: "relacoes",
      titulo: "Nos relacionamentos",
      paragrafos: relacoes.length
        ? relacoes
        : ["Nas suas respostas, não apareceu uma cena de relacionamento para destacar."],
      perguntas: [],
      passos: [],
    },
    {
      id: "trabalho",
      titulo: "No trabalho",
      paragrafos: trabalhos.length ? trabalhos : ["Nas suas respostas, não apareceu uma cena de trabalho para destacar."],
      perguntas: [],
      passos: [],
    },
    {
      id: "atrapalha",
      titulo: "Quando essas tendências atrapalham",
      paragrafos: atrapalhos.length
        ? atrapalhos
        : ["Nenhuma cena de aperto ficou marcada nas suas respostas."],
      perguntas: [],
      passos: [],
    },
    {
      id: "semana",
      titulo: "Para observar nesta semana",
      paragrafos: [
        "Não é preciso acertar sempre. O convite é observar o que acontece e experimentar outro caminho, uma vez.",
      ],
      perguntas: [],
      passos: experimentos,
    },
    {
      id: "fica",
      titulo: "Para o seu autoconhecimento",
      paragrafos: [fato.fechamento, FECHO_COMUM],
      perguntas: [fecho],
      passos: [],
    },
  ];
}
