import { useState, useEffect } from "react";
import { Loader2, Search, MessageSquare, Reply } from "lucide-react";
import { apiFetch } from "@/lib/auth";
import { toastApiError } from "@/lib/apiError";
import { CARD, CARD_S, INPUT_ST, C, timeAgo, type ComentarioEngajamento } from "./shared";

export function EngajamentoTab({ showMsg }: { showMsg: (t: "sucesso" | "erro", msg: string) => void }) {
  const [itens, setItens] = useState<ComentarioEngajamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [somenteOportunidades, setSomenteOportunidades] = useState(false);
  const [respondendoId, setRespondendoId] = useState<number | null>(null);
  const [textoResposta, setTextoResposta] = useState("");
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
    const texto = textoResposta.trim();
    if (!texto) return;
    setEnviandoId(item.id);
    try {
      const res = await apiFetch(`/comunidade/${item.publicacaoId}/comentarios`, {
        method: "POST",
        body: JSON.stringify({
          conteudo: `@${item.autorNome} ${texto}`,
          parentComentarioId: item.id,
        }),
      });
      if (res.ok) {
        showMsg("sucesso", "Resposta enviada.");
        setRespondendoId(null);
        setTextoResposta("");
        await buscarComentarios();
      } else {
        const d = await res.json().catch(() => ({}));
        showMsg("erro", (d as { error?: string }).error ?? "Erro ao responder");
      }
    } catch {
      showMsg("erro", "Erro ao responder");
    }
    setEnviandoId(null);
  }

  const filtrados = itens.filter((it) => {
    if (it.autorAdmin) return false;
    const q = busca.trim().toLowerCase();
    if (somenteOportunidades && !ehLead(it.conteudo)) return false;
    if (!q) return true;
    return (
      it.autorNome.toLowerCase().includes(q) ||
      it.conteudo.toLowerCase().includes(q) ||
      (it.publicacaoConteudo || "").toLowerCase().includes(q)
    );
  });

  const oportunidades = filtrados.filter((it) => ehLead(it.conteudo)).length;

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[12rem]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: C.muted }} />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none"
            style={INPUT_ST}
            placeholder="Buscar"
          />
        </div>
        <button
          type="button"
          onClick={() => setSomenteOportunidades((v) => !v)}
          className="px-3 py-2.5 rounded-xl text-xs font-semibold"
          style={
            somenteOportunidades
              ? { background: "rgba(74,222,128,0.12)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.25)" }
              : { background: "rgba(200,165,107,0.08)", color: C.muted, border: "1px solid rgba(200,165,107,0.2)" }
          }
        >
          Oportunidades{oportunidades > 0 ? ` · ${oportunidades}` : ""}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: C.gold }} />
        </div>
      ) : filtrados.length === 0 ? (
        <div className="text-center py-12 rounded-2xl" style={CARD}>
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-20" style={{ color: C.gold }} />
          <p className="text-sm" style={{ color: C.muted }}>Nenhum comentário.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtrados.map((it) => {
            const lead = ehLead(it.conteudo);
            const aberto = respondendoId === it.id;
            return (
              <div key={it.id} className="rounded-2xl p-4 space-y-3" style={CARD_S}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold" style={{ color: C.text }}>
                        {it.autorNome}
                      </span>
                      {lead && (
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: "rgba(74,222,128,0.12)", color: "#4ade80" }}
                        >
                          Lead
                        </span>
                      )}
                      <span className="text-xs" style={{ color: C.dim }}>
                        {timeAgo(it.criadoEm)}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.88)" }}>
                      {it.conteudo}
                    </p>
                    {it.publicacaoConteudo?.trim() && (
                      <p className="text-xs mt-2 line-clamp-1" style={{ color: C.dim }}>
                        no post: {it.publicacaoConteudo.trim()}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (aberto) {
                        setRespondendoId(null);
                        setTextoResposta("");
                      } else {
                        setRespondendoId(it.id);
                        setTextoResposta("");
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0"
                    style={{ border: "1px solid rgba(200,165,107,0.25)", color: C.gold }}
                  >
                    <Reply className="w-3.5 h-3.5" />
                    Responder
                  </button>
                </div>

                {aberto && (
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      value={textoResposta}
                      onChange={(e) => setTextoResposta(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          void responder(it);
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-xl text-sm outline-none"
                      style={INPUT_ST}
                      placeholder={`Responder ${it.autorNome}`}
                    />
                    <button
                      type="button"
                      onClick={() => void responder(it)}
                      disabled={enviandoId === it.id || !textoResposta.trim()}
                      className="px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
                    >
                      {enviandoId === it.id ? "…" : "Enviar"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
