import * as vscode from 'vscode';

import { analyze } from './diagnostics.js';

export function activate(ctx: vscode.ExtensionContext): void {
	/* diagnostics */
	const diagnosticsCollection = vscode.languages.createDiagnosticCollection('jsp');

	if (vscode.window.activeTextEditor) {
		analyze(vscode.window.activeTextEditor.document, diagnosticsCollection);
	}

	/* init diagnostics */
	vscode.workspace.textDocuments.forEach((document: vscode.TextDocument) => {
		analyze(document, diagnosticsCollection);
	});

	/* diagnostics listener */
	ctx.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
			analyze(e.document, diagnosticsCollection);
		}),
	);
}

export function deactivate(): void {}
