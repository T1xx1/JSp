import type { PackageJson } from './packageJson.js';
import { printExit } from './print.js';

const exts = [
	/* JS */
	'.js',
	'.cjs',
	'.mjs',
	/* TS */
	'.ts',
	'.cts',
	'.mts',
	'.d.ts',
	'.d.cts',
	'.d.mts',
	/* JS+ */
	'.jsp',
] as const satisfies string[];

export const checkExt = (fileExt: string): void | never => {
	if (!exts.includes(fileExt)) {
		printExit({
			message: `\`${fileExt}\` extension is not supported. Only JavaScript, TypeScript and JS+ extensions are supported.`,
			severity: 'error',
		});
	}
};

/*  */

export type JsType = 'commonjs' | 'module';

export const checkJsType = (fileExt: string): void | never => {
	if (['.cjs', '.cts', '.d.cts'].includes(fileExt)) {
		printExit({
			message: 'CommonJS is not supported. Use ESM instead.',
			severity: 'error',
		});
	}
};
