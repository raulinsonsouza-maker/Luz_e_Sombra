/**
 * GET /usuarios/me/foto-perfil/view devolve bytes via `ObjectStorageService.downloadObject`,
 * que usa `Content-Type: application/octet-stream`. O `<img src=blob:>` funciona na mesma;
 * não exigir `image/*` na resposta.
 */
export function profilePhotoViewResponseIsImageBody(res: Response): boolean {
  if (!res.ok) return false;
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  if (ct.includes("application/json")) return false;
  return true;
}
