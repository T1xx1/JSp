import { cwd } from 'node:process';

import { checkConfig, getConfig } from '../core/config/config.js';
import { checkPackageJsonJsType, getPackageJson } from '../core/utils/packageJson.js';

export const exe = (fileName: string): void => {
	const CWD = cwd();
	const packageJson = getPackageJson(CWD);

	checkPackageJsonJsType(packageJson);

	const config = checkConfig({
		config: getConfig(CWD),
	});

	console.log(config, fileName);
};
