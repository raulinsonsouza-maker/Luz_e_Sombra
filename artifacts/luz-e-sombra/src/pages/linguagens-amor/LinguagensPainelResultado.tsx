import { Heart } from "lucide-react";
import {
  LABEL_LINGUAGEM,
  type LinguagemAmor,
  type PerfilLinguagemDetalhe,
} from "@workspace/cinco-linguagens-amor";

export type ResultadoLinguagensUi = {
  versao?: string;
  principal?: LinguagemAmor;
  secundaria?: LinguagemAmor;
  sinteseHumana?: string;
  tanqueEmocional?: string;
  perfilPrincipal?: PerfilLinguagemDetalhe;
  perfilSecundario?: PerfilLinguagemDetalhe;
  perfilExpressar?: PerfilLinguagemDetalhe;
  combinacao?: string;
  paraQuemTeAma?: string;
  evitar?: string[];
  recomendacoes?: string[];
  reflexaoAmor?: string;
  perfilEquilibrado?: boolean;
  interpretacaoPar?: string;
  interpretacaoPrincipal?: string;
  desalinhamento?: { ativo?: boolean; texto?: string };
  metricas?: { confianca?: number; alertas?: string[] };
  receber?: {
    principal?: LinguagemAmor;
    secundaria?: LinguagemAmor;
    ranking?: { linguagem?: string; pontos?: number; pct?: number }[];
  };
  expressar?: {
    principal?: LinguagemAmor;
    secundaria?: LinguagemAmor;
    ranking?: { linguagem?: string; pontos?: number; pct?: number }[];
  };
  ranking?: { linguagem?: string; pontos?: number; pct?: number }[];
};

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section
      className="rounded-2xl p-5 space-y-3"
      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,165,107,0.12)" }}
    >
      <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(200,165,107,0.55)" }}>
        {titulo}
      </h2>
      {children}
    </section>
  );
}

function ListaItens({ itens, cor = "rgba(247,242,236,0.65)" }: { itens: string[]; cor?: string }) {
  return (
    <ul className="space-y-2 text-sm leading-relaxed" style={{ color: cor }}>
      {itens.map((item) => (
        <li key={item} className="flex gap-2">
          <span style={{ color: "rgba(200,165,107,0.5)" }}>·</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function PerfilBloco({ perfil, destaque }: { perfil: PerfilLinguagemDetalhe; destaque?: boolean }) {
  return (
    <div className="space-y-3">
      <p className="text-base font-medium" style={{ color: destaque ? "#f7f2ec" : "rgba(247,242,236,0.85)" }}>
        {perfil.label}
      </p>
      <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.6)" }}>
        {perfil.essencia}
      </p>
      <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.55)" }}>
        {perfil.comoSeSenteAmado}
      </p>
      {perfil.comoExpressa && (
        <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.5)" }}>
          <span className="text-[11px] uppercase tracking-wide" style={{ color: "rgba(200,165,107,0.45)" }}>
            Como você demonstra:{" "}
          </span>
          {perfil.comoExpressa}
        </p>
      )}
      {perfil.dialetos.length > 0 && (
        <div>
          <p className="text-[11px] mb-2 uppercase tracking-wide" style={{ color: "rgba(200,165,107,0.45)" }}>
            Formas que mais falam com você
          </p>
          <ListaItens itens={perfil.dialetos} cor="rgba(247,242,236,0.5)" />
        </div>
      )}
    </div>
  );
}

function BarrasRanking({
  ranking,
  destaque,
}: {
  ranking: { linguagem?: string; pontos?: number; pct?: number }[];
  destaque?: LinguagemAmor;
}) {
  return (
    <ul className="space-y-3">
      {ranking.map((row) => {
        const lang = (row.linguagem ?? "") as LinguagemAmor;
        const label = LABEL_LINGUAGEM[lang] ?? row.linguagem;
        const pct = Math.min(100, Math.max(0, row.pct ?? 0));
        return (
          <li key={String(row.linguagem)}>
            <div className="flex justify-between text-xs mb-1" style={{ color: "rgba(247,242,236,0.5)" }}>
              <span>{label}</span>
              <span className="tabular-nums">{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${pct}%`,
                  background:
                    lang === destaque
                      ? "linear-gradient(90deg, #8a6a3e, #c8a56b)"
                      : "rgba(200,165,107,0.35)",
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function isV2(r: ResultadoLinguagensUi): boolean {
  return r.versao === "linguagens_amor_v2" || (!!r.receber && !!r.expressar);
}

export default function LinguagensPainelResultado({
  resultado,
  nomePessoa,
}: {
  resultado: ResultadoLinguagensUi;
  nomePessoa?: string | null;
}) {
  const v2 = isV2(resultado);
  const principal = (v2 ? resultado.receber?.principal : resultado.principal) ?? "";
  const sec = (v2 ? resultado.receber?.secundaria : resultado.secundaria) ?? "";
  const perfilP = resultado.perfilPrincipal;
  const perfilS = resultado.perfilSecundario;
  const perfilE = resultado.perfilExpressar;
  const labelP = LABEL_LINGUAGEM[principal as LinguagemAmor] ?? principal;
  const labelS = LABEL_LINGUAGEM[sec as LinguagemAmor] ?? sec;
  const rankingReceber = v2 ? resultado.receber?.ranking ?? [] : resultado.ranking ?? [];
  const rankingExpressar = v2 ? resultado.expressar?.ranking ?? [] : [];

  return (
    <div className="space-y-5">
      <div
        className="rounded-2xl p-6"
        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(200,165,107,0.2)" }}
      >
        <Heart className="w-10 h-10 mb-4" style={{ color: "#c8a56b" }} />
        {nomePessoa && (
          <p className="text-xs mb-2 uppercase tracking-wide" style={{ color: "rgba(200,165,107,0.5)" }}>
            Perfil de {nomePessoa}
          </p>
        )}
        <h1 className="font-tan-mon-cheri text-2xl mb-2" style={{ color: "#f7f2ec" }}>
          {labelP}
        </h1>
        {sec && principal !== sec && (
          <p className="text-sm mb-3" style={{ color: "rgba(247,242,236,0.5)" }}>
            Com forte influência de {labelS.toLowerCase()}
            {resultado.perfilEquilibrado ? " (perfil bilíngue)" : ""}
          </p>
        )}
        <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.7)" }}>
          {resultado.sinteseHumana ?? resultado.interpretacaoPar ?? resultado.interpretacaoPrincipal ?? ""}
        </p>
        {resultado.tanqueEmocional && (
          <p className="text-sm leading-relaxed mt-3" style={{ color: "rgba(247,242,236,0.55)" }}>
            {resultado.tanqueEmocional}
          </p>
        )}
      </div>

      {!v2 && (
        <Secao titulo="Resultado anterior (v1)">
          <p className="text-sm" style={{ color: "rgba(247,242,236,0.55)" }}>
            Este resultado foi gerado com o questionário antigo. Refaça a análise para ver receber e expressar
            separados, com mais precisão.
          </p>
        </Secao>
      )}

      {v2 && resultado.desalinhamento?.ativo && resultado.desalinhamento.texto && (
        <Secao titulo="Receber vs expressar">
          <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.6)" }}>
            {resultado.desalinhamento.texto}
          </p>
        </Secao>
      )}

      {perfilP && (
        <Secao titulo="Como você se sente amado(a)">
          <PerfilBloco perfil={perfilP} destaque />
        </Secao>
      )}

      {v2 && perfilE && resultado.expressar?.principal !== principal && (
        <Secao titulo="Como você costuma demonstrar amor">
          <PerfilBloco perfil={perfilE} />
        </Secao>
      )}

      {perfilS && principal !== sec && (
        <Secao titulo="Sua segunda linguagem (receber)">
          <PerfilBloco perfil={perfilS} />
        </Secao>
      )}

      {resultado.combinacao && principal !== sec && (
        <Secao titulo="Como as duas se combinam">
          <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.6)" }}>
            {resultado.combinacao}
          </p>
        </Secao>
      )}

      {Array.isArray(resultado.evitar) && resultado.evitar.length > 0 && (
        <Secao titulo="O que mais esvazia seu tanque">
          <ListaItens itens={resultado.evitar} cor="rgba(247,242,236,0.55)" />
        </Secao>
      )}

      {resultado.paraQuemTeAma && (
        <Secao titulo="Para quem te ama">
          <p className="text-sm leading-relaxed" style={{ color: "rgba(247,242,236,0.6)" }}>
            {resultado.paraQuemTeAma}
          </p>
        </Secao>
      )}

      {Array.isArray(resultado.recomendacoes) && resultado.recomendacoes.length > 0 && (
        <Secao titulo="O que você pode fazer já">
          <ListaItens itens={resultado.recomendacoes} />
        </Secao>
      )}

      {rankingReceber.length > 0 && (
        <Secao titulo={v2 ? "Ranking — como você recebe" : "As cinco linguagens no seu perfil"}>
          <BarrasRanking ranking={rankingReceber} destaque={principal as LinguagemAmor} />
        </Secao>
      )}

      {v2 && rankingExpressar.length > 0 && (
        <Secao titulo="Ranking — como você demonstra">
          <BarrasRanking
            ranking={rankingExpressar}
            destaque={(resultado.expressar?.principal ?? "") as LinguagemAmor}
          />
        </Secao>
      )}

      {resultado.metricas?.confianca !== undefined && resultado.metricas.confianca < 80 && (
        <p className="text-xs text-center px-2" style={{ color: "rgba(247,242,236,0.4)" }}>
          Confiança do perfil: {resultado.metricas.confianca}%. Se quiser mais precisão, refaça com calma.
        </p>
      )}

      {resultado.reflexaoAmor && (
        <p className="text-xs leading-relaxed text-center px-2 pb-4" style={{ color: "rgba(247,242,236,0.4)" }}>
          {resultado.reflexaoAmor}
        </p>
      )}
    </div>
  );
}
