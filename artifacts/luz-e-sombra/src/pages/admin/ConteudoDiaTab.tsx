import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, ImageIcon, Loader2, Pencil, RotateCcw, Save, Upload, X } from "lucide-react";
import { apiFetch } from "@/lib/auth";
import { TOTAL_IMAGENS_DIA } from "@/lib/imagemDoDia";
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
const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

type FormatoData = "padrao" | "curta" | "portal" | "personalizado";

function hojePartes() {
  const n = new Date();
  return { ano: n.getFullYear(), mes: n.getMonth() + 1 };
}

function hojeISO() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
}

function trecho(texto: string, max = 90) {
  const t = texto.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
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

function rotuloPortal(dataISO: string) {
  const { d, m } = partesData(dataISO);
  return `${d}/${m}`;
}

function detectarFormato(dataISO: string, dataExibicao: string | null | undefined): FormatoData {
  if (!dataExibicao?.trim()) return "padrao";
  const v = dataExibicao.trim();
  if (v === rotuloPadrao(dataISO)) return "padrao";
  if (v === rotuloCurta(dataISO)) return "curta";
  if (v === rotuloPortal(dataISO)) return "portal";
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
      className="relative overflow-hidden rounded-[1.5rem] w-full max-w-[320px] mx-auto"
      style={{
        aspectRatio: "9 / 16",
        border: "1px solid rgba(200,165,107,0.28)",
        background: "#1a1208",
        boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
      }}
    >
      {imagem ? (
        <img src={imagem} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : null}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(18,12,8,0.42) 0%, rgba(18,12,8,0.55) 42%, rgba(18,12,8,0.88) 100%)",
        }}
      />
      <div className="relative z-10 flex h-full flex-col items-center text-center px-6 pt-9 pb-6">
        <div className="flex flex-1 w-full flex-col items-center justify-center min-h-0">
          <p className="text-[10px] tracking-[0.2em] uppercase font-semibold shrink-0" style={{ color: "#c8a56b" }}>
            {dataRotulo || "—"}
          </p>
          <p
            className="font-tan-mon-cheri leading-snug max-w-[16rem] mt-4 overflow-hidden"
            style={{
              color: "#f7f2ec",
              fontSize: frase.length > 110 ? "1.05rem" : frase.length > 70 ? "1.2rem" : "1.35rem",
            }}
          >
            {frase.trim() || "Sua frase aparece aqui"}
          </p>
          <div className="my-3.5 h-px w-9 shrink-0" style={{ background: "rgba(200,165,107,0.85)" }} />
          <p
            className="font-tan-mon-cheri max-w-[17rem] leading-relaxed overflow-y-auto"
            style={{
              color: "rgba(247,242,236,0.9)",
              fontSize: reflexao.length > 240 ? "0.78rem" : "0.88rem",
            }}
          >
            {reflexao.trim() || "A reflexão aparece aqui"}
          </p>
        </div>
        <div className="mt-3 flex flex-col items-center gap-1 shrink-0">
          <p className="text-[8px] font-semibold tracking-[0.28em] uppercase" style={{ color: "#e8d5b0" }}>
            Letícia Galloni
          </p>
          <img src={LOGO_CLARO} alt="" className="h-auto w-[4.75rem] opacity-95" />
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
  const [selecionado, setSelecionado] = useState<string | null>(hojeISO());
  const [editando, setEditando] = useState(false);
  const [frase, setFrase] = useState("");
  const [reflexao, setReflexao] = useState("");
  const [convite, setConvite] = useState("");
  const [imagemUrl, setImagemUrl] = useState("");
  const [imagemPadraoDia, setImagemPadraoDia] = useState("");
  const [formatoData, setFormatoData] = useState<FormatoData>("padrao");
  const [dataExibicao, setDataExibicao] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [galeriaPagina, setGaleriaPagina] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const POR_PAGINA = 20;

  async function carregarMes(a = ano, m = mes) {
    setLoading(true);
    try {
      const res = await apiFetch(`/conteudo-dia/admin?ano=${a}&mes=${m}`);
      if (!res.ok) {
        showMsg("erro", "Não foi possível carregar o calendário.");
        setDias([]);
      } else {
        const data = await res.json() as { dias: ConteudoDia[] };
        const lista = data.dias ?? [];
        setDias(lista);
        setSelecionado((atual) => {
          if (atual && lista.some((d) => d.data === atual)) return atual;
          const hoje = hojeISO();
          if (lista.some((d) => d.data === hoje)) return hoje;
          return lista[0]?.data ?? null;
        });
      }
    } catch {
      showMsg("erro", "Não foi possível carregar o calendário.");
      setDias([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    void carregarMes(ano, mes);
    setEditando(false);
  }, [ano, mes]);

  const offsetInicio = useMemo(() => {
    if (!dias[0]) return 0;
    return diaSemanaISO(dias[0].data);
  }, [dias]);

  const diaAtual = useMemo(
    () => dias.find((d) => d.data === selecionado) ?? null,
    [dias, selecionado],
  );

  const editadosNoMes = useMemo(() => dias.filter((d) => d.editado).length, [dias]);

  function selecionarDia(dia: ConteudoDia) {
    setSelecionado(dia.data);
    setEditando(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  function aplicarFormato(fmt: FormatoData, dataISO: string) {
    setFormatoData(fmt);
    if (fmt === "padrao") setDataExibicao("");
    else if (fmt === "curta") setDataExibicao(rotuloCurta(dataISO));
    else if (fmt === "portal") setDataExibicao(rotuloPortal(dataISO));
  }

  function iniciarEdicao() {
    if (!diaAtual) return;
    setFrase(diaAtual.frase);
    setReflexao(diaAtual.reflexao);
    setConvite(diaAtual.convite);
    setImagemUrl(diaAtual.imagemPath || diaAtual.imagemUrl);
    const indice = ((diaAtual.diaCalendario - 1) % TOTAL_IMAGENS_DIA) + 1;
    setImagemPadraoDia(`/imagens-dia/${indice}.png`);
    const fmt = detectarFormato(diaAtual.data, diaAtual.dataExibicao);
    setFormatoData(fmt);
    setDataExibicao(diaAtual.dataExibicao?.trim() || "");
    setGaleriaPagina(0);
    setEditando(true);
  }

  function cancelarEdicao() {
    setEditando(false);
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
    if (!diaAtual) return;
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
      const res = await apiFetch(`/conteudo-dia/admin/${diaAtual.data}`, {
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
        setEditando(false);
      }
    } catch {
      showMsg("erro", "Não foi possível salvar.");
    }
    setSalvando(false);
  }

  async function restaurarPadrao() {
    if (!diaAtual) return;
    setSalvando(true);
    try {
      const res = await apiFetch(`/conteudo-dia/admin/${diaAtual.data}`, { method: "DELETE" });
      if (!res.ok) {
        showMsg("erro", "Não foi possível restaurar o padrão.");
      } else {
        const atualizado = await res.json() as ConteudoDia;
        setDias((prev) => prev.map((d) => (d.data === atualizado.data ? atualizado : d)));
        showMsg("sucesso", "Dia restaurado ao conteúdo padrão.");
        setEditando(false);
      }
    } catch {
      showMsg("erro", "Não foi possível restaurar o padrão.");
    }
    setSalvando(false);
  }

  const previewImagem = (() => {
    if (!editando && diaAtual) return diaAtual.imagemUrl;
    if (imagemUrl.startsWith("blob:")) return imagemUrl;
    if (imagemUrl.startsWith("/objects/")) {
      return diaAtual?.overrideId
        ? `/api/conteudo-dia/imagem/${diaAtual.overrideId}`
        : imagemPadraoDia;
    }
    return imagemUrl || imagemPadraoDia || diaAtual?.imagemUrl || "";
  })();

  const dataRotuloLive = editando
    ? (formatoData === "padrao"
      ? (diaAtual ? rotuloPadrao(diaAtual.data) : "")
      : dataExibicao.trim() || (diaAtual ? rotuloPadrao(diaAtual.data) : ""))
    : (diaAtual?.dataRotulo || (diaAtual ? rotuloPadrao(diaAtual.data) : ""));

  const totalPaginasGaleria = Math.ceil(TOTAL_IMAGENS_DIA / POR_PAGINA);

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
              {editadosNoMes > 0
                ? `${editadosNoMes} dia${editadosNoMes > 1 ? "s" : ""} editado${editadosNoMes > 1 ? "s" : ""} neste mês`
                : "Nenhum dia editado neste mês — tudo no padrão"}
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
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] gap-4">
          <div className="rounded-2xl p-3 sm:p-4" style={CARD}>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DIAS_SEMANA.map((l) => (
                <div key={l} className="text-center text-[10px] tracking-wider py-1 font-semibold" style={{ color: C.muted }}>{l}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: offsetInicio }).map((_, i) => <div key={`empty-${i}`} />)}
              {dias.map((dia) => {
                const num = Number(dia.data.slice(-2));
                const ativo = selecionado === dia.data;
                const ehHoje = dia.data === hojeISO();
                return (
                  <button
                    key={dia.data}
                    type="button"
                    onClick={() => selecionarDia(dia)}
                    className="rounded-xl text-left p-2 min-h-[4.5rem] transition-colors"
                    style={{
                      background: ativo ? "rgba(200,165,107,0.14)" : "rgba(0,0,0,0.18)",
                      border: ativo
                        ? "1.5px solid rgba(200,165,107,0.55)"
                        : ehHoje
                          ? "1px solid rgba(200,165,107,0.35)"
                          : "1px solid rgba(200,165,107,0.1)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-sm font-semibold tabular-nums" style={{ color: ativo ? C.gold : C.text }}>{num}</span>
                      {dia.editado && <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: C.gold }} title="Editado" />}
                    </div>
                    <p className="text-[10px] leading-snug line-clamp-2" style={{ color: "rgba(247,242,236,0.55)" }}>
                      {trecho(dia.frase, 42)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden flex flex-col" style={CARD}>
            {!diaAtual ? (
              <div className="p-8 text-center text-sm" style={{ color: C.muted }}>Selecione um dia no calendário</div>
            ) : (
              <>
                <div className="p-4 border-b" style={{ borderColor: "rgba(200,165,107,0.12)" }}>
                  <p className="text-[10px] tracking-[0.18em] uppercase mb-1" style={{ color: C.muted }}>
                    {diaAtual.dataRotulo || rotuloPadrao(diaAtual.data)}
                    {diaAtual.editado ? " · editado" : " · padrão"}
                  </p>
                  <p className="font-tan-mon-cheri text-lg leading-snug" style={{ color: C.text }}>
                    {trecho(diaAtual.frase, 120)}
                  </p>
                </div>
                <div className="p-4 space-y-3 flex-1">
                  <div>
                    <p className="text-[10px] font-semibold tracking-wider uppercase mb-1" style={{ color: C.muted }}>Reflexão</p>
                    <p className="text-sm leading-relaxed line-clamp-6" style={{ color: "rgba(247,242,236,0.78)" }}>{diaAtual.reflexao}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold tracking-wider uppercase mb-1" style={{ color: C.muted }}>Convite</p>
                    <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "rgba(247,242,236,0.78)" }}>{diaAtual.convite}</p>
                  </div>
                  <button
                    type="button"
                    onClick={iniciarEdicao}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold"
                    style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
                  >
                    <Pencil className="w-4 h-4" />
                    Editar este dia
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Editor: preview esquerda + formulário direita */}
      {editando && diaAtual && (
        <div className="fixed inset-0 z-50 flex" style={{ background: "rgba(10,8,6,0.92)" }}>
          <div className="flex flex-col w-full h-full max-w-6xl mx-auto">
            <div className="flex items-center justify-between gap-3 px-4 py-3 border-b shrink-0" style={{ borderColor: "rgba(200,165,107,0.15)" }}>
              <div>
                <p className="text-[10px] tracking-[0.18em] uppercase" style={{ color: C.muted }}>Editando</p>
                <h3 className="font-tan-mon-cheri text-xl" style={{ color: C.gold }}>
                  {rotuloCurta(diaAtual.data)}/{String(partesData(diaAtual.data).y).slice(2)}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => void restaurarPadrao()}
                  disabled={salvando || !diaAtual.editado}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
                  style={{ border: "1px solid rgba(200,165,107,0.3)", color: C.gold, opacity: !diaAtual.editado || salvando ? 0.4 : 1 }}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restaurar
                </button>
                <button
                  type="button"
                  onClick={() => void salvar()}
                  disabled={salvando}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold"
                  style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208", opacity: salvando ? 0.7 : 1 }}
                >
                  {salvando ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  Salvar
                </button>
                <button type="button" onClick={cancelarEdicao} className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ color: C.muted }}>
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)] gap-6 items-start">
                {/* Esquerda: preview + imagens */}
                <div className="space-y-4 lg:sticky lg:top-0">
                  <div>
                    <p className="text-[10px] tracking-[0.16em] uppercase mb-2 font-semibold" style={{ color: C.muted }}>
                      Pré-visualização ao vivo
                    </p>
                    <PreviewReflexao
                      dataRotulo={dataRotuloLive}
                      frase={frase}
                      reflexao={reflexao}
                      imagem={previewImagem}
                    />
                  </div>

                  <div className="rounded-2xl p-3 space-y-3" style={CARD}>
                    <p className="text-[10px] tracking-[0.16em] uppercase font-semibold" style={{ color: C.muted }}>
                      Imagem do dia
                    </p>
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
                        Padrão
                      </button>
                      <label
                        className="px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
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

                    <div className="flex items-center gap-2 text-[10px]" style={{ color: C.muted }}>
                      <ImageIcon className="w-3.5 h-3.5" />
                      Galeria ({galeriaPagina + 1}/{totalPaginasGaleria})
                    </div>
                    <div className="grid grid-cols-5 gap-1.5">
                      {Array.from({ length: POR_PAGINA }, (_, i) => {
                        const n = galeriaPagina * POR_PAGINA + i + 1;
                        if (n > TOTAL_IMAGENS_DIA) return null;
                        const src = `/imagens-dia/${n}.png`;
                        return (
                          <button
                            key={src}
                            type="button"
                            onClick={() => {
                              setImagemUrl(src);
                              if (fileRef.current) fileRef.current.value = "";
                            }}
                            className="aspect-square rounded-lg overflow-hidden"
                            style={{ outline: imagemUrl === src ? "2px solid #c8a56b" : "1px solid rgba(200,165,107,0.15)" }}
                          >
                            <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex justify-between">
                      <button type="button" disabled={galeriaPagina === 0} onClick={() => setGaleriaPagina((p) => Math.max(0, p - 1))} className="text-xs" style={{ color: galeriaPagina === 0 ? C.dim : C.gold }}>
                        Anterior
                      </button>
                      <button type="button" disabled={galeriaPagina >= totalPaginasGaleria - 1} onClick={() => setGaleriaPagina((p) => Math.min(totalPaginasGaleria - 1, p + 1))} className="text-xs" style={{ color: galeriaPagina >= totalPaginasGaleria - 1 ? C.dim : C.gold }}>
                        Próxima
                      </button>
                    </div>
                  </div>
                </div>

                {/* Direita: textos + formato da data */}
                <div className="space-y-4 rounded-2xl p-4" style={CARD}>
                  <div>
                    <p className="text-[10px] tracking-[0.16em] uppercase font-semibold mb-2" style={{ color: C.muted }}>
                      Formato da data na tela
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {([
                        { key: "padrao" as const, label: `Padrão (${rotuloPadrao(diaAtual.data)})` },
                        { key: "curta" as const, label: `Curta (${rotuloCurta(diaAtual.data)})` },
                        { key: "portal" as const, label: `Portal (${rotuloPortal(diaAtual.data)})` },
                        { key: "personalizado" as const, label: "Personalizado" },
                      ]).map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => aplicarFormato(opt.key, diaAtual.data)}
                          className="px-3 py-2 rounded-xl text-xs font-semibold"
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
                    {(formatoData === "personalizado" || formatoData !== "padrao") && (
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
                    <textarea value={frase} onChange={(e) => setFrase(e.target.value)} rows={4} className="w-full rounded-xl px-3 py-2.5 text-sm resize-y" style={INPUT_ST} />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: C.muted }}>Reflexão</span>
                    <textarea value={reflexao} onChange={(e) => setReflexao(e.target.value)} rows={8} className="w-full rounded-xl px-3 py-2.5 text-sm resize-y" style={INPUT_ST} />
                  </label>
                  <label className="block space-y-1.5">
                    <span className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: C.muted }}>Convite (home)</span>
                    <textarea value={convite} onChange={(e) => setConvite(e.target.value)} rows={4} className="w-full rounded-xl px-3 py-2.5 text-sm resize-y" style={INPUT_ST} />
                  </label>

                  {convite.trim() && (
                    <div className="rounded-xl p-3" style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(200,165,107,0.12)" }}>
                      <p className="text-[10px] font-semibold tracking-wider uppercase mb-1" style={{ color: C.muted }}>Convite na home</p>
                      <p className="text-xs leading-relaxed" style={{ color: "rgba(247,242,236,0.8)" }}>{convite}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
