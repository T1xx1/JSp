import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

import type { Config } from '../config/index.js';
import { printExitDiagnostic } from '../utils/index.js';

import { emit } from './emit.js';

const polyfillsDir = join('./_jsp', 'polyfills');

const emitPackage = (packageName: string, filename: string, config: Config) => {
	const filenamePath = join(polyfillsDir, filename);
	const packagePath = createRequire(import.meta.url).resolve(packageName);
	const packageRaw = `${readFileSync(packagePath, 'utf8')};export {};`;

	emit(filenamePath, packageRaw, config);
};

export const emitPolyfills = (config: Config) => {
	if (existsSync(join(config.rootDir, '_jsp'))) {
		throw printExitDiagnostic('Error', '`_jsp` is a reserved folder name');
	}

	const polyfills: {
		packageName: string;
		emitFilename: string;
	}[] = [
		{
			packageName: '@jsplang/polyfill-iterator-chunking',
			emitFilename: './iterator-chunking.ts',
		},
		{
			packageName: '@jsplang/polyfill-math-clamp',
			emitFilename: './math-clamp.ts',
		},
		{
			packageName: '@jsplang/polyfill-object-propertycount',
			emitFilename: './object-propertycount.ts',
		},
		{
			packageName: '@jsplang/polyfill-promise-allkeyed',
			emitFilename: './promise-allkeyed.ts',
		},
		{
			packageName: '@jsplang/polyfill-promise-ispromise',
			emitFilename: './promise-ispromise.ts',
		},
		{
			packageName: '@jsplang/polyfill-random-namespace',
			emitFilename: './random.ts',
		},
	];

	for (const polyfill of polyfills) {
		emitPackage(polyfill.packageName, polyfill.emitFilename, config);
	}

	/* _jsp/polyfill/index */
	const polyfillsIndex = polyfills
		.map((polyfills) => {
			return `import '${polyfills.emitFilename}';`;
		})
		.join('\n');

	emit(join(polyfillsDir, 'index.ts'), polyfillsIndex, config);

	/* _jsp/index */
	emit(join('./_jsp', 'index.ts'), "import './polyfills/index';", config);
};
