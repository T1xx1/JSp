export const Random = {
	/**
	 * @returns A random number between 0 and 1
	 */
	random() {
		return Math.random();
	},
	/**
	 * @param low Minimum value. Defaults to 0
	 * @param high Maximum value. Defaults to 1
	 * @returns A random number between `low` and `high`
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
	 * @param high Minimum value. Defaults to 1
	 * @returns A random integer between `low` and `high`
	 */
	int(low: number = 0, high: number = 1) {
		return Math.floor(Math.random() * (high - low + 1)) + low;
	},
	/**
	 * @param low Minimum value. Defaults to 0n
	 * @param high Minimum value. Defaults to 1n
	 * @returns A random bigint between `low` and `high`
	 */
	bigint(low: bigint = 0n, high: bigint = 1n) {
		return BigInt(Math.floor(Math.random() * (Number(high) - Number(low) + 1))) + low;
	},
	/* bytes() {}, */
	/* fillBytes() {}, */
};
