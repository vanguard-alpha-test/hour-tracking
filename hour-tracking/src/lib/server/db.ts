import Database from 'better-sqlite3';
import path from 'node:path';
import { migrate } from './migrate.js';

const DB_PATH = path.resolve(process.cwd(), 'data', 'hour-tracking.db');

/**
 * Singleton SQLite connection.
 *
 * Placed under src/lib/server/ so SvelteKit's server-only boundary
 * prevents accidental client-side imports.
 */
let _db: Database.Database | null = null;

export function getDb(): Database.Database {
	if (!_db) {
		// Ensure the data directory exists before opening the file.
		import('node:fs').then(({ mkdirSync }) => {
			mkdirSync(path.dirname(DB_PATH), { recursive: true });
		});

		_db = new Database(DB_PATH);

		// Enable WAL mode for better concurrent read performance.
		_db.pragma('journal_mode = WAL');
		_db.pragma('foreign_keys = ON');

		migrate(_db);
	}
	return _db;
}

export type { Database };
