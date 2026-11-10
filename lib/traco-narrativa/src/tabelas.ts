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
    "Você pensa fundo e imagina caminhos que muita gente ainda não enxerga. Em algum momento cedo, a rejeição ou a frieza podem ter ensinado que se afastar era mais seguro. O que segue não é um rótulo: é um mapa de como esse jeito pode aparecer na sua vida hoje.",
  oral:
    "Você sente o outro e comunica afeto com facilidade. Em algum momento cedo, a falta de colo ou de sustentação constante pode ter ensinado a buscar no outro o que faltava por dentro. A leitura abaixo mostra como esse jeito pode aparecer no seu cotidiano.",
  psicopata:
    "Você organiza, lidera e negocia com naturalidade. Em algum momento cedo, confiar pode ter doído — e controlar o ambiente passou a parecer a forma mais segura de existir. A leitura aprofunda como essa força vive em você hoje.",
  masoquista:
    "Você aguenta, planeja e sustenta. Em algum momento cedo, a crítica ou a humilhação podem ter ensinado que silenciar e resistir era mais seguro do que se expandir. A leitura a seguir mostra essa força e o custo de usá-la o tempo todo.",
  rigido:
    "Você executa, capricha e mantém o ritmo. Em algum momento cedo, demonstrar sentimento ou se entregar pode ter trazido frustração — e a excelência virou proteção. O texto a seguir aprofunda esse jeito de funcionar, sem trocar o nome do traço.",
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
    "Imagine um começo em que existir plenamente parecia arriscado: rejeição, frieza ou invasão. A criança aprende a se proteger pela distância. Isso não é frieza adulta — é um jeito antigo de cuidar de si, antes mesmo de haver palavras. Observe se essa história encontra eco na sua vida.",
  oral:
    "Imagine um começo em que o colo e a sustentação faltaram ou chegaram de forma irregular. A criança aprende a buscar fora o que falta por dentro. Isso não define quem você é: ajuda a entender por que receber ainda pode parecer difícil ou perigoso. Observe se essa experiência faz sentido para você.",
  psicopata:
    "Imagine um começo em que confiar custou caro. Controlar o ambiente passou a parecer a única forma de se sentir seguro. A força que nasceu disso é real. O custo aparece quando ninguém consegue te ver sem a estratégia. Observe se isso faz sentido para você.",
  masoquista:
    "Imagine um começo em que querer algo seu trouxe crítica, humilhação ou pressão para se adaptar. A criança aprende a ficar forte, fiel e capaz de aguentar. Aguentar tudo não precisa ser a única prova de valor: a vida também cabe leve. Observe se essa leitura encontra eco em você.",
  rigido:
    "Imagine um começo em que demonstrar sentimento ou se entregar trouxe frustração, rejeição ou a sensação de não ser escolhido. A criança aprende a controlar a emoção e a merecer carinho sendo correta, competente e admirável. Por dentro, o sentimento continua: só espera permissão para aparecer sem perder o padrão. Observe se essa história faz sentido para você.",
};

const RECURSOS: Record<keyof EstruturasPct, string> = {
  esquizoide:
    "O mesmo movimento que pode ter te afastado do mundo também desenvolveu uma mente capaz de criar o que ainda não existe. Você enxerga padrões, conecta ideias e imagina caminhos que outros não veem. Quando essa visão deixa de ser só proteção e passa a ser presença, ela vira um talento que o mundo realmente precisa.",
  oral:
    "O mesmo anseio que pode ter te feito buscar o outro demais também desenvolveu uma empatia rara. Você lê o ambiente antes da fala, aquece vínculos e sustenta pessoas. Quando essa generosidade deixa de esvaziar você e passa a nascer de um centro próprio, ela vira um recurso de conexão verdadeira.",
  psicopata:
    "O mesmo impulso que pode ter te feito controlar o ambiente também desenvolveu uma presença que organiza e mobiliza. Você vê o caminho, articula e faz as coisas andarem. Quando essa força deixa de ser só defesa e passa a incluir vulnerabilidade, ela vira liderança que inspira confiança de verdade.",
  masoquista:
    "O mesmo padrão que pode ter te feito aguentar demais também desenvolveu uma resistência que permanece quando muita coisa cede. Você é leal, profundo e capaz de sustentar. Quando essa força deixa de ser só compressão e passa a se expandir, ela vira persistência com espaço para prazer e leveza.",
  rigido:
    "O mesmo cuidado que pode ter te feito controlar a emoção também desenvolveu uma capacidade real de transformar visão em resultado. Você é confiável, organizado e entrega o que promete. Quando essa excelência deixa de ser só proteção e passa a conviver com fragilidade, ela vira competência com profundidade humana.",
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
    "Pratique receber um cuidado pequeno sem imediatamente retribuir ou se sentir em dívida.",
    "Monte uma rotina simples só sua: sono, alimentação, um tempo sem atender ninguém.",
    "Observe onde você dá mais do que recebe e escolha uma situação para pedir algo concreto.",
    "Diga em uma frase clara o que você precisa a alguém próximo.",
    "Quando a solidão apertar, pergunte-se o que você mesmo pode oferecer a si agora, antes de buscar o outro.",
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
    "Em terceiro lugar no seu mapa, o Esquizóide acrescenta um espaço interior: você pensa antes de se entregar por completo e precisa de momentos só seus para não se perder no contato. Essa distância discreta pode ser sabedoria, desde que não vire fuga quando a vida pede presença.",
  oral:
    "Em terceiro lugar no seu mapa, o Oral acrescenta calor e sede de vínculo: mesmo quando outro traço conduz, você ainda busca ser visto e cuidar. Isso humaniza o perfil e pede atenção para não se esvaziar dando o que ninguém pediu.",
  psicopata:
    "Em terceiro lugar no seu mapa, o Psicopata acrescenta impulso de avanço e de organizar o entorno. Você consegue empurrar decisões e tomar frente quando precisa. O cuidado é não usar essa força só para não sentir.",
  masoquista:
    "Em terceiro lugar no seu mapa, o Masoquista acrescenta capacidade de aguentar e permanecer. Você sustenta o que importa por tempo longo e pode acabar carregando além do justo se não nomear o limite a tempo.",
  rigido:
    "Em terceiro lugar no seu mapa, o Rígido acrescenta ordem, capricho e compromisso com a qualidade. Você fecha o que começa e mantém o padrão. O convite é deixar a excelência servir à vida, não substituir o afeto.",
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
    "Sua visão interior é um recurso real, não um defeito. Cada vez que você ancora presença no corpo e permite ser visto em doses pequenas, descobre que existir aqui pode ser mais seguro do que a proteção antiga sugeria. Isso não é performance: é integração gradual.",
  oral:
    "Receber apoio não enfraquece o seu jeito de cuidar. Quanto mais estrutura interna você constrói, mais consegue sustentar vínculos sem se esvaziar. Pedir o que precisa faz parte de como você funciona melhor, não de uma falha.",
  psicopata:
    "Sua força já está provada. O próximo passo é permitir que vulnerabilidade e liderança caminhem juntas: mostrar limite e necessidade não reduz influência — aumenta confiança.",
  masoquista:
    "Suportar não precisa ser a sua única identidade. Expansão, prazer e leveza também cabem em você. Dizer não em doses pequenas reescreve o padrão antigo sem apagar a sua lealdade.",
  rigido:
    "Sua competência é real e valiosa. Por baixo do controle existe sensibilidade que também precisa de espaço. Relaxar não é perder padrão: é ampliar o que você consegue sentir e viver sem deixar de ser quem você é.",
};

const INTERPRETACOES: Record<keyof EstruturasPct, string[]> = {
  esquizoide: [
    "No começo, estar inteiro no mundo pode ter parecido arriscado. A proteção foi se afastar, observar e criar um universo interior rico. Você pode ter aprendido que pensar era mais seguro do que sentir e ser visto. Observe se essa origem encontra eco na sua história.",
    "Com o tempo, essa proteção desenvolveu um talento real: profundidade, criatividade e capacidade de ver o que outros não veem. Ao mesmo tempo, o corpo pode ter ficado um pouco de fora da conversa. A solidão vira fortaleza e, às vezes, prisão. O trabalho não é se tornar outra pessoa: é reunir o que já é seu.",
    "Hoje isso pode aparecer como necessidade de espaço, cansaço em ambientes muito estimulantes e uma vida interior que poucos conhecem de verdade. Você pode ser leal e intenso nos poucos vínculos que escolhe. O desafio é confiar, em doses, que é seguro existir aqui.",
    "O caminho passa pelo corpo e pela presença. Enquanto a mente já habita mundos sofisticados, o corpo espera a mesma atenção. Cada vez que você ancora a riqueza interior no aqui e agora, a experiência de ser você fica mais inteira.",
    "Integrar o Esquizóide não é se tornar 'comum'. É trazer o universo interior para o contato com o mundo. Quando a presença acompanha a visão, surge alguém criativo, conectado e profundamente autêntico.",
  ],
  oral: [
    "No começo, o suporte pode ter faltado ou chegado de forma irregular. A proteção foi buscar o outro: cuidar, sentir e se ligar. Você pode ter aprendido que o afeto vem de fora. Observe se essa história faz sentido para você.",
    "Com o tempo, essa proteção desenvolveu uma empatia rara: você lê o outro, aquece ambientes e sustenta vínculos. Ao mesmo tempo, o corpo pode ter aprendido a funcionar com menos sustentação própria. Quando a conexão falta, a energia cai e aparece a pergunta: e eu, quem me sustenta?",
    "Hoje isso pode aparecer como generosidade grande, medo de abandonar e de ser abandonado, e dificuldade de receber sem se sentir em dívida. Você pode dar demais para não ficar sozinho. O desafio é construir um centro próprio sem fechar a abertura que já é seu talento.",
    "O caminho passa por pedir, receber e se apoiar em si mesmo com a mesma entrega com que você cuida. Você merece isso como direito, não como recompensa. Limites e autocuidado não apagam o vínculo: tornam o vínculo sustentável.",
    "Integrar o Oral é descobrir plenitude por dentro. Não é fechar a receptividade. É ter um centro tão forte quanto a capacidade de cuidar e se ligar que você já carrega.",
  ],
  psicopata: [
    "No começo, a vontade pode ter sido interrompida e confiar pode ter custado caro. A proteção foi expandir, controlar e liderar. Você pode ter aprendido que força evita dor. Observe se isso encontra eco na sua vida.",
    "Com o tempo, essa proteção desenvolveu magnetismo, visão e capacidade de fazer as coisas andarem. O corpo comunica presença antes da fala. O preço pode ter sido a distância da própria fragilidade: quanto mais forte por cima, menos espaço para ser cuidado.",
    "Hoje isso pode aparecer como alta performance, impaciência com lentidão e dificuldade de mostrar necessidade. Você investe onde há respeito e estímulo. O desafio é descobrir que vulnerabilidade, nos momentos certos, não diminui liderança: humaniza e aprofunda a confiança.",
    "O caminho passa por descer. Trazer a força até o chão, até as pernas, até o descanso. Quando o poder vem do corpo inteiro e da verdade, ele se torna sustentável.",
    "Integrar o Psicopata é permitir que a força e a fragilidade convivam. Quem conhece o próprio limite inspira uma lealdade que a performance sozinha nunca alcança.",
  ],
  masoquista: [
    "No começo, expressar vontade pode ter custado crítica ou humilhação. A proteção foi engolir, aguentar e continuar. Você pode ter aprendido que ceder era mais seguro do que expandir. Observe se essa leitura encontra eco em você.",
    "Com o tempo, essa proteção desenvolveu lealdade, persistência e capacidade de sustentar o que outros abandonam. O corpo pode ter comprimido o que não podia ser dito. A força silenciosa é real. O custo é o prazer adiado e o espaço que você ainda hesita em ocupar.",
    "Hoje isso pode aparecer como fazer demais, reclamar de menos e permanecer em situações que já pedem mudança. Você conhece a dor de dentro e por isso acolhe o outro com profundidade. O desafio é descobrir que o mundo não desaba quando você diz não.",
    "O caminho é a expansão gradual, não a explosão. Um tom a mais na voz, um limite pequeno, um prazer permitido. Cada vez que você expressa em vez de engolir, reescreve a história do corpo.",
    "Integrar o Masoquista é lembrar que alegria e leveza não são prêmio por sofrimento. São direito. A vida espera que você floresça além do que foi suportado.",
  ],
  rigido: [
    "No começo, demonstrar sentimento ou se entregar pode ter trazido frustração, rejeição ou a sensação de não ser escolhido. Como proteção, você pode ter aprendido a controlar a emoção e a merecer carinho sendo correto, competente e admirável. Observe se essa história faz sentido para a sua vida.",
    "Com o tempo, essa proteção desenvolveu excelência, organização e confiabilidade reais. O corpo se mantém unido e a postura comunica competência. O preço pode ser a dificuldade de se desorganizar o suficiente para sentir. O que fica represado não desaparece: espera uma saída segura.",
    "Na vida adulta, essa estratégia pode continuar: você se esforça para ser admirado, sente necessidade de corresponder às expectativas e encontra dificuldade em demonstrar fragilidade, mesmo quando gostaria de receber acolhimento. Por fora você opera com clareza. Por dentro, a emoção pede permissão.",
    "O caminho passa por flexibilizar o controle com intenção, não por perder padrão. Quando você relaxa o suficiente para sentir sem corrigir na hora, a competência ganha profundidade humana.",
    "Integrar o Rígido é descobrir quem você é quando não precisa provar. A pergunta viva é: o que aparece quando ninguém está olhando, quando não há meta nem papel? A resposta mostra o que ainda pede cuidado e o que já está pronto para crescer.",
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
    "pode haver desejo de vínculo organizado pela necessidade de manter a forma. Você cuida com consistência, mas regula o quanto se entrega e o quanto recebe. A integração é aprender a receber sem perder estrutura.",
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
      "Você se comunica com abertura. A emoção aparece na voz e também no tom e no gesto. Falar ajuda a organizar o que sente. A conversa é conexão, não só troca de informação.",
    emGrupos:
      "Em grupos, busca calor genuíno e frequentemente aquece o ambiente. Percebe o que o outro precisa ouvir e tem generosidade para dizer. Pode ser o centro emocional sem ser o mais falante.",
    emRelacoes:
      "Nas relações íntimas, a comunicação flui com naturalidade. Você compartilha e confessa. O desafio é perceber quando fala para aliviar a própria ansiedade e quando fala para conectar de verdade.",
    emConflito:
      "No conflito, tende a harmonizar. A discórdia incomoda. Às vezes cede antes de dizer o que realmente pensa. Com o tempo, o não-dito vira peso.",
    emTensao:
      "Sob tensão, pode falar mais para manejar a ansiedade. Perceber isso ajuda a escolher as palavras que importam, em vez de só produzir volume.",
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
    "Um anseio de vínculo aliado a uma mente que precisa de distância. Você deseja profundamente e também teme o custo da proximidade. Essa tensão não precisa ser apagada: precisa ser habitada com consciência. Quando integradas, essas forças produzem empatia profunda e visão interior rara — alguém que cuida sem se perder, e que pensa sem abandonar o outro.",
  "oral-psicopata":
    "O desejo de ser visto combinado com a força de quem lidera. Pode haver necessidade de reconhecimento disfarçada de generosidade ou de liderança. A pergunta viva é: quando você serve porque quer, e quando busca aprovação que ainda não aprendeu a dar a si? Integradas, essas forças criam alguém que conduz com humanidade — forte o bastante para pedir e próximo o bastante para ser seguido de verdade.",
  "oral-masoquista":
    "Duas histórias de necessidade não atendida podem se reforçar: abandono e humilhação criando autossacrifício. Você carrega muito, oferece muito e frequentemente recebe pouco. A compaixão que nasce disso é rara. A transformação começa com a decisão de que você merece receber tanto quanto oferece — e que pedir não é fraqueza, é o que torna o cuidado sustentável.",
  "oral-rigido":
    "A necessidade de vínculo encontra uma organização que aprendeu a gerenciar entrega e recebimento. O Oral quer se entregar; o Rígido organiza essa entrega. Você pode cuidar com consistência e raramente se permitir ser completamente vulnerável no cuidado. A integração abre o vínculo sem perder a forma: receber sem se desorganizar, e se entregar sem se abandonar.",
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
    "A necessidade de vínculo é gerida pela organização. Você cuida com consistência e regula a entrega. A integração pede aprender a receber apoio com a mesma competência com que oferece — sem administrar cada troca afetiva, e sem transformar o afeto em tarefa a cumprir.",
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
      "No trabalho, você rende mais na profundidade do que na dispersão. Prefere mergulhar em um problema a saltar entre muitos. Ambientes de muita interação drenam. O melhor rendimento vem com autonomia, tempo para pensar e projetos que pedem originalidade real.",
    relacoes:
      "Relacionamentos consomem uma energia que você raramente explica. Não é que você não queira as pessoas: a presença contínua exige um cuidado interno que outros não veem. Seus vínculos mais profundos são poucos e intensos. Você é leal de um jeito que quem está fora quase não percebe.",
    estresse:
      "Sob estresse, você se retira para a mente, para a solidão ou para o trabalho de pensar. Processa em silêncio e só então emerge com clareza. Outros podem ler isso como frieza. É você funcionando: primeiro entende, depois responde.",
    decisoes:
      "Suas decisões nascem por dentro, com um processo que pode parecer lento. Você analisa fundo e chega a conclusões que outros não viram. A dificuldade aparece quando a vida pede velocidade ou quando o sentimento pesa mais do que a lógica.",
    energia:
      "Você se regenera na solidão e se consome na interação. Grupos grandes e ambientes muito estimulantes pedem recuperação. Quando você pede recolhimento, atender a isso não é isolamento: é manutenção.",
    sombra:
      "O que pode doer reconhecer: o isolamento que vira prisão, o pensamento que evita sentir, a dificuldade de se deixar tocar. A sombra é o mundo rico demais para ser compartilhado e protegido demais para ser alcançado. A cura começa em trazer esse universo para o contato real, um passo de cada vez.",
  },
  oral: {
    trabalho:
      "No trabalho, você rende melhor onde há colaboração e sentido humano. Isolamento longo drena. Você produz mais quando sente que o que faz importa para alguém. O reconhecimento genuíno não é vaidade: é combustível.",
    relacoes:
      "Relacionamentos são o centro de gravidade. Você investe fundo, sente a dor e a alegria do outro e cuida com uma generosidade rara. O desafio é perceber quando está dando em excesso para preencher uma necessidade que pediria olhar para dentro.",
    estresse:
      "Sob estresse, você busca o outro — falar, compartilhar, pedir ou oferecer cuidado. A conexão é âncora. Sozinho por muito tempo sob pressão, a energia cai. Manter vínculos saudáveis, para você, é necessidade legítima.",
    decisoes:
      "Você decide com o impacto relacional bem presente. Às vezes isso é sabedoria. Outras vezes, a decisão saudável é a que vai desagradar alguém, e aí você trava. Aprender a decidir por si é prática de longo prazo.",
    energia:
      "Sua energia pede recarga regular em conexões genuínas, propósito e autocuidado. Bem nutrido, você tem calor e vitalidade. Vazio, pode buscar o outro para se reabastecer, e aí a conexão se confunde com dependência.",
    sombra:
      "O que pode doer reconhecer: a dependência disfarçada de generosidade, o autoabandono que parece cuidado, a dificuldade de se sustentar por dentro. Nomear a necessidade diretamente é o começo da integração.",
  },
  psicopata: {
    trabalho:
      "No trabalho, você opera em alta performance e orientação a resultado. Ambientes sem desafio ou com burocracia demais frustram. Você lidera, articula e mobiliza. O risco é confundir eficiência com relação: times inspirados entregam mais do que times pressionados.",
    relacoes:
      "Relacionamentos tendem a ser estruturados. Você investe onde há respeito e estímulo. Mostrar vulnerabilidade parece, por dentro, dar poder ao outro. A transformação começa quando você descobre que mostrar necessidade é confiança, não fraqueza.",
    estresse:
      "Sob estresse, você avança: mais ação, mais controle, mais intensidade. Funciona em crises objetivas. Em crises emocionais, o mesmo padrão pode forçar solução onde o que falta é presença e sentimento.",
    decisoes:
      "Você decide com velocidade e convicção. A execução começa cedo. O ponto cego é a consulta genuína: deixar o pensamento do outro mudar o seu. As melhores decisões chegam quando o ego sai da sala.",
    energia:
      "Você tem alta carga e precisa de descarga saudável: movimento, projetos com sentido e momentos de verdade. Sem saída, a tensão sobe para ombros, nuca e maxilar. O corpo guarda o que não foi expresso.",
    sombra:
      "O que pode doer reconhecer: a necessidade de aprovação atrás da performance, a fragilidade antiga que a força veio proteger, a parte que quer ser vista de forma simples. A sombra é essa fragilidade ainda à espera de ser encontrada.",
  },
  masoquista: {
    trabalho:
      "No trabalho, você entrega de verdade: presente, comprometido, confiável. A tendência é assumir demais e reclamar de menos. O risco é a invisibilidade: fazer tanto sem pedir nada pode parecer que está tudo bem quando não está. Comunicar limite é competência.",
    relacoes:
      "Você é leal até o fim, mesmo quando o custo é alto. O desafio é perceber quando a lealdade virou submissão: permanecer não porque quer, mas porque sair parece impossível. Saúde relacional começa quando você pode escolher ficar e também escolher ir.",
    estresse:
      "Sob estresse, você aguenta. Continua funcionando quando outros já teriam parado. Isso é força, e também onde a cobrança interna aperta. Estresse não atendido encontra saída no corpo. Cuidar antes de acumular não é fraqueza.",
    decisoes:
      "Você decide com muito peso. Avalia o que pode custar e quem pode se magoar. Adia a decisão que incomoda, mesmo quando ela é justa. Decisões adiadas não somem: crescem.",
    energia:
      "Sua energia é densa e duradoura. Sustenta esforço longo. O problema é gastar mais do que recebe. A descarga que você precisa é expressão e expansão. Sem isso, a tensão se acumula em quadris, lombar e ombros.",
    sombra:
      "O que pode doer reconhecer: o aguentar que virou identidade, o ressentimento silencioso, a expansão que parece perigosa. A sombra é a crença de que pedir mais vai custar o que você não pode perder. A cura começa quando você descobre que pode caber mais espaço.",
  },
  rigido: {
    trabalho:
      "No trabalho, você é referência: preciso, entregador, fiel ao que promete. Alta performance é habitat natural. O risco não está na entrega: está no custo. A perfeição como padrão esgota o entusiasmo. Aprender o 'suficientemente bom' pode ser a expansão mais difícil.",
    relacoes:
      "Você é confiável e consistente. Por baixo, sente profundamente e mantém a emoção sob cuidado. O outro pode te experimentar como formal exatamente quando esperava entrega. Não é distância: é a proteção que ainda não foi toda removida.",
    estresse:
      "Sob estresse, você aumenta o controle da situação e de si. Funciona em crises objetivas. Em crises emocionais, o mesmo mecanismo cria distância quando a conexão seria a solução. Você precisa de permissão para sentir sem gerenciar na hora.",
    decisoes:
      "Você decide com método. Raramente age por impulso. O ponto cego é o sentimento deixado de fora da deliberação. A intuição emocional não é menos válida que a lógica: muitas vezes completa o quadro.",
    energia:
      "Sua energia é organizada e disponível para realizar. Encontra barreira no campo emocional e relacional, onde não há estrutura prévia. É justamente aí que a maior expansão é possível.",
    sombra:
      "O que pode doer reconhecer: a rigidez disfarçada de princípio, a sensibilidade que quer contato e desvia na hora, o perfeccionismo que é autocobrança. A sombra é o ser sensível por baixo do controle, que sente mais do que permite mostrar.",
  },
};

/** Dor associada ao traço, em linguagem acessível e hipotética. */
const DORES_LIVRO: Record<keyof EstruturasPct, string> = {
  esquizoide:
    "No dia a dia, esse jeito pode aparecer como recuar antes de se sentir invadido ou rejeitado. A distância não é frieza: é cuidado antigo. O corpo aprendeu cedo que existir plenamente podia ser arriscado.",
  oral:
    "No dia a dia, isso pode aparecer como dar demais, pedir pouco e sentir que nunca é sustentado o suficiente. O corpo busca apoio externo. A origem costuma ser um começo em que o suporte chegou de forma irregular.",
  psicopata:
    "No dia a dia, isso pode aparecer como força e distância ao mesmo tempo. O corpo aprendeu a se expandir e a controlar quando a vulnerabilidade custou caro. O desafio é permitir afeto sem perder presença.",
  masoquista:
    "No dia a dia, isso pode aparecer como lealdade excessiva, dificuldade de dizer não e ressentimento silencioso. O corpo comprime e aguenta. A origem costuma ser um começo em que expressar vontade trouxe crítica.",
  rigido:
    "No dia a dia, você parece confiável e competente, e ainda assim regula de perto o que sente. Isso dificulta se entregar sem planejar cada reação. O corpo se organizou para funcionar bem e se proteger quando a entrega emocional foi frustrada.",
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
  esquizoide: "Pratique estar no corpo antes de recuar para a mente em momentos de pressão.",
  oral: "Observe onde você dá mais do que recebe, e pratique pedir algo concreto esta semana.",
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
  PERFIS_PAR,
  PERFIS_UNICOS,
  TOQUE_TERCIARIO,
  DINAMICAS_FUNCIONAIS,
};
