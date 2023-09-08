import type { Page } from '@sveltejs/kit';
import { derived, type Readable } from 'svelte/store';

type UpdateSearchFunction<ValidatedType extends Record<string, unknown>> = (
	newParams: Partial<ValidatedType>
) => string;

type ResetSearchFunction<ValidatedType extends Record<string, unknown>> = (
	newParams: ValidatedType
) => string;

export const validatedSearchParamsStore = <
	ValidatedType extends Record<string, unknown>,
	PageStoreType extends Readable<Page<Record<string, string>, string | null>>
>(
	validation: (testObject: Record<string, unknown>) => ValidatedType,
	pageStore: PageStoreType
) => {
	const derivedStores = pageStore;
	const paramsReturn = derived<
		typeof derivedStores,
		{
			value: ValidatedType;
			updateSearch: UpdateSearchFunction<ValidatedType>;
			resetSearch: ResetSearchFunction<ValidatedType>;
		}
	>(pageStore, ($page) => {
		const processedParams = validateSearchParams($page.url, validation);
		const updateSearch: UpdateSearchFunction<ValidatedType> = (newParams) => {
			const combinedParams = { ...processedParams, ...newParams };

			const newURL = buildURL($page.url.pathname, combinedParams, validation);

			return newURL;
		};

		const resetSearch: ResetSearchFunction<ValidatedType> = (newParams) => {
			const newURL = buildURL($page.url.pathname, newParams, validation);

			return newURL;
		};

		return { value: processedParams, updateSearch, resetSearch };
	});

	return paramsReturn;
};

const objectToURLSearchParams = <ValidatedType extends Record<string, unknown>>(
	obj: ValidatedType,
	validation: (testObject: Record<string, unknown>) => ValidatedType
): URLSearchParams => {
	const validatedObject = validation(obj);

	const urlSearchParams = new URLSearchParams();

	Object.entries(validatedObject).forEach(([key, value]) => {
		if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
			urlSearchParams.append(key, value.toString());
			return;
		}
		urlSearchParams.append(key, JSON.stringify(value));
	});

	return urlSearchParams;
};

export const buildURL = <ValidatedType extends Record<string, unknown>>(
	url: string,
	obj: ValidatedType,
	validation: (testObject: Record<string, unknown>) => ValidatedType
): string => {
	const urlSearchParams = objectToURLSearchParams(obj, validation);

	return `${url}?${urlSearchParams.toString()}`;
};

const getUrlParams = (query: string): Record<string, unknown> =>
	Array.from(new URLSearchParams(query)).reduce(
		(p, [k, v]) => {
			try {
				const newValue: unknown = JSON.parse(v);
				return { ...p, [k]: newValue };
			} catch {
				return { ...p, [k]: v };
			}
		},
		{} as Record<string, unknown>
	);

export const validateSearchParams = <ReturnType>(
	url: URL,
	validation: (search: Record<string, unknown>) => ReturnType
): ReturnType => {
	const urlParamsObject = getUrlParams(url.search);

	return validation(urlParamsObject);
};
