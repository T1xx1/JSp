import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';

import { types, type NodePath } from '@babel/core';
import { type Program } from '@babel/types';

import {
	emitCode,
	emitPolyfills,
	getEmitLangExt,
	normalizeSlashes,
	printExitDiagnostic,
	type CompleteConfig,
} from './_.js';

export function transformInternalVisitor(
	filename: string,
	config: CompleteConfig,
	t: typeof types,
) {
	return {
		visitor: {
			Program: {
				exit(path: NodePath<Program>) {
					const jspDir = './_jsp/_';
					const relativeDir = '../'.repeat(
						relative(config.rootDir, filename).split('\\').length - 1,
					);

					path.unshiftContainer(
						'body',
						t.importDeclaration([], t.stringLiteral(normalizeSlashes(join(relativeDir, jspDir)))),
					);
				},
			},
		},
	};
}

/*  */

export const internalDir = '_jsp';

const internalIndex = `import './polyfills/_';`;

export const emitInterals = (config: CompleteConfig) => {
	if (existsSync(join(config.rootDir, internalDir))) {
		throw printExitDiagnostic('Error', '`_jsp` is a reserved folder name');
	}

	emitCode(join(internalDir, '_' + getEmitLangExt(config)), internalIndex, config);

	emitPolyfills(config);
};
