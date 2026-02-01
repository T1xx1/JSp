import {
	Diagnostic,
	DiagnosticSeverity,
	Range,
	type DiagnosticCollection,
	type TextDocument,
} from 'vscode';

import { compile } from 'jsp/compiler';
import { completeConfig } from 'jsp/config';

export const analyze = (document: TextDocument, diagnosticsCollection: DiagnosticCollection) => {
	if (document.languageId !== 'jsp') {
		return;
	}

	diagnosticsCollection.set(document.uri, []);

	const out = compile(document.fileName, document.getText(), completeConfig);

	diagnosticsCollection.set(
		document.uri,
		out.diagnostics.map((error) => {
			return new Diagnostic(
				new Range(
					error.loc.startLine,
					error.loc.startCharacter,
					error.loc.endLine,
					error.loc.endCharacter,
				),
				error.message,
				DiagnosticSeverity.Error,
			);
		}),
	);
};
