import {
	createConnection,
	TextDocuments,
	ProposedFeatures,
	CompletionItem,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	DocumentDiagnosticReportKind,
	type DocumentDiagnosticReport,
	type InitializeResult,
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';
import { getIntellisense, getIntellisenseItemInfo } from './intellisense';
import { getDiagnostics } from './diagnostics';

const connection = createConnection(ProposedFeatures.all);

const documents = new TextDocuments(TextDocument);

/* Initialization */
connection.onInitialize(() => {
	const result: InitializeResult = {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
			completionProvider: {
				resolveProvider: true,
			},
			diagnosticProvider: {
				interFileDependencies: false,
				workspaceDiagnostics: false,
			},
		},
	};

	return result;
});

/* Diagnostics */
connection.languages.diagnostics.on(async (params) => {
	const document = documents.get(params.textDocument.uri);
	if (document !== undefined) {
		return {
			kind: DocumentDiagnosticReportKind.Full,
			items: await getDiagnostics(document),
		} satisfies DocumentDiagnosticReport;
	} else {
		// We don't know the document. We can either try to read it from disk
		// or we don't report problems for it.
		return {
			kind: DocumentDiagnosticReportKind.Full,
			items: [],
		} satisfies DocumentDiagnosticReport;
	}
});

documents.onDidChangeContent(async (change) => {
	await getDiagnostics(change.document);
});

/* Intellisense */
connection.onCompletion((_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
	return getIntellisense();
});
connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
	return getIntellisenseItemInfo(item);
});

/* Listeners */
documents.listen(connection);
connection.listen();
