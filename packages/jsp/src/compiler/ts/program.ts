import {
	createCompilerHost,
	createProgram as tsCreateProgram,
	createSourceFile,
	type Program,
} from 'typescript';

import { Ts } from '../_.js';

export const createProgram = (filename: string, tsCode: string): Program => {
	const host = createCompilerHost(Ts.config.compilerOptions);
	const defaultGetSourceFile = host.getSourceFile;

	host.getSourceFile = (id, languageVersion) => {
		if (id.endsWith('.jsp')) {
			const sourceFile = createSourceFile(
				Ts.normalizeJspFilename(id),
				tsCode,
				Ts.config.compilerOptions.target,
			);

			return sourceFile;
		}

		return defaultGetSourceFile(id, languageVersion);
	};

	return tsCreateProgram([Ts.normalizeJspFilename(filename)], Ts.config.compilerOptions, host);
};
