import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/auth";
import { Plus, Trash2, Loader2, Users, ImageIcon, Youtube, FileText, Heart, Flame, Sparkles, Star, Sun, type LucideIcon } from "lucide-react";

const REACTIONS: { key: string; icon: LucideIcon; color: string; label: string }[] = [
  { key: "❤️", icon: Heart,    color: "#e85555", label: "Amor" },
  { key: "🔥", icon: Flame,    color: "#e86c2b", label: "Fogo" },
  { key: "💫", icon: Sparkles, color: "#c8a56b", label: "Magia" },
  { key: "🙏", icon: Sun,      color: "#f0c040", label: "Gratidão" },
  { key: "✨", icon: Star,     color: "#c8a56b", label: "Inspiração" },
];

interface Post {
  id: number;
  autorId: number;
  autorNome: string;
  tipo: "texto" | "imagem" | "video";
  conteudo: string;
  mediaUrl: string | null;
  criadoEm: string;
  reacoes: Record<string, number>;
  minhasReacoes: string[];
}

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    let videoId: string | null = null;
    if (u.hostname.includes("youtu.be")) {
      videoId = u.pathname.slice(1);
    } else if (u.hostname.includes("youtube.com")) {
      videoId = u.searchParams.get("v");
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora mesmo";
  if (mins < 60) return `${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "ontem";
  return `${days} dias`;
}

export default function ComunidadePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [criando, setCriando] = useState(false);
  const [deletando, setDeletando] = useState<number | null>(null);

  const [novoTipo, setNovoTipo] = useState<"texto" | "imagem" | "video">("texto");
  const [novoConteudo, setNovoConteudo] = useState("");
  const [novoMediaUrl, setNovoMediaUrl] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const isAdmin = Boolean(user?.isAdmin);

  useEffect(() => {
    buscarPosts();
  }, []);

  async function buscarPosts() {
    setLoading(true);
    try {
      const res = await apiFetch("/comunidade");
      if (res.ok) setPosts(await res.json());
    } catch {}
    setLoading(false);
  }

  async function handleReagir(postId: number, emoji: string) {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const jaTem = p.minhasReacoes.includes(emoji);
      return {
        ...p,
        reacoes: {
          ...p.reacoes,
          [emoji]: Math.max(0, (p.reacoes[emoji] ?? 0) + (jaTem ? -1 : 1)),
        },
        minhasReacoes: jaTem
          ? p.minhasReacoes.filter(e => e !== emoji)
          : [...p.minhasReacoes, emoji],
      };
    }));
    try {
      await apiFetch(`/comunidade/${postId}/reagir`, {
        method: "POST",
        body: JSON.stringify({ emoji }),
      });
    } catch {
      buscarPosts();
    }
  }

  async function handleCriarPost(e: React.FormEvent) {
    e.preventDefault();
    if (!novoConteudo.trim()) return;
    setEnviando(true);

    try {
      let mediaUrl: string | undefined;

      if (novoTipo === "imagem" && uploadFile) {
        setUploadProgress(true);
        const urlRes = await apiFetch("/comunidade/upload-url", { method: "POST" });
        if (!urlRes.ok) throw new Error("Erro ao gerar URL de upload");
        const { uploadURL, objectPath } = await urlRes.json();

        await fetch(uploadURL, {
          method: "PUT",
          body: uploadFile,
          headers: { "Content-Type": uploadFile.type || "image/jpeg" },
        });
        mediaUrl = objectPath;
        setUploadProgress(false);
      } else if (novoTipo === "video") {
        mediaUrl = novoMediaUrl.trim() || undefined;
      }

      const res = await apiFetch("/comunidade", {
        method: "POST",
        body: JSON.stringify({ tipo: novoTipo, conteudo: novoConteudo.trim(), mediaUrl }),
      });

      if (res.ok) {
        setNovoConteudo("");
        setNovoMediaUrl("");
        setUploadFile(null);
        if (fileRef.current) fileRef.current.value = "";
        setCriando(false);
        await buscarPosts();
      }
    } catch (err) {
      console.error(err);
    }
    setUploadProgress(false);
    setEnviando(false);
  }

  async function handleDeletar(id: number) {
    setDeletando(id);
    try {
      await apiFetch(`/comunidade/${id}`, { method: "DELETE" });
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch {}
    setDeletando(null);
  }

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(200,165,107,0.2)",
    color: "#f7f2ec",
  };

  return (
    <div
      className="min-h-screen pb-28"
      style={{ background: "linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)" }}
    >
      <div className="max-w-lg mx-auto px-4 pt-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-1" style={{ color: "rgba(200,165,107,0.5)" }}>
              Espaço Compartilhado
            </p>
            <h1 className="font-tan-mon-cheri text-3xl" style={{ color: "#f7f2ec" }}>Comunidade</h1>
          </div>
          {isAdmin && (
            <button
              onClick={() => setCriando(!criando)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all"
              style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
            >
              <Plus className="w-4 h-4" />
              Nova publicação
            </button>
          )}
        </div>

        {/* Admin create form */}
        {isAdmin && criando && (
          <form
            onSubmit={handleCriarPost}
            className="rounded-2xl p-5 mb-6 space-y-4"
            style={{ background: "rgba(200,165,107,0.05)", border: "1px solid rgba(200,165,107,0.2)" }}
          >
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.6)" }}>
              Nova Publicação
            </p>

            {/* Tipo */}
            <div className="flex gap-2">
              {(["texto", "imagem", "video"] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setNovoTipo(t); setUploadFile(null); setNovoMediaUrl(""); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={novoTipo === t
                    ? { background: "rgba(200,165,107,0.2)", color: "#c8a56b", border: "1px solid rgba(200,165,107,0.4)" }
                    : { background: "transparent", color: "rgba(247,242,236,0.4)", border: "1px solid rgba(200,165,107,0.15)" }
                  }
                >
                  {t === "texto" && <FileText className="w-3 h-3" />}
                  {t === "imagem" && <ImageIcon className="w-3 h-3" />}
                  {t === "video" && <Youtube className="w-3 h-3" />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <textarea
              value={novoConteudo}
              onChange={e => setNovoConteudo(e.target.value)}
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
              style={inputStyle}
              placeholder="Compartilhe algo com a comunidade..."
            />

            {novoTipo === "imagem" && (
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={e => setUploadFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="upload-img"
                />
                <label
                  htmlFor="upload-img"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm cursor-pointer transition-all"
                  style={{ border: "1px dashed rgba(200,165,107,0.3)", color: "rgba(200,165,107,0.6)" }}
                >
                  <ImageIcon className="w-4 h-4" />
                  {uploadFile ? uploadFile.name : "Selecionar imagem"}
                </label>
              </div>
            )}

            {novoTipo === "video" && (
              <input
                type="url"
                value={novoMediaUrl}
                onChange={e => setNovoMediaUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={inputStyle}
                placeholder="URL do YouTube (ex: https://youtu.be/...)"
              />
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCriando(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ border: "1px solid rgba(200,165,107,0.2)", color: "rgba(247,242,236,0.5)" }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={enviando || uploadProgress}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
              >
                {uploadProgress ? "Enviando imagem..." : enviando ? "Publicando..." : "Publicar"}
              </button>
            </div>
          </form>
        )}

        {/* Feed */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#c8a56b" }} />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(200,165,107,0.08)", border: "1px solid rgba(200,165,107,0.15)" }}
            >
              <Users className="w-7 h-7" style={{ color: "rgba(200,165,107,0.4)" }} />
            </div>
            <p className="font-tan-mon-cheri text-xl mb-2" style={{ color: "rgba(247,242,236,0.4)" }}>
              Ainda silencioso por aqui
            </p>
            <p className="text-sm" style={{ color: "rgba(247,242,236,0.25)" }}>
              {isAdmin ? "Crie a primeira publicação para a comunidade." : "Em breve teremos conteúdo por aqui."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                isAdmin={isAdmin}
                onReagir={handleReagir}
                onDeletar={handleDeletar}
                deletando={deletando === post.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PostCard({
  post, isAdmin, onReagir, onDeletar, deletando,
}: {
  post: Post;
  isAdmin: boolean;
  onReagir: (id: number, emoji: string) => void;
  onDeletar: (id: number) => void;
  deletando: boolean;
}) {
  const embedUrl = post.tipo === "video" && post.mediaUrl ? getYouTubeEmbedUrl(post.mediaUrl) : null;
  const imageSrc = post.tipo === "imagem" && post.mediaUrl
    ? `/api/comunidade/${post.id}/imagem`
    : null;

  const totalReacoes = Object.values(post.reacoes).reduce((a, b) => a + b, 0);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.1)" }}
    >
      {/* Author bar */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "linear-gradient(135deg, rgba(200,165,107,0.2), rgba(156,119,66,0.1))", color: "#c8a56b", border: "1px solid rgba(200,165,107,0.25)" }}
          >
            {(post.autorNome || "A")[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "#f7f2ec" }}>{post.autorNome}</p>
            <p className="text-xs" style={{ color: "rgba(247,242,236,0.3)" }}>{timeAgo(post.criadoEm)}</p>
          </div>
        </div>
        {isAdmin && (
          <button
            onClick={() => onDeletar(post.id)}
            disabled={deletando}
            className="p-1.5 rounded-lg transition-all"
            style={{ color: "rgba(220,38,38,0.4)" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#dc2626")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(220,38,38,0.4)")}
            title="Deletar"
          >
            {deletando ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-5 pb-3">
        <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.8)", whiteSpace: "pre-wrap" }}>
          {post.conteudo}
        </p>
      </div>

      {/* Media */}
      {imageSrc && (
        <div className="mx-5 mb-3 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(200,165,107,0.1)" }}>
          <img
            src={imageSrc}
            alt="Imagem da publicação"
            className="w-full max-h-72 object-cover"
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      )}

      {embedUrl && (
        <div className="mx-5 mb-3 rounded-xl overflow-hidden aspect-video">
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Vídeo"
          />
        </div>
      )}

      {/* Reactions */}
      <div className="flex items-center gap-1 px-5 pb-4 flex-wrap">
        {REACTIONS.map(({ key, icon: Icon, color, label }) => {
          const cnt = post.reacoes[key] ?? 0;
          const ativo = post.minhasReacoes.includes(key);
          return (
            <button
              key={key}
              onClick={() => onReagir(post.id, key)}
              title={label}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all"
              style={ativo
                ? { background: "rgba(200,165,107,0.15)", border: `1px solid ${color}55`, color }
                : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(247,242,236,0.4)" }
              }
              onMouseEnter={e => { if (!ativo) { (e.currentTarget as HTMLElement).style.borderColor = "rgba(200,165,107,0.25)"; (e.currentTarget as HTMLElement).style.color = color; } }}
              onMouseLeave={e => { if (!ativo) { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.color = "rgba(247,242,236,0.4)"; } }}
            >
              <Icon className="w-3.5 h-3.5" />
              {cnt > 0 && <span>{cnt}</span>}
            </button>
          );
        })}
        {totalReacoes > 0 && (
          <span className="ml-1 text-xs flex items-center gap-1" style={{ color: "rgba(247,242,236,0.2)" }}>
            · {totalReacoes} reações
          </span>
        )}
      </div>
    </div>
  );
}
