import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import type { RequestEvent } from '@sveltejs/kit';

function handler(event: RequestEvent) {
	return svelteKitHandler({ auth, request: event.request, event });
}

export const GET = handler;
export const POST = handler;
