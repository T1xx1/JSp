import { DiagnosticSeverity, type Diagnostic } from 'vscode-languageserver';
import { type TextDocument } from 'vscode-languageserver-textdocument';
import { LanguageServiceHost } from 'typescript/lib/tsserverlibrary';

const maxProblems = 100;

export const getDiagnostics = async (textDocument: TextDocument): Promise<Diagnostic[]> => {
	const text = textDocument.getText();

	const pattern = /\b[A-Z]{2,}\b/g;
	let m: RegExpExecArray | null;

	let problems = 0;

	const diagnostics: Diagnostic[] = [];

	while ((m = pattern.exec(text)) && problems < maxProblems) {
		problems++;

		const diagnostic: Diagnostic = {
			severity: DiagnosticSeverity.Warning,
			range: {
				start: textDocument.positionAt(m.index),
				end: textDocument.positionAt(m.index + m[0].length),
			},
			message: `${m[0]} is all uppercase.`,
			source: 'ex',
		};

		diagnostic.relatedInformation = [
			{
				location: {
					uri: textDocument.uri,
					range: Object.assign({}, diagnostic.range),
				},
				message: 'Spelling matters',
			},
			{
				location: {
					uri: textDocument.uri,
					range: Object.assign({}, diagnostic.range),
				},
				message: 'Particularly for names',
			},
		];

		diagnostics.push(diagnostic);
	}

	return diagnostics;
};
