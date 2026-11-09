import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, ImageIcon, Loader2, RotateCcw, Save, X } from "lucide-react";
import { apiFetch } from "@/lib/auth";
import { TOTAL_IMAGENS_DIA } from "@/lib/imagemDoDia";
import type { ConteudoDia } from "@/lib/conteudoDia";
import { CARD, C, INPUT_ST, type ShowMsg } from "./shared";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function hojePartes() {
  const n = new Date();
  return { ano: n.getFullYear(), mes: n.getMonth() + 1 };
}

function trecho(texto: string, max = 72) {
  const t = texto.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function diaSemanaISO(dataISO: string) {
  const [y, m, d] = dataISO.split("-").map(Number);
  return new Date(y!, m! - 1, d!).getDay();
}

export function ConteudoDiaTab({ showMsg }: { showMsg: ShowMsg }) {
  const agora = hojePartes();
  const [ano, setAno] = useState(agora.ano);
  const [mes, setMes] = useState(agora.mes);
  const [dias, setDias] = useState<ConteudoDia[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<ConteudoDia | null>(null);
  const [frase, setFrase] = useState("");
  const [reflexao, setReflexao] = useState("");
  const [convite, setConvite] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [imagemPadraoDia, setImagemPadraoDia] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mostrandoGaleria, setMostrandoGaleria] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function carregarMes(a = ano, m = mes) {
    setLoading(true);
    try {
      const res = await apiFetch(`/conteudo-dia/admin?ano=${a}&mes=${m}`);
      if (!res.ok) {
        showMsg("erro", "Não foi possível carregar o calendário.");
        setDias([]);
      } else {
        const data = await res.json() as { dias: ConteudoDia[] };
        setDias(data.dias ?? []);
      }
    } catch {
      showMsg("erro", "Não foi possível carregar o calendário.");
      setDias([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    void carregarMes(ano, mes);
  }, [ano, mes]);

  const offsetInicio = useMemo(() => {
    if (!dias[0]) return 0;
    return diaSemanaISO(dias[0].data);
  }, [dias]);

  function abrirEdicao(dia: ConteudoDia) {
    setEditando(dia);
    setFrase(dia.frase);
    setReflexao(dia.reflexao);
    setConvite(dia.convite);
    setImagemUrl(dia.imagemPath || dia.imagemUrl);
    const indice = ((dia.diaCalendario - 1) % TOTAL_IMAGENS_DIA) + 1;
    setImagemPadraoDia(`/imagens-dia/${indice}.png`);
    setMostrandoGaleria(false);
  }

  function fecharEdicao() {
    setEditando(null);
    setMostrandoGaleria(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function mudarMes(delta: number) {
    let m = mes + delta;
    let a = ano;
    if (m < 1) {
      m = 12;
      a -= 1;
    } else if (m > 12) {
      m = 1;
      a += 1;
    }
    setAno(a);
    setMes(m);
  }

  async function enviarUpload(file: File): Promise<string | null> {
    const urlRes = await apiFetch("/conteudo-dia/admin/upload-url", { method: "POST" });
    if (!urlRes.ok) return null;
    const { uploadURL, objectPath } = await urlRes.json() as { uploadURL: string; objectPath: string };
    const up = await fetch(uploadURL, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type || "image/jpeg" },
    });
    return up.ok ? objectPath : null;
  }

  async function salvar() {
    if (!editando) return;
    if (!frase.trim()) {
      showMsg("erro", "A frase é obrigatória.");
      return;
    }
    setSalvando(true);
    try {
      let imagem = imagemUrl;
      const arquivo = fileRef.current?.files?.[0];
      if (arquivo) {
        const path = await enviarUpload(arquivo);
        if (!path) {
          showMsg("erro", "Falha no upload da imagem.");
          setSalvando(false);
          return;
        }
        imagem = path;
      }
      const res = await apiFetch(`/conteudo-dia/admin/${editando.data}`, {
        method: "PUT",
        body: JSON.stringify({
          frase: frase.trim(),
          reflexao: reflexao.trim(),
          convite: convite.trim(),
          imagemUrl: imagem,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showMsg("erro", (err as { error?: string }).error || "Não foi possível salvar.");
      } else {
        const atualizado = await res.json() as ConteudoDia;
        setDias((prev) => prev.map((d) => (d.data === atualizado.data ? atualizado : d)));
        showMsg("sucesso", "Conteúdo do dia atualizado.");
        fecharEdicao();
      }
    } catch {
      showMsg("erro", "Não foi possível salvar.");
    }
    setSalvando(false);
  }

  async function restaurarPadrao() {
    if (!editando) return;
    setSalvando(true);
    try {
      const res = await apiFetch(`/conteudo-dia/admin/${editando.data}`, { method: "DELETE" });
      if (!res.ok) {
        showMsg("erro", "Não foi possível restaurar o padrão.");
      } else {
        const atualizado = await res.json() as ConteudoDia;
        setDias((prev) => prev.map((d) => (d.data === atualizado.data ? atualizado : d)));
        showMsg("sucesso", "Dia restaurado ao conteúdo padrão.");
        fecharEdicao();
      }
    } catch {
      showMsg("erro", "Não foi possível restaurar o padrão.");
    }
    setSalvando(false);
  }

  const previewImagem = (() => {
    if (imagemUrl.startsWith("blob:")) return imagemUrl;
    if (imagemUrl.startsWith("/objects/")) {
      return editando?.overrideId
        ? `/api/conteudo-dia/imagem/${editando.overrideId}`
        : imagemPadraoDia;
    }
    return imagemUrl || imagemPadraoDia;
  })();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3" style={CARD}>
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(200,165,107,0.1)", border: "1px solid rgba(200,165,107,0.25)" }}
          >
            <CalendarDays className="w-5 h-5" style={{ color: C.gold }} />
          </div>
          <div>
            <h2 className="font-tan-mon-cheri text-xl" style={{ color: C.gold }}>Conteúdo do dia</h2>
            <p className="text-xs" style={{ color: C.muted }}>
              Calendário editorial — frase, reflexão, convite e imagem
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => mudarMes(-1)}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ border: "1px solid rgba(200,165,107,0.25)", color: C.gold }}
            aria-label="Mês anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <p className="min-w-[9.5rem] text-center text-sm font-semibold" style={{ color: C.text }}>
            {MESES[mes - 1]} {ano}
          </p>
          <button
            type="button"
            onClick={() => mudarMes(1)}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ border: "1px solid rgba(200,165,107,0.25)", color: C.gold }}
            aria-label="Próximo mês"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.gold }} />
        </div>
      ) : (
        <div className="rounded-2xl p-3" style={CARD}>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((l, i) => (
              <div key={`${l}-${i}`} className="text-center text-[10px] tracking-wider py-1" style={{ color: C.muted }}>
                {l}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {Array.from({ length: offsetInicio }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {dias.map((dia) => {
              const num = Number(dia.data.slice(-2));
              return (
                <button
                  key={dia.data}
                  type="button"
                  onClick={() => abrirEdicao(dia)}
                  className="rounded-xl overflow-hidden text-left transition-opacity hover:opacity-95"
                  style={{
                    border: dia.editado
                      ? "1.5px solid rgba(200,165,107,0.55)"
                      : "1px solid rgba(200,165,107,0.15)",
                    background: "rgba(0,0,0,0.25)",
                    minHeight: 118,
                  }}
                >
                  <div className="relative h-14 bg-black/40">
                    <img
                      src={dia.imagemUrl}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                    <span
                      className="absolute top-1 left-1 text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: "rgba(19,15,9,0.7)", color: C.gold }}
                    >
                      {num}
                    </span>
                    {dia.editado && (
                      <span
                        className="absolute top-1 right-1 text-[9px] px-1.5 py-0.5 rounded font-semibold"
                        style={{ background: "rgba(200,165,107,0.9)", color: "#130f09" }}
                      >
                        editado
                      </span>
                    )}
                  </div>
                  <p className="px-1.5 py-1.5 text-[10px] leading-snug line-clamp-3" style={{ color: "rgba(247,242,236,0.75)" }}>
                    {trecho(dia.frase, 68)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {editando && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: "rgba(0,0,0,0.72)" }}>
          <div
            className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-5 space-y-4"
            style={{ background: "#1e1812", border: "1px solid rgba(200,165,107,0.2)" }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs tracking-[0.18em] uppercase" style={{ color: C.muted }}>Editar dia</p>
                <h3 className="font-tan-mon-cheri text-2xl" style={{ color: C.gold }}>
                  {editando.data.split("-").reverse().join("/")}
                </h3>
              </div>
              <button type="button" onClick={fecharEdicao} className="w-9 h-9 flex items-center justify-center" style={{ color: C.muted }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden h-44 relative" style={{ border: "1px solid rgba(200,165,107,0.2)" }}>
              <img src={previewImagem} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setImagemUrl(imagemPadraoDia);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold"
                style={{ border: "1px solid rgba(200,165,107,0.3)", color: C.gold }}
              >
                Imagem padrão
              </button>
              <button
                type="button"
                onClick={() => setMostrandoGaleria((v) => !v)}
                className="px-3 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5"
                style={{ border: "1px solid rgba(200,165,107,0.3)", color: C.gold }}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Escolher das 100
              </button>
              <label
                className="px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                style={{ background: "rgba(200,165,107,0.12)", color: C.gold, border: "1px solid rgba(200,165,107,0.3)" }}
              >
                Enviar imagem
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={() => {
                    const f = fileRef.current?.files?.[0];
                    if (f) setImagemUrl(URL.createObjectURL(f));
                  }}
                />
              </label>
            </div>

            {mostrandoGaleria && (
              <div className="grid grid-cols-5 sm:grid-cols-8 gap-1.5 max-h-48 overflow-y-auto p-1 rounded-xl" style={{ background: "rgba(0,0,0,0.25)" }}>
                {Array.from({ length: TOTAL_IMAGENS_DIA }, (_, i) => {
                  const src = `/imagens-dia/${i + 1}.png`;
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => {
                        setImagemUrl(src);
                        if (fileRef.current) fileRef.current.value = "";
                        setMostrandoGaleria(false);
                      }}
                      className="aspect-square rounded-lg overflow-hidden"
                      style={{ outline: imagemUrl === src ? "2px solid #c8a56b" : "1px solid rgba(200,165,107,0.15)" }}
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  );
                })}
              </div>
            )}

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: C.muted }}>Frase</span>
              <textarea
                value={frase}
                onChange={(e) => setFrase(e.target.value)}
                rows={3}
                className="w-full rounded-xl px-3 py-2.5 text-sm resize-y"
                style={INPUT_ST}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: C.muted }}>Reflexão</span>
              <textarea
                value={reflexao}
                onChange={(e) => setReflexao(e.target.value)}
                rows={4}
                className="w-full rounded-xl px-3 py-2.5 text-sm resize-y"
                style={INPUT_ST}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: C.muted }}>Convite</span>
              <textarea
                value={convite}
                onChange={(e) => setConvite(e.target.value)}
                rows={3}
                className="w-full rounded-xl px-3 py-2.5 text-sm resize-y"
                style={INPUT_ST}
              />
            </label>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => void salvar()}
                disabled={salvando}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208", opacity: salvando ? 0.7 : 1 }}
              >
                {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Salvar
              </button>
              <button
                type="button"
                onClick={() => void restaurarPadrao()}
                disabled={salvando || !editando.editado}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                style={{
                  border: "1px solid rgba(200,165,107,0.35)",
                  color: C.gold,
                  opacity: !editando.editado || salvando ? 0.45 : 1,
                }}
              >
                <RotateCcw className="w-4 h-4" />
                Restaurar padrão
              </button>
              <button
                type="button"
                onClick={fecharEdicao}
                className="ml-auto px-4 py-2.5 rounded-xl text-sm"
                style={{ color: C.muted }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
