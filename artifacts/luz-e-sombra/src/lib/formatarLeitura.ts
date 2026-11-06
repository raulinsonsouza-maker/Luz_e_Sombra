export type BlocoLeitura =
  | { tipo: "paragrafo"; texto: string }
  | { tipo: "lista"; itens: string[]; intro?: string }
  | { tipo: "rotulo"; rotulo: string; texto: string }
  | { tipo: "citacao"; texto: string };

const VERBOS_DE_FECHO = ["são", "é", "foi", "foram", "fica", "ficam", "vale", "valem", "pode", "podem", "têm", "tem"];

function temPalavra(texto: string, palavra: string): boolean {
  const alvo = palavra.toLocaleLowerCase("pt-BR");
  return texto.split(/[^\p{L}]+/u).some((parte) => parte.toLocaleLowerCase("pt-BR") === alvo);
}

function temAlgumVerbo(texto: string): boolean {
  return VERBOS_DE_FECHO.some((verbo) => temPalavra(texto, verbo));
}

export function ehTopico(texto: string): boolean {
  const t = texto.trim();
  if (!t || t.length > 170) return false;
  if (t.includes("•")) return false;
  return (t.match(/[.!?]/g) ?? []).length < 2;
}

export function pontuar(texto: string): string {
  const t = arrumarAspas(texto.trim());
  if (!t) return t;
  if (/[.!?…][)"”»]*$/.test(t)) return t;
  return `${t}.`;
}

/** Separa parágrafo, lista, tópico e citação para a leitura não sair colada. */
export function estruturarTexto(bruto: string): BlocoLeitura[] {
  const texto = arrumarAspas(bruto.replace(/\r\n/g, "\n")).trim();
  if (!texto) return [];
  if (ehCitacaoInteira(texto)) return [{ tipo: "citacao", texto: formatarCitacao(texto) }];

  const blocos: BlocoLeitura[] = [];
  for (const pedaco of texto.split(/\n{2,}/)) {
    const limpo = pedaco.trim();
    if (limpo) blocos.push(...estruturarPedaco(limpo));
  }
  return fundirListas(blocos);
}

function estruturarPedaco(pedaco: string): BlocoLeitura[] {
  if (/•/.test(pedaco) || /^\s*[-*]\s+/m.test(pedaco)) return estruturarMarcadores(pedaco);

  const linhas = pedaco.split("\n").map((linha) => linha.trim()).filter(Boolean);
  if (linhas.length >= 2 && linhas.every(ehTopico)) {
    return [{ tipo: "lista", itens: linhas.map(pontuar) }];
  }
  return estruturarProsa(linhas.join(" "));
}

function estruturarMarcadores(pedaco: string): BlocoLeitura[] {
  const normalizado = pedaco.replace(/\n+\s*[•\-*]\s+/g, "\n• ").replace(/^\s*[•\-*]\s+/, "• ");
  const comecaComMarca = normalizado.startsWith("•");
  const partes = normalizado.split("•").map((parte) => parte.trim()).filter(Boolean);
  const intro = (comecaComMarca ? "" : partes[0] ?? "").replace(/\s*temas principais:\s*$/i, "").trim();
  const marcas = comecaComMarca ? partes : partes.slice(1);
  const blocos: BlocoLeitura[] = intro ? estruturarPedaco(intro) : [];
  for (const marca of marcas) {
    const texto = marca.replace(/\s+/g, " ").trim();
    const topico = partirRotulo(texto);
    if (topico) blocos.push(topico);
    else if (texto) blocos.push({ tipo: "lista", itens: [pontuar(texto)] });
  }
  return blocos;
}

function estruturarProsa(texto: string): BlocoLeitura[] {
  const frases = fatiarFrases(texto);
  const blocos: BlocoLeitura[] = [];
  const prosa: string[] = [];
  const soltar = () => {
    if (!prosa.length) return;
    const junto = prosa.join(" ");
    const rotulo = partirRotulo(junto);
    if (rotulo && !fraseComoLista(junto)) blocos.push(rotulo);
    else blocos.push({ tipo: "paragrafo", texto: junto });
    prosa.length = 0;
  };

  for (const frase of frases) {
    const lista = fraseComoLista(frase);
    if (!lista) {
      prosa.push(frase);
      continue;
    }
    soltar();
    const itens = lista.itens.map((item) => pontuar(capitalizar(item)));
    const introCurta = lista.intro && lista.intro.split(/\s+/).length <= 6 ? lista.intro : undefined;
    if (lista.intro && !introCurta) blocos.push({ tipo: "paragrafo", texto: pontuar(lista.intro) });
    blocos.push(introCurta ? { tipo: "lista", intro: introCurta, itens } : { tipo: "lista", itens });
  }
  soltar();
  return blocos;
}

function fraseComoLista(frase: string): { intro?: string; itens: string[] } | null {
  const limpa = frase.replace(/[.!?]+$/, "").trim();
  const colon = limpa.indexOf(":");
  let intro: string | undefined;
  let corpo = limpa;
  if (colon > 0 && colon < 48) {
    intro = limpa.slice(0, colon).trim();
    corpo = limpa.slice(colon + 1).trim();
  }
  const itens = fatiarVirgulas(corpo).filter((item) => item.length >= 3);
  const minimo = intro ? 3 : 4;
  if (itens.length < minimo) return null;
  if (itens.some((item) => item.length > 72)) return null;
  if (temAlgumVerbo(semParenteses(itens[itens.length - 1] ?? ""))) return null;
  if (itens.some((item) => ["que", "porque", "quando"].some((palavra) => temPalavra(semParenteses(item), palavra)))) return null;
  if (!intro && /\b(você|seu|sua)\b/i.test(itens[0] ?? "")) return null;
  return { intro, itens };
}

function partirRotulo(texto: string): BlocoLeitura | null {
  const match = texto.match(/^([^:]{3,42}):\s+([\s\S]+)$/);
  if (!match) return null;
  const corpo = match[2].trim();
  if (temPalavra(match[1], "é")) return null;
  if (corpo.length < 8 || /[.!?].+[.!?]/s.test(corpo)) return null;
  return { tipo: "rotulo", rotulo: humanizarRotulo(match[1]), texto: pontuar(corpo) };
}

function humanizarRotulo(rotulo: string): string {
  const limpo = rotulo.trim().replace(/\s+/g, " ");
  const base = limpo === limpo.toLocaleUpperCase("pt-BR") ? limpo.toLocaleLowerCase("pt-BR") : limpo;
  return base.charAt(0).toLocaleUpperCase("pt-BR") + base.slice(1);
}

function fatiarFrases(texto: string): string[] {
  const frases: string[] = [];
  let atual = "";
  let paren = 0;
  let aspas = false;
  for (let i = 0; i < texto.length; i++) {
    const ch = texto[i] ?? "";
    atual += ch;
    if (ch === "(") paren += 1;
    else if (ch === ")") paren = Math.max(0, paren - 1);
    else if (ch === '"') aspas = !aspas;
    else if (!paren && !aspas && /[.!?]/.test(ch)) {
      const prox = texto[i + 1] ?? "";
      if (!prox || /\s/.test(prox)) {
        if (atual.trim()) frases.push(atual.trim());
        atual = "";
      }
    }
  }
  if (atual.trim()) frases.push(atual.trim());
  return frases;
}

function fatiarVirgulas(texto: string): string[] {
  const partes: string[] = [];
  let atual = "";
  let paren = 0;
  for (const ch of texto) {
    if (ch === "(") paren += 1;
    if (ch === ")" && paren > 0) paren -= 1;
    if (ch === "," && paren === 0) {
      if (atual.trim()) partes.push(atual.trim());
      atual = "";
    } else {
      atual += ch;
    }
  }
  if (atual.trim()) partes.push(atual.trim());
  return partes;
}

function semParenteses(texto: string): string {
  return texto.replace(/\([^)]*\)/g, " ");
}

function capitalizar(texto: string): string {
  return texto.replace(/^\p{Ll}/u, (letra) => letra.toLocaleUpperCase("pt-BR"));
}

function ehCitacaoInteira(texto: string): boolean {
  return /^["“][\s\S]+["”]$/.test(texto) && !texto.slice(1, -1).includes('"');
}

function formatarCitacao(texto: string): string {
  const miolo = texto.replace(/^["“]|["”]$/g, "").trim();
  const cap = miolo.charAt(0).toLocaleUpperCase("pt-BR") + miolo.slice(1);
  return `"${pontuar(cap)}"`;
}

function arrumarAspas(texto: string): string {
  return texto.replace(/([.!?]\s+)(["“])([^"”]+)(["”])/g, (_tudo, antes: string, abre: string, miolo: string, fecha: string) => {
    const limpo = miolo.trim();
    const cap = limpo.charAt(0).toLocaleUpperCase("pt-BR") + limpo.slice(1);
    return `${antes}${abre}${pontuar(cap)}${fecha}`;
  });
}

function fundirListas(blocos: BlocoLeitura[]): BlocoLeitura[] {
  const saida: BlocoLeitura[] = [];
  for (const bloco of blocos) {
    const anterior = saida[saida.length - 1];
    if (bloco.tipo === "lista" && anterior?.tipo === "lista" && !bloco.intro && !anterior.intro) anterior.itens.push(...bloco.itens);
    else saida.push(bloco);
  }
  return saida;
}
