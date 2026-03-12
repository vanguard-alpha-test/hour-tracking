/**
 * Shared TypeScript types for the server-side data layer.
 */

export interface TimeEntry {
	id: number;
	date: string;        // ISO 8601: YYYY-MM-DD
	project: string;
	description: string;
	hours: number;
	created_at: string;  // ISO 8601 UTC timestamp
}

export type NewTimeEntry = Omit<TimeEntry, 'id' | 'created_at'>;
