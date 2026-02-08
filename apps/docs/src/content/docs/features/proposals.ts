import type { Page } from './types';

type Proposal = Omit<Page['frontmatter'], 'lastUpdated'>;

export const proposals: Proposal[] = [
	{
		title: 'Composites',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-composites',
			},
		},
	},
	{
		title: 'Math extensions',
		proposalType: 'Polyfill',
		support: {
			other: {
				value: true,
				link: 'https://github.com/rwaldron/proposal-math-extensions',
			},
		},
	},
	{
		title: 'Function bind (::)',
		proposalType: 'Syntax',
		support: {
			babel: {
				value: true,
				link: 'https://babeljs.io/docs/babel-plugin-proposal-function-bind',
			},
		},
	},
	{
		title: 'Function sent',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-function.sent',
			},
			babel: {
				value: true,
				link: 'https://babeljs.io/docs/babel-plugin-proposal-function-sent',
			},
		},
	},
	{
		title: 'Module blocks',
		proposalType: 'Runtime',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-module-declarations',
			},
			babel: {
				value: true,
				link: 'https://babeljs.io/docs/babel-plugin-syntax-module-blocks',
			},
		},
	},
	{
		title: 'Partial application',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-partial-application',
			},
			babel: {
				value: true,
				link: 'https://babeljs.io/docs/babel-plugin-proposal-partial-application',
			},
		},
	},
	{
		title: 'Destructuring private',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-destructuring-private',
			},
		},
	},
	{
		title: 'Pattern matching (match)',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-pattern-matching',
			},
			civet: {
				value: true,
				link: 'https://civet.dev/reference#pattern-matching',
			},
		},
	},
	{
		title: 'Type annotations',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-type-annotations',
			},
		},
	},
	{
		title: 'Enums',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 0,
				link: 'https://github.com/tc39/proposal-enum',
			},
		},
	},
	{
		title: 'Random functions',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-random-functions',
			},
		},
	},
	{
		title: 'Amounts',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-amount',
			},
		},
	},
	{
		title: 'String dedent',
		proposalType: 'Runtime',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-string-dedent',
			},
			civet: {
				value: true,
				link: 'https://civet.dev/reference#triple-quoted-strings',
			},
		},
	},
	{
		title: 'Rest everywhere (...)',
		proposalType: 'Syntax',
		support: {
			civet: {
				value: true,
				link: 'https://civet.dev/reference#rest',
			},
		},
	},
	{
		support: {
			tc39: {
			},
				value: true,
			},
			},
		},
	}
];
