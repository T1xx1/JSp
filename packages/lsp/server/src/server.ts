import { fileURLToPath } from 'node:url';
import {
	createConnection,
	TextDocuments,
	ProposedFeatures,
	CompletionItem,
	TextDocumentPositionParams,
	TextDocumentSyncKind,
	DocumentDiagnosticReportKind,
	type DocumentDiagnosticReport,
} from 'vscode-languageserver/node';
import { TextDocument } from 'vscode-languageserver-textdocument';

import { getIntellisense, getIntellisenseItemInfo } from './intellisense';
import { getDiagnostics } from './diagnostics';

const connection = createConnection(ProposedFeatures.all);

const editor = new TextDocuments(TextDocument);

const files = new Map<
	string,
	{
		version: number;
		content: string;
	}
>();

export const setFile = (document: TextDocument) => {
	files.set(fileURLToPath(document.uri).replaceAll('\\', '/').toLowerCase(), {
		version: document.version,
		content: document.getText(),
	});
};
export const hasFile = (filename: string) => {
	return files.has(filename);
};
export const getFile = (filename: string) => {
	return files.get(filename);
};
export const getFiles = () => {
	return files;
};

/* Initialization */
connection.onInitialize(() => {
	return {
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
});

/* Diagnostics */
connection.languages.diagnostics.on(async (params): Promise<DocumentDiagnosticReport> => {
	const document = editor.get(params.textDocument.uri);

	if (!document) {
		return {
			kind: DocumentDiagnosticReportKind.Full,
			items: [],
		};
	}

	setFile(document);

	return {
		kind: DocumentDiagnosticReportKind.Full,
		items: await getDiagnostics(document),
	};
});

editor.onDidChangeContent(async ({ document }) => {
	setFile(document);

	await getDiagnostics(document);
});

/* Intellisense */
connection.onCompletion((textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
	const document = editor.get(textDocumentPosition.textDocument.uri);

	if (!document) {
		return [];
	}

	return getIntellisense(
		textDocumentPosition.textDocument.uri,
		document.offsetAt(textDocumentPosition.position)
	);
});
connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
	return getIntellisenseItemInfo(item);
});

/* Listeners */
editor.listen(connection);
connection.listen();
