import { transpile } from 'typescript';

import { tsconfig, type CompleteConfig } from '../config/index.js';

import { parseTs, type Diagnostic } from './parse.js';
import { transform } from './transform.js';

export const compile = (
	filename: string,
	jspCode: string,
	config: CompleteConfig,
): {
	code: null | string;
	diagnostics: Diagnostic[];
} => {
	const ts = transform(jspCode, config);

	if (ts.syntaxError) {
		return {
			code: null,
			diagnostics: ts.ast.errors.map((error) => {
				return {
					type: 'SyntaxError',
					message: error.message,
					loc: {
						/* Babel line errors start at 1 */
						startLine: error.loc.line - 1,
						startCharacter: error.loc.column,
						endLine: error.loc.line - 1,
						endCharacter: error.loc.column + 1,
					},
				};
			}),
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
			return {
				type: 'Error' as const,
				message: error.message,
				loc: {
					/* Babel line errors start at 1 */
					startLine: error.loc.line - 1,
					startCharacter: error.loc.column,
					endLine: error.loc.line - 1,
					endCharacter: error.loc.column + 1,
				},
			};
		});
	const tsDiagnostics = parseTs(filename, ts.code);

	return {
		code:
			config.compiler.emitLang === 'TypeScript'
				? ts.code
				: transpile(ts.code, tsconfig.compilerOptions),
		diagnostics: [...babelDiagnostics, ...tsDiagnostics],
	};
};
