import type Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const SCHEMA_PATH = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	'schema.sql'
);

/**
 * Runs the baseline schema against the provided database connection.
 *
 * All DDL statements in schema.sql use IF NOT EXISTS, making this
 * operation fully idempotent. Call once on server startup.
 */
export function migrate(db: Database.Database): void {
	const sql = readFileSync(SCHEMA_PATH, 'utf-8');
	db.exec(sql);
}
