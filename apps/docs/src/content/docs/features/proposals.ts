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
		title: 'Temporal',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 3,
				link: 'https://github.com/tc39/proposal-temporal',
			},
		},
	},
	{
		title: 'Legacy RegExp features',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 3,
				link: 'https://github.com/tc39/proposal-regexp-legacy-features',
			},
		},
	},
	{
		title: 'Explicit resource management (using)',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 3,
				link: 'https://github.com/tc39/proposal-explicit-resource-management',
			},
		},
	},
	{
		title: 'Source phase imports',
		proposalType: 'Runtime',
		support: {
			tc39: {
				value: true,
				stage: 3,
				link: 'https://github.com/tc39/proposal-source-phase-imports',
			},
		},
	},
	{
		title: 'Deferring module evaluation (import defer)',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 3,
				link: 'https://github.com/tc39/proposal-defer-import-eval',
			},
		},
	},
	{
		title: 'Dynamic code brand checks (eval checks)',
		proposalType: 'Runtime',
		support: {
			tc39: {
				value: true,
				stage: 3,
				link: 'https://github.com/tc39/proposal-dynamic-code-brand-checks',
			},
		},
	},
	{
		title: 'Atomic.pause (Task)',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 3,
				link: 'https://github.com/tc39/proposal-atomics-microwait',
			},
		},
	},
	{
		title: 'Joint iteration',
		proposalType: 'Runtime',
		support: {
			tc39: {
				value: true,
				stage: 3,
				link: 'https://github.com/tc39/proposal-joint-iteration',
			},
		},
	},
	{
		title: 'Non-extensible applies to private',
		proposalType: 'Runtime',
		support: {
			tc39: {
				value: true,
				stage: 3,
				link: 'https://github.com/tc39/proposal-nonextensible-applies-to-private',
			},
		},
	},
	{
		title: 'ShadowRealm',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 2.7,
				link: 'https://github.com/tc39/proposal-shadowrealm',
			},
		},
	},
	{
		title: 'ESM module phase imports (workers import defer)',
		proposalType: 'Runtime',
		support: {
			tc39: {
				value: true,
				stage: 2.7,
				link: 'https://github.com/tc39/proposal-esm-phase-imports',
			},
		},
	},
	{
		title: 'Immutable ArrayBuffers',
		proposalType: 'Runtime',
		support: {
			tc39: {
				value: true,
				stage: 2.7,
				link: 'https://github.com/tc39/proposal-immutable-arraybuffer',
			},
		},
	},
	{
		title: 'Iterator chunking',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 2.7,
				link: 'https://github.com/tc39/proposal-iterator-chunking',
			},
		},
	},
	{
		title: 'Import bytes',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 2.7,
				link: 'https://github.com/tc39/proposal-import-bytes',
			},
		},
	},
	{
		title: 'Await dictionaries (Promise.allKeyed)',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 2.7,
				link: 'https://github.com/tc39/proposal-await-dictionary',
			},
		},
	},
	{
		title: 'Iterator join',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 2.7,
				link: 'https://github.com/tc39/proposal-iterator-join',
			},
		},
	}
];

export const parseProposals = (proposals: Proposal[]): Page[] => {
	return proposals.map((proposal) => {
		return {
			frontmatter: {
				...proposal,
				support: {
					...proposal.support,
					jsp: {
						value: false,
					},
				},
			},
			url: null,
		};
	});
};
