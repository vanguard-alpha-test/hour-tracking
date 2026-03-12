import { svelteKitHandler } from 'better-auth/svelte-kit';
import { auth } from '$lib/auth';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

// Routes that do NOT require authentication
const PUBLIC_PATHS = ['/login', '/api/auth'];

const authHandler: Handle = async ({ event, resolve }) => {
	// Attach session to locals for use in load functions
	const session = await auth.api.getSession({ headers: event.request.headers });
	event.locals.session = session ?? null;
	event.locals.user = session?.user ?? null;

	const path = event.url.pathname;
	const isPublic = PUBLIC_PATHS.some((p) => path === p || path.startsWith(p + '/'));

	if (!isPublic && !event.locals.session) {
		const loginUrl = new URL('/login', event.url.origin);
		loginUrl.searchParams.set('redirectTo', path);
		redirect(302, loginUrl.toString());
	}

	return resolve(event);
};

const betterAuthHandler: Handle = ({ event, resolve }) =>
	svelteKitHandler({ event, resolve, auth });

export const handle = sequence(betterAuthHandler, authHandler);
