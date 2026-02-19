declare global {
	interface PromiseConstructor {
		/**
		 * @see https://jsplang.vercel.app/language/polyfill/promiseallkeyed
		 */
		allKeyed<T extends Record<string | symbol, Promise<any>>>(
			promises: T,
		): Promise<{ [K in keyof T]: Awaited<T[K]> }>;

		/**
		 * @see https://jsplang.vercel.app/language/polyfill/promiseallkeyed
		 */
		allSettledKeyed<T extends Record<string | symbol, Promise<any>>>(
			promises: T,
		): Promise<{ [K in keyof T]: PromiseSettledResult<Awaited<T[K]>> }>;
	}
}

function enumerableKeys(object: Record<string | symbol, unknown>): (string | symbol)[] {
	return [
		...Object.keys(object),
		...Object.getOwnPropertySymbols(object).filter((s) =>
			Object.prototype.propertyIsEnumerable.call(object, s),
		),
	];
}

Promise.allKeyed = function (promises) {
	const keys = enumerableKeys(promises);
	return Promise.all(keys.map((k) => promises[k])).then((values) => {
		const result = {} as { [K in keyof typeof promises]: Awaited<(typeof promises)[K]> };
		keys.forEach((k, i) => {
			result[k as keyof typeof promises] = values[i];
		});
		return result;
	});
};

Promise.allSettledKeyed = function (promises) {
	const keys = enumerableKeys(promises);
	return Promise.allSettled(keys.map((k) => promises[k])).then((results) => {
		const result = {} as {
			[K in keyof typeof promises]: PromiseSettledResult<Awaited<(typeof promises)[K]>>;
		};
		keys.forEach((k, i) => {
			result[k as keyof typeof promises] = results[i];
		});
		return result;
	});
};
