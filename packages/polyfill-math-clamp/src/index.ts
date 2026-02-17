declare global {
	interface Math {
		/**
		 * Clamps a number between a minimum and maximum value.
		 */
		clamp: (value: number, min: number, max: number) => number;
	}
}

Math.clamp = (value, min, max) => {
	return Math.min(Math.max(value, min), max);
};
