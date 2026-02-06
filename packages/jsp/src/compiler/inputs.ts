import { globSync, readFileSync } from 'node:fs';

import chalk from 'chalk';

import type { CompleteConfig } from '../config/index.js';
import { exit } from '../utils/index.js';

export const getInputs = (config: CompleteConfig): string[] => {
	const inputs = globSync(config.include, {
		exclude: ['node_modules', config.compiler.emitDir],
	}).filter((f) => f.endsWith('.jsp'));

	if (inputs.length === 0) {
		throw exit('No JS+ inputs defined with current `include`/`exclude` configuration');
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
