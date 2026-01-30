import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { cwd } from 'node:process';

import type { CompleteConfig } from '../config/index.js';

export const emit = (filename: string, outCode: string, config: CompleteConfig) => {
	const emitPath = join(
		cwd(),
		config.compiler.emitDir,
		filename.replace('.jsp', config.compiler.emitLang === 'TypeScript' ? '.ts' : '.js'),
	);

	mkdirSync(dirname(emitPath), { recursive: true });

	writeFileSync(emitPath, outCode, 'utf8');
};
