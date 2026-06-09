import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import RadarChart from "@/components/RadarChart";
import LineChart from "@/components/LineChart";
import MobileTopBar from "@/components/MobileTopBar";
import NavBackButton from "@/components/NavBackButton";
import PageIntroHeader from "@/components/PageIntroHeader";
import { JORNADA_MODULE_NAV } from "@/lib/jornadaHubConfig";
import { AREAS_DA_VIDA } from "@/lib/types";
import {
  ArrowRight, Sparkles, TrendingUp, ArrowUp, ArrowDown, Minus,
  ChevronRight, AlertTriangle, CheckCircle, Target, Zap,
  Smile, Activity, Brain, Scale, Home, Heart, Users,
  Coins, Hand, Palette, LucideIcon,
} from "lucide-react";
import { apiFetch } from "@/lib/auth";
import DarkCard from "@/components/DarkCard";

// ─── Area icon ─────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, LucideIcon> = {
  Smile, Sparkles, Activity, Brain, Scale,
  Home, Heart, Users, Target, Coins, Hand, Palette,
};

function AreaIconDark({ iconName, size = 24 }: { iconName: string; size?: number }) {
  const Icon = ICON_MAP[iconName] || Smile;
  return (
    <div
      className="inline-flex items-center justify-center rounded-xl flex-shrink-0"
      style={{
        width: size + 20, height: size + 20,
        background: "linear-gradient(135deg, rgba(200,165,107,0.12) 0%, rgba(156,119,66,0.06) 100%)",
        border: "1px solid rgba(200,165,107,0.25)",
      }}
    >
      <Icon size={size} strokeWidth={1.4} style={{ color: "#c8a56b" }} />
    </div>
  );
}

// ─── Types ─────────────────────────────────────────────────────────────────

interface Avaliacao {
  id: number;
  dataAvaliacao: string;
  plenitudeFelicidade: number;
  espiritualidade: number;
  saudeDisposicao: number;
  desenvolvimentoIntelectual: number;
  equilibrioEmocional: number;
  familia: number;
  desenvolvimentoAmoroso: number;
  vidaSocial: number;
  realizacaoProposito: number;
  recursosFinanceiros: number;
  contribuicaoSocial: number;
  criatividadeHobbyDiversao: number;
  usuario: { id: number; nome: string; dataNascimento: string | null; username: string };
}

// ─── Interpretation engine ──────────────────────────────────────────────────

type Nivel = "urgente" | "atencao" | "desenvolvimento" | "excelencia";

interface NivelInfo {
  nivel: Nivel;
  label: string;
  cor: string;
  bgLight: string;
  borderColor: string;
  interpretacao: string;
  acao: string;
}

const INTERPRETACOES: Record<string, Record<Nivel, { interpretacao: string; acao: string }>> = {
  plenitudeFelicidade: {
    urgente: {
      interpretacao: "Sua vida carrega um peso difícil de nomear. A ausência de alegria genuína não é fraqueza, é um sinal que merece atenção urgente e compaixão. A plenitude não é luxo: é a base de tudo.",
      acao: "Considere buscar apoio profissional (terapia). Comece com micro-momentos de intenção: o que te trouxe alegria algum dia? Plante ali.",
    },
    atencao: {
      interpretacao: "Há satisfação intermitente, mas a plenitude ainda parece condicional, dependente de que algo externo mude primeiro. Esta é uma armadilha sutil que pode durar décadas.",
      acao: "Identifique o que drena sua energia e elimine ou reduza. Crie um ritual diário pequeno de gratidão real, não performática.",
    },
    desenvolvimento: {
      interpretacao: "Você está bem, mas sabe que 'bem' não é tudo. Há uma versão de você que vive com mais leveza e presença disponível, e ela não exige circunstâncias perfeitas.",
      acao: "Aprofunde sua prática de presença: meditação, natureza, conexão genuína. O que te aproxima do estado de fluxo?",
    },
    excelencia: {
      interpretacao: "Você cultiva alegria de forma genuína e consistente. Esta base de plenitude é rara e sustenta todas as outras áreas da sua vida com uma solidez que poucos desenvolvem.",
      acao: "Compartilhe esta qualidade de presença. Como você sustenta isso intencionalmente, e como protege esse estado nos dias difíceis?",
    },
  },
  espiritualidade: {
    urgente: {
      interpretacao: "A desconexão espiritual cria um vazio existencial que afeta tudo. Perguntas sobre propósito e sentido mais assustam do que abrem, e esse medo de perguntar é o próprio problema.",
      acao: "Comece pequeno: 10 minutos de silêncio diário, sem agenda. Explore uma tradição ou prática sem exigir certeza imediata.",
    },
    atencao: {
      interpretacao: "Há uma faísca de conexão, mas ainda não existe uma prática que realmente sustente você nos momentos difíceis. A espiritualidade superficial desaparece exatamente quando mais precisamos.",
      acao: "Experimente consistência em vez de intensidade: 15 minutos diários de qualquer prática que traga silêncio interior.",
    },
    desenvolvimento: {
      interpretacao: "Você tem conexão espiritual real, mas ela ainda é intermitente, não totalmente integrada ao cotidiano. A diferença entre espiritualidade e religião é que uma você pratica, a outra você tem.",
      acao: "Aprofunde sua prática existente. Busque um guia, grupo ou comunidade que ressoe com seu caminho.",
    },
    excelencia: {
      interpretacao: "Sua vida espiritual é uma âncora que sustenta tudo mais. Você vive a partir de um propósito que vai além do ego, e isso se traduz em uma qualidade de presença que outros sentem.",
      acao: "Como você contribui para aprofundar a vida espiritual de quem está ao seu redor?",
    },
  },
  saudeDisposicao: {
    urgente: {
      interpretacao: "Seu corpo está pedindo socorro. Energia cronicamente baixa, sono comprometido e descuido físico cobram um preço alto em todas as áreas da vida, silenciosamente, progressivamente.",
      acao: "Escolha UMA coisa: dormir 30 minutos mais por noite, ou caminhar 20 minutos ao dia. Comece aí e não pare.",
    },
    atencao: {
      interpretacao: "Você se cuida minimamente, mas ainda trata o corpo como uma máquina que deve aguentar, não como um aliado que merece cuidado. O corpo é o instrumento de tudo o mais que você quer realizar.",
      acao: "Revise sua rotina de sono. Adicione um movimento que você realmente goste, não que 'deveria' fazer.",
    },
    desenvolvimento: {
      interpretacao: "Sua saúde está razoável, mas você sabe que há espaço para mais vitalidade, consistência e cuidado preventivo. Saúde no nível 6-7 ainda é saúde reativa, não proativa.",
      acao: "Audite sua alimentação por uma semana. Agende os check-ups que está postergando. Adicione uma prática de mobilidade.",
    },
    excelencia: {
      interpretacao: "Você habita seu corpo com cuidado e intenção. Sua vitalidade é uma fundação que potencializa todas as outras áreas da vida, e é evidente para quem convive com você.",
      acao: "Como você sustenta esta prática sem deixar que a rotina se torne obrigação sem prazer?",
    },
  },
  desenvolvimentoIntelectual: {
    urgente: {
      interpretacao: "Sua mente está sendo subnutrida. A falta de estímulo intelectual intencional empobrece a percepção do mundo e limita progressivamente seu potencial de crescimento.",
      acao: "Escolha um livro que te desafie. Leia 10 páginas por dia. Substitua 20 minutos de conteúdo passivo por aprendizado ativo.",
    },
    atencao: {
      interpretacao: "Há consumo de conteúdo, mas pouco aprendizado transformador. A diferença é que um muda sua lista de informações, o outro muda como você pensa e age no mundo.",
      acao: "Defina um tema de estudo para os próximos 90 dias. Priorize profundidade sobre quantidade.",
    },
    desenvolvimento: {
      interpretacao: "Você aprende, mas ainda de forma dispersa. Um foco mais intencional transformaria a quantidade de inputs em profundidade real e em novas capacidades.",
      acao: "Encontre um mentor ou comunidade de prática. Ensine algo: ensinar é o nível mais profundo de aprendizado.",
    },
    excelencia: {
      interpretacao: "Sua mente está em expansão contínua. O aprendizado é parte constitutiva de quem você é, não uma tarefa na lista. Esta qualidade de mente aberta e ativa é um diferencial raro.",
      acao: "Como você aplica e compartilha o que aprende? O conhecimento se multiplica quando circula.",
    },
  },
  equilibrioEmocional: {
    urgente: {
      interpretacao: "Suas emoções estão no comando. Padrões de reatividade, sofrimento repetido ou anestesia emocional sinalizam que este é o ponto que mais urgentemente merece atenção e investimento.",
      acao: "Busque apoio profissional (terapia). Pratique o básico: nomear o que sente antes de agir. 'Estou sentindo X' é o primeiro passo.",
    },
    atencao: {
      interpretacao: "Você tem alguma consciência emocional, mas ainda é levado por ondas que poderia aprender a navegar com mais habilidade. A emoção não processada não desaparece, ela muda de endereço.",
      acao: "Desenvolva um registro emocional diário. Identifique seus 3 gatilhos mais frequentes e os padrões que surgem.",
    },
    desenvolvimento: {
      interpretacao: "Você processa bem em condições normais, mas ainda é desafiado em momentos de pressão, conflito intenso ou relacionamentos que ativam feridas antigas.",
      acao: "Aprofunde sua prática: terapia de aprofundamento, trabalho somático, meditação de compaixão. Os padrões mais antigos exigem trabalho mais profundo.",
    },
    excelencia: {
      interpretacao: "Você demonstra maturidade emocional real, sente profundamente sem ser controlado pelo que sente. Esta inteligência é rara e cria ambientes mais seguros para todos ao seu redor.",
      acao: "Como você usa esta capacidade para criar espaços mais seguros e autênticos com as pessoas que você lidera ou ama?",
    },
  },
  familia: {
    urgente: {
      interpretacao: "Suas relações familiares estão causando dor real. Feridas antigas ou conflitos ativos pesam no seu presente de formas que merecem atenção, não para os outros, mas por você.",
      acao: "Considere terapia focada em padrões de origem. Identifique UMA coisa que você pode mudar (não o outro) nesta semana.",
    },
    atencao: {
      interpretacao: "Há relação, mas não intimidade real. A distância emocional, os temas evitados ou as mágoas não ditas criam um vidro invisível entre você e quem ama.",
      acao: "Escolha uma relação familiar e invista 30 minutos de atenção total por semana. Sem telefone, sem agenda. Apenas presença.",
    },
    desenvolvimento: {
      interpretacao: "Sua vida familiar está razoável, mas você sente que poderia ser mais profunda, honesta e nutritiva. Relacionamentos familiares saudáveis exigem coragem de ser vulnerável.",
      acao: "Inicie uma conversa que você tem evitado. A qualidade das relações aumenta na proporção da coragem de ser honesto.",
    },
    excelencia: {
      interpretacao: "Seus vínculos familiares são fonte de nutrição genuína. Você investe conscientemente na qualidade dessas relações, e isso cria segurança para toda a rede.",
      acao: "Como você ajuda a criar cultura de segurança emocional e comunicação aberta nas relações familiares ao redor?",
    },
  },
  desenvolvimentoAmoroso: {
    urgente: {
      interpretacao: "Sua vida amorosa carrega dor significativa, seja em um relacionamento que não nutre mais, seja em padrões que se repetem e bloqueiam o amor saudável de entrar.",
      acao: "Examine honestamente: o que você está tolerando que não deveria? O que em você atrai ou permite esses padrões?",
    },
    atencao: {
      interpretacao: "Há amor, mas ele convive com distância, mágoa acumulada ou comunicação insuficiente. O que existe tem potencial real, mas precisa ser trabalhado ativamente, não apenas vivido passivamente.",
      acao: "Proponha uma conversa honesta sobre o que cada um precisa e o que não está funcionando. Considere terapia de casal.",
    },
    desenvolvimento: {
      interpretacao: "Seu relacionamento é bom, mas o conforto pode estar mascarando áreas de crescimento. Relacionamentos saudáveis não se sustentam no piloto automático, exigem investimento contínuo.",
      acao: "Crie rituais de conexão intencionais. Quando foi a última vez que fizeram algo genuinamente novo juntos?",
    },
    excelencia: {
      interpretacao: "Sua vida amorosa é uma parceria de crescimento mútuo. Vocês se amam, se respeitam e evoluem juntos, o que é raro e precioso, e merece ser cultivado ativamente.",
      acao: "Como vocês continuam se surpreendendo e crescendo em vez de apenas conviverem confortavelmente?",
    },
  },
  vidaSocial: {
    urgente: {
      interpretacao: "Solidão real ou relações que drenam em vez de nutrir. O isolamento, mesmo que escolhido, tem um custo que se acumula silenciosamente na saúde mental e no senso de identidade.",
      acao: "Faça contato com UMA pessoa que você admira e faz tempo que não vê. Não espere o momento perfeito.",
    },
    atencao: {
      interpretacao: "Você tem relações, mas elas ficam na superfície. Falta a profundidade que vem da vulnerabilidade e do investimento real, não de eventos sociais, mas de conexão genuína.",
      acao: "Convide alguém para uma conversa de verdade, com intenção e abertura real, não apenas um encontro social.",
    },
    desenvolvimento: {
      interpretacao: "Sua vida social existe, mas poderia ser mais intencional, mais nutritiva e mais alinhada com quem você é hoje. Muitas relações rasas não substituem poucas relações profundas.",
      acao: "Avalie sua rede: quem te inspira e te incentiva a crescer? Invista mais nessas e menos nas que apenas consomem energia.",
    },
    excelencia: {
      interpretacao: "Você cultiva relações genuínas com cuidado e intenção. Sua rede é um ativo de vida real, pessoas que te inspiram, te desafiam e te apoiam com reciprocidade.",
      acao: "Como você contribui para que essas relações sejam transformadoras, não apenas agradáveis e confortáveis?",
    },
  },
  realizacaoProposito: {
    urgente: {
      interpretacao: "Viver sem senso de propósito é uma das formas mais sutis e persistentes de sofrimento. A sensação de automatismo é um convite urgente para uma redireção, não de vida inteira, mas de atenção.",
      acao: "Reserve 2 horas esta semana para escrever: o que você faria se soubesse que não poderia fracassar? O que te faz perder a noção do tempo?",
    },
    atencao: {
      interpretacao: "Você tem direção, mas o alinhamento entre o que você faz e o que acredita ser seu propósito ainda é parcial. Essa dissonância cria um cansaço diferente, não de trabalho, mas de alma.",
      acao: "Identifique a maior contradição entre seus valores declarados e suas escolhas diárias. Comece por reduzir essa dissonância em uma área.",
    },
    desenvolvimento: {
      interpretacao: "Você vive com senso de significado na maior parte do tempo, mas sabe que há uma expressão mais plena do seu propósito disponível, mais profunda, mais corajosa, mais sua.",
      acao: "O que impede você de ir mais fundo? Medo, comodismo ou falta de clareza? Nomeie o obstáculo real e trabalhe nele.",
    },
    excelencia: {
      interpretacao: "Você vive alinhado com seu propósito de forma que se sustenta e se alimenta. Isso é genuinamente raro, a maioria das pessoas passa a vida inteira buscando o que você já encontrou.",
      acao: "Como você amplifica seu impacto? Quem mais pode se beneficiar do que você já descobriu?",
    },
  },
  recursosFinanceiros: {
    urgente: {
      interpretacao: "A instabilidade financeira gera um ruído de fundo constante que afeta toda a sua vida, atenção, relacionamentos, saúde. É urgente criar clareza e um plano, mesmo que simples.",
      acao: "Mapeie todas as dívidas e receitas em um papel agora. A clareza, mesmo que assustadora, é o primeiro passo obrigatório.",
    },
    atencao: {
      interpretacao: "Você sobrevive financeiramente, mas não está construindo nada. A ausência de reservas e planejamento deixa você vulnerável a qualquer imprevisto, e isso cria uma ansiedade de fundo.",
      acao: "Crie uma reserva de emergência como primeira prioridade absoluta. Mesmo R$200/mês consistentes fazem diferença.",
    },
    desenvolvimento: {
      interpretacao: "Sua situação é estável, mas o crescimento patrimonial ainda não é intencional. Você está administrando, não construindo, e existe uma diferença enorme entre os dois.",
      acao: "Defina um objetivo financeiro de 3 anos e o plano para chegar lá. Revise seus investimentos com alguém que entende do assunto.",
    },
    excelencia: {
      interpretacao: "Você tem clareza, organização e estratégia financeira. Seu dinheiro trabalha com intencionalidade, e isso cria liberdade real para fazer escolhas baseadas em valores, não em necessidade.",
      acao: "Como você usa seus recursos para criar impacto além de você mesmo, causas, pessoas, legado?",
    },
  },
  contribuicaoSocial: {
    urgente: {
      interpretacao: "O foco está predominantemente no individual. A desconexão com algo maior que si mesmo cria uma forma de isolamento existencial que é sutil mas persistente.",
      acao: "Escolha UMA causa que ressoa com seus valores mais profundos e dê um passo concreto nesta semana, não quando sobrar tempo.",
    },
    atencao: {
      interpretacao: "Há intenção de contribuir, mas as ações ainda são pontuais e sem consistência. Boas vontades sem compromissos regulares não criam impacto real, apenas uma boa narrativa.",
      acao: "Estabeleça um compromisso regular: agende como qualquer prioridade de vida, não como extra para quando sobrar tempo.",
    },
    desenvolvimento: {
      interpretacao: "Você contribui de formas reais, mas poderia ir mais fundo: alinhar suas competências mais fortes com necessidades reais do mundo ao seu redor.",
      acao: "Como suas habilidades únicas podem gerar impacto que vai além do que qualquer pessoa pode fazer no seu lugar?",
    },
    excelencia: {
      interpretacao: "Você age no mundo com senso genuíno de responsabilidade pelo coletivo. Suas escolhas diárias criam ondas que vão além do que você consegue ver, e isso transforma quem te observa.",
      acao: "Documente e compartilhe seu impacto. Histórias de contribuição genuína inspiram outros a agirem também.",
    },
  },
  criatividadeHobbyDiversao: {
    urgente: {
      interpretacao: "A vida adulta te roubou o jogo. A supressão completa da criatividade e do prazer é mais séria do que parece, é uma forma de empobrecer o espírito lentamente, obrigação por obrigação.",
      acao: "Esta semana, faça UMA coisa completamente inútil que te dê prazer. Sem resultado, sem produtividade. Apenas pelo prazer de ser.",
    },
    atencao: {
      interpretacao: "Você tem pequenos momentos de lazer, mas eles ainda são tratados como recompensa após as obrigações, não como parte essencial e intransferível da sua vida.",
      acao: "Agende um hobby como você agenda reuniões. O que você adorava fazer na infância e abandonou completamente?",
    },
    desenvolvimento: {
      interpretacao: "Há espaço para criatividade e diversão, mas ainda não com a regularidade e profundidade que genuinamente nutrem o espírito. A leveza é uma habilidade que precisa ser cultivada.",
      acao: "Em vez de muitos lazeres superficiais, cultive 1 ou 2 com dedicação real. A maestria é também uma forma de alegria.",
    },
    excelencia: {
      interpretacao: "Você honra a criança que vive em você. A leveza, o jogo e a criação são partes integrantes de quem você é, não extras que acontecem quando sobra tempo, mas pilares de vida.",
      acao: "Como você mantém este espaço de não-produtividade em uma cultura que valoriza apenas resultados?",
    },
  },
};

function getNivelInfo(areaId: string, valor: number): NivelInfo {
  const nivel: Nivel =
    valor <= 3 ? "urgente" :
    valor <= 5 ? "atencao" :
    valor <= 7 ? "desenvolvimento" : "excelencia";

  const configs = {
    urgente: { label: "Atenção urgente", cor: "#ef4444", bgLight: "rgba(239,68,68,0.06)", borderColor: "rgba(239,68,68,0.2)" },
    atencao: { label: "Atenção necessária", cor: "#f97316", bgLight: "rgba(249,115,22,0.06)", borderColor: "rgba(249,115,22,0.2)" },
    desenvolvimento: { label: "Em desenvolvimento", cor: "#eab308", bgLight: "rgba(234,179,8,0.06)", borderColor: "rgba(234,179,8,0.2)" },
    excelencia: { label: "Ponto forte", cor: "#c8a56b", bgLight: "rgba(200,165,107,0.06)", borderColor: "rgba(200,165,107,0.2)" },
  };

  const textos = INTERPRETACOES[areaId]?.[nivel] ?? {
    interpretacao: "Continue refletindo sobre esta área com honestidade.",
    acao: "Defina um próximo passo concreto para avançar nesta área.",
  };

  return { nivel, ...configs[nivel], ...textos };
}

function getMediaLabel(media: number): { label: string; sublabel: string } {
  if (media < 4) return { label: "Terreno a trabalhar", sublabel: "Sua jornada começa agora com coragem e honestidade" };
  if (media < 5.5) return { label: "Atenção necessária", sublabel: "Várias áreas pedem cuidado, e você deu o primeiro passo" };
  if (media < 7) return { label: "Equilíbrio emergente", sublabel: "Uma base sólida com espaço significativo para crescer" };
  if (media < 8.5) return { label: "Vida rica", sublabel: "Você cultiva uma vida com profundidade e significado" };
  return { label: "Plena realização", sublabel: "Raro nível de equilíbrio e florescimento em todas as áreas" };
}

function getMediaColor(media: number): string {
  if (media < 4) return "#ef4444";
  if (media < 5.5) return "#f97316";
  if (media < 7) return "#eab308";
  if (media < 8.5) return "#c8a56b";
  return "#84cc16";
}

function calcularMedia(aval: Avaliacao): number {
  const v = [
    aval.plenitudeFelicidade, aval.espiritualidade, aval.saudeDisposicao,
    aval.desenvolvimentoIntelectual, aval.equilibrioEmocional, aval.familia,
    aval.desenvolvimentoAmoroso, aval.vidaSocial, aval.realizacaoProposito,
    aval.recursosFinanceiros, aval.contribuicaoSocial, aval.criatividadeHobbyDiversao,
  ];
  return v.reduce((a, b) => a + b, 0) / v.length;
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function ResultadoPage() {
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const urlParams = new URLSearchParams(window.location.search);
  const primeiroAcesso = urlParams.get("primeiro") === "true";
  const [avaliacao, setAvaliacao] = useState<Avaliacao | null>(null);
  const [todasAvaliacoes, setTodasAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiFetch(`/avaliacoes/${params.id}`);
        if (res.ok) {
          setAvaliacao(await res.json());
          const res2 = await apiFetch("/avaliacoes");
          if (res2.ok) setTodasAvaliacoes(await res2.json());
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    })();
  }, [params.id]);

  if (loading) return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}
    >
      <div
        className="animate-spin rounded-full h-10 w-10 border-2"
        style={{ borderColor: "rgba(200,165,107,0.3)", borderTopColor: "transparent" }}
      />
    </div>
  );

  if (!avaliacao) return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}
    >
      <div className="text-center">
        <p className="text-lg mb-4" style={{ color: "rgba(247,242,236,0.6)" }}>Avaliação não encontrada</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-3 rounded-2xl text-sm font-semibold"
          style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1e1812" }}
        >
          Voltar ao início
        </button>
      </div>
    </div>
  );

  const valores = [
    avaliacao.plenitudeFelicidade, avaliacao.espiritualidade, avaliacao.saudeDisposicao,
    avaliacao.desenvolvimentoIntelectual, avaliacao.equilibrioEmocional, avaliacao.familia,
    avaliacao.desenvolvimentoAmoroso, avaliacao.vidaSocial, avaliacao.realizacaoProposito,
    avaliacao.recursosFinanceiros, avaliacao.contribuicaoSocial, avaliacao.criatividadeHobbyDiversao,
  ];

  const chartData = { labels: AREAS_DA_VIDA.map(a => a.titulo), values: valores };
  const media = valores.reduce((a, b) => a + b, 0) / valores.length;
  const { label: mediaLabel, sublabel: mediaSublabel } = getMediaLabel(media);
  const mediaColor = getMediaColor(media);

  const areasComValores = AREAS_DA_VIDA.map((area, i) => ({ area, valor: valores[i] }));
  const areasOrdenadas = [...areasComValores].sort((a, b) => a.valor - b.valor);

  const fortes = areasComValores.filter(a => a.valor >= 7);
  const desenvolvendo = areasComValores.filter(a => a.valor >= 4 && a.valor < 7);
  const urgentes = areasComValores.filter(a => a.valor < 4);

  const evolucaoData = todasAvaliacoes.length > 1 ? {
    labels: [...todasAvaliacoes].reverse().map(a => format(new Date(a.dataAvaliacao), "dd/MM", { locale: ptBR })),
    datasets: [{
      label: "Evolução da Média",
      data: [...todasAvaliacoes].reverse().map(a => calcularMedia(a)),
      borderColor: "rgba(200,165,107,1)",
      backgroundColor: "rgba(200,165,107,0.08)",
      tension: 0.4,
    }],
  } : null;

  const mediaInicial = todasAvaliacoes.length >= 2
    ? calcularMedia(todasAvaliacoes[todasAvaliacoes.length - 1])
    : null;
  const progresso = mediaInicial !== null ? media - mediaInicial : null;

  return (
    <div
      className="min-h-screen pb-28"
      style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}
    >
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-4 animate-fadeIn">
        <MobileTopBar />
        <NavBackButton
          to={JORNADA_MODULE_NAV.roda.hub}
          label={JORNADA_MODULE_NAV.roda.backLabel}
          className="mb-2"
        />
        <PageIntroHeader eyebrow="Roda da Vida" titulo="Resultado" subtitulo="Leitura completa da sua avaliação" className="mb-2" />

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <div className="rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(160deg, #1e1812 0%, #2f251b 60%, #1e1812 100%)", border: "1px solid rgba(200,165,107,0.2)" }}>
          <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #c8a56b 40%, #9c7742 60%, transparent)" }} />

          <div className="p-6 md:p-10">
            {primeiroAcesso && (
              <div className="flex items-start gap-3 p-4 rounded-2xl mb-6"
                style={{ background: "rgba(200,165,107,0.1)", border: "1px solid rgba(200,165,107,0.3)" }}>
                <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#c8a56b" }} />
                <div>
                  <p className="font-semibold text-sm mb-0.5" style={{ color: "#e8d5b0" }}>Parabéns pela sua primeira avaliação</p>
                  <p className="text-sm" style={{ color: "rgba(200,165,107,0.7)" }}>Esta é sua linha de base, o ponto de partida de toda a sua jornada de autoconhecimento.</p>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: "rgba(200,165,107,0.5)" }}>
                  Roda da Vida · Resultado
                </p>
                <h1 className="font-tan-mon-cheri text-3xl md:text-4xl mb-1" style={{ color: "#e8d5b0" }}>
                  {avaliacao.usuario.nome}
                </h1>
                <p className="text-sm" style={{ color: "rgba(200,165,107,0.5)" }}>
                  {format(new Date(avaliacao.dataAvaliacao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>

              <div className="text-right">
                <div className="flex items-end gap-2 justify-end">
                  <span className="font-tan-mon-cheri text-6xl md:text-7xl leading-none" style={{ color: mediaColor }}>
                    {media.toFixed(1)}
                  </span>
                  <span className="text-xl mb-2" style={{ color: "rgba(200,165,107,0.4)" }}>/10</span>
                </div>
                <p className="text-sm font-semibold" style={{ color: mediaColor }}>{mediaLabel}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(200,165,107,0.45)" }}>{mediaSublabel}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-6 pt-5"
              style={{ borderTop: "1px solid rgba(200,165,107,0.12)" }}>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: "rgba(200,165,107,0.45)" }}>
                  Mais forte
                </p>
                <p className="font-tan-mon-cheri text-sm" style={{ color: "#c8a56b" }}>
                  {areasOrdenadas[areasOrdenadas.length - 1].area.titulo}
                </p>
                <p className="font-tan-mon-cheri text-2xl" style={{ color: "#c8a56b" }}>
                  {areasOrdenadas[areasOrdenadas.length - 1].valor}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: "rgba(200,165,107,0.45)" }}>
                  Mais atenção
                </p>
                <p className="font-tan-mon-cheri text-sm text-red-400">
                  {areasOrdenadas[0].area.titulo}
                </p>
                <p className="font-tan-mon-cheri text-2xl text-red-400">
                  {areasOrdenadas[0].valor}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: "rgba(200,165,107,0.45)" }}>
                  Desequilíbrio
                </p>
                <p className="font-tan-mon-cheri text-sm" style={{ color: "rgba(200,165,107,0.6)" }}>Amplitude</p>
                <p className="font-tan-mon-cheri text-2xl" style={{ color: "rgba(200,165,107,0.8)" }}>
                  {areasOrdenadas[areasOrdenadas.length - 1].valor - areasOrdenadas[0].valor} pts
                </p>
              </div>
            </div>
          </div>

          <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, #c8a56b 40%, #9c7742 60%, transparent)" }} />
        </div>

        {/* ── Panorama diagnóstico ────────────────────────────────────────── */}
        <DarkCard className="p-6 md:p-8">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-5" style={{ color: "rgba(200,165,107,0.5)" }}>
            Panorama Diagnóstico
          </p>
          <div className="grid md:grid-cols-3 gap-4">

            {urgentes.length > 0 && (
              <div className="rounded-2xl p-4"
                style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-xs font-semibold tracking-wider uppercase text-red-500">Atenção imediata</p>
                </div>
                <div className="space-y-2">
                  {urgentes.map(({ area, valor }) => (
                    <div key={area.id} className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: "rgba(247,242,236,0.7)" }}>{area.titulo}</span>
                      <span className="font-tan-mon-cheri text-lg text-red-500">{valor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {desenvolvendo.length > 0 && (
              <div className="rounded-2xl p-4"
                style={{ background: "rgba(234,179,8,0.04)", border: "1px solid rgba(234,179,8,0.2)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 flex-shrink-0" style={{ color: "#ca8a04" }} />
                  <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: "#ca8a04" }}>Em desenvolvimento</p>
                </div>
                <div className="space-y-2">
                  {desenvolvendo.map(({ area, valor }) => (
                    <div key={area.id} className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: "rgba(247,242,236,0.7)" }}>{area.titulo}</span>
                      <span className="font-tan-mon-cheri text-lg" style={{ color: "#ca8a04" }}>{valor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {fortes.length > 0 && (
              <div className="rounded-2xl p-4"
                style={{ background: "rgba(200,165,107,0.05)", border: "1px solid rgba(200,165,107,0.25)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: "#c8a56b" }} />
                  <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: "#c8a56b" }}>Pontos fortes</p>
                </div>
                <div className="space-y-2">
                  {fortes.sort((a, b) => b.valor - a.valor).map(({ area, valor }) => (
                    <div key={area.id} className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: "rgba(247,242,236,0.7)" }}>{area.titulo}</span>
                      <span className="font-tan-mon-cheri text-lg" style={{ color: "#c8a56b" }}>{valor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </DarkCard>

        {/* ── Radar ───────────────────────────────────────────────────────── */}
        <DarkCard className="p-6 md:p-8">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-2" style={{ color: "rgba(200,165,107,0.5)" }}>
            Mapa Visual das Áreas
          </p>
          <p className="text-sm mb-5" style={{ color: "rgba(247,242,236,0.4)" }}>
            O gráfico revela o padrão de equilíbrio e desequilíbrio entre todas as dimensões da sua vida.
          </p>
          <RadarChart data={chartData} />
        </DarkCard>

        {/* ── Deep area analysis ──────────────────────────────────────────── */}
        <DarkCard className="p-6 md:p-8">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase mb-1" style={{ color: "rgba(200,165,107,0.5)" }}>
            Análise Profunda
          </p>
          <p className="text-sm mb-6" style={{ color: "rgba(247,242,236,0.4)" }}>
            Áreas ordenadas por prioridade. As que mais pedem atenção aparecem primeiro.
          </p>

          <div className="space-y-4">
            {areasOrdenadas.map(({ area, valor }) => {
              const nivelInfo = getNivelInfo(area.id, valor);
              const pct = (valor / 10) * 100;
              return (
                <div key={area.id}
                  className="rounded-2xl p-5 md:p-6"
                  style={{ background: nivelInfo.bgLight, border: `1px solid ${nivelInfo.borderColor}` }}>

                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 md:gap-4 min-w-0">
                      <AreaIconDark iconName={area.icon} size={22} />
                      <div className="min-w-0">
                        <h3 className="font-tan-mon-cheri text-lg leading-tight" style={{ color: "#f7f2ec" }}>{area.titulo}</h3>
                        <p className="text-xs" style={{ color: "rgba(247,242,236,0.4)" }}>{area.subtitulo}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="font-tan-mon-cheri text-4xl leading-none" style={{ color: nivelInfo.cor }}>{valor}</p>
                      <p className="text-xs font-semibold tracking-wider mt-0.5" style={{ color: nivelInfo.cor }}>{nivelInfo.label}</p>
                    </div>
                  </div>

                  <div className="w-full rounded-full h-1.5 mb-4" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${pct}%`, background: nivelInfo.cor }}
                    />
                  </div>

                  <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(247,242,236,0.65)" }}>
                    {nivelInfo.interpretacao}
                  </p>

                  <div className="flex items-start gap-2.5 pt-3"
                    style={{ borderTop: `1px solid ${nivelInfo.borderColor}` }}>
                    <Zap className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: nivelInfo.cor }} />
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.5)" }}>
                      <span className="font-semibold" style={{ color: "rgba(247,242,236,0.75)" }}>Próximo passo: </span>
                      {nivelInfo.acao}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </DarkCard>

        {/* ── Evolution ───────────────────────────────────────────────────── */}
        {evolucaoData && (
          <DarkCard className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-1">
              <TrendingUp className="w-4 h-4" style={{ color: "#c8a56b" }} />
              <p className="text-xs font-semibold tracking-[0.25em] uppercase" style={{ color: "rgba(200,165,107,0.5)" }}>
                Sua Jornada ao Longo do Tempo
              </p>
            </div>
            <p className="text-sm mb-6" style={{ color: "rgba(247,242,236,0.4)" }}>
              Você tem {todasAvaliacoes.length} avaliações registradas. Cada ponto é um retrato honesto de um momento da sua vida.
            </p>
            <LineChart data={evolucaoData} />

            {progresso !== null && (
              <div className="grid grid-cols-3 gap-4 mt-6 pt-5"
                style={{ borderTop: "1px solid rgba(200,165,107,0.12)" }}>
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(200,165,107,0.45)" }}>Início</p>
                  <p className="font-tan-mon-cheri text-3xl" style={{ color: "#f7f2ec" }}>{mediaInicial?.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(200,165,107,0.45)" }}>Atual</p>
                  <p className="font-tan-mon-cheri text-3xl" style={{ color: "#f7f2ec" }}>{media.toFixed(1)}</p>
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "rgba(200,165,107,0.45)" }}>Evolução</p>
                  <div className="flex items-center gap-1">
                    {progresso > 0 ? <ArrowUp className="w-4 h-4 text-green-400" />
                      : progresso < 0 ? <ArrowDown className="w-4 h-4 text-red-400" />
                      : <Minus className="w-4 h-4" style={{ color: "rgba(247,242,236,0.35)" }} />}
                    <p className={`font-tan-mon-cheri text-3xl ${progresso > 0 ? "text-green-400" : progresso < 0 ? "text-red-400" : ""}`}
                      style={progresso === 0 ? { color: "rgba(247,242,236,0.35)" } : undefined}>
                      {progresso > 0 ? "+" : ""}{progresso.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DarkCard>
        )}

        {/* ── Actions ─────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-all"
            style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1e1812" }}
          >
            {primeiroAcesso ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            {primeiroAcesso ? "Acessar Área de Membro" : "Início"}
          </button>
          {!primeiroAcesso && (
            <button
              onClick={() => navigate("/avaliacao?novo=true")}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-medium transition-all"
              style={{ border: "1px solid rgba(200,165,107,0.3)", color: "rgba(247,242,236,0.7)" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,107,0.55)";
                (e.currentTarget as HTMLElement).style.color = "#c8a56b";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,107,0.3)";
                (e.currentTarget as HTMLElement).style.color = "rgba(247,242,236,0.7)";
              }}
            >
              Nova Avaliação
            </button>
          )}
          <button
            onClick={() => navigate("/numerologia")}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-medium transition-all"
            style={{ border: "1px solid rgba(200,165,107,0.3)", color: "rgba(247,242,236,0.7)" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,107,0.55)";
              (e.currentTarget as HTMLElement).style.color = "#c8a56b";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,107,0.3)";
              (e.currentTarget as HTMLElement).style.color = "rgba(247,242,236,0.7)";
            }}
          >
            <ChevronRight className="w-4 h-4" />
            Explorar Numerologia
          </button>
        </div>

      </div>
    </div>
  );
}
