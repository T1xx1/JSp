/**
 * Polyfill for the TC39 Iterator Chunking proposal
 * https://github.com/tc39/proposal-iterator-chunking
 *
 * Implements:
 *   - Iterator.prototype.chunks(chunkSize)
 *   - Iterator.prototype.windows(windowSize [, undersized])
 */

type UndersizedOption = 'only-full' | 'allow-partial';

declare global {
	interface Iterator<T, TReturn, TNext> {
		/**
		 * Returns an iterator of arrays, each of length `chunkSize`, containing
		 * successive non-overlapping chunks of the underlying iterator's values.
		 * The final chunk may be shorter than `chunkSize` if the iterator is
		 * exhausted before a full chunk is accumulated.
		 *
		 * @param chunkSize - A positive integer (1 ≤ chunkSize ≤ 2^32 − 1).
		 * @throws {RangeError} If `chunkSize` is not a positive integer in range.
		 *
		 * @example
		 * [...[1, 2, 3, 4, 5].values().chunks(2)]
		 * // → [[1, 2], [3, 4], [5]]
		 *
		 * @see https://jsplang.vercel.app/language/polyfill/iteratorchunking
		 */
		chunks(chunkSize: number): IteratorObject<T[], undefined, unknown>;

		/**
		 * Returns an iterator of arrays representing a sliding window of size
		 * `windowSize` over the underlying iterator's values.
		 *
		 * @param windowSize - A positive integer (1 ≤ windowSize ≤ 2^32 − 1).
		 * @param undersized - Controls whether a partial final window is emitted.
		 *   - `"only-full"` (default): only windows of exactly `windowSize` are yielded.
		 *   - `"allow-partial"`: a partial window at the end is also yielded.
		 * @throws {RangeError} If `windowSize` is not a positive integer in range.
		 * @throws {TypeError} If `undersized` is not a valid option string.
		 *
		 * @example
		 * [...[1, 2, 3, 4, 5].values().windows(3)]
		 * // → [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
		 *
		 * @example
		 * [...[1, 2, 3, 4].values().windows(3, "allow-partial")]
		 * // → [[1, 2, 3], [2, 3, 4], [3, 4], [4]]
		 *
		 * @see https://jsplang.vercel.app/language/polyfill/iteratorchunking
		 */
		windows(
			windowSize: number,
			undersized?: UndersizedOption,
		): IteratorObject<T[], undefined, unknown>;
	}
}

const MAX_SIZE = 2 ** 32 - 1;

function isValidSize(n: unknown): n is number {
	return typeof n === 'number' && Number.isInteger(n) && n >= 1 && n <= MAX_SIZE;
}

// Obtain Iterator.prototype via a generator
const IteratorPrototype: object = Object.getPrototypeOf(Object.getPrototypeOf((function* () {})()));

(IteratorPrototype as any).chunks = function <T>(
	this: Iterator<T>,
	chunkSize: number,
): IterableIterator<T[]> {
	if (typeof this !== 'object' || this === null) {
		throw new TypeError('Iterator.prototype.chunks called on non-object');
	}

	if (!isValidSize(chunkSize)) {
		try {
			(this as IterableIterator<T>).return?.();
		} catch {
			/* swallow */
		}
		throw new RangeError('chunkSize must be a positive integer no greater than 2^32 - 1');
	}

	const iterated = this;

	return (function* (): Generator<T[], undefined, unknown> {
		let buffer: T[] = [];

		for (;;) {
			const result: IteratorResult<T> = iterated.next();

			if (result.done) {
				// Yield any remaining items as a final partial chunk
				if (buffer.length > 0) yield buffer;
				return undefined;
			}

			buffer.push(result.value);

			if (buffer.length === chunkSize) {
				// IfAbruptCloseIterator: the generator protocol handles .return()
				// on the outer iterator automatically if this generator is closed.
				void (yield buffer);
				buffer = [];
			}
		}
	})() as IterableIterator<T[]>;
};

(IteratorPrototype as any).windows = function <T>(
	this: Iterator<T>,
	windowSize: number,
	undersized?: UndersizedOption,
): IterableIterator<T[]> {
	if (typeof this !== 'object' || this === null) {
		throw new TypeError('Iterator.prototype.windows called on non-object');
	}

	if (!isValidSize(windowSize)) {
		try {
			(this as IterableIterator<T>).return?.();
		} catch {
			/* swallow */
		}
		throw new RangeError('windowSize must be a positive integer no greater than 2^32 - 1');
	}

	undersized ??= 'only-full';

	if (undersized !== 'only-full' && undersized !== 'allow-partial') {
		try {
			(this as IterableIterator<T>).return?.();
		} catch {
			/* swallow */
		}
		throw new TypeError('undersized must be "only-full" or "allow-partial"');
	}

	const iterated = this;
	const allowPartial = undersized === 'allow-partial';

	return (function* (): Generator<T[], undefined, unknown> {
		const buffer: T[] = [];

		for (;;) {
			const result: IteratorResult<T> = iterated.next();

			if (result.done) {
				// Yield the partial window at the end if requested
				if (allowPartial && buffer.length > 0 && buffer.length < windowSize) {
					yield [...buffer];
				}
				return undefined;
			}

			// Slide the window: drop the oldest element when at capacity
			if (buffer.length === windowSize) buffer.shift();
			buffer.push(result.value);

			if (buffer.length === windowSize) {
				void (yield [...buffer]);
			}
		}
	})() as IterableIterator<T[]>;
};
