import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, parse, relative } from 'node:path';
import { cwd } from 'node:process';

import { transpile } from 'typescript';

import { tsconfig, type CompleteConfig } from '../config/index.js';

import type { SourceMap } from './compile.js';

export const emit = (filename: string, data: string, config: CompleteConfig) => {
	const emitPath = join(cwd(), config.compiler.emitDir, filename);

	mkdirSync(dirname(emitPath), { recursive: true });

	writeFileSync(emitPath, data, 'utf8');
};

export const getCodeEmitFilename = (filename: string, config: CompleteConfig) => {
	return relative(config.rootDir, filename).replace(
		'.jsp',
		config.compiler.emitLang === 'TypeScript' ? '.ts' : '.js',
	);
};

export const emitCode = (filename: string, outCode: string, config: CompleteConfig) => {
	if (config.compiler.emitEnabled && config.compiler.emitLang === 'JavaScript') {
		outCode = transpile(outCode, tsconfig.compilerOptions);
	}

	emit(getCodeEmitFilename(filename, config), outCode, config);
};
export const emitSourceMap = (
	filename: string,
	outSourceMap: SourceMap,
	config: CompleteConfig,
) => {
	emit(
		`${getCodeEmitFilename(filename, config)}.map`,
		JSON.stringify({
			version: outSourceMap.version,
			file: getCodeEmitFilename(parse(filename).base, config).replaceAll('\\', '/'),
			sourceRoot: '',
			sources: [join('../', filename).replaceAll('\\', '/')],
			names: [],
			mappings: outSourceMap.mappings,
		}),
		config,
	);
};
