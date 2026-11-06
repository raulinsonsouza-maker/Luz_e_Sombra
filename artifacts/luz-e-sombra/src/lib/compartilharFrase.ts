const PORTAL_URL = "https://portaliluminando.com.br";
const FUNDO = "/images/peao.jpeg";
import { LOGO_CLARO } from "@/lib/marca";

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

function linhasQueCabem(ctx: CanvasRenderingContext2D, frase: string, maxLargura: number, maxAltura: number) {
  let tamanho = 78;
  while (tamanho >= 42) {
    ctx.font = `500 ${tamanho}px "Tan Mon Cheri", serif`;
    const linhas = quebrar(ctx, frase, maxLargura);
    const altura = linhas.length * tamanho * 1.35;
    if (altura <= maxAltura) return { tamanho, linhas, altura };
    tamanho -= 2;
  }
  ctx.font = `500 42px "Tan Mon Cheri", serif`;
  const linhas = quebrar(ctx, frase, maxLargura);
  return { tamanho: 42, linhas, altura: linhas.length * 42 * 1.35 };
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
  velatura.addColorStop(0, "rgba(18,12,8,0.42)");
  velatura.addColorStop(0.46, "rgba(18,12,8,0.58)");
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

  let cursor = 280;
  try {
    const logo = await carregarImagem(LOGO_CLARO);
    const logoLargura = 820;
    const logoAltura = (logo.height / logo.width) * logoLargura;
    const logoY = 150;
    ctx.drawImage(logo, (canvas.width - logoLargura) / 2, logoY, logoLargura, logoAltura);
    cursor = logoY + logoAltura + 120;
  } catch {
    /* segue sem a marca se o arquivo não carregar */
  }

  if (data) {
    ctx.fillStyle = "#c8a56b";
    ctx.font = "600 30px sans-serif";
    textoEspacado(ctx, data, canvas.width / 2, cursor, 6);
    cursor += 58;
  }

  ctx.fillStyle = "rgba(200,165,107,0.9)";
  ctx.fillRect(canvas.width / 2 - 70, cursor, 140, 3);
  cursor += 52;

  let zonaTopo = cursor;
  let zonaAltura = Math.max(280, 1560 - zonaTopo);
  if (abertura) {
    ctx.fillStyle = "rgba(247,242,236,0.92)";
    ctx.font = '500 40px "Tan Mon Cheri", serif';
    const linhasAbertura = quebrar(ctx, abertura, 760).slice(0, 4);
    const passoAbertura = 52;
    linhasAbertura.forEach((linha, i) => ctx.fillText(linha, canvas.width / 2, cursor + i * passoAbertura));
    const depois = cursor + linhasAbertura.length * passoAbertura + 18;
    ctx.fillStyle = "rgba(200,165,107,0.9)";
    ctx.fillRect(canvas.width / 2 - 36, depois, 72, 2);
    zonaTopo = depois + 48;
    zonaAltura = Math.max(280, 1560 - zonaTopo);
  }

  const bloco = linhasQueCabem(ctx, frase, 840, zonaAltura);
  ctx.fillStyle = "#f7f2ec";
  ctx.font = `500 ${bloco.tamanho}px "Tan Mon Cheri", serif`;
  const passo = bloco.tamanho * 1.35;
  const inicio = zonaTopo + (zonaAltura - bloco.altura) / 2 + passo / 2;
  bloco.linhas.forEach((linha, i) => ctx.fillText(linha, canvas.width / 2, inicio + i * passo));

  ctx.fillStyle = "#c8a56b";
  ctx.font = "600 30px sans-serif";
  textoEspacado(ctx, "portaliluminando.com.br", canvas.width / 2, 1640, 4);

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
