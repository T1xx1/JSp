declare global {
	interface PromiseConstructor {
		/**
		 * Returns true if the given value is a thenable (Promises/A+ compatible).
		 * Note: this checks for duck-typed thenables, not strictly Promise instances.
		 * 
		 * @see https://jsplang.vercel.app/language/polyfill/promiseispromise
		 */
		isPromise(value: unknown): value is PromiseLike<unknown>;
	}
}

Promise.isPromise = function isPromise(value): value is PromiseLike<unknown> {
	return (
		!!value &&
		(typeof value === 'object' || typeof value === 'function') &&
		typeof (value as Record<string, unknown>).then === 'function'
	);
};
