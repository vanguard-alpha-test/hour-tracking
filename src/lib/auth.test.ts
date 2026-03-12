import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the DB and env so unit tests don't need a real SQLite file
vi.mock('$env/dynamic/private', () => ({
	env: {
		DATABASE_URL: ':memory:',
		SESSION_SECRET: 'test-secret-that-is-long-enough-32chars'
	}
}));

vi.mock('$lib/server/db', () => ({
	db: {}
}));

describe('auth configuration', () => {
	it('throws when SESSION_SECRET is missing', async () => {
		vi.resetModules();
		vi.doMock('$env/dynamic/private', () => ({
			env: { DATABASE_URL: ':memory:', SESSION_SECRET: '' }
		}));

		await expect(import('$lib/auth')).rejects.toThrow('SESSION_SECRET');
	});
});
