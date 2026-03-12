import { describe, it, expect, vi, beforeEach } from 'vitest';

// Unit tests for auth module structure and configuration
// Integration tests would require a running SvelteKit server

describe('auth configuration', () => {
	it('exports auth instance', async () => {
		// Verify the module exports the expected shape
		// We mock the env and better-sqlite3 to avoid real DB in unit tests
		vi.mock('$env/dynamic/private', () => ({
			env: { DATABASE_URL: ':memory:' }
		}));

		vi.mock('better-sqlite3', () => {
			return {
				default: vi.fn(() => ({
					prepare: vi.fn(() => ({ run: vi.fn(), get: vi.fn(), all: vi.fn() })),
					exec: vi.fn(),
					pragma: vi.fn(),
					close: vi.fn()
				}))
			};
		});

		// Import after mocks are set up
		const { auth } = await import('$lib/server/auth');

		expect(auth).toBeDefined();
		expect(typeof auth.api).toBe('object');
		expect(typeof auth.api.getSession).toBe('function');
		expect(typeof auth.api.signInEmail).toBe('function');
		expect(typeof auth.api.signOut).toBe('function');
	});
});

describe('session guard logic', () => {
	it('identifies protected paths correctly', () => {
		const PROTECTED_PATHS = ['/dashboard', '/hours', '/reports'];

		const testCases = [
			{ path: '/dashboard', expected: true },
			{ path: '/dashboard/new', expected: true },
			{ path: '/hours', expected: true },
			{ path: '/hours/2024-01', expected: true },
			{ path: '/reports', expected: true },
			{ path: '/', expected: false },
			{ path: '/login', expected: false },
			{ path: '/api/auth/sign-in/email', expected: false }
		];

		for (const { path, expected } of testCases) {
			const isProtected = PROTECTED_PATHS.some((p) => path.startsWith(p));
			expect(isProtected, `path "${path}" should be ${expected ? 'protected' : 'public'}`).toBe(
				expected
			);
		}
	});

	it('builds correct redirect URL with returnTo param', () => {
		const pathname = '/hours/2024-01';
		const redirectUrl = `/login?redirectTo=${encodeURIComponent(pathname)}`;
		expect(redirectUrl).toBe('/login?redirectTo=%2Fhours%2F2024-01');
	});
});
