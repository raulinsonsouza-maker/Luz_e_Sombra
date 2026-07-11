import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
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

export function EngajamentoTab({ showMsg }: { showMsg: (t: "sucesso" | "erro", msg: string) => void }) {
  const [, navigate] = useLocation();
  const [itens, setItens] = useState<ComentarioEngajamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [somenteOportunidades, setSomenteOportunidades] = useState(false);
  const [respostas, setRespostas] = useState<Record<number, string>>({});
  const [enviandoId, setEnviandoId] = useState<number | null>(null);

  useEffect(() => {
    void buscarComentarios();
  }, []);

  async function buscarComentarios() {
    setLoading(true);
    try {
      const res = await apiFetch("/comunidade/admin/comentarios");
      if (res.ok) setItens(await res.json());
    } catch {
      toastApiError();
    }
    setLoading(false);
  }

  function ehLead(txt: string): boolean {
    return /(valor|preço|preco|quanto|interesse|comprar|quero|chama|whatsapp|venda|orcamento|orçamento)/i.test(txt);
  }

  async function responder(item: ComentarioEngajamento) {
    const texto = (respostas[item.id] ?? "").trim();
    if (!texto) return;
    setEnviandoId(item.id);
    try {
      const res = await apiFetch(`/comunidade/${item.publicacaoId}/comentarios`, {
        method: "POST",
        body: JSON.stringify({ conteudo: `@${item.autorNome} ${texto}` }),
      });
      if (res.ok) {
        showMsg("sucesso", "Resposta enviada na publicação.");
        setRespostas((prev) => ({ ...prev, [item.id]: "" }));
        await buscarComentarios();
      } else {
        const d = await res.json().catch(() => ({}));
        showMsg("erro", (d as { error?: string }).error ?? "Erro ao responder");
      }
    } catch {
      showMsg("erro", "Erro ao responder comentário");
    }
    setEnviandoId(null);
  }

  const filtrados = itens.filter((it) => {
    const q = busca.trim().toLowerCase();
    if (somenteOportunidades && !ehLead(it.conteudo)) return false;
    if (!q) return true;
    return (
      it.autorNome.toLowerCase().includes(q) ||
      it.conteudo.toLowerCase().includes(q) ||
      (it.publicacaoConteudo || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase mb-0.5" style={{ color: "rgba(200,165,107,0.45)" }}>Monitoramento</p>
          <h2 className="font-tan-mon-cheri text-2xl md:text-3xl" style={{ color: C.text }}>Lista de tarefas</h2>
          <p className="text-sm mt-1" style={{ color: C.muted }}>
            Comentários recentes para acompanhar engajamento, dúvidas e oportunidades.
          </p>
        </div>
        <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: "rgba(200,165,107,0.1)", color: C.gold }}>
          Comentários {filtrados.length}
        </span>
      </div>

      <div className="rounded-2xl p-4 md:p-5 space-y-3" style={CARD_S}>
        <div className="flex gap-2 flex-wrap">
          <div className="relative flex-1 min-w-56">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.muted }} />
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none"
              style={INPUT_ST}
              placeholder="Buscar por nome, comentário ou texto da publicação"
            />
          </div>
          <button
            onClick={() => setSomenteOportunidades((v) => !v)}
            className="px-3 py-2.5 rounded-xl text-xs font-semibold"
            style={somenteOportunidades
              ? { background: "rgba(74,222,128,0.12)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.25)" }
              : { background: "rgba(200,165,107,0.08)", color: C.muted, border: "1px solid rgba(200,165,107,0.2)" }}
          >
            Apenas oportunidades
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.gold }} />
        </div>
      ) : filtrados.length === 0 ? (
        <div className="text-center py-12 rounded-2xl" style={CARD}>
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-20" style={{ color: C.gold }} />
          <p className="text-sm" style={{ color: C.muted }}>Nenhum comentário encontrado.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtrados.map((it) => {
            const lead = ehLead(it.conteudo);
            return (
              <div key={it.id} className="rounded-2xl p-4 space-y-3" style={CARD_S}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold" style={{ color: C.text }}>{it.autorNome}</span>
                      {it.autorAdmin && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(200,165,107,0.12)", color: C.gold }}>
                          Admin
                        </span>
                      )}
                      {lead && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80" }}>
                          Oportunidade
                        </span>
                      )}
                    </div>
                    <p className="text-sm mt-1 leading-relaxed" style={{ color: "rgba(247,242,236,0.84)" }}>{it.conteudo}</p>
                  </div>
                  <span className="text-xs shrink-0" style={{ color: C.dim }}>{timeAgo(it.criadoEm)}</span>
                </div>

                <div className="rounded-xl p-3" style={{ background: "rgba(200,165,107,0.05)", border: "1px solid rgba(200,165,107,0.14)" }}>
                  <p className="text-[11px] mb-1" style={{ color: C.dim }}>
                    Publicação #{it.publicacaoId} · {it.publicacaoTipo}
                  </p>
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: C.muted }}>
                    {it.publicacaoConteudo?.trim() || "(publicação sem texto)"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <input
                    value={respostas[it.id] ?? ""}
                    onChange={(e) => setRespostas((prev) => ({ ...prev, [it.id]: e.target.value }))}
                    className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
                    style={INPUT_ST}
                    placeholder={`Responder @${it.autorNome}`}
                  />
                  <button
                    type="button"
                    onClick={() => void responder(it)}
                    disabled={enviandoId === it.id || !(respostas[it.id] ?? "").trim()}
                    className="px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
                  >
                    {enviandoId === it.id ? "Enviando..." : "Responder"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/comunidade")}
                    className="px-3 py-2 rounded-xl text-xs font-semibold"
                    style={{ border: "1px solid rgba(200,165,107,0.25)", color: C.muted }}
                  >
                    Ver post
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Módulos da Jornada (admin) ─────────────────────────────────────────────────
