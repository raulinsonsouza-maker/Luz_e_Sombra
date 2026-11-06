import { diaDoCalendario } from "@/lib/frasesAno";

const arquivos = import.meta.glob("../../../../docs/imagens/*.{png,jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function numeroDoArquivo(caminho: string): number {
  const nome = caminho.split(/[/\\]/).pop() ?? "";
  const numero = Number.parseInt(nome, 10);
  return Number.isFinite(numero) ? numero : Number.MAX_SAFE_INTEGER;
}

const IMAGENS_DO_BANCO = Object.entries(arquivos)
  .sort(([a], [b]) => numeroDoArquivo(a) - numeroDoArquivo(b) || a.localeCompare(b))
  .map(([, url]) => url);

const FUNDO_RESERVA = "/images/peao.jpeg";

/** Uma imagem do banco por dia. Com menos fotos do que dias, o ciclo recomeça. */
export function imagemDoDia(data: Date = new Date()): string {
  if (IMAGENS_DO_BANCO.length === 0) return FUNDO_RESERVA;
  const indice = (diaDoCalendario(data) - 1) % IMAGENS_DO_BANCO.length;
  return IMAGENS_DO_BANCO[indice] ?? FUNDO_RESERVA;
}
