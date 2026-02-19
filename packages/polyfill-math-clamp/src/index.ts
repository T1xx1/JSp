declare global {
	interface Math {
		/**
		 * Constrains a number to stay within a given range.
		 * @throws {RangeError} If min is greater than max.
		 *
		 * @see https://jsplang.vercel.app/language/polyfill/mathclamp
		 */
		clamp(value: number, min: number, max: number): number;
	}
}

Math.clamp = function (value, min, max) {
	if (min > max) {
		throw new RangeError(`min (${min}) must not be greater than max (${max})`);
	}

	return Math.min(Math.max(min, value), max);
};
