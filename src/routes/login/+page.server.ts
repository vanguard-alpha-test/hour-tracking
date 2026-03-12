import { auth } from '$lib/server/auth';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, url }) => {
	if (locals.session) {
		const redirectTo = url.searchParams.get('redirectTo') ?? '/';
		redirect(302, redirectTo);
	}
	return {};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
			return fail(400, { message: 'Email and password are required.' });
		}

		let signInResponse: Response;
		try {
			signInResponse = await auth.api.signInEmail({
				body: { email, password },
				asResponse: true
			});
		} catch (err) {
			console.error('Login error:', err);
			return fail(500, { message: 'An unexpected error occurred. Please try again.' });
		}

		if (!signInResponse.ok) {
			const body = await signInResponse.json().catch(() => ({}));
			const message = (body as { message?: string }).message ?? 'Invalid email or password.';
			return fail(401, { message });
		}

		redirect(302, '/');
	}
};
