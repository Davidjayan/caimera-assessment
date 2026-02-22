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

