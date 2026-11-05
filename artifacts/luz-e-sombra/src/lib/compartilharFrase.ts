const PORTAL_URL = "https://portaliluminando.com.br";
const FUNDO = "/images/peao.jpeg";

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

async function cartaoStories(frase: string): Promise<File | null> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1920;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#1e1812";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("fundo"));
      el.src = FUNDO;
    });
    const escala = Math.max(canvas.width / img.width, canvas.height / img.height);
    const w = img.width * escala;
    const h = img.height * escala;
    ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
  } catch {
    /* fundo sólido já pintado */
  }

  ctx.fillStyle = "rgba(18,12,8,0.55)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#c8a56b";
  ctx.font = "600 36px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("PORTAL ILUMINANDO", canvas.width / 2, 280);

  ctx.fillStyle = "#f7f2ec";
  ctx.font = "500 54px serif";
  const linhas = quebrar(ctx, frase, 860);
  const topo = 820 - (linhas.length * 72) / 2;
  linhas.forEach((linha, i) => ctx.fillText(linha, canvas.width / 2, topo + i * 72));

  ctx.fillStyle = "#c8a56b";
  ctx.font = "500 32px sans-serif";
  ctx.fillText("portaliluminando.com.br", canvas.width / 2, 1680);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob) return null;
  return new File([blob], "frase-do-dia.png", { type: "image/png" });
}

export function textoCompartilhar(frase: string): string {
  return `${frase}\n\nPortal Iluminando\n${PORTAL_URL}`;
}

/** Abre a folha do celular (Stories ou WhatsApp). No computador, copia e abre o WhatsApp. */
export async function compartilharFrase(frase: string): Promise<"nativo" | "whatsapp"> {
  const texto = textoCompartilhar(frase);
  const arquivo = await cartaoStories(frase);

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
