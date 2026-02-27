import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { cwd } from 'node:process';

import { type CompleteConfig } from './_.js';

export const emit = (filename: string, content: string, config: CompleteConfig): void => {
	const emitPath = join(cwd(), config.compiler.emitDir, filename);

	mkdirSync(dirname(emitPath), { recursive: true });

	writeFileSync(emitPath, content, 'utf8');
};

export const getEmitLangExt = (config: CompleteConfig): string => {
	if (config.compiler.emitCodeLang === 'TypeScript') {
		return '.ts';
	}

	return '.js';
};

export const convertSrcToEmitFilename = (
	srcCodeFilename: string,
	config: CompleteConfig,
): string => {
	return relative(config.rootDir, srcCodeFilename).replace('.jsp', getEmitLangExt(config));
};
