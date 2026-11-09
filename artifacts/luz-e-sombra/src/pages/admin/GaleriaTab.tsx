import { useEffect, useRef, useState } from "react";
import { ImageIcon, Loader2, Trash2, Upload } from "lucide-react";
import { apiFetch } from "@/lib/auth";
import { toastApiError } from "@/lib/apiError";
import { CARD, C, type ShowMsg } from "./shared";

type ItemGaleria = {
  id: number;
  ordem: number;
  origem: string;
  path: string;
  url: string;
  thumbUrl: string;
  ativo: boolean;
};

export function GaleriaTab({ showMsg }: { showMsg: ShowMsg }) {
  const [itens, setItens] = useState<ItemGaleria[]>([]);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function carregar() {
    setLoading(true);
    try {
      const res = await apiFetch("/galeria");
      if (res.ok) {
        const data = await res.json() as { itens: ItemGaleria[] };
        setItens(data.itens ?? []);
      } else {
        showMsg("erro", "Não foi possível carregar a galeria.");
      }
    } catch {
      toastApiError();
    }
    setLoading(false);
  }

  useEffect(() => {
    void carregar();
  }, []);

  async function enviarArquivos(files: FileList | null) {
    if (!files?.length) return;
    setEnviando(true);
    let ok = 0;
    try {
      for (const file of Array.from(files)) {
        const urlRes = await apiFetch("/galeria/upload-url", { method: "POST" });
        if (!urlRes.ok) throw new Error("upload-url");
        const { uploadURL, objectPath } = await urlRes.json() as { uploadURL: string; objectPath: string };
        const up = await fetch(uploadURL, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type || "image/jpeg" },
        });
        if (!up.ok) throw new Error("put");
        const reg = await apiFetch("/galeria", {
          method: "POST",
          body: JSON.stringify({ path: objectPath }),
        });
        if (!reg.ok) throw new Error("register");
        ok += 1;
      }
      showMsg("sucesso", ok === 1 ? "Imagem adicionada ao portal." : `${ok} imagens adicionadas.`);
      await carregar();
    } catch {
      showMsg("erro", "Falha ao enviar imagem.");
    }
    if (fileRef.current) fileRef.current.value = "";
    setEnviando(false);
  }

  async function remover(item: ItemGaleria) {
    if (item.origem === "estatico") return;
    if (!confirm("Remover esta imagem do ciclo do portal?")) return;
    try {
      const res = await apiFetch(`/galeria/${item.id}`, { method: "DELETE" });
      if (res.ok) {
        showMsg("sucesso", "Imagem removida.");
        setItens((prev) => prev.filter((i) => i.id !== item.id));
      } else {
        const d = await res.json().catch(() => ({}));
        showMsg("erro", (d as { error?: string }).error || "Não foi possível remover.");
      }
    } catch {
      showMsg("erro", "Não foi possível remover.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3" style={CARD}>
        <div>
          <p className="text-sm font-semibold" style={{ color: C.text }}>
            {itens.length} imagem{itens.length === 1 ? "" : "ns"} no portal
          </p>
          <p className="text-xs mt-0.5" style={{ color: C.muted }}>
            Entram na rotação diária de todo o portal.
          </p>
        </div>
        <label
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #c8a56b, #9c7742)",
            color: "#1a1208",
            opacity: enviando ? 0.7 : 1,
          }}
        >
          {enviando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Enviar
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={enviando}
            onChange={(e) => void enviarArquivos(e.target.files)}
          />
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.gold }} />
        </div>
      ) : itens.length === 0 ? (
        <div className="text-center py-12 rounded-2xl" style={CARD}>
          <ImageIcon className="w-10 h-10 mx-auto mb-3 opacity-20" style={{ color: C.gold }} />
          <p className="text-sm" style={{ color: C.muted }}>Nenhuma imagem no acervo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
          {itens.map((item) => (
            <div
              key={item.id}
              className="relative aspect-square rounded-xl overflow-hidden group"
              style={{ border: "1px solid rgba(200,165,107,0.2)" }}
            >
              <img
                src={item.thumbUrl}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div
                className="absolute inset-x-0 bottom-0 px-1.5 py-1 text-[10px] font-semibold flex items-center justify-between"
                style={{ background: "rgba(19,15,9,0.72)", color: C.gold }}
              >
                <span>#{item.ordem}</span>
                {item.origem === "upload" && (
                  <button
                    type="button"
                    title="Remover"
                    onClick={() => void remover(item)}
                    className="p-0.5 rounded opacity-80 hover:opacity-100"
                    style={{ color: "#f87171" }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
