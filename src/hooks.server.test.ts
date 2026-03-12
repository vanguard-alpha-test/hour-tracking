import { describe, it, expect, vi } from 'vitest';

// Minimal redirect mock
vi.mock('@sveltejs/kit', () => ({
	redirect: (status: number, url: string) => {
		throw { status, location: url };
	},
	sequence: (...fns: ((arg: unknown) => unknown)[]) => fns[fns.length - 1]
}));

vi.mock('better-auth/svelte-kit', () => ({
	svelteKitHandler: ({ resolve, event }: { resolve: (e: unknown) => unknown; event: unknown }) =>
		resolve(event)
}));

vi.mock('$lib/auth', () => ({
	auth: {
		api: {
			getSession: vi.fn().mockResolvedValue(null)
		}
	}
}));

describe('hooks.server — redirect middleware', () => {
	it('redirects unauthenticated requests on protected paths', async () => {
		const { handle } = await import('./hooks.server');

		const event = {
			url: new URL('http://localhost/dashboard'),
			request: new Request('http://localhost/dashboard'),
			locals: {}
		};

		await expect(
			handle({ event, resolve: (e: unknown) => e } as Parameters<typeof handle>[0])
		).rejects.toMatchObject({ status: 302 });
	});

	it('allows unauthenticated access to /login', async () => {
		const { handle } = await import('./hooks.server');

		const event = {
			url: new URL('http://localhost/login'),
			request: new Request('http://localhost/login'),
			locals: {}
		};

		const result = await handle({
			event,
			resolve: () => Promise.resolve(new Response('ok'))
		} as Parameters<typeof handle>[0]);

		expect(result).toBeInstanceOf(Response);
	});

	it('allows unauthenticated access to /api/auth/*', async () => {
		const { handle } = await import('./hooks.server');

		const event = {
			url: new URL('http://localhost/api/auth/sign-in/email'),
			request: new Request('http://localhost/api/auth/sign-in/email'),
			locals: {}
		};

		const result = await handle({
			event,
			resolve: () => Promise.resolve(new Response('ok'))
		} as Parameters<typeof handle>[0]);

		expect(result).toBeInstanceOf(Response);
	});
});
