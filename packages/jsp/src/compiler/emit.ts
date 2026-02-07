import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, parse, relative } from 'node:path';
import { cwd } from 'node:process';

import type { CompleteConfig } from '../config/index.js';
import type { SourceMap } from './transform.js';

export const emit = (filename: string, data: string, config: CompleteConfig) => {
	const emitPath = join(cwd(), config.compiler.emitDir, relative(config.rootDir, filename));

	mkdirSync(dirname(emitPath), { recursive: true });

	writeFileSync(emitPath, data, 'utf8');
};

export const getEmitCodeFilename = (filename: string, config: CompleteConfig) => {
	return filename.replace('.jsp', config.compiler.emitLang === 'TypeScript' ? '.ts' : '.js');
};

export const emitCode = (filename: string, outCode: string, config: CompleteConfig) => {
	emit(getEmitCodeFilename(filename, config), outCode, config);
};
export const emitSourceMap = (
	filename: string,
	outSourceMap: SourceMap,
	config: CompleteConfig,
) => {
	emit(
		`${filename}.map.json`,
		JSON.stringify({
			version: outSourceMap.version,
			file: getEmitCodeFilename(parse(filename).base, config).replaceAll('\\', '/'),
			sourceRoot: '',
			sources: [join('../', filename).replaceAll('\\', '/')],
			names: [],
			mappings: outSourceMap.mappings,
		}),
		config,
	);
};
