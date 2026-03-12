import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

const PROTECTED_PATHS = ['/dashboard', '/hours', '/reports'];

const sessionHandle: Handle = async ({ event, resolve }) => {
	// Delegate auth API routes directly to better-auth
	if (event.url.pathname.startsWith('/api/auth')) {
		return svelteKitHandler({ auth, request: event.request, event });
	}

	// Attach session to locals on every request
	const session = await auth.api.getSession({ headers: event.request.headers });
	event.locals.session = session ?? null;

	// Guard protected paths
	const isProtected = PROTECTED_PATHS.some((path) => event.url.pathname.startsWith(path));
	if (isProtected && !event.locals.session) {
		redirect(302, `/login?redirectTo=${encodeURIComponent(event.url.pathname)}`);
	}

	// Redirect authenticated users away from login
	if (event.url.pathname === '/login' && event.locals.session) {
		redirect(302, '/');
	}

	return resolve(event);
};

export const handle: Handle = sessionHandle;
