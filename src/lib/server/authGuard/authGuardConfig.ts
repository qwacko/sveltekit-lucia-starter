import { combinedAuthGuard, type RouteConfig } from './authGuard';

type UserValidationOutput = {
	admin: boolean;
	user: boolean;
};

const adminOnlyConfig: RouteConfig<UserValidationOutput> = {
	checkFunction: (data) => (data.admin ? null : data.user ? '/home' : '/login')
};
// const userOnlyConfig: RouteConfig = { nonUserRedirect: '/login' };
const openConfig: RouteConfig<UserValidationOutput> = { checkFunction: () => null };
const loggedOutConfig: RouteConfig<UserValidationOutput> = {
	checkFunction: (data) => (data.user ? '/home' : null)
};

export const useCombinedAuthGuard = combinedAuthGuard(
	{
		'/': openConfig,

		'/(open)/params': openConfig,

		'/(loggedIn)/backup': adminOnlyConfig,

		'/(loggedIn)/users': adminOnlyConfig,
		'/(loggedIn)/users/create': adminOnlyConfig,
		'/(loggedIn)/users/[id]': adminOnlyConfig,
		'/(loggedIn)/users/[id]/delete': adminOnlyConfig,
		'/(loggedIn)/users/[id]/password': adminOnlyConfig,

		'/(loggedOut)/login': loggedOutConfig,
		'/(loggedOut)/signup': loggedOutConfig,
		'/(loggedOut)/firstUser': loggedOutConfig
	},
	(data) => {
		return {
			admin: data.locals.user?.admin || false,
			user: data.locals.user !== undefined
		};
	}
);

export type AuthRouteOptions = Parameters<typeof useCombinedAuthGuard>[0]['route'];
