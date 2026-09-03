import { cwd } from 'node:process';

import { checkConfig, getConfig } from '#/core/config/config.js';
import { checkJsType } from '#/core/preflight.js';
import { getPackageJson } from '#/core/utils/packageJson.js';
import { compiler } from '#/compiler/compiler.js';

export const compile = (fileNames: string[]): void => {
	const CWD = cwd();
	const packageJson = getPackageJson(CWD);

	checkJsType(packageJson);

	const partialConfig = getConfig(CWD);

	if (fileNames.length > 0) {
		if (!('compiler' in partialConfig)) {
			partialConfig.compiler = {};
		}

		partialConfig.compiler.include = fileNames;
	}

	const config = checkConfig({
		config: partialConfig,
	});

	compiler({
		cwd: CWD,
		packageJson,
		config,
	});
};
