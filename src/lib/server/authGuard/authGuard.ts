import { error, redirect, type RequestEvent } from '@sveltejs/kit';

export type allowedFunction<UserValidationOutput extends Record<string, boolean | string>> = (
	data: UserValidationOutput
) => string | undefined | null;

export type RouteConfig<UserValidationOutput extends Record<string, boolean | string>> = {
	check: allowedFunction<UserValidationOutput>;
	POSTCheck?: Record<string, allowedFunction<UserValidationOutput>>;
};

export const combinedAuthGuard = <
	VType extends (
		data: RequestEvent<Partial<Record<string, string>>, U>
	) => Record<string, string | boolean>,
	VReturn extends ReturnType<VType>,
	AllowList extends string[],
	BlockList extends string[],
	T extends { [key: string]: RouteConfig<VReturn> },
	U extends (keyof T & string) | AllowList[0] | BlockList[0]
>({
	routeConfig,
	validation,
	allowList,
	blockList,
	defaultAllow = false,
	defaultBlockTarget,
	routeNotFoundMessage = 'No route config found for this route.',
	defaultAllowPOST = false,
	postNotAllowedMessage = 'POST not allowed for this request.'
}: {
	routeConfig: T;
	validation: VType;
	allowList?: AllowList;
	blockList?: BlockList;
	defaultAllow?: boolean;
	defaultBlockTarget?: string;
	routeNotFoundMessage?: string;
	defaultAllowPOST?: boolean;
	postNotAllowedMessage?: string;
}) => {
	const R = <S extends RequestEvent<Partial<Record<string, string>>, U>>(
		requestData: S,
		customValidation?: (data: VReturn) => string | undefined | null
	) => {
		if (allowList && allowList.includes(requestData.route.id)) {
			return requestData;
		}

		if (blockList && blockList.includes(requestData.route.id)) {
			if (defaultBlockTarget) {
				throw redirect(302, defaultBlockTarget);
			} else {
				throw error(400, routeNotFoundMessage);
			}
		}

		const currentRouteConfig = routeConfig[requestData.route.id];

		if (!currentRouteConfig) {
			if (defaultAllow) {
				return requestData;
			} else if (!defaultBlockTarget) {
				throw error(400, routeNotFoundMessage);
			} else {
				throw redirect(302, defaultBlockTarget);
			}
		}

		const validationResult = validation(requestData) as VReturn;

		const redirectTarget = currentRouteConfig.check(validationResult);
		const customValidationResult = customValidation
			? customValidation(validationResult)
			: undefined;

		if (redirectTarget) {
			throw redirect(302, redirectTarget);
		}

		if (customValidationResult) {
			throw redirect(302, customValidationResult);
		}

		if (requestData.request.method === 'POST') {
			const postCheck = currentRouteConfig.POSTCheck
				? requestData.url.search
					? currentRouteConfig.POSTCheck[requestData.url.search.replace('?/', '')]
					: currentRouteConfig.POSTCheck['default']
				: undefined;
			if (!postCheck) {
				if (defaultAllowPOST) {
					return requestData;
				} else {
					throw error(400, postNotAllowedMessage);
				}
			}

			const postCheckResult = postCheck(validationResult);

			if (postCheckResult) {
				throw error(400, postCheckResult);
			}
		}

		return requestData;
	};
	return R;
};
