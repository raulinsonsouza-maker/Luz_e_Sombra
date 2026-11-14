import {
  LP_ACCESS_MONTHS,
  LP_GUARANTEE_DAYS,
  LP_PORTAL_NAME,
  LP_PRICE,
  LP_PRICE_INSTALLMENTS,
  LP_PRICE_INSTALLMENT_VALUE,
  LP_TESTIMONIALS,
  formatLpPrice,
} from "@/lib/lpConfig";

export const LP01_TIMER_MINUTES = 15;
export const LP01_TIMER_STORAGE_KEY = "lp01_offer_deadline";

export const LP01_HERO = {
  brand: LP_PORTAL_NAME,
  headline: "Você se sente preso nos mesmos padrões e não sabe por quê?",
  subheadline:
    "Existe um caminho simples para entender quem você é, o que te move e o que se repete na sua vida.",
  cta: "Quero me conhecer",
} as const;

export const LP01_WHAT_IS = {
  eyebrow: "O que é isso",
  title: `${LP_PORTAL_NAME}: um espaço para você se conhecer`,
  body: "É um portal online onde você faz perguntas sobre si, recebe leituras claras e vê, em um só lugar, o que as peças da sua história revelam. Sem aula complicada. Sem precisar saber de nada antes.",
  points: [
    "Você responde no seu tempo. O Portal organiza as respostas pra você.",
    "Serve pra quem nunca fez nada parecido.",
    `Você fica com acesso por ${LP_ACCESS_MONTHS} meses, no celular ou no computador.`,
  ],
} as const;

export const LP01_RECEIVE = {
  eyebrow: "O que você vai receber",
  title: "O que entra no seu acesso",
  items: [
    "Leituras sobre quem você é e como reage",
    "Mapa das áreas da sua vida",
    "Olhar sobre vínculos e afeto",
    "Síntese de tudo em um só lugar",
    "Espaço pra registrar o que sente",
    "Comunidade",
    "Um convite diário pra olhar pra si",
  ],
} as const;

export const LP01_WHY = {
  eyebrow: "Por que agora",
  title: "Quanto mais você adia, mais os padrões mandam",
  items: [
    {
      title: "Os mesmos ciclos se repetem",
      desc: "Trabalho, relações, decisões. Sem clareza, você só reage. Com clareza, você escolhe.",
    },
    {
      title: "Achismo não basta",
      desc: "Aqui não é frase solta de internet. É um caminho feito pra falar da sua vida.",
    },
    {
      title: "Dá pra começar hoje",
      desc: `Em poucos minutos você entra. Depois tem ${LP_ACCESS_MONTHS} meses pra ir no seu ritmo.`,
    },
    {
      title: "Condição de lançamento",
      desc: "Preço especial agora, com garantia. Depois pode não ser o mesmo.",
    },
  ],
} as const;

export const LP01_BONUSES = {
  eyebrow: "Bônus",
  title: "Inclusos na oferta",
  items: [
    { title: "Comunidade", desc: "Um espaço pra partilhar e caminhar junto." },
    { title: "Convite do dia", desc: "Um momento curto pra olhar pra si no cotidiano." },
    { title: "Passos guiados", desc: "Pequenas etapas pra você não parar no meio." },
  ],
} as const;

export const LP01_OFFER = {
  eyebrow: "Oferta especial",
  title: "Seu acesso por",
  /** Destaque principal */
  installmentsHighlight: `${LP_PRICE_INSTALLMENTS}x de ${formatLpPrice(LP_PRICE_INSTALLMENT_VALUE)}`,
  installmentsHint: "no cartão",
  /** Valor total com menos destaque */
  totalSoft: `ou ${formatLpPrice(LP_PRICE)} no PIX`,
  accessBadge: `${LP_ACCESS_MONTHS} meses`,
  timerLabel: "Expira em",
  includedPreview: [
    "Portal completo",
    "Leituras sobre você",
    "Comunidade",
  ],
} as const;

export const LP01_CAROUSEL = {
  eyebrow: "Por dentro",
  title: "Assim é o Portal",
  slides: [
    { src: "/lp01-media/01-inicio.png", alt: "Tela inicial do Portal", caption: "Seu dia no Portal" },
    { src: "/lp01-media/02-caminho.png", alt: "Caminho de autoconhecimento", caption: "Seu caminho" },
    { src: "/lp01-media/03-leitura.png", alt: "Leitura do mês", caption: "Leituras claras" },
    { src: "/lp01-media/04-perfil.png", alt: "Seu perfil e padrões", caption: "Seu perfil" },
  ],
} as const;

export const LP01_TESTIMONIALS = {
  eyebrow: "Depoimentos",
  title: "Quem já começou",
  items: [
    {
      name: LP_TESTIMONIALS[0]?.name ?? "Mariana S.",
      role: "34 anos",
      text: "Em poucos dias eu vi onde me sabotava. Trabalho, relações, energia. Pela primeira vez não foi só achismo.",
      image: "/lp01-media/depoimento-mariana.jpg",
      rating: 5,
    },
    {
      name: LP_TESTIMONIALS[1]?.name ?? "Ricardo L.",
      role: "41 anos",
      text: "Eu achava que isso não era pra mim. Quando comecei a me ver com mais clareza, bateu com o que eu sinto no dia a dia.",
      image: "/lp01-media/depoimento-ricardo.jpg",
      rating: 5,
    },
    {
      name: LP_TESTIMONIALS[2]?.name ?? "Camila F.",
      role: "29 anos",
      text: "O que mais me pegou foi tudo conversando junto. E o Portal me ajudou a não abandonar no meio do caminho.",
      image: "/lp01-media/depoimento-camila.jpg",
      rating: 5,
    },
  ],
};

export const LP01_GUARANTEE = {
  eyebrow: "Garantia",
  title: `${LP_GUARANTEE_DAYS} dias pra experimentar sem medo`,
  body: `Se em ${LP_GUARANTEE_DAYS} dias não fizer sentido pra você, pedimos o reembolso conforme a garantia.`,
} as const;

export const LP01_FAQ = {
  eyebrow: "FAQ",
  title: "Dúvidas rápidas",
  items: [
    {
      q: "Eu nunca ouvi falar. O que é isso?",
      a: `O ${LP_PORTAL_NAME} é um espaço online pra você se conhecer melhor. Você responde, recebe leituras claras e vê tudo reunido sobre a sua história.`,
    },
    {
      q: "Serve pra quem nunca fez nada assim?",
      a: "Sim. Você não precisa saber de nada antes. Tudo é guiado com calma.",
    },
    {
      q: "O que eu recebo?",
      a: `Acesso por ${LP_ACCESS_MONTHS} meses ao Portal, com leituras, comunidade e espaço pra seguir no seu ritmo.`,
    },
    {
      q: "Como pago?",
      a: `PIX ou cartão (${formatLpPrice(LP_PRICE)} ou até ${LP_PRICE_INSTALLMENTS}x). Depois da confirmação, o acesso abre.`,
    },
    {
      q: "E se eu não gostar?",
      a: `Você tem ${LP_GUARANTEE_DAYS} dias de garantia pra pedir reembolso.`,
    },
  ],
} as const;

export const LP01_FOOTER = {
  brand: LP_PORTAL_NAME,
  line: `© 2026 ${LP_PORTAL_NAME}. Todos os direitos reservados.`,
} as const;
