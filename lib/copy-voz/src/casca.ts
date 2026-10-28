import { MARCA } from "./marca.js";

/**
 * Casca do portal: landing, passos, FAQ e frases dos e-mails.
 * Preços e links continuam no app. Aqui fica só o que a pessoa lê.
 */
export const CASCA = {
  lp: {
    hero: {
      badge: "Trilha guiada de autoconhecimento",
      headlineLine1: "Jornada",
      headlineLine2: "Da Sombra",
      headlineAccent: "à Luz",
      bullets: [
        "A leitura é sua, não um texto genérico",
        "A trilha vai passo a passo",
        "A primeira leitura cabe em cerca de 15 minutos",
      ],
      priceTeaser: "A partir de R$ 57,90 · pagamento único",
    },
    vslCopy: {
      navCta: "Começar jornada",
      headline: "Veja como a Jornada Da Sombra à Luz conecta suas análises.",
      subheadline:
        "Assista ao vídeo e entenda como traço, temperamento, relações e 12 áreas da vida se cruzam numa trilha guiada, com clareza prática em minutos.",
      gateTitle: "A oferta aparece em instantes",
      gateDesc:
        "Continue assistindo. Em poucos segundos você vê o que está incluso na jornada e como abrir seu acesso hoje.",
      unlockHint: "Pronto. Role e veja tudo que você recebe",
      playerLocked: "Assista para liberar a oferta completa",
      playerProgressMais: "Assista mais {percent}% do vídeo para liberar",
      playerProgressZero: "Desbloqueando...",
    },
    vsl: {
      modules: {
        eyebrow: "Etapas da jornada",
        title: "9 análises integradas.",
        titleAccent: "Um mapa de quem você é.",
        subtitle: `Cada etapa responde uma pergunta diferente. Juntas, elas formam a ${MARCA.jornada} no ${MARCA.portal}.`,
      },
      howItWorks: {
        eyebrow: "Como começar",
        title: "Três passos. Sem complicação.",
        steps: [
          {
            step: "01",
            title: "Assista o método",
            desc: "O vídeo mostra como as análises se conectam na jornada, e por que isso ajuda quando outras abordagens não chegaram.",
          },
          {
            step: "02",
            title: "Ative sua jornada",
            desc: "R$ 57,90 à vista ou 3x de R$ 21,19 no cartão. Pagamento seguro e acesso no Portal Iluminando depois da confirmação.",
          },
          {
            step: "03",
            title: "Faça sua primeira análise",
            desc: "Em cerca de 15 minutos você já tem uma leitura sua na trilha. Sem julgamento, no seu ritmo.",
          },
        ],
      },
      testimonials: {
        eyebrow: "Quem já saiu do automático",
        title: "Clareza que aparece rápido",
      },
      offer: {
        eyebrow: "Para quem assistiu até aqui",
        title: MARCA.jornada,
        titleAccent: "no Portal Iluminando",
        subtitle: "Pagamento único. 7 dias de garantia total.",
        footnote: "PIX ou cartão · Acesso após confirmação · Garantia de 7 dias",
      },
      finalCta: {
        title: "Da próxima vez que você se perguntar",
        titleAccent: "por que repito isso?",
        body: "Você já terá um mapa na jornada, não só mais uma dúvida. A escolha é sua.",
      },
      faq: {
        eyebrow: "Ainda com dúvida?",
        title: "Respostas diretas",
      },
    },
    controle: {
      modules: {
        eyebrow: "Etapas da jornada",
        title: "9 análises que se conectam",
        titleAccent: "numa trilha guiada.",
        subtitle: "Cada etapa ilumina uma parte de quem você é. Todas te levam da sombra à luz.",
      },
      howItWorks: {
        eyebrow: "Como funciona",
        title: "Cadastre-se, percorra,",
        titleAccent: "e siga.",
        steps: [
          {
            step: "01",
            title: "Garanta sua jornada",
            desc: "Cadastro rápido e pagamento seguro. Acesso ao Portal Iluminando depois da confirmação.",
          },
          {
            step: "02",
            title: "Percorra as análises",
            desc: "Traço, temperamento, roda da vida e mais, na ordem da trilha, no seu ritmo.",
          },
          {
            step: "03",
            title: "Ganhe clareza integrada",
            desc: "Cada resultado conversa com o próximo. Em minutos você vê padrões que antes pareciam soltos.",
          },
        ],
      },
      testimonials: {
        eyebrow: "Quem já passou por aqui",
        title: "Resultados reais",
      },
      offer: {
        eyebrow: "O que você está comprando",
        title: MARCA.jornada,
        titleAccent: "",
        subtitle: `Pagamento único · Acesso no ${MARCA.portal} após confirmação do pagamento.`,
        footnote: "PIX ou cartão · Acesso após pagamento · Garantia de 7 dias",
      },
      finalCta: {
        title: "Sua jornada da sombra à luz",
        titleAccent: "começa com uma escolha",
        body: "Nove análises integradas esperando por você. Cada passo é consciência, no seu tempo.",
      },
      faq: {
        eyebrow: "Perguntas frequentes",
        title: "Tire suas dúvidas",
      },
    },
    modulos: [
      {
        title: "Traço de Caráter",
        desc: "O que o seu corpo mostra sobre padrões que você repete, lido nas fotos.",
      },
      {
        title: "Temperamento",
        desc: "Por que você reage e se relaciona do jeito que reage, e o que muda quando você entende isso.",
      },
      {
        title: "Linguagens do Amor",
        desc: "Como você pede e demonstra afeto, e por que certas relações não fluem do seu jeito.",
      },
      {
        title: "Roda da Vida",
        desc: "Um raio-x de 12 áreas: onde está sua energia, onde você se sabota e o que pede atenção agora.",
      },
      {
        title: "Numerologia",
        desc: "Missão, talentos e ciclos da sua data de nascimento, em reflexão e em um passo concreto.",
      },
      {
        title: "Trilha gamificada",
        desc: "A jornada guiada com pontos e missões diárias. Constância sem peso, um passo de cada vez.",
      },
      {
        title: "Aprofundamentos",
        desc: "Conteúdos da trilha para ir mais fundo em cada etapa, no momento certo (em breve).",
      },
      {
        title: "Comunidade",
        desc: "Pessoas na mesma fase. Você não caminha sozinho.",
      },
      {
        title: "Dossiê de Vida",
        desc: "O cruzamento das análises: como você funciona, onde trava e o que priorizar.",
      },
    ],
    depoimentos: [
      {
        name: "Mariana S.",
        role: "Empreendedora, 34 anos",
        text: "Em uma semana vi onde estava me sabotando: trabalho, relações, energia. Pela primeira vez não foi achismo. A Roda mostrou, com números e leitura, algo que doía de tão certo.",
      },
      {
        name: "Ricardo L.",
        role: "Profissional de TI, 41 anos",
        text: "Sempre achei autoconhecimento floreado. O Traço de Caráter me pegou: a leitura do corpo bateu com o que eu sinto no dia a dia. Isso não tinha acontecido antes.",
      },
      {
        name: "Camila F.",
        role: "Psicóloga, 29 anos",
        text: "Indico como complemento. O que mais impressiona é a integração: temperamento, linguagens do amor, roda, tudo conversando. E a jornada com missões mantém a pessoa no caminho.",
      },
    ],
    faq: [
      {
        q: "O que exatamente estou comprando?",
        a: `A ${MARCA.jornada}: uma trilha com 9 análises integradas no ${MARCA.portal}. Não são ferramentas soltas. É um percurso guiado da sombra à luz.`,
      },
      {
        q: "Preciso entender de numerologia ou de leitura corporal?",
        a: "Não. A jornada guia cada passo com perguntas claras e a leitura pronta. Você responde com honestidade. O resto a gente organiza para você.",
      },
      {
        q: "Como recebo o acesso depois de comprar?",
        a: "Assim que o pagamento for confirmado (PIX ou cartão), você entra na plataforma com o e-mail e a senha que cadastrou.",
      },
      {
        q: "Posso parcelar?",
        a: "Sim. No cartão você pode pagar em até {parcelas}x de {parcela} ou {avista} à vista.",
      },
      {
        q: "Quanto tempo até eu ver algo concreto?",
        a: "A primeira leitura leva cerca de 15 minutos. A maioria das pessoas sente clareza já na primeira sessão, especialmente na Roda da Vida e no Temperamento.",
      },
      {
        q: "Meus dados e fotos ficam privados?",
        a: "Sim. Avaliações, fotos e resultados são só seus. Não vendemos nem compartilhamos com terceiros.",
      },
      {
        q: "E se não fizer sentido para mim?",
        a: "Você tem {garantia} dias de garantia. Não gostou? Devolvemos 100% do valor, sem perguntas.",
      },
    ],
    inclusos: [
      `Acesso completo à ${MARCA.jornada}`,
      "9 análises integradas na trilha guiada",
      "Leituras suas, nada genérico",
      "48+ leituras por pontuação",
      "Histórico para acompanhar sua evolução",
      `Portal ${MARCA.portal} com missões e suporte inclusos`,
    ],
  },
  email: {
    cadastroCriado: "Seu cadastro na {jornada} foi criado no {portal}.",
    faltaPagamento:
      "Falta só concluir o pagamento para abrir a trilha: Traço de Caráter, Temperamento, Linguagens do Amor, Roda da Vida e Numerologia.",
    preheaderPagamento: "Finalize o pagamento e comece a {jornada}.",
    ctaPagamento: "Continuar pagamento",
    rodapeJaPagou: "Já pagou? Aguarde alguns instantes e acesse com seu e-mail e senha.",
    pagamentoConfirmado: "Seu pagamento foi confirmado. Seu acesso ao {portal} está liberado.",
    comoEntrar: "Para entrar, use o e-mail {email} e a senha que você definiu no cadastro.",
    comecePeloTraco: "Depois do login, comece pela primeira etapa da {jornada}: Traço de Caráter.",
    preheaderAcesso: "Acesso liberado à {jornada}. Faça login para começar.",
    ctaConta: "Acessar minha conta",
    ctaTraco: "Começar pelo Traço de Caráter",
    acessoEncerrado:
      "O acesso à sua conta no {portal} foi encerrado por reembolso ou estorno do pagamento.",
    seFoiEngano: "Se acredita que isso foi um engano, ou se precisa de ajuda, fale conosco em {suporte}.",
    preheaderEncerrado: "Seu acesso ao Portal Iluminando foi encerrado.",
    tituloEncerrado: "Acesso encerrado",
    rodapeDuvida: "Estamos aqui para esclarecer qualquer dúvida.",
    pedidoSenha: "Recebemos um pedido para criar uma nova senha da sua conta no {portal}.",
    linkValido: "Clique no botão abaixo para criar uma nova senha. O link vale por 1 hora.",
    ignoreSeNaoPediu: "Se você não pediu isso, ignore este e-mail. Sua senha atual continua a mesma.",
    preheaderSenha: "Crie uma nova senha para acessar o Portal Iluminando.",
    tituloSenha: "Redefinir senha",
    ctaSenha: "Criar nova senha",
    senhaAlterada: "Sua senha do {portal} foi alterada.",
    seNaoFoiVoce: "Se você não fez essa alteração, fale conosco agora.",
    preheaderSenhaAlterada: "Sua senha foi atualizada. Você já pode fazer login.",
    tituloSenhaAlterada: "Senha atualizada",
    ctaLogin: "Fazer login",
    pixPendente: "Seu pagamento via PIX da {jornada} ainda não foi confirmado.",
    pixOrientacao:
      "Se você já pagou, aguarde alguns minutos. A confirmação pode demorar um pouco. Se ainda não pagou, finalize agora para abrir seu acesso.",
    preheaderPix: "Finalize seu pagamento PIX para acessar a jornada.",
    tituloPix: "Pagamento pendente",
    aindaNaoComecou:
      "Seu acesso à {jornada} já está liberado, e você ainda não começou a primeira análise.",
    comecePorModulo: "Comece por {modulo}. Leva cerca de 15 minutos e já mostra um pedaço importante de você.",
    preheaderJornada: "Comece sua primeira análise na jornada.",
    tituloJornada: "Hora de dar o primeiro passo",
    ctaJornada: "Iniciar minha jornada",
    ctaFazerLogin: "Fazer login",
  },
} as const;

export function preencher(modelo: string, vars: Record<string, string | number>): string {
  return modelo.replace(/\{(\w+)\}/g, (_, chave: string) => {
    const valor = vars[chave];
    return valor === undefined ? "" : String(valor);
  });
}
