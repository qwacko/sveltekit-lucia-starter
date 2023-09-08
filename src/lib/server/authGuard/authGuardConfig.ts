import { skGuard, type RouteConfig } from 'skguard';

type UserValidationOutput = {
	admin: boolean;
	user: boolean;
};

const adminOnlyConfig: RouteConfig<UserValidationOutput> = {
	check: (data) => (data.admin ? null : data.user ? '/' : '/login')
};
// const userOnlyConfig: RouteConfig = { nonUserRedirect: '/login' };
const openConfig: RouteConfig<UserValidationOutput> = { check: () => null };
const loggedOutConfig: RouteConfig<UserValidationOutput> = {
	check: (data) => (data.user ? '/' : null)
};
const postActionAuthOnly = (data: UserValidationOutput) => {
	console.log('POSTCheckInner', data);
	return data.admin ? null : 'Action Not Allowed';
};

export const authGuard = skGuard({
	routeConfig: {
		'/': {
			...openConfig,
			POSTCheck: {
				testFunction: postActionAuthOnly
			}
		},

		'/(open)/params': { ...openConfig, POSTCheck: { testAction: postActionAuthOnly } },

		'/(loggedIn)/backup': adminOnlyConfig,

		'/(loggedIn)/users': adminOnlyConfig,
		'/(loggedIn)/users/create': adminOnlyConfig,
		'/(loggedIn)/users/[id]': adminOnlyConfig,
		'/(loggedIn)/users/[id]/delete': adminOnlyConfig,
		'/(loggedIn)/users/[id]/password': adminOnlyConfig,

		'/(loggedOut)/login': loggedOutConfig,
		'/(loggedOut)/signup': loggedOutConfig,
		'/(loggedOut)/firstUser': loggedOutConfig,

		'/(loggedIn)/testFunctions': { ...adminOnlyConfig, POSTCheck: { default: postActionAuthOnly } }
	},
	validation: (data) => {
		return {
			admin: data.locals.user?.admin || false,
			user: data.locals.user !== undefined
		};
	}
});

export type AuthRouteOptions = Parameters<typeof authGuard>[0]['route'];
