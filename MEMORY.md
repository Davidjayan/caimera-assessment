# MEMORY

## Session Log

| # | Asked | Done |
|---|-------|------|
| 1 | Set up NX monorepo with Next.js app (`caimera-assess`) | Initialized NX workspace, added `@nx/next` app, configured pnpm workspace, `tsconfig.base.json`, eslint, jest |
| 2 | Add Node.js API with TypeORM, Redis, Socket.IO + Redis adapter; create `BaseEntityWithTimeStamp`; add `MEMORY.md` and `guardrails.md` | Created `apps/api` NX node app with Express, TypeORM (PostgreSQL), ioredis, Socket.IO + `@socket.io/redis-adapter`; added `BaseEntityWithTimeStamp` base class; example `User` entity; feature-based clean architecture (`health` feature with Supertest tests); `MEMORY.md`; `guardrails.md` |
| 3 | Move database entities to a lib folder | Extracted `BaseEntity.ts` and `User.ts` to `libs/entities/src/`; added barrel export (`index.ts`); added `libs/*` to `pnpm-workspace.yaml`; updated `database.ts` to import from `@caimera-assess/entities`; removed old files |

