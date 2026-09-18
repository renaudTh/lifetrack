# lifetrack

Daily activity tracker. You declare activities ("run", "drink coffee"), record them
day by day from a calendar, and review statistics over a period.

## Layout

Three independent npm packages, no workspace: each has its own `package.json` and
`package-lock.json`.

| Package         | Role                                                     | Stack                                                     |
| --------------- | -------------------------------------------------------- | --------------------------------------------------------- |
| `lifetracklib/` | Shared domain logic: calendar, statistics engine, models | TypeScript, vitest                                        |
| `backend/`      | REST API                                                 | NestJS 11, Fastify, TypeORM, PostgreSQL 17, Auth0         |
| `frontend/`     | Web application                                          | Angular 20 (standalone, zoneless), Bulma, chart.js, Auth0 |

**`lifetracklib` must be built first.** Both applications consume it through
`file:../lifetracklib` and compile against its `dist/`: without `npm run build` in the
library, their own build fails.

A consequence worth knowing: neither `nest start --watch` nor `ng serve` watches
`node_modules/@lifetrack/lib`. After changing the library, rebuild it **and** restart the
dev server that consumes it.

## Getting started

The devcontainer (`.devcontainer/`) is the shortest path: it provides Node, PostgreSQL
and pgAdmin. Its `postCreateCommand` runs `scripts/init_devcontainer.sh`, which installs
the three packages and builds the library.

Without the devcontainer:

```bash
cd lifetracklib && npm ci && npm run build
cd ../backend    && npm ci
cd ../frontend   && npm ci
```

You also need a reachable PostgreSQL instance and a `backend/.env.local` (see below).

```bash
cd backend  && npm run start:dev   # API on :5556
cd frontend && npm run start:dev   # app on :4200
```

`scripts/launch_tmux_session.sh` starts both in a tmux session.

## Environment variables

Two separate files, for two purposes:

| File                 | Read by                                           | Template               |
| -------------------- | ------------------------------------------------- | ---------------------- |
| `backend/.env.local` | `npm run start:dev` and the `migration:*` scripts | `backend/.env.example` |
| `.env` (root)        | `docker compose` when self-hosting                | `.env.example`         |

`AUTH0_TENANT` **must end with a `/`**: the code concatenates
`${AUTH0_TENANT}.well-known/jwks.json` and reuses the value as the issuer. Without the
slash, every authenticated request answers 401 with no useful message.

## Database

The schema is owned by TypeORM migrations, run when the API starts (`migrationsRun`).
`synchronize` is off: changing an entity means writing a migration.

```bash
cd backend
npm run migration:generate src/migrations/MyMigration
npm run migration:show
```

Running `migration:generate` against an up-to-date schema must report "No changes in
database schema were found". That is the signal that entities and migrations agree.

## Tests

```bash
cd lifetracklib && npm test -- --run     # vitest
cd backend      && npm test              # jest
cd frontend     && npm test              # karma, requires Chrome
```

The pipeline (`.github/workflows/ci.yml`) runs the three suites, the format check on all
three packages and ESLint on the backend, on every push to an open pull request against
`main` and on `main` itself.

## Self-hosting

The root `docker-compose.yaml` builds the images and starts the frontend, the API and the
database. It expects a `.env` (see `.env.example`) and publishes only
`127.0.0.1:8080` and `127.0.0.1:5556`: TLS and `/api` routing belong to an external
reverse proxy, which must strip the `/api` prefix — the API serves its routes at the
root.

```bash
cp .env.example .env   # then fill it in
docker compose up -d --build
```

## Conventions

- Commits follow [Conventional Commits](https://www.conventionalcommits.org).
- TypeScript `strict` across the three packages, on a single version (5.9.x).
- Formatting by prettier, one configuration at the root (`.prettierrc`).
- Code and comments are written in English.
