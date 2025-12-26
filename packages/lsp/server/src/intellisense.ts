import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

import { tslsp } from './tslsp';
import { path } from './utils';

const intellisense: CompletionItem[] = [
	{
		kind: CompletionItemKind.Operator,
		label: '|>',
		detail: 'Pipeline operator',
		data: {
			id: '240',
		},
	},
];

export const getIntellisense = (uri: string, offset: number): CompletionItem[] => {
	const tsCompletisions = tslsp.getCompletionsAtPosition(path(uri), offset, undefined);

	return [
		...(!tsCompletisions
			? []
			: tsCompletisions.entries.map((completition) => {
					let kind: CompletionItemKind;

					switch (completition.kind) {
						case 'const': {
							kind = CompletionItemKind.Constant;
						}
						case 'keyword': {
							kind = CompletionItemKind.Keyword;
						}
						case 'var': {
							kind = CompletionItemKind.Variable;
						}
						case 'module': {
							kind = CompletionItemKind.Module;
						}
						default: {
							kind = CompletionItemKind.Text;
						}
					}

					return {
						kind: kind,
						label: completition.name,
						labelDetails: completition.labelDetails,
						data: {
							id: `typescript-${completition.name}`,
						},
					};
			  })),
		...intellisense.map((completition) => {
			return {
				...completition,
				data: {
					id: completition.data.id,
				},
			};
		}),
	];
};

export const getIntellisenseItemInfo = (item: CompletionItem): CompletionItem => {
	return item;
};
