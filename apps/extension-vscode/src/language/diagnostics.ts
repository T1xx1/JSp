import { compile, type Diagnostic as JspDiagnostic } from '@jsplang/jsp/compiler';
import { completeConfig } from '@jsplang/jsp/config';
import {
	languages,
	workspace,
	Diagnostic,
	DiagnosticSeverity,
	Range,
	type DiagnosticCollection,
	type ExtensionContext,
	type TextDocument,
	type TextDocumentChangeEvent,
} from 'vscode';

const getDiagnosticSeverity = (type: JspDiagnostic['type']): DiagnosticSeverity => {
	switch (type) {
		case 'Error':
			return DiagnosticSeverity.Error;
		case 'Warning':
			return DiagnosticSeverity.Warning;
	}
};

const analyzeDiagnostics = (
	document: TextDocument,
	diagnosticsCollection: DiagnosticCollection,
) => {
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
				`${error.category} • ${error.message}`,
				getDiagnosticSeverity(error.type),
			);
		}),
	);
};

export const initDiagnosticsProvider = (ctx: ExtensionContext): void => {
	const diagnosticsCollection = languages.createDiagnosticCollection('jsp');
	ctx.subscriptions.push(diagnosticsCollection);

	/* init diagnostics */
	workspace.textDocuments.forEach((document: TextDocument) => {
		analyzeDiagnostics(document, diagnosticsCollection);
	});

	/* listen for changes */
	ctx.subscriptions.push(
		workspace.onDidChangeTextDocument((e: TextDocumentChangeEvent) => {
			analyzeDiagnostics(e.document, diagnosticsCollection);
		}),
	);
};
