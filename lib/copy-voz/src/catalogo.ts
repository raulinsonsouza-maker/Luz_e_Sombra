import { CASCA } from "./casca.js";
import { MARCA } from "./marca.js";

export { preencher } from "./casca.js";

/** Textos de superfície. Telas e e-mails leem daqui, não guardam parágrafo próprio. */
export const CATALOGO = {
  lp: {
    heroSubline: `Nove leituras, no seu ritmo, reunidas num mapa. Você entende quem é, o que se repete e qual passo cabe agora. ${MARCA.voceEstaAqui}`,
    tagline: "Uma trilha guiada para sair do automático e enxergar, com clareza, quem você é.",
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
        "O corpo mostra um dos cinco traços: Esquizoide, Oral, Psicopata, Masoquista ou Rígido. As fotos e o que você conta se cruzam nessa leitura.",
      introTexto: [
        "O Traço de Caráter lê o corpo junto com o que você sente. Ele observa como você ocupa o espaço, sustenta tensões e expressa emoção. São padrões que muitas vezes acontecem no automático.",
        "Você envia fotos com orientações simples e responde a um questionário. As duas leituras se cruzam e mostram o traço que mais aparece, o que se repete e um passo para usar isso com consciência.",
        "Reserve cerca de 20 a 30 minutos em um lugar calmo. No final, a leitura fica guardada aqui e pode ser refeita quando você quiser ir mais fundo.",
      ],
      introBullets: [
        "Cinco traços, lidos no corpo e no que você conta",
        "Fotos e questionário se cruzam numa leitura só",
        "Um relatório seu, com um passo para o dia a dia",
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
