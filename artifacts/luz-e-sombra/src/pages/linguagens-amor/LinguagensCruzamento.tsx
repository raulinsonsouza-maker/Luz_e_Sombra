import { useState } from "react";
import { HeartHandshake, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/auth";
import { LABEL_LINGUAGEM, type LinguagemAmor } from "@workspace/cinco-linguagens-amor";
import type { PessoaAnalise } from "./LinguagensSeletorPessoa";

type CompatResult = {
  pontuacaoCompatibilidade?: number;
  resumoHumano?: string;
  pontesParaA?: string[];
  pontesParaB?: string[];
};

const LINGUAGENS: LinguagemAmor[] = ["palavras", "tempo", "presentes", "servicos", "toque"];

export default function LinguagensCruzamento({
  pessoas,
  historicoIds,
  onFechar,
}: {
  pessoas: PessoaAnalise[];
  historicoIds: Set<number>;
  onFechar: () => void;
}) {
  const [modo, setModo] = useState<"pessoa" | "manual">("pessoa");
  const [pessoaId, setPessoaId] = useState<number | null>(null);
  const [manualNome, setManualNome] = useState("");
  const [manualExpressar, setManualExpressar] = useState<LinguagemAmor>("palavras");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [resultado, setResultado] = useState<CompatResult | null>(null);

  const pessoasComAnalise = pessoas.filter((p) => historicoIds.has(p.id));

  async function calcular() {
    setErro(null);
    setCarregando(true);
    setResultado(null);
    try {
      const body =
        modo === "pessoa" && pessoaId
          ? { pessoaIdOutro: pessoaId }
          : {
              manual: {
                nome: manualNome.trim() || "Outra pessoa",
                principalExpressar: manualExpressar,
              },
            };
      const res = await apiFetch("/linguagens-amor/compatibilidade", {
        method: "POST",
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErro((data as { error?: string }).error ?? "Erro ao calcular.");
        return;
      }
      setResultado(data as CompatResult);
    } catch {
      setErro("Falha de rede.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div
      className="rounded-2xl p-5 space-y-4"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,165,107,0.18)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-5 h-5" style={{ color: "#c8a56b" }} />
          <h2 className="text-sm font-semibold" style={{ color: "#f7f2ec" }}>
            Cruzar com alguém
          </h2>
        </div>
        <button type="button" onClick={onFechar} className="text-xs" style={{ color: "rgba(200,165,107,0.6)" }}>
          Fechar
        </button>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setModo("pessoa")}
          className="flex-1 py-2 rounded-lg text-xs font-medium"
          style={{
            background: modo === "pessoa" ? "rgba(200,165,107,0.15)" : "rgba(255,255,255,0.03)",
            color: modo === "pessoa" ? "#c8a56b" : "rgba(247,242,236,0.45)",
          }}
        >
          Pessoa com análise
        </button>
        <button
          type="button"
          onClick={() => setModo("manual")}
          className="flex-1 py-2 rounded-lg text-xs font-medium"
          style={{
            background: modo === "manual" ? "rgba(200,165,107,0.15)" : "rgba(255,255,255,0.03)",
            color: modo === "manual" ? "#c8a56b" : "rgba(247,242,236,0.45)",
          }}
        >
          Modo manual
        </button>
      </div>

      {modo === "pessoa" ? (
        pessoasComAnalise.length === 0 ? (
          <p className="text-sm" style={{ color: "rgba(247,242,236,0.45)" }}>
            Adicione uma pessoa e faça a análise dela para cruzar perfis completos.
          </p>
        ) : (
          <select
            value={pessoaId ?? ""}
            onChange={(e) => setPessoaId(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3 py-2 rounded-lg text-sm bg-transparent"
            style={{ border: "1px solid rgba(200,165,107,0.2)", color: "#f7f2ec" }}
          >
            <option value="" style={{ background: "#1e1812" }}>
              Escolha uma pessoa
            </option>
            {pessoasComAnalise.map((p) => (
              <option key={p.id} value={p.id} style={{ background: "#1e1812" }}>
                {p.nome}
              </option>
            ))}
          </select>
        )
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Nome (ex.: cônjuge)"
            value={manualNome}
            onChange={(e) => setManualNome(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm bg-transparent"
            style={{ border: "1px solid rgba(200,165,107,0.2)", color: "#f7f2ec" }}
          />
          <select
            value={manualExpressar}
            onChange={(e) => setManualExpressar(e.target.value as LinguagemAmor)}
            className="w-full px-3 py-2 rounded-lg text-sm bg-transparent"
            style={{ border: "1px solid rgba(200,165,107,0.2)", color: "#f7f2ec" }}
          >
            {LINGUAGENS.map((l) => (
              <option key={l} value={l} style={{ background: "#1e1812" }}>
                Demonstra amor em: {LABEL_LINGUAGEM[l]}
              </option>
            ))}
          </select>
        </div>
      )}

      {erro && <p className="text-xs text-red-400/90">{erro}</p>}

      <button
        type="button"
        disabled={carregando || (modo === "pessoa" && !pessoaId)}
        onClick={() => void calcular()}
        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, #c8a56b, #9c7742)", color: "#1a1208" }}
      >
        {carregando ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Ver compatibilidade
      </button>

      {resultado && (
        <div className="space-y-3 pt-2">
          {resultado.pontuacaoCompatibilidade !== undefined && (
            <p className="text-sm font-medium" style={{ color: "#c8a56b" }}>
              Compatibilidade: {resultado.pontuacaoCompatibilidade}%
            </p>
          )}
          {resultado.resumoHumano && (
            <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.65)" }}>
              {resultado.resumoHumano}
            </p>
          )}
          {Array.isArray(resultado.pontesParaA) && resultado.pontesParaA.length > 0 && (
            <div>
              <p className="text-[11px] uppercase mb-2" style={{ color: "rgba(200,165,107,0.45)" }}>
                Pontes para você
              </p>
              <ul className="space-y-1 text-sm" style={{ color: "rgba(247,242,236,0.55)" }}>
                {resultado.pontesParaA.map((p) => (
                  <li key={p}>· {p}</li>
                ))}
              </ul>
            </div>
          )}
          {Array.isArray(resultado.pontesParaB) && resultado.pontesParaB.length > 0 && (
            <div>
              <p className="text-[11px] uppercase mb-2" style={{ color: "rgba(200,165,107,0.45)" }}>
                Pontes para o outro
              </p>
              <ul className="space-y-1 text-sm" style={{ color: "rgba(247,242,236,0.55)" }}>
                {resultado.pontesParaB.map((p) => (
                  <li key={p}>· {p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
