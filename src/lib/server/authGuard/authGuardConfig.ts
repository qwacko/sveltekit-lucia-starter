import { combinedAuthGuard, type RouteConfig } from './authGuard';

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

export const useCombinedAuthGuard = combinedAuthGuard({
	routeConfig: {
		'/': {
			...openConfig,
			POSTCheck: {
				testFunction: postActionAuthOnly
			}
		},

		'/(open)/params': openConfig,

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

export type AuthRouteOptions = Parameters<typeof useCombinedAuthGuard>[0]['route'];
