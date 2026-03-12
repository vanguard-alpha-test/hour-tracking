import Database from 'better-sqlite3';
import { env } from '$env/dynamic/private';

/**
 * Runs the better-auth schema migration on startup.
 * Creates the auth tables (user, session, account, verification) if they don't exist.
 * This is idempotent — safe to run on every server start.
 */
export function runMigrations(): void {
	if (!env.DATABASE_URL) {
		throw new Error('DATABASE_URL is not set');
	}

	const db = new Database(env.DATABASE_URL);

	db.exec(`
    CREATE TABLE IF NOT EXISTS "user" (
      "id"              TEXT PRIMARY KEY NOT NULL,
      "name"            TEXT NOT NULL,
      "email"           TEXT NOT NULL UNIQUE,
      "email_verified"  INTEGER NOT NULL DEFAULT 0,
      "image"           TEXT,
      "created_at"      INTEGER NOT NULL,
      "updated_at"      INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "session" (
      "id"          TEXT PRIMARY KEY NOT NULL,
      "expires_at"  INTEGER NOT NULL,
      "token"       TEXT NOT NULL UNIQUE,
      "created_at"  INTEGER NOT NULL,
      "updated_at"  INTEGER NOT NULL,
      "ip_address"  TEXT,
      "user_agent"  TEXT,
      "user_id"     TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "account" (
      "id"                       TEXT PRIMARY KEY NOT NULL,
      "account_id"               TEXT NOT NULL,
      "provider_id"              TEXT NOT NULL,
      "user_id"                  TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
      "access_token"             TEXT,
      "refresh_token"            TEXT,
      "id_token"                 TEXT,
      "access_token_expires_at"  INTEGER,
      "refresh_token_expires_at" INTEGER,
      "scope"                    TEXT,
      "password"                 TEXT,
      "created_at"               INTEGER NOT NULL,
      "updated_at"               INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "verification" (
      "id"          TEXT PRIMARY KEY NOT NULL,
      "identifier"  TEXT NOT NULL,
      "value"       TEXT NOT NULL,
      "expires_at"  INTEGER NOT NULL,
      "created_at"  INTEGER,
      "updated_at"  INTEGER
    );
  `);

	db.close();
}
