import { useState, useEffect, useRef } from "react";
import {
  Plus, Trash2, Check, Loader2, MessageSquare, FileText, Youtube, ImageIcon, Mic, X,
} from "lucide-react";
import { apiFetch } from "@/lib/auth";
import { AuthenticatedImage } from "@/components/AuthenticatedImage";
import { AuthenticatedAudio } from "@/components/AuthenticatedAudio";
import { getVideoEmbedUrl } from "@/lib/mediaEmbed";
import { toastApiError } from "@/lib/apiError";
import { CARD, CARD_S, INPUT_ST, C, REACTIONS, type Post } from "./shared";

type TipoPost = "texto" | "imagem" | "video" | "audio";

export function ComunidadeTab({ showMsg }: { showMsg: (t: "sucesso" | "erro", msg: string) => void }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [novoTipo, setNovoTipo] = useState<TipoPost>("texto");
  const [novoConteudo, setNovoConteudo] = useState("");
  const [novoMediaUrl, setNovoMediaUrl] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [notificar, setNotificar] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    void buscarPosts();
  }, []);

  useEffect(() => {
    if (!modalAberto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !enviando) fecharModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalAberto, enviando]);

  async function buscarPosts() {
    setLoading(true);
    try {
      const res = await apiFetch("/comunidade");
      if (res.ok) setPosts(await res.json());
    } catch {
      toastApiError();
    }
    setLoading(false);
  }

  function resetForm() {
    setNovoTipo("texto");
    setNovoConteudo("");
    setNovoMediaUrl("");
    setUploadFile(null);
    setNotificar(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function fecharModal() {
    if (enviando) return;
    setModalAberto(false);
    resetForm();
  }

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    if (novoTipo === "texto" && !novoConteudo.trim()) {
      showMsg("erro", "Escreva o conteúdo.");
      return;
    }
    if (novoTipo === "imagem" && !uploadFile) {
      showMsg("erro", "Selecione uma imagem.");
      return;
    }
    if (novoTipo === "audio" && !uploadFile) {
      showMsg("erro", "Selecione um áudio.");
      return;
    }
    if (novoTipo === "video" && !novoMediaUrl.trim()) {
      showMsg("erro", "Cole o link do YouTube ou Vimeo.");
      return;
    }
    setEnviando(true);
    try {
      let mediaUrl: string | undefined;
      if ((novoTipo === "imagem" || novoTipo === "audio") && uploadFile) {
        const urlRes = await apiFetch("/comunidade/upload-url", { method: "POST" });
        if (!urlRes.ok) throw new Error("Erro ao gerar URL");
        const { uploadURL, objectPath } = await urlRes.json();
        const contentType =
          uploadFile.type ||
          (novoTipo === "audio" ? "audio/mpeg" : "image/jpeg");
        const up = await fetch(uploadURL, {
          method: "PUT",
          body: uploadFile,
          headers: { "Content-Type": contentType },
        });
        if (!up.ok) throw new Error("Falha no upload");
        mediaUrl = objectPath;
      } else if (novoTipo === "video") {
        mediaUrl = novoMediaUrl.trim() || undefined;
      }
      const texto = novoConteudo.trim() || " ";
      const res = await apiFetch("/comunidade", {
        method: "POST",
        body: JSON.stringify({ tipo: novoTipo, conteudo: texto, mediaUrl, notificar }),
      });
      if (res.ok) {
        showMsg("sucesso", "Publicação criada!");
        setModalAberto(false);
        resetForm();
        await buscarPosts();
      } else {
        const d = await res.json();
        showMsg("erro", d.error || "Erro ao publicar");
      }
    } catch {
      showMsg("erro", "Erro ao criar publicação");
    }
    setEnviando(false);
  }

  async function handleDeletar(id: number) {
    if (!confirm("Deletar esta publicação?")) return;
    try {
      const res = await apiFetch(`/comunidade/${id}`, { method: "DELETE" });
      if (res.ok) {
        showMsg("sucesso", "Publicação deletada!");
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      showMsg("erro", "Erro ao deletar");
    }
  }

  const tipos: { key: TipoPost; label: string; Icon: typeof FileText }[] = [
    { key: "texto", label: "Texto", Icon: FileText },
    { key: "imagem", label: "Imagem", Icon: ImageIcon },
    { key: "video", label: "Vídeo", Icon: Youtube },
    { key: "audio", label: "Áudio", Icon: Mic },
  ];

  const ic = "w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm" style={{ color: C.muted }}>
          {posts.length} publicação{posts.length === 1 ? "" : "ões"}
        </p>
        <button
          type="button"
          onClick={() => setModalAberto(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
        >
          <Plus className="w-4 h-4" /> Nova
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: C.gold }} />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 rounded-2xl" style={CARD}>
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-20" style={{ color: C.gold }} />
          <p className="text-sm" style={{ color: C.muted }}>Nenhuma publicação ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => {
            const totalReacoes = Object.values(p.reacoes ?? {}).reduce((a, b) => a + b, 0);
            return (
              <div key={p.id} className="rounded-2xl overflow-hidden" style={CARD_S}>
                {p.tipo === "imagem" && p.mediaUrl && (
                  <div className="max-h-52 overflow-hidden" style={{ borderBottom: "1px solid rgba(200,165,107,0.1)" }}>
                    <AuthenticatedImage
                      apiPath={`/comunidade/${p.id}/imagem`}
                      alt=""
                      className="w-full h-48"
                      imgClassName="w-full h-48 object-cover"
                    />
                  </div>
                )}
                {p.tipo === "audio" && p.mediaUrl && (
                  <div className="px-4 pt-4 pb-1" style={{ borderBottom: "1px solid rgba(200,165,107,0.1)" }}>
                    <AuthenticatedAudio apiPath={`/comunidade/${p.id}/audio`} className="w-full mb-3" />
                  </div>
                )}
                {p.tipo === "video" && p.mediaUrl && getVideoEmbedUrl(p.mediaUrl) && (
                  <div className="aspect-video max-h-56 bg-black" style={{ borderBottom: "1px solid rgba(200,165,107,0.1)" }}>
                    <iframe src={getVideoEmbedUrl(p.mediaUrl)!} className="w-full h-full" title="preview" allowFullScreen />
                  </div>
                )}
                {p.tipo === "video" && p.mediaUrl && !getVideoEmbedUrl(p.mediaUrl) && (
                  <div
                    className="px-4 py-3 flex items-center gap-2"
                    style={{ background: "rgba(200,165,107,0.04)", borderBottom: "1px solid rgba(200,165,107,0.1)" }}
                  >
                    <Youtube className="w-5 h-5 shrink-0" style={{ color: "rgba(200,165,107,0.5)" }} />
                    <a href={p.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-xs truncate underline" style={{ color: C.gold }}>
                      {p.mediaUrl}
                    </a>
                  </div>
                )}

                <div className="flex items-start justify-between gap-3 p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ background: "rgba(200,165,107,0.1)", color: C.bronze }}
                      >
                        {p.tipo}
                      </span>
                      <span className="text-xs" style={{ color: C.dim }}>
                        {new Date(p.criadoEm).toLocaleDateString("pt-BR")}
                      </span>
                      {p.autorNome && (
                        <span className="text-xs" style={{ color: C.dim }}>
                          · {p.autorNome}
                        </span>
                      )}
                    </div>
                    {p.conteudo?.trim() && (
                      <p className="text-sm leading-relaxed line-clamp-2 mb-2" style={{ color: "rgba(247,242,236,0.8)" }}>
                        {p.conteudo}
                      </p>
                    )}
                    {totalReacoes > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {REACTIONS.filter((r) => (p.reacoes[r.key] ?? 0) > 0).map(({ key, icon: Icon, color, label }) => (
                          <span
                            key={key}
                            title={label}
                            className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                            style={{ background: "rgba(200,165,107,0.07)", border: "1px solid rgba(200,165,107,0.15)" }}
                          >
                            <Icon className="w-3 h-3" style={{ color }} />
                            <span style={{ color: C.muted }}>{p.reacoes[key]}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleDeletar(p.id)}
                    className="p-2 rounded-lg shrink-0 transition-all"
                    style={{ color: "rgba(248,113,113,0.4)" }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.08)";
                      (e.currentTarget as HTMLElement).style.color = "#f87171";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "rgba(248,113,113,0.4)";
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalAberto && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <button
            type="button"
            className="absolute inset-0"
            style={{ background: "rgba(0,0,0,0.72)" }}
            aria-label="Fechar"
            onClick={fecharModal}
          />
          <form
            onSubmit={(e) => void handleCriar(e)}
            className="relative w-full sm:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-5 space-y-4 shadow-2xl"
            style={{ background: "#1a1510", border: "1px solid rgba(200,165,107,0.25)" }}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="font-tan-mon-cheri text-xl" style={{ color: C.text }}>
                Nova publicação
              </p>
              <button type="button" onClick={fecharModal} className="p-2 rounded-lg" style={{ color: C.muted }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {tipos.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setNovoTipo(key);
                    setUploadFile(null);
                    setNovoMediaUrl("");
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  className="flex flex-col items-center gap-1.5 py-2.5 rounded-xl text-xs font-medium"
                  style={
                    novoTipo === key
                      ? { background: "rgba(200,165,107,0.2)", color: C.gold, border: "1px solid rgba(200,165,107,0.4)" }
                      : { background: "transparent", color: C.muted, border: "1px solid rgba(200,165,107,0.15)" }
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            <textarea
              value={novoConteudo}
              onChange={(e) => setNovoConteudo(e.target.value)}
              required={novoTipo === "texto"}
              rows={4}
              className={ic}
              style={INPUT_ST}
              placeholder={
                novoTipo === "texto"
                  ? "O que você quer publicar?"
                  : novoTipo === "imagem"
                    ? "Legenda (opcional)"
                    : novoTipo === "audio"
                      ? "Descrição do áudio (opcional)"
                      : "Comentário sobre o vídeo (opcional)"
              }
            />

            {(novoTipo === "imagem" || novoTipo === "audio") && (
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept={novoTipo === "audio" ? "audio/*,.mp3,.m4a,.wav,.ogg,.aac" : "image/*"}
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="adm-upload-media"
                />
                <label
                  htmlFor="adm-upload-media"
                  className="flex flex-col items-center justify-center gap-1 w-full py-8 rounded-xl text-sm cursor-pointer"
                  style={{ border: "2px dashed rgba(200,165,107,0.35)", color: C.bronze }}
                >
                  {novoTipo === "audio" ? <Mic className="w-6 h-6 opacity-70" /> : <ImageIcon className="w-6 h-6 opacity-70" />}
                  <span>
                    {uploadFile
                      ? uploadFile.name
                      : novoTipo === "audio"
                        ? "Selecionar áudio"
                        : "Selecionar imagem"}
                  </span>
                  {novoTipo === "audio" && (
                    <span className="text-[10px] opacity-60">MP3, M4A, WAV, OGG</span>
                  )}
                </label>
              </div>
            )}

            {novoTipo === "video" && (
              <input
                type="url"
                value={novoMediaUrl}
                onChange={(e) => setNovoMediaUrl(e.target.value)}
                className={ic}
                style={INPUT_ST}
                placeholder="Link YouTube ou Vimeo"
              />
            )}

            <label className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => setNotificar((v) => !v)}>
              <div
                className="w-5 h-5 rounded flex items-center justify-center shrink-0"
                style={{
                  border: notificar ? "none" : "1.5px solid rgba(200,165,107,0.35)",
                  background: notificar ? "linear-gradient(135deg, #c8a56b, #9c7742)" : "transparent",
                }}
              >
                {notificar && <Check className="w-3 h-3" style={{ color: "#1a1208" }} />}
              </div>
              <span className="text-xs font-medium" style={{ color: C.muted }}>
                Notificar membros
              </span>
            </label>

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={fecharModal}
                className="flex-1 py-2.5 rounded-xl text-sm"
                style={{ border: "1px solid rgba(200,165,107,0.2)", color: C.muted }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
              >
                {enviando ? "Publicando…" : "Publicar"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
