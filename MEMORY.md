# MEMORY

## Session Log

| # | Asked | Done |
|---|-------|------|
| 1 | Set up NX monorepo with Next.js app (`caimera-assess`) | Initialized NX workspace, added `@nx/next` app, configured pnpm workspace, `tsconfig.base.json`, eslint, jest |
| 2 | Add Node.js API with TypeORM, Redis, Socket.IO + Redis adapter; create `BaseEntityWithTimeStamp`; add `MEMORY.md` and `guardrails.md` | Created `apps/api` NX node app with Express, TypeORM (PostgreSQL), ioredis, Socket.IO + `@socket.io/redis-adapter`; added `BaseEntityWithTimeStamp` base class; example `User` entity; feature-based clean architecture (`health` feature with Supertest tests); `MEMORY.md`; `guardrails.md` |
| 3 | Move database entities to a lib folder | Extracted `BaseEntity.ts` and `User.ts` to `libs/entities/src/`; added barrel export (`index.ts`); added `libs/*` to `pnpm-workspace.yaml`; updated `database.ts` to import from `@caimera-assess/entities`; removed old files |
| 4 | Add dev script to run all apps in dev mode | Added `"dev": "nx run-many --target=dev --all --parallel"` to root `package.json`; added `dev` target to `apps/api/project.json` |
| 5 | Move entities back into API under `database/entities` | Moved `BaseEntity.ts`, `User.ts`, barrel `index.ts` to `apps/api/src/database/entities/`; deleted `libs/entities/`; removed `libs/*` from `pnpm-workspace.yaml`; removed `paths` from tsconfig; updated `database.ts` import to local path |
| 6 | Add TypeORM migration implementation | Created `data-source.ts` CLI entry; updated `database.ts` with migrations glob path; created `database/migrations/` directory; added `migration:generate`, `migration:create`, `migration:run`, `migration:revert` scripts to root `package.json`; installed `tsconfig-paths` |
| 7 | Add shadcn UI with professional theme | Upgraded Tailwind to v4; installed `@tailwindcss/postcss`; initialized shadcn; added button, input, label, card, textarea components; applied indigo/slate OKLCH color theme (light + dark); updated layout with Inter font from Google Fonts |
| 8 | Implement multiplayer maths quiz | Created `AGENT.md`; built backend quiz feature: `quiz.constants.ts` (20 questions), `quiz.redis.ts` (Redis state), `quiz.service.ts` (business logic), `quiz.gateway.ts` (Socket.IO with 60s timer, first-answer-wins), `quiz.router.ts` + `quiz.spec.ts`; wired gateway in `socket.ts`, router in `app.ts`; built frontend: `lib/socket.ts` (Socket.IO client), `page.tsx` (lobby → playing → result → game_over with timer bar, leaderboard sidebar, shadcn components) |
| 9 | Add persistent memory (PG writes) | Created `Question.ts` + `Answer.ts` entities; created `quiz.persistence.ts` with fire-and-forget PG writes (no await); wired into gateway: persist question on broadcast, persist answer on submit, close question on correct answer |
| 10 | Decompose frontend into components + hooks | Extracted `useQuizSocket` hook; created `LobbyScreen`, `TimerBar`, `QuestionCard`, `Leaderboard`, `WaitingScreen`, `GameOverScreen` components; rewrote `page.tsx` as thin orchestrator (~90 lines vs ~280); added `waiting` phase for proper join→start→play flow |
| 11 | Restructure frontend to feature-based folders | Moved quiz components/hooks/lib to `app/features/quiz/`; moved shadcn UI to `app/components/ui/`; moved utils to `app/lib/`; updated all imports; updated `components.json`; deleted old `src/components`, `src/hooks`, `src/lib` |
| 12 | Min 2 players + remove emojis + uniform color | Backend rejects start_game if < 2 players, emits player_count on join/disconnect; removed all emojis from UI and backend logs; unified to primary color theme (primary/destructive); WaitingScreen shows player count and disables start button |
| 13 | Enhance GameOver message & Theme Color       | Updated frontend to capture and display custom `game_over` message (e.g., when all other players leave). Changed the primary theme color to `#1e2952` in both light and dark modes in `global.css`. |
| 14 | Beaver & Black Theme Update | Updated `global.css` with a new Beaver (`#9F8170`) and Black color theme for both light and dark modes. |
| 15 | Update Font & Header Opacity | Changed the app font from Inter to Figtree via `next/font/google`. Changed the main header background in `page.tsx` to `bg-primary/40` for a slight beaver color with 0.4 opacity. |

