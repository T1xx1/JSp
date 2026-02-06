import { globSync, readFileSync } from 'node:fs';
import { join, normalize } from 'node:path';

import chalk from 'chalk';

import type { CompleteConfig } from '../config/index.js';
import { exit } from '../utils/index.js';

/**
 * Get JS+ inputs in the current working directory.
 * @returns JS+ filenames
 */
export const getInputs = (config: CompleteConfig): string[] => {
	const inputs = globSync(
		config.include.map((filename) => {
			return join(config.rootDir, normalize(filename));
		}),
		{
			exclude: ['node_modules', join(config.rootDir, normalize(config.compiler.emitDir))],
		},
	).filter((f) => f.endsWith('.jsp'));

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
