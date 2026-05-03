# Workspace

## Overview

pnpm workspace monorepo using TypeScript. This is the **Da Sombra à Luz** Portuguese self-knowledge platform with full gamification (XP, levels, missions, streak).

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
- **Mobile nav**: `BottomNav` component (fixed bottom bar, md:hidden) replaces hamburger
- **Desktop nav**: `SiteHeader` (sticky top, hidden on mobile)

### Backend (`artifacts/api-server`)
- **Port**: 8080
- **Routes**: `/api/auth/*`, `/api/avaliacoes/*`, `/api/usuarios/*`, `/api/traco/*`, `/api/gamificacao/*`
- **JWT secret**: `JWT_SECRET` env var (fallback: hardcoded dev value)
- **Token expiry**: 30 days

### Database (`lib/db`)
- **Schema file**: `lib/db/src/schema/usuarios.ts`
- **Tables**: `usuarios`, `avaliacoes`, `fotos_traco`, `analise_traco`, `gamificacao`, `missoes_diarias`
- Push schema with: `pnpm --filter @workspace/db run push`

## Pages
- `/` — Landing page
- `/login` — User login
- `/admin/login` — Admin login (validates isAdmin flag after login)
- `/dashboard` — Gamified home: score gauge, XP bar, level badge, daily missions preview, quick actions
- `/jornada` — Journey progression: 7 steps (Traço → Roda → Numerologia → locked modules), locked/unlocked
- `/missoes` — Daily missions with XP rewards + streak counter + Conquistas tab
- `/avaliacao` — Roda da Vida assessment form (12 life areas, 1-10 scale)
- `/resultado/:id` — Assessment result with radar chart + evolution line chart
- `/historico` — Assessment history with comparison
- `/numerologia` — Numerology analysis: Caminho de Vida, Expressão, Alma, Personalidade
- `/traco-de-carater` — Traço de Caráter: photo upload → local biomechanical analysis (no AI)
- `/perfil` — User profile with gamification stats (XP, level, streak, missions)
- `/admin` — Admin panel (CRUD for users, admin-only)

## Gamification System
- **XP & Levels**: 5 levels (Iniciante→Observador→Explorador→Transformador→Iluminado), 0/500/1200/2500/5000 XP
- **Daily Missions**: 4 auto-generated per day from a pool of 10, rotating by day-of-year
- **Streak**: Tracks consecutive daily access (resets if user misses a day)
- **Endpoints**:
  - `GET /api/gamificacao/progresso` — XP, level, streak, today's missions, jornada status
  - `POST /api/gamificacao/adicionar-xp` — Award XP for completing actions
  - `POST /api/gamificacao/missoes/:id/concluir` — Complete a mission + award XP

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
- `luxury-shell` (cream bg) is for landing/login ONLY — do NOT use on authenticated pages
- CSS utility classes: `luxury-shell`, `luxury-card`, `luxury-btn-primary`, `luxury-btn-secondary`, `luxury-input`
- API proxy: Vite proxies `/api/*` to Express on :8080
- `primeiro-acesso` route in usuarios.ts MUST be registered before `/:id` to avoid Express route collision
- Pages have `pb-28` bottom padding to clear the fixed BottomNav on mobile
