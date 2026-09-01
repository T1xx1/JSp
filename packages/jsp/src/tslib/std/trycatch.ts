type Success<T> = {
	data: T;
	error: null;
};
type Failure<E> = {
	data: null;
	error: E;
};

type Result<T, E> = Success<T> | Failure<E>;

export const tryCatchSync = <T, E = Error>(callback: () => T): Result<T, E> => {
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
export const tryCatch = async <T, E = Error>(callback: () => Promise<T>): Promise<Result<T, E>> => {
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
