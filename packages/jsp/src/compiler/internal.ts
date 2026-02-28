import { existsSync } from 'node:fs';
import { join, relative } from 'node:path';

import { types, type NodePath } from '@babel/core';
import { type Program } from '@babel/types';

import {
	emitCode,
	getEmitLangExt,
	getPolyfills,
	normalizeSlashes,
	printExitDiagnostic,
	type CompleteConfig,
	type VirtualFileSystem,
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

					const relativePath = '../'.repeat(
						relative(config.rootDir, filename).split('\\').length - 1,
					);

					const importPath =
						relativePath === '' ? jspDir : normalizeSlashes(join(relativePath, jspDir));

					path.unshiftContainer('body', t.importDeclaration([], t.stringLiteral(importPath)));
				},
			},
		},
	};
}

/*  */

const internalDir = './_jsp';

const internalEntrypoint = `import './polyfills/_';\n`;

export const getInternals = (config: CompleteConfig): VirtualFileSystem => {
	const internals: VirtualFileSystem = [
		/* _jsp/_ */
		[join(internalDir, '_' + getEmitLangExt(config)), internalEntrypoint],
		/* _jsp/polyfills */
		...getPolyfills(config),
	];

	return internals;
};

export const emitInterals = (config: CompleteConfig): void => {
	if (existsSync(join(config.rootDir, internalDir))) {
		throw printExitDiagnostic('Error', '`_jsp` is a reserved folder name');
	}

	const internals = getInternals(config);

	for (const [internalFilename, internalCode] of internals) {
		emitCode(internalFilename, internalCode, config);
	}
};
