import { validateSearchParams } from '$lib/sveltekitSearchParams';
import { searchSchema } from './searchSchema';

export const load = async ({ url }) => {
	const processedParams = validateSearchParams(url, searchSchema.passthrough().parse);

	const data = processedParams;

	return { searchData: data };
};
