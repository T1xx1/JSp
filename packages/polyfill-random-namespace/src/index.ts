/**
 * @see https://jsplang.vercel.app/language/polyfill/randomnamespace
 */
/* @ts-expect-error */
globalThis.Random = {
	/**
	 * @returns A random number between 0 and 1
	 *
	 * @see https://jsplang.vercel.app/language/polyfill/randomnamespace
	 */
	random() {
		return Math.random();
	},
	/**
	 * @param low Minimum value. Defaults to 0
	 * @param high Maximum value. Defaults to 1
	 * @returns A random number between `low` and `high`
	 *
	 * @see https://jsplang.vercel.app/language/polyfill/randomnamespace
	 */
	number(low: number = 0, high: number = 1) {
		if (low >= high) {
			throw new RangeError('`low` cannot be greater or equal than `high`');
		}

		return Math.random() * (high - low) + low;
	},
	/* range() {}, */
	/**
	 * @param low Minimum value. Defaults to 0
	 * @param high Maximum value. Defaults to 1
	 * @returns A random integer between `low` and `high`
	 *
	 * @see https://jsplang.vercel.app/language/polyfill/randomnamespace
	 */
	int(low: number = 0, high: number = 1) {
		if (low >= high) {
			throw new RangeError('`low` cannot be greater or equal than `high`');
		}

		return Math.floor(Math.random() * (high - low + 1)) + low;
	},
	/* bigint() {}, */
	/* bytes() {}, */
	/* fillBytes() {}, */
};
