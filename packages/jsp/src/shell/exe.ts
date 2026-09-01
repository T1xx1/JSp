import { cwd } from 'node:process';

import { checkConfig, getConfig } from '../core/config/config.js';
import { checkJsType } from '../core/preflight.js';
import { getPackageJson } from '../core/utils/packageJson.js';

export const exe = (fileNames: string[]): void => {
	const CWD = cwd();
	const packageJson = getPackageJson({ cwd: CWD });

	checkJsType({ packageJson });

	const config = checkConfig({
		config: getConfig({ cwd: CWD }),
	});

	console.log(config, fileNames);
};
