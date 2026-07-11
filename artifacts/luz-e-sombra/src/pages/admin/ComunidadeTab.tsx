import { useState, useEffect, useRef } from "react";
import {
  Users, Plus, Edit2, Trash2, Check, X, Loader2, Search, CheckCircle, AlertCircle,
  MessageSquare, GraduationCap, FileText, Youtube, ImageIcon, BookOpen,
  ChevronDown, ChevronUp, Eye, EyeOff, LayoutDashboard, Shield, TrendingUp,
  UserCheck, Layers, Heart, Flame, Sparkles, Star, Sun, Bell, type LucideIcon,
} from "lucide-react";
import { apiFetch } from "@/lib/auth";
import { AuthenticatedImage } from "@/components/AuthenticatedImage";
import { getVideoEmbedUrl } from "@/lib/mediaEmbed";
import { toastApiError } from "@/lib/apiError";
import {
  BG, CARD, CARD_S, INPUT_ST, SELECT_ST, C, OPT, REACTIONS,
  type ShowMsg, type Usuario, type FormValues, emptyForm,
  validarFormularioUsuario, timeAgo, type Post, type ComentarioEngajamento,
  type Aula, type Curso, type CursoDetalhe, type Stats,
} from "./shared";

export function ComunidadeTab({ showMsg }: { showMsg: (t: "sucesso" | "erro", msg: string) => void }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [criando, setCriando] = useState(false);
  const [novoTipo, setNovoTipo] = useState<"texto" | "imagem" | "video">("texto");
  const [novoConteudo, setNovoConteudo] = useState("");
  const [novoMediaUrl, setNovoMediaUrl] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [notificar, setNotificar] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { buscarPosts(); }, []);

  async function buscarPosts() {
    setLoading(true);
    try { const res = await apiFetch("/comunidade"); if (res.ok) setPosts(await res.json()); } catch { toastApiError(); }
    setLoading(false);
  }

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    if (novoTipo === "texto" && !novoConteudo.trim()) { showMsg("erro", "Escreva o conteúdo."); return; }
    if (novoTipo === "imagem" && !uploadFile) { showMsg("erro", "Selecione uma imagem."); return; }
    if (novoTipo === "video" && !novoMediaUrl.trim()) { showMsg("erro", "Cole o link do YouTube ou Vimeo."); return; }
    setEnviando(true);
    try {
      let mediaUrl: string | undefined;
      if (novoTipo === "imagem" && uploadFile) {
        const urlRes = await apiFetch("/comunidade/upload-url", { method: "POST" });
        if (!urlRes.ok) throw new Error("Erro ao gerar URL");
        const { uploadURL, objectPath } = await urlRes.json();
        const up = await fetch(uploadURL, { method: "PUT", body: uploadFile, headers: { "Content-Type": uploadFile.type || "image/jpeg" } });
        if (!up.ok) throw new Error("Falha no upload");
        mediaUrl = objectPath;
      } else if (novoTipo === "video") {
        mediaUrl = novoMediaUrl.trim() || undefined;
      }
      const texto = novoConteudo.trim() || " ";
      const res = await apiFetch("/comunidade", { method: "POST", body: JSON.stringify({ tipo: novoTipo, conteudo: texto, mediaUrl, notificar }) });
      if (res.ok) {
        showMsg("sucesso", "Publicação criada!");
        setNovoConteudo(""); setNovoMediaUrl(""); setUploadFile(null);
        if (fileRef.current) fileRef.current.value = "";
        setCriando(false); await buscarPosts();
      } else { const d = await res.json(); showMsg("erro", d.error || "Erro ao publicar"); }
    } catch { showMsg("erro", "Erro ao criar publicação"); }
    setEnviando(false);
  }

  async function handleDeletar(id: number) {
    if (!confirm("Deletar esta publicação?")) return;
    try { const res = await apiFetch(`/comunidade/${id}`, { method: "DELETE" }); if (res.ok) { showMsg("sucesso", "Publicação deletada!"); setPosts(prev => prev.filter(p => p.id !== id)); } }
    catch { showMsg("erro", "Erro ao deletar"); }
  }

  const ic = "w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase mb-0.5" style={{ color: "rgba(200,165,107,0.45)" }}>Admin</p>
          <h2 className="font-tan-mon-cheri text-2xl md:text-3xl" style={{ color: C.text }}>Comunidade</h2>
        </div>
        <button onClick={() => setCriando(!criando)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}>
          <Plus className="w-4 h-4" /> Nova publicação
        </button>
      </div>

      {/* Create form */}
      {criando && (
        <form onSubmit={handleCriar} className="p-5 rounded-2xl space-y-4" style={CARD_S}>
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.6)" }}>Nova Publicação</p>
          <div className="flex gap-2 flex-wrap">
            {(["texto", "imagem", "video"] as const).map(t => (
              <button key={t} type="button" onClick={() => { setNovoTipo(t); setUploadFile(null); setNovoMediaUrl(""); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                style={novoTipo === t
                  ? { background: "rgba(200,165,107,0.2)", color: C.gold, border: "1px solid rgba(200,165,107,0.4)" }
                  : { background: "transparent", color: C.muted, border: "1px solid rgba(200,165,107,0.15)" }}>
                {t === "texto" && <FileText className="w-3 h-3" />}
                {t === "imagem" && <ImageIcon className="w-3 h-3" />}
                {t === "video" && <Youtube className="w-3 h-3" />}
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          <textarea value={novoConteudo} onChange={e => setNovoConteudo(e.target.value)} required={novoTipo === "texto"} rows={3}
            className={ic} style={INPUT_ST}
            placeholder={novoTipo === "texto" ? "Conteúdo da publicação…" : novoTipo === "imagem" ? "Legenda opcional…" : "Comentário opcional sobre o vídeo…"} />
          {novoTipo === "imagem" && (
            <div>
              <input ref={fileRef} type="file" accept="image/*" onChange={e => setUploadFile(e.target.files?.[0] || null)} className="hidden" id="adm-upload-img" />
              <label htmlFor="adm-upload-img" className="flex flex-col items-center justify-center gap-1 w-full py-6 rounded-xl text-sm cursor-pointer"
                style={{ border: "2px dashed rgba(200,165,107,0.35)", color: C.bronze }}>
                <ImageIcon className="w-6 h-6 opacity-70" />
                <span>{uploadFile ? uploadFile.name : "Toque ou selecione uma imagem"}</span>
                <span className="text-[10px] opacity-60">JPG, PNG, WebP</span>
              </label>
            </div>
          )}
          {novoTipo === "video" && (
            <div className="space-y-1">
              <input type="url" value={novoMediaUrl} onChange={e => setNovoMediaUrl(e.target.value)}
                className={ic} style={INPUT_ST} placeholder="https://youtube.com/…, youtu.be/… ou vimeo.com/…" />
              <p className="text-[10px]" style={{ color: C.dim }}>YouTube (incl. Shorts) e Vimeo são incorporados automaticamente.</p>
            </div>
          )}
          {/* Notificar usuários */}
          <label
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => setNotificar(v => !v)}
          >
            <div
              className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all"
              style={{
                border: notificar ? "none" : "1.5px solid rgba(200,165,107,0.35)",
                background: notificar ? "linear-gradient(135deg, #c8a56b, #9c7742)" : "transparent",
              }}
            >
              {notificar && <Check className="w-3 h-3" style={{ color: "#1a1208" }} />}
            </div>
            <span className="text-xs font-medium" style={{ color: C.muted }}>
              Notificar todos os usuários sobre esta publicação
            </span>
          </label>

          <div className="flex gap-3">
            <button type="button" onClick={() => setCriando(false)}
              className="flex-1 py-2 rounded-xl text-sm" style={{ border: "1px solid rgba(200,165,107,0.2)", color: C.muted }}>Cancelar</button>
            <button type="submit" disabled={enviando}
              className="flex-1 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}>
              {enviando ? "Publicando..." : "Publicar"}
            </button>
          </div>
        </form>
      )}

      {/* Posts list */}
      {loading
        ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" style={{ color: C.gold }} /></div>
        : posts.length === 0
          ? <div className="text-center py-12 rounded-2xl" style={CARD}>
              <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-20" style={{ color: C.gold }} />
              <p className="text-sm" style={{ color: C.muted }}>Nenhuma publicação ainda.</p>
            </div>
          : (
            <div className="space-y-3">
              {posts.map(p => {
                const totalReacoes = Object.values(p.reacoes ?? {}).reduce((a, b) => a + b, 0);
                return (
                  <div key={p.id} className="rounded-2xl overflow-hidden" style={CARD_S}>
                    {/* Media header */}
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
                    {p.tipo === "video" && p.mediaUrl && getVideoEmbedUrl(p.mediaUrl) && (
                      <div className="aspect-video max-h-56 bg-black" style={{ borderBottom: "1px solid rgba(200,165,107,0.1)" }}>
                        <iframe src={getVideoEmbedUrl(p.mediaUrl)!} className="w-full h-full" title="preview" allowFullScreen />
                      </div>
                    )}
                    {p.tipo === "video" && p.mediaUrl && !getVideoEmbedUrl(p.mediaUrl) && (
                      <div className="px-4 py-3 flex items-center gap-2"
                        style={{ background: "rgba(200,165,107,0.04)", borderBottom: "1px solid rgba(200,165,107,0.1)" }}>
                        <Youtube className="w-5 h-5 shrink-0" style={{ color: "rgba(200,165,107,0.5)" }} />
                        <a href={p.mediaUrl} target="_blank" rel="noopener noreferrer" className="text-xs truncate underline" style={{ color: C.gold }}>{p.mediaUrl}</a>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-3 p-4">
                      <div className="flex-1 min-w-0">
                        {/* Meta */}
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: "rgba(200,165,107,0.1)", color: C.bronze }}>{p.tipo}</span>
                          <span className="text-xs" style={{ color: C.dim }}>{new Date(p.criadoEm).toLocaleDateString("pt-BR")}</span>
                          {p.autorNome && <span className="text-xs" style={{ color: C.dim }}>· {p.autorNome}</span>}
                        </div>

                        {/* Content */}
                        <p className="text-sm leading-relaxed line-clamp-2 mb-2" style={{ color: "rgba(247,242,236,0.8)" }}>{p.conteudo}</p>

                        {/* Reactions (SVG icons) */}
                        {totalReacoes > 0 && (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {REACTIONS.filter(r => (p.reacoes[r.key] ?? 0) > 0).map(({ key, icon: Icon, color, label }) => (
                              <span key={key} title={label}
                                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                                style={{ background: "rgba(200,165,107,0.07)", border: "1px solid rgba(200,165,107,0.15)" }}>
                                <Icon className="w-3 h-3" style={{ color }} />
                                <span style={{ color: C.muted }}>{p.reacoes[key]}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <button onClick={() => handleDeletar(p.id)}
                        className="p-2 rounded-lg shrink-0 transition-all"
                        style={{ color: "rgba(248,113,113,0.4)" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(248,113,113,0.08)"; (e.currentTarget as HTMLElement).style.color = "#f87171"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(248,113,113,0.4)"; }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
      }
    </div>
  );
}

// ── Engajamento Tab (comentários) ──────────────────────────────────────────────
