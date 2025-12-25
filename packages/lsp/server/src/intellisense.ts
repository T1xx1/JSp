import { CompletionItem, CompletionItemKind } from 'vscode-languageserver';

type Item = Omit<CompletionItem, 'data' | 'detail' | 'documentation'> &
	Partial<Pick<CompletionItem, 'detail' | 'documentation'>>;

const intellisense = new Map<CompletionItem['data'], Item>([
	[
		240,
		{
			kind: CompletionItemKind.Operator,
			label: '|>',
			detail: 'Pipeline operator',
		},
	],
]);
const intellisenseOptimized = [...intellisense.entries()].map(([k, v]) => {
	return {
		data: k,
		kind: v.kind,
		label: v.label,
	};
});

export const getIntellisense = (): CompletionItem[] => {
	return intellisenseOptimized;
};

export const getIntellisenseItemInfo = (item: CompletionItem): CompletionItem => {
	const i = intellisense.get(item.data)!;

	if (!i.detail) {
		item.detail = i.label;
	}
	if (!i.documentation) {
		item.documentation = i.label;
	}

	return item;
};
