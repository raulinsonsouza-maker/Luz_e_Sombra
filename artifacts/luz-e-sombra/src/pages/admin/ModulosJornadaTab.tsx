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

export interface ModuloJornadaLinha {
  slug: string;
  tituloIntro: string;
  descricaoIntro: string;
  videoIntroUrl: string | null;
  cursoVinculadoId: number | null;
  ordem: number;
}

export function ModulosJornadaTab({ showMsg }: { showMsg: (t: "sucesso" | "erro", msg: string) => void }) {
  const [modulos, setModulos] = useState<ModuloJornadaLinha[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<Record<string, {
    tituloIntro: string;
    descricaoIntro: string;
    videoIntroUrl: string;
    cursoVinculadoId: string;
  }>>({});
  const [salvando, setSalvando] = useState<string | null>(null);

  async function carregar() {
    setLoading(true);
    try {
      const [mRes, cRes] = await Promise.all([
        apiFetch("/modulos-jornada"),
        apiFetch("/cursos"),
      ]);
      if (mRes.ok) {
        const data = (await mRes.json()) as ModuloJornadaLinha[];
        setModulos(data);
        const e: Record<string, { tituloIntro: string; descricaoIntro: string; videoIntroUrl: string; cursoVinculadoId: string }> = {};
        for (const m of data) {
          e[m.slug] = {
            tituloIntro: m.tituloIntro,
            descricaoIntro: m.descricaoIntro,
            videoIntroUrl: m.videoIntroUrl ?? "",
            cursoVinculadoId: m.cursoVinculadoId != null ? String(m.cursoVinculadoId) : "",
          };
        }
        setEdit(e);
      }
      if (cRes.ok) setCursos(await cRes.json());
    } catch {
      toastApiError();
    }
    setLoading(false);
  }

  useEffect(() => { void carregar(); }, []);

  async function salvar(slug: string) {
    const row = edit[slug];
    if (!row) return;
    setSalvando(slug);
    try {
      const body = {
        tituloIntro: row.tituloIntro.trim(),
        descricaoIntro: row.descricaoIntro.trim(),
        videoIntroUrl: row.videoIntroUrl.trim() || null,
        cursoVinculadoId: row.cursoVinculadoId === "" ? null : parseInt(row.cursoVinculadoId, 10),
      };
      if (body.cursoVinculadoId !== null && !Number.isFinite(body.cursoVinculadoId)) {
        showMsg("erro", "ID do curso inválido.");
        setSalvando(null);
        return;
      }
      const res = await apiFetch(`/modulos-jornada/${slug}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        showMsg("sucesso", "Módulo atualizado.");
        await carregar();
      } else {
        showMsg("erro", (data as { error?: string }).error ?? "Erro ao guardar.");
      }
    } catch {
      showMsg("erro", "Erro ao guardar.");
    }
    setSalvando(null);
  }

  const ic = "w-full px-4 py-2.5 rounded-xl text-sm outline-none";

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.gold }} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs tracking-[0.2em] uppercase mb-0.5" style={{ color: "rgba(200,165,107,0.45)" }}>Admin</p>
        <h2 className="font-tan-mon-cheri text-2xl md:text-3xl" style={{ color: C.text }}>Módulos da Jornada</h2>
        <p className="text-sm mt-2" style={{ color: C.muted }}>
          Configure o vídeo de introdução e o curso-minicurso de cada etapa Iniciante.
        </p>
      </div>

      {[...modulos].sort((a, b) => a.ordem - b.ordem).map((m) => {
        const row = edit[m.slug];
        if (!row) return null;
        return (
          <div key={m.slug} className="p-5 rounded-2xl space-y-4" style={CARD_S}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.55)" }}>
                Ordem {m.ordem} · {m.slug}
              </span>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>Título (intro)</label>
              <input
                value={row.tituloIntro}
                onChange={(e) => setEdit((prev) => ({ ...prev, [m.slug]: { ...prev[m.slug], tituloIntro: e.target.value } }))}
                className={ic}
                style={INPUT_ST}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>Descrição (intro)</label>
              <textarea
                value={row.descricaoIntro}
                onChange={(e) => setEdit((prev) => ({ ...prev, [m.slug]: { ...prev[m.slug], descricaoIntro: e.target.value } }))}
                rows={3}
                className={`${ic} resize-none`}
                style={INPUT_ST}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>URL do vídeo (YouTube/Vimeo)</label>
              <input
                value={row.videoIntroUrl}
                onChange={(e) => setEdit((prev) => ({ ...prev, [m.slug]: { ...prev[m.slug], videoIntroUrl: e.target.value } }))}
                className={ic}
                style={INPUT_ST}
                placeholder="https://..."
                type="url"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>Curso minicurso (publicado)</label>
              <select
                value={row.cursoVinculadoId}
                onChange={(e) => setEdit((prev) => ({ ...prev, [m.slug]: { ...prev[m.slug], cursoVinculadoId: e.target.value } }))}
                className={ic}
                style={SELECT_ST}
              >
                <option value="" style={OPT}>— Nenhum —</option>
                {cursos.map((c) => (
                  <option key={c.id} value={c.id} style={OPT}>
                    #{c.id} · {c.titulo} ({c.aulasCount} aulas{c.publicado ? "" : " · rascunho"})
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              disabled={salvando === m.slug}
              onClick={() => void salvar(m.slug)}
              className="w-full py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
            >
              {salvando === m.slug ? "A guardar…" : "Guardar módulo"}
            </button>
          </div>
        );
      })}
    </div>
  );
}

