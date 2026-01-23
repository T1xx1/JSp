/* https://gist.github.com/t3dotgg/a486c4ae66d32bf17c09c73609dacc5b */

type Success<T> = {
	data: T;
	error: null;
};
type Failure<E> = {
	data: null;
	error: E;
};

declare global {
	export type TryCatchResult<T, E> = Success<T> | Failure<E>;
}

export const tryCatchSync = <T, E = Error>(callback: () => T): TryCatchResult<T, E> => {
	try {
		return {
			data: callback(),
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			error: error as E,
		};
	}
};
export const tryCatch = async <T, E = Error>(
	callback: () => Promise<T>,
): Promise<TryCatchResult<T, E>> => {
	try {
		return {
			data: await callback(),
			error: null,
		};
	} catch (error) {
		return {
			data: null,
			error: error as E,
		};
	}
};
