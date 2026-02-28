import { existsSync } from 'node:fs';
import { relative } from 'node:path';

import { types, type NodePath } from '@babel/core';
import { type Program } from '@babel/types';

import {
	emitCode,
	getEmitLangExt,
	getPolyfills,
	join,
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

					const importPath = relativePath === '' ? jspDir : join(relativePath, jspDir);

					path.unshiftContainer('body', t.importDeclaration([], t.stringLiteral(importPath)));
				},
			},
		},
	};
}

/*  */

const internalDir = './_jsp';

const internalEntrypoint = `import './polyfills/_';\n`;

export const getInternals = (): VirtualFileSystem => {
	const internals: VirtualFileSystem = [
		/* _jsp/_ */
		[internalDir + '/_', internalEntrypoint],
		/* _jsp/polyfills */
		...getPolyfills(),
	];

	return internals;
};

export const emitInterals = (config: CompleteConfig): void => {
	if (existsSync(join(config.rootDir, internalDir))) {
		throw printExitDiagnostic('Error', '`_jsp` is a reserved folder name');
	}

	const internals = getInternals();

	for (const [internalFilename, internalCode] of internals) {
		emitCode(internalFilename + getEmitLangExt(config), internalCode, config);
	}
};
