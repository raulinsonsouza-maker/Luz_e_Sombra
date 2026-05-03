/**
 * Traço de Caráter — Local Biomechanical Analysis Engine
 * Runs entirely in the browser via Canvas API. Zero external API calls.
 */

export type TipoFoto = "rosto" | "corpo-frente" | "corpo-lado";

export interface EstruturasPct {
  esquizoide: number;
  oral: number;
  psicopata: number;
  masoquista: number;
  rigido: number;
}

export interface ResultadoAnalise {
  estruturas: EstruturasPct;
  estruturaPrincipal: keyof EstruturasPct;
  estruturaSecundaria: keyof EstruturasPct;
  observacoesPorFoto: Partial<Record<TipoFoto, string>>;
  padraoPostural: string;
  caracteristicasFisicasObservadas: string[];
  interpretacao: string;
  centroEnergetico: string;
  padraoEnergetico: string;
  mensagemTerapeutica: string;
}

// ── Image loading ─────────────────────────────────────────────────────────────

interface PixelData {
  pixels: Uint8ClampedArray;
  width: number;
  height: number;
}

async function loadFromSrc(src: string): Promise<PixelData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const MAX = 360;
      const scale = Math.min(MAX / img.naturalWidth, MAX / img.naturalHeight, 1);
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      resolve({ pixels: ctx.getImageData(0, 0, w, h).data, width: w, height: h });
    };
    img.onerror = () => reject(new Error("Falha ao carregar imagem"));
    img.src = src;
  });
}

export async function loadImageFromFile(file: File): Promise<PixelData> {
  const url = URL.createObjectURL(file);
  try {
    return await loadFromSrc(url);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function loadImageFromUrl(url: string, token: string): Promise<PixelData> {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Falha ao carregar imagem do servidor");
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  try {
    return await loadFromSrc(objectUrl);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

// ── Pixel utilities ───────────────────────────────────────────────────────────

function lum(px: Uint8ClampedArray, x: number, y: number, w: number): number {
  const i = (y * w + x) * 4;
  return px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114;
}

function avgLum(px: Uint8ClampedArray, w: number, h: number): number {
  let sum = 0, n = 0;
  for (let y = 0; y < h; y += 4) for (let x = 0; x < w; x += 4) { sum += lum(px, x, y, w); n++; }
  return n > 0 ? sum / n : 128;
}

// ── Per-photo metrics ─────────────────────────────────────────────────────────

interface Metrics {
  tipo: TipoFoto;
  shoulderW: number;   // relative width at 22-28% height
  chestW: number;      // relative width at 30-38%
  waistW: number;      // relative width at 44-52%
  hipW: number;        // relative width at 54-62%
  legW: number;        // relative width at 70-80%
  symm: number;        // lateral symmetry 0-1
  upperMass: number;   // body mass fraction in top half
  lowerMass: number;   // body mass fraction in bottom half
  bodyPct: number;     // fraction of image that is "body"
  edgeDensity: number; // proxy for muscle definition / sharpness
}

function measurePhoto(d: PixelData, tipo: TipoFoto): Metrics {
  const { pixels: px, width: w, height: h } = d;
  const avg = avgLum(px, w, h);
  // Dynamic threshold: body pixels are darker than background
  const thr = avg > 150 ? avg * 0.72 : avg * 1.35;
  const bg = Math.max(80, Math.min(220, thr));

  const isBody = (x: number, y: number) => lum(px, x, y, w) < bg;

  // Width at a relative height band
  function widthAtBand(from: number, to: number, steps = 6): number {
    let total = 0;
    for (let s = 0; s < steps; s++) {
      const y = Math.round((from + (to - from) * s / (steps - 1)) * h);
      if (y < 0 || y >= h) continue;
      let l = -1, r = -1;
      for (let x = 0; x < w; x++) { if (isBody(x, y)) { if (l < 0) l = x; r = x; } }
      total += l < 0 ? 0 : (r - l) / w;
    }
    return total / steps;
  }

  // Body pixel mass in a vertical slice
  function massInBand(from: number, to: number): number {
    let c = 0, n = 0;
    for (let y = Math.round(from * h); y < Math.round(to * h); y += 2)
      for (let x = 0; x < w; x += 2) { if (isBody(x, y)) c++; n++; }
    return n > 0 ? c / n : 0;
  }

  // Left-right symmetry (compare brightness of mirrored halves)
  function symmetry(): number {
    const half = Math.floor(w / 2);
    let diff = 0, n = 0;
    for (let y = 0; y < h; y += 3) {
      for (let x = 0; x < half; x += 3) {
        diff += Math.abs(lum(px, x, y, w) - lum(px, w - 1 - x, y, w)) / 255;
        n++;
      }
    }
    return n > 0 ? 1 - diff / n : 0.5;
  }

  // Edge density via Sobel (proxy for body definition)
  function edgeDensity(): number {
    let total = 0, n = 0;
    for (let y = 1; y < h - 1; y += 2) {
      for (let x = 1; x < w - 1; x += 2) {
        const gx = Math.abs(lum(px, x + 1, y, w) - lum(px, x - 1, y, w));
        const gy = Math.abs(lum(px, x, y + 1, w) - lum(px, x, y - 1, w));
        total += Math.sqrt(gx * gx + gy * gy);
        n++;
      }
    }
    return n > 0 ? (total / n) / 255 : 0;
  }

  const um = massInBand(0, 0.5);
  const lm = massInBand(0.5, 1);
  const bodyPct = massInBand(0, 1);

  return {
    tipo,
    shoulderW: widthAtBand(0.18, 0.28),
    chestW: widthAtBand(0.30, 0.38),
    waistW: widthAtBand(0.44, 0.52),
    hipW: widthAtBand(0.54, 0.62),
    legW: widthAtBand(0.70, 0.80),
    symm: symmetry(),
    upperMass: um,
    lowerMass: lm,
    bodyPct,
    edgeDensity: edgeDensity(),
  };
}

// ── Scoring algorithm ─────────────────────────────────────────────────────────

function scoreMetrics(metrics: Metrics[]): EstruturasPct {
  let e = 10, o = 10, p = 10, m = 10, r = 10; // baseline

  const front = metrics.find(x => x.tipo === "corpo-frente");
  const side  = metrics.find(x => x.tipo === "corpo-lado");
  const face  = metrics.find(x => x.tipo === "rosto");

  if (front) {
    const { shoulderW, hipW, waistW, symm, upperMass, lowerMass, bodyPct } = front;
    const shr = hipW > 0.01 ? shoulderW / hipW : 1; // shoulder/hip ratio
    const ulr = lowerMass > 0.01 ? upperMass / lowerMass : 1; // upper/lower ratio

    // PSICOPATA — broad shoulders, narrow hips, upper-heavy
    if (shr > 1.40) p += 42;
    else if (shr > 1.25) p += 28;
    else if (shr > 1.12) p += 14;
    if (ulr > 1.30) p += 20;
    else if (ulr > 1.15) p += 10;

    // MASOQUISTA — wide hips, compressed, barrel
    if (shr < 0.88) m += 32;
    else if (shr < 1.00) m += 16;
    if (bodyPct > 0.50) m += 22;
    else if (bodyPct > 0.38) m += 11;
    if (shoulderW > 0 && waistW / Math.max(shoulderW, 0.01) > 0.88) m += 14; // barrel waist

    // ESQUIZÓIDE — narrow, asymmetric, thin
    if (symm < 0.76) { e += 32; o += 5; }
    else if (symm < 0.82) e += 16;
    if (shoulderW < 0.22 && hipW < 0.22) e += 22;
    else if (shoulderW < 0.28) e += 10;
    if (bodyPct < 0.14) e += 16;

    // ORAL — collapsed upper, thin, low energy
    if (ulr < 0.78) o += 28;
    else if (ulr < 0.88) o += 14;
    if (bodyPct < 0.18 && shr < 1.05) o += 16;

    // RÍGIDO — symmetric, balanced proportions
    if (symm > 0.92) r += 32;
    else if (symm > 0.88) r += 20;
    if (shr > 1.06 && shr < 1.28) r += 22;
    if (bodyPct > 0.20 && bodyPct < 0.42) r += 10;
  }

  if (side) {
    const { shoulderW, hipW, upperMass, lowerMass, symm } = side;
    const shr = hipW > 0.01 ? shoulderW / hipW : 1;
    if (shr > 1.18) p += 14; // puffed chest (side profile: chest > hips)
    if (lowerMass > 0.01 && upperMass / lowerMass < 0.80) o += 14; // collapsed upper
    if (symm < 0.78) e += 10;
  }

  if (face) {
    const { symm } = face;
    if (symm < 0.78) { e += 16; o += 5; }
    else if (symm > 0.92) { r += 16; p += 5; }
    else if (symm > 0.87) r += 8;
  }

  // Normalize
  const total = e + o + p + m + r;
  const raw = { esquizoide: e, oral: o, psicopata: p, masoquista: m, rigido: r };
  const norm: EstruturasPct = {
    esquizoide: Math.round(e / total * 100),
    oral: Math.round(o / total * 100),
    psicopata: Math.round(p / total * 100),
    masoquista: Math.round(m / total * 100),
    rigido: Math.round(r / total * 100),
  };
  // Fix rounding drift
  const sum = norm.esquizoide + norm.oral + norm.psicopata + norm.masoquista + norm.rigido;
  const diff = 100 - sum;
  if (diff !== 0) {
    const top = (Object.keys(raw) as (keyof EstruturasPct)[]).reduce((a, b) => raw[a] > raw[b] ? a : b);
    norm[top] += diff;
  }
  return norm;
}

// ── Text content ──────────────────────────────────────────────────────────────

const NOMES: Record<keyof EstruturasPct, string> = {
  esquizoide: "Esquizóide", oral: "Oral", psicopata: "Psicopata/Narcisista",
  masoquista: "Masoquista", rigido: "Rígido",
};

const OBS_ROSTO: Record<keyof EstruturasPct, string> = {
  esquizoide: "Rosto com qualidade distante e introspectiva. Há uma assimetria sutil entre os lados, e o olhar carrega profundidade que parece olhar além do presente — presente no espaço mas habitando outro lugar.",
  oral: "Rosto com traços delicados e expressão sensível. Os olhos transmitem abertura emocional profunda, com tendência a expressão de suavidade e uma qualidade de necessidade afetiva visível nas feições.",
  psicopata: "Rosto de presença marcante. O olhar é direto, penetrante, com qualidade natural de comando. A estrutura facial transmite força e determinação — uma presença que organiza o espaço ao redor.",
  masoquista: "Rosto de expressão contida, com linhas que sugerem esforço e resistência. A mandíbula e o pescoço apresentam tensão característica de quem carrega muito internamente sem expressar.",
  rigido: "Rosto bem estruturado, com traços organizados e simetria marcante. Expressão controlada e precisa — o coração presente mas contido por um véu de compostura e organização.",
};

const OBS_FRENTE: Record<keyof EstruturasPct, string> = {
  esquizoide: "Estrutura corporal estreita com largura reduzida em ombros e quadril. Há fragmentação visual entre segmentos — o corpo não flui de uma parte à outra com continuidade. A desconexão entre tórax e membros inferiores é perceptível.",
  oral: "Corpo com predomínio de colapso postural — a parte superior cede para baixo. O tônus muscular geral é baixo e a vitalidade corporal está reduzida, com pouco enraizamento. Os ombros caem e o peito recua.",
  psicopata: "Desenvolvimento marcante na região superior — ombros largos e peito amplo contrastam com porção inferior mais estreita. A postura exala presença e comando natural. A energia se concentra acima da cintura.",
  masoquista: "Estrutura comprimida e densa — a largura do corpo é expressiva, com quadril e tronco ocupando bastante espaço. O peso parece distribuído para baixo, como se a gravidade puxasse a estrutura em direção ao chão.",
  rigido: "Corpo bem proporcionado e organizado. A simetria é notável, e as proporções entre ombros e quadril são equilibradas. A postura é ereta e controlada, revelando a couraça invisível que mantém tudo no lugar.",
};

const OBS_LADO: Record<keyof EstruturasPct, string> = {
  esquizoide: "Perfil mostra desengajamento postural. A pelve está retraída e há desconexão entre os segmentos. Não há uma linha de energia contínua do chão à cabeça — o corpo parece habitado de forma fragmentada.",
  oral: "A silhueta lateral revela colapso para frente — cabeça e ombros se projetam além do eixo corporal. O peito afunda, reduzindo espaço respiratório e transmitindo baixa vitalidade energética.",
  psicopata: "O perfil evidencia o peito projetado para frente, com cabeça erguida e queixo levemente elevado. A postura lateral comunica domínio e expansão ascendente. A energia flui para cima e para frente.",
  masoquista: "O perfil lateral mostra postura comprimida. Os ombros caem para dentro e a pelve está encaixada, limitando mobilidade e criando tensão crônica na lombar e quadril. O corpo está carregando peso invisível.",
  rigido: "Perfil evidencia alinhamento preciso. Cabeça, ombros e quadril estão em eixo vertical organizado. O corpo se mantém ereto com certa rigidez — a postura perfeita demais revela a armadura invisível.",
};

const INTERPRETACOES: Record<keyof EstruturasPct, string[]> = {
  esquizoide: [
    "Você habita um universo interior raro. Sua mente é um cosmos particular, cheio de conexões que poucos conseguem acompanhar. Há uma inteligência que transcende o comum, uma capacidade de ver padrões invisíveis para os outros, de criar mundos a partir do nada. Essa é sua maior riqueza — e também seu maior isolamento.",
    "A estrutura Esquizóide carrega a ferida mais primordial: o terror de existir. No corpo, isso se expressa como uma desconexão entre partes — como se diferentes fragmentos de você vivessem em órbitas separadas. Os ombros tendem a retrair, a pelve a recuar, o corpo a fragmentar-se em segmentos que não conversam entre si. O trabalho é reunir esses fragmentos em uma identidade encarnada.",
    "Sua relação com a solidão é complexa: ela é tanto fortaleza quanto prisão. O isolamento criativo, a profundidade intelectual, a sensibilidade extrema às energias ao redor — são dons reais. O desafio que a vida lhe apresenta é o mesmo de sempre: confiar que é seguro estar aqui, que você tem direito de existir plenamente, de ser visto e deixar alguém chegar perto.",
    "Sua jornada de transformação passa pelo corpo. Enquanto a mente já habita mundos sofisticados, o corpo aguarda ser habitado com a mesma presença. Cada vez que você ancora sua vasta riqueza interior no aqui e agora, a experiência de ser você se torna mais inteira.",
  ],
  oral: [
    "Há em você uma profundidade emocional que é raridade neste mundo. Você sente o outro antes mesmo de ele falar — percebe a dor escondida, a alegria genuína, a saudade que ninguém mais enxerga. Essa é sua maior dádiva: a empatia encarnada, o coração que pulsa pelo mundo.",
    "A estrutura Oral carrega a ferida do abandono. No corpo, isso aparece como colapso — o peito cede, a postura se inclina para frente como se ainda buscasse ser amparada. O tônus muscular é baixo não por fraqueza, mas porque o sistema aprendeu cedo que não havia suficiente suporte vindo de fora. O trabalho interno é aprender a apoiar-se em si mesmo enquanto recebe o apoio do mundo.",
    "Você nutre o outro com uma generosidade extraordinária. Mas existe uma pergunta silenciosa que o acompanha: 'E eu, quem me sustenta?' O caminho de cura passa por aprender a pedir, a receber, a deixar que cuidem de você com a mesma entrega com que você cuida. Você merece isso — de forma incondicional.",
    "Sua sensibilidade é um presente. A melancolia, a saudade, o anseio de pertencer — são expressões de um coração que ama profundamente. Quanto mais você encontrar estrutura interna — limites, autocuidado, apoio consciente — mais você poderá amar o mundo sem se dissolver nele.",
  ],
  psicopata: [
    "Você chegou ao mundo com uma capacidade de influência que é visível no seu corpo: a parte superior se impõe, os ombros comunicam antes de você falar, a postura comanda o espaço ao redor. Essa não é uma falha de caráter — é uma resposta adaptativa de um ser que precisou controlar o ambiente para sobreviver.",
    "A estrutura Psicopata/Narcisista nasce da traição — de uma vontade que foi violada quando ainda era vulnerável. O corpo aprendeu a se expandir para cima como defesa: quanto maior acima da cintura, menos vulnerável. Funcionou. Você se tornou alguém difícil de controlar. O preço foi a desconexão com a própria fragilidade e com o amor que ainda espera abaixo da armadura.",
    "Sua força é real. Seu magnetismo, sua capacidade estratégica, sua visão — são dons genuínos. O que a vida lhe convida a descobrir é que por baixo da armadura existe um coração que também quer ser visto, que também quer descansar, que também quer ser amado sem precisar impressionar. Essa vulnerabilidade não enfraquece — é o que torna o poder verdadeiro.",
    "A transformação para você passa por descer — trazer a energia do peito e dos ombros até o chão, até as pernas, até a pelve. Quando o poder vem do corpo inteiro e não apenas do tórax, ele se torna sustentável, autêntico, enraizado. É aí que o líder se torna sábio.",
  ],
  masoquista: [
    "Há uma força em você que é silenciosa e contínua — uma capacidade de suportar que não é fraqueza, mas acúmulo de pressão não expressa. O corpo masoquista comprimiu-se ao longo do tempo, como uma mola que nunca pôde expandir. Essa compressão é visível nas proporções — o corpo parece curto, denso, pressionado de cima para baixo.",
    "A ferida que moldou essa estrutura foi a humilhação — a vontade que foi quebrada repetidamente até que a submissão se tornou mais segura que a expressão. No corpo, isso aparece como tensão crônica nos quadris, pescoço e coxas — lugares onde se guarda o que não pode ser dito, o que não pode ser sentido, o que foi engolido por décadas.",
    "Sua lealdade é profunda. Uma vez que você se compromete com alguém ou algo, vai até o fim — mesmo quando isso custa mais do que deveria. Você conhece o sofrimento de dentro e por isso tem uma compaixão rara. O caminho de cura passa por aprender que expansão é possível — que você pode crescer, se expressar, dizer não, e o mundo não vai desabar.",
    "A transformação para a estrutura Masoquista é a expansão. Não a explosão, mas o crescimento gradual — a voz que sobe um tom de cada vez, o corpo que aprende a ocupar mais espaço. Cada vez que você se expressa ao invés de engolir, cada vez que coloca um limite ao invés de suportar, você está reescrevendo a história do seu corpo.",
  ],
  rigido: [
    "Você foi feito para funcionar bem no mundo. Sua postura diz isso: ereta, organizada, controlada — um ser que se mantém unido. Há uma competência visível no jeito como você habita seu corpo. Você realiza, entrega, aparece. Sua estrutura é reconhecida como referência pelos que estão ao redor.",
    "A estrutura Rígida carrega a desilusão do coração — o amor que foi punido, que não foi correspondido da forma esperada, que deixou uma ferida invisível. O corpo aprendeu a se manter unido acima de tudo, porque se desmontar era perigoso demais. O resultado é uma armadura bela, bem organizada, que também bloqueia a entrada do amor profundo.",
    "Você tem tudo o que precisa externamente. O desafio é interno: é deixar que o que está dentro possa mostrar-se. A emoção que fica represada não desaparece — ela espera. O coração que está por baixo do controle é sensível, profundo, capaz de um amor transformador. Mas ele precisa de espaço para respirar.",
    "A jornada da estrutura Rígida é a rendição — não a fraqueza, mas a entrega consciente. Quando você consegue relaxar o controle o suficiente para sentir, para chorar, para ser tocado sem defesa, você não perde a força: você a completa. É aí que a excelência exterior e a riqueza interior finalmente se encontram.",
  ],
};

const MENSAGENS: Record<keyof EstruturasPct, string> = {
  esquizoide: "Você tem o direito de existir — plenamente, aqui, agora. O mundo precisa da sua visão, da sua inteligência, da sua sensibilidade única. Você não está aqui por acaso. Cada vez que se permite ser visto, que deixa alguém chegar perto, você está curando a ferida mais antiga. Isso é coragem.",
  oral: "Você merece receber tanto quanto oferece. O universo não quer que você esvazie — quer que você transborde a partir da abundância. Cuide de si com a mesma ternura com que você cuida do outro. Você não precisa ganhar o direito de ser amado — ele já é seu, desde sempre.",
  psicopata: "Sua vulnerabilidade não é fraqueza — é o portal para o poder verdadeiro. Abrir o coração não vai destruí-lo: vai completar o que a força sozinha não consegue. Você já provou que pode conquistar o mundo. Agora é hora de conquistar a si mesmo com a mesma coragem.",
  masoquista: "Você já sofreu o suficiente. Você não precisa de mais provações para merecer amor, alegria ou expansão. A vida está convidando você a florescer — não apesar das dificuldades, mas além delas. Você é forte o suficiente para se permitir ser leve.",
  rigido: "Seu coração é a sua maior riqueza — e ele quer falar. Por baixo de toda a competência e do controle existe um ser que sente profundamente e que merece ser sentido. Relaxar não é ceder: é finalmente chegar em casa. Deixe-se ser tocado pela vida com tudo que você tem.",
};

const PADROES_POSTURAIS: Record<keyof EstruturasPct, string> = {
  esquizoide: "Corpo estreito com segmentos desconectados entre si. Os ombros tendem a contrair-se e a pelve fica retraída. Há quebras na linha postural que criam fragmentação visual — o corpo parece não habitar a si mesmo por inteiro.",
  oral: "Colapso postural de cima para baixo: o peito afunda, os ombros caem para frente e a cabeça avança além do eixo corporal. O corpo tem baixo tônus geral e pouco enraizamento — como se ainda buscasse apoio externo.",
  psicopata: "Expansão ascendente marcante: ombros largos, peito projetado para frente e cabeça erguida comunicando comando natural. O corpo concentra vitalidade na metade superior, com pernas e pelve menos expressivas.",
  masoquista: "Compressão descendente: o corpo parece pressionado de cima para baixo. Pescoço curto, ombros rebaixados, tronco largo e denso. A tensão crônica nos quadris e coxas revela a energia que não encontra saída.",
  rigido: "Postura ereta e bem alinhada, com proporções equilibradas entre tórax e pelve. A organização corporal é notável — cabeça, ombros e quadril formam um eixo preciso. A rigidez da armadura é discreta mas presente na contenção do movimento.",
};

const CENTROS: Record<keyof EstruturasPct, string> = {
  esquizoide: "Cabeça e região cervical superior — a energia se concentra no pensamento e se isola do restante do corpo",
  oral: "Tórax e garganta — onde se guarda o não-dito, o choro contido e o desejo profundo de contato",
  psicopata: "Tórax superior, ombros e pescoço — região de poder, expansão e acumulação de carga",
  masoquista: "Quadril, lombar e coxas — onde a energia fica represada e comprimida em tensão crônica",
  rigido: "Tórax e coração — onde o amor está presente mas bloqueado pela armadura invisível",
};

const PADROES_ENERGETICOS: Record<keyof EstruturasPct, string> = {
  esquizoide: "A energia flui para a cabeça e se perde na abstração antes de alcançar o corpo físico. Há pouco fluxo entre cognição e ação — o sistema nervoso está em alerta constante e dificilmente descansa.",
  oral: "O fluxo energético tem baixa voltagem geral. A carga se perde rapidamente porque o sistema não retém energia com facilidade — há necessidade constante de recarga através do contato com o outro.",
  psicopata: "A energia flui em alta voltagem para cima — tórax, cabeça, braços. Abaixo da cintura o fluxo diminui. Há acumulação de carga na parte superior que pode gerar tensão crônica nos ombros e nuca.",
  masoquista: "A energia encontra bloqueios em nível pélvico e lombar, onde a tensão crônica a mantém represada. Quando a pressão acumula o suficiente emerge como explosão emocional ou adoecimento. O sistema pede libertação.",
  rigido: "O fluxo energético é organizado e contido — corre por canais definidos mas raramente transborda. Disponível para ação e realização, encontra barreiras quando precisa fluir no campo emocional e relacional.",
};

const COMBOS: Partial<Record<string, string>> = {
  "esquizoide-oral": "uma sensibilidade extrema que tanto se retira para a mente quanto anseia por conexão. Há um movimento interno constante entre o isolamento criativo e o desejo de pertencer.",
  "esquizoide-psicopata": "uma combinação rara de visão estratégica e profundidade filosófica. O poder de influência existe, mas opera a partir de uma distância segura — o contato pleno ainda é o grande desafio.",
  "esquizoide-masoquista": "uma pressão interna dupla: o corpo pede silêncio e o mundo pede conformidade. Há riqueza interior enorme, mas o acesso a ela fica bloqueado pela tensão corporal crônica.",
  "esquizoide-rigido": "precisão intelectual aliada à organização — mas a vivência emocional permanece distante. A couraça rígida protege o espaço esquizóide, mas também impede a chegada do calor humano.",
  "oral-esquizoide": "um ser que tanto precisa de amor quanto recua do contato. O anseio de pertencer coexiste com o medo de ser destruído. É uma polaridade que pede integração gradual e cuidadosa.",
  "oral-psicopata": "a combinação de necessidade afetiva com força de influência — podem aparecer padrões de manipulação emocional sutil, onde a necessidade se disfarça de generosidade que espera retribuição.",
  "oral-masoquista": "sofrimento em dobro: abandono e humilhação formando um padrão de autossacrifício profundo. Mas também compaixão e empatia excepcionais — quem conhece a dor acolhe a dor do outro.",
  "oral-rigido": "o coração que quer amar mas aprendeu a controlar essa necessidade. A estrutura rígida tenta organizar e conter a necessidade oral — mas o amor verdadeiro flui quando deixamos de administrá-lo.",
  "psicopata-esquizoide": "um visionário que prefere operar nos bastidores. Há poder, mas ele é exercido de longe, através de ideias e estratégias mais do que presença física direta.",
  "psicopata-oral": "força e vulnerabilidade em tensão permanente. A fachada poderosa esconde uma necessidade profunda de ser visto e amado. A cura acontece quando o poder não precisa mais ser defesa contra o amor.",
  "psicopata-masoquista": "uma energia densa e intensa — poder de cima pressionando contra resistência de baixo. Pode gerar explosões ou implosões quando o sistema não encontra saída saudável.",
  "psicopata-rigido": "performance de alto nível — um ser que tanto domina quanto organiza. A excelência é real, mas pode servir de escudo contra a vulnerabilidade. Muito realizado externamente, com saudade de si mesmo.",
  "masoquista-esquizoide": "peso e distância — o corpo carrega muito enquanto a mente se afasta. A riqueza interior existe, mas fica enterrada sob camadas de tensão corporal e desconexão.",
  "masoquista-oral": "duas estruturas de sofrimento que se reforçam — o peso do mundo combinado com a necessidade do outro. A transformação vem através do autocuidado radical e de aprender a receber.",
  "masoquista-psicopata": "força em conflito com força — uma luta interna constante entre submissão e poder. Quando integrados, podem gerar uma liderança autêntica que conhece tanto a dor quanto a força.",
  "masoquista-rigido": "resistência disciplinada — o corpo suporta enquanto a mente organiza. Um guerreiro silencioso e confiável, que precisa aprender que expansão e alegria também lhe pertencem.",
  "rigido-esquizoide": "organização externa, profundidade interna. Um ser que funciona bem no mundo mas habita universos muito mais ricos em seu interior. O desafio é trazer essa riqueza para fora.",
  "rigido-oral": "o coração que controla o coração que anseia. A estrutura rígida tenta conter a necessidade oral — mas o amor verdadeiro flui quando deixamos de controlá-lo.",
  "rigido-psicopata": "uma combinação de excelência e poder — alguém que tanto realiza quanto lidera. Mas o que está por baixo? Quando ninguém está olhando, o que este ser realmente sente?",
  "rigido-masoquista": "disciplina e resistência — um ser que entrega muito e reclama pouco. A organização rígida cobre a pressão masoquista, criando alguém confiável que internamente pede por alívio.",
};

const CARACTERISTICAS: Record<keyof EstruturasPct, string[]> = {
  esquizoide: ["Assimetria corporal perceptível entre os lados", "Segmentos corporais visualmente desconectados", "Estrutura ectomorfa com pouco volume muscular", "Ombros contraídos ou elevados", "Pelve retraída e desengajada do tronco"],
  oral: ["Peito colapsado com esterno rebaixado", "Baixo tônus muscular generalizado", "Postura curvada com inclinação anterior", "Pouco enraizamento nos membros inferiores", "Ombros caídos para frente"],
  psicopata: ["Ombros marcadamente largos em relação ao quadril", "Peito expandido e projetado", "Desenvolvimento muscular concentrado na parte superior", "Cabeça erguida com queixo elevado", "Contração visível no dorso superior e trapézio"],
  masoquista: ["Corpo comprimido e de aparência densa", "Pescoço curto e grosso", "Tronco largo com pouca definição de cintura", "Quadril amplo e pesado", "Tensão visível na região lombar e coxas"],
  rigido: ["Postura ereta e precisa", "Simetria corporal marcante", "Tônus muscular bem distribuído", "Proporções equilibradas entre ombros e quadril", "Alinhamento correto da coluna vertebral"],
};

// ── Main export ───────────────────────────────────────────────────────────────

export async function analyzeTracoDeCarater(
  photos: Array<{ tipo: TipoFoto; source: File | string }>,
  token?: string
): Promise<ResultadoAnalise> {
  if (photos.length === 0) throw new Error("Nenhuma foto fornecida para análise.");

  const metricsList: Metrics[] = [];
  const observacoesPorFoto: Partial<Record<TipoFoto, string>> = {};

  for (const { tipo, source } of photos) {
    try {
      const pd = source instanceof File
        ? await loadImageFromFile(source)
        : await loadImageFromUrl(source, token ?? "");
      metricsList.push(measurePhoto(pd, tipo));
    } catch {
      // Skip unreadable photo, continue with others
    }
  }

  if (metricsList.length === 0) {
    throw new Error("Não foi possível processar as fotos. Verifique o formato das imagens.");
  }

  const estruturas = scoreMetrics(metricsList);
  const sorted = (Object.entries(estruturas) as [keyof EstruturasPct, number][]).sort((a, b) => b[1] - a[1]);
  const principal = sorted[0][0];
  const secundaria = sorted[1][0];

  // Observations per photo
  for (const m of metricsList) {
    if (m.tipo === "rosto") observacoesPorFoto["rosto"] = OBS_ROSTO[principal];
    if (m.tipo === "corpo-frente") observacoesPorFoto["corpo-frente"] = OBS_FRENTE[principal];
    if (m.tipo === "corpo-lado") observacoesPorFoto["corpo-lado"] = OBS_LADO[principal];
  }

  // Rich interpretation
  const ip = INTERPRETACOES[principal];
  const is_ = INTERPRETACOES[secundaria];
  const combo = COMBOS[`${principal}-${secundaria}`]
    ?? "a singularidade desta combinação cria um ser de contrastes ricos, com profundidade emocional e complexidade que demandam autoconhecimento continuado para serem plenamente integrados.";

  const interpretacao = [
    ip[0],
    ip[1],
    is_[0],
    ip[2],
    `A combinação de ${NOMES[principal]} (${estruturas[principal]}%) com ${NOMES[secundaria]} (${estruturas[secundaria]}%) cria ${combo}`,
  ].join("\n\n");

  const caract = [...CARACTERISTICAS[principal].slice(0, 4), ...CARACTERISTICAS[secundaria].slice(0, 2)];

  return {
    estruturas,
    estruturaPrincipal: principal,
    estruturaSecundaria: secundaria,
    observacoesPorFoto,
    padraoPostural: PADROES_POSTURAIS[principal],
    caracteristicasFisicasObservadas: caract,
    interpretacao,
    centroEnergetico: CENTROS[principal],
    padraoEnergetico: PADROES_ENERGETICOS[principal],
    mensagemTerapeutica: MENSAGENS[principal],
  };
}
