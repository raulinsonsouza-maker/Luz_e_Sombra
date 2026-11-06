import type { TemperamentoCodigo } from "./types";
import { TEMPERAMENTOS } from "./types";

interface FatoJeito {
  chega: string;
  precisa: string;
  custo: string;
  pressao: string;
}

interface FatoOrdem {
  depois: string;
  passos: [string, string, string];
  pergunta: string;
}

const JEITO: Record<TemperamentoCodigo, FatoJeito> = {
  SANGUINEO: {
    chega: "Você começa falando com as pessoas. A conversa anda e quem estava quieto acaba falando também.",
    precisa: "Você precisa que as pessoas gostem de estar com você.",
    custo: "No trabalho, você aceita uma conversa nova. A entrega que já estava combinada fica para depois.",
    pressao: "Se isso continua, você promete mais tarefas e deixa o que é difícil sem fazer.",
  },
  COLERICO: {
    chega: "Você começa pela tarefa. Se ninguém decide, você decide.",
    precisa: "Você precisa ver a tarefa sair do lugar.",
    custo: "Numa conversa em casa, você pede uma resposta rápida. A outra pessoa para de contar o que sentia.",
    pressao: "Se isso continua, você acelera e trata a opinião dos outros como atraso.",
  },
  MELANCOLICO: {
    chega: "Você começa olhando o que pode dar errado. Você pergunta o motivo antes de aceitar.",
    precisa: "Você precisa ver a tarefa feita do jeito certo.",
    custo: "Você segura uma entrega porque ainda vê um detalhe. O prazo passa.",
    pressao: "Se isso continua, você para e se cobra por um erro pequeno.",
  },
  FLEUMATICO: {
    chega: "Você começa calado e espera os outros falarem. Você evita discussão.",
    precisa: "Você precisa que o ambiente fique calmo.",
    custo: "Você concorda numa reunião para não discutir. O combinado fica errado e você não corrige.",
    pressao: "Se isso continua, você adia a resposta e chama isso de paciência.",
  },
};

const ORDEM: Record<string, FatoOrdem> = {
  SANGUINEO_COLERICO: {
    depois:
      "Você começa a conversa de um jeito leve. As pessoas falam com você. Pouco depois, você pede uma decisão. Quem estava só conversando passa a sentir que precisa entregar alguma coisa.",
    passos: [
      "Nesta semana, termine uma tarefa que você começou numa conversa.",
      "Antes de pedir uma decisão, deixe a pessoa terminar de falar.",
      "Se a frase sair dura, volte no mesmo dia e explique o que você quis dizer.",
    ],
    pergunta: "Em qual conversa desta semana eu pedi uma decisão cedo demais?",
  },
  SANGUINEO_MELANCOLICO: {
    depois:
      "Você chega sorrindo e puxa assunto. Depois, uma crítica fica na sua cabeça, mesmo quando a conversa já acabou bem.",
    passos: [
      "Conte a uma pessoa o que te incomodou, sem transformar isso em piada.",
      "Defina o que está pronto antes de prometer uma entrega caprichada.",
      "Se você revisar a mesma crítica por mais de uma hora, pare e anote uma frase só.",
    ],
    pergunta: "O que me incomodou e eu ainda não falei?",
  },
  SANGUINEO_FLEUMATICO: {
    depois:
      "Você anima a conversa e ajuda quem está perto. Quando o assunto fica difícil, você muda de tema para ninguém discutir.",
    passos: [
      "Diga não a um pedido que não é seu, em uma frase.",
      "Marque um horário para a tarefa sem graça que você empurra.",
      "Traga o assunto difícil no mesmo dia, antes de ele virar silêncio.",
    ],
    pergunta: "Onde eu mudei de assunto para não falar o que precisava?",
  },
  COLERICO_SANGUINEO: {
    depois:
      "Você já entra querendo resolver. Você fala de um jeito agradável para as pessoas aceitarem o que você decidiu.",
    passos: [
      "Antes da próxima decisão, faça uma pergunta e espere a resposta inteira.",
      "Separe o que é urgente do que só está alto na sua lista. Risque um dos dois.",
      "Diga um acerto de outra pessoa sem emendar a correção na mesma frase.",
    ],
    pergunta: "Quem eu tratei como meio para a minha tarefa nesta semana?",
  },
  COLERICO_MELANCOLICO: {
    depois:
      "Você quer resolver agora. Antes de fechar, você confere o detalhe. A decisão sai mais tarde e mais dura.",
    passos: [
      "Escreva o que é suficiente antes de começar. Quando chegar lá, entregue.",
      "Corrija uma coisa por conversa. Deixe o resto para outro dia.",
      "Diga um acerto que você teria pulado.",
    ],
    pergunta: "O que eu ainda não entreguei porque ainda não está do meu jeito?",
  },
  COLERICO_FLEUMATICO: {
    depois:
      "Você organiza a tarefa e segue até o fim. Você não discute na hora. Depois cobra, quando o atraso já ficou grande.",
    passos: [
      "Diga o incômodo no dia em que ele aparecer, em uma frase.",
      "Tome uma decisão que você está segurando para não discutir.",
      "Pergunte se o seu silêncio foi entendido como acordo.",
    ],
    pergunta: "O que eu vou cobrar tarde se eu não disser hoje?",
  },
  MELANCOLICO_SANGUINEO: {
    depois:
      "Você pensa antes de falar. Quando confia, explica de um jeito que as pessoas entendem. Se a conversa fica longa, você sai e não avisa.",
    passos: [
      "Avise quando for sair: preciso de um tempo e eu volto.",
      "Prometa menos do que a conversa te empolgou a prometer.",
      "Mostre o trabalho no meio, antes de ele estar impecável.",
    ],
    pergunta: "O que eu escondo quando estou de bom humor?",
  },
  MELANCOLICO_COLERICO: {
    depois:
      "Você estuda o problema antes de agir. Quando decide, cobra a mudança. Quem esperou ouve a crítica junto com a pressa.",
    passos: [
      "Diga se você ainda está olhando ou se já decidiu.",
      "Fale o incômodo na primeira vez, antes de juntar todos os argumentos.",
      "Solte um detalhe hoje. O resto pode continuar caprichado.",
    ],
    pergunta: "O que eu já entendi e ainda não deixei acontecer?",
  },
  MELANCOLICO_FLEUMATICO: {
    depois:
      "Você vê o erro e não fala na hora. Concorda na frente dos outros e continua pensando nisso sozinho.",
    passos: [
      "Diga uma preocupação pequena no mesmo dia em que ela aparecer.",
      "Marque o que é suficiente neste trabalho e pare quando chegar lá.",
      "Peça uma ajuda concreta, em vez de carregar a tarefa sozinho.",
    ],
    pergunta: "O que eu concordei na frente dos outros e continuei pensando depois?",
  },
  FLEUMATICO_SANGUINEO: {
    depois:
      "Você escuta até o fim e deixa a conversa boa. Você não traz o assunto que te incomoda.",
    passos: [
      "Traga um assunto seu numa conversa em que você só escutaria.",
      "Marque a conversa adiada e faça em vinte minutos.",
      "Recuse um favor que te atrapalha, em uma frase.",
    ],
    pergunta: "Onde eu deixei a conversa boa para não falar o que me incomoda?",
  },
  FLEUMATICO_COLERICO: {
    depois:
      "Você espera e não discute. Quando a tarefa para, você decide e cobra de uma vez.",
    passos: [
      "Avise no meio, antes da cobrança ficar grande.",
      "Tome uma decisão pequena que você está mediando há dias.",
      "Pergunte se o seu silêncio foi lido como acordo.",
    ],
    pergunta: "O que eu vou cobrar de uma vez se eu não disser hoje?",
  },
  FLEUMATICO_MELANCOLICO: {
    depois:
      "Você mantém a rotina e evita briga. Quando algo fica mal feito, você guarda o incômodo e não pede a mudança.",
    passos: [
      "Peça uma mudança em uma coisa só, no mesmo dia.",
      "Pare a revisão da noite num horário marcado.",
      "Diga o que não ficou bom, em uma frase, sem pedir desculpa por dizer.",
    ],
    pergunta: "O que não ficou bom e eu ainda não pedi para mudar?",
  },
};

const DISPUTA =
  "Em alguns dias você faz o contrário disso. As pessoas não sabem o que esperar de você.";

export interface LeituraDaCombinacao {
  chega: string;
  precisa: string;
  depois: string;
  disputa?: string;
  atrapalha: string;
  pressao: string;
  passos: [string, string, string];
  pergunta: string;
}

function ordenar(percentuais: Record<TemperamentoCodigo, number>): TemperamentoCodigo[] {
  return [...TEMPERAMENTOS].sort((a, b) => (percentuais[b] ?? 0) - (percentuais[a] ?? 0));
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
  const primario = ordem[0] ?? opts.primario;
  const secundario = ordem[1] && ordem[1] !== primario ? ordem[1] : opts.secundario;
  const terceiro =
    ordem.find((codigo) => codigo !== primario && codigo !== secundario) ?? "FLEUMATICO";
  const fato = JEITO[primario];
  const cruzamento = ORDEM[chave(primario, secundario)] ?? ORDEM[chave(secundario, primario)] ?? ORDEM.SANGUINEO_FLEUMATICO;
  const menor = JEITO[terceiro];
  const perto = (opts.percentuais[secundario] ?? 0) - (opts.percentuais[terceiro] ?? 0) <= 8;

  return {
    chega: fato.chega,
    precisa: fato.precisa,
    depois: cruzamento.depois,
    disputa: perto ? DISPUTA : undefined,
    atrapalha: menor.custo,
    pressao: menor.pressao,
    passos: cruzamento.passos,
    pergunta: cruzamento.pergunta,
  };
}
