import { produce } from 'sveltekit-sse';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { number, string } from 'zod';
import { kvMouse } from '$lib/server/unstorage/unstorage';

export const POST: RequestHandler = async ({ request, params, locals }) => {
	const data = await request.json();
	if (locals.user?.id) {
		kvMouse.update({ userId: locals.user.id, roomId: params.id, data });
	}

	return json({});
};
