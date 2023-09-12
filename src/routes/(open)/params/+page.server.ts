import { authGuard } from '$lib/authGuard/authGuardConfig';
import { validateSearchParams } from 'sksearchparams';
import { searchSchema } from './searchSchema';

export const load = async (requestData) => {
	const { url } = authGuard(requestData);
	const processedParams = validateSearchParams(url, searchSchema.passthrough().parse);

	const data = processedParams;

	return { searchData: data };
};

export const actions = {
	testAction: async (data) => {
		authGuard(data);
		console.log('Test Action For Params Page');
	}
};
