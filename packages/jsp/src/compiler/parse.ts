import { join } from 'node:path';
import { cwd } from 'node:process';

import {
	createCompilerHost,
	createProgram,
	createSourceFile,
	DiagnosticCategory,
	flattenDiagnosticMessageText,
	getPreEmitDiagnostics,
	sys,
} from 'typescript';

import { tsconfig } from '../config/index.js';

export type Diagnostic = {
	type: 'Warning' | 'Error';
	category: 'Runtime' | 'Semantic' | 'Syntax';
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
	const host = createCompilerHost(tsconfig.compilerOptions);
	const getSourceFile = host.getSourceFile;

	host.getSourceFile = (filename, languageVersion) => {
		if (filename.includes('.jsp')) {
			const source = createSourceFile(
				tsFilename(filename),
				tsCode,
				tsconfig.compilerOptions.target,
			);

			return source;
		}

		return getSourceFile(filename, languageVersion);
	};

	const tsProgram = createProgram([tsFilename(filename)], tsconfig.compilerOptions, host);

	return getPreEmitDiagnostics(tsProgram)
		.filter((diagnostic) => {
			return !!diagnostic.file;
		})
		.map((diagnostic) => {
			const { line: startLine, character: startCharacter } =
				diagnostic.file!.getLineAndCharacterOfPosition(diagnostic.start ?? 0);
			const { line: endLine, character: endCharacter } =
				diagnostic.file!.getLineAndCharacterOfPosition(
					(diagnostic.start ?? 0) + (diagnostic.length ?? 0),
				);

			return {
				type: diagnostic.category === DiagnosticCategory.Warning ? 'Warning' : 'Error',
				category: 'Semantic',
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
