import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../lib/authMiddleware";
import { db, fotosTracoTable, analiseTracoTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { ObjectStorageService } from "../lib/objectStorage";
import OpenAI from "openai";

const router = Router();
const objectStorage = new ObjectStorageService();

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? "dummy",
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const TIPOS_FOTO = ["rosto", "corpo-frente", "corpo-lado"] as const;
type TipoFoto = (typeof TIPOS_FOTO)[number];

const SYSTEM_PROMPT = `Você é um especialista em Análise do Traço de Caráter baseado na Bioenergética de Alexander Lowen, na Análise do Caráter de Wilhelm Reich e na Abordagem Corporal do Traço de Caráter conforme desenvolvida no Brasil.

Sua tarefa é analisar fotos de uma pessoa e identificar, através das características físicas e posturais do corpo, a porcentagem de cada estrutura de caráter presente nessa pessoa.

## AS 5 ESTRUTURAS DE CARÁTER E SEUS MARCADORES FÍSICOS

### 1. ESTRUTURA ESQUIZÓIDE
Ferida fundamental: Terror existencial, medo de ser destruído, sentir que não tem direito de existir.
Marcadores corporais:
- Corpo fragmentado com desconexão visível entre metade superior e inferior
- Assimetrias marcantes entre os dois lados do corpo
- Ombros contraídos, levantados ou voltados para dentro
- Peito pequeno, estreito ou retraído
- Pelve retraída para trás ou desengajada do tronco
- Constituição geralmente ectomorfa (magro, delgado, pouco volume)
- Braços e pernas finos, subdesenvolvidos em musculatura
- Cabeça pode parecer proporcionalmente maior ao restante do corpo
- Olhos com qualidade distante, "ausente", levemente desfocados ou que parecem olhar para dentro
- Corpo parece não habitado por completo; sensação visual de fragmentação
- Postura: corpo dobra-se em vários pontos criando quebras na continuidade visual

### 2. ESTRUTURA ORAL
Ferida fundamental: Abandono, privação, necessidades não atendidas na primeira infância.
Marcadores corporais:
- Peito colapsado, afundado para dentro (esterno cede)
- Tonus muscular muito baixo generalizado — corpo sem firmeza, mole
- Postura curvada, "caída" — tudo parece pender para baixo
- Frequentemente magro ou abaixo do peso; ou com acúmulo de gordura pontual por compensação oral
- Pernas arqueadas (genu varo) ou joelhos valgos
- Pés planos ou pouco enraizamento (pouco contato firme com o chão)
- Parte superior do corpo inclina-se para frente e para baixo
- Corpo parece sem vitalidade ou energia visível
- Face com traços caídos, expressão de tristeza suave, melancolia ou necessidade
- Musculatura sem definição mesmo em pessoas não obesas

### 3. ESTRUTURA PSICOPATA / NARCISISTA
Ferida fundamental: Traição, vontade violada, manipulação sofrida na infância.
Marcadores corporais:
- Desproporcionalidade marcante: parte superior do corpo hiperdesenvolvida vs inferior subdesenvolvida
- Peito puffado, inflado, empurrado para frente e para cima
- Cabeça erguida, queixo levemente elevado, olhar dominante e penetrante
- Pescoço forte e grosso
- Ombros muito largos e desenvolvidos
- Quadril e pernas estreitos ou subdesenvolvidos relativamente à parte superior
- Grande tensão no dorso superior, especialmente entre as escápulas
- Energia concentrada e visível acima da cintura
- Olhar intenso, penetrante, de comando
- Gestos expansivos, ocupa muito espaço
- Visual de poder e autoridade a partir da cintura para cima

### 4. ESTRUTURA MASOQUISTA
Ferida fundamental: Humilhação, vontade quebrada por pressão contínua, sufocamento emocional.
Marcadores corporais:
- Corpo comprimido, encurtado no todo (parece prensado verticalmente)
- Pescoço curto e grosso (parece quase inexistente ou muito curto)
- Tronco largo, em barril, que parece estar sendo pressionado para baixo
- Ombros puxados para baixo e levemente para dentro
- Pelve encaixada (tucked under) ou rigidamente bloqueada
- Tensão intensa em quadris, coxas superiores e região glútea
- Musculatura densa e forte mas cronicamente contraída e presa
- Aparência comprimida independente da estatura
- Face com expressão de sofrimento contido, resignação ou esforço permanente
- Corpo forte mas preso, sem expansão; mola sempre comprimida

### 5. ESTRUTURA RÍGIDA (inclui variante Histérica/Histeroide)
Ferida fundamental: Desilusão amorosa, coração bloqueado, amor que foi punido.
Marcadores corporais:
- Postura ereta, bem proporcionada, "correta" — parece saída de manual de postura
- Bom tônus muscular generalizado (aparência atlética ou bem cuidada)
- Movimentos controlados, precisos, organizados
- Peito erguido mas com rigidez/contenção no coração
- Ombros para trás, cabeça erguida adequadamente
- Corpo organizado mas com couraça invisível — há uma tensão de "segurar tudo"
- Proporções equilibradas e limpas (sem hipertrofia em parte específica)
- Mandíbula pode estar tensa, cerrada, controlada
- Olhos brilhantes mas com "véu" emocional — a emoção está presente mas controlada
- Aparência de "estar bem", composto, apresentável
- Variante Histérica: contornos mais curvados/exagerados, quadris proeminentes, expressividade corporal maior, maior sensualidade no corpo, movimentos mais fluidos e provocadores

## INSTRUÇÕES DE ANÁLISE

Analise TODAS as fotos fornecidas com atenção minuciosa. Observe especialmente:
- Proporções corporais (superior vs inferior, largura vs altura)
- Qualidade do tônus muscular visível
- Postura e alinhamento geral
- Onde a tensão se concentra no corpo
- Olhar e expressão facial
- Como o corpo "habita" o espaço

Retorne SOMENTE um JSON válido, sem texto adicional antes ou depois, neste formato exato:
{
  "estruturas": {
    "esquizoide": <número inteiro 0-100>,
    "oral": <número inteiro 0-100>,
    "psicopata": <número inteiro 0-100>,
    "masoquista": <número inteiro 0-100>,
    "rigido": <número inteiro 0-100>
  },
  "estruturaPrincipal": "<esquizoide|oral|psicopata|masoquista|rigido>",
  "estruturaSecundaria": "<esquizoide|oral|psicopata|masoquista|rigido>",
  "observacoesPorFoto": {
    "rosto": "<observações da foto do rosto: qualidade do olhar, tensão facial, assimetrias, expressão>",
    "corpo-frente": "<observações da frente: proporções, postura, distribuição de massa, ombros, peito, quadril, pernas>",
    "corpo-lado": "<observações do perfil: projeções, curvatura da coluna, posição do peito e pelve, alinhamento>"
  },
  "padraoPostural": "<descrição objetiva do padrão postural dominante desta pessoa em 2-3 frases>",
  "caracteristicasFisicasObservadas": ["<característica física observada 1>", "<característica física observada 2>", "<...>"],
  "interpretacao": "<narrativa rica e compassiva em 4-5 parágrafos: como essa combinação de estruturas forma quem essa pessoa é; como isso se manifesta em relacionamentos, trabalho e vida interior; quais são as forças e os desafios desta combinação; o que essa combinação tem de único e poderoso>",
  "centroEnergetico": "<onde a energia está prioritariamente concentrada neste corpo: ex. 'cabeça e ombros', 'tórax superior', 'tronco como um todo', etc.>",
  "padraoEnergetico": "<como a energia flui — ou onde encontra bloqueios — neste corpo específico, em 2 frases>",
  "mensagemTerapeutica": "<uma mensagem de acolhimento, cuidado e esperança para esta pessoa, baseada no seu traço de caráter específico. Compassiva, sem julgamento, que honre a jornada desta pessoa.>"
}

REGRAS OBRIGATÓRIAS:
- As 5 porcentagens em "estruturas" DEVEM somar exatamente 100
- Nenhuma estrutura pode ter valor negativo ou zero a menos que seja claramente ausente
- Se uma foto de determinado tipo não estiver disponível, indique "Foto não fornecida" no campo correspondente
- Baseie-se SOMENTE em características físicas e posturais visíveis
- Seja preciso, respeitoso e absolutamente compassivo
- NUNCA faça julgamentos sobre beleza, atratividade ou valor estético
- Foque exclusivamente nos marcadores bioenergéticos e posturais do caráter`;

// ── GET /traco/fotos — list photos ────────────────────────────────────────────
router.get("/fotos", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const fotos = await db
      .select()
      .from(fotosTracoTable)
      .where(eq(fotosTracoTable.usuarioId, req.user!.id));
    return res.json(fotos);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao buscar fotos" });
  }
});

// ── POST /traco/fotos/upload-url — request presigned URL ─────────────────────
router.post("/fotos/upload-url", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { tipo } = req.body as { tipo: TipoFoto };
    if (!TIPOS_FOTO.includes(tipo)) {
      return res.status(400).json({ error: "Tipo de foto inválido. Use: rosto, corpo-frente ou corpo-lado" });
    }
    const uploadURL = await objectStorage.getObjectEntityUploadURL();
    const objectPath = objectStorage.normalizeObjectEntityPath(uploadURL);
    return res.json({ uploadURL, objectPath });
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao gerar URL de upload" });
  }
});

// ── POST /traco/fotos — save photo metadata ───────────────────────────────────
router.post("/fotos", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { tipo, objectPath } = req.body as { tipo: TipoFoto; objectPath: string };
    if (!TIPOS_FOTO.includes(tipo)) {
      return res.status(400).json({ error: "Tipo de foto inválido" });
    }
    if (!objectPath?.startsWith("/objects/")) {
      return res.status(400).json({ error: "objectPath inválido" });
    }

    // Delete existing photo of this type
    await db
      .delete(fotosTracoTable)
      .where(and(eq(fotosTracoTable.usuarioId, req.user!.id), eq(fotosTracoTable.tipo, tipo)));

    const [foto] = await db
      .insert(fotosTracoTable)
      .values({ usuarioId: req.user!.id, tipo, objectPath })
      .returning();

    return res.json(foto);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao salvar foto" });
  }
});

// ── DELETE /traco/fotos/:id — delete a photo ──────────────────────────────────
router.delete("/fotos/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [foto] = await db
      .select()
      .from(fotosTracoTable)
      .where(and(eq(fotosTracoTable.id, id), eq(fotosTracoTable.usuarioId, req.user!.id)));
    if (!foto) return res.status(404).json({ error: "Foto não encontrada" });

    await db.delete(fotosTracoTable).where(eq(fotosTracoTable.id, id));
    return res.json({ ok: true });
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao remover foto" });
  }
});

// ── GET /traco/fotos/:id/view — proxy photo from GCS ─────────────────────────
router.get("/fotos/:id/view", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [foto] = await db
      .select()
      .from(fotosTracoTable)
      .where(and(eq(fotosTracoTable.id, id), eq(fotosTracoTable.usuarioId, req.user!.id)));
    if (!foto) return res.status(404).json({ error: "Foto não encontrada" });

    const file = await objectStorage.getObjectEntityFile(foto.objectPath);
    const response = await objectStorage.downloadObject(file, 3600);
    const buffer = Buffer.from(await response.arrayBuffer());
    res.set("Content-Type", response.headers.get("content-type") || "image/jpeg");
    res.set("Cache-Control", "private, max-age=3600");
    return res.send(buffer);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao carregar foto" });
  }
});

// ── POST /traco/analisar — run AI analysis ────────────────────────────────────
router.post("/analisar", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const fotos = await db
      .select()
      .from(fotosTracoTable)
      .where(eq(fotosTracoTable.usuarioId, req.user!.id));

    if (fotos.length === 0) {
      return res.status(400).json({ error: "Nenhuma foto encontrada. Faça o upload de pelo menos uma foto." });
    }

    // Download and base64 encode photos
    const imageContents: Array<{ tipo: string; base64: string; contentType: string }> = [];
    for (const foto of fotos) {
      try {
        const file = await objectStorage.getObjectEntityFile(foto.objectPath);
        const gcsResponse = await objectStorage.downloadObject(file);
        const buffer = Buffer.from(await gcsResponse.arrayBuffer());
        imageContents.push({
          tipo: foto.tipo,
          base64: buffer.toString("base64"),
          contentType: gcsResponse.headers.get("content-type") || "image/jpeg",
        });
      } catch {
        // Skip photos that can't be loaded
      }
    }

    if (imageContents.length === 0) {
      return res.status(500).json({ error: "Não foi possível carregar as fotos para análise" });
    }

    const userText = `Por favor, analise as seguintes fotos desta pessoa e forneça a análise completa do Traço de Caráter.
Fotos enviadas: ${imageContents.map(i => i.tipo).join(", ")}.
Retorne o JSON conforme solicitado.`;

    const userContent: OpenAI.Chat.ChatCompletionContentPart[] = [
      { type: "text", text: userText },
      ...imageContents.map(({ base64, contentType }) => ({
        type: "image_url" as const,
        image_url: {
          url: `data:${contentType};base64,${base64}`,
          detail: "high" as const,
        },
      })),
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-5.1",
      max_completion_tokens: 4096,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
    });

    const content = completion.choices[0]?.message?.content ?? "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: "Erro ao processar resposta da análise. Tente novamente." });
    }

    let resultado: Record<string, unknown>;
    try {
      resultado = JSON.parse(jsonMatch[0]);
    } catch {
      return res.status(500).json({ error: "Erro ao interpretar análise. Tente novamente." });
    }

    // Upsert analysis
    const existing = await db
      .select()
      .from(analiseTracoTable)
      .where(eq(analiseTracoTable.usuarioId, req.user!.id));

    let analise;
    if (existing.length > 0) {
      [analise] = await db
        .update(analiseTracoTable)
        .set({ resultado, criadoEm: new Date() })
        .where(eq(analiseTracoTable.id, existing[0].id))
        .returning();
    } else {
      [analise] = await db
        .insert(analiseTracoTable)
        .values({ usuarioId: req.user!.id, resultado })
        .returning();
    }

    return res.json(analise);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao executar análise. Tente novamente." });
  }
});

// ── GET /traco/analise — get latest analysis ──────────────────────────────────
router.get("/analise", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const [analise] = await db
      .select()
      .from(analiseTracoTable)
      .where(eq(analiseTracoTable.usuarioId, req.user!.id));
    return res.json(analise ?? null);
  } catch (err) {
    req.log?.error(err);
    return res.status(500).json({ error: "Erro ao buscar análise" });
  }
});

export default router;
