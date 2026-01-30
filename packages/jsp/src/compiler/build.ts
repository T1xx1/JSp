import chalk from 'chalk';

import { getConfig, mergeConfig } from '../config/index.js';

import { compile } from './compile.js';
import { getInputs } from './inputs.js';

export const build = () => {
	const config = mergeConfig(getConfig() ?? {});

	const inputs = getInputs(config);

	for (const input of inputs) {
		compile(input, config);
	}

	console.log(chalk.green('JS+ compiled successfully'));
};
