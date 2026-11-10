import type { EstruturasPct } from "@workspace/traco-imagem-engine";
import type { DinamicaFuncional, EstiloComunicacao } from "./types.js";

const NOMES: Record<keyof EstruturasPct, string> = {
  esquizoide: "Esquizóide",
  oral: "Oral",
  psicopata: "Psicopata",
  masoquista: "Masoquista",
  rigido: "Rígido",
};

/** Nome do traço, como a Letícia ensina. Apelidos (Executor, Visionário) não entram na tela. */
const APELIDOSS: Record<keyof EstruturasPct, string> = {
  esquizoide: "Esquizóide",
  oral: "Oral",
  psicopata: "Psicopata",
  masoquista: "Masoquista",
  rigido: "Rígido",
};

const FRASES_IDENTIDADE: Record<keyof EstruturasPct, string> = {
  esquizoide:
    "Você pensa fundo, cria mundos internos e enxerga o que muita gente passa batido. O que segue não é um rótulo: é um mapa de como essa profundidade se formou, o que ela protege e como ela pode viver com mais presença hoje.",
  oral:
    "Você sente o outro, aquece vínculos e comunica afeto com naturalidade. O que segue aprofunda esse jeito: de onde ele pode ter vindo, o que ele protege, o talento que nasceu dele e o custo de usá-lo o tempo todo.",
  psicopata:
    "Você organiza, lidera e faz as coisas andarem. O que segue aprofunda essa força: como ela pode ter nascido, o que ela evita sentir, o talento que carrega e o preço de nunca baixar a guarda.",
  masoquista:
    "Você aguenta, permanece e sustenta o que outros abandonam. O que segue aprofunda essa lealdade: a história possível por trás dela, a dor que protege, o recurso que criou e o convite a ocupar mais espaço.",
  rigido:
    "Você executa, capricha e mantém o que promete. O que segue aprofunda essa excelência: como ela pode ter virado proteção, o que fica preso por baixo dela e o caminho para sentir sem perder qualidade.",
};

const PONTOS_FORTES: Record<keyof EstruturasPct, string[]> = {
  esquizoide: ["Profundidade de pensamento", "Criatividade singular", "Intuição aguçada", "Visão que conecta o que parece separado", "Pensamento original"],
  oral: ["Empatia verdadeira", "Capacidade de criar vínculo", "Generosidade", "Escuta atenta", "Calor humano"],
  psicopata: ["Liderança natural", "Visão de caminho", "Poder de influência", "Determinação", "Presença que organiza o ambiente"],
  masoquista: ["Resistência duradoura", "Lealdade profunda", "Força silenciosa", "Comprometimento", "Compaixão nascida da experiência"],
  rigido: ["Disciplina", "Confiabilidade", "Excelência", "Organização", "Comprometimento com o que promete"],
};

const PONTOS_ATENCAO: Record<keyof EstruturasPct, string[]> = {
  esquizoide: ["Isolamento que vira prisão", "Dificuldade de estar presente no corpo", "Fugir para o pensamento quando a emoção chega", "Medo de ser visto de verdade"],
  oral: ["Dar demais e ficar vazio", "Dificuldade de receber", "Medo de ficar sozinho", "Abandonar a si mesmo para cuidar do outro"],
  psicopata: ["Dificuldade de mostrar fragilidade", "Controle que afasta", "Impaciência com o ritmo do outro", "Usar a força para não ser tocado"],
  masoquista: ["Aguentar demais em silêncio", "Dificuldade de se expandir", "Ressentimento guardado", "Dizer sim quando o corpo pede não"],
  rigido: ["Perfeccionismo que paralisa", "Dificuldade de se entregar", "Emoção sob controle constante", "Cobrar de si o que ninguém pediu"],
};

const FERIDAS: Record<keyof EstruturasPct, string> = {
  esquizoide:
    "A dor que esse padrão procura evitar raramente é falada em voz alta: a sensação de não caber, de ser demais ou de menos, de que o mundo invade ou rejeita. Por dentro pode haver um frio antigo — não falta de sentimento, mas medo de que o sentimento não tenha lugar seguro. A distância vira anestesia. Observe se essa experiência encontra eco em você, sem precisar forçar uma biografia.",
  oral:
    "A dor que esse padrão procura evitar é a de ficar sem sustentação: o vazio quando o outro se afasta, a angústia de precisar e não saber pedir, a vergonha de receber sem retribuir na hora. Pode parecer que pedir é fraqueza e que só o cuidado dado garante o lugar. Isso não define quem você é — ajuda a entender por que a solidão ainda aperta tanto. Observe se essa experiência faz sentido para você.",
  psicopata:
    "A dor que esse padrão procura evitar é a de ser vulnerável e pagar caro por isso: traição, humilhação, perda de dignidade. Controlar o ambiente vira anestesia contra o risco de depender. A força que nasce disso é real. O custo aparece quando quase ninguém te alcança por baixo da estratégia. Observe se isso encontra eco em você.",
  masoquista:
    "A dor que esse padrão procura evitar é a de ser criticado, diminuído ou expulso por ocupar espaço. Querer algo seu pode ter soado perigoso. Então o corpo aprende a comprimir desejo, voz e prazer. Aguentar vira prova de valor. Observe se essa leitura encontra eco — e se ainda hoje expandir parece, por um segundo, perigoso demais.",
  rigido:
    "A dor que esse padrão procura evitar é a de se entregar e não ser escolhido: a frustração de mostrar sentimento e sentir que isso não bastou, ou que foi usado contra você. Controlar a emoção e merecer pelo desempenho vira escudo. Por dentro o sentimento continua — só espera permissão para aparecer sem perder o padrão. Observe se essa história faz sentido para você.",
};

const RECURSOS: Record<keyof EstruturasPct, string> = {
  esquizoide:
    "O mesmo movimento que pode ter te afastado do mundo também desenvolveu uma mente capaz de criar o que ainda não existe. Você enxerga padrões, conecta ideias e imagina caminhos que outros não veem. Em uma reunião rasa, você já está três camadas à frente; em um problema complexo, encontra o fio que faltava. Quando essa visão deixa de ser só esconderijo e vira presença — quando o corpo acompanha a ideia — ela se torna um talento que o mundo realmente precisa.",
  oral:
    "O talento que nasceu desse movimento é concreto: você cria segurança emocional onde outros só negociam tarefa. Em uma sala tensa, desarma. Em uma crise de alguém próximo, fica. Pessoas saem do seu contato mais capazes de respirar. Quando essa generosidade nasce de um centro próprio — e não da urgência de não ficar só — ela deixa de ser sacrifício disfarçado e vira o seu recurso mais valioso: conexão verdadeira.",
  psicopata:
    "O mesmo impulso que pode ter te feito controlar o ambiente também desenvolveu uma presença que organiza e mobiliza. Você vê o caminho, articula e faz as coisas andarem quando outros ainda hesitam. Em caos, você decide; em dúvida coletiva, você corta o nó. Quando essa força deixa de ser só defesa e inclui vulnerabilidade escolhida, ela vira liderança que inspira confiança de verdade — não só obediência.",
  masoquista:
    "O mesmo padrão que pode ter te feito aguentar demais também desenvolveu uma resistência que permanece quando muita coisa cede. Você é leal, profundo e capaz de sustentar projetos, pessoas e crises longas. Quem está perto sabe: você não some na primeira dificuldade. Quando essa força deixa de ser só compressão e se expande — quando prazer e limite também cabem — ela vira persistência com dignidade, não sacrifício silencioso.",
  rigido:
    "O mesmo cuidado que pode ter te feito controlar a emoção também desenvolveu uma capacidade real de transformar visão em resultado. Você é confiável, organizado e entrega o que promete. Em meio a improvisos, você traz forma; em meio a promessas vagas, você fecha. Quando essa excelência deixa de ser só proteção e convive com fragilidade, ela vira competência com profundidade humana — qualidade sem couraça.",
};

const RECOMENDACOES: Record<keyof EstruturasPct, string[]> = {
  esquizoide: [
    "Escolha um momento do dia para sentir os pés no chão por alguns minutos, sem celular e sem tarefa.",
    "Permita um contato simples e seguro com alguém de confiança, um abraço ou uma conversa presencial, em dose pequena.",
    "Mostre algo que você criou a uma pessoa, em vez de guardar só para si.",
    "Quando a vontade de sumir chegar, nomeie o que está sentindo antes de se fechar por completo.",
    "Caminhe com atenção no corpo: passo, respiração, presença. Sem meta de desempenho.",
  ],
  oral: [
    "Pratique receber um cuidado pequeno sem imediatamente retribuir ou se sentir em dívida — e observe o que acontece no peito.",
    "Monte uma rotina simples só sua: sono, alimentação e um tempo do dia em que você não atende ninguém.",
    "Escolha uma situação concreta desta semana e peça algo específico a alguém de confiança, em uma frase clara.",
    "Quando a solidão apertar, pergunte-se o que você pode oferecer a si agora, antes de buscar o outro.",
    "Observe um momento em que você deu por medo de perder o vínculo — e experimente pausar antes do próximo 'sim' automático.",
  ],
  psicopata: [
    "Escolha uma relação segura e mostre um limite ou uma necessidade real, sem estratégia.",
    "Peça ajuda em algo que você conseguiria fazer sozinho, e permita que o outro contribua de verdade.",
    "Reserve um momento sem agenda de conquista: só presença, sem impressionar.",
    "Quando a impaciência subir, respire e escute a pessoa até o fim antes de responder.",
    "Pergunte-se o que você sente quando não está no papel de quem lidera ou resolve.",
  ],
  masoquista: [
    "Diga não a uma cobrança pequena que você costumaria engolir em silêncio.",
    "Expresse uma opinião simples em uma conversa, mesmo que cause um desconforto leve.",
    "Celebre um progresso seu sem minimizar com 'não foi nada'.",
    "Quando sentir vontade de aguentar sozinho, diga a alguém: 'isso está pesado para mim'.",
    "Permita um prazer pequeno no dia, sem precisar merecer antes.",
  ],
  rigido: [
    "Escolha uma tarefa cotidiana e faça-a de forma suficientemente boa, sem buscar a versão perfeita.",
    "Quando uma emoção aparecer, nomeie-a antes de organizar uma solução.",
    "Aceite um cuidado ou uma ajuda sem imediatamente sentir que precisa retribuir.",
    "Crie um espaço sem agenda: um tempo em que não há nada a entregar, provar ou realizar.",
    "Permita-se ser visto em uma falha pequena por alguém de confiança, e observe o que acontece por dentro.",
  ],
};

const OBS_ROSTO: Record<keyof EstruturasPct, string> = {
  esquizoide:
    "O rosto pode transmitir recolhimento e vida interior. O olhar muitas vezes parece olhar além do momento presente, como se parte de você habitasse outro lugar. Não é ausência de sentimento: é um jeito de se proteger pela distância e pela profundidade.",
  oral:
    "O rosto pode transmitir abertura e receptividade. Os olhos e a expressão costumam comunicar o desejo de contato e de ser alcançado. Há uma qualidade de quem sente o mundo antes de interpretar, e isso aparece no jeito de se mostrar.",
  psicopata:
    "O rosto pode transmitir presença imediata. O olhar costuma ser direto e a expressão comunica determinação. Antes mesmo da fala, há uma qualidade de quem organiza o espaço e sabe se posicionar.",
  masoquista:
    "O rosto pode guardar uma tensão suave, como de quem carrega muito por dentro. Os olhos expressam profundidade e força, às vezes com um peso do que ainda não foi dito. Não é fraqueza: é contenção aprendida.",
  rigido:
    "O rosto pode parecer organizado e equilibrado. A expressão costuma ser composta, com emoção presente mas contida. Há inteligência e presença no olhar, e também um cuidado em não se entregar demais.",
};

const OBS_FRENTE: Record<keyof EstruturasPct, string> = {
  esquizoide:
    "De frente, o corpo pode parecer mais estreito e ocupar pouco espaço, como se buscasse se proteger ficando menos visível. Ombros e tronco podem comunicar recolhimento. A leitura corporal aqui é um apoio cuidadoso, não um diagnóstico.",
  oral:
    "De frente, o corpo pode comunicar abertura e, ao mesmo tempo, uma tendência a ceder: peito menos expandido, ombros que caem um pouco para frente, cabeça um pouco avançada. É como se ainda buscasse um apoio externo. Isso é observação, não sentença.",
  psicopata:
    "De frente, a presença costuma se concentrar na parte de cima: ombros e peito comunicam expansão e comando. A metade inferior pode parecer menos expressiva. O corpo fala de força e de movimento para frente, com cautela na leitura.",
  masoquista:
    "De frente, o corpo pode parecer mais denso e comprimido, com tronco e quadril ocupando espaço de forma resistente. Ombros podem estar rebaixados. É um corpo que aprendeu a sustentar, mais do que a se expandir. Observação, não rótulo.",
  rigido:
    "De frente, o corpo pode parecer organizado e simétrico, com proporções equilibradas e postura ereta. Há uma beleza na estrutura que também pode ser proteção: manter tudo no lugar. Lemos isso com cuidado, sem transformar aparência em destino.",
};

const OBS_LADO: Record<keyof EstruturasPct, string> = {
  esquizoide:
    "De lado, o corpo pode parecer menos contínuo, como se a presença não chegasse por completo do chão à cabeça. Há uma qualidade de alguém que ainda está aprendendo a habitar o próprio corpo por inteiro.",
  oral:
    "De lado, pode aparecer a tendência a se inclinar para frente: cabeça e ombros um pouco além do eixo, peito menos aberto. O corpo comunica busca de apoio e de contato, com uma energia que pede sustentação.",
  psicopata:
    "De lado, peito e cabeça podem se projetar para frente, comunicando avanço e comando. A energia sobe e vai à frente. A leitura corporal sugere força na metade superior, com menos descida até os pés.",
  masoquista:
    "De lado, o corpo pode parecer comprimido, com ombros para dentro e mobilidade mais contida no centro. Há a impressão de alguém que carrega um peso invisível com consistência e, ao mesmo tempo, com pouco espaço para expandir.",
  rigido:
    "De lado, cabeça, ombros e quadril podem formar uma linha bem organizada. A postura ereta demais também pode revelar o cuidado de não se desorganizar. Controle postural e controle emocional muitas vezes caminham juntos neste padrão.",
};

const COMBO_POSTURAL_LEVE_ORAL =
  "Há também um traço de busca por vínculo no jeito de se mostrar, sem que o corpo pareça colapsado nas imagens.";

const PERFIL_FISICO_HUMANO: Record<keyof EstruturasPct, string[]> = {
  esquizoide: [
    "O corpo pode parecer ocupar pouco espaço, com um recolhimento que convida à observação antes da ação.",
    "A presença parece se concentrar mais no pensamento do que nos pés, como se ainda pedisse permissão para habitar o chão.",
  ],
  oral: [
    "O corpo comunica abertura e receptividade, uma postura que busca contato e sustentação.",
    "Há suavidade nos traços e uma tendência a ceder espaço, como quem espera ser acolhido.",
  ],
  psicopata: [
    "A presença corporal é imediata: tronco e ombros organizam o espaço ao redor antes de qualquer palavra.",
    "A força aparece mais na metade de cima, com movimento para frente e para cima.",
  ],
  masoquista: [
    "O corpo carrega densidade e peso, uma resistência silenciosa que revela quanto foi suportado por dentro.",
    "Há compressão perceptível, como se você tivesse aprendido a conter mais do que expandir.",
  ],
  rigido: [
    "Seu corpo comunica organização e equilíbrio, uma presença ereta que mantém tudo no lugar com cuidado.",
    "Há contenção perceptível: não é dureza vazia, mas uma forma de se proteger mantendo a compostura.",
    "As proporções parecem equilibradas, sugerindo alguém que aprendeu a funcionar bem no mundo.",
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
  esquizoide: "com necessidade de recolhimento e reflexão",
  oral: "com grande capacidade de vínculo e cuidado",
  psicopata: "com traços de liderança e determinação",
  masoquista: "com uma força de suporte que raramente pede ajuda",
  rigido: "com organização e compromisso com o que importa",
};

/** Quando o traço aparece em 3º no mapa: o que ele acrescenta sem roubar o centro. */
const TOQUE_TERCIARIO: Record<keyof EstruturasPct, string> = {
  esquizoide:
    "Em terceiro lugar no seu mapa, o Esquizóide acrescenta um espaço interior: você pensa antes de se entregar por completo e precisa de momentos só seus para não se perder no contato. Em uma semana cheia, esse recolhimento discreto pode ser sabedoria — desde que não vire fuga no exato momento em que a vida pede presença e conversa difícil.",
  oral:
    "Em terceiro lugar no seu mapa, o Oral acrescenta calor e sede de vínculo: mesmo quando outro traço conduz, você ainda busca ser visto e cuidar. Isso humaniza o perfil — há ternura sob a estratégia ou sob a forma. O cuidado é não se esvaziar dando o que ninguém pediu, nem usar o afeto como moeda para garantir lugar.",
  psicopata:
    "Em terceiro lugar no seu mapa, o Psicopata acrescenta impulso de avanço e de organizar o entorno. Quando a situação pede corte limpo ou decisão rápida, essa força aparece. O cuidado é não usá-la só para não sentir: liderar a agenda externa enquanto a vida emocional fica sem dono.",
  masoquista:
    "Em terceiro lugar no seu mapa, o Masoquista acrescenta capacidade de aguentar e permanecer. Você sustenta o que importa por tempo longo — projetos, vínculos, crises — com uma fidelidade quieta. O risco é carregar além do justo e só perceber o excesso quando o corpo ou o ressentimento já cobraram. Nomear o limite a tempo não apaga essa virtude: a torna sustentável.",
  rigido:
    "Em terceiro lugar no seu mapa, o Rígido acrescenta ordem, capricho e compromisso com a qualidade. Você fecha o que começa e mantém o padrão mesmo quando o centro emocional puxa para outro lado. O convite é deixar a excelência servir à vida e ao vínculo — não substituir o afeto por desempenho.",
};

const PADROES_POSTURAIS: Record<keyof EstruturasPct, string> = {
  esquizoide:
    "O corpo pode parecer mais estreito e menos contínuo, com ombros recolhidos e pouco espaço ocupado. Há uma qualidade de ausência parcial, como se só parte da pessoa estivesse presente. A leitura corporal é um apoio, não uma sentença sobre quem você é.",
  oral:
    "O corpo pode comunicar um ceder suave de cima para baixo: peito menos aberto, ombros para frente, cabeça um pouco avançada. Parece ainda buscar um apoio externo. Isso fala de necessidade de sustentação, não de fraqueza.",
  psicopata:
    "O corpo pode mostrar expansão na metade de cima: ombros largos, peito projetado, cabeça erguida. A vitalidade sobe e vai para frente. Pernas e base podem parecer menos expressivas. É um corpo de comando, e também de proteção.",
  masoquista:
    "O corpo pode parecer pressionado de cima para baixo: pescoço mais curto, ombros rebaixados, tronco denso. A tensão em quadris e lombar sugere o que foi guardado. É um corpo de resistência, que ainda pede espaço para expandir.",
  rigido:
    "O corpo pode parecer ereto e alinhado, com proporções equilibradas. A organização é notável. A contenção do movimento também pode espelhar a contenção emocional: manter a forma para não se desorganizar.",
};

const CENTROS: Record<keyof EstruturasPct, string> = {
  esquizoide: "Cabeça e nuca, onde o pensamento concentra a proteção e o corpo ainda pede permissão para ser habitado por inteiro.",
  oral: "Peito e garganta, onde se guarda o não-dito e a necessidade de contato e sustentação.",
  psicopata: "Peito, ombros e pescoço, região de poder e expansão, onde a força se acumula e nem sempre desce até os pés.",
  masoquista: "Quadril, lombar e coxas, onde a tensão se acumula quando muito foi engolido e pouco foi expresso.",
  rigido: "Peito e centro emocional, onde o sentimento está presente, mas protegido pela compostura.",
};

const PADROES_ENERGETICOS: Record<keyof EstruturasPct, string> = {
  esquizoide:
    "A atenção tende a subir para o pensamento antes de chegar ao corpo. Você pode passar muito tempo alerta por dentro e pouco tempo em descanso pleno. O desafio é aproximar o que você pensa do que você sente e faz.",
  oral:
    "A energia costuma se esvaziar mais rápido e pedir recarga no contato com o outro. Sozinho por muito tempo, você pode sentir a vitalidade cair. O desafio é aprender a se reabastecer também por dentro, sem abandonar o vínculo.",
  psicopata:
    "A força sobe para peito, cabeça e braços. Abaixo da cintura, o fluxo pode diminuir. Ombros e nuca guardam tensão quando a descarga não acontece. Você precisa de saídas reais: movimento, verdade e descanso de performance.",
  masoquista:
    "A energia pode ficar presa no centro do corpo. Quando a pressão sobe demais, pode sair em explosão, cansaço profundo ou tristeza. O corpo pede expansão e expressão que a proteção ainda hesita em permitir.",
  rigido:
    "A energia costuma ser organizada e disponível para realizar. Encontra barreira quando precisa circular no sentimento e na relação. Você sente mais do que permite mostrar. O desafio é deixar o fluxo chegar onde o controle costuma fechar a porta.",
};

const MENSAGENS: Record<keyof EstruturasPct, string> = {
  esquizoide:
    "Sua visão interior é um recurso real, não um defeito. Cada vez que você ancora presença no corpo e permite ser visto em doses pequenas, descobre que existir aqui pode ser mais seguro do que a proteção antiga sugeria. Isso não é performance: é integração gradual — e você não precisa abandonar a profundidade para pertencer.",
  oral:
    "Receber apoio não enfraquece o seu jeito de cuidar. Quanto mais centro próprio você constrói — rotina, limite, a coragem de pedir — mais consegue sustentar vínculos sem se esvaziar. Pedir o que precisa faz parte de como você funciona melhor, não de uma falha. O outro deixa de ser muleta e volta a ser companhia.",
  psicopata:
    "Sua força já está provada. O próximo passo é permitir que vulnerabilidade e liderança caminhem juntas: mostrar limite e necessidade não reduz influência — aumenta confiança. Quem te segue de verdade precisa poder te alcançar.",
  masoquista:
    "Suportar não precisa ser a sua única identidade. Expansão, prazer e leveza também cabem em você. Dizer não em doses pequenas reescreve o padrão antigo sem apagar a sua lealdade. Você pode permanecer — e também pode caber.",
  rigido:
    "Sua competência é real e valiosa. Por baixo do controle existe sensibilidade que também precisa de espaço. Relaxar não é perder padrão: é ampliar o que você consegue sentir e viver sem deixar de ser quem você é. A excelência ganha alma quando o afeto também tem lugar.",
};

const INTERPRETACOES: Record<keyof EstruturasPct, string[]> = {
  esquizoide: [
    "No começo, estar inteiro no mundo pode ter parecido arriscado: rejeição, frieza ou invasão. A proteção foi se afastar, observar e criar um universo interior rico o bastante para não depender do acolhimento externo. Você pode ter aprendido que pensar era mais seguro do que sentir e ser visto. Observe se essa origem encontra eco na sua história — sem precisar forçar uma narrativa única.",
    "Com o tempo, essa proteção desenvolveu um talento real: profundidade, criatividade e capacidade de ver o que outros não veem. Você conecta ideias, antecipa padrões e habita nuances. Ao mesmo tempo, o corpo pode ter ficado um pouco de fora da conversa: presente no mundo das ideias, menos habitado no chão. A solidão vira fortaleza e, às vezes, prisão. O trabalho não é se tornar outra pessoa: é reunir mente, corpo e vínculo no mesmo endereço.",
    "Hoje isso pode aparecer como necessidade clara de espaço, cansaço rápido em ambientes barulhentos ou superficiais, e uma vida interior que poucos conhecem de verdade. Você pode ser leal e intenso nos poucos vínculos que escolhe — e sumir quando a proximidade aperta demais. Em uma festa, observa; em um projeto profundo, brilha. O desafio é confiar, em doses, que é seguro existir aqui sem abandonar a riqueza que já é sua.",
    "O caminho passa pelo corpo e pela presença. Enquanto a mente já habita mundos sofisticados, o corpo espera a mesma atenção: pés no chão, respiração, um contato pequeno e real. Cada vez que você ancora a riqueza interior no aqui e agora — sem exigir de si uma sociabilidade que não é a sua — a experiência de ser você fica mais inteira.",
    "Integrar o Esquizóide não é se tornar 'comum' nem forçar extroversão. É trazer o universo interior para o contato com o mundo no seu ritmo. Quando a presença acompanha a visão, surge alguém criativo, seletivo e profundamente autêntico — capaz de pertencer sem se dissolver.",
  ],
  oral: [
    "No começo, o suporte pode ter faltado ou chegado de forma irregular: colo presente e depois ausente, afeto que aquecia e sumia, uma casa em que cuidar do outro era o caminho mais seguro de não ficar só. A proteção foi buscar o outro — sentir, cuidar, se ligar. Você pode ter aprendido que o afeto vem de fora e que garantir o vínculo era a forma de garantir a si. Observe se essa história faz sentido para você.",
    "Com o tempo, essa proteção moldou um radar fino para o estado emocional alheio. Você aprendeu a aquecer o ambiente e a ficar quando alguém quebra. O custo dessa aprendizagem: a energia própria passou a depender demais do contato. Quando a conexão some, não é só falta de companhia — é como se faltasse chão. Observe se essa troca (dar para se sentir inteiro) ainda opera em você.",
    "Hoje o padrão aparece menos como uma lista de sintomas e mais como um jeito de se posicionar: o vínculo vem primeiro; a própria necessidade, depois. Você se reconhece no papel de quem sustenta o clima. O risco não é amar — é confundir proximidade com combustível e adiar o centro próprio. O desafio é manter a abertura sem fazer dela a única fonte de estabilidade.",
    "O caminho passa por pedir, receber e se apoiar em si mesmo com a mesma entrega com que você cuida. Não como prêmio por ter sido 'bom o bastante', e sim como direito. Limites claros, rotina que te nutre e a coragem de dizer 'preciso' não apagam o vínculo: tornam o vínculo sustentável. Quanto mais você se sustenta, mais o cuidado que oferece deixa de ser fuga e vira escolha.",
    "Integrar o Oral é descobrir plenitude por dentro sem fechar a receptividade. Não é endurecer nem deixar de amar. É ter um centro tão forte quanto a capacidade de cuidar e se ligar que você já carrega — para que o outro seja companhia, não muleta.",
  ],
  psicopata: [
    "No começo, a vontade pode ter sido interrompida e confiar pode ter custado caro: promessas quebradas, humilhação, um ambiente em que baixar a guarda doía. A proteção foi expandir, controlar e liderar. Você pode ter aprendido que força evita dor e que organizar o entorno é a forma mais segura de existir. Observe se isso encontra eco na sua vida.",
    "Com o tempo, essa proteção desenvolveu magnetismo, visão e capacidade de fazer as coisas andarem. O corpo comunica presença antes da fala; em uma sala, as pessoas sentem que alguém está conduzindo. O preço pode ter sido a distância da própria fragilidade: quanto mais forte por cima, menos espaço para ser cuidado. A performance protege — e também isola.",
    "Hoje isso pode aparecer como alta performance, impaciência com lentidão e dificuldade de mostrar necessidade mesmo quando o corpo pede pausa. Você investe onde há respeito e estímulo; some de dinâmicas sem tensão criativa. Em crise objetiva, brilha. Em crise emocional, pode tentar 'resolver' o que precisava ser sentido. O desafio é descobrir que vulnerabilidade, nos momentos certos, não diminui liderança: humaniza e aprofunda a confiança.",
    "O caminho passa por descer. Trazer a força até o chão, até as pernas, até o descanso sem agenda de conquista. Pedir ajuda em algo que você conseguiria fazer sozinho. Mostrar um limite real sem estratégia. Quando o poder vem do corpo inteiro e da verdade — não só da fachada — ele se torna sustentável.",
    "Integrar o Psicopata é permitir que a força e a fragilidade convivam. Quem conhece o próprio limite inspira uma lealdade que a performance sozinha nunca alcança. Você continua capaz de avançar — e passa a ser alcançável.",
  ],
  masoquista: [
    "No começo, expressar vontade pode ter custado crítica, humilhação ou pressão para se adaptar. A proteção foi engolir, aguentar e continuar. Você pode ter aprendido que ceder era mais seguro do que expandir, e que a lealdade garantia o lugar. Observe se essa leitura encontra eco em você.",
    "Com o tempo, essa proteção desenvolveu persistência, profundidade e capacidade de sustentar o que outros abandonam. Você permanece quando a novidade passa. O corpo pode ter comprimido o que não podia ser dito: desejo, raiva, prazer. A força silenciosa é real. O custo é o prazer adiado e o espaço que você ainda hesita em ocupar — como se expandir fosse trair alguém.",
    "Hoje isso pode aparecer como fazer demais, reclamar de menos e permanecer em situações que já pedem mudança. Você conhece a dor de perto e por isso acolhe o outro com uma profundidade rara. Em um projeto longo, você é âncora. Em uma relação desequilibrada, pode demorar a sair. O desafio é descobrir que o mundo não desaba quando você diz não — e que dizer não também é forma de amor.",
    "O caminho é a expansão gradual, não a explosão. Um tom a mais na voz, um limite pequeno nomeado cedo, um prazer permitido sem precisar 'merecer'. Cada vez que você expressa em vez de engolir, o corpo aprende que há saída além de aguentar. Persistência continua sendo sua — agora com dignidade e escolha.",
    "Integrar o Masoquista é lembrar que alegria e leveza não são prêmio por sofrimento. São direito. A vida espera que você floresça além do que foi suportado — sem abandonar a lealdade que já é sua marca.",
  ],
  rigido: [
    "No começo, demonstrar sentimento ou se entregar pode ter trazido frustração, rejeição ou a sensação de não ser escolhido. Como proteção, você pode ter aprendido a controlar a emoção e a merecer carinho sendo correto, competente e admirável. A excelência virou ponte para o afeto. Observe se essa história faz sentido para a sua vida.",
    "Com o tempo, essa proteção desenvolveu organização, confiabilidade e capacidade real de transformar visão em resultado. O corpo se mantém unido; a postura comunica competência. As pessoas confiam em você porque você entrega. O preço pode ser a dificuldade de se desorganizar o suficiente para sentir: o que fica represado não desaparece — espera uma saída segura, e às vezes vira tensão, cobrança ou distância sem intenção.",
    "Na vida adulta, essa estratégia pode continuar em cenas cotidianas: você capricha além do pedido; sente culpa ao descansar; tem dificuldade de mostrar fragilidade mesmo quando gostaria de acolhimento; prefere 'resolver' a emoção a habitá-la. Por fora você opera com clareza. Por dentro, o sentimento pede permissão. O desafio não é perder padrão — é deixar o padrão servir à vida, não substituí-la.",
    "O caminho passa por flexibilizar o controle com intenção. Fazer o suficientemente bom em uma tarefa. Nomear o que sente antes de organizar a solução. Aceitar cuidado sem transformar em dívida. Quando você relaxa o suficiente para sentir sem corrigir na hora, a competência ganha profundidade humana.",
    "Integrar o Rígido é descobrir quem você é quando não precisa provar. A pergunta viva é: o que aparece quando ninguém está olhando, quando não há meta nem papel? A resposta mostra o que ainda pede cuidado — e o que já está pronto para crescer com você, não apesar de você.",
  ],
};

const COMBOS: Record<string, string> = {
  "esquizoide-oral":
    "pode haver um movimento constante entre se recolher para pensar e desejar pertencer. A profundidade pede espaço; o vínculo pede proximidade. Quando as duas forças conversam, surge alguém capaz de unir visão interior e calor humano.",
  "esquizoide-psicopata":
    "pode haver visão clara e capacidade de influenciar, muitas vezes exercidas a uma distância segura. A liderança existe, mas prefere ideias e estratégia à exposição contínua. Integradas, essas forças criam um visionário com presença real.",
  "esquizoide-masoquista":
    "pode haver muita vida por dentro e pouca saída por fora. O pensamento se afasta e o corpo segura. A riqueza interior pede presença e voz para deixar de ficar presa sob o silêncio.",
  "esquizoide-rigido":
    "pode haver precisão mental com organização na vida prática. As ideias ganham forma, mas o sentimento pode ficar à distância. A integração convida o calor humano a ocupar o mesmo espaço do pensamento e da entrega.",
  "oral-esquizoide":
    "pode haver desejo de vínculo e, ao mesmo tempo, medo de se perder na proximidade. Você quer perto e também precisa de espaço. Habitar essa tensão com consciência permite empatia profunda sem invasão.",
  "oral-psicopata":
    "pode haver necessidade de ser visto misturada à força de quem lidera. Às vezes a generosidade espera uma retribuição que não foi pedida. O caminho é pedir com clareza e deixar a força servir ao vínculo, não escondê-lo.",
  "oral-masoquista":
    "pode haver um padrão profundo de dar e aguentar. Abandono e crítica, quando se encontram, reforçam o autossacrifício. A compaixão que nasce disso é rara. A transformação começa quando você também se coloca na conta do cuidado.",
  "oral-rigido":
    "pode haver desejo de vínculo organizado pela necessidade de manter a forma. Você cuida com consistência e ainda assim regula o quanto se entrega e o quanto recebe — como se o afeto precisasse estar bem feito para ser seguro. A integração é aprender a receber sem perder estrutura, e a se entregar sem transformar o cuidado em tarefa.",
  "psicopata-esquizoide":
    "pode haver poder de influência exercido mais por ideias do que por exposição. Você pensa antes de avançar e avança com intenção. A liderança ganha profundidade quando a presença também se permite aparecer.",
  "psicopata-oral":
    "pode haver força por fora e necessidade de acolhimento por dentro. A performance protege o desejo de ser visto sem impressão. Quando o poder deixa de esconder a necessidade, a liderança se humaniza.",
  "psicopata-masoquista":
    "pode haver avanço e contenção ao mesmo tempo. Uma parte quer expandir; outra segura. Sem saída saudável, a tensão sobe. Integradas, essas forças criam liderança com raiz e humanidade.",
  "psicopata-rigido":
    "pode haver alto rendimento: liderar e organizar, influenciar e entregar. O exterior brilha. O desafio é o interior: quem você é quando não está realizando. Essa descoberta enraíza o poder.",
  "masoquista-esquizoide":
    "pode haver peso no corpo e distância na mente. Você carrega muito e, ao mesmo tempo, se afasta. A presença gentil no corpo abre caminho para a riqueza interior aparecer.",
  "masoquista-oral":
    "pode haver dor conhecida de perto e generosidade grande. Você oferece e aguenta. A transformação pede autocuidado concreto: receber sem culpa e se tratar com a mesma gentileza que oferece ao outro.",
  "masoquista-psicopata":
    "pode haver luta interna entre se submeter e avançar. Quando encontra saída, essa tensão vira liderança que conhece a dor e ainda assim escolhe crescer sem esmagar.",
  "masoquista-rigido":
    "pode haver resistência disciplinada: entregar muito e reclamar pouco. A organização cobre o peso. A integração pede permissão para leveza, prazer e apoio.",
  "rigido-esquizoide":
    "pode haver competência no mundo e universos ricos por dentro. O exterior funciona; o interior raramente é compartilhado. A integração convida a profundidade a ser vista sem perder a organização.",
  "rigido-oral":
    "pode haver desejo de vínculo gerido pela organização. Você cuida com consistência e regula a entrega. A integração é receber com a mesma competência com que oferece, sem administrar cada troca afetiva.",
  "rigido-psicopata":
    "pode haver excelência e influência juntas. Muito realizado por fora, com saudade de profundidade por dentro. Descobrir o ser atrás da função não diminui o poder: aprofunda.",
  "rigido-masoquista":
    "pode haver disciplina cobrindo um peso antigo. Você entrega, mantém e quase não pede. A integração pede relaxar o suficiente para sentir o acumulado e expandir o suficiente para não carregar tudo sozinho.",
};

const CARACTERISTICAS: Record<keyof EstruturasPct, string[]> = {
  esquizoide: [
    "Corpo que ocupa pouco espaço",
    "Ombros recolhidos",
    "Presença mais mental do que corporal",
    "Traços alongados",
    "Recolhimento antes da ação",
    "Olhar profundo e distante",
  ],
  oral: [
    "Peito menos aberto",
    "Ombros que caem para frente",
    "Postura que busca apoio",
    "Expressão receptiva",
    "Suavidade nos traços",
    "Energia que pede contato",
  ],
  psicopata: [
    "Ombros mais largos que o quadril",
    "Peito projetado",
    "Presença forte na metade de cima",
    "Cabeça erguida",
    "Postura de comando",
    "Base menos expressiva que o tronco",
  ],
  masoquista: [
    "Corpo mais denso e comprimido",
    "Pescoço aparentemente curto",
    "Tronco largo",
    "Quadril marcado",
    "Tensão em lombar e coxas",
    "Ombros rebaixados",
  ],
  rigido: [
    "Postura ereta e organizada",
    "Simetria corporal",
    "Proporções equilibradas",
    "Compostura no movimento",
    "Alinhamento claro",
    "Expressão contida",
  ],
};

const ESTILOS_COMUNICACAO: Record<keyof EstruturasPct, EstiloComunicacao> = {
  esquizoide: {
    tipo: "Reservado e profundo",
    descricao:
      "Você escolhe as palavras com cuidado. Fala quando há necessidade verdadeira ou quando um tema desperta interesse real. No silêncio, você está pensando e processando, não ausente.",
    emGrupos:
      "Em grupos, observa mais do que participa. A conversa rasa cansa rápido. Com a pessoa certa, em um espaço seguro, pode falar por horas com uma riqueza que surpreende quem só te conhecia calado.",
    emRelacoes:
      "Prefere profundidade à pressa. Expressar o que sente em voz alta pode ser mais difícil do que compreender o que sente. Os outros podem ler o seu silêncio como distância. Raramente é isso.",
    emConflito:
      "Diante do conflito, o impulso é recuar e processar por dentro. Raramente responde no calor da hora. Quando responde, costuma trazer clareza e precisão.",
    emTensao:
      "Na tensão alta, você pode desaparecer por dentro: presente no corpo, ausente na troca. Pode levar tempo até as palavras certas chegarem. Isso não é fraqueza. É o seu ritmo.",
  },
  oral: {
    tipo: "Expressivo e relacional",
    descricao:
      "Você se comunica com abertura. A emoção aparece na voz, no tom e no gesto. Falar ajuda a organizar o que sente: a conversa é conexão, não só troca de informação. Em grupos, aquece o ambiente e percebe o que o outro precisa ouvir.",
    emGrupos:
      "Em grupos, busca calor genuíno e frequentemente aquece o ambiente. Percebe o que o outro precisa ouvir e tem generosidade para dizer. Pode ser o centro emocional sem ser o mais falante.",
    emRelacoes:
      "Nas relações íntimas, a comunicação flui. Você compartilha com facilidade. O desafio é perceber quando fala para aliviar a ansiedade e quando fala para conectar de verdade.",
    emConflito:
      "No conflito, tende a harmonizar. Às vezes cede antes de dizer o que realmente pensa, só para recuperar o calor. Com o tempo, o não-dito vira peso. Aprender a discordar sem abandonar o vínculo é um dos seus maiores treinamentos.",
    emTensao:
      "Sob tensão, pode falar mais para manejar a ansiedade. Uma frase clara vale mais do que dez mensagens de apaziguamento.",
  },
  psicopata: {
    tipo: "Direto e estratégico",
    descricao:
      "Você comunica com presença. A voz organiza o espaço e as palavras têm peso. Fala com convicção e sabe se posicionar.",
    emGrupos:
      "Em grupos, tende a articular, resumir ou direcionar. Percebe a dinâmica rápido e sabe onde se colocar para ser ouvido. Não precisa falar muito. Quando fala, é ouvido.",
    emRelacoes:
      "Nas relações, a comunicação pode ser objetiva. O que sente passa por filtros antes de ganhar voz. O desafio é deixar a vulnerabilidade também aparecer, porque ela completa a força.",
    emConflito:
      "No conflito, é direto, às vezes mais do que o outro esperava. Defende o ponto com persistência. Persuasão duradoura pede que o outro se sinta ouvido antes de ser convencido.",
    emTensao:
      "Sob pressão, o tom pode endurecer e a escuta encolher. Perceber isso é liderança real: o que você diz só funciona se puder ser recebido.",
  },
  masoquista: {
    tipo: "Contido e reflexivo",
    descricao:
      "Você pensa muito antes de falar. O que diz carrega peso e consideração. Guardar é mais natural do que expressar. As palavras têm custo.",
    emGrupos:
      "Em grupos, prefere observar ou apoiar. Não precisa dominar a conversa. Quando fala, costuma ser preciso e oportuno.",
    emRelacoes:
      "Nas relações, é discreto e confiável. Guarda o que o outro compartilha. Também guarda o próprio sentimento por tempo demais. Os outros podem não saber o quanto você carrega.",
    emConflito:
      "No conflito, a tendência é engolir. Prefere silenciar e processar. O ressentimento pode crescer nessa contenção e sair mais tarde, de formas inesperadas.",
    emTensao:
      "Sob tensão, o silêncio aprofunda. A pressão sobe enquanto a comunicação diminui. Às vezes tudo irrompe depois de longa contenção invisível.",
  },
  rigido: {
    tipo: "Preciso e estruturado",
    descricao:
      "Você se comunica com clareza. Sabe o que quer dizer e organiza o discurso. Há competência na fala, e isso transmite confiabilidade.",
    emGrupos:
      "Em grupos, pode liderar ou moderar. Tem facilidade para organizar o pensamento coletivo e trazer clareza quando a conversa se perde.",
    emRelacoes:
      "Nas relações íntimas, a comunicação pode parecer mais contida do que o outro espera. O sentimento está presente, mas passa por compostura antes de chegar à voz. Isso pode criar distância sem intenção.",
    emConflito:
      "No conflito, é racional e argumentado. Pode ter dificuldade com a dimensão emocional, que muitas vezes pede ser vista antes de ser resolvida.",
    emTensao:
      "Sob tensão, o controle aumenta. A comunicação fica mais formal e gerenciada. Funciona no curto prazo e pode isolar exatamente quando a conexão seria mais necessária.",
  },
};

/** Perfil do par principal+secundário (camada única; substitui a duplicação COMBOS/PERFIS). */
const PERFIS_PAR: Record<string, string> = {
  "esquizoide-oral":
    "Você combina profundidade rara com desejo genuíno de conexão — duas forças que muitas vezes puxam em direções opostas. A mente habita universos interiores enquanto a parte que busca vínculo anseia por pertencimento. O resultado pode ser alguém que precisa de solidão e também sofre com ela: deseja o contato e recua diante dele. Essa tensão não é defeito; é o campo da sua integração. Quando as duas se encontram, emerge alguém capaz de unir visão e sentimento, sem precisar escolher entre pensar e pertencer.",
  "esquizoide-psicopata":
    "Você pensa de dentro para fora e, ao mesmo tempo, sabe fazer as coisas andarem. A visão do Esquizóide aliada à influência do Psicopata cria alguém capaz de transformar ideias em movimento, muitas vezes preferindo os bastidores à exposição contínua. A liderança existe, mas costuma passar por ideias e direção. Quando as duas forças conversam, surge um visionário com capacidade de realizar — difícil de ignorar, e ainda assim seletivo sobre onde aparece.",
  "esquizoide-masoquista":
    "A combinação cria uma experiência interna densa e silenciosa. O Esquizóide leva a energia para o pensamento; o Masoquista a segura no corpo. O mundo pode não perceber a intensidade do que acontece por dentro. Há riqueza real sob contenção. A integração passa por habitar o corpo com gentileza e permitir que o que está dentro ganhe voz e movimento, sem precisar explodir para ser ouvido.",
  "esquizoide-rigido":
    "Precisão mental aliada à organização prática. A riqueza interior do Esquizóide ganha forma com o Rígido: você gera ideias profundas e as executa com consistência. O desafio compartilhado é que os dois tendem a manter o mundo emocional à distância. A integração convida o sentir a ocupar o mesmo espaço do pensar e do realizar — sem perder a qualidade do que você entrega.",
  "oral-esquizoide":
    "Um anseio de vínculo aliado a uma mente que precisa de distância. Você deseja profundamente e também teme o custo da proximidade: quer perto e, no mesmo movimento, precisa de espaço para não se dissolver. Em uma semana, pode buscar conversa intensa e no dia seguinte sumir para processar. Essa tensão não precisa ser apagada — precisa ser habitada com consciência e combinada em voz alta com quem está perto. Quando integradas, essas forças produzem empatia profunda e visão interior rara: alguém que cuida sem se perder, e que pensa sem abandonar o outro.",
  "oral-psicopata":
    "O desejo de ser visto combinado com a força de quem lidera. Pode haver necessidade de reconhecimento disfarçada de generosidade ou de condução. Em uma equipe, você aquece e também empurra; em um vínculo, pode cuidar e ao mesmo tempo testar se ainda é admirado. A pergunta viva é: quando você serve porque quer, e quando busca aprovação que ainda não aprendeu a dar a si? Integradas, essas forças criam alguém que conduz com humanidade — forte o bastante para pedir e próximo o bastante para ser seguido de verdade.",
  "oral-masoquista":
    "Duas histórias de necessidade não atendida podem se reforçar: abandono e crítica criando autossacrifício. Você carrega muito, oferece muito e frequentemente recebe pouco — e ainda assim permanece. A compaixão que nasce disso é rara. Em casa ou no trabalho, pode ser a pessoa que segura a emoção coletiva e engole a própria. A transformação começa com a decisão de que você merece receber tanto quanto oferece — e que pedir não é fraqueza: é o que torna o cuidado sustentável.",
  "oral-rigido":
    "A necessidade de vínculo encontra uma organização que aprendeu a dosar entrega e recebimento. O Oral quer se entregar por inteiro; o Rígido organiza essa entrega para não perder a forma. Na prática, você pode cuidar com uma consistência rara — lembrar datas, manter a palavra, sustentar a rotina do outro — e ainda assim regular o quanto se deixa ver frágil. Pode parecer que o amor precisa estar 'bem feito' para ser seguro. A integração é abrir o vínculo sem perder a forma: receber sem se desorganizar, entregar-se sem se abandonar e deixar o afeto existir também quando não está perfeitamente organizado.",
  "psicopata-esquizoide":
    "Você tem influência e visão, e prefere a profundidade do pensamento à exposição direta. Tende a exercer liderança por ideias e direção, com uma distância de segurança. Quando integradas, essas forças produzem profundidade e capacidade de agir com intenção precisa — alguém que avança sem precisar estar sempre no centro do palco.",
  "psicopata-oral":
    "Força por fora e necessidade de acolhimento por dentro em tensão permanente. A fachada poderosa pode esconder o desejo de ser visto e sustentado sem impressionar. A integração acontece quando o poder deixa de ser defesa contra a necessidade: mostrar o que você precisa humaniza a liderança e aprofunda a confiança de quem está perto.",
  "psicopata-masoquista":
    "Energia densa: uma parte quer avançar, outra contém. Sem saída saudável, a tensão sobe. Quando integradas, essas forças criam liderança com raiz e humanidade — alguém que conhece ambição e peso ao mesmo tempo, e que escolhe crescer sem esmagar nem se esconder atrás do aguentar.",
  "psicopata-rigido":
    "Excelência e poder na mesma composição. Você lidera e organiza, influencia e entrega. O exterior brilha. O desafio está no interior: quem você é quando não está realizando. Muito feito por fora pode conviver com saudade crescente de intimidade real por dentro — e essa descoberta não diminui o poder: enraíza.",
  "masoquista-esquizoide":
    "Peso no corpo e distância na mente. Você carrega muito e tem dificuldade de estar presente no corpo que carrega esse peso. A riqueza interior existe, mas fica enterrada. O caminho é a presença gentil: habitar o corpo e permitir expressão, para que o que foi guardado deixe de ser só carga e vire história compartilhada.",
  "masoquista-oral":
    "Dois jeitos que conhecem a dor de perto. Você oferece muito, aguenta muito e frequentemente vive a vida como esforço contínuo. A compaixão que nasce disso é extraordinária. A transformação começa com autocuidado concreto: tratando-se com a mesma generosidade que oferece ao mundo, e permitindo receber sem culpa.",
  "masoquista-psicopata":
    "Força em conflito com força: entre ceder e avançar. Sem saída, pode haver explosão ou implosão. Quando integradas, essas forças criam liderança autêntica que conhece o peso das coisas e ainda assim escolhe crescer — com dignidade, sem precisar se submeter nem dominar para se sentir seguro.",
  "masoquista-rigido":
    "Resistência e disciplina. Você entrega muito e reclama pouco; a organização cobre o peso. A integração pede permissão para leveza, prazer e alegria — não só resistência. Flexibilizar não apaga a lealdade: libera espaço para você também caber na conta do cuidado.",
  "rigido-esquizoide":
    "Organização no mundo e profundidade por dentro. Você funciona bem lá fora e habita universos ricos cá dentro. O Rígido mostra competência; o Esquizóide guarda o que raramente é compartilhado. A integração convida essa riqueza a ser vista e recebida, sem perder a clareza com que você opera no cotidiano.",
  "rigido-oral":
    "A necessidade de vínculo é gerida pela organização. Você cuida com consistência e regula a entrega: há calor, mas ele passa por um filtro de adequação. A integração pede aprender a receber apoio com a mesma competência com que oferece — sem administrar cada troca afetiva, sem transformar o carinho em tarefa a cumprir, e sem cobrar de si uma performance de amor.",
  "rigido-psicopata":
    "Excelência e influência em alto rendimento. O exterior é brilhante e a competência é real. O desafio é encontrar quem você é quando não está realizando ou liderando. Essa descoberta não diminui o poder: aprofunda. Você continua entregando — e passa a existir também além do que entrega.",
  "rigido-masoquista":
    "Disciplina e resistência. Você entrega, mantém e quase nunca pede. A organização cobre o custo interno. A integração pede dois movimentos: relaxar o suficiente para sentir o acumulado e expandir o suficiente para não carregar tudo sozinho — mantendo a qualidade, sem fazer dela a única prova de valor.",
};

/** @deprecated use PERFIS_PAR — mantido para compatibilidade. */
const PERFIS_UNICOS = PERFIS_PAR;

const DINAMICAS_FUNCIONAIS: Record<keyof EstruturasPct, DinamicaFuncional> = {
  esquizoide: {
    trabalho:
      "No trabalho, você rende na profundidade, não na dispersão. Prefere mergulhar em um problema a saltar entre dez reuniões rasas. Ambientes de interação constante drenam; autonomia, tempo para pensar e projetos que pedem originalidade real te fazem brilhar. Quando cobram presença social o tempo todo, a qualidade da entrega cai — não por falta de competência, e sim por falta de oxigênio interior.",
    relacoes:
      "Relacionamentos pedem uma energia que você raramente explica. Não é que você não queira as pessoas: a presença contínua exige um cuidado interno que outros não veem. Seus vínculos mais profundos são poucos e intensos. Você é leal de um jeito quieto. O desafio é avisar quando precisa de espaço — para que o outro não leia recolhimento como abandono.",
    estresse:
      "Sob pressão, você se retira para a mente, para a solidão ou para o trabalho de pensar. Processa em silêncio e só então emerge com clareza. Outros podem ler isso como frieza. É o seu sistema funcionando: primeiro entende, depois responde. O risco é demorar tanto no processamento que a vida real fica esperando na porta.",
    decisoes:
      "Suas decisões nascem por dentro, com um processo que pode parecer lento do lado de fora. Você analisa fundo e chega a conclusões que outros não viram. A dificuldade aparece quando a vida pede velocidade imediata ou quando o sentimento pesa mais do que a lógica — aí a mente tenta resolver o que o corpo ainda não nomeou.",
    energia:
      "Você se regenera na solidão e se consome na interação demais. Grupos grandes e ambientes muito estimulantes pedem recuperação deliberada. Quando você pede recolhimento, atender a isso não é isolamento: é manutenção. Sem essa pausa, a criatividade seca e o mundo começa a parecer invasivo.",
    sombra:
      "O que pode doer reconhecer: o isolamento que virou prisão confortável, o pensamento que evita sentir, a dificuldade de se deixar tocar mesmo por quem ama. A sombra é um mundo interior rico demais para ser compartilhado e protegido demais para ser alcançado. A cura começa em trazer um pedaço desse universo para o contato real — um passo, uma pessoa, uma conversa de cada vez.",
  },
  oral: {
    trabalho:
      "No trabalho, você rende onde há colaboração, sentido humano e a sensação de que o que faz importa para alguém. Isolamento longo drena; o reconhecimento genuíno não é vaidade — é combustível. Você costuma ser a pessoa que acolhe o clima da equipe, mediando tensões e lembrando do lado humano. O risco é virar suporte emocional não nomeado: dar tanto ao ambiente que sua própria entrega criativa fica em segundo plano.",
    relacoes:
      "Relacionamentos são o centro de gravidade. Você investe fundo, sente a dor e a alegria do outro e cuida com uma generosidade rara. Em uma briga, pode ceder cedo demais para recuperar o calor; em um silêncio do outro, pode inventar significados e se adiantar pedindo desculpas. O desafio é perceber quando está dando em excesso para preencher uma necessidade que pediria olhar para dentro — e praticar receber sem transformar o cuidado em dívida.",
    estresse:
      "Sob pressão, a âncora vira a conexão. Você quer falar com alguém de confiança, compartilhar o que pesa e pedir ou oferecer cuidado. Sozinho por muito tempo sob estresse, a energia cai e a mente pode amplificar o medo da solidão. Manter vínculos saudáveis, para você, é necessidade legítima — não luxo. O cuidado é não usar a conversa só para anestesiar a ansiedade, e sim para se organizar de verdade.",
    decisoes:
      "Você decide com o impacto relacional bem presente: quem vai sentir, quem pode se magoar, o que isso faz com o vínculo. Às vezes isso é sabedoria. Outras vezes, a decisão saudável é exatamente a que vai desagradar alguém — e aí você trava, adia ou pede confirmação demais. Aprender a decidir por si, mesmo com o peito apertado, é prática de longo prazo e um dos maiores gestos de autoamor do seu mapa.",
    energia:
      "Sua energia pede recarga em conexões genuínas, propósito e autocuidado concreto — sono, comida, um tempo do dia sem atender ninguém. Bem nutrido, você tem calor e vitalidade. Vazio, pode buscar o outro para se reabastecer e aí a conexão se confunde com dependência. A pergunta útil não é 'quem está disponível?'. É 'o que eu posso oferecer a mim agora?'.",
    sombra:
      "O que pode doer reconhecer: a dependência disfarçada de generosidade, o autoabandono que parece cuidado, a dificuldade de se sustentar por dentro sem um testemunho externo. Pode haver um medo antigo de que, se você parar de dar, o lugar some. Nomear a necessidade diretamente — preciso de colo, preciso de pausa, preciso que fique — é o começo da integração, não o fim do amor.",
  },
  psicopata: {
    trabalho:
      "No trabalho, você opera em alta performance e orientação a resultado. Ambientes sem desafio ou com burocracia demais frustram. Você lidera, articula e mobiliza. O risco é confundir eficiência com relação: times inspirados entregam mais do que times pressionados. Quando a presença vira só cobrança, a lealdade do entorno esfria mesmo que os números subam.",
    relacoes:
      "Relacionamentos tendem a ser estruturados e seletivos. Você investe onde há respeito e estímulo. Mostrar vulnerabilidade parece, por dentro, entregar poder. Parceiros e amigos próximos podem admirar sua força e ao mesmo tempo sentir dificuldade de te alcançar. A transformação começa quando você descobre que mostrar necessidade é confiança — não fraqueza — e que intimidade pede menos estratégia do que liderança.",
    estresse:
      "Sob pressão, você avança: mais ação, mais controle, mais intensidade. Funciona em crises objetivas. Em crises emocionais, o mesmo padrão pode forçar solução onde o que falta é presença e sentimento. Perceber a diferença entre 'preciso agir' e 'preciso sentir' é liderança madura sobre si mesmo.",
    decisoes:
      "Você decide com velocidade e convicção. A execução começa cedo. O ponto cego é a consulta genuína: deixar o pensamento do outro mudar o seu sem sentir que perdeu autoridade. As melhores decisões chegam quando o ego sai da sala e a escuta entra — sem abandonar a clareza que já é sua.",
    energia:
      "Você tem alta carga e precisa de descarga saudável: movimento, projetos com sentido e momentos de verdade sem performance. Sem saída, a tensão sobe para ombros, nuca e maxilar. O corpo guarda o que não foi expresso. Descansar sem agenda de conquista não é perda de tempo: é o que torna o poder sustentável.",
    sombra:
      "O que pode doer reconhecer: a necessidade de aprovação atrás da performance, a fragilidade antiga que a força veio proteger, a parte que quer ser vista de forma simples — sem impressionar. A sombra é essa fragilidade ainda à espera de ser encontrada. Integrá-la não diminui sua influência: aprofunda a confiança de quem está perto.",
  },
  masoquista: {
    trabalho:
      "No trabalho, você entrega de verdade: presente, comprometido, confiável em maratonas que outros abandonariam. A tendência é assumir demais e reclamar de menos. O risco é a invisibilidade — fazer tanto sem pedir nada pode parecer que está tudo bem quando não está. Comunicar limite cedo é competência, não drama. Quem valoriza sua constância precisa também ouvir quando o peso passou do justo.",
    relacoes:
      "Você é leal até o fim, mesmo quando o custo é alto. Acolhe a dor do outro com profundidade porque a conhece de perto. O desafio é perceber quando a lealdade virou submissão: permanecer não porque quer, mas porque sair parece impossível ou egoísta. Saúde relacional começa quando você pode escolher ficar e também escolher ir — sem transformar a saída em traição de si.",
    estresse:
      "Sob pressão, você aguenta. Continua funcionando quando outros já teriam parado. Isso é força — e também onde a cobrança interna aperta. Estresse não atendido encontra saída no corpo: peso, compressão, explosão tardia. Cuidar antes de acumular não é fraqueza. É o que impede a lealdade de virar autoapagamento.",
    decisoes:
      "Você decide com muito peso. Avalia o que pode custar e quem pode se magoar. Adia a decisão que incomoda, mesmo quando ela é justa. Decisões adiadas não somem: crescem e cobram juros no corpo e no vínculo. Praticar um 'não' pequeno e cedo treina o músculo das escolhas maiores.",
    energia:
      "Sua energia é densa e duradoura. Sustenta esforço longo. O problema é gastar mais do que recebe. A descarga que você precisa é expressão e expansão — voz, prazer, movimento, limite nomeado. Sem isso, a tensão se acumula e a vida vira só dever. Persistência com prazer é o alvo; persistência sem oxigênio é o risco.",
    sombra:
      "O que pode doer reconhecer: o aguentar que virou identidade, o ressentimento silencioso, a expansão que ainda parece perigosa. A sombra é a crença de que pedir mais vai custar o pertencimento. A cura começa quando você descobre que pode caber mais espaço — e que quem te quer de verdade também aguenta o seu limite.",
  },
  rigido: {
    trabalho:
      "No trabalho, você é referência: preciso, entregador, fiel ao que promete. Alta performance é habitat natural. O risco não está na entrega — está no custo. A perfeição como padrão esgota o entusiasmo e pode atrasar o 'pronto' em nome do 'impecável'. Aprender o suficientemente bom, em doses, pode ser a expansão mais difícil e a mais libertadora da sua carreira.",
    relacoes:
      "Você é confiável e consistente. Por baixo, sente profundamente e mantém a emoção sob cuidado. O outro pode te experimentar como formal exatamente quando esperava entrega espontânea. Não é distância fria: é a proteção que ainda não foi toda removida. Intimidade pede permissão para aparecer imperfeito — e isso, para você, pode ser mais assustador do que qualquer meta.",
    estresse:
      "Sob pressão, você aumenta o controle da situação e de si. Funciona em crises objetivas. Em crises emocionais, o mesmo mecanismo cria distância quando a conexão seria a solução. Você precisa de permissão para sentir sem gerenciar na hora — nomear o aperto antes de montar o plano.",
    decisoes:
      "Você decide com método. Raramente age por impulso. O ponto cego é o sentimento deixado de fora da deliberação. A intuição emocional não é menos válida que a lógica: muitas vezes completa o quadro. Incluir 'o que eu sinto sobre isso?' na lista de critérios não diminui a qualidade da escolha — aprofunda.",
    energia:
      "Sua energia é organizada e disponível para realizar. Encontra barreira no campo emocional e relacional, onde não há estrutura prévia. É justamente aí que a maior expansão é possível: um tempo sem agenda, um afeto sem roteiro, um erro pequeno permitido. Sem isso, a competência continua alta e a vida interior fica com sede.",
    sombra:
      "O que pode doer reconhecer: a rigidez disfarçada de princípio, a sensibilidade que quer contato e desvia na hora, o perfeccionismo que é autocobrança com roupa boa. A sombra é o ser sensível por baixo do controle — que sente mais do que permite mostrar. Olhar para isso com honestidade não destrói sua excelência: humaniza.",
  },
};

/** Dor associada ao traço, em linguagem acessível e hipotética. */
const DORES_LIVRO: Record<keyof EstruturasPct, string> = {
  esquizoide:
    "No cotidiano, isso pode aparecer como sair cedo de uma conversa que aperta, preferir mensagem a encontro, ou viver dias inteiros na cabeça enquanto o corpo espera. A distância não é frieza: é cuidado antigo tentando evitar a dor de não caber. O eco moderno é solidão escolhida que, em excesso, deixa de proteger e passa a empobrecer.",
  oral:
    "No cotidiano, isso pode aparecer como responder mensagem no mesmo segundo, antecipar o jantar do outro e esquecer o próprio, ou sentir o peito cair quando alguém demora a responder. Você dá com facilidade e pede com vergonha. O corpo busca apoio externo. O eco moderno é uma generosidade real que, sem centro próprio, vira cansaço e a sensação de nunca ser sustentado o bastante.",
  psicopata:
    "No cotidiano, isso pode aparecer como resolver a crise de todo mundo e não conseguir dizer 'estou mal', ou transformar intimidade em projeto a conduzir. Força e distância andam juntas. O eco moderno é admiração por fora e escassez de colo por dentro — até você mesmo acreditar que não precisa.",
  masoquista:
    "No cotidiano, isso pode aparecer como dizer sim com o peito fechado, carregar a agenda de todos e explodir só depois de meses de silêncio. Lealdade demais, limite de menos, ressentimento guardado. O eco moderno é ser a pessoa 'forte' da história — e descobrir tarde demais o preço de nunca ter pedido.",
  rigido:
    "No cotidiano, isso pode aparecer como revisar o e-mail três vezes, ter dificuldade de chorar na frente de quem ama, ou transformar descanso em culpa. Você parece confiável e competente — e regula de perto o que sente. O eco moderno é uma vida bem organizada em que a emoção só entra com hora marcada.",
};

const PERGUNTAS_TRANSFORMACAO: Record<keyof EstruturasPct, string> = {
  esquizoide:
    "O que mudaria na sua vida se você soubesse, no corpo, que é seguro estar aqui, sem precisar recuar para a mente?",
  oral:
    "E você, quem te sustenta quando você sustenta todo mundo? O que pediria hoje, sem culpa?",
  psicopata:
    "Quando ninguém está olhando, o que você sente, e o que permitiria sentir se não precisasse impressionar?",
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
  esquizoide:
    "Quando a vontade de sumir chegar, nomeie em voz alta (mesmo só para si) o que está sentindo — e só então escolha o recolhimento. Assim a distância vira escolha, não fuga automática.",
  oral:
    "Por 24 horas, resista ao impulso de 'salvar' o clima quando alguém fica em silêncio. Sente o aperto sem preencher o vazio — e note o que o corpo faz quando você não corre para cuidar.",
  psicopata:
    "Com alguém de confiança, mostre um limite ou uma necessidade real sem transformar isso em estratégia ou em piada. Observe o que acontece no corpo quando você é alcançado.",
  masoquista:
    "Diga não a uma cobrança pequena que você costumaria engolir — e permita-se o desconforto sem consertar o clima na hora. O mundo raramente desaba no primeiro não.",
  rigido:
    "Quando uma emoção aparecer, nomeie-a antes de montar a solução. Dê a si dois minutos só de sentir — sem corrigir, otimizar ou explicar.",
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
  PERFIS_PAR,
  PERFIS_UNICOS,
  TOQUE_TERCIARIO,
  DINAMICAS_FUNCIONAIS,
};
