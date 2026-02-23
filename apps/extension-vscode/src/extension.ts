import { type ExtensionContext } from 'vscode';

import { initDiagnosticsProvider } from './language/diagnostics.js';
import { initFoldingProvider } from './language/folding.js';

export function activate(ctx: ExtensionContext): void {
	initDiagnosticsProvider(ctx);
	initFoldingProvider(ctx);
}

export function deactivate(): void {}
