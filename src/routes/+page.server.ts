import { db } from '$lib/server/db';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	// Verify DB connectivity and return initial project list
	const projectStmt = db.prepare('SELECT id, name, created_at FROM projects ORDER BY created_at DESC');
	const projects = projectStmt.all() as Array<{ id: number; name: string; created_at: string }>;

	const countStmt = db.prepare('SELECT COUNT(*) as count FROM time_entries');
	const { count: entryCount } = countStmt.get() as { count: number };

	return {
		projects,
		entryCount,
		dbStatus: 'connected'
	};
};
