# Hour Tracking

A local-first time-tracking application built with SvelteKit, Tailwind CSS v4, and SQLite.

## Stack

| Layer     | Technology                  | Notes                                      |
|-----------|-----------------------------|--------------------------------------------|
| Framework | SvelteKit 2 + Svelte 5      | File-based routing, server hooks           |
| Styling   | Tailwind CSS v4             | Vite plugin — no PostCSS, no config file   |
| Database  | SQLite via `better-sqlite3` | Synchronous driver, WAL mode enabled       |
| Language  | TypeScript                  | Strict mode                                |

## Local Setup

### Prerequisites

- Node.js >= 18
- Python 3 and a C++ compiler (required by `better-sqlite3` native build)

### Install and run

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

### Database

The SQLite database file is created automatically at `data/hour-tracking.db` on
first server startup. The schema migration runs idempotently on every startup via
`src/hooks.server.ts` → `src/lib/server/migrate.ts`.

To inspect the database directly:

```bash
sqlite3 data/hour-tracking.db
```

### Build for production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
  app.css              # Tailwind v4 entry point (@import "tailwindcss")
  app.html             # HTML shell
  hooks.server.ts      # DB initialisation on server startup
  lib/
    server/
      db.ts            # SQLite singleton (server-only)
      migrate.ts       # Idempotent schema runner
      schema.sql       # Baseline DDL
      types.ts         # Shared TypeScript interfaces
  routes/
    +layout.svelte     # Root layout — imports app.css
    +page.svelte       # Home page
data/
  hour-tracking.db     # SQLite file (git-ignored, created at runtime)
```

## Schema

```sql
time_entries (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  date        TEXT    NOT NULL,       -- YYYY-MM-DD
  project     TEXT    NOT NULL,
  description TEXT    NOT NULL DEFAULT '',
  hours       REAL    NOT NULL CHECK (hours > 0),
  created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
)
```
