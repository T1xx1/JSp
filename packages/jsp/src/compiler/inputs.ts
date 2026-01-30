import { globSync } from 'node:fs';
import { exit } from 'node:process';

import chalk from 'chalk';

import type { CompleteConfig } from '../config/index.js';

export const getInputs = (config: CompleteConfig) => {
	const inputs = globSync(config.include, {
		exclude: ['node_modules', config.compiler.emitDir],
	}).filter((f) => f.endsWith('.jsp'));

	if (inputs.length === 0) {
		console.log(chalk.red('No JS+ inputs found with current `include` configuration'));

		exit();
	}

	return inputs;
};
