import { MARCA } from "./marca.js";

/**
 * Casca do portal: landing, passos, FAQ e frases dos e-mails.
 * Preços e links continuam no app. Aqui fica só o que a pessoa lê.
 */
export const CASCA = {
  lp: {
    hero: {
      badge: "Autoconhecimento · Consciência · Transformação",
      headlineLine1: "Jornada",
      headlineLine2: "Da Sombra",
      headlineAccent: "à Luz",
      bullets: [
        "Existe muito sobre você que ainda merece ser descoberto",
        "Compreenda padrões, ciclos e o passo que cabe agora",
        "Você não precisa ter todas as respostas. Precisa começar a se conhecer",
      ],
      priceTeaser: "Acesso por 6 meses · À vista ou até 6x no cartão",
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
            desc: "R$ 111,11 à vista ou até 6x no cartão · 6 meses de acesso. Pagamento seguro e entrada no Portal Iluminando depois da confirmação.",
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
        subtitle: "À vista ou até 6x no cartão · 6 meses de acesso.",
        footnote: "",
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
        eyebrow: "Como funciona?",
        title: "Seu caminho começa",
        titleAccent: "com um primeiro passo.",
        steps: [
          {
            step: "01",
            title: "Entre no Portal",
            desc: "Faça seu cadastro e tenha acesso à Jornada Da Sombra à Luz.",
          },
          {
            step: "02",
            title: "Descubra suas características",
            desc: "Responda aos testes, realize suas análises e explore seu mapa pessoal.",
          },
          {
            step: "03",
            title: "Conecte suas descobertas",
            desc: "Avance pelas etapas e encontre no Dossiê de Vida uma visão integrada das suas características e padrões.",
          },
          {
            step: "04",
            title: "Continue sua jornada",
            desc: "Volte diariamente, faça suas reflexões, registre suas emoções e desenvolva uma relação mais consciente consigo mesmo.",
          },
        ],
      },
      testimonials: {
        eyebrow: "Quem já passou por aqui",
        title: "Resultados reais",
      },
      offer: {
        eyebrow: "Edição especial de lançamento",
        title: "111 Membros Fundadores",
        titleAccent: "",
        subtitle: "R$ 111,11 à vista ou até 6x no cartão · 6 meses de acesso.",
        footnote: "",
      },
      finalCta: {
        title: "O primeiro passo não é mudar quem você é.",
        titleAccent: "É conhecer quem você é.",
        body: "Sua história não precisa continuar sendo um mistério para você. Volte para si.",
      },
      faq: {
        eyebrow: "Perguntas frequentes",
        title: "Tire suas dúvidas",
      },
    },
    modulos: [
      {
        title: "01. Linguagem Corporal",
        desc: "Os cinco traços de caráter a partir das suas características corporais e fotografias. Reconheça padrões, mecanismos de proteção e potenciais.",
      },
      {
        title: "02. Temperamento",
        desc: "Descubra as características predominantes do seu temperamento e compreenda melhor suas reações, emoções, decisões e comportamentos.",
      },
      {
        title: "03. Linguagens do Amor",
        desc: "Identifique suas principais linguagens do amor e compreenda como você expressa afeto, reconhece carinho e constrói relacionamentos.",
      },
      {
        title: "04. Roda da Vida",
        desc: "Explore 12 áreas importantes da sua vida. Identifique onde existe satisfação, onde sua energia está concentrada e o que merece atenção.",
      },
      {
        title: "05. Mapa Numerológico",
        desc: "Leitura com base no nome e na data de nascimento: Caminho de Vida, Expressão, Alma, Personalidade e Triângulo Numerológico.",
      },
      {
        title: "06. Seus Ciclos Numerológicos",
        desc: "Explore ciclos pessoais, Ano Pessoal e movimentos mensais. Anos anteriores, atual e próximo, para compreender sua trajetória.",
      },
      {
        title: "07. Numerologia Diária",
        desc: "Acompanhe a leitura numerológica diária e os significados simbólicos da energia de cada dia, com reflexões para a sua vida.",
      },
      {
        title: "08. Sua Experiência Diária",
        desc: "Um espaço para desacelerar, reconhecer emoções, refletir sobre o momento presente e registrar pensamentos.",
      },
      {
        title: "09. Dossiê de Vida",
        desc: "A conexão de tudo o que você descobriu. Visão ampla de quem você é, padrões, potencialidades e pontos de atenção.",
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
        q: "O que é o Portal Iluminando?",
        a: "É uma plataforma de autoconhecimento que reúne ferramentas, análises e experiências para ajudar você a compreender sua personalidade, seus padrões e seu momento de vida.",
      },
      {
        q: "O que é a Jornada Da Sombra à Luz?",
        a: "É o percurso guiado dentro do Portal. Você passa por diferentes análises, conecta suas descobertas e desenvolve uma compreensão mais ampla sobre si mesmo.",
      },
      {
        q: "Preciso conhecer numerologia ou linguagem corporal?",
        a: "Não. Todas as experiências são apresentadas de maneira guiada. Você responde às perguntas, fornece as informações solicitadas e recebe suas leituras organizadas.",
      },
      {
        q: "O que é o Dossiê de Vida?",
        a: "É a síntese integrada das suas análises. Ele conecta diferentes dimensões do seu perfil para oferecer uma visão mais completa das suas características, padrões e possibilidades.",
      },
      {
        q: "Preciso fazer tudo de uma vez?",
        a: "Não. Você pode percorrer a jornada no seu próprio ritmo e retornar às experiências durante seu período de acesso.",
      },
      {
        q: "Por quanto tempo terei acesso?",
        a: "A edição Membros Fundadores oferece {meses} meses de acesso ao Portal Iluminando. Você pode pagar à vista (PIX ou cartão) ou parcelar em até 6x no cartão.",
      },
      {
        q: "Como recebo meu acesso?",
        a: "Após a confirmação do pagamento, você entra na plataforma com o e-mail e a senha do cadastro.",
      },
      {
        q: "Meus dados e resultados são privados?",
        a: "Suas informações e resultados são pessoais. O Portal preserva a privacidade dos seus registros e fotografias, conforme a política de proteção de dados.",
      },
    ],
    inclusos: [
      `Acesso à ${MARCA.jornada}`,
      "Análises de personalidade, comportamento e autoconhecimento",
      "Mapa e ciclos numerológicos",
      "Dossiê de Vida integrado",
      "Reflexões e experiências diárias",
      "Meu Espaço para registros pessoais",
      "Missões e comunidade do Portal",
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
    acessoAteLinha: "Acesso por 6 meses, até {data}. Sem renovação automática.",
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
