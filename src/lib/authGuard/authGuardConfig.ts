import { goto } from '$app/navigation';
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
	return data.user ? null : 'Action Not Allowed';
};

const postActionAdminOnly = (data: UserValidationOutput) => {
	return data.admin ? null : 'Action Not Allowed';
};

export const { backend: authGuard, frontend: authGuardFrontend } = skGuard({
	routeConfig: {
		'/': {
			...openConfig,
			POSTCheck: {
				testFunction: postActionAuthOnly,
				logout: postActionAuthOnly
			}
		},

		'/(open)/params': { ...openConfig, POSTCheck: { testAction: postActionAuthOnly } },

		'/(loggedIn)/backup': adminOnlyConfig,

		'/(loggedIn)/users': adminOnlyConfig,
		'/(loggedIn)/users/create': adminOnlyConfig,
		'/(loggedIn)/users/[id]': adminOnlyConfig,
		'/(loggedIn)/users/[id]/delete': adminOnlyConfig,
		'/(loggedIn)/users/[id]/password': adminOnlyConfig,

		'/(loggedIn)/ws/[id]': adminOnlyConfig,

		// SSE Logic
		'/(loggedIn)/sse/[id]': adminOnlyConfig,
		'/(loggedIn)/sse/[id]/getData': {
			...adminOnlyConfig,
			POSTCheck: {
				default: postActionAuthOnly
			}
		},
		'/(loggedIn)/sse/[id]/setData': {
			...adminOnlyConfig,
			POSTCheck: {
				default: postActionAuthOnly
			}
		},

		'/(loggedOut)/login': {
			...loggedOutConfig,
			POSTCheck: {
				default: (data: UserValidationOutput) =>
					data.user ? 'Cannot Sign In If Already Signed In' : undefined
			}
		},
		'/(loggedOut)/signup': {
			...loggedOutConfig,
			POSTCheck: {
				default: (data: UserValidationOutput) =>
					data.user ? 'Cannot Create User If Logged In' : undefined
			}
		},
		'/(loggedOut)/firstUser': {
			...loggedOutConfig,
			POSTCheck: {
				default: (data: UserValidationOutput) =>
					data.user ? 'Cannot Create User If Logged In' : undefined
			}
		},

		'/(loggedIn)/testFunctions': { ...adminOnlyConfig, POSTCheck: { default: postActionAuthOnly } }
	},
	validationBackend: (data) => {
		return {
			admin: data.locals.user?.admin || false,
			user: data.locals.user !== undefined
		};
	},
	errorFuncFrontend: (status, body) => {
		console.log('Routing Error : ', { status, body });
	},
	redirectFuncFrontend: (_, location) => {
		goto(location);
	}
});

export type AuthRouteOptions = Parameters<typeof authGuard>[0]['route'];
