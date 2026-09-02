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
		 * List of glob patterns of files to include in your program resolved in `srcDir`.
		 *
		 * @default ['./**']
		 */
		include?: string[];

		/**
		 * List of glob patterns of files to exclude from `include`.
		 *
		 * @default []
		 */
		exclude?: string[];

		/**
		 * Output directory.
		 *
		 * @default './dist'
		 */
		outputDir?: string;
	};
	dev?: {
		/**
		 * Clean `compiler.outputDir` before each compilation.
		 *
		 * @default false
		 */
		wipeOutputDir?: boolean;
	};
};
