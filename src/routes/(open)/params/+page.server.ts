import { authGuard } from '$lib/authGuard/authGuardConfig';
import { serverPageInfo } from '$lib/routes';

export const load = async (requestData) => {
	authGuard(requestData);
	const pageInfo = serverPageInfo('/(open)/params', requestData);
	const searchData = pageInfo.current.searchParams;

	return { searchData };
};

export const actions = {
	testAction: async (data) => {
		authGuard(data);
		console.log('Test Action For Params Page');
	}
};
