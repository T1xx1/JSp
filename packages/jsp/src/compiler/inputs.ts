import { globSync, readFileSync } from 'node:fs';
import { exit } from 'node:process';

import chalk from 'chalk';

import type { CompleteConfig } from '../config/index.js';

export const getInputs = (config: CompleteConfig): string[] => {
	const inputs = globSync(config.include, {
		exclude: ['node_modules', config.compiler.emitDir],
	}).filter((f) => f.endsWith('.jsp'));

	if (inputs.length === 0) {
		console.log(chalk.red('No JS+ inputs defined in the current `include` configuration'));

		exit();
	}

	return inputs;
};

export const readInput = (filename: string): null | string => {
	const jspCode = readFileSync(filename, 'utf8');

	if (jspCode === '') {
		console.log(chalk.gray(`${filename} is empty`));

		return null;
	}

	return jspCode;
};
