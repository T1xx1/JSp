import { ExtensionContext } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind,
} from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	const serverModule = context.asAbsolutePath('./server/out/server.js');

	const serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
		},
	};

	const clientOptions: LanguageClientOptions = {
		documentSelector: [
			{
				scheme: 'file',
				language: 'JS+',
			},
		],
	};

	client = new LanguageClient(
		'JS+ LSP',
		'JS+ language server',
		serverOptions,
		clientOptions
	);

	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return;
	}

	return client.stop();
}
