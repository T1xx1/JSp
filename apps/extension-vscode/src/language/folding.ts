import { languages, FoldingRange, type ExtensionContext, type TextDocument } from 'vscode';

const provideFoldingRanges = (document: TextDocument): FoldingRange[] => {
	if (document.languageId !== 'jsp') {
		return [];
	}

	const ranges: FoldingRange[] = [];
	const stack: number[] = [];

	for (let i = 0; i < document.lineCount; i++) {
		const line = document.lineAt(i).text;

		if (/\{/.test(line)) {
			stack.push(i);
		}

		if (/\}/.test(line) && stack[stack.length - 1] !== i) {
			const start = stack.pop()!;

			const end = i;

			if (end > start) {
				ranges.push(new FoldingRange(start, end));
			}
		}
	}

	return ranges;
};

export const initFoldingProvider = (ctx: ExtensionContext): void => {
	ctx.subscriptions.push(
		languages.registerFoldingRangeProvider(
			{ language: 'jsp' },
			{
				provideFoldingRanges,
			},
		),
	);
};
