import { fileURLToPath } from 'node:url';
import { Diagnostic } from 'vscode-languageserver';
import { type TextDocument } from 'vscode-languageserver-textdocument';
import { flattenDiagnosticMessageText } from 'typescript';

import { tslsp } from './tslsp';

export const getDiagnostics = async (document: TextDocument): Promise<Diagnostic[]> => {
	const filename = fileURLToPath(document.uri);

	const tsDiagnostics = [
		...tslsp.getCompilerOptionsDiagnostics(),
		...tslsp.getSemanticDiagnostics(filename),
		...tslsp.getSyntacticDiagnostics(filename),
		...tslsp.getSuggestionDiagnostics(filename),
	];

	if (tsDiagnostics.length === 0) {
		return [];
	}

	const diagnostics: Diagnostic[] = [];

	for (const tsDiagnostic of tsDiagnostics) {
		if (!tsDiagnostic.file || !tsDiagnostic.start || !tsDiagnostic.length) {
			continue;
		}

		/* suppress chained comparisons error */
		if (
			tsDiagnostic.code === 2365 &&
			(flattenDiagnosticMessageText(tsDiagnostic.messageText, '\n').includes('>') ||
				flattenDiagnosticMessageText(tsDiagnostic.messageText, '\n').includes('<'))
		) {
			continue;
		}

		diagnostics.push({
			range: {
				start: document.positionAt(tsDiagnostic.start),
				end: document.positionAt(tsDiagnostic.start + tsDiagnostic.length),
			},
			message: flattenDiagnosticMessageText(tsDiagnostic.messageText, '\n'),
			code: `jsp(ts(${tsDiagnostic.code}))`,
		});
	}

	return diagnostics;
};
