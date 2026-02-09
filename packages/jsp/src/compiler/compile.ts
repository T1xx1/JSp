import { transpile } from 'typescript';

import { tsconfig, type CompleteConfig } from '../config/index.js';

import { parseTs, type Diagnostic } from './parse.js';
import { transform, type SourceMap } from './transform.js';

export type Out =
	| {
			sourceMap: null;
			diagnostics: Diagnostic[];
			code: null;
	  }
	| {
			sourceMap: SourceMap;
			diagnostics: Diagnostic[];
			code: string;
	  };

export const compile = (filename: string, jspCode: string, config: CompleteConfig): Out => {
	const ts = transform(filename, jspCode, config);

	if (ts.code === null) {
		return {
			sourceMap: null,
			diagnostics: ts.ast.errors.map((error) => {
				return {
					type: 'Error',
					category: 'Syntax',
					message: error.message,
					loc: {
						/* line index start at 1 */
						startLine: error.loc.line - 1,
						startCharacter: error.loc.column,
						endLine: error.loc.line - 1,
						/* 1 length error */
						endCharacter: error.loc.column + 1,
					},
				};
			}),
			code: null,
		};
	}

	const babelDiagnostics = ts.ast.errors
		.filter((error) => {
			const ignoreReasonCodes = ['DeclarationMissingInitializer'];

			if (ignoreReasonCodes.includes(error.reasonCode)) {
				return false;
			}

			return true;
		})
		.map((error) => {
			/* @ts-expect-error */
			if (error.type) {
				return error as unknown as Diagnostic;
			}

			return {
				type: 'Error' as const,
				category: 'Semantic' as const,
				message: error.message,
				loc: {
					/* index starts at 1 */
					startLine: error.loc.line - 1,
					startCharacter: error.loc.column,
					endLine: error.loc.line - 1,
					/* 1 length error */
					endCharacter: error.loc.column + 1,
				},
			};
		});
	const tsDiagnostics = parseTs(filename, ts.code);

	const code =
		config.compiler.emitLang === 'TypeScript'
			? ts.code
			: transpile(ts.code, tsconfig.compilerOptions);

	return {
		sourceMap: ts.map,
		diagnostics: [...babelDiagnostics, ...tsDiagnostics],
		code,
	};
};
