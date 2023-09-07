import { combinedAuthGuard, type RouteConfig } from './authGuard';

export const defaultAdminRedirect = '/home';
export const defaultNonAdminRedirect = '/login';

const adminOnlyConfig: RouteConfig = { nonAdminRedirect: '/home', nonUserRedirect: '/login' };
// const userOnlyConfig: RouteConfig = { nonUserRedirect: '/login' };
const openConfig: RouteConfig = {};
const loggedOutConfig: RouteConfig = { userRedirect: '/home' };

export const useCombinedAuthGuard = combinedAuthGuard(
	{
		'/': openConfig,

		'/(open)/params': openConfig,

		'/(loggedIn)/backup': adminOnlyConfig,

		'/(loggedIn)/users': adminOnlyConfig,
		'/(loggedIn)/users/create': adminOnlyConfig,
		'/(loggedIn)/users/[id]': { ...adminOnlyConfig, hasCustomValidation: true },
		'/(loggedIn)/users/[id]/delete': adminOnlyConfig,
		'/(loggedIn)/users/[id]/password': { ...adminOnlyConfig, hasCustomValidation: true },

		'/(loggedOut)/login': loggedOutConfig,
		'/(loggedOut)/signup': loggedOutConfig,
		'/(loggedOut)/firstUser': loggedOutConfig
	},
	(locals) => {
		return {
			admin: locals.user?.admin || false,
			user: locals.user !== undefined
		};
	}
);

export type AuthRouteOptions = Parameters<typeof useCombinedAuthGuard>[0]['route'];
