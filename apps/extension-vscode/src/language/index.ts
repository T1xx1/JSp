import type { ExtensionContext } from 'vscode';

import { initDiagnosticsProvider } from './diagnostics';
import { initFoldingProvider } from './folding';

export const initLanguageFeatures = (ctx: ExtensionContext): void => {
	initDiagnosticsProvider(ctx);

	initFoldingProvider(ctx);
};
