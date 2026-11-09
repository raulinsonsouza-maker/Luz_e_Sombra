import { NUMEROS_DE_VIDA } from "@/lib/numerologia-data";
import { raizDoMestre } from "@/lib/numerologia/energiaNumerologica";

export type SinteseTriangulo = {
  titulo: string;
  leitura: string;
  alinhamento: string;
  tensao: string;
  foco: string;
  chips: { label: string; valor: string }[];
};

export type SinteseAno = {
  titulo: string;
  leitura: string;
  amplifica: string;
  cuidado: string;
  gesto: string;
};

const TOM: Record<number, string> = {
  1: "iniciar, liderar e abrir caminho",
  2: "unir, ouvir e criar parceria",
  3: "expressar, criar e comunicar",
  4: "estruturar, construir e sustentar",
  5: "mudar, explorar e liberar",
  6: "cuidar, responsabilizar e nutrir",
  7: "investigar, aprofundar e buscar sentido",
  8: "realizar, organizar poder e materializar",
  9: "concluir, servir e soltar",
  11: "inspirar, intuir e canalizar visão",
  22: "construir em grande escala e deixar legado",
  33: "curar, ensinar e servir com amor",
};

function nomeDe(n: number): string {
  return NUMEROS_DE_VIDA[n]?.arquetipo ?? `número ${n}`;
}

function tomDe(n: number): string {
  return TOM[n] ?? TOM[raizDoMestre(n)] ?? "encontrar o próprio ritmo";
}

function mesmaRaiz(a: number, b: number): boolean {
  return a === b || raizDoMestre(a) === raizDoMestre(b);
}

/** Cruza Caminho × Expressão × Alma em uma leitura útil (não genérica). */
export function sinteseTriangulo(
  vida: number,
  expressao: number,
  alma: number,
  personalidade?: number | null,
): SinteseTriangulo {
  const vNome = nomeDe(vida);
  const eNome = nomeDe(expressao);
  const aNome = nomeDe(alma);
  const pNome = personalidade ? nomeDe(personalidade) : null;

  const vidaExprAlinhados = mesmaRaiz(vida, expressao);
  const vidaAlmaAlinhados = mesmaRaiz(vida, alma);
  const exprAlmaAlinhados = mesmaRaiz(expressao, alma);
  const todosIguais = vidaExprAlinhados && vidaAlmaAlinhados;

  let alinhamento: string;
  let tensao: string;
  let foco: string;
  let leitura: string;
  let titulo: string;

  if (todosIguais) {
    titulo = "Uma vibração dominante";
    leitura = `Seu Caminho, sua Expressão e sua Alma orbitam a mesma frequência (${vNome}). Isso concentra força: o mundo tende a te reconhecer no que você realmente é. O risco é virar monotema — usar só esse talento e deixar outras partes da vida sem cultivo.`;
    alinhamento = `Tudo em você puxa para ${tomDe(vida)}. Quando age assim, a vida responde mais rápido.`;
    tensao = `A repetição pode virar prisão. Se tudo passa pelo mesmo filtro, você perde nuance e cansa quem convive com você.`;
    foco = `Use a força do ${vida}, mas pratique um contraste pequeno: ouvir antes de agir, ou estruturar antes de expandir — o oposto do seu automático.`;
  } else if (vidaExprAlinhados && !vidaAlmaAlinhados) {
    titulo = "O mundo te vê, a alma pede outra coisa";
    leitura = `Caminho e Expressão (${vNome} / ${eNome}) andam juntos: você aparece no mundo alinhado à sua missão. A Alma (${aNome}), porém, deseja ${tomDe(alma)}. Parte da frustração vem daí — entregar o que funciona e sentir fome do que alimenta por dentro.`;
    alinhamento = `Sua forma de agir já comunica quem você é. Isso facilita carreira, presença e reconhecimento.`;
    tensao = `O desejo íntimo (${aNome}) pode ficar em segundo plano enquanto você performa o que “funciona”.`;
    foco = `Reserve um espaço semanal só para o que a Alma pede (${tomDe(alma)}), sem cobrança de resultado.`;
  } else if (vidaAlmaAlinhados && !vidaExprAlinhados) {
    titulo = "Por dentro alinhado, por fora em construção";
    leitura = `Caminho e Alma (${vNome} / ${aNome}) falam a mesma língua: você sabe, no fundo, para onde vai. A Expressão (${eNome}) mostra outra face — ${tomDe(expressao)}. O desafio é traduzir a essência em gestos que o mundo entenda sem você se trair.`;
    alinhamento = `Sua bússola interna está clara. Quando escuta ${tomDe(vida)}, a direção volta.`;
    tensao = `A forma como você se apresenta (${eNome}) pode parecer deslocada daquilo que sente.`;
    foco = `Pratique uma expressão pequena e honesta desta semana: um texto, uma conversa ou um projeto que una ${vNome} com ${eNome}.`;
  } else if (exprAlmaAlinhados && !vidaExprAlinhados) {
    titulo = "Desejo e expressão unidos, missão em tensão";
    leitura = `Expressão e Alma (${eNome} / ${aNome}) se reforçam: o que você mostra e o que deseja caminham juntos. O Caminho de Vida (${vNome}) pede ${tomDe(vida)} — e pode parecer mais lento, mais seco ou mais exigente do que o prazer imediato.`;
    alinhamento = `Quando segue o desejo, a expressão flui. Há autenticidade natural nesse eixo.`;
    tensao = `A missão maior (${vNome}) pode ser adiada porque o prazer de ${tomDe(expressao)} é mais imediato.`;
    foco = `Escolha um compromisso concreto com o Caminho ${vida} neste mês — algo mensurável, mesmo pequeno.`;
  } else {
    titulo = "Três vozes distintas";
    leitura = `Seu mapa não é monocórdico: Caminho ${vida} (${vNome}), Expressão ${expressao} (${eNome}) e Alma ${alma} (${aNome}) pedem movimentos diferentes. A maturidade aqui não é “escolher um”, é saber qual voz comanda cada situação.`;
    alinhamento = `Você tem repertório. Em contextos distintos, pode ${tomDe(vida)}, ${tomDe(expressao)} ou ${tomDe(alma)}.`;
    tensao = `Sem hierarquia, as três vozes competem e você parece inconsistente para si mesmo.`;
    foco = `Defina uma regra simples: missão decide o rumo (${vNome}), expressão decide o estilo (${eNome}), alma decide o combustível (${aNome}).`;
  }

  if (pNome && personalidade) {
    const mascaraAlinhada = mesmaRaiz(personalidade, vida) || mesmaRaiz(personalidade, expressao);
    leitura += mascaraAlinhada
      ? ` A Personalidade (${pNome}) reforça a imagem que o mundo já captura de você.`
      : ` A Personalidade (${pNome}) adiciona uma camada social distinta — os outros podem te ler primeiro por ${tomDe(personalidade)}, antes de perceber o Caminho.`;
  }

  return {
    titulo,
    leitura,
    alinhamento,
    tensao,
    foco,
    chips: [
      { label: "Caminho", valor: `${vida} · ${vNome}` },
      { label: "Expressão", valor: `${expressao} · ${eNome}` },
      { label: "Alma", valor: `${alma} · ${aNome}` },
      ...(personalidade
        ? [{ label: "Personalidade", valor: `${personalidade} · ${pNome}` }]
        : []),
    ],
  };
}

/** Cruza Caminho de Vida × Ano Pessoal × Ano Universal. */
export function sinteseCaminhoAno(
  vida: number,
  anoPessoal: number,
  anoUniversal: number,
  anoCivil: number,
): SinteseAno {
  const vNome = nomeDe(vida);
  const apNome = nomeDe(anoPessoal);
  const auNome = nomeDe(anoUniversal);

  const reforca = mesmaRaiz(vida, anoPessoal);
  const coletivoPuxa = mesmaRaiz(vida, anoUniversal);
  const anoEmTensao = !reforca && raizDoMestre(vida) !== raizDoMestre(anoPessoal);

  let titulo: string;
  let leitura: string;
  let amplifica: string;
  let cuidado: string;
  let gesto: string;

  if (reforca && coletivoPuxa) {
    titulo = `Um ano de eco forte para o ${vNome}`;
    leitura = `Em ${anoCivil}, seu Ano Pessoal (${anoPessoal} · ${apNome}) e o clima Universal (${anoUniversal} · ${auNome}) reforçam o Caminho ${vida}. Poucas fases pedem tanto que você ocupe o centro da própria missão.`;
    amplifica = `Tudo que tem a ver com ${tomDe(vida)} ganha vento a favor.`;
    cuidado = `Excesso de confirmação externa pode inflar o ego ou acelerar demais.`;
    gesto = `Escolha um projeto-assinatura deste ano e leve até um marco concreto antes de dezembro.`;
  } else if (reforca) {
    titulo = `Ano Pessoal a favor do seu Caminho`;
    leitura = `O Ano Pessoal ${anoPessoal} (${apNome}) conversa de perto com o Caminho ${vida} (${vNome}). Mesmo com o Universal em ${anoUniversal} (${auNome}), a chave está no seu ciclo pessoal: ${tomDe(anoPessoal)}.`;
    amplifica = `Sua natureza (${vNome}) encontra terreno fértil para avançar.`;
    cuidado = `Não espere que o clima coletivo diga o mesmo — o reforço é interno/pessoal.`;
    gesto = `Traduza ${tomDe(vida)} em uma meta mensurável para os próximos 90 dias.`;
  } else if (coletivoPuxa) {
    titulo = `O coletivo ecoa sua missão; o pessoal pede outro passo`;
    leitura = `O Ano Universal ${anoUniversal} (${auNome}) ressoa com o Caminho ${vida}, mas o Ano Pessoal ${anoPessoal} (${apNome}) pede ${tomDe(anoPessoal)}. Há oportunidade externa e um dever de casa interno diferente.`;
    amplifica = `Portas coletivas ligadas a ${tomDe(vida)} podem abrir.`;
    cuidado = `Não ignore o ciclo pessoal: forçar só a missão sem ${tomDe(anoPessoal)} gera atrito.`;
    gesto = `Use as oportunidades do Universal, mas organize a semana em torno do pedido do Ano Pessoal.`;
  } else if (anoEmTensao) {
    titulo = `Ciclo de atrito criativo`;
    leitura = `Em ${anoCivil}, o Caminho ${vida} (${vNome}) encontra um Ano Pessoal ${anoPessoal} (${apNome}) com outra lógica. Não é bloqueio: é treino. O ano pede ${tomDe(anoPessoal)} enquanto sua natureza prefere ${tomDe(vida)}.`;
    amplifica = `Você aprende flexibilidade sem abandonar a missão.`;
    cuidado = `Insistir só no automático do Caminho gera frustração; render-se só ao ano gera culpa.`;
    gesto = `Combine os dois: um gesto semanal de ${tomDe(vida)} e um gesto semanal de ${tomDe(anoPessoal)}.`;
  } else {
    titulo = `Integração entre missão e ciclo`;
    leitura = `Caminho ${vida} (${vNome}), Ano Pessoal ${anoPessoal} (${apNome}) e Universal ${anoUniversal} (${auNome}) formam um mosaico. A pergunta útil não é “qual está certo?”, e sim “qual decide agora?”.`;
    amplifica = `Há margem para ajustar o ritmo sem perder identidade.`;
    cuidado = `Ficar parado esperando clareza total atrasa os três ciclos.`;
    gesto = `Escolha uma área da vida e aplique, nesta semana, a energia do Ano Pessoal sobre um tema do seu Caminho.`;
  }

  return { titulo, leitura, amplifica, cuidado, gesto };
}
