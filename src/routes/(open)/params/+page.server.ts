import { useCombinedAuthGuard } from '$lib/server/authGuard/authGuardConfig';
import { validateSearchParams } from '$lib/sveltekitSearchParams';
import { searchSchema } from './searchSchema';

export const load = async ({ url, locals, route }) => {
	useCombinedAuthGuard({ route, locals });
	const processedParams = validateSearchParams(url, searchSchema.passthrough().parse);

	const data = processedParams;

	return { searchData: data };
};
