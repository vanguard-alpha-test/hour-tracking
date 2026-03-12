import { getDb } from '$lib/server/db.js';
import type { Handle } from '@sveltejs/kit';

/**
 * Server hooks — runs before every request.
 *
 * Calling getDb() here ensures the SQLite connection is opened and the
 * schema migration runs exactly once on server startup, before any
 * route handler executes.
 */
export const handle: Handle = async ({ event, resolve }) => {
	// Initialise DB (no-op after the first call — singleton).
	getDb();
	return resolve(event);
};
