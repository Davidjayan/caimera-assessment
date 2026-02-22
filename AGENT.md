# AGENT.md — Caimera Assess

## Project Scope

Build a **scalable real-time multiplayer maths quiz** where players compete to answer maths questions fastest. First correct answer wins the round.

## Architecture

### Tech Stack

- **Frontend**: Next.js 16 + shadcn/ui (Tailwind v4) + Socket.IO client
- **Backend**: Express + TypeORM (PostgreSQL) + ioredis + Socket.IO (Redis adapter)
- **Package Manager**: pnpm
- **Monorepo**: NX

### Flow

1. Server picks a question → stores in Redis (active state) + PostgreSQL
2. Broadcasts question (without answer) to all connected clients
3. 60-second countdown timer starts
4. Client submits answer (answer, timestamp, question_id)
5. Server checks if question already answered:
   - **YES** → Sends winner details to the submitter
   - **NO** → Validates answer → Marks question closed in Redis → Stores result in Redis + PG async → Broadcasts result to all clients
6. Next question cycle begins

### Data Model

**Question DATA** (stored in Redis + PG):
- `question_id` — prefixed UUIDv7
- `question` — the maths question text
- `options` — array of 4 answer choices
- `answer_hash` — hashed correct answer (not sent to clients)
- `timestamps` — created, answered
- `state` — `open` | `closed`

## Guardrails

1. Always use feature-based folder structure
2. Always use clean architecture
3. Always write unit test cases for APIs using Supertest
4. Always use pnpm as the package manager

## Folder Structure

```
apps/
├── api/src/
│   ├── app/                    # Express, DB, Redis, Socket config
│   ├── database/
│   │   ├── entities/           # TypeORM entities (BaseEntity, Question, Answer)
│   │   └── migrations/
│   └── features/
│       ├── health/             # Health check
│       └── quiz/               # Quiz feature
│           ├── quiz.gateway.ts       # Socket.IO event handlers
│           ├── quiz.service.ts       # Business logic
│           ├── quiz.redis.ts         # Redis state management
│           ├── quiz.constants.ts     # Question bank
│           ├── quiz.router.ts        # REST endpoints (optional)
│           └── quiz.spec.ts          # Tests
├── caimera-assess/src/
│   ├── app/
│   │   └── page.tsx            # Quiz game UI
│   ├── components/ui/          # shadcn components
│   └── lib/                    # Utilities, socket client
```
