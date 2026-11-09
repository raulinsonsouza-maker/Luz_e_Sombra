const PORTAL_URL = "https://portaliluminando.com.br";
const FUNDO = "/images/peao.jpeg";
import { detectarTomLogo, srcLogo } from "@/lib/tomLogoPorFundo";

function quebrar(ctx: CanvasRenderingContext2D, texto: string, max: number): string[] {
  const palavras = texto.split(" ");
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
  const largura = chars.reduce((soma, char) => soma + ctx.measureText(char).width, 0) + espaco * (chars.length - 1);
  let cursor = x - largura / 2;
  const alinhamento = ctx.textAlign;
  ctx.textAlign = "left";
  for (const char of chars) {
    ctx.fillText(char, cursor, y);
    cursor += ctx.measureText(char).width + espaco;
  }
  ctx.textAlign = alinhamento;
}

function linhasQueCabem(
  ctx: CanvasRenderingContext2D,
  frase: string,
  maxLargura: number,
  maxAltura: number,
  tamanhoMax: number,
  tamanhoMin: number,
) {
  let tamanho = tamanhoMax;
  while (tamanho >= tamanhoMin) {
    ctx.font = `500 ${tamanho}px "Tan Mon Cheri", serif`;
    const linhas = quebrar(ctx, frase, maxLargura);
    const altura = linhas.length * tamanho * 1.35;
    if (altura <= maxAltura) return { tamanho, linhas, altura };
    tamanho -= 2;
  }
  ctx.font = `500 ${tamanhoMin}px "Tan Mon Cheri", serif`;
  const linhas = quebrar(ctx, frase, maxLargura);
  return { tamanho: tamanhoMin, linhas, altura: linhas.length * tamanhoMin * 1.35 };
}

async function cartaoStories(frase: string, data?: string, fundo: string = FUNDO, abertura?: string): Promise<File | null> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#1e1812";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  try {
    const img = await carregarImagem(fundo);
    const escala = Math.max(canvas.width / img.width, canvas.height / img.height);
    const w = img.width * escala;
    const h = img.height * escala;
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  } catch {
    /* fundo sólido já pintado */
  }

  const velatura = ctx.createLinearGradient(0, 0, 0, canvas.height);
  velatura.addColorStop(0, "rgba(18,12,8,0.28)");
  velatura.addColorStop(0.42, "rgba(18,12,8,0.48)");
  velatura.addColorStop(1, "rgba(18,12,8,0.78)");
  ctx.fillStyle = velatura;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  try {
    await document.fonts.load('500 78px "Tan Mon Cheri"');
  } catch {
    /* segue com a fonte disponível */
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  let cursor = 320;

  if (data) {
    ctx.fillStyle = "#c8a56b";
    ctx.font = "600 34px sans-serif";
    textoEspacado(ctx, data, canvas.width / 2, cursor, 5);
    cursor += 72;
  }

  if (abertura) {
    const blocoAbertura = linhasQueCabem(ctx, abertura, 820, 420, 58, 40);
    ctx.fillStyle = "#f7f2ec";
    ctx.font = `500 ${blocoAbertura.tamanho}px "Tan Mon Cheri", serif`;
    const passoAbertura = blocoAbertura.tamanho * 1.28;
    blocoAbertura.linhas.forEach((linha, i) => ctx.fillText(linha, canvas.width / 2, cursor + i * passoAbertura));
    cursor += blocoAbertura.linhas.length * passoAbertura + 36;
  }

  ctx.fillStyle = "rgba(200,165,107,0.9)";
  ctx.fillRect(canvas.width / 2 - 36, cursor, 72, 2);
  cursor += 52;

  const zonaAltura = Math.max(220, 1580 - cursor);
  const bloco = linhasQueCabem(ctx, frase, 840, zonaAltura, 42, 28);
  ctx.fillStyle = "rgba(247,242,236,0.92)";
  ctx.font = `500 ${bloco.tamanho}px "Tan Mon Cheri", serif`;
  const passo = bloco.tamanho * 1.35;
  const inicio = cursor + passo / 2;
  bloco.linhas.forEach((linha, i) => ctx.fillText(linha, canvas.width / 2, inicio + i * passo));

  try {
    const tom = await detectarTomLogo(fundo);
    const logo = await carregarImagem(srcLogo(tom));
    const logoLargura = 320;
    const logoAltura = (logo.height / logo.width) * logoLargura;
    const logoY = 1705;
    ctx.fillStyle = "#c8a56b";
    ctx.font = "600 28px sans-serif";
    textoEspacado(ctx, "LETÍCIA GALLONI", canvas.width / 2, logoY - 36, 5);
    ctx.drawImage(logo, (canvas.width - logoLargura) / 2, logoY, logoLargura, logoAltura);
  } catch {
    /* segue sem a marca se o arquivo não carregar */
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
export async function compartilharFrase(frase: string, data?: string, fundo?: string, abertura?: string): Promise<"nativo" | "whatsapp"> {
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
    /* segue para o WhatsApp mesmo sem copiar */
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank", "noopener,noreferrer");
  return "whatsapp";
}
