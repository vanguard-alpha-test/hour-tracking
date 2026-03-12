import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	// Already authenticated — send them home
	if (locals.session) {
		redirect(302, '/');
	}

	return {
		redirectTo: url.searchParams.get('redirectTo') ?? '/'
	};
};
