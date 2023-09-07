import { redirect } from '@sveltejs/kit';
import { defaultAdminRedirect, defaultNonAdminRedirect } from './authGuardConfig';

export const authGuard = ({
	locals,
	requireAdmin = true,
	redirectNonAdmin = defaultAdminRedirect,
	redirectNonUser = defaultNonAdminRedirect
}: {
	locals: App.Locals;
	requireAdmin?: boolean;
	redirectNonAdmin?: string;
	redirectNonUser?: string;
}) => {
	const user = locals.user;
	if (!user) {
		throw redirect(302, redirectNonUser);
	}
	if (requireAdmin && !user.admin) {
		throw redirect(302, redirectNonAdmin);
	}

	return user;
};

export type RouteConfig = {
	nonUserRedirect?: string;
	nonAdminRedirect?: string;
	userRedirect?: string;
	adminRedirect?: string;
	hasCustomValidation?: boolean;
};

type UserValidationOutput = { admin?: boolean; user?: boolean };

export const combinedAuthGuard = <T extends { [key: string]: RouteConfig }, U extends keyof T>(
	config: T,
	validation: (locals: App.Locals) => UserValidationOutput
) => {
	return ({
		route,
		locals,
		customValidation
	}: {
		route: { id: U };
		locals: App.Locals;
		customValidation?: (prev: UserValidationOutput) => UserValidationOutput;
	}) => {
		const { admin, user } =
			customValidation === undefined ? validation(locals) : customValidation(validation(locals));
		const routeConfig = config[route.id];

		if (!routeConfig) {
			return;
		}

		if (routeConfig.hasCustomValidation && !customValidation) {
			return;
		}

		if (user !== undefined) {
			if (routeConfig.nonUserRedirect && !user) {
				throw redirect(302, routeConfig.nonUserRedirect);
			}
			if (routeConfig.userRedirect && user) {
				throw redirect(302, routeConfig.userRedirect);
			}
		}

		if (admin !== undefined) {
			if (routeConfig.nonAdminRedirect && !admin) {
				throw redirect(302, routeConfig.nonAdminRedirect);
			}
			if (routeConfig.adminRedirect && admin) {
				throw redirect(302, routeConfig.adminRedirect);
			}
		}
	};
};
