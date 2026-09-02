import { globSync } from 'node:fs';

import type { Config } from '../config/config.js';
import { join } from 'node:path';

export type File = {
	name: string;
	content: string;
};

export const getSourceFileNames = (config: Config): string[] => {
	return globSync(
		config.compiler.include.map((path) => {
			return join(config.compiler.srcDir, path);
		}),
		{
			exclude: ['node_modules'],
		},
	).filter((fileName) => {
		return fileName.endsWith('.jsp');
	});
};
