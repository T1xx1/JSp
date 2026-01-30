import type { CompleteConfig } from '../config/index.js';

import { emit } from './emit.js';
import { readInput } from './inputs.js';
import { transform } from './transform.js';

export const compile = (filename: string, config: CompleteConfig) => {
	const jspCode = readInput(filename);

	if (jspCode === null) {
		return;
	}

	const out = transform(jspCode, config);

	emit(filename, out.code, config);
};
