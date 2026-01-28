import { globSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { exit } from 'node:process';

import type { CompleteConfig } from '../config/index.js';
import { joinCwd, log } from '../utils/index.js';

import { compile } from './compile.js';

export const compileDir = (config: CompleteConfig) => {
	const filenames = globSync(config.include, {
		exclude: ['node_modules'],
	}).filter((f) => f.endsWith('.jsp'));

	if (filenames.length === 0) {
		log.warn('MKYEZ40S6C', 'No JS+ inputs found with current `include` configuration');

		exit();
	}

	for (const filename of filenames) {
		const emitPath = joinCwd(
			config.compiler.emitDir,
			filename.replace('.jsp', config.compiler.emitLang === 'TypeScript' ? '.ts' : '.js'),
		);

		mkdirSync(dirname(emitPath), { recursive: true });

		writeFileSync(emitPath, compile(readFileSync(filename, 'utf8'), config), 'utf8');
	}
};
