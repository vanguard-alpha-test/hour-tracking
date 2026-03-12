import { runMigrations } from '$lib/server/db/migrate';

// Run DB migrations on every cold start.
// better-auth tables are created idempotently via CREATE TABLE IF NOT EXISTS.
runMigrations();
