/**
 * Unit tests for better-auth session management and authentication logic.
 *
 * These tests exercise the auth instance directly (no HTTP server required)
 * using an in-memory SQLite database so they are fast and fully isolated.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { betterAuth } from 'better-auth';
import Database from 'better-sqlite3';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Create a fresh in-memory auth instance for each test.
 * Using `:memory:` guarantees complete isolation between test runs.
 */
function createTestAuth() {
	const db = new Database(':memory:');

	const auth = betterAuth({
		database: db,
		emailAndPassword: {
			enabled: true,
			requireEmailVerification: false
		},
		session: {
			cookieCache: {
				enabled: true,
				maxAge: 60 * 60 * 24 * 7
			}
		}
	});

	return auth;
}

/**
 * Build a minimal Request object that better-auth's API methods accept.
 */
function makeRequest(method: string, path: string, body?: unknown): Request {
	return new Request(`http://localhost${path}`, {
		method,
		headers: { 'Content-Type': 'application/json' },
		body: body !== undefined ? JSON.stringify(body) : undefined
	});
}

// ---------------------------------------------------------------------------
// Sign-up helper — reused across tests
// ---------------------------------------------------------------------------

async function signUp(
	auth: ReturnType<typeof createTestAuth>,
	email: string,
	password: string,
	name = 'Test User'
) {
	return auth.api.signUpEmail({ body: { email, password, name } });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('auth — user registration', () => {
	let auth: ReturnType<typeof createTestAuth>;

	beforeEach(() => {
		auth = createTestAuth();
	});

	it('creates a user and returns a session token', async () => {
		const result = await signUp(auth, 'alice@example.com', 'password123');

		expect(result).toBeDefined();
		expect(result.user).toBeDefined();
		expect(result.user.email).toBe('alice@example.com');
		expect(result.token).toBeTruthy();
	});

	it('rejects duplicate email registration', async () => {
		await signUp(auth, 'bob@example.com', 'password123');

		await expect(signUp(auth, 'bob@example.com', 'differentpass')).rejects.toThrow();
	});

	it('rejects registration with an empty password', async () => {
		await expect(signUp(auth, 'charlie@example.com', '')).rejects.toThrow();
	});
});

describe('auth — sign in with email and password', () => {
	let auth: ReturnType<typeof createTestAuth>;

	beforeEach(async () => {
		auth = createTestAuth();
		await signUp(auth, 'dana@example.com', 'correctpassword');
	});

	it('returns a session for valid credentials', async () => {
		const result = await auth.api.signInEmail({
			body: { email: 'dana@example.com', password: 'correctpassword' }
		});

		expect(result).toBeDefined();
		expect(result.user.email).toBe('dana@example.com');
		expect(result.token).toBeTruthy();
	});

	it('throws for an incorrect password', async () => {
		await expect(
			auth.api.signInEmail({
				body: { email: 'dana@example.com', password: 'wrongpassword' }
			})
		).rejects.toThrow();
	});

	it('throws for a non-existent email', async () => {
		await expect(
			auth.api.signInEmail({
				body: { email: 'nobody@example.com', password: 'anypassword' }
			})
		).rejects.toThrow();
	});
});

describe('auth — session retrieval', () => {
	let auth: ReturnType<typeof createTestAuth>;

	beforeEach(async () => {
		auth = createTestAuth();
	});

	it('returns null session when no cookie is present', async () => {
		const emptyHeaders = new Headers();
		const session = await auth.api.getSession({ headers: emptyHeaders });

		expect(session).toBeNull();
	});

	it('returns a valid session after sign-in using the session token', async () => {
		await signUp(auth, 'eve@example.com', 'password123');

		const signInResult = await auth.api.signInEmail({
			body: { email: 'eve@example.com', password: 'password123' }
		});

		expect(signInResult.token).toBeTruthy();

		// Use the session token as a bearer header to retrieve session
		const headers = new Headers({ Authorization: `Bearer ${signInResult.token}` });
		const session = await auth.api.getSession({ headers });

		expect(session).not.toBeNull();
		expect(session?.user.email).toBe('eve@example.com');
	});
});

describe('auth — sign out', () => {
	let auth: ReturnType<typeof createTestAuth>;

	beforeEach(async () => {
		auth = createTestAuth();
	});

	it('invalidates the session token after sign-out', async () => {
		await signUp(auth, 'frank@example.com', 'password123');

		const signInResult = await auth.api.signInEmail({
			body: { email: 'frank@example.com', password: 'password123' }
		});

		const token = signInResult.token;
		expect(token).toBeTruthy();

		// Confirm session exists before sign-out
		const beforeHeaders = new Headers({ Authorization: `Bearer ${token}` });
		const sessionBefore = await auth.api.getSession({ headers: beforeHeaders });
		expect(sessionBefore).not.toBeNull();

		// Sign out using the token
		await auth.api.signOut({ headers: new Headers({ Authorization: `Bearer ${token}` }) });

		// Session should no longer be valid
		const afterHeaders = new Headers({ Authorization: `Bearer ${token}` });
		const sessionAfter = await auth.api.getSession({ headers: afterHeaders });
		expect(sessionAfter).toBeNull();
	});
});

describe('auth — password security', () => {
	let auth: ReturnType<typeof createTestAuth>;

	beforeEach(async () => {
		auth = createTestAuth();
	});

	it('does not store plaintext passwords (stored hash differs from input)', async () => {
		const db = (auth as unknown as { options: { database: Database.Database } }).options.database;

		await signUp(auth, 'grace@example.com', 'plaintextpassword');

		// Query the raw user row to verify password is hashed
		const row = db.prepare('SELECT * FROM "user" WHERE email = ?').get('grace@example.com') as
			| { password?: string }
			| undefined;

		// better-auth stores hashed passwords on the account table, not the user table
		// Verify the user was created successfully — password is not exposed on user row
		expect(row).toBeDefined();
		expect((row as Record<string, unknown>)['password']).toBeUndefined();

		const accountRow = db
			.prepare('SELECT * FROM "account" WHERE "userId" = (SELECT id FROM "user" WHERE email = ?)')
			.get('grace@example.com') as { password?: string } | undefined;

		expect(accountRow).toBeDefined();
		// The stored value must not equal the plaintext input
		if (accountRow?.password) {
			expect(accountRow.password).not.toBe('plaintextpassword');
		}
	});
});
