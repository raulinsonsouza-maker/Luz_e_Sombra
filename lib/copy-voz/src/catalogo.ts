import { CASCA } from "./casca.js";
import { MARCA } from "./marca.js";

export { preencher } from "./casca.js";

/** Textos de superfície. Telas e e-mails leem daqui, não guardam parágrafo próprio. */
export const CATALOGO = {
  lp: {
    heroSubline: `Uma jornada para compreender quem você é, reconhecer seus padrões, entender seus ciclos e transformar a maneira como vive. ${MARCA.voceEstaAqui}`,
    tagline: "Um portal. Diferentes caminhos. Uma descoberta: você.",
    ...CASCA.lp,
  },
  home: {
    entrada: MARCA.voceEstaAqui,
  },
  jornada: {
    intro: "Cada etapa mostra um pedaço de você. Juntas, elas respondem: quem eu sou, e o que faço com isso?",
    bloqueado: "Este passo abre quando você termina o anterior. Um de cada vez.",
    tracoMenu: "O que o seu corpo mostra sobre você",
    traco: {
      introFallback:
        "Os traços de caráter são padrões emocionais e comportamentais formados na infância. Nesta análise, fotos e questionário se cruzam para mostrar como esses padrões aparecem em você.",
      introTexto: [
        "Os traços de caráter são padrões emocionais e comportamentais que se desenvolvem ao longo da infância, a partir das experiências vividas e da maneira como aprendemos a lidar com o mundo.",
        "Esses padrões podem influenciar nossa forma de pensar, sentir, reagir, nos relacionar e até de nos expressar por meio do corpo.",
        "Nesta análise, você vai conhecer os cinco traços de caráter e explorar como eles podem aparecer em você. Para isso, serão consideradas duas fontes de informação: fotos do seu corpo, feitas seguindo orientações simples, e suas respostas a um questionário.",
        "Ao cruzar essas informações, a análise apresenta quais traços aparecem com maior intensidade, suas possíveis características e como elas podem se manifestar no seu dia a dia.",
        "Reserve cerca de 20 a 30 minutos para realizar a experiência em um ambiente tranquilo. Ao finalizar, seu relatório ficará disponível nesta página para consulta.",
      ],
      introBullets: [
        "Os cinco traços de caráter: conheça os padrões e as características associados a cada um deles.",
        "Uma leitura integrada: entenda como suas fotos e respostas ao questionário se complementam na análise.",
        "Seu perfil de traços: descubra quais aparecem com maior intensidade e como podem influenciar seus comportamentos e relacionamentos.",
      ],
      analiseDescricaoSem: "Envie suas fotos e conte como você tem se sentido. Leva cerca de 20 a 30 minutos.",
    },
  },
  missoes: {
    eyebrow: "Missões de hoje",
    titulo: "Um passo pequeno, de verdade",
    subtitulo: "Quatro práticas curtas. Você não precisa fazer tudo perfeito. Precisa fazer uma.",
  },
  diagnostico: {
    subtitulo: "Antes da leitura do corpo, conte como você tem se sentido. Isso deixa a análise mais fiel a você.",
  },
  email: {
    boasVindasAssunto: `Bem-vinda. Falta só confirmar o acesso | ${MARCA.portal}`,
    acessoAssunto: `Seu acesso está liberado | ${MARCA.portal}`,
    acessoEncerradoAssunto: `Sobre o seu acesso | ${MARCA.portal}`,
    senhaAssunto: `Criar uma nova senha | ${MARCA.portal}`,
    senhaAlteradaAssunto: `Senha atualizada | ${MARCA.portal}`,
    pixAssunto: `Seu pagamento ainda não confirmou | ${MARCA.portal}`,
    jornadaAssunto: `Sua jornada está te esperando | ${MARCA.portal}`,
    quaseLa: "Quase lá. O mapa abre quando o pagamento confirma.",
    acessoLiberado: "Você já pode entrar. Comece pelo Traço de Caráter, no seu tempo.",
    ...CASCA.email,
  },
} as const;
