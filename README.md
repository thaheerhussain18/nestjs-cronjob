# NestJS Job Scheduling & Queue Playground

A NestJS backend exploring background job processing patterns: cron scheduling, Redis-backed queues (Bull/BullMQ), CSV/PDF file generation, and Prisma against MariaDB.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | NestJS 11 |
| Database | MariaDB via Prisma |
| Queues | Bull / BullMQ over Redis |
| Scheduling | `@nestjs/schedule` cron jobs |
| File handling | `csv-parser`, `exceljs` (CSV import, PDF/Excel export) |
| API docs | `@nestjs/swagger` |
| Validation | class-validator / class-transformer |

## Modules

- **`activity`** — CRUD over activity records, with PDF export
- **`assignment`** — CRUD over assignments
- **`csvdata`** — CSV import pipeline, with PDF export
- **`employee`** — employee records
- **`simple-queue`** / **`demo`** — BullMQ producer/processor examples (job creation, processing, deletion via queue)
- **`file-generate`** — on-demand file generation
- **`logger`** — request/activity logging
- **`common/base-queue.service.ts`** — shared base class for queue services
- **`redis`** / **`prisma`** — infrastructure modules (Redis client, Prisma client)

## Running locally

```bash
npm install

# start Redis + MariaDB (bring your own, or via Docker)
npx prisma migrate dev

npm run start:dev
```

Swagger docs are available once the app is running (see `main.ts` for the mounted path).

## Status

Learning project — built to get hands-on with Redis-backed job queues and cron scheduling in NestJS, not a production service.
