import { skRoutes } from 'skroutes';
import { z } from 'zod';
import { searchSchema } from '../routes/(open)/params/searchSchema';

export const { serverPageInfo, pageInfo, urlGenerator } = skRoutes({
	errorURL: '/',
	config: {
		'/': {},
		'/(open)/params': { searchParamsValidation: searchSchema.parse },
		'/(loggedIn)/backup': {},
		'/(loggedIn)/users': {},
		'/(loggedIn)/users/create': {},
		'/(loggedIn)/users/[id]': { paramsValidation: z.object({ id: z.string() }).parse },
		'/(loggedIn)/users/[id]/delete': { paramsValidation: z.object({ id: z.string() }).parse },
		'/(loggedIn)/users/[id]/password': { paramsValidation: z.object({ id: z.string() }).parse },
		'/(loggedIn)/sse/[id]': { paramsValidation: z.object({ id: z.string() }).parse },
		'/(loggedIn)/sse/[id]/getData': { paramsValidation: z.object({ id: z.string() }).parse },
		'/(loggedIn)/sse/[id]/setData': { paramsValidation: z.object({ id: z.string() }).parse },
		'/(loggedIn)/ws/[id]': { paramsValidation: z.object({ id: z.string() }).parse },

		'/(loggedOut)/login': {},
		'/(loggedOut)/signup': {},
		'/(loggedOut)/firstUser': {},

		'/(loggedIn)/testFunctions': {}
	}
});
