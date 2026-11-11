import { useMemo, useState } from "react";
import { INDEXABLE_ROUTES, SITE_URL } from "@/lib/seo";
import { ARTICLES } from "@/content/artigos";
import { C, CARD, INPUT_ST, type ShowMsg } from "./shared";

const STORAGE_KEY = "geo_ai_mentions_v1";
const CRAWLER_LOG_KEY = "geo_crawler_hits_v1";

interface AiMention {
  id: string;
  pergunta: string;
  plataforma: string;
  data: string;
  marcaMencionada: boolean;
  portalRecomendado: boolean;
  urlCitada: string;
  concorrentes: string;
  observacoes: string;
  evidencia: string;
}

function loadMentions(): AiMention[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as AiMention[];
  } catch {
    return [];
  }
}

function saveMentions(items: AiMention[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function GeoIntelligenceTab({ showMsg }: { showMsg: ShowMsg }) {
  const [mentions, setMentions] = useState<AiMention[]>(() => loadMentions());
  const [form, setForm] = useState({
    pergunta: "",
    plataforma: "ChatGPT",
    data: new Date().toISOString().slice(0, 10),
    marcaMencionada: false,
    portalRecomendado: false,
    urlCitada: "",
    concorrentes: "",
    observacoes: "",
    evidencia: "",
  });

  const publicUrls = useMemo(() => {
    const blogs = ARTICLES.map((a) => a.path);
    return [...INDEXABLE_ROUTES.map((r) => r.path), ...blogs];
  }, []);

  const byPlatform = useMemo(() => {
    const map: Record<string, { total: number; mencoes: number; recomendacoes: number }> = {};
    for (const m of mentions) {
      if (!map[m.plataforma]) map[m.plataforma] = { total: 0, mencoes: 0, recomendacoes: 0 };
      map[m.plataforma].total += 1;
      if (m.marcaMencionada) map[m.plataforma].mencoes += 1;
      if (m.portalRecomendado) map[m.plataforma].recomendacoes += 1;
    }
    return map;
  }, [mentions]);

  function addMention() {
    if (!form.pergunta.trim()) {
      showMsg("erro", "Informe a pergunta monitorada.");
      return;
    }
    const next: AiMention = {
      id: crypto.randomUUID(),
      ...form,
      pergunta: form.pergunta.trim(),
    };
    const items = [next, ...mentions];
    setMentions(items);
    saveMentions(items);
    showMsg("sucesso", "Registro GEO salvo localmente (estimativa/manual — não é API oficial).");
    setForm((f) => ({ ...f, pergunta: "", urlCitada: "", concorrentes: "", observacoes: "", evidencia: "" }));
  }

  async function notifyIndexNow() {
    const key = (import.meta.env.VITE_INDEXNOW_KEY as string | undefined)?.trim();
    if (!key) {
      showMsg("erro", "Defina VITE_INDEXNOW_KEY no ambiente para notificar o IndexNow.");
      return;
    }
    const host = SITE_URL.replace(/^https?:\/\//, "");
    const urlList = publicUrls.map((p) => (p === "/" ? SITE_URL : `${SITE_URL}${p}`));
    try {
      const res = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host,
          key,
          keyLocation: `${SITE_URL}/${key}.txt`,
          urlList: urlList.slice(0, 100),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showMsg("sucesso", "IndexNow notificado (submissão ≠ indexação confirmada).");
    } catch (e) {
      showMsg("erro", `Falha IndexNow: ${e instanceof Error ? e.message : "erro"}`);
    }
  }

  return (
    <div className="space-y-8">
      <div style={CARD} className="rounded-2xl p-5">
        <h2 className="text-lg font-semibold" style={{ color: C.gold }}>
          GEO Intelligence
        </h2>
        <p className="mt-2 text-sm" style={{ color: C.muted }}>
          Dados abaixo misturam <strong style={{ color: C.text }}>fatos locais</strong> (URLs do registry) e{" "}
          <strong style={{ color: C.text }}>registros manuais</strong> de visibilidade em IA. Não inventamos resultados de
          crawlers nem scrapamos interfaces de ChatGPT/Gemini/Claude/Perplexity.
        </p>
      </div>

      <section style={CARD} className="rounded-2xl p-5">
        <h3 className="font-medium" style={{ color: C.gold }}>
          A. Crawlers
        </h3>
        <p className="mt-2 text-sm" style={{ color: C.muted }}>
          Política robots: Allow para Googlebot, Bingbot, OAI-SearchBot, GPTBot, Claude-SearchBot, ClaudeBot, PerplexityBot
          em páginas públicas. Disallow apenas área logada, APIs e funil sensível. Contagem real de hits deve vir de logs
          nginx/CDN — valide IP/assinatura oficial antes de tratar UA como autêntico.
        </p>
        <p className="mt-2 text-xs" style={{ color: C.dim }}>
          Log local opcional em <code>{CRAWLER_LOG_KEY}</code> (ainda sem ingest automático).
        </p>
      </section>

      <section style={CARD} className="rounded-2xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-medium" style={{ color: C.gold }}>
            B. Indexação (registry local)
          </h3>
          <button
            type="button"
            onClick={notifyIndexNow}
            className="rounded-xl px-3 py-2 text-sm font-medium"
            style={{ background: C.gold, color: "#1e1812" }}
          >
            Notificar IndexNow (até 100 URLs)
          </button>
        </div>
        <p className="mt-2 text-sm" style={{ color: C.muted }}>
          {publicUrls.length} URLs públicas no código. Submissão no GSC/Bing/IndexNow não confirma indexação.
        </p>
        <ul className="mt-4 max-h-64 overflow-auto text-sm space-y-1" style={{ color: C.text }}>
          {publicUrls.map((u) => (
            <li key={u}>
              <a href={u === "/" ? SITE_URL : `${SITE_URL}${u}`} target="_blank" rel="noreferrer" style={{ color: C.gold }}>
                {u}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section style={CARD} className="rounded-2xl p-5">
        <h3 className="font-medium" style={{ color: C.gold }}>
          C. Visibilidade em IA (manual)
        </h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            style={INPUT_ST}
            className="rounded-lg px-3 py-2 md:col-span-2"
            placeholder="Pergunta monitorada"
            value={form.pergunta}
            onChange={(e) => setForm({ ...form, pergunta: e.target.value })}
          />
          <select
            style={INPUT_ST}
            className="rounded-lg px-3 py-2"
            value={form.plataforma}
            onChange={(e) => setForm({ ...form, plataforma: e.target.value })}
          >
            {["ChatGPT", "Gemini", "Claude", "Perplexity", "Google AI Overviews", "Copilot"].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <input
            type="date"
            style={INPUT_ST}
            className="rounded-lg px-3 py-2"
            value={form.data}
            onChange={(e) => setForm({ ...form, data: e.target.value })}
          />
          <label className="flex items-center gap-2 text-sm" style={{ color: C.text }}>
            <input
              type="checkbox"
              checked={form.marcaMencionada}
              onChange={(e) => setForm({ ...form, marcaMencionada: e.target.checked })}
            />
            Marca mencionada?
          </label>
          <label className="flex items-center gap-2 text-sm" style={{ color: C.text }}>
            <input
              type="checkbox"
              checked={form.portalRecomendado}
              onChange={(e) => setForm({ ...form, portalRecomendado: e.target.checked })}
            />
            Portal recomendado?
          </label>
          <input
            style={INPUT_ST}
            className="rounded-lg px-3 py-2"
            placeholder="URL citada"
            value={form.urlCitada}
            onChange={(e) => setForm({ ...form, urlCitada: e.target.value })}
          />
          <input
            style={INPUT_ST}
            className="rounded-lg px-3 py-2"
            placeholder="Concorrentes mencionados"
            value={form.concorrentes}
            onChange={(e) => setForm({ ...form, concorrentes: e.target.value })}
          />
          <input
            style={INPUT_ST}
            className="rounded-lg px-3 py-2 md:col-span-2"
            placeholder="Evidência / link da resposta"
            value={form.evidencia}
            onChange={(e) => setForm({ ...form, evidencia: e.target.value })}
          />
          <textarea
            style={INPUT_ST}
            className="rounded-lg px-3 py-2 md:col-span-2 min-h-[80px]"
            placeholder="Observações"
            value={form.observacoes}
            onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
          />
        </div>
        <button
          type="button"
          onClick={addMention}
          className="mt-4 rounded-xl px-4 py-2 text-sm font-medium"
          style={{ background: "rgba(200,165,107,0.2)", color: C.gold, border: "1px solid rgba(200,165,107,0.35)" }}
        >
          Salvar registro
        </button>

        <div className="mt-6 overflow-auto">
          <table className="w-full text-left text-sm">
            <thead style={{ color: C.muted }}>
              <tr>
                <th className="py-2">Data</th>
                <th>Plataforma</th>
                <th>Pergunta</th>
                <th>Menção</th>
                <th>Rec.</th>
              </tr>
            </thead>
            <tbody style={{ color: C.text }}>
              {mentions.map((m) => (
                <tr key={m.id} className="border-t border-[rgba(200,165,107,0.12)]">
                  <td className="py-2">{m.data}</td>
                  <td>{m.plataforma}</td>
                  <td className="max-w-xs truncate">{m.pergunta}</td>
                  <td>{m.marcaMencionada ? "sim" : "não"}</td>
                  <td>{m.portalRecomendado ? "sim" : "não"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section style={CARD} className="rounded-2xl p-5">
        <h3 className="font-medium" style={{ color: C.gold }}>
          D. Relatórios (manual)
        </h3>
        <ul className="mt-3 space-y-2 text-sm" style={{ color: C.text }}>
          {Object.entries(byPlatform).map(([p, s]) => (
            <li key={p}>
              {p}: {s.total} consultas · {s.mencoes} menções · {s.recomendacoes} recomendações
            </li>
          ))}
          {Object.keys(byPlatform).length === 0 ? (
            <li style={{ color: C.muted }}>Sem registros ainda — adicione consultas manuais acima.</li>
          ) : null}
        </ul>
      </section>
    </div>
  );
}
