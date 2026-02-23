import {
	languages,
	FoldingRange,
	FoldingRangeKind,
	type ExtensionContext,
	type TextDocument,
} from 'vscode';

const provideFoldingRanges = (document: TextDocument): FoldingRange[] => {
	if (document.languageId !== 'jsp') {
		return [];
	}

	const ranges: FoldingRange[] = [];
	const stack: number[] = [];

	for (let i = 0; i < document.lineCount; i++) {
		const openFold = () => {
			stack.push(i);
		};
		const closeFold = () => {
			const start = stack.pop()!;

			ranges.push(new FoldingRange(start, i - 1, FoldingRangeKind.Region));
		};

		const line = document.lineAt(i).text;

		const openBracket = line.indexOf('{');
		const closeBracket = line.indexOf('}');

		/* { */
		if (openBracket !== -1 && closeBracket === -1) {
			openFold();
		}
		/* { } / } { */
		if (openBracket !== -1 && closeBracket !== -1) {
			if (openBracket < closeBracket) {
				openFold();
				closeFold();
			} else {
				closeFold();
				openFold();
			}
		}
		/* } */
		if (openBracket === -1 && closeBracket !== -1) {
			closeFold();
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
