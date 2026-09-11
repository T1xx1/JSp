import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import type { JsType } from './module.js';
import { printExit } from './print.js';

export type PackageJson = {
	type?: JsType;
};

/*  */

export const getPackageJson = (cwd: string): PackageJson => {
	const path = join(cwd, 'package.json');

	if (!existsSync(path)) {
		return {};
	}

	return JSON.parse(readFileSync(path, 'utf8')) as PackageJson;
};

/*  */

export const checkPackageJsonJsType = (packageJson: PackageJson): void | never => {
	if (!('type' in packageJson) || packageJson.type === 'commonjs') {
		printExit({
			message: 'CommonJS is not supported. Set `type: "module"` in your `package.json`.',
			severity: 'error',
		});
	}
};
