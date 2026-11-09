import { and, asc, eq, max } from "drizzle-orm";
import { db, galeriaImagensTable } from "@workspace/db";

export type GaleriaItem = {
  id: number;
  ordem: number;
  origem: string;
  path: string;
  /** URL usável em <img> / rotação do portal */
  url: string;
  thumbUrl: string;
  ativo: boolean;
};

let cachePaths: { at: number; paths: string[] } | null = null;
const CACHE_MS = 60_000;

export function urlPublicaGaleria(id: number, origem: string, path: string): string {
  if (origem === "estatico" || path.startsWith("/imagens-dia/")) {
    return path.replace(/\.png$/i, ".jpg");
  }
  return `/api/galeria/${id}/imagem`;
}

export function thumbUrlGaleria(id: number, origem: string, path: string): string {
  if (origem === "estatico" || path.startsWith("/imagens-dia/")) {
    const m = path.match(/\/imagens-dia\/(?:thumbs\/)?(\d+)\.(?:png|jpe?g|webp)$/i);
    if (m) return `/imagens-dia/thumbs/${m[1]}.jpg`;
  }
  return urlPublicaGaleria(id, origem, path);
}

export function invalidateGaleriaCache(): void {
  cachePaths = null;
}

export async function listarGaleriaAtiva(): Promise<GaleriaItem[]> {
  const rows = await db
    .select()
    .from(galeriaImagensTable)
    .where(eq(galeriaImagensTable.ativo, true))
    .orderBy(asc(galeriaImagensTable.ordem));

  return rows.map((r) => ({
    id: r.id,
    ordem: r.ordem,
    origem: r.origem,
    path: r.path,
    url: urlPublicaGaleria(r.id, r.origem, r.path),
    thumbUrl: thumbUrlGaleria(r.id, r.origem, r.path),
    ativo: r.ativo,
  }));
}

export async function pathsAcervoAtivo(): Promise<string[]> {
  const now = Date.now();
  if (cachePaths && now - cachePaths.at < CACHE_MS) {
    return cachePaths.paths;
  }
  const items = await listarGaleriaAtiva();
  const paths = items.map((i) => i.url);
  cachePaths = { at: now, paths };
  return paths;
}

export async function proximaOrdemGaleria(): Promise<number> {
  const [row] = await db
    .select({ m: max(galeriaImagensTable.ordem) })
    .from(galeriaImagensTable);
  return (row?.m ?? 0) + 1;
}

export async function softDeleteGaleria(id: number): Promise<boolean> {
  const [row] = await db
    .select()
    .from(galeriaImagensTable)
    .where(and(eq(galeriaImagensTable.id, id), eq(galeriaImagensTable.ativo, true)))
    .limit(1);
  if (!row) return false;
  if (row.origem === "estatico") {
    throw new Error("estatico");
  }
  await db
    .update(galeriaImagensTable)
    .set({ ativo: false })
    .where(eq(galeriaImagensTable.id, id));
  invalidateGaleriaCache();
  return true;
}
