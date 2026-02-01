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
		startLine: number;
		startCharacter: number;
		endLine: number;
		endCharacter: number;
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

		return getSourceFile(filename, languageVersion);
	};

	const tsProgram = createProgram([tsFilename(filename)], tsconfig.compilerOptions, host);

	return getPreEmitDiagnostics(tsProgram).map((diagnostic) => {
		const { line: startLine, character: startCharacter } = (
			diagnostic.file ?? source
		).getLineAndCharacterOfPosition(diagnostic.start ?? 0);
		const { line: endLine, character: endCharacter } = (
			diagnostic.file ?? source
		).getLineAndCharacterOfPosition((diagnostic.start ?? 0) + (diagnostic.length ?? 0));

		return {
			type: 'SemanticError' as const,
			message: flattenDiagnosticMessageText(diagnostic.messageText, sys.newLine),
			loc: {
				startLine: startLine,
				startCharacter: startCharacter,
				endLine: endLine,
				endCharacter: endCharacter,
			},
		};
	});
};
