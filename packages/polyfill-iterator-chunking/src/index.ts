declare global {
	interface Iterator<T, TReturn, TNext> {
		chunks(size: number): Iterator<T[], TReturn, TNext>;
		windows(size: number): Iterator<T[], TReturn, TNext>;
	}
}

const IteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]()));

IteratorPrototype.chunks = function* chunks(size) {
	if (!Number.isInteger(size) || size <= 0) {
		throw new RangeError('chunks: size must be a positive integer');
	}
	let chunk = [];
	for (const value of { [Symbol.iterator]: () => this }) {
		chunk.push(value);
		if (chunk.length === size) {
			yield chunk;
			chunk = [];
		}
	}
	if (chunk.length > 0) {
		yield chunk;
	}
};

IteratorPrototype.windows = function* windows(size) {
	if (!Number.isInteger(size) || size <= 0) {
		throw new RangeError('windows: size must be a positive integer');
	}
	const window: unknown[] = [];
	for (const value of { [Symbol.iterator]: () => this }) {
		window.push(value);
		if (window.length === size) {
			yield [...window];
			window.shift();
		}
	}
};
