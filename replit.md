# Da Sombra à Luz — Plataforma de Autoconhecimento

## Visão Geral
Plataforma de autoconhecimento em português com tema escuro dourado, baseada em Bioenergética. Permite análise de Traço de Caráter, Roda da Vida e Numerologia.

## Estrutura do Projeto (pnpm monorepo)
- `artifacts/luz-e-sombra/` — Frontend React + Vite (SPA, dark gold theme)
- `artifacts/api-server/` — Backend Express + Drizzle ORM (REST API)
- `lib/db/` — Schema Drizzle + PostgreSQL (DATABASE_URL env var)
- `artifacts/mockup-sandbox/` — Canvas para exploração de UI

## Stack
- Frontend: React, Vite, Wouter, Tailwind CSS, Lucide React
- Backend: Express, Drizzle ORM, drizzle-zod, jsonwebtoken, pino
- DB: PostgreSQL (Replit managed)
- Storage: Object Storage (`DEFAULT_OBJECT_STORAGE_BUCKET_ID`, `PRIVATE_OBJECT_DIR`, `PUBLIC_OBJECT_SEARCH_PATHS`)
- Auth: JWT (`JWT_SECRET`), localStorage key `luz_e_sombra_token`

## Design Tokens
- Background: `#130f09`, `#1e1812`, `#2f251b`
- Gold: `#c8a56b`, Bronze: `#9c7742`
- Text: `#f7f2ec` (primary), `rgba(247,242,236,0.55)` (secondary)
- Font heading: `font-tan-mon-cheri`
- Admin area: `luxury-shell` (cream bg)

## Páginas do App
| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/dashboard` | HomePage | Dashboard com progresso, Roda da Vida, missões |
| `/jornada` | JornadaPage | Trilha de autoconhecimento com etapas |
| `/traco-de-carater` | TracodeCaraterPage | Análise de Traço de Caráter (multi-pessoa) |
| `/avaliacao` | AvaliacaoPage | Roda da Vida (12 áreas) |
| `/resultado/:id` | ResultadoPage | Resultado da avaliação |
| `/historico` | HistoricoPage | Histórico de avaliações |
| `/numerologia` | NumerologiaPage | Numerologia (Vida, Expressão, Alma, Personalidade) |
| `/perfil` | MeuPerfilPage | Perfil do usuário + botão "Quem Sou Eu" |
| `/quem-sou-eu` | QuemSouEuPage | Síntese integrada (numerologia + traço + roda) |
| `/missoes` | MissoesPage | Missões diárias e gamificação |
| `/comunidade` | ComunidadePage | Feed da comunidade com reações |
| `/cursos` | CursosPage | Catálogo de cursos |
| `/cursos/:id` | CursoPage | Página do curso com aulas |
| `/admin` | AdminPage | Painel admin (usuários, comunidade, cursos) |

## Schema DB (lib/db/src/schema/usuarios.ts)
- `usuariosTable` — usuários com foto de perfil, dataNascimento, isAdmin
- `avaliacoesTable` — Roda da Vida (12 dimensões 1-10)
- `pessoasAnaliseTable` — Pessoas para análise multi-pessoa (max 2 além de si)
- `fotosTracoTable` — Fotos para Traço de Caráter (pessoaId nullable: null=eu, número=outro)
- `analiseTracoTable` — Análise de Traço de Caráter (pessoaId nullable)
- `gamificacaoTable` — XP, nível, streak
- `missoesDiariasTable` — Missões diárias
- `comunidadeTable` — Posts da comunidade (texto/imagem/video)
- `reacoesTable` — Reações aos posts (❤️🔥💫🙏✨)
- `cursosTable` + `aulasTable` + `progressoCursosTable` — LMS

## API Routes Principais (artifacts/api-server/src/routes/)
- `/api/auth/` — login, register
- `/api/usuarios/` — perfil, foto de perfil (object storage)
- `/api/avaliacoes/` — CRUD Roda da Vida
- `/api/traco/` — Fotos + análise de Traço (suporta pessoaId)
  - `GET/POST/PUT/DELETE /traco/pessoas` — CRUD de pessoas para análise
  - `GET /traco/fotos?pessoaId=N` — fotos filtradas por pessoa (null=eu)
  - `GET /traco/fotos/:id/view` — serve imagem autenticada (blob URL no frontend)
  - `POST /traco/analisar` — salva resultado de análise
  - `GET /traco/analise?pessoaId=N` — busca análise por pessoa
- `/api/gamificacao/` — XP, progresso, missões
- `/api/comunidade/` — posts com reações
- `/api/cursos/` + `/api/cursos/:id/aulas/` — LMS

## Padrões Importantes
- **Imagens autenticadas**: NÃO usar `<img src={url}>` para URLs protegidas. Fazer `fetch` com `Authorization: Bearer <token>` → `createObjectURL(blob)`. Padrão em: fotos de perfil, fotos do Traço.
- **pessoaId convention**: `null` = o próprio usuário. `number` = outra pessoa. Usar `isNull()` do drizzle-orm para filtrar.
- **apiFetch**: função local no frontend com JWT automático. `API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "")`.
- **Admin page**: tem tab Usuários, Comunidade (com preview de imagem/video + contagem de reações) e Cursos.
- **Numerologia**: calculada client-side com funções em `@/lib/numerologia-utils.ts`.

## Funcionalidades Recentes
- **Fix de imagens no Traço**: blob URL via fetch autenticado (não mais `<img src>` direto)
- **Multi-pessoa no Traço**: seletor de até 3 pessoas (eu + 2 outros). Tabela `pessoas_analise` no DB.
- **"Quem Sou Eu"**: página nova em `/quem-sou-eu` que cruza numerologia + traço + roda da vida. Acesso via MeuPerfilPage.
- **Linguagem suavizada**: JornadaPage, AvaliacaoPage (scoreLabels mais emocionais), TracodeCaraterPage hero.
- **Admin Comunidade**: lista com preview de tipo de mídia + contagem de reações por emoji.
