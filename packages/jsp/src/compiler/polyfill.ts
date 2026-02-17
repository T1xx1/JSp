import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

import type { CompleteConfig } from '../config/index.js';

import { emit } from './emit.js';

const emitPackage = (packageName: string, filename: string, config: CompleteConfig) => {
	const filenamePath = join('_jsp', 'polyfills', filename);
	const packagePath = createRequire(import.meta.url).resolve(packageName);
	const packageRaw = `${readFileSync(packagePath, 'utf8')}export {};`;

	emit(filenamePath, packageRaw, config);
};

export const emitPolyfills = (config: CompleteConfig) => {
	emitPackage('@jsplang/polyfill-math-clamp', 'math-clamp.ts', config);
	emitPackage('@jsplang/polyfill-promise-ispromise', 'promise-ispromise.ts', config);
};
