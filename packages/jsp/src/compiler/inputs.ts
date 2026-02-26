import { globSync } from 'node:fs';
import { join, normalize } from 'node:path';

import type { Config } from '../config/index.js';
import { printExitDiagnostic } from '../utils/index.js';

/**
 * Get JS+ inputs in the current working directory.
 * @returns JS+ filenames
 */
export const getInputs = (config: Config): string[] => {
	const inputs = globSync(
		config.include.map((filename) => {
			return join(config.rootDir, normalize(filename));
		}),
		{
			exclude: [
				'node_modules',
				normalize(config.compiler.emitDir),
				...config.exclude.map((filename) => {
					return join(config.rootDir, normalize(filename));
				}),
			],
		},
	).filter((f) => f.endsWith('.jsp'));

	if (inputs.length === 0) {
		throw printExitDiagnostic(
			'Error',
			'No JS+ inputs defined with current `include`/`exclude` configuration',
		);
	}

	return inputs;
};
