# Hour Tracking

A SvelteKit application for tracking time across projects, built with Tailwind CSS v4 and SQLite.

## Tech Stack

- **SvelteKit** — full-stack web framework
- **TypeScript** — type safety throughout
- **Tailwind CSS v4** — utility-first styling via `@tailwindcss/vite` (no config file required)
- **SQLite via `node:sqlite`** — Node.js 22+ built-in SQLite module; no native compilation required
- **adapter-node** — Node.js server build

## Local Setup

### Prerequisites

- Node.js 22+ (for the built-in `node:sqlite` module)

### Install and Run

```bash
npm install
npm run dev
```

The app starts at `http://localhost:5173`. The SQLite database file is created automatically at `data/hour-tracking.db` on first run.

### Build for Production

```bash
npm run build
node build/index.js
```

## Project Structure

```
src/
  app.css                   # Tailwind v4 entry point (@import "tailwindcss")
  lib/
    server/
      db.ts                 # SQLite singleton — server-only, never imported by client code
  routes/
    +layout.svelte          # Root layout — imports app.css globally
    +page.svelte            # Landing page — status dashboard
    +page.server.ts         # Server load — queries DB, returns data to page
```

## Database Schema

Two tables form the baseline schema, created automatically on startup:

**projects**
- `id` — primary key
- `name` — project name
- `created_at` — ISO 8601 timestamp

**time_entries**
- `id` — primary key
- `project_id` — foreign key to projects (cascades on delete)
- `description` — optional entry notes
- `started_at` — ISO 8601 start timestamp
- `ended_at` — ISO 8601 end timestamp (nullable for in-progress entries)
- `duration_seconds` — computed or stored duration (nullable)
- `created_at` — record creation timestamp

## Notes

- The `data/` directory is git-ignored — the SQLite file lives outside version control
- Tailwind v4 requires no `tailwind.config.js`; the single `@import "tailwindcss"` in `app.css` is the complete configuration
- `node:sqlite` is built into Node.js 22+ — no `better-sqlite3` or native compilation needed
- The `db` singleton lives in `$lib/server/` — SvelteKit enforces that server-only modules are never bundled for the client
