import type { Page } from './types';

type Proposal = Omit<Page['frontmatter'], 'lastUpdated'>;

export const proposals: Proposal[] = [
	{
		title: 'Composite',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-composites',
			},
			jsp: {
				value: false,
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
			jsp: {
				value: false,
			},
		},
	},
	{
		title: 'Function bind',
		proposalType: 'Syntax',
		support: {
			babel: {
				value: true,
				link: 'https://babeljs.io/docs/babel-plugin-proposal-function-bind',
			},
			jsp: {
				value: false,
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
			jsp: {
				value: false,
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
			jsp: {
				value: false,
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
			jsp: {
				value: false,
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
			jsp: {
				value: false,
			},
		},
	},
	{
		title: 'Pattern matching',
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
			jsp: {
				value: false,
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
			jsp: {
				value: false,
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
			jsp: {
				value: false,
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
			jsp: {
				value: false,
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
			jsp: {
				value: false,
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
			jsp: {
				value: false,
			},
		},
	},
	{
		title: 'Rest everywhere',
		support: {
			tc39: {
				value: false,
			},
			civet: {
				value: true,
				link: 'https://civet.dev/reference#rest',
			},
			jsp: {
				value: false,
			},
		},
	}
];
