import { flattenDiagnosticMessageText, getPreEmitDiagnostics, sys } from 'typescript';

import { Ts, type Diagnostic } from '../_.js';

export const parseCode = (filename: string, tsCode: string): Diagnostic[] => {
	const tsProgram = Ts.createProgram(filename, tsCode);

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
				type: Ts.convertDiagnosticCategory(diagnostic.category),
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
