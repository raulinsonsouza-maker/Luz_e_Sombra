# Workspace

## Overview

pnpm workspace monorepo using TypeScript. This is the **Da Sombra à Luz** Portuguese self-knowledge platform.

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
- **Brand colors**: dark `#2f251b`, medium `#5f4a2f`, gold `#c8a56b`, bronze `#9c7742`
- **Font**: "Tan Mon Cheri" from cdnfonts.com (headings), system font (body)
- **Charts**: chart.js + react-chartjs-2 (RadarChart, LineChart components)

### Backend (`artifacts/api-server`)
- **Port**: 8080
- **Routes**: `/api/auth/*`, `/api/avaliacoes/*`, `/api/usuarios/*`
- **JWT secret**: `JWT_SECRET` env var (fallback: hardcoded dev value)
- **Token expiry**: 30 days

### Database (`lib/db`)
- **Tables**: `usuarios`, `avaliacoes`
- **Schema file**: `lib/db/src/schema/usuarios.ts`
- Push schema with: `pnpm --filter @workspace/db run push`

## Pages
- `/login` — User login
- `/admin/login` — Admin login (validates isAdmin flag after login)
- `/` — Home (shows latest assessment summary, navigation cards)
- `/avaliacao` — Roda da Vida assessment form (13 steps)
- `/resultado/:id` — Assessment result with radar chart + evolution line chart
- `/historico` — Assessment history with comparison
- `/numerologia` — Numerology analysis: full permanent profile (Caminho de Vida, Expressão, Alma, Personalidade), year analysis (Pessoal + Universal + Combinação), monthly map
- `/admin` — Admin panel (CRUD for users, admin-only)

## Default Admin Credentials
- **username**: `admin`
- **password**: `admin123`

## Key Design Notes
- Tailwind v4: `@import url(...)` must come BEFORE `@import "tailwindcss"` in index.css
- CSS utility classes: `luxury-shell`, `luxury-card`, `luxury-card-strong`, `luxury-btn-primary`, `luxury-btn-secondary`, `luxury-input`, `luxury-range`
- API proxy: Vite proxies `/api/*` to Express on :8080
- `primeiro-acesso` route in usuarios.ts MUST be registered before `/:id` to avoid Express route collision
