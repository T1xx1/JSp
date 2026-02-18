declare global {
	interface PromiseConstructor {
		allKeyed<D extends Record<string | symbol, Promise<any>>>(
			promises: D,
		): Promise<{ [K in keyof D]: Awaited<D[K]> }>;

		allSettledKeyed<D extends Record<string | symbol, Promise<any>>>(
			promises: D,
		): Promise<{ [K in keyof D]: PromiseSettledResult<Awaited<D[K]>> }>;
	}
}

Promise.allKeyed = async (promises) => {
	const keys = [
		...Object.keys(promises),
		...Object.getOwnPropertySymbols(promises).filter((s) =>
			Object.prototype.propertyIsEnumerable.call(promises, s),
		),
	];

	return Promise.all(keys.map((k) => promises[k])).then((values) => {
		const result = {};
		keys.forEach((k, i) => {
			result[k] = values[i];
		});
		return result;
	});
};

Promise.allSettledKeyed = async (promises) => {
	const keys = [
		...Object.keys(promises),
		...Object.getOwnPropertySymbols(promises).filter((s) =>
			Object.prototype.propertyIsEnumerable.call(promises, s),
		),
	];

	return Promise.allSettled(keys.map((k) => promises[k])).then((results) => {
		const result = {};
		keys.forEach((k, i) => {
			result[k] = results[i];
		});
		return result;
	});
};
