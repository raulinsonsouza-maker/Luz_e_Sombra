import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import { profilePhotoViewResponseIsImageBody } from "@/lib/profilePhotoView";
import MobileTopBar from "@/components/MobileTopBar";
import NavBackButton from "@/components/NavBackButton";
import PageIntroHeader from "@/components/PageIntroHeader";
import {
  calcularNumerodeVida,
  calcularNumerodeExpressao,
  calcularNumerodaAlma,
  calcularNumerodaPersonalidade,
  calcularAnoPessoal,
  formatarDataBrasileira,
} from "@/lib/numerologia-utils";
import { NUMEROS_DE_VIDA, ANOS_PESSOAIS } from "@/lib/numerologia-data";
import {
  gerarDossieIntegrado,
  parseTemperamentoFromApi,
  parseLinguagensFromApi,
  parseDiagnosticoEmocional,
  type AvaliacaoDossie,
  type TracoDossie,
  type TemperamentoDossie,
  type LinguagensDossie,
} from "@/lib/dossieIntegrado";
import {
  Loader2, Sparkles, Heart, Star, Compass,
  Zap, Shield, Brain, Eye, Target, TrendingUp, AlertCircle,
  CheckCircle2, Clock, Activity, Flame, Anchor, User,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

type TracoResultado = TracoDossie & {
  estruturaSecundaria: string;
  interpretacao?: string;
  centroEnergetico?: string;
};

type Avaliacao = AvaliacaoDossie;

// ── Constants ─────────────────────────────────────────────────────────────────

const AREAS_LABELS: Record<keyof Avaliacao, string> = {
  plenitudeFelicidade: "Felicidade e Plenitude",
  espiritualidade: "Espiritualidade",
  saudeDisposicao: "Saúde e Disposição",
  desenvolvimentoIntelectual: "Intelecto e Mente",
  equilibrioEmocional: "Equilíbrio Emocional",
  familia: "Família",
  desenvolvimentoAmoroso: "Vida Amorosa",
  vidaSocial: "Vida Social",
  realizacaoProposito: "Realização e Propósito",
  recursosFinanceiros: "Recursos Financeiros",
  contribuicaoSocial: "Contribuição Social",
  criatividadeHobbyDiversao: "Criatividade e Prazer",
};

const AREAS_INTERPRETACAO: Record<keyof Avaliacao, { baixo: string; medio: string; alto: string }> = {
  plenitudeFelicidade: {
    alto: "Você habita a vida com um nível raro de satisfação interior. Isso não é acidente, é o resultado de escolhas conscientes que muitos ainda não têm coragem de fazer.",
    medio: "Sua felicidade existe, mas de forma intermitente. Há uma sensação de que falta algo, embora seja difícil nomear o quê. O autoconhecimento que você está construindo é exatamente o que abre esse portal.",
    baixo: "Há um vazio de realização que merece atenção urgente. Não como emergência, mas como um sinal de que sua vida atual não reflete quem você realmente é.",
  },
  espiritualidade: {
    alto: "Sua conexão com algo maior do que você mesmo está ativa e sustentando sua jornada. Isso é uma base invisível de força que poucos conseguem cultivar.",
    medio: "Você acredita, mas a prática ainda não se tornou hábito. A espiritualidade está chamando, não para mais ritual, mas para mais presença no cotidiano.",
    baixo: "Esta área mostra um distanciamento do transcendente. Pode não ser falta de fé, pode ser exaustão, descrença ou simplesmente uma fase mais pragmática da vida. Vale investigar.",
  },
  saudeDisposicao: {
    alto: "Seu corpo está sendo bem cuidado. A vitalidade que você cultiva aqui alimenta todas as outras áreas da sua vida.",
    medio: "Saúde no patamar médio costuma indicar atenção parcial, você sabe o que precisa fazer, mas a consistência ainda é o desafio.",
    baixo: "O corpo está mandando sinais que precisam ser ouvidos. Sem saúde e disposição, tudo mais perde o brilho. Esta é uma prioridade de base.",
  },
  desenvolvimentoIntelectual: {
    alto: "Sua mente está sendo alimentada com qualidade. O investimento em conhecimento se reflete na qualidade das suas decisões e da sua visão de mundo.",
    medio: "Há curiosidade, mas a profundidade ainda não chegou. Você está consumindo muito e processando pouco, ou vice-versa.",
    baixo: "Sua mente está subnutrida. Não por falta de capacidade, por falta de estímulo adequado ou por um cotidiano que não deixa espaço para crescer.",
  },
  equilibrioEmocional: {
    alto: "Você tem cultivado uma relação madura com suas emoções. Isso não significa ausência de dor, significa que você sabe o que fazer com ela.",
    medio: "Emoções ainda te pegam de surpresa com frequência. O equilíbrio existe em partes, mas nos momentos decisivos, ainda há instabilidade.",
    baixo: "Esta é possivelmente a área mais urgente do seu dossiê. Quando o equilíbrio emocional está comprometido, todas as outras áreas sofrem consequência.",
  },
  familia: {
    alto: "Família é uma fonte de apoio real na sua vida. Esse fundamento sustenta sua capacidade de arriscar e crescer com mais segurança.",
    medio: "Relações familiares funcionam, mas há tensões não resolvidas. Algo nessa dinâmica ainda precisa de conversa, perdão ou redesenho.",
    baixo: "A família carrega um peso significativo neste momento. Pode ser conflito, distância ou uma ferida antiga que ainda não cicatrizou completamente.",
  },
  desenvolvimentoAmoroso: {
    alto: "Sua vida amorosa está nutrida e recíproca. Isso exige maturidade emocional que você demonstra ter construído.",
    medio: "O amor existe, mas há padrões que se repetem. Uma análise honesta do que você atrai e como você ama pode abrir novos horizontes.",
    baixo: "Esta área pede atenção, não apenas à relação em si, mas ao que dentro de você ainda não permite uma entrega amorosa plena e recíproca.",
  },
  vidaSocial: {
    alto: "Você tem uma rede social que nutre e expande. Conexões genuínas são um dos ativos mais valiosos que existem.",
    medio: "Há pessoas na sua vida, mas a profundidade das conexões ainda não corresponde ao que você realmente precisa.",
    baixo: "Isolamento ou superficialidade nas conexões. Pode ser escolha consciente, ou pode ser um sinal de que você se fechou mais do que deveria.",
  },
  realizacaoProposito: {
    alto: "Você acordou para o propósito e está vivendo em alinhamento com ele. Poucas pessoas chegam aqui, honre esse estado.",
    medio: "Você sente que há algo maior esperando, mas ainda não conseguiu articular com clareza o que é ou como chegar lá.",
    baixo: "A falta de propósito claro é uma das formas mais sutis de sofrimento. Você não está perdido, está esperando por uma clareza que só vem com movimento.",
  },
  recursosFinanceiros: {
    alto: "Sua relação com dinheiro está madura e seus recursos estão organizados. Isso cria liberdade real de escolha.",
    medio: "Finanças funcionam, mas de forma instável. A relação com dinheiro ainda carrega crenças limitantes que valem ser investigadas.",
    baixo: "Recursos financeiros em nível crítico impactam a paz interna de forma profunda. Não é só sobre dinheiro, é sobre liberdade, segurança e autoestima.",
  },
  contribuicaoSocial: {
    alto: "Você está contribuindo com algo além de si mesmo. Esse senso de serviço é uma das fontes mais sustentáveis de significado.",
    medio: "Você quer contribuir, mas ainda não encontrou o canal certo ou o momento. A intenção está lá, a expressão ainda precisa de forma.",
    baixo: "Não há nada de errado em focar em si mesmo por um período. Mas quando isso se estende, a alma começa a sentir falta de propósito coletivo.",
  },
  criatividadeHobbyDiversao: {
    alto: "Criatividade e prazer têm espaço real na sua vida. Isso não é fútil, é essencial para a saúde psíquica e para a inovação.",
    medio: "Há criatividade latente esperando expressão. A vida adulta séria muitas vezes suprime essa dimensão sem que a pessoa perceba.",
    baixo: "Prazer, leveza e expressão criativa estão ausentes. Isso é um sinal importante, a vida não pode ser apenas produção e obrigações.",
  },
};

const ESTRUTURAS: Record<string, {
  nome: string; cor: string; corBg: string;
  arquetipo: string; padraoProfundo: string; sombra: string;
  dominancias: string[]; relacionamento: string;
}> = {
  esquizoide: {
    nome: "Esquizóide",
    cor: "#9b8fde",
    corBg: "rgba(155,143,222,0.08)",
    arquetipo: "O Pensador Profundo",
    padraoProfundo: "Você processa o mundo primariamente pelo intelecto e pela percepção interior. Sua relação com o corpo e com o presente imediato exige mais esforço consciente do que para a maioria. Quando está bem integrado, você acessa profundidades que poucos alcançam.",
    sombra: "Tende a se dissociar do corpo e das emoções como mecanismo de proteção. A intimidade é um terreno que exige coragem deliberada.",
    dominancias: ["Pensamento sistêmico e análise profunda", "Criatividade não convencional", "Independência intelectual", "Visão além do óbvio"],
    relacionamento: "Você precisa de espaço e de parceiros que respeitem seu mundo interior. Intimidade se constrói lentamente, mas com profundidade rara quando acontece.",
  },
  oral: {
    nome: "Oral",
    cor: "#5b9bd5",
    corBg: "rgba(91,155,213,0.08)",
    arquetipo: "O Cuidador Profundo",
    padraoProfundo: "Você foi moldado(a) por uma necessidade de conexão e pertencimento. Nutre o outro como forma de linguagem natural, e frequentemente se esquece de nutrir a si mesmo com a mesma intensidade.",
    sombra: "O medo de abandono e a necessidade de ser necessário podem criar dependências emocionais que drenam. Aprender a receber é seu maior desafio.",
    dominancias: ["Empatia visceral e genuína", "Capacidade de criar pertencimento", "Calor humano que transforma ambientes", "Lealdade profunda nas relações"],
    relacionamento: "Você ama com intensidade e muitas vezes se perde no outro. Relações saudáveis exigem que você cultive uma base interna sólida antes de buscar preenchimento no outro.",
  },
  psicopata: {
    nome: "Estratégico",
    cor: "#e07b39",
    corBg: "rgba(224,123,57,0.08)",
    arquetipo: "O Estrategista Direcionado",
    padraoProfundo: "A leitura corporal aqui é de eixo forte: a energia costuma subir para cabeça, peito e garganta, gerando presença, foco e capacidade de comando. É um corpo que quer conduzir, organizar o espaço e antecipar movimentos. Quando integrado, isso vira liderança lúcida; quando sobrecarregado, vira tensão no pescoço, mandíbula, peito e respiração curta, como se sentir fosse um risco que precisa ser controlado.",
    sombra: "A defesa aparece como contenção e vigilância. Em vez de abrir o corpo para o vínculo, ele pode entrar em modo de monitoramento permanente: olhar que avalia, fala que avança, peito que sustenta a postura, abdômen que segura o impulso. O problema não é falta de força, é usar a força para não descer para a vulnerabilidade.",
    dominancias: ["Presença firme e direção clara", "Leitura estratégica de pessoas e cenários", "Capacidade de decisão sob pressão", "Energia de comando e posicionamento"],
    relacionamento: "Você se vincula melhor quando não precisa sustentar uma imagem de superioridade. A intimidade cresce quando a força deixa de ser defesa e passa a ser presença disponível.",
  },
  masoquista: {
    nome: "Masoquista",
    cor: "#6db96d",
    corBg: "rgba(109,185,109,0.08)",
    arquetipo: "O Portador Silencioso",
    padraoProfundo: "Você suporta cargas que quebrariam a maioria. Sua resistência é genuína e profunda, mas frequentemente usada para carregar o que não é seu, ou para evitar o conflito necessário que libertaria.",
    sombra: "A tendência de engolir necessidades e postergar a própria voz cria um acúmulo de pressão interna que eventualmente precisa de vazão, geralmente de formas não desejadas.",
    dominancias: ["Persistência e resistência excepcionais", "Lealdade inabalável", "Capacidade de sustentar processos longos", "Profundidade emocional impressionante"],
    relacionamento: "Você é o pilar que todos procuram. O desafio é permitir que te apoiem também, e aprender que expressar necessidades não é fraqueza.",
  },
  rigido: {
    nome: "Sustentador",
    cor: "#c8a56b",
    corBg: "rgba(200,165,107,0.08)",
    arquetipo: "O Construtor de Presença",
    padraoProfundo: "O corpo costuma revelar um padrão de sustentação: tronco organizado, tônus constante, postura que passa responsabilidade e confiabilidade. Há muita capacidade de estruturar e manter, mas também tendência a reter tensão no centro do corpo, ombros e mandíbula, como se a vida precisasse ser carregada com controle para não desmoronar.",
    sombra: "Quando em excesso, a organização vira contenção. A respiração encurta, o peito fica guardado, a mandíbula aperta e a energia sobe pouco para o prazer. É um corpo que sabe sustentar, mas precisa aprender a soltar sem sentir que perdeu valor.",
    dominancias: ["Disciplina e comprometimento genuínos", "Presença estável e confiável", "Integridade como valor vivido", "Capacidade de construir resultados duradouros"],
    relacionamento: "Você é parceiro(a) confiável e presente, mas precisa aprender a mostrar sentimento sem transformar tudo em responsabilidade. O vínculo amadurece quando a precisão abre espaço para afeto e o corpo pode relaxar sem culpa.",
  },
};

const ANO_AREAS_CONEXAO: Record<number, Record<string, string>> = {
  1: {
    realizacaoProposito: "Seu Ano 1 está pedindo que você inaugure uma nova relação com seu propósito. Não espere clareza total, o propósito se revela no movimento, não na espera.",
    recursosFinanceiros: "Ano 1 favorece novos caminhos de renda e independência financeira. A energia está alinhada para você finalmente agir sobre o que sempre pensou em criar.",
    vidaSocial: "Este é o ano de expandir sua rede com intenção. Conexões novas têm um peso especial, cada pessoa que você conhecer agora pode fazer parte do próximo ciclo de 9 anos.",
    equilibrioEmocional: "A energia do 1 exige que você se coloque em primeiro lugar. Cuidar do equilíbrio emocional não é luxo este ano, é pré-requisito para liderar.",
    espiritualidade: "Inícios espirituais têm peso particular no Ano 1. Uma nova prática iniciada agora pode definir o seu próximo ciclo completo.",
  },
  2: {
    desenvolimentoAmoroso: "Seu Ano 2 e sua vida amorosa estão em ressonância direta. Este é literalmente o ano das relações, o que você trabalhar aqui terá efeito multiplicado.",
    equilibrioEmocional: "O Ano 2 amplifica a sensibilidade emocional. Se o equilíbrio está baixo, esse ano pode intensificar o desconforto, mas também é o ano com mais recursos para cura emocional.",
    familia: "Dinâmicas familiares pedem atenção no Ano 2. Conversas que foram adiadas têm um convite especial de acontecerem agora.",
    vidaSocial: "Conexões se aprofundam no Ano 2. Este não é o ano de expandir a rede, é o de aprofundar os laços que realmente importam.",
    realizacaoProposito: "Propósito no Ano 2 costuma se revelar através das relações. Pergunte-se: com quem você quer construir, e o quê?",
  },
  3: {
    criatividadeHobbyDiversao: "Seu Ano 3 está pedindo expressão criativa, urgente. Criatividade baixa neste ano é uma energia represada que vai se manifestar de outras formas se não encontrar canal.",
    vidaSocial: "O Ano 3 expande naturalmente as conexões sociais. Se vida social está baixa, você está nadando contra uma maré favorável, o que está impedindo?",
    realizacaoProposito: "Propósito no Ano 3 tem tudo a ver com comunicação e criação. O que você tem a dizer ao mundo que ainda não disse?",
    equilibrioEmocional: "A energia criativa do 3 pode ser esmagadora quando não tem saída. Expressar emoções através da criatividade é especialmente poderoso este ano.",
    plenitudeFelicidade: "O Ano 3 convida para a alegria como prática. Se felicidade está baixa, esta é uma dissonância importante, o universo está oferecendo leveza que você não está aceitando.",
  },
  4: {
    recursosFinanceiros: "Ano 4 é o ano de organizar finanças. Se recursos estão baixos, a energia do universo está completamente alinhada com você criar estrutura financeira agora.",
    saudeDisposicao: "Rotinas de saúde têm um poder especial no Ano 4. Hábitos criados este ano tendem a ser os mais duradouros do ciclo.",
    realizacaoProposito: "No Ano 4, propósito se manifesta como construção concreta. O que você está construindo que vai durar além deste ano?",
    desenvolvimentoIntelectual: "Estudo sistemático é especialmente recompensado no Ano 4. É o ano de aprender com profundidade, não apenas consumir conteúdo.",
    equilibrioEmocional: "O Ano 4 pode trazer peso e seriedade. Criar estrutura emocional, rotinas de autocuidado, limites claros, é especialmente importante agora.",
  },
  5: {
    familia: "Dinâmicas familiares podem passar por mudança ou tensão no Ano 5. O que estava estagnado vai se mover, com ou sem sua permissão.",
    realizacaoProposito: "O Ano 5 traz convites inesperados de propósito. Esteja aberto(a), o caminho pode ser diferente do que você imaginou, mas não menos verdadeiro.",
    recursosFinanceiros: "Finanças no Ano 5 pedem cuidado com impulsividade. A tentação de mudanças radicais existe, discerna entre transformação e fuga.",
    vidaSocial: "Pessoas novas entram com força no Ano 5. Se vida social está baixa, há uma abertura natural para isso mudar, mas você precisa dar o primeiro passo.",
    equilibrioEmocional: "Mudanças rápidas do Ano 5 podem desestabilizar emocionalmente. Criar um âncora interna é mais importante do que controlar o externo.",
  },
  6: {
    familia: "Ano 6 e família estão em conexão direta. O universo está pedindo que você cuide dessa dimensão, com presença real, não com boa intenção.",
    desenvolimentoAmoroso: "O Ano 6 é um dos mais poderosos para a vida amorosa. O que você trabalhar aqui vai definir a qualidade dos seus vínculos pelos próximos anos.",
    saudeDisposicao: "Autocuidado é especialmente importante no Ano 6. Cuidar dos outros precisa vir de um lugar de abundância, e isso exige que você cuide de si primeiro.",
    contribuicaoSocial: "Serviço e contribuição têm resonância especial no Ano 6. Uma ação de cuidado ao coletivo pode trazer um retorno de significado inesperadamente poderoso.",
    espiritualidade: "Espiritualidade no Ano 6 costuma se manifestar através do amor nas relações. O sagrado está nas conexões, não apenas nas práticas solitárias.",
  },
  7: {
    espiritualidade: "Seu Ano 7 está pedindo aprofundamento espiritual. Se espiritualidade está baixa, a dissonância é grande, o universo está literalmente te convidando para dentro.",
    desenvolvimentoIntelectual: "O Ano 7 é o ano do estudo profundo e da investigação. Investir em conhecimento agora traz retornos que vão muito além deste ciclo.",
    equilibrioEmocional: "Introspecção necessária do Ano 7 pode revelar emoções que estavam subterrâneas. Isso não é colapso, é virada. A terapia este ano tem poder especial.",
    realizacaoProposito: "No silêncio do Ano 7, propósito se revela. Se você não está parando o suficiente para ouvir, pode estar perdendo a mensagem mais importante do ciclo.",
    vidaSocial: "O Ano 7 naturalmente reduz energia social. Se vida social está baixa, não lute, use esse tempo de recolhimento para se aprofundar.",
  },
  8: {
    recursosFinanceiros: "Seu Ano 8 e sua área financeira estão em confronto direto. Este é literalmente o ano do poder material, agir sobre finanças agora é aproveitar uma janela que não se repete tão cedo.",
    realizacaoProposito: "Ano 8 e propósito em nível baixo criam uma tensão produtiva. O universo está pressionando você a se posicionar, o que você quer construir que tenha impacto real?",
    carreira: "O Ano 8 favorece promoções, negociações e visibilidade profissional. Se propósito está baixo, talvez a carreira atual não reflita mais quem você é.",
    vidaSocial: "Conexões com pessoas de influência são especialmente poderosas no Ano 8. Quem você precisa conhecer para o próximo capítulo?",
    saudeDisposicao: "No Ano 8, saúde comprometida é um dreno direto de poder. Cuide do corpo como você cuidaria do seu negócio mais importante.",
  },
  9: {
    plenitudeFelicidade: "O Ano 9 é de encerramento de ciclos. Felicidade baixa pode ser a sensação de que algo precisa ser liberado, não resistido.",
    familia: "Dinâmicas familiares chegam a pontos de resolução no Ano 9. Perdões, conversas, encerramentos, o que precisa ser terminado aqui?",
    desenvolimentoAmoroso: "Relacionamentos que não têm futuro chegam ao fim natural no Ano 9. Mas os que têm, se aprofundam com uma qualidade nova. Clareza é o presente deste ano.",
    contribuicaoSocial: "O Ano 9 amplifica o chamado para o serviço. Contribuição social tem uma ressonância especial, pequenos atos de generosidade têm impacto desproporcionalmente grande.",
    espiritualidade: "Este é o ano mais espiritual do ciclo. Se espiritualidade está baixa, há uma resistência ao que o universo está oferecendo, liberação, conclusão, transcendência.",
  },
};

// ── Section Component ─────────────────────────────────────────────────────────

function SecaoCard({ titulo, subtitulo, icone: Icone, children }: {
  titulo: string;
  subtitulo?: string;
  icone: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(200,165,107,0.12)" }}
    >
      <div
        className="px-6 pt-5 pb-4 flex items-center gap-3"
        style={{ borderBottom: "1px solid rgba(200,165,107,0.08)" }}
      >
        <Icone className="w-4 h-4 shrink-0" style={{ color: "#c8a56b" }} />
        <div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "rgba(200,165,107,0.6)" }}>
            {titulo}
          </p>
          {subtitulo && (
            <p className="text-[11px] mt-0.5" style={{ color: "rgba(247,242,236,0.3)" }}>{subtitulo}</p>
          )}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function DossieLabel({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span
        className="font-tan-mon-cheri text-xs w-6 h-6 rounded-full flex items-center justify-center shrink-0"
        style={{ background: "rgba(200,165,107,0.15)", color: "rgba(200,165,107,0.6)", border: "1px solid rgba(200,165,107,0.2)" }}
      >
        {num}
      </span>
      <span className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: "rgba(200,165,107,0.4)" }}>
        {label}
      </span>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────

export default function QuemSouEuPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [traco, setTraco] = useState<TracoResultado | null>(null);
  const [temperamento, setTemperamento] = useState<TemperamentoDossie | null>(null);
  const [linguagens, setLinguagens] = useState<LinguagensDossie | null>(null);
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);
  const [diagRow, setDiagRow] = useState<{ resultado?: unknown } | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);

  const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

  useEffect(() => {
    if (!user) return;
    buscarDados();
  }, [user]);

  async function buscarDados() {
    setLoading(true);
    try {
      const [tracoRes, tempRes, lingRes, diagRes, avaliacaoRes, fotoRes] = await Promise.all([
        apiFetch("/traco/analise"),
        apiFetch("/temperamento/ultimo"),
        apiFetch("/linguagens-amor/ultimo"),
        apiFetch("/diagnostico-emocional/ultimo"),
        apiFetch("/avaliacoes"),
        fetch(`${API_BASE}/api/usuarios/me/foto-perfil/view`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("luz_e_sombra_token") ?? ""}` },
        }),
      ]);
      let tracoParsed: TracoResultado | null = null;
      if (tracoRes.ok) {
        const data = await tracoRes.json();
        if (data) tracoParsed = data.resultado as TracoResultado;
        setTraco(tracoParsed);
      }
      if (tempRes.ok) {
        const data = await tempRes.json();
        setTemperamento(parseTemperamentoFromApi(data));
      }
      if (lingRes.ok) {
        const data = await lingRes.json();
        setLinguagens(parseLinguagensFromApi(data));
      }
      if (avaliacaoRes.ok) {
        const lista = await avaliacaoRes.json();
        if (lista.length > 0) setAvaliacao(lista[0] as Avaliacao);
      }
      if (diagRes.ok) {
        setDiagRow(await diagRes.json());
      }
      if (profilePhotoViewResponseIsImageBody(fotoRes)) {
        const blob = await fotoRes.blob();
        if (blob.size > 0) setFotoUrl(URL.createObjectURL(blob));
      }
    } catch { /* silent */ }
    setLoading(false);
  }

  if (!user) return null;

  const primeiroNome = user.nome.split(" ")[0];
  const dataNasc = user.dataNascimento;
  const anoAtual = new Date().getFullYear();
  const idade = dataNasc ? Math.max(0, anoAtual - Number(dataNasc.slice(0, 4))) : null;

  // ── Compute all numerology ──────────────────────────────────────────────────
  let vidaNum: number | null = null;
  let expressaoNum: number | null = null;
  let almaNum: number | null = null;
  let personalidadeNum: number | null = null;
  let anoPessoalNum: number | null = null;
  let vidaInfo: (typeof NUMEROS_DE_VIDA)[number] | null = null;
  let anoPessoalInfo: (typeof ANOS_PESSOAIS)[number] | null = null;

  if (dataNasc) {
    try {
      const dataFmt = formatarDataBrasileira(dataNasc);
      const v = calcularNumerodeVida(dataFmt);
      const e = user.nome.trim() ? calcularNumerodeExpressao(user.nome) : null;
      const a = user.nome.trim() ? calcularNumerodaAlma(user.nome) : null;
      const p = user.nome.trim() ? calcularNumerodaPersonalidade(user.nome) : null;
      const ap = calcularAnoPessoal(dataFmt, anoAtual);
      vidaNum = v?.valor ?? null;
      expressaoNum = e?.valor ?? null;
      almaNum = a?.valor ?? null;
      personalidadeNum = p?.valor ?? null;
      anoPessoalNum = ap?.reduzido ?? null;
      if (vidaNum && NUMEROS_DE_VIDA[vidaNum]) vidaInfo = NUMEROS_DE_VIDA[vidaNum];
      if (anoPessoalNum && ANOS_PESSOAIS[anoPessoalNum]) anoPessoalInfo = ANOS_PESSOAIS[anoPessoalNum];
    } catch { /* ignore */ }
  }

  // ── Sort life areas ─────────────────────────────────────────────────────────
  const areasSorted = avaliacao
    ? (Object.entries(AREAS_LABELS) as [keyof Avaliacao, string][])
        .map(([key]) => ({ key, val: avaliacao[key] }))
        .sort((a, b) => b.val - a.val)
    : [];

  const areasFortes = areasSorted.filter(a => a.val >= 7);
  const areasAtencao = areasSorted.filter(a => a.val >= 4 && a.val < 7);
  const areasUrgentes = areasSorted.filter(a => a.val < 4);
  const bottomAreas = areasSorted.slice(-3);
  const topAreas = areasSorted.slice(0, 3);

  const estrutura = traco?.estruturaPrincipal ? ESTRUTURAS[traco.estruturaPrincipal] : null;
  const semDados = !traco && !avaliacao && !vidaNum && !temperamento && !linguagens;

  const dossie = gerarDossieIntegrado({
    primeiroNome,
    vidaNum,
    expressaoNum,
    almaNum,
    personalidadeNum,
    anoPessoalNum,
    traco,
    temperamento,
    linguagens,
    avaliacao,
    diagnosticoEmocional: parseDiagnosticoEmocional(traco, diagRow),
    idade,
  });

  const insights = dossie.cruzamentos;
  const orientacoes = dossie.acoesPrioritarias;
  const diagnosticoEmocional = dossie.diagnosticoEmocional;

  const INSIGHT_ICONS: Record<string, React.ElementType> = {
    brain: Brain,
    target: Target,
    eye: Eye,
    spark: Sparkles,
    flame: Flame,
    heart: Heart,
    shield: Shield,
    zap: Zap,
  };

  const fontesFaltando = dossie.matrizFontes.filter((f) => !f.disponivel);

  return (
    <div
      className="min-h-screen pb-28"
      style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}
    >
      <MobileTopBar />

      <div className="max-w-lg mx-auto px-4 pt-6 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <NavBackButton to="/perfil" label="Perfil" className="mb-0" />
          <span className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.3)" }}>
            {anoAtual}
          </span>
        </div>
        <PageIntroHeader eyebrow="Dossiê de Vida" titulo="Quem sou eu" subtitulo="Visão integrada da sua jornada" className="mb-2" />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin" style={{ color: "#c8a56b" }} />
            <p className="text-sm" style={{ color: "rgba(247,242,236,0.4)" }}>Compilando seu dossiê...</p>
          </div>
        ) : (
          <>
            {/* ── CAPA DO DOSSIE ── */}
            <div
              className="rounded-3xl overflow-hidden relative"
              style={{
                background: "linear-gradient(135deg, rgba(200,165,107,0.14) 0%, rgba(156,119,66,0.06) 60%, rgba(19,15,9,0.8) 100%)",
                border: "1px solid rgba(200,165,107,0.25)",
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5" style={{ background: "#c8a56b", filter: "blur(40px)" }} />
              <div className="p-8">
                <p className="text-[9px] tracking-[0.4em] uppercase mb-5" style={{ color: "rgba(200,165,107,0.4)" }}>
                  Análise Comportamental Integrada · {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}
                </p>
                <div className="flex items-center gap-5">
                  <div
                    className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, rgba(200,165,107,0.2), rgba(156,119,66,0.08))",
                      border: "1.5px solid rgba(200,165,107,0.35)",
                      boxShadow: "0 0 30px rgba(200,165,107,0.15)",
                    }}
                  >
                    {fotoUrl ? (
                      <img src={fotoUrl} alt={primeiroNome} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-tan-mon-cheri text-3xl" style={{ color: "#c8a56b" }}>
                        {primeiroNome[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-tan-mon-cheri text-2xl leading-tight mb-1" style={{ color: "#f7f2ec" }}>
                      {user.nome}
                    </h2>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                      {vidaNum && (
                        <span className="text-[11px]" style={{ color: "rgba(200,165,107,0.6)" }}>
                          Caminho {vidaNum}
                        </span>
                      )}
                      {anoPessoalNum && (
                        <>
                          <span style={{ color: "rgba(200,165,107,0.25)" }}>·</span>
                          <span className="text-[11px]" style={{ color: "rgba(200,165,107,0.6)" }}>
                            Ano Pessoal {anoPessoalNum}
                          </span>
                        </>
                      )}
                      {estrutura && (
                        <>
                          <span style={{ color: "rgba(200,165,107,0.25)" }}>·</span>
                          <span className="text-[11px]" style={{ color: "rgba(200,165,107,0.6)" }}>
                            {estrutura.nome}
                          </span>
                        </>
                      )}
                      {temperamento?.arquetipo && (
                        <>
                          <span style={{ color: "rgba(200,165,107,0.25)" }}>·</span>
                          <span className="text-[11px]" style={{ color: "rgba(200,165,107,0.6)" }}>
                            {temperamento.arquetipo}
                          </span>
                        </>
                      )}
                    </div>
                    {(dossie.assinaturaIntegrada || traco?.fraseIdentidade) && (
                      <p className="text-xs italic mt-2" style={{ color: "rgba(247,242,236,0.4)" }}>
                        "{dossie.assinaturaIntegrada ?? traco?.fraseIdentidade}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Numerology strip */}
                <div
                  className="flex flex-wrap gap-1.5 mt-5 pt-4"
                  style={{ borderTop: "1px solid rgba(200,165,107,0.1)" }}
                >
                  {dossie.matrizFontes.map((fonte) => (
                    <span
                      key={fonte.id}
                      className="text-[10px] px-2.5 py-1 rounded-full"
                      style={{
                        background: fonte.disponivel ? "rgba(93,185,122,0.1)" : "rgba(255,255,255,0.03)",
                        color: fonte.disponivel ? "rgba(93,185,122,0.75)" : "rgba(247,242,236,0.25)",
                        border: fonte.disponivel ? "1px solid rgba(93,185,122,0.2)" : "1px solid rgba(200,165,107,0.08)",
                      }}
                    >
                      {fonte.disponivel ? "✓" : "○"} {fonte.label}
                    </span>
                  ))}
                </div>

                {(vidaNum || expressaoNum || almaNum || personalidadeNum) && (
                  <div
                    className="grid grid-cols-4 gap-2 mt-4 pt-4"
                    style={{ borderTop: "1px solid rgba(200,165,107,0.1)" }}
                  >
                    {[
                      { label: "Vida", num: vidaNum },
                      { label: "Expressão", num: expressaoNum },
                      { label: "Alma", num: almaNum },
                      { label: "Personalidade", num: personalidadeNum },
                    ].map(({ label, num }) => num ? (
                      <div key={label} className="text-center">
                        <p className="font-tan-mon-cheri text-xl" style={{ color: "#c8a56b" }}>{num}</p>
                        <p className="text-[9px] tracking-wider uppercase mt-0.5" style={{ color: "rgba(247,242,236,0.25)" }}>{label}</p>
                      </div>
                    ) : null)}
                  </div>
                )}
              </div>
            </div>

            {/* ── ANÁLISES PENDENTES ── */}
            {fontesFaltando.length > 0 && !semDados && (
              <div
                className="rounded-2xl p-4"
                style={{ background: "rgba(224,123,57,0.05)", border: "1px solid rgba(224,123,57,0.15)" }}
              >
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(224,123,57,0.7)" }}>
                  Para cruzamento completo
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.5)" }}>
                  Complete: {fontesFaltando.map((f) => f.label).join(", ")}. Cada análise adiciona uma camada ao seu dossiê integrado.
                </p>
              </div>
            )}

            {/* ── SEM DADOS ── */}
            {semDados && (
              <div
                className="rounded-2xl p-8 text-center"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(200,165,107,0.1)" }}
              >
                <User className="w-10 h-10 mx-auto mb-4" style={{ color: "rgba(200,165,107,0.3)" }} />
                <p className="font-tan-mon-cheri text-xl mb-3" style={{ color: "rgba(247,242,236,0.5)" }}>
                  Seu dossiê está sendo construído
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.3)" }}>
                  Complete sua data de nascimento, Traço de Caráter, Temperamento, Linguagens do Amor, Roda da Vida e Diagnóstico Emocional para o cruzamento integrado completo.
                </p>
              </div>
            )}

            {/* ── SEU MOMENTO ATUAL — ANO PESSOAL ── */}
            {anoPessoalNum && anoPessoalInfo && (
              <SecaoCard titulo="Seu Momento Atual" subtitulo={`Ano Pessoal ${anoPessoalNum} · ${anoAtual}`} icone={Clock}>
                <DossieLabel num="I" label="O Ciclo em que Você Está" />

                {/* Big year display */}
                <div className="flex items-center gap-5 mb-5">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center font-tan-mon-cheri text-5xl shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #9c7742, #c8a56b)",
                      color: "#fff",
                      boxShadow: "0 8px 32px rgba(200,165,107,0.3)",
                    }}
                  >
                    {anoPessoalNum}
                  </div>
                  <div>
                    <p className="font-tan-mon-cheri text-lg leading-tight mb-1" style={{ color: "#f7f2ec" }}>
                      {anoPessoalInfo.titulo.split(",")[1]?.trim() || anoPessoalInfo.titulo}
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.45)" }}>
                      {anoPessoalInfo.descricao}
                    </p>
                  </div>
                </div>

                {/* Essencia do ano */}
                <div
                  className="rounded-xl p-4 mb-5"
                  style={{ background: "rgba(200,165,107,0.06)", border: "1px solid rgba(200,165,107,0.12)" }}
                >
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.7)" }}>
                    {anoPessoalInfo.essencia}
                  </p>
                </div>

                {/* Temas do ano */}
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-3" style={{ color: "rgba(200,165,107,0.4)" }}>
                  O que este ano movimenta em você
                </p>
                <div className="space-y-3">
                  {[
                    { label: "Carreira e Propósito", texto: anoPessoalInfo.temas.carreira, icon: TrendingUp },
                    { label: "Finanças", texto: anoPessoalInfo.temas.financas, icon: Star },
                    { label: "Relações", texto: anoPessoalInfo.temas.relacionamentos, icon: Heart },
                    { label: "Saúde", texto: anoPessoalInfo.temas.saude, icon: Activity },
                  ].map(({ label, texto, icon: Icon }) => (
                    <div
                      key={label}
                      className="flex gap-3 p-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(200,165,107,0.07)" }}
                    >
                      <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "rgba(200,165,107,0.4)" }} />
                      <div>
                        <p className="text-[10px] font-semibold tracking-widest uppercase mb-1" style={{ color: "rgba(200,165,107,0.5)" }}>{label}</p>
                        <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.5)" }}>{texto}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desafios do ano */}
                {anoPessoalInfo.desafios && anoPessoalInfo.desafios.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-2" style={{ color: "rgba(200,165,107,0.4)" }}>
                      Pontos de atenção neste ciclo
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {anoPessoalInfo.desafios.map((d, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1 rounded-full"
                          style={{ background: "rgba(224,123,57,0.08)", color: "rgba(224,123,57,0.7)", border: "1px solid rgba(224,123,57,0.15)" }}
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </SecaoCard>
            )}

            {/* ── IDENTIDADE NUCLEAR ── */}
            {(vidaNum || estrutura || temperamento || linguagens) && (
              <SecaoCard titulo="Quem Você É na Essência" subtitulo="Identidade e estrutura de caráter" icone={Compass}>
                <DossieLabel num="II" label="Sua Natureza Fundamental" />

                {/* Síntese integrada */}
                {dossie.sinteseIdentidade && (
                  <div
                    className="rounded-2xl p-5 mb-5"
                    style={{
                      background: "linear-gradient(135deg, rgba(200,165,107,0.07) 0%, rgba(156,119,66,0.03) 100%)",
                      border: "1px solid rgba(200,165,107,0.15)",
                    }}
                  >
                    <p className="text-[10px] tracking-[0.25em] uppercase mb-3" style={{ color: "rgba(200,165,107,0.45)" }}>
                      Síntese de Identidade
                    </p>
                    <p className="text-sm leading-relaxed mb-0" style={{ color: "rgba(247,242,236,0.75)" }}>
                      {dossie.sinteseIdentidade}
                    </p>
                    {dossie.perguntaCentral && (
                      <p className="text-xs italic mt-3 pt-3" style={{ color: "rgba(200,165,107,0.65)", borderTop: "1px solid rgba(200,165,107,0.1)" }}>
                        {dossie.perguntaCentral}
                      </p>
                    )}
                  </div>
                )}

                {/* Número de Vida */}
                {vidaNum && vidaInfo && (
                  <div className="mb-5">
                    <div className="flex items-center gap-4 mb-3">
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center font-tan-mon-cheri text-2xl shrink-0"
                        style={{ background: "linear-gradient(135deg, #9c7742, #c8a56b)", color: "#fff" }}
                      >
                        {vidaNum}
                      </div>
                      <div>
                        <p className="text-[10px] tracking-widest uppercase mb-0.5" style={{ color: "rgba(200,165,107,0.5)" }}>Caminho de Vida</p>
                        <p className="font-semibold" style={{ color: "#f7f2ec" }}>{vidaInfo.titulo}</p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(247,242,236,0.55)" }}>
                      {vidaInfo.missao}
                    </p>

                    {/* Talentos */}
                    <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-2" style={{ color: "rgba(200,165,107,0.4)" }}>Seus talentos naturais</p>
                    <div className="space-y-1.5 mb-4">
                      {vidaInfo.talentos.slice(0, 4).map((t, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "rgba(93,185,122,0.6)" }} />
                          <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.55)" }}>{t}</p>
                        </div>
                      ))}
                    </div>

                    {/* Sombra */}
                    <div
                      className="rounded-xl p-4"
                      style={{ background: "rgba(200,165,107,0.05)", border: "1px solid rgba(200,165,107,0.08)" }}
                    >
                      <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-2" style={{ color: "rgba(200,165,107,0.4)" }}>
                        Zona de sombra
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.45)" }}>
                        {vidaInfo.sombra}
                      </p>
                    </div>
                  </div>
                )}

                {/* Traço de Caráter */}
                {estrutura && traco && (
                  <div
                    className="rounded-2xl p-5"
                    style={{ background: estrutura.corBg, border: `1px solid ${estrutura.cor}25` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-[10px] tracking-widest uppercase mb-0.5" style={{ color: `${estrutura.cor}80` }}>
                          Traço de Caráter Dominante
                        </p>
                        <p className="font-tan-mon-cheri text-lg" style={{ color: estrutura.cor }}>
                          {estrutura.nome} · {traco.estruturas[traco.estruturaPrincipal]}%
                        </p>
                      </div>
                      <Shield className="w-5 h-5 shrink-0" style={{ color: `${estrutura.cor}50` }} />
                    </div>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(247,242,236,0.65)" }}>
                      {traco.interpretacao
                        ? traco.interpretacao.slice(0, 420) + (traco.interpretacao.length > 420 ? "…" : "")
                        : estrutura.sombra}
                    </p>
                    <p className="text-[10px] font-bold tracking-[0.25em] uppercase mb-2" style={{ color: `${estrutura.cor}70` }}>
                      Dominâncias comportamentais
                    </p>
                    <div className="space-y-1">
                      {estrutura.dominancias.map((d, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full shrink-0" style={{ background: estrutura.cor, opacity: 0.6 }} />
                          <p className="text-xs" style={{ color: "rgba(247,242,236,0.55)" }}>{d}</p>
                        </div>
                      ))}
                    </div>
                    {traco.pontosFortes && traco.pontosFortes.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {traco.pontosFortes.slice(0, 4).map((p, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2.5 py-1 rounded-full"
                            style={{ background: `${estrutura.cor}15`, color: estrutura.cor, border: `1px solid ${estrutura.cor}25` }}
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    )}
                    {traco.mensagemTerapeutica && (
                      <div
                        className="mt-4 pt-4"
                        style={{ borderTop: `1px solid ${estrutura.cor}20` }}
                      >
                        <p className="text-xs leading-relaxed italic" style={{ color: "rgba(247,242,236,0.45)" }}>
                          "{traco.mensagemTerapeutica}"
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Temperamento */}
                {temperamento && (
                  <div
                    className="rounded-2xl p-5 mt-5"
                    style={{ background: "rgba(91,155,213,0.06)", border: "1px solid rgba(91,155,213,0.15)" }}
                  >
                    <p className="text-[10px] tracking-widest uppercase mb-0.5" style={{ color: "rgba(91,155,213,0.6)" }}>
                      Temperamento
                    </p>
                    <p className="font-tan-mon-cheri text-lg mb-2" style={{ color: "#5b9bd5" }}>
                      {temperamento.arquetipo ?? temperamento.primario}
                    </p>
                    {temperamento.sinteseHumana && (
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.6)" }}>
                        {temperamento.sinteseHumana}
                      </p>
                    )}
                    {temperamento.perguntaCrescimento && (
                      <p className="text-xs mt-3 italic" style={{ color: "rgba(91,155,213,0.55)" }}>
                        {temperamento.perguntaCrescimento}
                      </p>
                    )}
                  </div>
                )}

                {/* Linguagens do Amor */}
                {linguagens && (
                  <div
                    className="rounded-2xl p-5 mt-5"
                    style={{ background: "rgba(224,123,57,0.05)", border: "1px solid rgba(224,123,57,0.12)" }}
                  >
                    <p className="text-[10px] tracking-widest uppercase mb-0.5" style={{ color: "rgba(224,123,57,0.6)" }}>
                      Linguagens do Amor
                    </p>
                    {linguagens.sinteseHumana ? (
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.6)" }}>
                        {linguagens.sinteseHumana}
                      </p>
                    ) : (
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.6)" }}>
                        Receber: {linguagens.receberPrincipal} · Expressar: {linguagens.expressarPrincipal}
                      </p>
                    )}
                  </div>
                )}
              </SecaoCard>
            )}

            {/* ── CONSCIÊNCIA DA VIDA ── */}
            {avaliacao && areasSorted.length > 0 && (
              <SecaoCard titulo="Consciência das Suas Áreas de Vida" subtitulo="O que seus números revelam sobre cada dimensão" icone={Eye}>
                <DossieLabel num="III" label="Mapa da Sua Vida Agora" />

                {/* Zonas de Força */}
                {areasFortes.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "rgba(93,185,122,0.7)" }} />
                      <p className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: "rgba(93,185,122,0.6)" }}>
                        Zonas de Força: onde você floresce
                      </p>
                    </div>
                    <div className="space-y-3">
                      {areasFortes.map(({ key, val }) => (
                        <div
                          key={key as string}
                          className="rounded-xl p-4"
                          style={{ background: "rgba(93,185,122,0.04)", border: "1px solid rgba(93,185,122,0.15)" }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-semibold" style={{ color: "rgba(93,185,122,0.8)" }}>
                              {AREAS_LABELS[key as keyof Avaliacao]}
                            </p>
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{ background: "rgba(93,185,122,0.1)", color: "rgba(93,185,122,0.8)" }}
                            >
                              {val}/10
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.45)" }}>
                            {AREAS_INTERPRETACAO[key as keyof Avaliacao]?.alto}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Zonas de Atenção */}
                {areasAtencao.length > 0 && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-3.5 h-3.5" style={{ color: "rgba(200,165,107,0.7)" }} />
                      <p className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: "rgba(200,165,107,0.6)" }}>
                        Zonas de Atenção: onde há potencial não realizado
                      </p>
                    </div>
                    <div className="space-y-3">
                      {areasAtencao.map(({ key, val }) => (
                        <div
                          key={key as string}
                          className="rounded-xl p-4"
                          style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.12)" }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-semibold" style={{ color: "rgba(200,165,107,0.8)" }}>
                              {AREAS_LABELS[key as keyof Avaliacao]}
                            </p>
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded-full"
                              style={{ background: "rgba(200,165,107,0.1)", color: "rgba(200,165,107,0.8)" }}
                            >
                              {val}/10
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.45)" }}>
                            {AREAS_INTERPRETACAO[key as keyof Avaliacao]?.medio}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chamados Urgentes */}
                {areasUrgentes.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Flame className="w-3.5 h-3.5" style={{ color: "rgba(224,123,57,0.7)" }} />
                      <p className="text-[10px] font-bold tracking-[0.25em] uppercase" style={{ color: "rgba(224,123,57,0.6)" }}>
                        Chamados Urgentes: o que pede atenção agora
                      </p>
                    </div>
                    <div className="space-y-3">
                      {areasUrgentes.map(({ key, val }) => {
                        const anoConexao = anoPessoalNum
                          ? (ANO_AREAS_CONEXAO[anoPessoalNum]?.[key as string])
                          : null;
                        return (
                          <div
                            key={key as string}
                            className="rounded-xl p-4"
                            style={{ background: "rgba(224,123,57,0.05)", border: "1px solid rgba(224,123,57,0.18)" }}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs font-semibold" style={{ color: "rgba(224,123,57,0.85)" }}>
                                {AREAS_LABELS[key as keyof Avaliacao]}
                              </p>
                              <span
                                className="text-xs font-bold px-2 py-0.5 rounded-full"
                                style={{ background: "rgba(224,123,57,0.1)", color: "rgba(224,123,57,0.85)" }}
                              >
                                {val}/10
                              </span>
                            </div>
                            <p className="text-xs leading-relaxed mb-2" style={{ color: "rgba(247,242,236,0.5)" }}>
                              {AREAS_INTERPRETACAO[key as keyof Avaliacao]?.baixo}
                            </p>
                            {anoConexao && (
                              <div
                                className="mt-2 pt-2 flex items-start gap-2"
                                style={{ borderTop: "1px solid rgba(224,123,57,0.12)" }}
                              >
                                <Zap className="w-3 h-3 shrink-0 mt-0.5" style={{ color: "rgba(200,165,107,0.5)" }} />
                                <p className="text-[11px] leading-relaxed italic" style={{ color: "rgba(200,165,107,0.65)" }}>
                                  {anoConexao}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </SecaoCard>
            )}

            {/* ── O CRUZAMENTO DECISIVO ── */}
            {insights.length > 0 && (
              <SecaoCard titulo="Análise do Analista" subtitulo="O que seus dados revelam em conjunto" icone={Brain}>
                <DossieLabel num="IV" label="O Cruzamento Decisivo" />
                <div className="space-y-4">
                  {insights.map((insight, i) => {
                    const IconComp = INSIGHT_ICONS[insight.icone] || Sparkles;
                    return (
                      <div
                        key={i}
                        className="rounded-xl p-5"
                        style={{
                          background: i === 0
                            ? "linear-gradient(135deg, rgba(200,165,107,0.08) 0%, rgba(156,119,66,0.03) 100%)"
                            : "rgba(255,255,255,0.02)",
                          border: i === 0
                            ? "1px solid rgba(200,165,107,0.2)"
                            : "1px solid rgba(200,165,107,0.08)",
                        }}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <IconComp className="w-4 h-4 shrink-0" style={{ color: "#c8a56b" }} />
                          <p className="text-xs font-semibold" style={{ color: "rgba(200,165,107,0.8)" }}>
                            {insight.titulo}
                          </p>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.65)" }}>
                          {insight.corpo}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </SecaoCard>
            )}

            {/* ── DIAGNÓSTICO EMOCIONAL (FASE 1) ── */}
            {diagnosticoEmocional && (
              <SecaoCard titulo="Diagnóstico Emocional (Fase 1)" subtitulo="Leitura de passado, presente e consciência" icone={Heart}>
                <DossieLabel num="V" label="Estado Emocional Estrutural" />
                <div
                  className="rounded-xl p-4 mb-4"
                  style={{ background: "rgba(200,165,107,0.05)", border: "1px solid rgba(200,165,107,0.12)" }}
                >
                  <p className="text-xs mb-2" style={{ color: "rgba(200,165,107,0.65)" }}>
                    Faixa etária: {diagnosticoEmocional.faixaEtaria} · Coleta: {diagnosticoEmocional.modoColeta.replaceAll("_", " ")}
                    {diagnosticoEmocional.fonte === "fusao" && " · Fusão Traço + formulário"}
                    {diagnosticoEmocional.fonte === "heuristica" && " · Estimativa (complete o diagnóstico)"}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.65)" }}>
                    {diagnosticoEmocional.resumo}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[
                    { k: "Passado", v: diagnosticoEmocional.passado },
                    { k: "Presente", v: diagnosticoEmocional.presente },
                    { k: "Consciência", v: diagnosticoEmocional.consciencia },
                  ].map((item) => (
                    <div key={item.k} className="rounded-xl p-3 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(200,165,107,0.08)" }}>
                      <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "rgba(200,165,107,0.45)" }}>{item.k}</p>
                      <p className="font-tan-mon-cheri text-2xl" style={{ color: "#c8a56b" }}>{item.v}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(91,155,213,0.12)", color: "#5b9bd5" }}>
                    Nível atual: {diagnosticoEmocional.nivelAtual}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(109,185,109,0.12)", color: "#6db96d" }}>
                    Evolução: {diagnosticoEmocional.evolucao}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(224,123,57,0.12)", color: "#e07b39" }}>
                    Tag: {diagnosticoEmocional.tag.replace("_", " ")}
                  </span>
                </div>
                <div className="space-y-2">
                  {diagnosticoEmocional.proximosPassos.map((p, i) => (
                    <p key={i} className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.55)" }}>
                      {i + 1}. {p}
                    </p>
                  ))}
                </div>
              </SecaoCard>
            )}

            {/* ── ORIENTACAO PRECISA ── */}
            {orientacoes.length > 0 && (
              <SecaoCard titulo="Sua Bússola para Este Momento" subtitulo="Orientação precisa baseada em todos os seus dados" icone={Target}>
                <DossieLabel num="VI" label="Ação com Propósito" />
                <div className="space-y-3">
                  {orientacoes.map((o, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-4 rounded-xl"
                      style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.1)" }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-tan-mon-cheri text-xs"
                        style={{ background: "rgba(200,165,107,0.15)", color: "#c8a56b" }}
                      >
                        {i + 1}
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.65)" }}>{o}</p>
                    </div>
                  ))}
                </div>

                {/* Afirmação do ano pessoal */}
                {anoPessoalInfo?.afirmacoes && anoPessoalInfo.afirmacoes[0] && (
                  <div
                    className="mt-5 rounded-2xl p-5 text-center"
                    style={{
                      background: "linear-gradient(135deg, rgba(200,165,107,0.1) 0%, rgba(156,119,66,0.04) 100%)",
                      border: "1px solid rgba(200,165,107,0.2)",
                    }}
                  >
                    <Anchor className="w-4 h-4 mx-auto mb-3" style={{ color: "rgba(200,165,107,0.5)" }} />
                    <p className="text-sm italic leading-relaxed" style={{ color: "rgba(200,165,107,0.85)" }}>
                      {anoPessoalInfo.afirmacoes[0]}
                    </p>
                    {vidaInfo?.afirmacao && (
                      <p className="text-xs italic leading-relaxed mt-2" style={{ color: "rgba(247,242,236,0.35)" }}>
                        {vidaInfo.afirmacao}
                      </p>
                    )}
                  </div>
                )}
              </SecaoCard>
            )}

            {/* ── FOOTER ── */}
            {!semDados && (
              <div className="py-4 text-center">
                <div
                  className="w-12 h-px mx-auto mb-4"
                  style={{ background: "linear-gradient(to right, transparent, rgba(200,165,107,0.3), transparent)" }}
                />
                <p className="text-xs italic" style={{ color: "rgba(200,165,107,0.3)" }}>
                  "Conhecer-se é o começo de toda sabedoria."
                </p>
                <p className="text-[10px] mt-1" style={{ color: "rgba(247,242,236,0.15)" }}>
                  Dossiê integrado: Numerologia · Traço de Caráter · Temperamento · Linguagens do Amor · Roda da Vida · Diagnóstico Emocional
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
