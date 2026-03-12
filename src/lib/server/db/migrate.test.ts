import { describe, it, expect, vi } from 'vitest';
import { runMigrations } from './migrate';

// Spy on better-sqlite3 so we don't touch the filesystem
vi.mock('better-sqlite3', () => {
	const execMock = vi.fn();
	const closeMock = vi.fn();
	const DatabaseMock = vi.fn(() => ({ exec: execMock, close: closeMock }));
	return { default: DatabaseMock };
});

vi.mock('$env/dynamic/private', () => ({
	env: { DATABASE_URL: 'test.db' }
}));

describe('runMigrations', () => {
	it('creates all four auth tables', async () => {
		const Database = (await import('better-sqlite3')).default as ReturnType<typeof vi.fn>;
		const instance = new Database('test.db');

		runMigrations();

		const execCalls = (instance.exec as ReturnType<typeof vi.fn>).mock.calls;
		expect(execCalls.length).toBeGreaterThan(0);

		const sql: string = execCalls.map((c: unknown[]) => c[0]).join('\n');
		expect(sql).toContain('CREATE TABLE IF NOT EXISTS "user"');
		expect(sql).toContain('CREATE TABLE IF NOT EXISTS "session"');
		expect(sql).toContain('CREATE TABLE IF NOT EXISTS "account"');
		expect(sql).toContain('CREATE TABLE IF NOT EXISTS "verification"');
	});

	it('throws when DATABASE_URL is not set', async () => {
		vi.resetModules();
		vi.doMock('$env/dynamic/private', () => ({ env: { DATABASE_URL: '' } }));

		const { runMigrations: runMigrationsNoUrl } = await import('./migrate');
		expect(() => runMigrationsNoUrl()).toThrow('DATABASE_URL');
	});
});
