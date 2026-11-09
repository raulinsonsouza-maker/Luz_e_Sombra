import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, ImageIcon, Loader2, RotateCcw, Save, Upload, X } from "lucide-react";
import { apiFetch } from "@/lib/auth";
import {
  TOTAL_IMAGENS_DIA,
  pathImagemDia,
  pathThumbImagemDia,
  thumbDeImagemDia,
  webDeImagemDia,
} from "@/lib/imagemDoDia";
import { LOGO_CLARO } from "@/lib/marca";
import type { ConteudoDia } from "@/lib/conteudoDia";
import { CARD, C, INPUT_ST, type ShowMsg } from "./shared";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];
const MESES_MIN = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];
const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

type FormatoData = "padrao" | "personalizado";

const PANEL: CSSProperties = {
  background: "#1a1510",
  border: "1px solid rgba(200,165,107,0.22)",
};

function hojePartes() {
  const n = new Date();
  return { ano: n.getFullYear(), mes: n.getMonth() + 1 };
}

function hojeISO() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
}

function diaSemanaISO(dataISO: string) {
  const [y, m, d] = dataISO.split("-").map(Number);
  return new Date(y!, m! - 1, d!).getDay();
}

function partesData(dataISO: string) {
  const [y, m, d] = dataISO.split("-").map(Number);
  return { y: y!, m: m!, d: d! };
}

function rotuloPadrao(dataISO: string) {
  const { d, m } = partesData(dataISO);
  return `${d} de ${MESES_MIN[m - 1]}`;
}

function rotuloCurta(dataISO: string) {
  const { d, m } = partesData(dataISO);
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}`;
}

function detectarFormato(dataISO: string, dataExibicao: string | null | undefined): FormatoData {
  if (!dataExibicao?.trim()) return "padrao";
  if (dataExibicao.trim() === rotuloPadrao(dataISO)) return "padrao";
  return "personalizado";
}

function PreviewReflexao({
  dataRotulo,
  frase,
  reflexao,
  imagem,
}: {
  dataRotulo: string;
  frase: string;
  reflexao: string;
  imagem: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-[1.35rem] w-full h-full"
      style={{
        border: "1px solid rgba(200,165,107,0.28)",
        background: "#1a1208",
        boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
      }}
    >
      {imagem ? <img src={imagem} alt="" className="absolute inset-0 h-full w-full object-cover" /> : null}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(18,12,8,0.42) 0%, rgba(18,12,8,0.55) 42%, rgba(18,12,8,0.88) 100%)",
        }}
      />
      <div className="relative z-10 flex h-full flex-col items-center text-center px-5 pt-7 pb-5">
        <div className="flex flex-1 w-full flex-col items-center justify-center min-h-0 overflow-hidden">
          <p className="text-[10px] tracking-[0.2em] uppercase font-semibold shrink-0" style={{ color: "#c8a56b" }}>
            {dataRotulo || "—"}
          </p>
          <p
            className="font-tan-mon-cheri leading-snug max-w-[15rem] mt-3 overflow-hidden"
            style={{
              color: "#f7f2ec",
              fontSize: frase.length > 110 ? "0.95rem" : frase.length > 70 ? "1.1rem" : "1.25rem",
            }}
          >
            {frase.trim() || "Sua frase aparece aqui"}
          </p>
          <div className="my-3 h-px w-8 shrink-0" style={{ background: "rgba(200,165,107,0.85)" }} />
          <p
            className="font-tan-mon-cheri max-w-[16rem] leading-relaxed overflow-y-auto"
            style={{
              color: "rgba(247,242,236,0.9)",
              fontSize: reflexao.length > 240 ? "0.72rem" : "0.82rem",
            }}
          >
            {reflexao.trim() || "A reflexão aparece aqui"}
          </p>
        </div>
        <div className="mt-2 flex flex-col items-center gap-1 shrink-0">
          <p className="text-[8px] font-semibold tracking-[0.28em] uppercase" style={{ color: "#e8d5b0" }}>
            Letícia Galloni
          </p>
          <img src={LOGO_CLARO} alt="" className="h-auto w-[4.5rem] opacity-95" />
        </div>
      </div>
    </div>
  );
}

export function ConteudoDiaTab({ showMsg }: { showMsg: ShowMsg }) {
  const agora = hojePartes();
  const [ano, setAno] = useState(agora.ano);
  const [mes, setMes] = useState(agora.mes);
  const [dias, setDias] = useState<ConteudoDia[]>([]);
  const [loading, setLoading] = useState(true);
  const [editandoDia, setEditandoDia] = useState<ConteudoDia | null>(null);
  const [frase, setFrase] = useState("");
  const [reflexao, setReflexao] = useState("");
  const [convite, setConvite] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [imagemPadraoDia, setImagemPadraoDia] = useState("");
  const [formatoData, setFormatoData] = useState<FormatoData>("padrao");
  const [dataExibicao, setDataExibicao] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [galeriaAberta, setGaleriaAberta] = useState(false);
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
    setEditandoDia(null);
  }, [ano, mes]);

  const offsetInicio = useMemo(() => {
    if (!dias[0]) return 0;
    return diaSemanaISO(dias[0].data);
  }, [dias]);

  const editadosNoMes = useMemo(() => dias.filter((d) => d.editado).length, [dias]);

  function abrirEdicao(dia: ConteudoDia) {
    setEditandoDia(dia);
    setFrase(dia.frase);
    setReflexao(dia.reflexao);
    setConvite(dia.convite);
    setImagemUrl(webDeImagemDia(dia.imagemPath || dia.imagemUrl) || dia.imagemUrl);
    const indice = ((dia.diaCalendario - 1) % TOTAL_IMAGENS_DIA) + 1;
    setImagemPadraoDia(pathImagemDia(indice));
    const fmt = detectarFormato(dia.data, dia.dataExibicao);
    setFormatoData(fmt);
    setDataExibicao(dia.dataExibicao?.trim() || "");
    setGaleriaAberta(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function cancelarEdicao() {
    setEditandoDia(null);
    setGaleriaAberta(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function aplicarFormato(fmt: FormatoData) {
    setFormatoData(fmt);
    if (fmt === "padrao") setDataExibicao("");
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
    if (!editandoDia) return;
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
      const res = await apiFetch(`/conteudo-dia/admin/${editandoDia.data}`, {
        method: "PUT",
        body: JSON.stringify({
          frase: frase.trim(),
          reflexao: reflexao.trim(),
          convite: convite.trim(),
          imagemUrl: imagem,
          dataExibicao: formatoData === "padrao" ? null : dataExibicao.trim() || null,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showMsg("erro", (err as { error?: string }).error || "Não foi possível salvar.");
      } else {
        const atualizado = await res.json() as ConteudoDia;
        setDias((prev) => prev.map((d) => (d.data === atualizado.data ? atualizado : d)));
        showMsg("sucesso", "Conteúdo do dia atualizado.");
        setEditandoDia(null);
      }
    } catch {
      showMsg("erro", "Não foi possível salvar.");
    }
    setSalvando(false);
  }

  async function restaurarPadrao() {
    if (!editandoDia) return;
    setSalvando(true);
    try {
      const res = await apiFetch(`/conteudo-dia/admin/${editandoDia.data}`, { method: "DELETE" });
      if (!res.ok) {
        showMsg("erro", "Não foi possível restaurar o padrão.");
      } else {
        const atualizado = await res.json() as ConteudoDia;
        setDias((prev) => prev.map((d) => (d.data === atualizado.data ? atualizado : d)));
        showMsg("sucesso", "Dia restaurado ao conteúdo padrão.");
        setEditandoDia(null);
      }
    } catch {
      showMsg("erro", "Não foi possível restaurar o padrão.");
    }
    setSalvando(false);
  }

  const previewImagem = (() => {
    if (imagemUrl.startsWith("blob:")) return imagemUrl;
    if (imagemUrl.startsWith("/objects/")) {
      return editandoDia?.overrideId
        ? `/api/conteudo-dia/imagem/${editandoDia.overrideId}`
        : imagemPadraoDia;
    }
    return webDeImagemDia(imagemUrl) || imagemUrl || imagemPadraoDia;
  })();

  const dataRotuloLive = editandoDia
    ? (formatoData === "padrao"
      ? rotuloPadrao(editandoDia.data)
      : dataExibicao.trim() || rotuloPadrao(editandoDia.data))
    : "";

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3" style={CARD}>
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(200,165,107,0.1)", border: "1px solid rgba(200,165,107,0.25)" }}
          >
            <CalendarDays className="w-5 h-5" style={{ color: C.gold }} />
          </div>
          <div className="min-w-0">
            <h2 className="font-tan-mon-cheri text-xl" style={{ color: C.gold }}>Conteúdo do dia</h2>
            <p className="text-xs" style={{ color: C.muted }}>
              Clique em um dia para editar
              {editadosNoMes > 0 ? ` · ${editadosNoMes} editado${editadosNoMes > 1 ? "s" : ""}` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => mudarMes(-1)} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ border: "1px solid rgba(200,165,107,0.25)", color: C.gold }} aria-label="Mês anterior">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <p className="min-w-[9rem] text-center text-sm font-semibold" style={{ color: C.text }}>
            {MESES[mes - 1]} {ano}
          </p>
          <button type="button" onClick={() => mudarMes(1)} className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ border: "1px solid rgba(200,165,107,0.25)", color: C.gold }} aria-label="Próximo mês">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.gold }} />
        </div>
      ) : (
        <div className="rounded-2xl p-3 sm:p-4" style={CARD}>
          <div className="grid grid-cols-7 gap-1.5 mb-2">
            {DIAS_SEMANA.map((l, i) => (
              <div key={`${l}-${i}`} className="text-center text-[10px] tracking-wider py-1 font-semibold" style={{ color: C.muted }}>
                {l}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {Array.from({ length: offsetInicio }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {dias.map((dia) => {
              const num = Number(dia.data.slice(-2));
              const ehHoje = dia.data === hojeISO();
              return (
                <button
                  key={dia.data}
                  type="button"
                  onClick={() => abrirEdicao(dia)}
                  className="relative aspect-square rounded-xl overflow-hidden group"
                  style={{
                    border: dia.editado
                      ? "2px solid rgba(200,165,107,0.7)"
                      : ehHoje
                        ? "1.5px solid rgba(200,165,107,0.45)"
                        : "1px solid rgba(200,165,107,0.15)",
                  }}
                  title={`${num} — clicar para editar`}
                >
                  <img
                    src={thumbDeImagemDia(dia.imagemPath || dia.imagemUrl) || dia.imagemUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)" }}
                  />
                  <span
                    className="absolute top-1.5 left-1.5 text-[11px] sm:text-xs font-bold px-1.5 py-0.5 rounded-md tabular-nums"
                    style={{ background: "rgba(19,15,9,0.72)", color: C.gold }}
                  >
                    {num}
                  </span>
                  {dia.editado && (
                    <span
                      className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                      style={{ background: C.gold, boxShadow: "0 0 0 2px rgba(19,15,9,0.5)" }}
                      title="Editado"
                    />
                  )}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[10px]" style={{ color: C.dim }}>
            Ponto dourado = dia personalizado. Clique no dia para abrir a edição.
          </p>
        </div>
      )}

      {editandoDia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
          <button
            type="button"
            className="absolute inset-0"
            style={{ background: "#0c0a08" }}
            aria-label="Fechar"
            onClick={cancelarEdicao}
          />

          <div
            className="relative z-10 flex flex-col w-full max-w-5xl max-h-[min(92vh,900px)] overflow-hidden rounded-2xl shadow-2xl"
            style={{ background: "#1a1510", border: "1px solid rgba(200,165,107,0.28)" }}
          >
            <div
              className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-b shrink-0"
              style={{ borderColor: "rgba(200,165,107,0.18)", background: "#1f1913" }}
            >
              <div className="min-w-0">
                <p className="text-[10px] tracking-[0.18em] uppercase" style={{ color: C.muted }}>Editando</p>
                <h3 className="font-tan-mon-cheri text-lg sm:text-xl truncate" style={{ color: C.gold }}>
                  {rotuloCurta(editandoDia.data)}/{String(partesData(editandoDia.data).y).slice(2)}
                </h3>
              </div>
              <button
                type="button"
                onClick={cancelarEdicao}
                className="w-9 h-9 flex items-center justify-center rounded-xl shrink-0"
                style={{ color: C.muted, border: "1px solid rgba(200,165,107,0.2)" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5" style={{ background: "#1a1510" }}>
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(220px,280px)_minmax(0,1fr)] gap-4 lg:gap-5">
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] tracking-[0.16em] uppercase mb-2 font-semibold" style={{ color: C.muted }}>
                      Pré-visualização
                    </p>
                    <div className="mx-auto w-full max-w-[260px]" style={{ aspectRatio: "9 / 16" }}>
                      <PreviewReflexao
                        dataRotulo={dataRotuloLive}
                        frase={frase}
                        reflexao={reflexao}
                        imagem={previewImagem}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] tracking-[0.16em] uppercase font-semibold" style={{ color: C.muted }}>
                      Imagem
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setImagemUrl(imagemPadraoDia);
                          if (fileRef.current) fileRef.current.value = "";
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                        style={{ border: "1px solid rgba(200,165,107,0.3)", color: C.gold }}
                      >
                        Padrão
                      </button>
                      <button
                        type="button"
                        onClick={() => setGaleriaAberta(true)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5"
                        style={{ border: "1px solid rgba(200,165,107,0.3)", color: C.gold }}
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        Galeria
                      </button>
                      <label
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
                        style={{ background: "rgba(200,165,107,0.12)", color: C.gold, border: "1px solid rgba(200,165,107,0.3)" }}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Enviar
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
                  </div>
                </div>

                <div className="space-y-3.5">
                  <div>
                    <p className="text-[10px] tracking-[0.16em] uppercase font-semibold mb-2" style={{ color: C.muted }}>
                      Formato da data
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {([
                        { key: "padrao" as const, label: `Padrão (${rotuloPadrao(editandoDia.data)})` },
                        { key: "personalizado" as const, label: "Personalizado" },
                      ]).map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => aplicarFormato(opt.key)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                          style={{
                            background: formatoData === opt.key ? "rgba(200,165,107,0.16)" : "transparent",
                            border: formatoData === opt.key ? "1px solid rgba(200,165,107,0.5)" : "1px solid rgba(200,165,107,0.2)",
                            color: C.gold,
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    {formatoData === "personalizado" && (
                      <input
                        value={dataExibicao}
                        onChange={(e) => {
                          setFormatoData("personalizado");
                          setDataExibicao(e.target.value);
                        }}
                        placeholder="Ex: 11/11"
                        maxLength={80}
                        className="w-full rounded-xl px-3 py-2.5 text-sm"
                        style={INPUT_ST}
                      />
                    )}
                  </div>

                  <label className="block space-y-1.5">
                    <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: C.muted }}>Frase</span>
                    <textarea value={frase} onChange={(e) => setFrase(e.target.value)} rows={3} className="w-full rounded-xl px-3 py-2.5 text-sm resize-y" style={INPUT_ST} />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: C.muted }}>Reflexão</span>
                    <textarea value={reflexao} onChange={(e) => setReflexao(e.target.value)} rows={6} className="w-full rounded-xl px-3 py-2.5 text-sm resize-y min-h-[8rem]" style={INPUT_ST} />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: C.muted }}>Convite (home)</span>
                    <textarea value={convite} onChange={(e) => setConvite(e.target.value)} rows={3} className="w-full rounded-xl px-3 py-2.5 text-sm resize-y" style={INPUT_ST} />
                  </label>
                </div>
              </div>
            </div>

            <div
              className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-5 py-3.5 border-t shrink-0"
              style={{ borderColor: "rgba(200,165,107,0.18)", background: "#1f1913" }}
            >
              <button
                type="button"
                onClick={() => void restaurarPadrao()}
                disabled={salvando || !editandoDia.editado}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold"
                style={{ border: "1px solid rgba(200,165,107,0.3)", color: C.gold, opacity: !editandoDia.editado || salvando ? 0.4 : 1 }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restaurar padrão
              </button>
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={cancelarEdicao}
                  disabled={salvando}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold"
                  style={{ border: "1px solid rgba(200,165,107,0.25)", color: C.muted }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => void salvar()}
                  disabled={salvando}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold"
                  style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208", opacity: salvando ? 0.7 : 1 }}
                >
                  {salvando ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Salvar
                </button>
              </div>
            </div>
          </div>

          {galeriaAberta && (
            <div className="absolute inset-0 z-[60] flex items-center justify-center p-4" style={{ background: "rgba(8,6,4,0.92)" }}>
              <div
                className="w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl flex flex-col shadow-2xl"
                style={{ background: "#1a1510", border: "1px solid rgba(200,165,107,0.28)" }}
              >
                <div className="flex items-center justify-between gap-3 px-4 py-3 border-b shrink-0" style={{ borderColor: "rgba(200,165,107,0.15)", background: "#1f1913" }}>
                  <div>
                    <p className="font-tan-mon-cheri text-lg" style={{ color: C.text }}>Galeria</p>
                    <p className="text-[10px]" style={{ color: C.muted }}>
                      {TOTAL_IMAGENS_DIA} imagens · role para ver todas
                    </p>
                  </div>
                  <button type="button" onClick={() => setGaleriaAberta(false)} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ color: C.muted }}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 overflow-y-auto flex-1 min-h-0" style={{ background: "#1a1510" }}>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {Array.from({ length: TOTAL_IMAGENS_DIA }, (_, i) => {
                      const n = i + 1;
                      const full = pathImagemDia(n);
                      const thumb = pathThumbImagemDia(n);
                      const selecionada =
                        imagemUrl === full ||
                        imagemUrl === `/imagens-dia/${n}.png` ||
                        imagemUrl === thumb;
                      return (
                        <button
                          key={full}
                          type="button"
                          onClick={() => {
                            setImagemUrl(full);
                            if (fileRef.current) fileRef.current.value = "";
                            setGaleriaAberta(false);
                          }}
                          className="aspect-square rounded-lg overflow-hidden"
                          style={{ outline: selecionada ? "2px solid #c8a56b" : "1px solid rgba(200,165,107,0.15)" }}
                        >
                          <img src={thumb} alt="" className="w-full h-full object-cover" loading="lazy" decoding="async" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
