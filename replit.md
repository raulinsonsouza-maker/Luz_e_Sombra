# Workspace

## Overview

pnpm workspace monorepo using TypeScript. This is the **Da Sombra à Luz** Portuguese self-knowledge platform with full gamification (XP, levels, missions, streak), community feed, and courses.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (Tailwind v4, wouter, chart.js)
- **Backend**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: JWT (bcryptjs for password hashing, stored in localStorage)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **Build**: esbuild (CJS bundle)
- **Object Storage**: Replit Object Storage (profile photos, community images)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server on :8080
- `pnpm --filter @workspace/luz-e-sombra run dev` — run frontend on :18367

## Architecture

### Frontend (`artifacts/luz-e-sombra`)
- **Port**: 18367
- **Router**: wouter with `base={import.meta.env.BASE_URL}`
- **Auth**: JWT stored in localStorage (`luz_e_sombra_token`, `luz_e_sombra_user`)
- **CSS**: Tailwind v4 with `@theme {}` block in `index.css` (no tailwind.config.js)
- **Brand colors**: dark `#2f251b`, darker `#1e1812`, darkest `#130f09`, gold `#c8a56b`, bronze `#9c7742`
- **Font**: "Tan Mon Cheri" from cdnfonts.com (headings), system font (body)
- **Charts**: chart.js + react-chartjs-2 (RadarChart, LineChart components)
- **Mobile nav**: `BottomNav` component (fixed bottom bar, `md:hidden`) — 5 items: Início, Comunidade, Cursos, Jornada, Perfil
- **Desktop nav**: `SiteHeader` (sticky top, hidden on mobile) — includes Comunidade + Cursos links

### Backend (`artifacts/api-server`)
- **Port**: 8080
- **Routes**: `/api/auth/*`, `/api/avaliacoes/*`, `/api/usuarios/*`, `/api/traco/*`, `/api/gamificacao/*`, `/api/comunidade/*`, `/api/cursos/*`
- **JWT secret**: `JWT_SECRET` env var
- **Token expiry**: 30 days
- **Object Storage**: `ObjectStorageService` at `src/lib/objectStorage.ts` (presigned URLs for PUT, binary stream for GET)

### Database (`lib/db`)
- **Schema file**: `lib/db/src/schema/usuarios.ts`
- **Tables**:
  - `usuarios` — users (includes `foto_perfil` column for object storage path)
  - `avaliacoes` — Roda da Vida assessments
  - `fotos_traco`, `analise_traco` — Traço de Caráter photo analysis
  - `gamificacao` — XP/level/streak per user
  - `missoes_diarias` — daily missions completion records
  - `comunidade` — community posts (texto/imagem/video types)
  - `reacoes` — emoji reactions per user per post (❤️🔥💫🙏✨)
  - `cursos` — courses (titulo, descricao, categoria, nivel, publicado)
  - `aulas` — lessons within a course (videoUrl for YouTube embed, conteudo for text, ordem, duracaoMin)
  - `progresso_cursos` — tracks which lessons each user has completed
- Push schema with: `pnpm --filter @workspace/db run push`

## Pages
- `/` — Landing page (public)
- `/login` — User login
- `/admin/login` — Admin login (validates isAdmin flag after login)
- `/dashboard` — Gamified home: score gauge, XP bar, level badge, daily missions preview, quick actions
- `/jornada` — Journey progression: 7 steps (Traço → Roda → Numerologia → locked modules)
- `/missoes` — Daily missions with XP rewards + streak counter + Conquistas tab
- `/avaliacao` — Roda da Vida assessment form (12 life areas, 1-10 scale)
- `/resultado/:id` — Assessment result with radar chart + evolution line chart
- `/historico` — Assessment history with comparison
- `/numerologia` — Numerology analysis: Caminho de Vida, Expressão, Alma, Personalidade
- `/traco-de-carater` — Traço de Caráter: photo upload → local biomechanical analysis (no AI)
- `/perfil` — User profile with photo upload (camera button), gamification stats, edit form
- `/comunidade` — Community feed: admin posts content (text/image/YouTube video), users react with 5 emojis
- `/cursos` — Course listing with progress bars
- `/cursos/:id` — Course viewer: YouTube embeds, lesson list, mark-as-complete per lesson
- `/admin` — Admin panel with 3 tabs: Usuários | Comunidade | Cursos

## API Endpoints — Comunidade
- `GET /api/comunidade` — list posts with reaction counts + current user's reactions
- `POST /api/comunidade` — create post (admin only; multipart for image upload)
- `DELETE /api/comunidade/:id` — delete post (admin only)
- `POST /api/comunidade/:id/reagir` — toggle emoji reaction (`{ emoji }`)

## API Endpoints — Cursos
- `GET /api/cursos` — list courses (admin sees all incl. drafts, users see published only)
- `POST /api/cursos` — create course (admin only)
- `PUT /api/cursos/:id` — update course (admin only)
- `DELETE /api/cursos/:id` — delete course (admin only)
- `GET /api/cursos/:id` — course detail with lessons + user progress
- `POST /api/cursos/:id/aulas` — add lesson to course (admin only)
- `DELETE /api/cursos/:cursoId/aulas/:aulaId` — remove lesson (admin only)
- `POST /api/cursos/:cursoId/aulas/:aulaId/concluir` — mark lesson complete (user)

## API Endpoints — Profile Photo
- `POST /api/usuarios/me/foto-perfil/upload-url` — get presigned PUT URL for object storage
- `PUT /api/usuarios/me/foto-perfil` — save `objectPath` after direct upload
- `GET /api/usuarios/me/foto-perfil/view` — stream photo binary (for blob URL in frontend)

## Gamification System
- **XP & Levels**: 5 levels (Iniciante→Observador→Explorador→Transformador→Iluminado), 0/500/1200/2500/5000 XP
- **Daily Missions**: 4 auto-generated per day from a pool of 10, rotating by day-of-year
- **Streak**: Tracks consecutive daily access (resets if user misses a day)

## Analysis Engine (Traço de Caráter)
- Fully local — runs in browser via Canvas API (zero AI credits)
- Analyzes body proportions, lateral symmetry, upper/lower mass ratio
- Maps to 5 Bioenergetic character structures (Esquizóide, Oral, Psicopata, Masoquista, Rígido)
- Backend only persists pre-computed results (no OpenAI)

## Default Admin Credentials
- **username**: `admin`
- **password**: `admin123`

## Key Design Notes
- Tailwind v4: `@import url(...)` must come BEFORE `@import "tailwindcss"` in index.css
- All authenticated pages use dark background: `linear-gradient(160deg, #130f09 0%, #1e1812 40%, #2f251b 100%)`
- `luxury-shell` (cream bg) is for landing/login/admin ONLY — do NOT use on authenticated user pages
- CSS utility classes: `luxury-shell`, `luxury-card`, `luxury-btn-primary`, `luxury-btn-secondary`, `luxury-input`
- API proxy: Vite proxies `/api/*` to Express on :8080
- `primeiro-acesso` route in usuarios.ts MUST be registered before `/:id` to avoid Express route collision
- Pages have `pb-28` bottom padding to clear the fixed BottomNav on mobile
- Photo upload flow: POST upload-url → PUT directly to presigned URL → PUT objectPath to save → GET /view to stream binary → createObjectURL for blob display
- Community reactions: toggle per user per emoji — same emoji again removes reaction
- Course lesson completion: per-user per-lesson, tracks `concluida=true` and `concluidaEm` timestamp
