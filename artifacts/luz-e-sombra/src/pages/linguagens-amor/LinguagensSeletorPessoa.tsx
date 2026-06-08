import { Plus, User, Users } from "lucide-react";

export type PessoaAnalise = {
  id: number;
  nome: string;
  relacao?: string | null;
};

const RELACOES_SUGERIDAS = [
  "parceiro/a",
  "cônjuge",
  "filho/a",
  "pai",
  "mãe",
  "familiar",
  "amigo/a",
  "outro",
];

export default function LinguagensSeletorPessoa({
  pessoas,
  selectedPessoaId,
  onSelect,
  showAdd,
  onToggleAdd,
  addNome,
  onAddNome,
  addRelacao,
  onAddRelacao,
  onAdd,
  addErro,
}: {
  pessoas: PessoaAnalise[];
  selectedPessoaId: number | null;
  onSelect: (id: number | null) => void;
  showAdd: boolean;
  onToggleAdd: () => void;
  addNome: string;
  onAddNome: (v: string) => void;
  addRelacao: string;
  onAddRelacao: (v: string) => void;
  onAdd: () => void;
  addErro: string | null;
}) {
  const pessoaAtiva = selectedPessoaId !== null ? pessoas.find((p) => p.id === selectedPessoaId) : null;

  return (
    <div className="mb-6">
      <p className="text-xs tracking-[0.2em] uppercase mb-1 flex items-center gap-2" style={{ color: "rgba(200,165,107,0.5)" }}>
        <Users className="w-3.5 h-3.5" /> Analisando
      </p>
      <p className="text-sm mb-3" style={{ color: "rgba(247,242,236,0.55)" }}>
        Perfil ativo:{" "}
        <span style={{ color: "#c8a56b" }}>{pessoaAtiva ? pessoaAtiva.nome : "Você"}</span>
        <span className="text-xs ml-2 opacity-60">(dados isolados por pessoa)</span>
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="flex-shrink-0 px-4 py-3 rounded-2xl flex flex-col items-center gap-1 min-w-[78px] transition-all"
          style={
            selectedPessoaId === null
              ? { background: "rgba(200,165,107,0.15)", border: "1.5px solid rgba(200,165,107,0.5)", color: "#c8a56b" }
              : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.12)", color: "rgba(247,242,236,0.4)" }
          }
        >
          <User className="w-5 h-5" />
          <span className="text-xs font-medium">Eu</span>
        </button>
        {pessoas.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p.id)}
            className="flex-shrink-0 px-4 py-3 rounded-2xl flex flex-col items-center gap-1 min-w-[78px] transition-all"
            style={
              selectedPessoaId === p.id
                ? { background: "rgba(200,165,107,0.15)", border: "1.5px solid rgba(200,165,107,0.5)", color: "#c8a56b" }
                : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.12)", color: "rgba(247,242,236,0.4)" }
            }
          >
            <Users className="w-5 h-5" />
            <span className="text-xs font-medium truncate max-w-[66px]">{p.nome.split(" ")[0]}</span>
            <span className="text-[10px] opacity-60 truncate max-w-[66px]">{p.relacao || "outro"}</span>
          </button>
        ))}
        {pessoas.length < 6 && (
          <button
            type="button"
            onClick={onToggleAdd}
            className="flex-shrink-0 px-4 py-3 rounded-2xl flex flex-col items-center gap-1 min-w-[78px] transition-all"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(200,165,107,0.25)", color: "rgba(200,165,107,0.4)" }}
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs">Adicionar</span>
          </button>
        )}
      </div>
      {showAdd && (
        <div
          className="mt-3 p-4 rounded-xl space-y-3"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(200,165,107,0.12)" }}
        >
          <input
            type="text"
            placeholder="Nome"
            value={addNome}
            onChange={(e) => onAddNome(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm bg-transparent"
            style={{ border: "1px solid rgba(200,165,107,0.2)", color: "#f7f2ec" }}
          />
          <select
            value={addRelacao}
            onChange={(e) => onAddRelacao(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm bg-transparent"
            style={{ border: "1px solid rgba(200,165,107,0.2)", color: "#f7f2ec" }}
          >
            {RELACOES_SUGERIDAS.map((r) => (
              <option key={r} value={r} style={{ background: "#1e1812" }}>
                {r}
              </option>
            ))}
          </select>
          {addErro && <p className="text-xs text-red-400/90">{addErro}</p>}
          <button
            type="button"
            onClick={onAdd}
            className="w-full py-2 rounded-lg text-sm font-semibold"
            style={{ background: "rgba(200,165,107,0.2)", color: "#c8a56b" }}
          >
            Guardar pessoa
          </button>
        </div>
      )}
    </div>
  );
}
