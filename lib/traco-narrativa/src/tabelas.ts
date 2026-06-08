import type { EstruturasPct } from "@workspace/traco-imagem-engine";
import type { DinamicaFuncional, EstiloComunicacao } from "./types.js";

const NOMES: Record<keyof EstruturasPct, string> = {
  esquizoide: "Esquizóide",
  oral: "Oral",
  psicopata: "Psicopata",
  masoquista: "Masoquista",
  rigido: "Rígido",
};

const APELIDOSS: Record<keyof EstruturasPct, string> = {
  esquizoide: "Visionário",
  oral: "Empático",
  psicopata: "Executor",
  masoquista: "Guardião",
  rigido: "Arquiteto",
};

const FRASES_IDENTIDADE: Record<keyof EstruturasPct, string> = {
  esquizoide: "Habita universos interiores que poucos conseguem acompanhar, criativo, profundo e à frente do tempo.",
  oral: "Sente o mundo com o coração aberto, empático, generoso e capaz de nutrir com uma profundidade rara.",
  psicopata: "Determinado, estratégico e orientado ao resultado, nasce para liderar e organizar o espaço ao redor.",
  masoquista: "Resiliente, fiel e silenciosamente forte, sua capacidade de suportar move mundos sem fazer barulho.",
  rigido: "Disciplinado, confiável e orientado à excelência, aparece, entrega e inspira com consistência.",
};

const PONTOS_FORTES: Record<keyof EstruturasPct, string[]> = {
  esquizoide: ["Profundidade intelectual", "Criatividade singular", "Intuição aguçada", "Sensibilidade energética", "Pensamento original"],
  oral: ["Empatia profunda", "Conexão genuína", "Generosidade", "Escuta ativa", "Calor humano"],
  psicopata: ["Liderança natural", "Visão estratégica", "Poder de influência", "Determinação", "Carisma"],
  masoquista: ["Resiliência extraordinária", "Lealdade inabalável", "Força silenciosa", "Comprometimento", "Compaixão nascida da dor"],
  rigido: ["Disciplina", "Confiabilidade", "Excelência", "Organização", "Comprometimento"],
};

const PONTOS_ATENCAO: Record<keyof EstruturasPct, string[]> = {
  esquizoide: ["Isolamento excessivo", "Desconexão corporal", "Dificuldade de presença", "Abstração como fuga"],
  oral: ["Dependência afetiva", "Auto-abandono", "Dificuldade em receber", "Ansiedade relacional"],
  psicopata: ["Negação da vulnerabilidade", "Necessidade de controle", "Distância emocional", "Impaciência"],
  masoquista: ["Autocobrança severa", "Dificuldade em se expandir", "Ressentimento acumulado", "Rigidez interna"],
  rigido: ["Perfeccionismo paralisante", "Rigidez emocional", "Dificuldade em ceder", "Coração defendido"],
};

const FERIDAS: Record<keyof EstruturasPct, string> = {
  esquizoide: "O terror de existir, a sensação primordial de não ter direito de estar no mundo. O sistema aprendeu cedo que existir era perigoso.",
  oral: "O abandono, a ferida de não ter sido suficientemente sustentado, de não haver suporte consistente e incondicional disponível.",
  psicopata: "A traição da vontade, quando a vulnerabilidade foi violada e o sistema aprendeu que mostrar fraqueza custa caro.",
  masoquista: "A humilhação da vontade, quando se expressar, discordar ou expandir custou humilhação ou perda de amor.",
  rigido: "A desilusão do coração, quando amar foi punido, quando a entrega genuína não foi correspondida ou foi traída.",
};

const RECURSOS: Record<keyof EstruturasPct, string> = {
  esquizoide: "Uma mente capaz de criar mundos que ainda não existem. Uma visão que transcende o tempo e conecta o que parece separado.",
  oral: "Um coração que sente o outro antes de ele falar. Uma empatia que transforma o ambiente e cria vínculos de profundidade real.",
  psicopata: "Uma presença que organiza e inspira o espaço ao redor. Uma força de influência que quando enraizada torna-se liderança transformadora.",
  masoquista: "Uma resistência que permanece quando tudo mais cede. Uma profundidade emocional que nasce da dor transformada em sabedoria.",
  rigido: "Uma capacidade de realizar que transforma visão em realidade. Uma confiabilidade que ancora os que estão ao redor.",
};

const RECOMENDACOES: Record<keyof EstruturasPct, string[]> = {
  esquizoide: [
    "Prática de ancoragem somática: pés descalços na terra por 10–15 minutos diários",
    "Contato físico seguro e consistente, abraços, massagem, trabalho corporal",
    "Expressão criativa que outros possam ver e receber (não só arquivar)",
    "Terapia bioenergética, processo somático ou dança-movimento",
    "Exercícios de enraizamento: agachamentos lentos, caminhada consciente",
  ],
  oral: [
    "Pratique receber cuidado sem se sentir em dívida ou desconfortável",
    "Desenvolva estrutura própria: rotinas, limites claros, autocuidado consistente",
    "Observe onde você dá mais do que recebe, e por quê continua dando",
    "Trabalho de enraizamento em pernas e pés: squats, corrida, yoga",
    "Identifique suas necessidades reais e pratique expressá-las diretamente",
  ],
  psicopata: [
    "Cultive espaços de vulnerabilidade segura, relações onde você não precisa performar",
    "Pratique pedir ajuda e deixar que o outro contribua genuinamente",
    "Exercícios de abertura do centro do corpo: yoga, bioenergética pélvica",
    "Meditação e práticas de presença que desaceleram a atividade mental",
    "Explore o que você sente quando não está no papel de líder ou executor",
  ],
  masoquista: [
    "Pratique pequenas expansões diárias: dizer não, expressar uma opinião, ocupar mais espaço",
    "Trabalho corporal focado em liberação da região pélvica, quadril e lombar",
    "Identifique onde você engole ao invés de expressar, e pratique expressar com suavidade",
    "Celebre progressos sem minimizá-los, o prazer é permitido",
    "Psicoterapia ou bioenergética focada em desbloqueio da expressão",
  ],
  rigido: [
    "Crie espaços sem agenda, onde não há nada a entregar, provar ou realizar",
    "Pratique deixar as emoções aparecerem sem gerenciá-las imediatamente",
    "Trabalho corporal que inclua movimento espontâneo: dança livre, bioenergética",
    "Cultive relações de real intimidade, onde você é visto sem precisar ser perfeito",
    "Explore o que aparece quando você para de controlar, com curiosidade, não julgamento",
  ],
};

const OBS_ROSTO: Record<keyof EstruturasPct, string> = {
  esquizoide: "As feições apresentam uma qualidade distante e introspectiva. O olhar carrega profundidade que parece olhar além do presente, presente no espaço físico mas habitando outro lugar. A assimetria entre os lados do rosto é característica: cada lado parece guardar uma história diferente, como dois personagens coexistindo no mesmo corpo.",
  oral: "O rosto transmite uma abertura emocional palpável, os traços são delicados e os olhos expressam vulnerabilidade genuína. Há uma qualidade de receptividade na expressão, como se o mundo pudesse ser sentido antes de ser interpretado. A boca e os olhos carregam o anseio de contato que define esta estrutura.",
  psicopata: "A estrutura facial transmite presença imediata, o olhar é direto, penetrante, com uma qualidade natural de avaliação e comando. A mandíbula e o pescoço comunicam determinação. Há uma harmonia facial que serve ao magnetismo social: este rosto organiza o espaço ao redor antes de a pessoa falar.",
  masoquista: "As feições guardam uma tensão suave mas perceptível, a mandíbula e o pescoço apresentam contratura característica de quem carrega muito internamente. Os olhos expressam profundidade e uma certa resignação que coexiste com força genuína. Há peso nas expressões que revela o acúmulo de não-dito.",
  rigido: "O rosto é bem estruturado e organizado, com simetria marcante e traços equilibrados. A expressão é controlada e precisa, o coração presente mas contido por uma compostura cuidadosa. Os olhos expressam inteligência e presença, mas há uma contenção que impede a entrega total da emoção.",
};

const OBS_FRENTE: Record<keyof EstruturasPct, string> = {
  esquizoide: "A silhueta frontal revela estreiteza e fragmentação. O corpo não flui com continuidade entre os segmentos, há quebras visuais que criam a impressão de peças separadas habitando o mesmo espaço. A desconexão entre tórax e membros inferiores é visível. Os ombros podem estar contraídos e a pelve parece retraída, como se o corpo buscasse ocupar o mínimo de espaço possível.",
  oral: "O corpo apresenta colapso postural de cima para baixo: o peito cede, os ombros caem para frente, a cabeça avança além do eixo. O tônus muscular geral é baixo, não por fraqueza de caráter, mas porque o sistema nervoso aprendeu que não havia suporte suficiente disponível. A estrutura inteira parece buscar um apoio externo que ainda não chegou de forma consistente.",
  psicopata: "A silhueta frontal é dominada pela região superior: ombros largos e peito expandido criam uma presença imediata. A distribuição de massa concentra-se claramente acima da cintura. Os membros superiores são mais expressivos, os inferiores menos desenvolvidos em relação ao tronco. A postura comunica domínio e expansão antes de qualquer palavra.",
  masoquista: "O corpo frontal é comprimido e denso. A largura é expressiva, quadril, tronco e coxas ocupam bastante espaço. A compressão vertical é perceptível: o pescoço parece curto, os ombros estão rebaixados, o tronco parece pressionado de cima para baixo. É um corpo que aprendeu a resistir ao invés de expandir.",
  rigido: "O corpo apresenta organização e simetria notáveis. As proporções entre ombros e quadril são equilibradas, a coluna está ereta, e os membros são simétricos. O tônus muscular está bem distribuído. Há uma beleza na estrutura que também é couraça, o corpo funciona bem porque aprendeu a se manter unido acima de tudo.",
};

const OBS_LADO: Record<keyof EstruturasPct, string> = {
  esquizoide: "O perfil lateral revela desengajamento postural: a pelve está retraída e há descontinuidade energética entre os segmentos. Não existe uma linha de força contínua do chão à cabeça, o corpo parece habitado de forma fragmentada, como se a presença não chegasse completamente a certas partes.",
  oral: "A silhueta lateral evidencia o colapso para frente: cabeça e ombros projetam-se além do eixo corporal, o peito afunda, reduzindo o espaço respiratório. Há uma tendência ao encolhimento que reflete a busca por proteção e o baixo nível de carga energética geral. O corpo ainda aguarda ser sustentado.",
  psicopata: "O perfil lateral é marcado pelo peito projetado para frente e pela cabeça erguida com queixo levemente elevado. A postura lateral comunica domínio e expansão ascendente. A energia sobe e vai para frente, o corpo diz 'estou aqui e estou no comando' antes de qualquer palavra.",
  masoquista: "A lateral revela postura comprimida com ombros que caem para dentro e pelve encaixada, limitando a mobilidade. O centro do corpo parece bloqueado, a região do quadril e da lombar guarda tensão crônica. É um corpo que suporta peso invisível com uma consistência que revela força e limitação ao mesmo tempo.",
  rigido: "O perfil lateral evidencia alinhamento preciso: cabeça, ombros e quadril formam um eixo vertical organizado. O corpo está ereto com uma certa rigidez, a postura perfeita demais revela a armadura invisível que mantém tudo no lugar. O controle postural é real e ao mesmo tempo é símbolo do controle emocional que esta estrutura carrega.",
};

const COMBO_POSTURAL_LEVE_ORAL =
  "Há um traço de busca por vínculo no emocional, sem colapso postural dominante nas imagens.";

const PERFIL_FISICO_HUMANO: Record<keyof EstruturasPct, string[]> = {
  esquizoide: [
    "O corpo parece ocupar pouco espaço, há uma qualidade de recolhimento que convida à observação antes da ação.",
    "A energia concentra-se na parte superior, como se a presença física ainda buscasse permissão para descer até os pés.",
  ],
  oral: [
    "O corpo comunica abertura emocional e receptividade, uma postura que busca contato e sustentação.",
    "Há suavidade nos traços e uma tendência a ceder espaço, como quem espera ser acolhido.",
  ],
  psicopata: [
    "A presença corporal é imediata, o tronco e os ombros organizam o espaço ao redor antes de qualquer palavra.",
    "A energia sobe e vai para frente, com força visível na metade superior do corpo.",
  ],
  masoquista: [
    "O corpo carrega densidade e peso, uma resistência silenciosa que revela quanto foi suportado por dentro.",
    "Há compressão perceptível, como se o sistema tivesse aprendido a conter mais do que expandir.",
  ],
  rigido: [
    "Seu corpo comunica organização e equilíbrio, uma presença ereta que mantém tudo no lugar com cuidado.",
    "Há contenção perceptível: não é rigidez vazia, mas uma forma de se proteger mantendo a compostura.",
    "As proporções parecem equilibradas e simétricas, sugerindo alguém que aprendeu a funcionar bem no mundo.",
  ],
};

const SINTESE_ADJ_PRINCIPAL: Record<keyof EstruturasPct, string> = {
  esquizoide: "com profundidade interior e necessidade de espaço próprio",
  oral: "aberto ao vínculo e ao cuidado mútuo",
  psicopata: "com presença forte e orientação para ação",
  masoquista: "com resistência silenciosa e lealdade profunda",
  rigido: "organizado por dentro",
};

const SINTESE_FOCO: Record<keyof EstruturasPct, string> = {
  esquizoide: "profundidade interior e necessidade de espaço",
  oral: "vínculo e cuidado mútuo",
  psicopata: "presença e orientação para ação",
  masoquista: "resistência e lealdade silenciosa",
  rigido: "organização interna e compromisso",
};

const SINTESE_TOQUE_SECUNDARIO: Record<keyof EstruturasPct, string> = {
  esquizoide: "também com necessidade de recolhimento e reflexão",
  oral: "grande capacidade de vínculo e cuidado",
  psicopata: "traços de liderança e determinação",
  masoquista: "uma força de suporte que raramente pede ajuda",
  rigido: "organização e compromisso com o que importa",
};

const PADROES_POSTURAIS: Record<keyof EstruturasPct, string> = {
  esquizoide: "Corpo estreito com segmentos visualmente desconectados. Os ombros contraem-se e a pelve fica retraída. As quebras na linha postural criam fragmentação, o corpo não habita a si mesmo por inteiro. Há uma qualidade de ausência parcial, como se só parte da pessoa estivesse presente.",
  oral: "Colapso postural de cima para baixo: o peito afunda, os ombros caem para frente e a cabeça avança além do eixo. O corpo tem baixo tônus geral e pouco enraizamento nos membros inferiores, como se ainda buscasse o apoio externo que não chegou de forma suficiente.",
  psicopata: "Expansão ascendente marcante: ombros largos, peito projetado, cabeça erguida comunicando comando natural. A vitalidade concentra-se na metade superior. As pernas e a pelve são relativamente menos expressivas, a energia sobe mas não desce completamente até o chão.",
  masoquista: "Compressão descendente: o corpo parece pressionado de cima para baixo. Pescoço curto, ombros rebaixados, tronco largo e denso. A tensão crônica em quadris, lombar e coxas revela o acúmulo de energia que não encontra saída livre. Um corpo de resistência, não de fluxo.",
  rigido: "Postura ereta e alinhada, com proporções equilibradas entre tórax e pelve. A organização corporal é notável, cabeça, ombros e quadril formam um eixo preciso. A rigidez é discreta mas presente: uma contenção do movimento que é símbolo da contenção emocional desta estrutura.",
};

const CENTROS: Record<keyof EstruturasPct, string> = {
  esquizoide: "Cabeça e região cervical superior, a energia se concentra no pensamento e se isola do restante do corpo. O centro energético ainda busca permissão para descer.",
  oral: "Tórax e garganta, onde se guarda o não-dito, o choro contido e o desejo profundo de contato e sustentação. O coração está aberto mas o peito está vazio.",
  psicopata: "Tórax superior, ombros e pescoço, região de poder, expansão e acumulação de carga. A energia é abundante mas não circula até a pelve e os pés.",
  masoquista: "Quadril, lombar e coxas, onde a energia fica represada e comprimida em tensão crônica. O centro pede libertação que ainda não encontrou saída.",
  rigido: "Tórax e coração, onde o amor está presente mas bloqueado pela armadura da compostura. O centro sente muito mais do que permite expressar.",
};

const PADROES_ENERGETICOS: Record<keyof EstruturasPct, string> = {
  esquizoide: "A energia flui preferencialmente para a cabeça e se perde na abstração antes de alcançar o corpo físico. O sistema nervoso está cronicamente em alerta, raramente alcançando descanso pleno. Há pouco fluxo entre cognição e ação, entre pensar e sentir.",
  oral: "O fluxo energético tem baixa voltagem geral. A carga se dissipa rapidamente porque o sistema não retém energia com facilidade, há necessidade constante de recarga através do contato com o outro. Quando sozinho por muito tempo, a energia cai de forma perceptível.",
  psicopata: "A energia corre em alta voltagem para a parte superior, tórax, cabeça, braços. Abaixo da cintura o fluxo diminui significativamente. A acumulação de carga na parte superior gera tensão crônica nos ombros, nuca e trapézio. O sistema precisa de descarga regular.",
  masoquista: "A energia encontra bloqueios crônicos no nível pélvico e lombar. Quando a pressão acumula suficientemente, pode emergir como explosão emocional, adoecimento ou depressão. O sistema pede libertação e expansão que a estrutura ainda não aprendeu a permitir.",
  rigido: "O fluxo energético é organizado e contido, corre por canais definidos mas raramente transborda. Disponível para ação e realização, o fluxo encontra barreiras quando precisa circular no campo emocional e relacional. O coração bombeia mas a circulação emocional tem restrições.",
};

const MENSAGENS: Record<keyof EstruturasPct, string> = {
  esquizoide: "Você tem o direito de existir, plenamente, aqui, agora. O mundo precisa da sua visão, da sua inteligência, da sua sensibilidade única. Você não está aqui por acaso. Cada vez que se permite ser visto, que deixa alguém chegar perto, você está curando a ferida mais antiga. Isso é coragem real.",
  oral: "Você merece receber tanto quanto oferece. O universo não quer que você esvazie, quer que você transborde a partir da abundância. Cuide de si com a mesma ternura com que você cuida do outro. Você não precisa ganhar o direito de ser amado, ele já é seu, desde sempre, incondicionalmente.",
  psicopata: "Sua vulnerabilidade não é fraqueza, é o portal para o poder verdadeiro. Abrir o coração não vai destruí-lo: vai completar o que a força sozinha não consegue. Você já provou que pode conquistar o mundo. Agora é hora de conquistar a si mesmo com a mesma coragem que sempre teve.",
  masoquista: "Você já sofreu o suficiente. Você não precisa de mais provações para merecer amor, alegria ou expansão. A vida está convidando você a florescer, não apesar das dificuldades, mas além delas. Você é forte o suficiente para se permitir ser leve. Isso não é fraqueza: é a próxima fronteira.",
  rigido: "Seu coração é a sua maior riqueza, e ele quer falar. Por baixo de toda a competência e do controle existe um ser que sente profundamente e que merece ser sentido. Relaxar não é ceder: é finalmente chegar em casa. Deixe-se ser tocado pela vida com tudo que você tem.",
};

const INTERPRETACOES: Record<keyof EstruturasPct, string[]> = {
  esquizoide: [
    "Você habita um universo interior raro. Sua mente é um cosmos particular, cheio de conexões que poucos conseguem acompanhar. Há uma inteligência que transcende o ordinário, uma capacidade de ver padrões invisíveis para os outros, de criar mundos a partir do nada. Essa é sua maior riqueza e, ao mesmo tempo, seu maior isolamento.",
    "A estrutura Esquizóide carrega a ferida mais primordial: o terror de existir. No corpo, isso se manifesta como uma desconexão entre partes, como se fragmentos de você vivessem em órbitas separadas. Os ombros tendem a retrair, a pelve a recuar, o corpo a fragmentar-se em segmentos que não conversam facilmente entre si. O trabalho é reunir esses fragmentos em uma identidade encarnada.",
    "Sua relação com a solidão é complexa: ela é tanto fortaleza quanto prisão. O isolamento criativo, a profundidade intelectual, a sensibilidade extrema às energias ao redor, são dons reais que o mundo precisa. O desafio que a vida lhe apresenta é o mesmo de sempre: confiar que é seguro estar aqui, que você tem direito de existir plenamente, de ser visto.",
    "Sua jornada de transformação passa obrigatoriamente pelo corpo. Enquanto a mente já habita mundos sofisticados, o corpo aguarda ser habitado com a mesma presença. Cada vez que você ancora sua vasta riqueza interior no aqui e agora, a experiência de ser você se torna mais inteira, mais real, mais sua.",
    "A integração da estrutura Esquizóide não é sobre 'ser normal', é sobre trazer o universo interior para o contato com o mundo real. Quando a presença física começa a acompanhar a riqueza interna, surge uma pessoa de impacto genuíno: criativa, conectada e radicalmente autêntica.",
  ],
  oral: [
    "Há em você uma profundidade emocional que é raridade neste mundo. Você sente o outro antes mesmo de ele falar, percebe a dor escondida, a alegria genuína, a saudade que ninguém mais enxerga. Essa é sua maior dádiva: a empatia encarnada, o coração que pulsa pelo mundo.",
    "A estrutura Oral carrega a ferida do abandono, não necessariamente um abandono literal, mas a experiência de não ter havido suporte suficiente, consistente e incondicional. No corpo, isso aparece como colapso postural: o peito cede, os ombros caem, o sistema todo aprende a operar com menos energia. O trabalho interno é aprender a apoiar-se em si mesmo.",
    "Você nutre o outro com uma generosidade extraordinária. Mas existe uma pergunta silenciosa que o acompanha: 'E eu, quem me sustenta?' O caminho de cura passa por aprender a pedir, a receber, a deixar que cuidem de você com a mesma entrega com que você cuida. Você merece isso, não como recompensa, mas como direito.",
    "Sua sensibilidade é um presente que o mundo precisa. A melancolia, a saudade, o anseio de pertencer, são expressões de um coração que ama profundamente. Quanto mais você encontrar estrutura interna, limites, autocuidado, apoio próprio, mais você pode amar o mundo sem se dissolver nele.",
    "A transformação da estrutura Oral é sobre plenitude, aprender que você pode se encher por dentro ao invés de depender do outro para isso. Não é sobre fechar o coração, mas sobre ter um centro tão forte quanto a abertura que você já carrega naturalmente.",
  ],
  psicopata: [
    "Você chegou ao mundo com uma capacidade de influência que é visível no seu corpo: a parte superior se impõe, os ombros comunicam antes de você falar, a postura comanda o espaço ao redor. Essa não é uma falha de caráter, é uma resposta adaptativa de um ser que precisou controlar o ambiente para sobreviver.",
    "A estrutura Psicopata nasce de uma traição, de uma vontade que foi violada quando ainda era vulnerável. O corpo aprendeu a se expandir para cima como defesa: quanto maior acima da cintura, menos vulnerável. Funcionou. Você se tornou alguém difícil de controlar. O preço foi a desconexão com a própria fragilidade.",
    "Sua força é real. Seu magnetismo, sua capacidade estratégica, sua visão, são dons genuínos que o mundo reconhece. O que a vida lhe convida a descobrir é que por baixo da armadura existe um coração que também quer ser visto, que também quer descansar, que também quer ser amado sem precisar impressionar.",
    "A transformação para você passa por descer, trazer a energia do peito e dos ombros até o chão, até as pernas, até a pelve. Quando o poder vem do corpo inteiro e não apenas do tórax, ele se torna sustentável, autêntico, enraizado. É aí que o líder se torna sábio e o estrategista se torna humano.",
    "A vulnerabilidade que você evitou com tanto custo é justamente o que completa o que você tem. Líderes que conhecem sua própria fragilidade e a revelam nos momentos certos inspiram lealdade que a força sozinha nunca consegue. Essa é a próxima fronteira do seu poder.",
  ],
  masoquista: [
    "Há uma força em você que é silenciosa e contínua, uma capacidade de suportar que não é fraqueza, mas acúmulo de pressão não expressa. O corpo masoquista comprimiu-se ao longo do tempo, como uma mola que nunca pôde expandir. Essa compressão é visível nas proporções e na textura da postura.",
    "A ferida que moldou essa estrutura foi a humilhação, a vontade que foi quebrada repetidamente até que a submissão se tornou mais segura que a expressão. No corpo, isso aparece como tensão crônica nos quadris, pescoço e coxas, lugares onde se guarda o que não pode ser dito, o que foi engolido por décadas.",
    "Sua lealdade é profunda. Uma vez que você se compromete com alguém ou algo, vai até o fim, mesmo quando isso custa mais do que deveria. Você conhece o sofrimento de dentro e por isso tem uma compaixão rara. O caminho de cura passa por aprender que expansão é possível, que o mundo não vai desabar quando você diz não.",
    "A transformação para a estrutura Masoquista é a expansão gradual. Não a explosão, mas o crescimento suave e contínuo, a voz que sobe um tom de cada vez, o corpo que aprende a ocupar mais espaço. Cada vez que você se expressa ao invés de engolir, está reescrevendo a história do seu corpo.",
    "A alegria, o prazer, a leveza, não são recompensas por sofrimento. São direitos que existem independentemente do quanto você suportou. A vida está esperando que você se permita florescer, não apesar do que passou, mas além disso.",
  ],
  rigido: [
    "Você foi feito para funcionar bem no mundo. Sua postura diz isso: ereta, organizada, controlada, um ser que se mantém unido. Há uma competência visível no jeito como você habita seu corpo e seu lugar no mundo. Você realiza, entrega, aparece. Sua estrutura é reconhecida como referência.",
    "A estrutura Rígida carrega a desilusão do coração, o amor que foi punido, que não foi correspondido da forma esperada, que deixou uma ferida invisível mas profunda. O corpo aprendeu a se manter unido acima de tudo, porque se desmontar era perigoso demais. O resultado é uma armadura bela e eficiente que também bloqueia a entrada do amor profundo.",
    "Você tem tudo o que precisa externamente. O desafio é interno: deixar que o que está dentro possa mostrar-se. A emoção que fica represada não desaparece, ela espera. O coração que está por baixo do controle é sensível, profundo, capaz de um amor transformador. Mas ele precisa de espaço para respirar.",
    "A jornada da estrutura Rígida é a rendição consciente, não a fraqueza, mas a entrega intencional. Quando você consegue relaxar o controle o suficiente para sentir, para chorar, para ser tocado sem defesa, você não perde a força: você a completa. É aí que a excelência exterior e a riqueza interior se encontram.",
    "A pergunta que a vida faz para você é: 'E você, o que sente, quando ninguém está olhando, quando não há nada a realizar, quando não há papel a cumprir?' A resposta que viver essa pergunta revela é o coração desta transformação.",
  ],
};

const COMBOS: Record<string, string> = {
  "esquizoide-oral": "uma sensibilidade extrema que tanto se retira para a mente quanto anseia por conexão. Há um movimento interno constante entre o isolamento criativo e o desejo de pertencer, dois universos que pedem integração.",
  "esquizoide-psicopata": "uma combinação rara de visão estratégica e profundidade filosófica. O poder de influência existe mas opera preferencialmente de uma distância segura, o contato direto e a liderança visível são o próximo passo de crescimento.",
  "esquizoide-masoquista": "uma pressão interna dupla: o corpo pede silêncio e o mundo pede conformidade. Há riqueza interior enorme, mas o acesso a ela fica bloqueado por tensão corporal crônica e desconexão. O corpo precisa ser habitado para a riqueza circular.",
  "esquizoide-rigido": "precisão intelectual aliada à organização, mas a vivência emocional permanece distante. A couraça rígida protege o espaço esquizóide, mas também impede a chegada do calor humano necessário à integração.",
  "oral-esquizoide": "um ser que tanto precisa de amor quanto recua do contato. O anseio de pertencer coexiste com o medo de ser destruído pela proximidade. É uma polaridade que pede integração gradual, cuidadosa e paciente.",
  "oral-psicopata": "a combinação de necessidade afetiva com força de influência, podem emergir padrões onde a necessidade se disfarça de generosidade que espera retribuição. O caminho é a transparência: pedir diretamente o que se precisa.",
  "oral-masoquista": "sofrimento em dobro: abandono e humilhação criando um padrão profundo de autossacrifício. Mas também compaixão excepcional, quem conhece a dor de dentro acolhe a dor do outro com uma profundidade rara.",
  "oral-rigido": "o coração que quer amar mas aprendeu a controlar esse desejo. A estrutura rígida organiza e contém a necessidade oral, mas o amor verdadeiro emerge quando deixamos de administrá-lo e o deixamos simplesmente ser.",
  "psicopata-esquizoide": "um visionário que prefere operar nos bastidores. Há poder real, mas ele é exercido preferencialmente através de ideias e estratégias em vez de presença física direta. A liderança existe mas com distância de segurança.",
  "psicopata-oral": "força e vulnerabilidade em tensão permanente. A fachada poderosa esconde uma necessidade profunda de ser visto e amado. A cura acontece quando o poder não precisa mais funcionar como defesa contra o amor.",
  "psicopata-masoquista": "uma energia densa e intensa, poder de cima pressionando contra resistência de baixo. Pode gerar explosões ou implosões quando o sistema não encontra saída saudável. A integração cria liderança autêntica com raízes.",
  "psicopata-rigido": "performance de alto nível, um ser que tanto domina quanto organiza com excelência. O exterior brilha; o desafio é o interior. Muito realizado fora, com uma saudade crescente de si mesmo por dentro.",
  "masoquista-esquizoide": "peso e distância combinados, o corpo carrega muito enquanto a mente se afasta. A riqueza interior existe mas fica enterrada sob camadas de tensão corporal e desconexão. O caminho é a presença encarnada.",
  "masoquista-oral": "duas estruturas de sofrimento que se reforçam, o peso do mundo combinado com a necessidade do outro. A transformação vem através de autocuidado radical e de aprender a receber sem culpa.",
  "masoquista-psicopata": "força em conflito com força, uma luta interna constante entre submissão e poder. Quando integrados, podem gerar uma liderança autêntica que conhece tanto a dor quanto a força de verdade.",
  "masoquista-rigido": "resistência disciplinada, o corpo suporta enquanto a mente organiza. Um guerreiro silencioso e confiável que precisa aprender que expansão e alegria também são parte do seu direito.",
  "rigido-esquizoide": "organização externa com profundidade interna. Um ser que funciona bem no mundo mas habita universos muito mais ricos em seu interior. O desafio é trazer essa riqueza para o contato real.",
  "rigido-oral": "o coração que controla o coração que anseia. A estrutura rígida contém a necessidade oral, mas o amor verdadeiro flui quando deixamos de administrá-lo e o deixamos simplesmente acontecer.",
  "rigido-psicopata": "uma combinação de excelência e poder, alguém que tanto realiza quanto lidera. Mas o que está por baixo? Quando ninguém está olhando, o que este ser realmente sente e permite sentir?",
  "rigido-masoquista": "disciplina e resistência, um ser que entrega muito e reclama pouco. A organização rígida cobre a pressão masoquista, criando alguém confiável que internamente pede por alívio e leveza.",
};

const CARACTERISTICAS: Record<keyof EstruturasPct, string[]> = {
  esquizoide: [
    "Assimetria perceptível entre os lados do corpo",
    "Segmentos corporais visualmente desconectados entre si",
    "Estrutura ectomorfa com volume muscular reduzido",
    "Ombros contraídos, elevados ou assimétricos",
    "Pelve retraída e desengajada do tronco",
    "Pouca continuidade visual de cima a baixo",
  ],
  oral: [
    "Peito colapsado com esterno rebaixado",
    "Baixo tônus muscular geral",
    "Postura curvada com inclinação anterior da cabeça",
    "Pouco enraizamento nos membros inferiores",
    "Ombros caídos para frente",
    "Expressão de baixo nível de carga energética",
  ],
  psicopata: [
    "Ombros marcadamente mais largos que o quadril",
    "Peito expandido e projetado para frente",
    "Desenvolvimento muscular concentrado na parte superior",
    "Cabeça erguida com queixo levemente elevado",
    "Contração visível no trapézio e dorso superior",
    "Pernas relativamente menos expressivas que o tronco",
  ],
  masoquista: [
    "Corpo comprimido e de aparência densa",
    "Pescoço curto e tronco largo",
    "Pouca definição de cintura em relação ao tronco",
    "Quadril amplo e pesado",
    "Tensão crônica visível em lombar e coxas",
    "Ombros rebaixados e contraídos",
  ],
  rigido: [
    "Postura ereta e verticalmente precisa",
    "Simetria corporal marcante entre os dois lados",
    "Tônus muscular bem distribuído no corpo todo",
    "Proporções equilibradas entre ombros e quadril",
    "Alinhamento preciso da coluna vertebral",
    "Expressão de controle e contenção do movimento",
  ],
};

// ── Communication style library ────────────────────────────────────────────────

const ESTILOS_COMUNICACAO: Record<keyof EstruturasPct, EstiloComunicacao> = {
  esquizoide: {
    tipo: "Reservado e profundo",
    descricao: "Você é seletivo com palavras, cada uma tem peso real. A comunicação acontece quando há necessidade genuína ou quando um tema desperta interesse verdadeiro. Em silêncio, você está pensando, processando, habitando mundos interiores, não ausente.",
    emGrupos: "Em grupos, tende a observar mais do que participar. A conversa superficial esgota rapidamente; o que você busca é a troca que vai fundo. Com uma pessoa certa, em um espaço seguro, pode falar por horas com uma riqueza que surpreende quem só te conhecia calado.",
    emRelacoes: "Prefere se comunicar por escrito ou em profundidade e reflexão ao invés de impulso. Expressar o que sente verbalmente é genuinamente mais difícil do que compreender o que sente. Os outros podem interpretar seu silêncio como distância, raramente é isso.",
    emConflito: "Diante do conflito, o impulso é recuar e processar internamente. Raramente responde no calor da hora, e quando responde, é com uma clareza e precisão que pode surpreender quem esperava reação emocional imediata.",
    emTensao: "A tensão alta faz você desaparecer internamente, presente no corpo, ausente na interação. Pode levar horas ou dias para processar o que aconteceu e só então encontrar as palavras certas. Isso não é fraqueza: é como seu sistema trabalha.",
  },
  oral: {
    tipo: "Expressivo e relacional",
    descricao: "Você se comunica com o coração aberto, as emoções aparecem nas palavras, no tom, no gesto. Falar ajuda a organizar o que sente. A conversa é, para você, um espaço de conexão tanto quanto de troca de informação.",
    emGrupos: "Em grupos, busca conexão genuína e frequentemente aquece o ambiente. Tem facilidade para perceber o que o outro precisa ouvir, e generosidade para dizê-lo. Pode ser o centro emocional de um grupo sem precisar ser o mais falante.",
    emRelacoes: "Nas relações íntimas, a comunicação flui com naturalidade, você fala, compartilha, confessa. O desafio é perceber quando está falando mais para aliviar a própria ansiedade do que para genuinamente conectar. A distinção faz toda a diferença.",
    emConflito: "Em situações de conflito, a tendência é tentar harmonizar, a discórdia é fisicamente desconfortável. Às vezes cede antes de expressar o que realmente pensa ou sente. Com o tempo, o não-dito vira peso.",
    emTensao: "Sob tensão, pode tornar-se mais verborrágico, falar como forma de manejar a ansiedade. Perceber esse padrão é o primeiro passo para escolher as palavras que realmente importam ao invés de produzir volume.",
  },
  psicopata: {
    tipo: "Direto e estratégico",
    descricao: "Você é um comunicador natural, presença forte, voz que organiza o espaço, palavras que têm peso imediato. Fala com convicção e raramente perde o fio do que quer transmitir. Sabe exatamente como posicionar o que diz.",
    emGrupos: "Em grupos, tende a assumir o papel de quem articula, resume ou direciona. Percebe rapidamente a dinâmica do ambiente e sabe onde posicionar-se para ser ouvido. Não precisa falar muito, quando fala, é ouvido.",
    emRelacoes: "Nas relações, a comunicação tende a ser objetiva e funcional. O que sente está presente mas passa por filtros antes de ganhar voz. O desafio é deixar a vulnerabilidade também encontrar expressão, não porque diminui, mas porque completa.",
    emConflito: "No conflito, é direto, talvez mais do que o outro esperava. Não tem dificuldade em defender um ponto de vista e pode ser persistente. Mas persuasão duradoura exige que o outro se sinta ouvido antes de ser convencido.",
    emTensao: "Sob pressão, a comunicação pode endurecer, o tom aumenta, a paciência encurta, a escuta diminui. Perceber isso é crítico: a eficácia do que você diz depende de como é recebido, e o controle do tom é uma habilidade de liderança real.",
  },
  masoquista: {
    tipo: "Contido e reflexivo",
    descricao: "Você pensa muito antes de falar, e o que fala carrega consideração e peso. A comunicação é cuidadosa, às vezes mais do que necessária. Guardar é mais natural do que expressar. As palavras têm custo real para você.",
    emGrupos: "Em grupos, prefere uma posição de observação ou de apoio. Não sente necessidade de dominar a conversa, o que tem a dizer pode esperar o momento certo. Mas quando fala, o que diz costuma ser preciso e oportuno.",
    emRelacoes: "Nas relações, você é confiável e discreto, guarda o que é compartilhado com respeito genuíno. Mas também tende a guardar o que próprio sente por mais tempo do que seria saudável. Os outros podem não saber o quanto você carrega.",
    emConflito: "No conflito, a tendência é engolir. Raramente confronta no calor da hora, prefere silenciar, processar e às vezes nunca mencionar. O ressentimento pode se acumular exatamente nessa contenção, saindo mais tarde e de formas inesperadas.",
    emTensao: "Sob tensão, o silêncio aprofunda. A pressão interna cresce enquanto a comunicação diminui, o oposto do que seria necessário. Às vezes tudo irrompe em um momento inesperado, depois de longa e invisível contenção.",
  },
  rigido: {
    tipo: "Preciso e estruturado",
    descricao: "Você se comunica com clareza e precisão, sabe o que quer dizer e diz com organização. Há uma qualidade de competência no discurso que transmite confiabilidade. O pensamento está bem estruturado antes de virar palavra.",
    emGrupos: "Em grupos, pode tanto liderar a discussão quanto moderá-la. Tem facilidade para organizar o pensamento coletivo e trazer clareza quando a conversa se perde. Funciona bem em contextos que têm estrutura e propósito.",
    emRelacoes: "Nas relações íntimas, a comunicação pode parecer mais formal ou contida do que o outro espera. O que sente está presente, mas passa por um filtro de compostura antes de chegar à voz. Isso pode criar distância que não é intenção.",
    emConflito: "No conflito, é racional e argumentado. Pode ter dificuldade com a dimensão emocional, que muitas vezes pede validação antes de solução. Alguém que chora não quer ser convencido: quer ser visto. Essa distinção é importante.",
    emTensao: "Sob tensão, o controle aumenta, a comunicação torna-se mais formal, mais distante, mais gerenciada. É uma armadura que funciona no curto prazo mas cria isolamento exatamente quando a conexão seria mais necessária.",
  },
};

// ── Unique combination profiles ─────────────────────────────────────────────────

const PERFIS_UNICOS: Record<string, string> = {
  "esquizoide-oral": "Você combina profundidade rara com um anseio genuíno de conexão, duas forças que muitas vezes puxam em direções opostas. A mente habita universos interiores vastos enquanto o coração anseia por pertencimento e sustentação. O resultado é uma pessoa que tanto precisa de solidão quanto sofre com ela, tanto deseja o contato quanto recua diante dele. Esta tensão não é defeito, é o campo de sua integração. Quando as duas estruturas se encontram, emerge alguém capaz de unir a profundidade do pensamento à riqueza do sentimento: um criativo com empatia real e inteligência emocional genuína.",
  "esquizoide-psicopata": "Você é um estrategista que pensa de dentro para fora. A visão intelectual do Esquizóide aliada ao poder de influência do Psicopata cria alguém capaz de transformar ideias abstratas em movimentos concretos, mas que frequentemente prefere operar nos bastidores, a uma distância segura da exposição direta. Liderança existe em você, mas costuma ser exercida através de ideias, estruturas e estratégias mais do que através de presença física contínua. Quando integradas, estas estruturas produzem um visionário com capacidade executiva, difícil de encontrar, impossível de ignorar.",
  "esquizoide-masoquista": "A combinação cria uma experiência interna densa e silenciosa. O Esquizóide retira a energia para a mente; o Masoquista a pressiona para baixo. O mundo exterior pode não perceber a intensidade do que acontece internamente, você carrega muito, pensa muito, sente muito, e raramente tudo isso encontra expressão proporcional. Há uma riqueza interior real que fica enterrada sob camadas de contenção e desconexão. A integração passa por habitar o corpo com presença e gentileza, e permitir que o que está dentro ganhe voz, forma e movimento.",
  "esquizoide-rigido": "Precisão intelectual aliada a organização interna, uma combinação que produz alguém de alta capacidade e funcionalidade real. A riqueza do universo interior Esquizóide é estruturada pela Rígida, criando uma mente que tanto gera ideias profundas quanto as executa com consistência. O desafio compartilhado: ambas as estruturas tendem a manter o mundo emocional à distância, uma por fragmentação, a outra por controle. A integração convida o sentir a ocupar o mesmo espaço que o pensar e o realizar.",
  "oral-esquizoide": "Um coração que anseia por amor aliado a uma mente que precisa de distância, uma polaridade que cria tensão interior constante e rica. Você deseja profundamente mas também teme o que a proximidade pode custar. Esta tensão não precisa ser resolvida: precisa ser habitada com consciência. Quando integradas, estas estruturas produzem alguém com empatia extraordinária e visão interior rara, capaz de sentir o outro com precisão e de compreender padrões que outros simplesmente não veem.",
  "oral-psicopata": "O anseio de ser amado combinado com a força de quem lidera, uma combinação poderosa e internamente complexa. Há uma necessidade de ser visto e validado que pode se disfarçar de generosidade ou liderança. A pergunta que esta combinação convida a explorar: quando você está servindo o outro porque genuinamente quer, e quando está buscando aprovação que ainda não aprendeu a dar a si mesmo? Quando integradas, estas estruturas criam um líder profundamente humano, alguém com força real e coração aberto ao mesmo tempo.",
  "oral-masoquista": "Duas estruturas de necessidade não atendida que se reforçam mutuamente, abandono e humilhação criando um padrão profundo de autossacrifício e sofrimento silencioso. Você carrega muito, oferece muito e frequentemente recebe pouco. A compaixão que emerge dessa experiência é real e rara, quem conhece a dor de dentro acolhe o outro com uma profundidade difícil de imitar. A transformação começa com a decisão de que você merece receber tanto quanto oferece, e que pedir não é fraqueza, é integração.",
  "oral-rigido": "Um coração que quer amar profundamente, contido por uma estrutura que aprendeu a gerenciar o amor. O Oral quer entregar-se; o Rígido organiza essa entrega. O resultado pode ser alguém que cuida com consistência mas raramente se permite ser completamente vulnerável no cuidado. A integração abre o amor sem perder a estrutura, e revela que a vulnerabilidade não desorganiza, ela completa o que a consistência começou.",
  "psicopata-esquizoide": "Um visionário estratégico que prefere a profundidade do pensamento à exposição direta. Você tem poder real de influência e visão clara, mas tende a exercê-los através de ideias e estruturas em vez de presença física contínua. A liderança existe mas opera com distância de segurança. Quando integradas, estas estruturas produzem alguém com profundidade filosófica e capacidade executiva, que pensa antes de agir e age com intenção precisa.",
  "psicopata-oral": "Força exterior e vulnerabilidade interior em permanente tensão. A fachada poderosa e persuasiva esconde um coração que também quer ser visto, sustentado, amado sem precisar impressionar. Esta tensão é sua fronteira de crescimento mais fértil. A integração acontece quando o poder deixa de ser uma defesa contra a necessidade, e você descobre que mostrar o que precisa não enfraquece sua liderança: a humaniza de forma definitiva.",
  "psicopata-masoquista": "Uma energia densa e contraditória: poder de cima, resistência de baixo. O Psicopata quer expandir e avançar; o Masoquista contém e resiste. Esta tensão interna pode gerar impasses intensos, ou, quando integrada, uma liderança de força e humanidade incomuns. Esta combinação conhece tanto a ambição quanto o peso das coisas, e quando as duas se encontram, cria alguém que lidera sem esmagar e resiste sem se prender.",
  "psicopata-rigido": "Excelência e poder em uma mesma estrutura, alguém que tanto domina quanto organiza, tanto lidera quanto entrega. O exterior brilha com competência real e presença inconfundível. O desafio compartilhado está no interior: ambas as estruturas tendem a manter o coração protegido atrás da performance e da eficiência. Muito realizado fora, com uma saudade crescente de profundidade e intimidade real por dentro.",
  "masoquista-esquizoide": "Peso corporal e distância mental, duas forças que criam isolamento a partir de direções diferentes. Você carrega muito internamente e ao mesmo tempo tem dificuldade de estar completamente presente no corpo que carrega esse peso. A riqueza interior existe mas fica enterrada sob tensão e desconexão. O caminho é a presença encarnada: habitar o corpo com gentileza crescente e permitir que o peso encontre expressão e movimento.",
  "masoquista-oral": "Duas estruturas que conhecem a dor de dentro, abandono e humilhação criando um núcleo profundo de necessidade não atendida. Você oferece muito, aguenta muito e frequentemente experimenta a vida como um esforço contínuo. A compaixão que nasce dessa experiência é extraordinária. A transformação radical começa com autocuidado genuíno, não como conceito, mas como prática diária de se tratar com a mesma generosidade que você naturalmente oferece ao mundo.",
  "masoquista-psicopata": "Força em conflito com força, uma batalha interna constante entre submissão e poder, entre suportar e avançar. Esta tensão pode gerar explosões ou implosões quando o sistema não encontra saída saudável. Quando integradas, estas estruturas criam uma liderança autêntica que conhece o peso real das coisas e ainda assim escolhe avançar, uma combinação de força genuína e humanidade que poucos possuem.",
  "masoquista-rigido": "Resistência e disciplina, um guerreiro silencioso e confiável que entrega muito e reclama pouco. A organização rígida cobre a pressão masoquista, criando alguém que funciona com consistência admirável mas que internamente carrega mais do que o mundo vê. A integração pede permissão para a leveza, descobrir que a vida pode ser também prazer, expansão e alegria, e não apenas resistência e entrega contínua.",
  "rigido-esquizoide": "Organização externa com profundidade interna, um ser que funciona exemplarmente no mundo mas habita universos muito mais ricos em seu interior. A estrutura rígida garante que o mundo veja competência; a esquizóide guarda mundos que raramente são compartilhados. A integração convida essa riqueza interior para o contato real, sem perder a organização que você construiu, mas deixando a profundidade também ser vista e recebida.",
  "rigido-oral": "O coração que controla o coração que anseia, a estrutura rígida gerencia a necessidade oral, criando alguém que cuida dos outros com consistência real mas tem dificuldade genuína em receber cuidado. A integração é paradoxal: você precisa aprender a ser tão bom em receber quanto é em dar. O amor verdadeiro flui quando deixamos de administrá-lo e o deixamos simplesmente acontecer.",
  "rigido-psicopata": "Excelência e poder numa combinação de alto rendimento, alguém que tanto realiza quanto influencia, tanto organiza quanto comanda. O exterior é brilhante e a competência é real. O desafio profundo é encontrar quem você é quando não está realizando ou liderando, o ser por baixo da função. Essa descoberta não diminui o poder: ela o enraíza em algo que nenhuma realização externa pode dar.",
  "rigido-masoquista": "Disciplina e resistência, você entrega muito, mantém muito e quase nunca pede. A organização rígida cobre o peso masoquista, criando uma persona de confiabilidade que raramente revela o custo interno que carrega. A integração pede dois movimentos simultâneos: relaxar o controle o suficiente para sentir o que está acumulado, e expandir o suficiente para não carregar tudo sozinho indefinidamente.",
};

// ── Functional dynamic library ──────────────────────────────────────────────────

const DINAMICAS_FUNCIONAIS: Record<keyof EstruturasPct, DinamicaFuncional> = {
  esquizoide: {
    trabalho: "No trabalho, você funciona melhor em profundidade do que em amplitude, prefere mergulhar fundo em um problema do que transitar entre muitos ao mesmo tempo. Ambientes de alta estimulação social ou com exigência constante de interação drenam sua energia de forma desproporcional. O rendimento máximo vem em espaços de autonomia, com tempo para pensar sem interrupção e projetos que demandam originalidade real.",
    relacoes: "Relacionamentos consomem energia de uma forma que você raramente verbaliza. Não é que você não quer as pessoas, é que a presença continuada exige um gerenciamento energético real que outros não percebem. Seus vínculos mais profundos são poucos, mas extraordinariamente intensos. Você é leal de uma forma que quem está fora não vê e quem está dentro raramente esquece.",
    estresse: "Sob estresse, você se retira, para dentro da cabeça, para a solidão, para o trabalho intelectual. A tendência é processar em silêncio e só então emergir com clareza ou solução. Outros podem interpretar isso como distância ou frieza. É, na verdade, o sistema funcionando como sabe: primeiro entende, depois responde.",
    decisoes: "Suas decisões são tomadas internamente, com um processo que pode parecer lento para quem está ao redor. Você analisa a fundo, considera múltiplas variáveis e frequentemente chega a conclusões que outros não haviam considerado. A dificuldade aparece quando é necessário decidir com velocidade ou quando o fator emocional tem mais peso do que a lógica.",
    energia: "Você é introvertido no sentido mais literal, a energia se regenera na solidão e se consome na interação. Grandes grupos e ambientes muito estimulantes criam fadiga real que precisa de tempo para se recuperar. Aprenda a respeitar esses ciclos: quando o sistema pede recolhimento, atendê-lo não é isolamento, é manutenção.",
    sombra: "O lado que você menos gosta de ver em si mesmo: a tendência ao isolamento que se torna prisão, a intelectualização que evita sentir, a dificuldade de se deixar impactar pelo outro. A sombra desta estrutura é o mundo que existe apenas na cabeça, rico demais para ser compartilhado, protegido demais para ser tocado. A cura está em trazer esse universo para o contato real, um passo de cada vez.",
  },
  oral: {
    trabalho: "No trabalho, você funciona melhor em ambientes colaborativos e relacionais, onde o contato humano faz parte do processo. Tarefas que exigem isolamento prolongado drenam sua energia de forma diferente. Você rende mais quando sente que o que faz importa para alguém, que há conexão no propósito. O reconhecimento genuíno importa, não como vaidade, mas como combustível.",
    relacoes: "Relacionamentos são, para você, o centro de gravidade da existência. Você investe profundamente nas pessoas, sente suas alegrias e dores quase como se fossem suas, e tem uma capacidade de cuidado que é raridade real. O desafio estrutural é perceber quando está dando em excesso para suprir uma necessidade que seria mais bem suprida olhando para dentro.",
    estresse: "Sob estresse, você tende a buscar o outro, falar, compartilhar, pedir apoio ou oferecer cuidado. A conexão é a âncora. Quando sozinho por muito tempo sob pressão, a energia cai de forma perceptível e o sistema emocional fica menos estável. Manter vínculos saudáveis não é dependência: para você, é uma necessidade legítima que merece ser honrada.",
    decisoes: "Você decide com o coração muito presente, o impacto emocional e relacional tem peso enorme no processo. Às vezes isso é precisamente a sabedoria necessária. Outras vezes, a decisão mais saudável é aquela que vai desagradar ou decepcionar alguém, e é aí que o sistema trava. Aprender a decidir por você mesmo é uma prática de longo prazo.",
    energia: "Sua energia tem baixa voltagem basal, não é preguiça, é como o sistema está organizado. Você precisa de carga regular através de conexões genuínas, propósito claro e autocuidado consistente. Quando bem carregado, sua presença tem calor e vitalidade reais. Quando vazio, a tendência é buscar o outro para reabastecer, o que pode criar ciclos de dependência que são diferentes de conexão.",
    sombra: "O que você menos quer ver: a dependência afetiva que se disfarça de generosidade, o auto-abandono que se parece com cuidado ao outro, a dificuldade de se sustentar por dentro. A sombra é o espaço onde a necessidade não atendida opera sem ser nomeada, sabotando relações justamente pelo excesso do que você quer delas. Nomear essa necessidade diretamente é o começo da integração.",
  },
  psicopata: {
    trabalho: "No trabalho, você funciona em alta performance e orientação a resultados. Ambientes sem desafio, sem progressão ou com burocracia excessiva frustram rapidamente, você foi feito para avançar, não para manter. Tem facilidade natural para liderar, articular visões e mobilizar recursos humanos. O risco é confundir eficiência com relação: times motivados por medo entregam menos do que times inspirados.",
    relacoes: "Relacionamentos tendem a ser funcionais e estruturados, você investe onde vê retorno real, onde há estimulação e respeito. A vulnerabilidade emocional é o território mais difícil: não porque não existe, mas porque expô-la parece, no sistema interno, equivalente a dar poder ao outro. A transformação relacional começa quando você descobre que mostrar o que precisa não é fraqueza, é confiança.",
    estresse: "Sob estresse, você avança, mais ação, mais controle, mais intensidade. A tendência é dominar a situação antes que ela te domine. Isso funciona em crises objetivas. Em crises emocionais, o mesmo padrão pode amplificar o problema: forçar solução onde o que é necessário é simplesmente estar presente e sentir.",
    decisoes: "Você decide com velocidade e convicção. A análise é rápida, o comprometimento é alto e a execução começa antes de muitos ainda estarem decidindo. O ponto cego é a consulta genuína: não como performance de participação, mas como abertura real para que o pensamento do outro mude o seu. As melhores decisões frequentemente chegam quando o ego sai da sala.",
    energia: "Você tem alta voltagem energética, a carga é abundante e o sistema precisa de descarga regular para não criar tensão crônica. Exercício físico intenso, projetos com visibilidade real e momentos de liderança são fontes naturais de descarga. Sem saídas saudáveis, a energia pode se acumular em tensão nos ombros, nuca e maxilar, o corpo guarda o que não foi expresso.",
    sombra: "O que você menos quer reconhecer: a necessidade de aprovação que se esconde atrás da performance, a vulnerabilidade que foi enterrada tão cedo que mal se lembra de onde está, o coração que quer ser amado de forma simples mas ainda não sabe como permitir. A sombra do Psicopata é a fragilidade original que a força veio proteger, e que ainda está lá, esperando ser encontrada.",
  },
  masoquista: {
    trabalho: "No trabalho, você é o colaborador que realmente entrega, presente, comprometido, confiável mesmo quando ninguém está olhando. A tendência é assumir mais do que deveria e reclamar menos do que seria saudável. O risco é a invisibilidade: fazer tanto sem pedir nada pode criar a impressão de que tudo está bem quando não está. Aprender a comunicar limites é uma habilidade profissional real.",
    relacoes: "Você é leal de uma forma que poucos conseguem manter. Uma vez que se compromete com alguém, vai até o fim, mesmo que o custo seja alto demais. O desafio estrutural é perceber quando a lealdade se tornou submissão: quando você permanece não porque quer, mas porque sair parece impossível ou perigoso. A saúde relacional começa quando você pode escolher ficar, e também escolher ir.",
    estresse: "Sob estresse, você aguenta. Silencia, comprime, continua funcionando quando outros já teriam parado. Isso é força real, e também é onde o sistema se cobra com mais severidade. O estresse crônico não atendido encontra saída no corpo: adoecimento, depressão, a explosão que vem do nada depois de longa contenção. Atender o estresse antes que ele se acumule é autocuidado, não fraqueza.",
    decisoes: "Você decide devagar e com muito peso, cada opção é avaliada pelo que pode custar, pelo que pode desagradar, pelo que pode criar conflito. A tendência é adiar a decisão que vai incomodar alguém, mesmo que essa decisão seja necessária e justa. Com o tempo, aprende-se que decisões adiadas não desaparecem: elas crescem.",
    energia: "Sua energia é densa e resistente, não é alta voltagem, mas é profunda e duradoura. Você tem capacidade de sustentar esforço por longos períodos sem colapsar. O problema é que o sistema raramente recebe tanta energia quanto gasta, a descarga que pede é expansão, expressão, movimento. Sem saídas regulares, a energia se acumula como tensão crônica em quadris, lombar e ombros.",
    sombra: "O que você menos quer ver: o padrão de suportar que se tornou identidade, o ressentimento silencioso que cresce enquanto você continua dizendo que está bem, a expansão que parece perigosa porque um dia custou amor. A sombra desta estrutura é a crença de que ocupar mais espaço, expressar mais, pedir mais, vai custar algo que você não pode perder. A cura começa quando você descobre que não vai.",
  },
  rigido: {
    trabalho: "No trabalho, você é referência, comprometido, preciso, entregador. Faz o que promete e frequentemente faz mais. O ambiente de alta performance é o seu habitat natural. O risco não está na entrega: está no custo. A perfeição como padrão cria uma pressão contínua sobre si mesmo que, com o tempo, esgota, não o corpo, mas o entusiasmo. Aprender a 'bom o suficiente' pode ser a expansão mais difícil.",
    relacoes: "Você é confiável nas relações, presente, consistente, capaz de sustentar vínculos com seriedade. O que está por baixo disso: um coração que sente profundamente mas mantém as emoções em circulação controlada. O outro pode experimentar você como distante ou formal em momentos onde esperava entrega emocional. Não é distância, é a armadura que nunca foi completamente removida.",
    estresse: "Sob estresse, você aumenta o controle, da situação, das emoções, do ambiente. Funciona em crises objetivas com eficácia notável. Em crises relacionais ou emocionais, o mesmo mecanismo pode criar mais distância exatamente quando conexão seria a solução. O sistema precisa de permissão para sentir sem imediatamente gerenciar o que sente.",
    decisoes: "Você decide com método, analisa, pondera, avalia critérios. Raramente age por impulso. A decisão costuma ser boa quando os critérios são claros. O ponto cego é o fator emocional: o que você realmente sente sobre a situação pode ter ficado de fora do processo de deliberação. A intuição emocional não é menos válida que a lógica, é frequentemente a informação que completa o quadro.",
    energia: "Seu fluxo energético é organizado e disponível, corre por canais definidos e produz resultado consistente. O sistema funciona bem nas dimensões de realização e controle. Encontra barreiras quando é convidado a circular no campo emocional e relacional, onde não há estrutura prévia, onde a entrega não tem garantia de retorno. É justamente aí que a maior expansão de energia é possível.",
    sombra: "O que você menos quer reconhecer: a rigidez que se disfarça de princípios, o coração que quer ser tocado mas desvia na hora em que o contato chega, o perfeccionismo que é autocobrança mascarada de padrão. A sombra da estrutura rígida é o ser sensível e profundo que existe por baixo do controle, que sente muito mais do que permite mostrar, e que ainda está esperando permissão para existir sem armadura.",
  },
};

/** Origem Reich/Lowen em linguagem acessível (1 parágrafo por estrutura). */
const DORES_LIVRO: Record<keyof EstruturasPct, string> = {
  esquizoide:
    "Na origem, o corpo aprendeu que existir era arriscado demais. A couraça não é frieza — é proteção contra um mundo que parecia grande demais. O sintoma relacional costuma ser distância: afastar-se antes de ser invadido.",
  oral:
    "A ferida nasce do abandono ou do suporte inconsistente na infância. O corpo colapsa para buscar apoio externo. Na relação, aparece como dar demais, pedir pouco e sentir que nunca é sustentado o suficiente.",
  psicopata:
    "Quando a vulnerabilidade foi punida cedo, o corpo expandiu-se para cima como defesa. Na relação, pode parecer forte e distante — o desafio é permitir que o coração apareça sem perder presença.",
  masoquista:
    "A humilhação repetida ensinou que expressar a vontade custava caro. O corpo comprime e aguenta. Na relação, surge como lealdade excessiva, dificuldade em dizer não e ressentimento silencioso.",
  rigido:
    "Quando amar foi punido ou não correspondido, o corpo organizou-se em couraça funcional. Na relação, parece confiável e competente — mas o coração pede espaço para sentir sem gerenciar cada emoção.",
};

const PERGUNTAS_TRANSFORMACAO: Record<keyof EstruturasPct, string> = {
  esquizoide:
    "O que mudaria na sua vida se você soubesse, no corpo, que é seguro estar aqui — sem precisar recuar para a mente?",
  oral:
    "E você, quem te sustenta quando você sustenta todo mundo? O que pediria hoje, sem culpa?",
  psicopata:
    "Quando ninguém está olhando, o que você sente — e o que permitiria sentir se não precisasse impressionar?",
  masoquista:
    "O que você engoliu por tanto tempo que o corpo ainda carrega? O que seria dizer não uma vez, com gentileza?",
  rigido:
    "E você, o que sente quando ninguém está olhando, quando não há nada a realizar, quando não há papel a cumprir?",
};

const PONTE_POSTURAL_SECUNDARIA: Partial<Record<keyof EstruturasPct, string>> = {
  oral: "Por baixo da organização, também há desejo de vínculo e acolhimento.",
  esquizoide: "Há também uma riqueza interior que pede presença no corpo.",
  masoquista: "Por baixo da postura ereta, o corpo ainda guarda pressão não dita.",
  psicopata: "A postura firme também comunica presença e comando.",
  rigido: "A organização corporal reflete contenção emocional cuidadosa.",
};

const CUIDADOS_FERIDA: Record<keyof EstruturasPct, string> = {
  esquizoide: "Pratique estar no corpo antes de recuar para a mente em momentos de pressão.",
  oral: "Observe onde você dá mais do que recebe — e pratique pedir algo concreto esta semana.",
  psicopata: "Permita um momento de vulnerabilidade com alguém de confiança, sem estratégia.",
  masoquista: "Diga não a uma pequena cobrança que você costumaria aceitar em silêncio.",
  rigido: "Deixe uma emoção aparecer sem corrigi-la ou organizá-la imediatamente.",
};

export {
  NOMES,
  APELIDOSS,
  FRASES_IDENTIDADE,
  PONTOS_FORTES,
  PONTOS_ATENCAO,
  FERIDAS,
  DORES_LIVRO,
  PERGUNTAS_TRANSFORMACAO,
  PONTE_POSTURAL_SECUNDARIA,
  CUIDADOS_FERIDA,
  RECURSOS,
  RECOMENDACOES,
  OBS_ROSTO,
  OBS_FRENTE,
  OBS_LADO,
  COMBO_POSTURAL_LEVE_ORAL,
  PERFIL_FISICO_HUMANO,
  SINTESE_ADJ_PRINCIPAL,
  SINTESE_FOCO,
  SINTESE_TOQUE_SECUNDARIO,
  PADROES_POSTURAIS,
  CENTROS,
  PADROES_ENERGETICOS,
  MENSAGENS,
  INTERPRETACOES,
  COMBOS,
  CARACTERISTICAS,
  ESTILOS_COMUNICACAO,
  PERFIS_UNICOS,
  DINAMICAS_FUNCIONAIS,
};