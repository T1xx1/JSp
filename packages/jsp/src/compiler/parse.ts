import { join } from 'node:path';
import { cwd } from 'node:process';

import {
	createCompilerHost,
	createProgram,
	createSourceFile,
	flattenDiagnosticMessageText,
	getPreEmitDiagnostics,
	sys,
} from 'typescript';

import { tsconfig } from '../config/index.js';

export type Diagnostic = {
	type: 'Error' | 'SemanticError' | 'SyntaxError';
	message: string;
	loc: {
		line: number;
		character: number;
		length: number;
	};
};

export const tsFilename = (filename: string): string => {
	return join(cwd(), `${filename}.ts`.replaceAll('\\', '/').toLowerCase());
};

export const parseTs = (filename: string, tsCode: string): Diagnostic[] => {
	const source = createSourceFile(tsFilename(filename), tsCode, tsconfig.compilerOptions.target);

	const host = createCompilerHost(tsconfig.compilerOptions);
	const getSourceFile = host.getSourceFile;

	host.getSourceFile = (filename, languageVersion) => {
		if (filename.includes('.jsp')) {
			return source;
		}

		/* normalize filename */
		const normalizedFilename = join(
			cwd(),
			...filename
				.replaceAll('\\', '/')
				.split('/')
				.slice(filename.split('/').indexOf('node_modules')),
		);

		return getSourceFile(normalizedFilename, languageVersion);
	};

	const tsProgram = createProgram([tsFilename(filename)], tsconfig.compilerOptions, host);

	return getPreEmitDiagnostics(tsProgram).map((diagnostic) => {
		console.log(diagnostic);
		const { line, character } = source.getLineAndCharacterOfPosition(diagnostic.start ?? 0);

		return {
			type: 'SemanticError' as const,
			message: flattenDiagnosticMessageText(diagnostic.messageText, sys.newLine),
			loc: {
				line: line + 1,
				character: character,
				length: diagnostic.length!,
			},
		};
	});
};
