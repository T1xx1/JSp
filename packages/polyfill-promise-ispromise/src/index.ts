declare global {
	interface Promise<T> {
		isPromise: (object: object) => boolean;
	}
}

Promise.isPromise = (object) => {
	return (
		!!object &&
		(typeof object === 'object' || typeof object === 'function') &&
		typeof object.then === 'function'
	);
};
