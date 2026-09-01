export type Config = {
	/**
	 * Compiler options.
	 */
	compiler?: {
		/**
		 * Source directory.
		 *
		 * @default './src'
		 */
		srcDir?: string;

		/**
		 * Output directory.
		 *
		 * @default './dist'
		 */
		outputDir?: string;
	};
};
