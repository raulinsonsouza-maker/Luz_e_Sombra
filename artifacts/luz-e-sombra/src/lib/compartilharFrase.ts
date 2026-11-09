const PORTAL_URL = "https://portaliluminando.com.br";
const FUNDO = "/images/peao.jpeg";
import { detectarTomLogo, srcLogo } from "@/lib/tomLogoPorFundo";

function quebrar(ctx: CanvasRenderingContext2D, texto: string, max: number): string[] {
  const palavras = texto.split(/\s+/).filter(Boolean);
  const linhas: string[] = [];
  let atual = "";
  for (const palavra of palavras) {
    const tentativa = atual ? `${atual} ${palavra}` : palavra;
    if (ctx.measureText(tentativa).width > max && atual) {
      linhas.push(atual);
      atual = palavra;
    } else {
      atual = tentativa;
    }
  }
  if (atual) linhas.push(atual);
  return linhas;
}

function carregarImagem(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error(src));
    el.src = src;
  });
}

function textoEspacado(ctx: CanvasRenderingContext2D, texto: string, x: number, y: number, espaco: number) {
  const chars = [...texto];
  const largura =
    chars.reduce((soma, char) => soma + ctx.measureText(char).width, 0) +
    espaco * Math.max(chars.length - 1, 0);
  let cursor = x - largura / 2;
  const alinhamento = ctx.textAlign;
  ctx.textAlign = "left";
  for (const char of chars) {
    ctx.fillText(char, cursor, y);
    cursor += ctx.measureText(char).width + espaco;
  }
  ctx.textAlign = alinhamento;
}

function encaixarTexto(
  ctx: CanvasRenderingContext2D,
  texto: string,
  maxLargura: number,
  maxAltura: number,
  tamanhoMax: number,
  tamanhoMin: number,
  entrelinha = 1.28,
) {
  let tamanho = tamanhoMax;
  while (tamanho >= tamanhoMin) {
    ctx.font = `500 ${tamanho}px "Tan Mon Cheri", serif`;
    const linhas = quebrar(ctx, texto, maxLargura);
    const passo = tamanho * entrelinha;
    const altura = linhas.length * passo;
    if (altura <= maxAltura && linhas.length <= 10) {
      return { tamanho, linhas, altura, passo };
    }
    tamanho -= 2;
  }
  ctx.font = `500 ${tamanhoMin}px "Tan Mon Cheri", serif`;
  const linhas = quebrar(ctx, texto, maxLargura);
  const passo = tamanhoMin * entrelinha;
  return { tamanho: tamanhoMin, linhas, altura: linhas.length * passo, passo };
}

function desenharLinhasCentralizadas(
  ctx: CanvasRenderingContext2D,
  linhas: string[],
  centroX: number,
  yTopo: number,
  passo: number,
) {
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  linhas.forEach((linha, i) => {
    ctx.fillText(linha, centroX, yTopo + i * passo);
  });
}

async function cartaoStories(
  reflexao: string,
  data?: string,
  fundo: string = FUNDO,
  abertura?: string,
): Promise<File | null> {
  const W = 1080;
  const H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#1e1812";
  ctx.fillRect(0, 0, W, H);

  try {
    const img = await carregarImagem(fundo);
    const escala = Math.max(W / img.width, H / img.height);
    const w = img.width * escala;
    const h = img.height * escala;
    ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h);
  } catch {
    /* fundo sólido */
  }

  const velatura = ctx.createLinearGradient(0, 0, 0, H);
  velatura.addColorStop(0, "rgba(18,12,8,0.38)");
  velatura.addColorStop(0.45, "rgba(18,12,8,0.52)");
  velatura.addColorStop(1, "rgba(18,12,8,0.82)");
  ctx.fillStyle = velatura;
  ctx.fillRect(0, 0, W, H);

  try {
    await document.fonts.load('500 84px "Tan Mon Cheri"');
    await document.fonts.load('600 32px sans-serif');
  } catch {
    /* segue */
  }

  // Zona segura Stories/Reels: evita topo (status) e base (UI + marca)
  const zonaTopo = 300;
  const zonaBase = 1520;
  const zonaAltura = zonaBase - zonaTopo;
  const centroX = W / 2;
  const maxLargura = 820;

  const temData = Boolean(data?.trim());
  const temAbertura = Boolean(abertura?.trim());
  const alturaData = temData ? 48 : 0;
  const gapAposData = temData ? 56 : 0;
  const alturaDivisor = 2;
  const gapAntesDivisor = 40;
  const gapAposDivisor = 40;

  // Orçamento vertical para os textos (abertura + reflexão)
  const reservaFixa = alturaData + gapAposData + gapAntesDivisor + alturaDivisor + gapAposDivisor;
  const alturaTextos = Math.max(360, zonaAltura - reservaFixa);
  const alturaAberturaMax = temAbertura ? Math.floor(alturaTextos * 0.42) : 0;
  const alturaReflexaoMax = alturaTextos - (temAbertura ? alturaAberturaMax + 8 : 0);

  const blocoAbertura = temAbertura
    ? encaixarTexto(ctx, abertura!.trim(), maxLargura, alturaAberturaMax, 78, 50, 1.22)
    : null;
  const blocoReflexao = encaixarTexto(
    ctx,
    reflexao.trim(),
    maxLargura,
    alturaReflexaoMax,
    temAbertura ? 46 : 56,
    34,
    1.32,
  );

  const alturaBloco =
    alturaData +
    gapAposData +
    (blocoAbertura?.altura ?? 0) +
    (blocoAbertura ? gapAntesDivisor + alturaDivisor + gapAposDivisor : 24) +
    blocoReflexao.altura;

  // Centro óptico levemente acima do meio da zona segura
  let y = zonaTopo + Math.max(0, (zonaAltura - alturaBloco) / 2) - 24;

  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 2;

  if (temData) {
    ctx.fillStyle = "#c8a56b";
    ctx.font = "600 30px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    textoEspacado(ctx, data!.trim().toUpperCase(), centroX, y + 18, 6);
    y += alturaData + gapAposData;
  }

  if (blocoAbertura) {
    ctx.fillStyle = "#f7f2ec";
    ctx.font = `500 ${blocoAbertura.tamanho}px "Tan Mon Cheri", serif`;
    desenharLinhasCentralizadas(ctx, blocoAbertura.linhas, centroX, y, blocoAbertura.passo);
    y += blocoAbertura.altura + gapAntesDivisor;

    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = "rgba(200,165,107,0.9)";
    ctx.fillRect(centroX - 40, y, 80, alturaDivisor);
    y += alturaDivisor + gapAposDivisor;
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 2;
  } else {
    y += 24;
  }

  ctx.fillStyle = "rgba(247,242,236,0.94)";
  ctx.font = `500 ${blocoReflexao.tamanho}px "Tan Mon Cheri", serif`;
  desenharLinhasCentralizadas(ctx, blocoReflexao.linhas, centroX, y, blocoReflexao.passo);

  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  try {
    const tom = await detectarTomLogo(fundo);
    const logo = await carregarImagem(srcLogo(tom));
    const logoLargura = 280;
    const logoAltura = (logo.height / logo.width) * logoLargura;
    const logoY = 1688;
    ctx.fillStyle = "#e8d5b0";
    ctx.font = "600 26px sans-serif";
    textoEspacado(ctx, "LETÍCIA GALLONI", centroX, logoY - 28, 6);
    ctx.drawImage(logo, (W - logoLargura) / 2, logoY, logoLargura, logoAltura);
  } catch {
    /* sem marca */
  }

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) return null;
  return new File([blob], "frase-do-dia.png", { type: "image/png" });
}

export function textoCompartilhar(frase: string, abertura?: string): string {
  const corpo = abertura ? `${abertura}\n\n${frase}` : frase;
  return `${corpo}\n\nPortal Iluminando\n${PORTAL_URL}`;
}

/** Abre a folha do celular (Stories ou WhatsApp). No computador, copia e abre o WhatsApp. */
export async function compartilharFrase(
  frase: string,
  data?: string,
  fundo?: string,
  abertura?: string,
): Promise<"nativo" | "whatsapp"> {
  const texto = textoCompartilhar(frase, abertura);
  const arquivo = await cartaoStories(frase, data, fundo, abertura);

  if (typeof navigator.share === "function") {
    if (arquivo && navigator.canShare?.({ files: [arquivo] })) {
      await navigator.share({
        files: [arquivo],
        title: "Portal Iluminando",
        text: texto,
      });
      return "nativo";
    }
    await navigator.share({
      title: "Portal Iluminando",
      text: texto,
      url: PORTAL_URL,
    });
    return "nativo";
  }

  try {
    await navigator.clipboard.writeText(texto);
  } catch {
    /* segue */
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank", "noopener,noreferrer");
  return "whatsapp";
}
