import { useCombinedAuthGuard } from '$lib/server/authGuard/authGuardConfig';
import { validateSearchParams } from '$lib/sveltekitSearchParams';
import { searchSchema } from './searchSchema';

export const load = async (requestData) => {
	const { url } = useCombinedAuthGuard(requestData);
	const processedParams = validateSearchParams(url, searchSchema.passthrough().parse);

	const data = processedParams;

	return { searchData: data };
};

export const actions = {
	testAction: async (data) => {
		useCombinedAuthGuard(data);
		console.log('Test Action For Params Page');
	}
};
