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

export function CursosTab({ showMsg }: { showMsg: (t: "sucesso" | "erro", msg: string) => void }) {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [criandoCurso, setCriandoCurso] = useState(false);
  const [cursoAberto, setCursoAberto] = useState<number | null>(null);
  const [cursoDetalhe, setCursoDetalhe] = useState<CursoDetalhe | null>(null);
  const [loadingDetalhe, setLoadingDetalhe] = useState(false);
  const [novoCurso, setNovoCurso] = useState({
    titulo: "",
    descricao: "",
    categoria: "",
    nivel: "todos",
    imagemUrl: "",
    moduloJornada: "" as string,
  });
  const [capaArquivoNovo, setCapaArquivoNovo] = useState<File | null>(null);
  const [capaUrlEdicao, setCapaUrlEdicao] = useState("");
  const [capaArquivoEdicao, setCapaArquivoEdicao] = useState<File | null>(null);
  const [salvandoCapa, setSalvandoCapa] = useState(false);
  const [moduloJornadaEdicao, setModuloJornadaEdicao] = useState("");
  const [salvandoModJn, setSalvandoModJn] = useState(false);
  const [enviandoCurso, setEnviandoCurso] = useState(false);
  const [novaAula, setNovaAula] = useState({ titulo: "", descricao: "", videoUrl: "", conteudo: "", duracaoMin: "", ordem: "0" });
  const [criandoAula, setCriandoAula] = useState(false);
  const [enviandoAula, setEnviandoAula] = useState(false);
  const capaNovoRef = useRef<HTMLInputElement>(null);
  const capaEdicaoRef = useRef<HTMLInputElement>(null);

  useEffect(() => { buscarCursos(); }, []);

  useEffect(() => {
    if (cursoDetalhe) {
      setCapaUrlEdicao(cursoDetalhe.imagemUrl || "");
      setCapaArquivoEdicao(null);
      setModuloJornadaEdicao(cursoDetalhe.moduloJornada ?? "");
      if (capaEdicaoRef.current) capaEdicaoRef.current.value = "";
    }
  }, [cursoDetalhe?.id]);

  async function buscarCursos() {
    setLoading(true);
    try { const res = await apiFetch("/cursos"); if (res.ok) setCursos(await res.json()); } catch { toastApiError(); }
    setLoading(false);
  }

  async function abrirCurso(id: number) {
    if (cursoAberto === id) { setCursoAberto(null); setCursoDetalhe(null); return; }
    setCursoAberto(id); setLoadingDetalhe(true);
    try { const res = await apiFetch(`/cursos/${id}`); if (res.ok) setCursoDetalhe(await res.json()); } catch { toastApiError(); }
    setLoadingDetalhe(false);
  }

  async function enviarCapaUpload(file: File): Promise<string | null> {
    const urlRes = await apiFetch("/cursos/upload-url", { method: "POST" });
    if (!urlRes.ok) return null;
    const { uploadURL, objectPath } = await urlRes.json();
    const up = await fetch(uploadURL, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type || "image/jpeg" },
    });
    return up.ok ? objectPath : null;
  }

  async function handleCriarCurso(e: React.FormEvent) {
    e.preventDefault(); setEnviandoCurso(true);
    try {
      let imagemUrl = novoCurso.imagemUrl.trim() || null;
      if (capaArquivoNovo) {
        const path = await enviarCapaUpload(capaArquivoNovo);
        if (!path) { showMsg("erro", "Falha no upload da capa."); setEnviandoCurso(false); return; }
        imagemUrl = path;
      }
      const res = await apiFetch("/cursos", {
        method: "POST",
        body: JSON.stringify({
          titulo: novoCurso.titulo,
          descricao: novoCurso.descricao,
          categoria: novoCurso.categoria,
          nivel: novoCurso.nivel,
          imagemUrl: imagemUrl || "",
          moduloJornada: novoCurso.moduloJornada.trim() || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showMsg("sucesso", "Curso criado!");
        setNovoCurso({ titulo: "", descricao: "", categoria: "", nivel: "todos", imagemUrl: "", moduloJornada: "" });
        setCapaArquivoNovo(null);
        if (capaNovoRef.current) capaNovoRef.current.value = "";
        setCriandoCurso(false);
        buscarCursos();
      }
      else showMsg("erro", data.error || "Erro ao criar curso");
    } catch { showMsg("erro", "Erro ao criar curso"); }
    setEnviandoCurso(false);
  }

  async function handleSalvarModuloJornada(cursoId: number) {
    setSalvandoModJn(true);
    try {
      const res = await apiFetch(`/cursos/${cursoId}`, {
        method: "PUT",
        body: JSON.stringify({ moduloJornada: moduloJornadaEdicao.trim() || null }),
      });
      if (res.ok) {
        showMsg("sucesso", "Vínculo com a jornada atualizado.");
        buscarCursos();
        if (cursoAberto === cursoId) {
          const det = await apiFetch(`/cursos/${cursoId}`);
          if (det.ok) setCursoDetalhe(await det.json() as CursoDetalhe);
        }
      } else {
        const d = await res.json().catch(() => ({}));
        showMsg("erro", (d as { error?: string }).error ?? "Erro ao atualizar");
      }
    } catch {
      showMsg("erro", "Erro ao atualizar");
    }
    setSalvandoModJn(false);
  }

  async function handleSalvarCapa(cursoId: number) {
    setSalvandoCapa(true);
    try {
      let imagemUrl = capaUrlEdicao.trim() || null;
      if (capaArquivoEdicao) {
        const path = await enviarCapaUpload(capaArquivoEdicao);
        if (!path) { showMsg("erro", "Falha no upload da capa."); setSalvandoCapa(false); return; }
        imagemUrl = path;
      }
      const res = await apiFetch(`/cursos/${cursoId}`, { method: "PUT", body: JSON.stringify({ imagemUrl }) });
      if (res.ok) {
        showMsg("sucesso", "Capa atualizada!");
        setCapaArquivoEdicao(null);
        if (capaEdicaoRef.current) capaEdicaoRef.current.value = "";
        buscarCursos();
        const det = await apiFetch(`/cursos/${cursoId}`);
        if (det.ok) {
          const d = await det.json() as CursoDetalhe;
          setCursoDetalhe(d);
          setCapaUrlEdicao(d.imagemUrl || "");
        }
      } else {
        const d = await res.json().catch(() => ({}));
        showMsg("erro", (d as { error?: string }).error || "Erro ao salvar capa");
      }
    } catch { showMsg("erro", "Erro ao salvar capa"); }
    setSalvandoCapa(false);
  }

  async function togglePublicado(curso: Curso) {
    try {
      const res = await apiFetch(`/cursos/${curso.id}`, { method: "PUT", body: JSON.stringify({ publicado: !curso.publicado }) });
      if (res.ok) { showMsg("sucesso", `Curso ${!curso.publicado ? "publicado" : "despublicado"}!`); buscarCursos(); if (cursoAberto === curso.id) abrirCurso(curso.id); }
    } catch { showMsg("erro", "Erro ao atualizar"); }
  }

  async function handleDeletarCurso(id: number) {
    if (!confirm("Deletar este curso e todas as aulas?")) return;
    try { const res = await apiFetch(`/cursos/${id}`, { method: "DELETE" }); if (res.ok) { showMsg("sucesso", "Curso deletado!"); if (cursoAberto === id) { setCursoAberto(null); setCursoDetalhe(null); } buscarCursos(); } }
    catch { showMsg("erro", "Erro ao deletar"); }
  }

  async function handleCriarAula(e: React.FormEvent, cursoId: number) {
    e.preventDefault(); setEnviandoAula(true);
    try {
      const res = await apiFetch(`/cursos/${cursoId}/aulas`, {
        method: "POST",
        body: JSON.stringify({ ...novaAula, ordem: parseInt(novaAula.ordem) || 0, duracaoMin: parseInt(novaAula.duracaoMin) || null }),
      });
      const data = await res.json();
      if (res.ok) { showMsg("sucesso", "Aula criada!"); setNovaAula({ titulo: "", descricao: "", videoUrl: "", conteudo: "", duracaoMin: "", ordem: "0" }); setCriandoAula(false); abrirCurso(cursoId); }
      else showMsg("erro", data.error || "Erro ao criar aula");
    } catch { showMsg("erro", "Erro ao criar aula"); }
    setEnviandoAula(false);
  }

  async function handleDeletarAula(aulaId: number, cursoId: number) {
    if (!confirm("Deletar esta aula?")) return;
    try { const res = await apiFetch(`/cursos/aulas/${aulaId}`, { method: "DELETE" }); if (res.ok) { showMsg("sucesso", "Aula deletada!"); abrirCurso(cursoId); } }
    catch { showMsg("erro", "Erro ao deletar aula"); }
  }

  const ic = "w-full px-4 py-2.5 rounded-xl text-sm outline-none";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase mb-0.5" style={{ color: "rgba(200,165,107,0.45)" }}>Admin</p>
          <h2 className="font-tan-mon-cheri text-2xl md:text-3xl" style={{ color: C.text }}>Cursos</h2>
        </div>
        <button onClick={() => setCriandoCurso(!criandoCurso)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}>
          <Plus className="w-4 h-4" /> Novo Curso
        </button>
      </div>

      {/* Create course form */}
      {criandoCurso && (
        <form onSubmit={handleCriarCurso} className="p-5 rounded-2xl space-y-4" style={CARD_S}>
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.6)" }}>Novo Curso</p>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>Título *</label>
            <input required value={novoCurso.titulo} onChange={e => setNovoCurso({ ...novoCurso, titulo: e.target.value })} className={ic} style={INPUT_ST} placeholder="Título do curso" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>Descrição *</label>
            <textarea required value={novoCurso.descricao} onChange={e => setNovoCurso({ ...novoCurso, descricao: e.target.value })} rows={2} className={`${ic} resize-none`} style={INPUT_ST} placeholder="Descrição breve" />
          </div>
            <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>Categoria</label>
              <input value={novoCurso.categoria} onChange={e => setNovoCurso({ ...novoCurso, categoria: e.target.value })} className={ic} style={INPUT_ST} placeholder="Ex: Bioenergia" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>Nível</label>
              <select value={novoCurso.nivel} onChange={e => setNovoCurso({ ...novoCurso, nivel: e.target.value })} className={ic} style={SELECT_ST}>
                <option value="todos" style={OPT}>Todos</option>
                <option value="iniciante" style={OPT}>Iniciante</option>
                <option value="intermediario" style={OPT}>Intermediário</option>
                <option value="avancado" style={OPT}>Avançado</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>Módulo da jornada (opcional)</label>
            <select
              value={novoCurso.moduloJornada}
              onChange={(e) => setNovoCurso({ ...novoCurso, moduloJornada: e.target.value })}
              className={ic}
              style={SELECT_ST}
            >
              <option value="" style={OPT}>— Nenhum —</option>
              <option value="traco" style={OPT}>traco</option>
              <option value="temperamento" style={OPT}>temperamento</option>
              <option value="linguagens-amor" style={OPT}>linguagens-amor</option>
              <option value="roda" style={OPT}>roda</option>
              <option value="numerologia" style={OPT}>numerologia</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-semibold" style={{ color: C.muted }}>Capa do curso (opcional)</label>
            <p className="text-[10px] leading-relaxed" style={{ color: C.dim }}>
              Envie uma imagem chamativa ou cole uma URL pública (HTTPS). Se enviar arquivo, ele substitui a URL.
            </p>
            <input ref={capaNovoRef} type="file" accept="image/*" className="hidden" id="capa-novo-curso"
              onChange={e => setCapaArquivoNovo(e.target.files?.[0] || null)} />
            <label htmlFor="capa-novo-curso" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs cursor-pointer"
              style={{ border: "1px dashed rgba(200,165,107,0.35)", color: C.bronze }}>
              <ImageIcon className="w-4 h-4" />
              {capaArquivoNovo ? capaArquivoNovo.name : "Upload de imagem da capa"}
            </label>
            <input value={novoCurso.imagemUrl} onChange={e => setNovoCurso({ ...novoCurso, imagemUrl: e.target.value })}
              className={ic} style={INPUT_ST} placeholder="Ou URL da imagem (https://…)" type="url" />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setCriandoCurso(false)} className="flex-1 py-2 rounded-xl text-sm"
              style={{ border: "1px solid rgba(200,165,107,0.2)", color: C.muted }}>Cancelar</button>
            <button type="submit" disabled={enviandoCurso} className="flex-1 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}>
              {enviandoCurso ? "Criando..." : "Criar Curso"}
            </button>
          </div>
        </form>
      )}

      {/* Course list */}
      {loading
        ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" style={{ color: C.gold }} /></div>
        : cursos.length === 0
          ? <div className="text-center py-12 rounded-2xl" style={CARD}>
              <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-20" style={{ color: C.gold }} />
              <p className="text-sm" style={{ color: C.muted }}>Nenhum curso criado ainda.</p>
            </div>
          : (
            <div className="space-y-3">
              {cursos.map(curso => (
                <div key={curso.id} className="rounded-2xl overflow-hidden" style={CARD_S}>
                  {/* Course row */}
                  <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => abrirCurso(curso.id)}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(200,165,107,0.03)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={curso.publicado
                            ? { background: "rgba(74,222,128,0.09)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.2)" }
                            : { background: "rgba(200,165,107,0.1)", color: C.bronze }}>
                          {curso.publicado ? "Publicado" : "Rascunho"}
                        </span>
                        {curso.categoria && <span className="text-xs" style={{ color: C.muted }}>{curso.categoria}</span>}
                      </div>
                      <p className="font-semibold text-sm" style={{ color: C.text }}>{curso.titulo}</p>
                      <p className="text-xs mt-0.5" style={{ color: C.muted }}>{curso.aulasCount} aula{curso.aulasCount !== 1 ? "s" : ""}{curso.moduloJornada ? ` · jornada: ${curso.moduloJornada}` : ""}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={e => { e.stopPropagation(); togglePublicado(curso); }}
                        className="p-1.5 rounded-lg transition-colors" style={{ color: C.muted }}
                        title={curso.publicado ? "Despublicar" : "Publicar"}
                        onMouseEnter={e => (e.currentTarget.style.color = C.gold)}
                        onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
                        {curso.publicado ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={e => { e.stopPropagation(); handleDeletarCurso(curso.id); }}
                        className="p-1.5 rounded-lg transition-colors" style={{ color: "rgba(248,113,113,0.4)" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(248,113,113,0.4)")}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span style={{ color: C.muted }}>
                        {cursoAberto === curso.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </div>
                  </div>

                  {/* Aulas */}
                  {cursoAberto === curso.id && (
                    <div className="px-4 pb-4 pt-2 space-y-3" style={{ borderTop: "1px solid rgba(200,165,107,0.1)" }}>
                      <div className="p-4 rounded-xl space-y-3" style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.12)" }}>
                        <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.55)" }}>Capa na vitrine</p>
                        <div className="h-28 rounded-lg overflow-hidden relative bg-black/30">
                          {cursoDetalhe?.imagemUrl?.trim() && /^https?:\/\//i.test(cursoDetalhe.imagemUrl) ? (
                            <img src={cursoDetalhe.imagemUrl} alt="" className="w-full h-full object-cover" />
                          ) : cursoDetalhe?.imagemUrl ? (
                            <AuthenticatedImage
                              apiPath={`/cursos/${curso.id}/capa`}
                              alt=""
                              className="w-full h-full"
                              imgClassName="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px]" style={{ color: C.dim }}>Sem capa</div>
                          )}
                        </div>
                        <input ref={capaEdicaoRef} type="file" accept="image/*" className="hidden" id={`capa-edt-${curso.id}`}
                          onChange={e => setCapaArquivoEdicao(e.target.files?.[0] || null)} />
                        <label htmlFor={`capa-edt-${curso.id}`} className="block text-center py-2 rounded-lg text-xs cursor-pointer"
                          style={{ border: "1px dashed rgba(200,165,107,0.35)", color: C.bronze }}>
                          {capaArquivoEdicao ? capaArquivoEdicao.name : "Nova imagem (upload)"}
                        </label>
                        <input type="url" value={capaUrlEdicao} onChange={e => setCapaUrlEdicao(e.target.value)}
                          className={ic} style={INPUT_ST} placeholder="Ou URL https://…" />
                        <button type="button" disabled={salvandoCapa} onClick={() => handleSalvarCapa(curso.id)}
                          className="w-full py-2 rounded-xl text-xs font-semibold disabled:opacity-50"
                          style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}>
                          {salvandoCapa ? "Salvando capa…" : "Salvar capa"}
                        </button>
                      </div>
                      <div className="p-4 rounded-xl space-y-2" style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.12)" }}>
                        <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.55)" }}>Vínculo jornada</p>
                        <p className="text-[10px] leading-relaxed" style={{ color: C.dim }}>
                          Associa este curso a um módulo (metadado). Em “Módulos da Jornada”, escolhe o mesmo curso como minicurso.
                        </p>
                        <select
                          value={moduloJornadaEdicao}
                          onChange={(e) => setModuloJornadaEdicao(e.target.value)}
                          className={ic}
                          style={SELECT_ST}
                        >
                          <option value="" style={OPT}>— Nenhum —</option>
                          <option value="traco" style={OPT}>traco</option>
                          <option value="temperamento" style={OPT}>temperamento</option>
                          <option value="linguagens-amor" style={OPT}>linguagens-amor</option>
                          <option value="roda" style={OPT}>roda</option>
                          <option value="numerologia" style={OPT}>numerologia</option>
                        </select>
                        <button
                          type="button"
                          disabled={salvandoModJn}
                          onClick={() => void handleSalvarModuloJornada(curso.id)}
                          className="w-full py-2 rounded-xl text-xs font-semibold disabled:opacity-50"
                          style={{ border: "1px solid rgba(200,165,107,0.25)", color: C.gold }}
                        >
                          {salvandoModJn ? "A guardar…" : "Guardar vínculo"}
                        </button>
                      </div>
                      {loadingDetalhe
                        ? <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin" style={{ color: C.gold }} /></div>
                        : cursoDetalhe?.aulas.map((aula, i) => (
                          <div key={aula.id} className="flex items-center gap-3 p-3 rounded-xl"
                            style={{ background: "rgba(200,165,107,0.03)", border: "1px solid rgba(200,165,107,0.1)" }}>
                            <BookOpen className="w-4 h-4 shrink-0" style={{ color: C.muted }} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs" style={{ color: C.dim }}>Aula {i + 1}</p>
                              <p className="text-sm font-medium truncate" style={{ color: C.text }}>{aula.titulo}</p>
                            </div>
                            <button onClick={() => handleDeletarAula(aula.id, curso.id)}
                              className="p-1.5 rounded-lg shrink-0 transition-colors" style={{ color: "rgba(248,113,113,0.4)" }}
                              onMouseEnter={e => (e.currentTarget.style.color = "#f87171")}
                              onMouseLeave={e => (e.currentTarget.style.color = "rgba(248,113,113,0.4)")}>
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      }

                      {!criandoAula
                        ? (
                          <button onClick={() => setCriandoAula(true)}
                            className="flex items-center gap-2 text-sm transition-colors"
                            style={{ color: C.muted }}
                            onMouseEnter={e => (e.currentTarget.style.color = C.gold)}
                            onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>
                            <Plus className="w-3.5 h-3.5" /> Adicionar aula
                          </button>
                        ) : (
                          <form onSubmit={e => handleCriarAula(e, curso.id)} className="space-y-3 p-4 rounded-xl"
                            style={{ background: "rgba(200,165,107,0.04)", border: "1px solid rgba(200,165,107,0.15)" }}>
                            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.6)" }}>Nova Aula</p>
                            <div>
                              <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>Título *</label>
                              <input required value={novaAula.titulo} onChange={e => setNovaAula({ ...novaAula, titulo: e.target.value })} className={ic} style={INPUT_ST} placeholder="Título da aula" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>Descrição</label>
                              <input value={novaAula.descricao} onChange={e => setNovaAula({ ...novaAula, descricao: e.target.value })} className={ic} style={INPUT_ST} placeholder="Descrição breve" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>URL do Vídeo</label>
                                <input type="url" value={novaAula.videoUrl} onChange={e => setNovaAula({ ...novaAula, videoUrl: e.target.value })} className={ic} style={INPUT_ST} placeholder="https://youtu.be/..." />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>Duração (min)</label>
                                <input type="number" min="0" value={novaAula.duracaoMin} onChange={e => setNovaAula({ ...novaAula, duracaoMin: e.target.value })} className={ic} style={INPUT_ST} placeholder="15" />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>Ordem</label>
                              <input type="number" min="0" value={novaAula.ordem} onChange={e => setNovaAula({ ...novaAula, ordem: e.target.value })} className={ic} style={INPUT_ST} placeholder="0" />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold mb-1" style={{ color: C.muted }}>Conteúdo / Texto</label>
                              <textarea value={novaAula.conteudo} onChange={e => setNovaAula({ ...novaAula, conteudo: e.target.value })} rows={3}
                                className={`${ic} resize-none`} style={INPUT_ST} placeholder="Texto da aula (opcional)..." />
                            </div>
                            <div className="flex gap-2">
                              <button type="button" onClick={() => setCriandoAula(false)}
                                className="flex-1 py-2 rounded-xl text-sm"
                                style={{ border: "1px solid rgba(200,165,107,0.2)", color: C.muted }}>Cancelar</button>
                              <button type="submit" disabled={enviandoAula}
                                className="flex-1 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
                                style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}>
                                {enviandoAula ? "Salvando..." : "Salvar Aula"}
                              </button>
                            </div>
                          </form>
                        )
                      }
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
      }
    </div>
  );
}

