import { type ExtensionContext } from 'vscode';

import { initDiagnosticsProvider } from './language/diagnostics.js';

export function activate(ctx: ExtensionContext): void {
	initDiagnosticsProvider(ctx);
}

export function deactivate(): void {}
