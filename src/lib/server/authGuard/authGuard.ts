import { redirect, type RequestEvent } from '@sveltejs/kit';

export type allowedFunction<UserValidationOutput extends Record<string, boolean | string>> = (
	data: UserValidationOutput
) => string | undefined | null;

export type RouteConfig<UserValidationOutput extends Record<string, boolean | string>> = {
	checkFunction: allowedFunction<UserValidationOutput>;
};

export const combinedAuthGuard = <
	VType extends (
		data: RequestEvent<Partial<Record<string, string>>, U>
	) => Record<string, string | boolean>,
	VReturn extends ReturnType<VType>,
	T extends { [key: string]: RouteConfig<VReturn> },
	U extends keyof T & string
>(
	config: T,
	validation: VType
) => {
	const R = <S extends RequestEvent<Partial<Record<string, string>>, U>>(
		requestData: S,
		customValidation?: VType
	) => {
		const validationResult: VReturn =
			customValidation === undefined
				? (validation(requestData) as VReturn)
				: (customValidation(requestData) as VReturn);

		const routeConfig = config[requestData.route.id];

		if (!routeConfig) {
			return requestData;
		}

		const redirectTarget = config[requestData.route.id].checkFunction(validationResult);

		if (redirectTarget) {
			throw redirect(302, redirectTarget);
		}

		return requestData;
	};
	return R;
};
