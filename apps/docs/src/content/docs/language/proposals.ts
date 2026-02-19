import type { Page } from './types';

type Proposal = Omit<Page['frontmatter'], 'lastUpdated'>;

const parseProposals = (proposals: Proposal[]): Page[] => {
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

const runtimePs: Proposal[] = [
	{
		title: 'String dedent',
		proposalType: 'Runtime',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-string-dedent',
			},
			corejs: {
				value: true,
				link: 'https://core-js.io/docs/features/proposals/string-dedent',
			},
			civet: {
				value: true,
				link: 'https://civet.dev/reference#triple-quoted-strings',
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
		title: 'Joint iteration',
		proposalType: 'Runtime',
		support: {
			tc39: {
				value: true,
				stage: 3,
				link: 'https://github.com/tc39/proposal-joint-iteration',
			},
			corejs: {
				value: true,
				link: 'https://core-js.io/docs/features/proposals/joint-iteration',
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
		title: 'Dynamic import host adjustment',
		proposalType: 'Runtime',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-dynamic-import-host-adjustment',
			},
		},
	},
	{
		title: 'Module expressions',
		proposalType: 'Runtime',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-module-expressions',
			},
		},
	},
	{
		title: 'Import text',
		proposalType: 'Runtime',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-import-text',
			},
		},
	},
	{
		title: 'Jobcallback module',
		proposalType: 'Runtime',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-jobcallback-module',
			},
		},
	},
	{
		title: 'Change Number.parseInt/parseFloat not to coerce null/undefined/NaN',
		proposalType: 'Runtime',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: '',
			},
		},
	},
	{
		title: 'Inspector',
		proposalType: 'Runtime',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-inspector',
			},
		},
	},
	{
		title: 'Compare strings by codepoint',
		proposalType: 'Runtime',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-compare-strings-by-codepoint',
			},
			corejs: {
				value: true,
				link: 'https://core-js.io/docs/features/proposals/string-prototype-codepoints',
			},
		},
	},
	{
		title: 'Secure ES',
		proposalType: 'Runtime',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-ses',
			},
		},
	},
	{
		title: 'Binary AST',
		proposalType: 'Runtime',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-binary-ast',
			},
		},
	},
	{
		title: 'Date.parse uniform parsin',
		proposalType: 'Runtime',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-uniform-interchange-date-parsing',
			},
		},
	},
	{
		title: 'Compartments',
		proposalType: 'Runtime',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-compartments',
			},
		},
	},
	{
		title: 'Function Memoization',
		proposalType: 'Runtime',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-function-memo',
			},
		},
	},
	{
		title: 'Date.parse fallback semantics',
		proposalType: 'Runtime',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/tc39/proposal-date-time-string-format',
			},
		},
	},
];
export const runtimeProposals = parseProposals(runtimePs);

const syntaxPs: Proposal[] = [
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
		title: 'Module declarations (module blocks)',
		proposalType: 'Syntax',
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
			corejs: {
				value: true,
				link: 'https://core-js.io/docs/features/proposals/symbol-custommatcher-pattern-matching',
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
		title: 'Explicit resource management (using)',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 3,
				link: 'https://github.com/tc39/proposal-explicit-resource-management',
			},
			mdn: {
				value: true,
				link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/using',
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
		title: 'Atomic.pause (Task)',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 3,
				link: 'https://github.com/tc39/proposal-atomics-microwait',
			},
			mdn: {
				value: true,
				link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics/pause',
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
		title: 'Import sync',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-import-sync',
			},
		},
	},
	{
		title: 'Function implementation hiding proposal (hide source directive)',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-function-implementation-hiding',
			},
		},
	},
	{
		title: 'RegExp buffer boundaries',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-regexp-buffer-boundaries',
			},
		},
	},
	{
		title: 'Seeded pseudo random numbers',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-seeded-random',
			},
		},
	},
	{
		title: 'Deferred re-exports (export defer)',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-deferred-reexports',
			},
		},
	},
	{
		title: 'Exctractors',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-extractors',
			},
			corejs: {
				value: true,
				link: 'https://core-js.io/docs/features/proposals/symbol-custommatcher-for-extractors',
			},
		},
	},
	{
		title: 'Structs',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-structs',
			},
		},
	},
	{
		title: 'Composable accessors (@memoized, @validate, @normalize)',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-composable-accessors',
			},
		},
	},
	{
		title: 'Alias accessors (alias)',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-alias-accessors',
			},
		},
	},
	{
		title: 'Slice notation',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-slice-notation',
			},
		},
	},
	{
		title: 'Decimal',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-decimal',
			},
		},
	},
	{
		title: 'RegExp \\R Escape',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-regexp-r-escape',
			},
		},
	},
	{
		title: 'RegExp Atomic Operators',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-regexp-atomic-operators',
			},
		},
	},
	{
		title: 'Negated in and instanceof operators',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-negated-in-instanceof',
			},
		},
	},
	{
		title: 'Enums',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-enum',
			},
		},
	},
	{
		title: 'Function bind syntax (::)',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 0,
				link: 'https://github.com/tc39/proposal-bind-operator',
			},
			babel: {
				value: true,
				link: 'https://babeljs.io/docs/babel-plugin-proposal-function-bind',
			},
		},
	},
	{
		title: 'as destructuring patterns',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 0,
				link: 'https://github.com/zkat/proposal-as-patterns',
			},
		},
	},
	{
		title: 'from ... import',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/bmeck/proposal-from-import',
			},
		},
	},
	{
		title: 'String.prototype.at',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/mathiasbynens/String.prototype.at',
			},
		},
	},
	{
		title: 'deprecated',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/jasnell/proposal-deprecated',
			},
		},
	},
	{
		title: 'use module',
		proposalType: 'Syntax',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/tc39/proposal-modules-pragma',
			},
		},
	},
];
export const syntaxProposals = parseProposals(syntaxPs);

const polyfillPs: Proposal[] = [
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
		title: 'Representing amounts',
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
		title: 'Temporal',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 3,
				link: 'https://github.com/tc39/proposal-temporal',
			},
			mdn: {
				value: true,
				link: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal',
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
		title: 'Iterator join',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 2.7,
				link: 'https://github.com/tc39/proposal-iterator-join',
			},
		},
	},
	{
		title: 'Collection (coerceKey, coerceValue)',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-collection-normalization',
			},
		},
	},
	{
		title: 'Reflect.isTemplateObject',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-array-is-template-object',
			},
			corejs: {
				value: true,
				link: 'https://core-js.io/docs/features/proposals/array-istemplateobject',
			},
		},
	},
	{
		title: 'Async iterator helpers',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-async-iterator-helpers',
			},
			corejs: {
				value: true,
				link: 'https://core-js.io/docs/features/proposals/asynciterator-helpers',
			},
		},
	},
	{
		title: 'Symbol predicates',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-symbol-predicates',
			},
			corejs: {
				value: true,
				link: 'https://core-js.io/docs/features/proposals/symbol-predicates',
			},
		},
	},
	{
		title: 'JSON.parseImmutable',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-json-parseimmutable',
			},
		},
	},
	{
		title: 'Object.keysLength',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-object-keys-length',
			},
		},
	},
	{
		title: 'Error.captureStackTrace',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-error-capturestacktrace',
			},
		},
	},
	{
		title: 'Error stack accessor',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-error-stack-accessor',
			},
		},
	},
	{
		title: 'Async context',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-async-context',
			},
		},
	},
	{
		title: 'Iterator range (range)',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 2,
				link: 'https://github.com/tc39/proposal-iterator.range',
			},
			corejs: {
				value: true,
				link: 'https://core-js.io/docs/features/proposals/iterator-range',
			},
		},
	},
	{
		title: 'Error option limit',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-error-limit-option',
			},
		},
	},
	{
		title: 'Error frames above',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-error-frames-above',
			},
		},
	},
	{
		title: 'TypedArray find within',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-typedarray-findwithin',
			},
		},
	},
	{
		title: 'TypeArray concat',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-typedarray-concat',
			},
		},
	},
	{
		title: 'Observable',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-observable',
			},
			corejs: {
				value: true,
				link: 'https://core-js.io/docs/features/proposals/observable',
			},
		},
	},
	{
		title: 'Collections of/from',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-setmap-offrom',
			},
			corejs: {
				value: true,
				link: 'https://core-js.io/docs/features/proposals/of-and-from-methods-on-collections',
			},
		},
	},
	{
		title: 'Cancellation API',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-cancellation',
			},
		},
	},
	{
		title: 'String.prototype.codePoints',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-string-prototype-codepoints',
			},
		},
	},
	{
		title: 'Object.freeze + Object.seal syntax',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-object-freeze-seal-syntax',
			},
		},
	},
	{
		title: '{BigInt,Number}.fromString',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-number-fromstring',
			},
			corejs: {
				value: true,
				link: 'https://core-js.io/docs/features/proposals/number-from-string',
			},
		},
	},
	{
		title: 'Collection methods',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-collection-methods',
			},
			corejs: {
				value: true,
				link: 'https://core-js.io/docs/features/proposals/new-collections-methods',
			},
		},
	},
	{
		title: 'Richer Keys (compositeKey, compositeSymbol)',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-richer-keys',
			},
			corejs: {
				value: true,
				link: 'https://core-js.io/docs/features/proposals/compositekey-compositesymbol',
			},
		},
	},
	{
		title: 'Built In Modules (aka JS Standard Library)',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-built-in-modules',
			},
		},
	},
	{
		title: 'new.initialize',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/littledan/proposal-new-initialize',
			},
		},
	},
	{
		title: 'Array filtering',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-array-filtering',
			},
			corejs: {
				value: true,
				link: 'https://core-js.io/docs/features/proposals/array-filtering',
			},
		},
	},
	{
		title: 'Array Equality',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-array-equality',
			},
		},
	},
	{
		title: 'Array.prototype.unique()',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-array-unique',
			},
			corejs: {
				value: true,
				link: 'https://core-js.io/docs/features/proposals/array-deduplication',
			},
		},
	},
	{
		title: 'String.cooked',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-string-cooked',
			},
			corejs: {
				value: true,
				link: 'https://core-js.io/docs/features/proposals/string-cooked',
			},
		},
	},
	{
		title: 'Object pick/omit',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-object-pick-or-omit',
			},
		},
	},
	{
		title: 'Signals',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-signals',
			},
		},
	},
	{
		title: 'Array.zip and Array.zipKeyed',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-array-zip',
			},
		},
	},
	{
		title: 'Bulk-add array elements',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-bulk-add-array-elements',
			},
		},
	},
	{
		title: 'Object.getNonIndexStringProperties()',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-array-get-non-index-string-properties',
			},
		},
	},
	{
		title: 'Reflect.{isCallable,isConstructor}',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 0,
				link: 'https://github.com/caitp/TC39-Proposals/blob/HEAD/tc39-reflect-isconstructor-iscallable.md',
			},
			corejs: {
				value: true,
				link: 'https://core-js.io/docs/features/proposals/function-prototype-demethodize',
			},
		},
	},
	{
		title: '{Set,Map}.prototype.toJSON',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/DavidBruant/Map-Set.prototype.toJSON',
			},
		},
	},
	{
		title: 'Builtins.typeOf() and Builtins.is()',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/jasnell/proposal-istypes',
			},
		},
	},
	{
		title: 'ArrayBuffer.prototype.transfer',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/domenic/proposal-arraybuffer-transfer',
			},
		},
	},
	{
		title: 'Symbol.thenable',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/devsnek/proposal-symbol-thenable',
			},
		},
	},
	{
		title: 'Math Extensions',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/rwaldron/proposal-math-extensions',
			},
			other: {
				value: true,
				link: 'https://github.com/rwaldron/proposal-math-extensions',
			},
		},
	},
	{
		title: 'Math.signbit: IEEE-754 sign bit',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/tc39/proposal-Math.signbit',
			},
		},
	},
	{
		title: 'Function.prototype.demethodize',
		proposalType: 'Polyfill',
		support: {
			tc39: {
				value: true,
				stage: 0,
				link: '',
			},
			corejs: {
				value: true,
				link: 'https://core-js.io/docs/features/proposals/function-prototype-demethodize',
			},
		},
	},
];
export const polyfillProposals = parseProposals(polyfillPs);

const unTypedPs: Proposal[] = [
	{
		title: 'Error stacks',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-error-stacks',
			},
		},
	},
	{
		title: 'First-class protocols',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-first-class-protocols',
			},
		},
	},
	{
		title: 'Block Params',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/samuelgoto/proposal-block-params',
			},
		},
	},
	{
		title: 'Maximally minimal mixins',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-mixins',
			},
		},
	},
	{
		title: 'Module Keys',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-module-keys',
			},
		},
	},
	{
		title: 'class Access Expressions',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-class-access-expressions',
			},
		},
	},
	{
		title: 'Dynamic Modules',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/nodejs/dynamic-modules',
			},
		},
	},
	{
		title: 'IDL for ECMAScript',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-idl',
			},
		},
	},
	{
		title: 'Asset References',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-asset-references',
			},
		},
	},
	{
		title: 'Freezing prototypes',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-freeze-prototype',
			},
		},
	},
	{
		title: 'Private declarations',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-private-declarations',
			},
		},
	},
	{
		title: 'Emitter',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-emitter',
			},
		},
	},
	{
		title: 'Reverse iteration',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-reverseIterator',
			},
		},
	},
	{
		title: 'Declarations in Conditionals',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-Declarations-in-Conditionals',
			},
		},
	},
	{
		title: 'Readonly Collections',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-readonly-collections',
			},
		},
	},
	{
		title: 'Support for Distributed Promise Pipelining',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-eventual-send',
			},
		},
	},
	{
		title: 'Wavy Dot: Syntactic Support for Promise Pipelining',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-wavy-dot',
			},
		},
	},
	{
		title: 'OOM Fails Fast',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-oom-fails-fast',
			},
		},
	},
	{
		title: 'Async initialization',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://docs.google.com/presentation/d/1DsjZAzBjn2gCrr4l0uZzCymPIWZTKM8KzcnMBF31HAg/edit#slide=id.g7d23d45064_0_196',
			},
		},
	},
	{
		title: 'Preserve Host Virtualizability',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-preserve-virtualizability',
			},
		},
	},
	{
		title: 'Legacy reflection features for functions in JavaScript',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/claudepache/es-legacy-function-reflection',
			},
		},
	},
	{
		title: 'Cryptographically Secure Random Number Generation',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-csprng',
			},
		},
	},
	{
		title: 'Deep Path Properties in Record Literals',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-deep-path-properties-for-record',
			},
		},
	},
	{
		title: 'Restrict subclassing support in built-in methods',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-rm-builtin-subclassing',
			},
		},
	},
	{
		title: 'await operations',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-await.ops',
			},
		},
	},
	{
		title: 'Double-Ended Iterator and Destructuring',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-deiter',
			},
		},
	},
	{
		title: 'Standardized Debug',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-standardized-debug',
			},
		},
	},
	{
		title: 'Modulus and Additional Integer Math',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-integer-and-modulus-math',
			},
		},
	},
	{
		title: 'Extensions',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-extensions',
			},
		},
	},
	{
		title: 'Grouped Accessors and Auto-Accessors',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-grouped-and-auto-accessors',
			},
		},
	},
	{
		title: 'Class Brand Checks',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-class-brand-check',
			},
		},
	},
	{
		title: 'Limited ArrayBuffer',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-limited-arraybuffer',
			},
		},
	},
	{
		title: 'BigInt Math',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-bigint-math',
			},
		},
	},
	{
		title: 'Get Intrinsic',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-get-intrinsic',
			},
		},
	},
	{
		title: 'Call-this operator',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-call-this',
			},
		},
	},
	{
		title: 'RegExp Extended Mode and Comments',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-regexp-x-mode',
			},
		},
	},
	{
		title: 'Reversible string split',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-reversible-string-split',
			},
		},
	},
	{
		title: 'Function once',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-function-once',
			},
		},
	},
	{
		title: 'Faster Promise adoption',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-faster-promise-adoption',
			},
		},
	},
	{
		title: 'Policy Maps and Sets',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-policy-map-set',
			},
		},
	},
	{
		title: 'Mass Proxy Revocation',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-mass-proxy-revocation',
			},
		},
	},
	{
		title: 'Prototype pollution mitigation',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-symbol-proto',
			},
		},
	},
	{
		title: 'Class Method Parameter Decorators',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-class-method-parameter-decorators',
			},
		},
	},
	{
		title: 'Optional chaining in assignment LHS',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-optional-chaining-assignment',
			},
		},
	},
	{
		title: 'DataView get/set Uint8Clamped methods',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-dataview-get-set-uint8clamped',
			},
			corejs: {
				value: true,
				link: 'https://core-js.io/docs/features/proposals/dataview-get-set-uint8clamped',
			},
		},
	},
	{
		title: 'Stable Formatting',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-stable-formatting',
			},
		},
	},
	{
		title: 'Locale Extensions',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/ben-allen/locale-extensions',
			},
		},
	},
	{
		title: 'Module sync assert',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-module-sync-assert',
			},
		},
	},
	{
		title: 'Iterator unique',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-iterator-unique',
			},
		},
	},
	{
		title: 'Improved Escapes for Template Literals',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-improve-template-literals',
			},
		},
	},
	{
		title: 'Function and Object Literal Decorators',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-function-and-object-literal-element-decorators',
			},
		},
	},
	{
		title: "Strict Enforcement of 'using'",
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-using-enforcement',
			},
		},
	},
	{
		title: 'Concurrency Control',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-concurrency-control',
			},
		},
	},
	{
		title: 'Unordered Async Iterator Helpers',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-unordered-async-iterator-helpers',
			},
		},
	},
	{
		title: 'Stabilize',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-stabilize',
			},
		},
	},
	{
		title: 'Curtailing the power of "Thenables"',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-thenable-curtailment',
			},
		},
	},
	{
		title: 'Disposable AsyncContext.Variable',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/tc39/proposal-async-context-disposable',
			},
		},
	},
	{
		title: 'Module Global',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 1,
				link: 'https://github.com/endojs/proposal-new-global',
			},
		},
	},
	{
		title: 'Additional metaproperties',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 0,
				link: 'https://github.com/allenwb/ESideas/blob/HEAD/ES7MetaProps.md',
			},
		},
	},
	{
		title: 'Defensible Classes',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 0,
				link: 'https://web.archive.org/web/20160804042547/http://wiki.ecmascript.org/doku.php?id=strawman:defensible_classes',
			},
		},
	},
	{
		title: 'Function expression decorators',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 0,
				link: 'https://goo.gl/8MmCMG',
			},
		},
	},
	{
		title: 'Method parameter decorators',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 0,
				link: 'https://goo.gl/r1XT9b',
			},
		},
	},
	{
		title: 'Nested import declarations',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 0,
				link: 'https://github.com/benjamn/reify/blob/HEAD/PROPOSAL.md',
			},
		},
	},
	{
		title: 'Orthogonal Classes',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 0,
				link: 'https://github.com/erights/Orthogonal-Classes',
			},
		},
	},
	{
		title: 'Relationships',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 0,
				link: 'https://web.archive.org/web/20160804042554/http://wiki.ecmascript.org/doku.php?id=strawman:relationships',
			},
		},
	},
	{
		title: 'Structured Clone',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 0,
				link: 'https://github.com/dslomov/ecmascript-structured-clone',
			},
		},
	},
	{
		title: 'Object Shorthand Improvements',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 0,
				link: 'https://github.com/rbuckton/proposal-shorthand-improvements',
			},
		},
	},
	{
		title: 'String trim characters',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 0,
				link: 'https://github.com/Kingwl/proposal-string-trim-characters',
			},
		},
	},
	{
		title: 'Catch Guard',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 0,
				link: 'https://github.com/wmsbill/proposal-catch-guards',
			},
		},
	},
	{
		title: 'Callable class constructors',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/tc39/ecma262/blob/93183b81cb03116b75019615d148b5f788e70edf/workingdocs/callconstructor.md',
			},
		},
	},
	{
		title: 'Typed Objects',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/tschneidereit/proposal-typed-objects',
			},
		},
	},
	{
		title: 'Object enumerables',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/leobalter/object-enumerables',
			},
		},
	},
	{
		title: 'Cancelable Promises',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/tc39/proposal-cancelable-promises',
			},
		},
	},
	{
		title: 'Proposed Grammar change to ES Modules',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/tc39/proposal-UnambiguousJavaScriptGrammar',
			},
		},
	},
	{
		title: 'Dynamic Module Reform',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/tc39/proposal-dynamic-modules',
			},
		},
	},
	{
		title: 'SIMD.JS - SIMD APIs',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/tc39/ecmascript_simd/',
			},
		},
	},
	{
		title: 'Updates to Tail Calls to include an explicit syntactic opt-in',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/tc39/proposal-ptc-syntax',
			},
		},
	},
	{
		title: 'Object.shallowEqual',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/sebmarkbage/ecmascript-shallow-equal',
			},
		},
	},
	{
		title: '%constructor%.construct',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/jasnell/proposal-construct',
			},
		},
	},
	{
		title: 'Tagged Collection Literals',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/zkat/proposal-collection-literals',
			},
		},
	},
	{
		title: 'Distinguishing literal strings',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/mikewest/tc39-proposal-literals',
			},
		},
	},
	{
		title: 'Annex B — HTML Attribute Event Handlers',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: '',
			},
		},
	},
	{
		title: 'Normative ICU Reference',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/tc39/notes/blob/HEAD/meetings/2017-05/may-23.md#normative-icu-reference',
			},
		},
	},
	{
		title: 'Zones',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/domenic/zones',
			},
		},
	},
	{
		title: 'Blöcks',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/domenic/proposal-blocks',
			},
		},
	},
	{
		title: 'RegExp Atomic Groups &amp; Possessive Quantifiers',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/jridgewell/proposal-regexp-atomic-and-possessive',
			},
		},
	},
	{
		title: 'RefCollection',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/rricard/proposal-refcollection/',
			},
		},
	},
	{
		title: 'Generic Comparison',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/hemanth/proposal-generic-comparison',
			},
		},
	},
	{
		title: 'TypedArray stride parameter',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/tc39/proposal-typedarray-stride',
			},
		},
	},
	{
		title: 'Unused Function Parameters',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/devsnek/proposal-unused-function-parameters',
			},
		},
	},
	{
		title: 'Improving iteration on Objects',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/tc39/proposal-object-iteration',
			},
		},
	},
	{
		title: 'Function helpers',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/tc39/proposal-function-helpers',
			},
		},
	},
	{
		title: 'Function.pipe and flow',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/tc39/proposal-function-pipe-flow',
			},
		},
	},
	{
		title: 'WeakRefs cleanupSome',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/tc39/proposal-cleanup-some',
			},
		},
	},
	{
		title: 'Operator overloading',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/tc39/proposal-operator-overloading',
			},
		},
	},
	{
		title: 'Extensible numeric literals',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/tc39/proposal-extended-numeric-literals',
			},
		},
	},
	{
		title: 'JSON.tryParse',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/Jack-Works/proposal-json-tryParse',
			},
		},
	},
	{
		title: 'UUID',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/tc39/proposal-uuid',
			},
		},
	},
	{
		title: 'Generator arrow functions',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/tc39/proposal-generator-arrow-functions',
			},
		},
	},
	{
		title: 'Sequence properties in Unicode property escapes',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/tc39/proposal-regexp-unicode-sequence-properties',
			},
		},
	},
	{
		title: 'Record & Tuple',
		proposalType: '',
		support: {
			tc39: {
				value: true,
				stage: 'Inactive',
				link: 'https://github.com/tc39/proposal-record-tuple',
			},
		},
	},
];

export const unTypedProposals = parseProposals(unTypedPs);
