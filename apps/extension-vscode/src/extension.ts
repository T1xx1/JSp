import { type ExtensionContext } from 'vscode';

import { initLanguageFeatures } from './language/index.js';

export function activate(ctx: ExtensionContext): void {
	initLanguageFeatures(ctx);
}

export function deactivate(): void {}
